
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../theme/colors';

type Props = {
  title: string;
  showBack?: boolean;
  rightText?: string;
  onRightPress?: () => void;
};

export default function AppHeader({
  title,
  showBack = true,
  rightText,
  onRightPress,
}: Props) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {showBack ? (
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}

      <Text style={styles.title}>{title}</Text>

      {rightText ? (
        <Pressable onPress={onRightPress}>
          <Text style={styles.rightText}>{rightText}</Text>
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 35,
  },
  backText: {
    fontSize: 34,
    color: colors.primary,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  rightText: {
    color: colors.primary,
    fontWeight: '600',
  },
  placeholder: {
    width: 35,
  },
});
