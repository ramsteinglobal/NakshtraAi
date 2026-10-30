import type { ConfirmationResult, User } from '@react-native-firebase/auth';
import { onAuthStateChanged, signInWithPhoneNumber, signOut } from '@react-native-firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from '@react-native-firebase/firestore';
import { auth, db } from '../firebase';
import type { UserRole } from '../types';

export function watchAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function normalizePhoneNumber(input: string): string {
  const trimmed = input.trim().replace(/[\s-]/g, '');
  if (trimmed.startsWith('+')) {
    return trimmed;
  }
  if (trimmed.length === 10) {
    return `+91${trimmed}`;
  }
  return `+${trimmed}`;
}

export function sendOtp(phoneNumber: string): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(auth, normalizePhoneNumber(phoneNumber));
}

export function confirmOtp(confirmation: ConfirmationResult, code: string) {
  return confirmation.confirm(code.trim());
}

export async function fetchRole(uid: string): Promise<UserRole | null> {
  const snapshot = await getDoc(doc(db, 'users', uid));
  if (!snapshot.exists()) {
    return null;
  }
  const role = snapshot.get('role');
  return role === 'user' || role === 'pandit' ? role : null;
}

export type UserProfile = {
  name: string;
  email: string;
  city: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
};

export type PanditProfile = {
  name: string;
  city: string;
  specialization: string;
  experience: string;
  languages: string;
  ratePerMinute: string;
  bio: string;
};

export async function fetchProfileComplete(uid: string, role: UserRole): Promise<boolean> {
  const collection = role === 'pandit' ? 'pandits' : 'users';
  const snapshot = await getDoc(doc(db, collection, uid));
  return snapshot.exists() && snapshot.get('profileComplete') === true;
}

export async function fetchDisplayName(uid: string, role: UserRole): Promise<string> {
  const collection = role === 'pandit' ? 'pandits' : 'users';
  const snapshot = await getDoc(doc(db, collection, uid));
  return snapshot.exists() ? String(snapshot.get('name') || '') : '';
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, 'users', uid));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return {
    name: String(data.name || ''),
    email: String(data.email || ''),
    city: String(data.city || ''),
    birthDate: String(data.birthDate || ''),
    birthTime: String(data.birthTime || ''),
    birthPlace: String(data.birthPlace || ''),
  };
}

export async function fetchPanditProfile(uid: string): Promise<PanditProfile | null> {
  const snapshot = await getDoc(doc(db, 'pandits', uid));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return {
    name: String(data.name || ''),
    city: String(data.city || ''),
    specialization: String(data.specialization || ''),
    experience: String(data.experience ?? ''),
    languages: Array.isArray(data.languages) ? data.languages.join(', ') : String(data.languages || ''),
    ratePerMinute: String(data.ratePerMinute ?? ''),
    bio: String(data.bio || ''),
  };
}

export async function fetchPanditProfileStatus(uid: string): Promise<{ verificationStatus: string; availability: string }> {
  const snapshot = await getDoc(doc(db, 'pandits', uid));
  if (!snapshot.exists()) return { verificationStatus: 'pending', availability: 'offline' };
  return {
    verificationStatus: String(snapshot.get('verificationStatus') || 'pending'),
    availability: String(snapshot.get('availability') || 'offline'),
  };
}

export async function saveUserProfile(uid: string, profile: UserProfile): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    ...profile,
    uid,
    profileComplete: true,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function savePanditProfile(uid: string, profile: PanditProfile): Promise<void> {
  const languages = profile.languages.split(',').map((language) => language.trim()).filter(Boolean);
  const profileRef = doc(db, 'pandits', uid);
  const existing = await getDoc(profileRef);
  await setDoc(profileRef, {
    ...profile,
    uid,
    experience: Number(profile.experience),
    ratePerMinute: Number(profile.ratePerMinute),
    languages,
    ...(!existing.exists() ? { rating: 0, availability: 'offline', verificationStatus: 'approved' } : {}),
    profileComplete: true,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

/**
 * First write of users/{uid}. Firestore rules allow the role only on create,
 * so a signed in account can never promote itself afterwards.
 */
export async function saveRole(uid: string, role: UserRole): Promise<void> {
  await setDoc(
    doc(db, 'users', uid),
    { uid, role, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export function signOutUser(): Promise<void> {
  return signOut(auth);
}

export function authErrorMessage(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code: unknown }).code)
    : '';

  switch (code) {
    case 'auth/invalid-phone-number':
      return 'Enter a valid phone number with country code.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/invalid-verification-code':
      return 'The OTP you entered is incorrect.';
    case 'auth/code-expired':
      return 'This OTP has expired. Request a new one.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and retry.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded. Please try again later.';
    default:
      return error instanceof Error ? error.message : 'Something went wrong. Please retry.';
  }
}
