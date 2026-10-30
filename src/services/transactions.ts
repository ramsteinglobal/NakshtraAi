import type { QueryDocumentSnapshot } from '@react-native-firebase/firestore';
import { collection, getDocs, limit, query, where } from '@react-native-firebase/firestore';
import { db } from '../firebase';

export type Transaction = {
  id: string;
  userId: string;
  panditId: string | null;
  callId: string | null;
  amount: number;
  type: string;
  createdAt: number | null;
};

const PAGE_SIZE = 100;

function mapTransaction(snapshot: QueryDocumentSnapshot): Transaction {
  const data = snapshot.data() as Record<string, unknown>;
  let createdAt: number | null = null;
  if (typeof data.createdAt === 'number') {
    createdAt = data.createdAt;
  } else if (typeof data.createdAt === 'object' && data.createdAt !== null && 'toMillis' in (data.createdAt as object)) {
    createdAt = (data.createdAt as { toMillis(): number }).toMillis();
  }
  return {
    id: snapshot.id,
    userId: String(data.userId || ''),
    panditId: typeof data.panditId === 'string' ? data.panditId : null,
    callId: typeof data.callId === 'string' ? data.callId : null,
    amount: Number(data.amount || 0),
    type: String(data.type || ''),
    createdAt,
  };
}

/** Read-only history for the account. Documents are written by Cloud
 * Functions once Anurag's payment step lands — for now this list stays empty. */
export async function fetchTransactions(userId: string): Promise<Transaction[]> {
  const result = await getDocs(query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    limit(PAGE_SIZE),
  ));
  return result.docs
    .map(mapTransaction)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}
