import type { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from '@react-native-firebase/firestore';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@react-native-firebase/firestore';
import { db } from '../firebase';

/** Call states in order — see REQUIREMENTS.md. */
export const CONSULTATION_STATUSES = [
  'REQUESTED',
  'PAYMENT_PENDING',
  'RINGING',
  'ACCEPTED',
  'CONNECTED',
  'ENDED',
  'SETTLED',
] as const;

export type ConsultationStatus = typeof CONSULTATION_STATUSES[number];
export type ConsultationMode = 'chat' | 'audio' | 'video';

export type Consultation = {
  id: string;
  userId: string;
  panditId: string;
  status: ConsultationStatus;
  mode: ConsultationMode;
  amountPaid: number;
  refundAmount: number;
  createdAt: number | null;
  connectedAt: number | null;
  endedAt: number | null;
};

const PAGE_SIZE = 50;
const MAX_MESSAGE_LENGTH = 2000;

function toMillis(value: unknown): number | null {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'object' && value !== null && 'toMillis' in value) {
    try {
      return (value as { toMillis(): number }).toMillis();
    } catch {
      return null;
    }
  }
  return null;
}

function normalizeStatus(value: unknown): ConsultationStatus {
  return (CONSULTATION_STATUSES as readonly string[]).includes(String(value))
    ? value as ConsultationStatus
    : 'REQUESTED';
}

function mapConsultation(snapshot: DocumentSnapshot<DocumentData> | QueryDocumentSnapshot<DocumentData>): Consultation {
  const data = snapshot.data() as Record<string, unknown>;
  return {
    id: snapshot.id,
    userId: String(data.userId || ''),
    panditId: String(data.panditId || ''),
    status: normalizeStatus(data.status),
    mode: data.mode === 'audio' || data.mode === 'video' ? data.mode : 'chat',
    amountPaid: Number(data.amountPaid || 0),
    refundAmount: Number(data.refundAmount || 0),
    createdAt: toMillis(data.createdAt),
    connectedAt: toMillis(data.connectedAt),
    endedAt: toMillis(data.endedAt),
  };
}

function mapMessage(snapshot: DocumentSnapshot<DocumentData> | QueryDocumentSnapshot<DocumentData>) {
  const data = snapshot.data() as Record<string, unknown>;
  return {
    id: snapshot.id,
    senderId: String(data.senderId || ''),
    text: String(data.text || ''),
    type: String(data.type || 'text'),
    createdAt: toMillis(data.createdAt),
    readAt: toMillis(data.readAt),
  };
}

export type ChatMessage = ReturnType<typeof mapMessage> & { readAt: number | null };

/**
 * Opens a consultation. Firestore rules accept a REQUESTED call only when the
 * target pandit exists and is approved, so failures surface as permission
 * errors rather than stale references.
 */
export async function requestConsultation(
  userId: string,
  panditId: string,
  mode: ConsultationMode,
): Promise<string> {
  const reference = await addDoc(collection(db, 'consultations'), {
    userId,
    panditId,
    mode,
    status: 'REQUESTED',
    amountPaid: 0,
    refundAmount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return reference.id;
}

/** Both sides of the call list their consultations. Sorted by creation time,
 * newest first — ordering happens client-side so no composite index is needed. */
export async function fetchConsultations(role: 'user' | 'pandit', uid: string): Promise<Consultation[]> {
  const field = role === 'pandit' ? 'panditId' : 'userId';
  const result = await getDocs(query(
    collection(db, 'consultations'),
    where(field, '==', uid),
    limit(PAGE_SIZE),
  ));
  return result.docs
    .map(mapConsultation)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function fetchConsultation(callId: string): Promise<Consultation | null> {
  const snapshot = await getDoc(doc(db, 'consultations', callId));
  if (!snapshot.exists()) {
    return null;
  }
  return mapConsultation(snapshot);
}

export type ConsultationUpdate = {
  status?: ConsultationStatus;
  connectedAt?: number;
  endedAt?: number;
};

/** Moves the call state machine forward (and only that — rules reject any
 * other field change by a client). Milliseconds are stored as plain numbers;
 * Cloud Functions may later normalize them to Timestamps. */
export async function updateConsultationProgress(
  callId: string,
  update: ConsultationUpdate,
): Promise<void> {
  const patch: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (update.status) {
    patch.status = update.status;
  }
  if (update.connectedAt !== undefined) {
    patch.connectedAt = update.connectedAt;
  }
  if (update.endedAt !== undefined) {
    patch.endedAt = update.endedAt;
  }
  await updateDoc(doc(db, 'consultations', callId), patch);
}

export async function fetchMessages(callId: string): Promise<ChatMessage[]> {
  const result = await getDocs(collection(db, 'consultations', callId, 'messages'));
  return result.docs
    .map(mapMessage)
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
}

export async function sendTextMessage(callId: string, senderId: string, text: string): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) {
    return;
  }
  await addDoc(collection(db, 'consultations', callId, 'messages'), {
    senderId,
    text: trimmed.slice(0, MAX_MESSAGE_LENGTH),
    type: 'text',
    createdAt: serverTimestamp(),
    readAt: null,
  });
}

export async function markMessageRead(callId: string, messageId: string): Promise<void> {
  await updateDoc(doc(db, 'consultations', callId, 'messages', messageId), {
    readAt: serverTimestamp(),
  });
}
