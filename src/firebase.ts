import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

// Native Firebase SDKs read their Android configuration from google-services.json.
export const app = getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
