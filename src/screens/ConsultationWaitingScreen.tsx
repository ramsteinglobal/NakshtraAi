import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
const CONSULTATION = {
  panditName: 'Pandit Raghav Sharma',
  consultationType: 'Audio consultation',
  estimatedWait: '2–5 minutes',
  bookingId: 'NAK-2026-1101-001',
};

const ConsultationWaitingScreen = () => {
  const navigation = useNavigation();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(previous => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel consultation?',
      'This is a UI preview. Connect this action to the booking and refund rules before enabling cancellation in production.',
      [
        { text: 'Keep waiting', style: 'cancel' },
        {
          text: 'Go back',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <ScreenContainer>
      <AppHeader title="Consultation Waiting" />

      <View style={styles.centerBlock}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>ॐ</Text>
        </View>
        <Text style={styles.title}>Waiting for your Pandit</Text>
        <Text style={styles.subtitle}>
          Your consultation request has been sent. Please stay on this screen
          while we wait for confirmation.
        </Text>
      </View>

      <AppCard style={styles.panditCard}>
        <View style={styles.panditRow}>
          <View style={styles.smallAvatar}>
            <Text style={styles.smallAvatarText}>P</Text>
          </View>
          <View style={styles.panditInfo}>
            <Text style={styles.panditName}>{CONSULTATION.panditName}</Text>
            <Text style={styles.consultationType}>
              {CONSULTATION.consultationType}
            </Text>
          </View>
          <View style={styles.pendingBadge}>
            <View style={styles.pendingDot} />
            <Text style={styles.pendingText}>Pending</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estimated wait</Text>
          <Text style={styles.infoValue}>{CONSULTATION.estimatedWait}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Request ID</Text>
          <Text style={styles.infoValue}>{CONSULTATION.bookingId}</Text>
        </View>
      </AppCard>

      <AppCard style={styles.waitCard}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.waitTitle}>Request sent successfully</Text>
        <Text style={styles.waitDescription}>
          We’ll notify you when the Pandit accepts your consultation.
        </Text>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Time elapsed</Text>
          <Text style={styles.timer}>{formatTime(elapsedSeconds)}</Text>
        </View>
      </AppCard>

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>While you wait</Text>
        <Text style={styles.tipText}>
          Keep your internet connection active and make sure your phone is not
          on silent so you don’t miss the consultation notification.
        </Text>
      </View>

      <AppButton
        title="Cancel Request"
        onPress={handleCancel}
        variant="outline"
        style={styles.cancelButton}
      />
      <Text style={styles.footerText}>
        Please don’t close the app until your request is updated.
      </Text>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  centerBlock: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F1E8F8',
    borderWidth: 1,
    borderColor: '#E5D5F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 38,
    fontWeight: '700',
  },
  title: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#77717D',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  panditCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  panditRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F3E9D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  panditInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  panditName: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  consultationType: {
    color: '#77717D',
    fontSize: 12,
    marginTop: 4,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4D8',
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D99A16',
    marginRight: 5,
  },
  pendingText: {
    color: '#91620B',
    fontSize: 10,
    fontWeight: '700',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E8E2EB',
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  infoLabel: {
    color: '#77717D',
    fontSize: 12,
  },
  infoValue: {
    color: '#30283A',
    fontSize: 12,
    fontWeight: '700',
  },
  waitCard: {
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  waitTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  waitDescription: {
    color: '#77717D',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
    backgroundColor: '#F7F2FA',
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minWidth: 130,
  },
  timerLabel: {
    color: '#77717D',
    fontSize: 11,
  },
  timer: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginTop: 3,
  },
  tipBox: {
    backgroundColor: '#FFF9E9',
    borderColor: '#F1E3BD',
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  tipTitle: {
    color: '#795817',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 5,
  },
  tipText: {
    color: '#786A4D',
    fontSize: 12,
    lineHeight: 18,
  },
  cancelButton: {
    marginTop: spacing.xs,
  },
  footerText: {
    color: '#8B8491',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
});

export default ConsultationWaitingScreen;
