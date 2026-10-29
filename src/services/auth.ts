import type { ConfirmationResult, User } from 'firebase/auth';
import { onAuthStateChanged, signInWithPhoneNumber, signOut } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
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
