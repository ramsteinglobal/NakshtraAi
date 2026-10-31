import { Platform, StatusBar } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import RoleScreen from './src/screens/RoleScreen';
import { fetchDisplayName, fetchProfileComplete, fetchRole, signOutUser, watchAuth } from './src/services/auth';
import type { UserRole } from './src/types';

type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

export default function App() {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [uid, setUid] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;

  useEffect(() => {
    return watchAuth(async (user) => {
      if (!user) {
        setUid(null);
        setRole(null);
        setProfileComplete(false);
        setDisplayName('');
        setStatus('signedOut');
        return;
      }

      setUid(user.uid);
      try {
        const userRole = await fetchRole(user.uid);
        setRole(userRole);
        if (userRole) {
          const [complete, name] = await Promise.all([
            fetchProfileComplete(user.uid, userRole),
            fetchDisplayName(user.uid, userRole),
          ]);
          setProfileComplete(complete);
          setDisplayName(name);
        } else {
          setProfileComplete(false);
        }
      } catch {
        setRole(null);
        setProfileComplete(false);
      }
      setStatus('signedIn');
    });
  }, []);

  const handleSignedOut = useCallback(async () => {
    await signOutUser();
    setStatus('signedOut');
    setRole(null);
    setProfileComplete(false);
    setDisplayName('');
    setUid(null);
  }, []);

  if (status === 'loading') {
    return (
      <View style={[styles.app, styles.loadingApp, { paddingTop: topInset }]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.app, { paddingTop: topInset, backgroundColor: status === 'signedIn' && role ? '#FAF5EF' : '#FFFFFF' }]}>
      <StatusBar barStyle="dark-content" />
      {status === 'signedOut' || !uid ? (
        <LoginScreen />
      ) : role && profileComplete ? (
        <HomeScreen role={role} uid={uid} name={displayName} onSignOut={handleSignedOut} />
      ) : role ? (
        <ProfileSetupScreen
          uid={uid}
          role={role}
          onComplete={(name) => {
            setProfileComplete(true);
            setDisplayName(name);
          }}
        />
      ) : (
        <RoleScreen uid={uid} onRoleSelected={(selectedRole) => {
          setRole(selectedRole);
          setProfileComplete(false);
        }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  loadingApp: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
