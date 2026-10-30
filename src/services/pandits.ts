import type { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from '@react-native-firebase/firestore';
import { collection, doc, getDoc, getDocs, limit, query, where } from '@react-native-firebase/firestore';
import { db } from '../firebase';

export type Pandit = {
  id: string;
  name: string;
  city: string;
  specialization: string;
  experience: number;
  languages: string[];
  rating: number;
  ratePerMinute: number;
  availability: 'online' | 'offline';
  bio: string;
};

/** Server-side query options. Text search stays client-side because
 * Firestore has no substring match — see PanditListScreen. */
export type PanditListOptions = {
  /** Exact Firestore `languages` array membership (e.g. 'Hindi'). */
  language?: string;
  /** Rate ceiling in ₹/minute. */
  maxRatePerMinute?: number;
  /** Only currently available pandits. */
  onlyOnline?: boolean;
};

const PAGE_SIZE = 50;

function mapPandit(snapshot: DocumentSnapshot<DocumentData> | QueryDocumentSnapshot<DocumentData>): Pandit {
  const data = snapshot.data() as Record<string, unknown>;
  const ratePerMinute = Number(data.ratePerMinute || 0);
  return {
    id: snapshot.id,
    name: String(data.name || 'Pandit'),
    city: String(data.city || ''),
    specialization: String(data.specialization || ''),
    experience: Number(data.experience || 0),
    languages: Array.isArray(data.languages) ? data.languages.map(String) : [],
    rating: Number(data.rating || 0),
    ratePerMinute,
    availability: data.availability === 'online' ? 'online' as const : 'offline' as const,
    bio: String(data.bio || ''),
  };
}

/** Listing API: approved pandits only, optional language / price / online
 * filters. Server-side we use only equality scopes plus at most one range
 * filter, so no composite index is required; sorting happens client-side. */
export async function fetchPandits(options: PanditListOptions = {}): Promise<Pandit[]> {
  const constraints = [
    where('verificationStatus', '==', 'approved'),
    limit(PAGE_SIZE),
  ];
  if (options.onlyOnline) {
    constraints.unshift(where('availability', '==', 'online'));
  }
  if (options.language) {
    constraints.unshift(where('languages', 'array-contains', options.language));
  }
  if (typeof options.maxRatePerMinute === 'number' && Number.isFinite(options.maxRatePerMinute) && options.maxRatePerMinute > 0) {
    constraints.unshift(where('ratePerMinute', '<=', options.maxRatePerMinute));
  }
  const result = await getDocs(query(collection(db, 'pandits'), ...constraints));
  return result.docs.map(mapPandit).sort((a, b) => b.rating - a.rating);
}

export async function fetchApprovedPandits(): Promise<Pandit[]> {
  return fetchPandits();
}

/** Profile API: a single pandit document. Pending profiles come back too —
 * the caller decides which statuses it wants to show. */
export async function fetchPandit(uid: string): Promise<Pandit | null> {
  const snapshot = await getDoc(doc(db, 'pandits', uid));
  if (!snapshot.exists()) {
    return null;
  }
  return mapPandit(snapshot);
}
