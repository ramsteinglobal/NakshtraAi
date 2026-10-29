import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { authErrorMessage, saveRole } from '../services/auth';
import type { UserRole } from '../types';

type Props = {
  uid: string;
  onRoleSelected: (role: UserRole) => void;
};

const options: { role: UserRole; label: string; description: string }[] = [
  { role: 'user', label: 'I am a User', description: 'Consult pandits over chat, call and video.' },
  { role: 'pandit', label: 'I am a Pandit', description: 'Take consultations and track your earnings.' },
];

export default function RoleScreen({ uid, onRoleSelected }: Props) {
  const [busy, setBusy] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(role: UserRole) {
    setError(null);
    setBusy(role);
    try {
      await saveRole(uid, role);
      onRoleSelected(role);
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(null);
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Choose your role</Text>
      <Text style={styles.subtitle}>
        This choice is permanent. Contact support if you picked the wrong account type.
      </Text>

      {options.map((option) => (
        <Pressable
          key={option.role}
          style={styles.card}
          disabled={busy !== null}
          onPress={() => handleSelect(option.role)}
        >
          {busy === option.role ? (
            <ActivityIndicator />
          ) : (
            <>
              <Text style={styles.cardTitle}>{option.label}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
            </>
          )}
        </Pressable>
      ))}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#21182B',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 14,
    color: '#5A5A5A',
  },
  card: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    minHeight: 96,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#21182B',
  },
  cardDescription: {
    marginTop: 6,
    fontSize: 14,
    color: '#5A5A5A',
  },
  error: {
    marginTop: 8,
    color: '#B3261E',
    fontSize: 14,
  },
});
