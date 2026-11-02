import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

const PANDIT_NAME = 'Pandit Raghav Sharma';

const AudioCallScreen = () => {
  const navigation = useNavigation();
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(value => value + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    Alert.alert(
      'End consultation?',
      'This preview does not connect to a real audio call. In production, ending the call must notify the backend and open the call summary.',
      [
        { text: 'Continue call', style: 'cancel' },
        {
          text: 'End call',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <ScreenContainer style={styles.screen}>
      <AppHeader title="Audio Consultation" />

      <View style={styles.callArea}>
        <View style={styles.avatarOuter}>
          <View style={styles.avatarInner}>
            <Text style={styles.avatarSymbol}>ॐ</Text>
          </View>
        </View>

        <Text style={styles.panditName}>{PANDIT_NAME}</Text>
        <Text style={styles.role}>Vedic Astrologer</Text>

        <View style={styles.callStatus}>
          <View style={styles.liveDot} />
          <Text style={styles.callStatusText}>Connected · Audio call</Text>
        </View>

        <Text style={styles.callTimer}>{formattedTime()}</Text>
        <Text style={styles.timerCaption}>Consultation duration</Text>
      </View>

      <AppCard style={styles.rateCard}>
        <View style={styles.rateRow}>
          <Text style={styles.rateLabel}>Consultation rate</Text>
          <Text style={styles.rateValue}>₹20 / min</Text>
        </View>
        <View style={styles.rateDivider} />
        <View style={styles.rateRow}>
          <Text style={styles.rateLabel}>Call status</Text>
          <Text style={styles.connectedValue}>Connected</Text>
        </View>
      </AppCard>

      <View style={styles.controls}>
        <ControlButton
          symbol={isMuted ? '🔇' : '🎙'}
          label={isMuted ? 'Unmute' : 'Mute'}
          active={isMuted}
          onPress={() => setIsMuted(value => !value)}
        />
        <ControlButton
          symbol={speakerOn ? '🔊' : '🔈'}
          label="Speaker"
          active={speakerOn}
          onPress={() => setSpeakerOn(value => !value)}
        />
      </View>

      <Text style={styles.controlNote}>
        Mute and speaker controls are visual previews only; they do not control
        device audio in this prototype.
      </Text>

      <AppButton
        title="End Consultation"
        onPress={handleEndCall}
        variant="primary"
        style={styles.endButton}
      />
      <Text style={styles.safetyNote}>
        Please do not share your OTP, passwords, or banking details during a
        consultation.
      </Text>
    </ScreenContainer>
  );
};

type ControlButtonProps = {
  symbol: string;
  label: string;
  active: boolean;
  onPress: () => void;
};

const ControlButton = ({
  symbol,
  label,
  active,
  onPress,
}: ControlButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    onPress={onPress}
    style={styles.controlItem}
  >
    <View style={[styles.controlCircle, active && styles.controlCircleActive]}>
      <Text style={styles.controlSymbol}>{symbol}</Text>
    </View>
    <Text style={styles.controlLabel}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  callArea: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  avatarOuter: {
    width: 142,
    height: 142,
    borderRadius: 71,
    backgroundColor: '#EFE5F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2D0EF',
  },
  avatarInner: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSymbol: {
    color: '#EAC45F',
    fontSize: 52,
    fontWeight: '700',
  },
  panditName: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  role: {
    color: '#77717D',
    fontSize: 13,
    marginTop: 5,
  },
  callStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF6EE',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: spacing.md,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#269653',
    marginRight: 7,
  },
  callStatusText: {
    color: '#247A45',
    fontSize: 11,
    fontWeight: '700',
  },
  callTimer: {
    color: colors.primary,
    fontSize: 38,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginTop: spacing.lg,
  },
  timerCaption: {
    color: '#88818F',
    fontSize: 11,
    marginTop: 2,
  },
  rateCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateLabel: {
    color: '#77717D',
    fontSize: 12,
  },
  rateValue: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  rateDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E8E2EB',
    marginVertical: spacing.md,
  },
  connectedValue: {
    color: '#269653',
    fontSize: 12,
    fontWeight: '700',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 42,
    marginTop: spacing.sm,
  },
  controlItem: {
    alignItems: 'center',
    minWidth: 76,
  },
  controlCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#F0EAF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlCircleActive: {
    backgroundColor: '#E8DDF0',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  controlSymbol: {
    fontSize: 25,
  },
  controlLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  controlNote: {
    color: '#8B8491',
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  endButton: {
    marginTop: spacing.xl,
  },
  safetyNote: {
    color: '#8B8491',
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
});

export default AudioCallScreen;
