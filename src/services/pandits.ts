import { collection, getDocs, limit, query, where } from '@react-native-firebase/firestore';
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

export async function fetchApprovedPandits(): Promise<Pandit[]> {
  const q = query(
    collection(db, 'pandits'),
    where('verificationStatus', '==', 'approved'),
    limit(50),
  );
  const result = await getDocs(q);
  return result.docs
    .map((snapshot) => {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        name: String(data.name || 'Pandit'),
        city: String(data.city || ''),
        specialization: String(data.specialization || ''),
        experience: Number(data.experience || 0),
        languages: Array.isArray(data.languages) ? data.languages.map(String) : [],
        rating: Number(data.rating || 0),
        ratePerMinute: Number(data.ratePerMinute || 0),
        availability: data.availability === 'online' ? 'online' as const : 'offline' as const,
        bio: String(data.bio || ''),
      };
    })
    .sort((a, b) => b.rating - a.rating);
}
