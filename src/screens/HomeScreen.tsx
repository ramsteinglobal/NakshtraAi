import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { UserRole } from '../types';

type Props = {
  role: UserRole;
  uid: string;
  onSignOut: () => void;
};

export default function HomeScreen({ role, uid, onSignOut }: Props) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>NakshatraAI</Text>
      <Text style={styles.subtitle}>
        Signed in as {role === 'pandit' ? 'Pandit' : 'User'}
      </Text>
      <Text style={styles.uid}>UID: {uid}</Text>

      <Text style={styles.note}>
        Home screen placeholders ship with Indrabhan&apos;s step (navigation + screens).
      </Text>

      <Pressable style={styles.button} onPress={onSignOut}>
        <Text style={styles.buttonLabel}>Sign out</Text>
      </Pressable>
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
    fontSize: 28,
    fontWeight: '700',
    color: '#21182B',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#5A5A5A',
  },
  uid: {
    marginTop: 4,
    fontSize: 12,
    color: '#8A8A8A',
  },
  note: {
    marginTop: 32,
    fontSize: 14,
    color: '#5A5A5A',
  },
  button: {
    marginTop: 32,
    borderWidth: 1,
    borderColor: '#301653',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#301653',
    fontSize: 16,
    fontWeight: '600',
  },
});
