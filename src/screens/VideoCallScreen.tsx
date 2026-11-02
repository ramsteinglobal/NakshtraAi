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

const VideoCallScreen = () => {
  const navigation = useNavigation();
  const [seconds, setSeconds] = useState(0);
  const [cameraOn, setCameraOn] = useState(true);
  const [micMuted, setMicMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(value => value + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const endCall = () => {
    Alert.alert(
      'End video consultation?',
      'This is a UI preview only. Connect the video-call SDK and backend call-ending flow before production.',
      [
        { text: 'Continue', style: 'cancel' },
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
      <AppHeader title="Video Consultation" />
;
      <View style={styles.videoStage}>
        <View style={styles.remoteVideo}>
          <View style={styles.remoteAvatar}>
            <Text style={styles.omSymbol}>ॐ</Text>
          </View>
          <Text style={styles.remoteName}>{PANDIT_NAME}</Text>
          <Text style={styles.remoteHint}>Pandit video preview</Text>
        </View>

        <View style={styles.selfPreview}>
          <View style={styles.selfAvatar}>
            <Text style={styles.selfAvatarText}>You</Text>
          </View>
          <Text style={styles.selfLabel}>Your camera preview</Text>
          {!cameraOn && <Text style={styles.cameraOff}>Camera off</Text>}
        </View>

        <View style={styles.videoStatus}>
          <View style={styles.liveDot} />
          <Text style={styles.videoStatusText}>Connected · {formatDuration()}</Text>
        </View>
      </View>

      <AppCard style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Consultation rate</Text>
          <Text style={styles.detailValue}>₹30 / min</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Call type</Text>
          <Text style={styles.detailValue}>Video</Text>
        </View>
      </AppCard>

      <View style={styles.controls}>
        <Control
          symbol={micMuted ? '🔇' : '🎙'}
          label={micMuted ? 'Unmute' : 'Mute'}
          active={micMuted}
          onPress={() => setMicMuted(value => !value)}
        />
        <Control
          symbol={cameraOn ? '📹' : '🚫'}
          label={cameraOn ? 'Camera off' : 'Camera on'}
          active={!cameraOn}
          onPress={() => setCameraOn(value => !value)}
        />
        <Control
          symbol={speakerOn ? '🔊' : '🔈'}
          label="Speaker"
          active={speakerOn}
          onPress={() => setSpeakerOn(value => !value)}
        />
      </View>

      <Text style={styles.previewNote}>
        Video, microphone and speaker controls are visual previews. They do not
        access your camera or device audio in this prototype.
      </Text>

      <AppButton
        title="End Consultation"
        onPress={endCall}
        variant="primary"
        style={styles.endButton}
      />

      <Text style={styles.safetyNote}>
        For your safety, never share OTPs, passwords, or banking details during
        a consultation.
      </Text>
    </ScreenContainer>
  );
};

type ControlProps = {
  symbol: string;
  label: string;
  active: boolean;
  onPress: () => void;
};

const Control = ({ symbol, label, active, onPress }: ControlProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    onPress={onPress}
    style={styles.control}
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
  videoStage: {
    height: 390,
    minHeight: 330,
    backgroundColor: '#21152D',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: spacing.md,
    marginBottom: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remoteAvatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#49315E',
    borderWidth: 2,
    borderColor: '#EAC45F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  omSymbol: {
    color: '#EAC45F',
    fontSize: 48,
    fontWeight: '700',
  },
  remoteName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  remoteHint: {
    color: '#D4C8DE',
    fontSize: 11,
    marginTop: 5,
  },
  selfPreview: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 104,
    height: 142,
    borderRadius: 13,
    backgroundColor: '#59466A',
    borderWidth: 1,
    borderColor: '#A58DB7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  selfAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EAC45F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selfAvatarText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  selfLabel: {
    color: '#FFFFFF',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 8,
  },
  cameraOff: {
    color: '#FFE2A0',
    fontSize: 9,
    marginTop: 3,
  },
  videoStatus: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000080',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#54D17B',
    marginRight: 7,
  },
  videoStatusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  detailsCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#77717D',
    fontSize: 12,
  },
  detailValue: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E8E2EB',
    marginVertical: spacing.md,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: spacing.sm,
  },
  control: {
    alignItems: 'center',
    minWidth: 76,
  },
  controlCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
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
    fontSize: 23,
  },
  controlLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  previewNote: {
    color: '#8B8491',
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  endButton: {
    marginTop: spacing.lg,
  },
  safetyNote: {
    color: '#8B8491',
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
});

export default VideoCallScreen;
