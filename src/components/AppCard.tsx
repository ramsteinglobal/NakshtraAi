
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function AppCard({ children, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
});
