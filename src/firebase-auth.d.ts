import type { Persistence } from 'firebase/auth';

/**
 * `getReactNativePersistence` is exported by the React Native build of
 * `firebase/auth` (Metro resolves that build through the package's
 * `react-native` condition). The published TypeScript types only describe the
 * web build, so the React Native only export is declared here.
 */
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  }): Persistence;
}
