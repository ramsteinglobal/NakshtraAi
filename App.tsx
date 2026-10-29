import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RoleScreen from './src/screens/RoleScreen';
import { fetchRole, signOutUser, watchAuth } from './src/services/auth';
import type { UserRole } from './src/types';

type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

export default function App() {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [uid, setUid] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    return watchAuth(async (user) => {
      if (!user) {
        setUid(null);
        setRole(null);
        setStatus('signedOut');
        return;
      }

      setUid(user.uid);
      try {
        setRole(await fetchRole(user.uid));
      } catch {
        setRole(null);
      }
      setStatus('signedIn');
    });
  }, []);

  const handleSignedOut = useCallback(async () => {
    await signOutUser();
    setStatus('signedOut');
    setRole(null);
    setUid(null);
  }, []);

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.app}>
      <StatusBar style="dark" />
      {status === 'signedOut' || !uid ? (
        <LoginScreen />
      ) : role ? (
        <HomeScreen role={role} uid={uid} onSignOut={handleSignedOut} />
      ) : (
        <RoleScreen uid={uid} onRoleSelected={setRole} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
