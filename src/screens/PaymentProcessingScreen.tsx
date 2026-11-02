import React from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';

const PAYMENT_STEPS = [
  'Payment initiated',
  'Verifying payment',
  'Adding money to wallet',
];

export default function PaymentProcessingScreen() {
  const handleCancel = () => {
    Alert.alert(
      'Cancel payment?',
      'This is a frontend preview. No real payment is currently running.',
      [{ text: 'Stay', style: 'cancel' }, { text: 'OK', onPress: () => {} }],
    );
  };

  return (
    <ScreenContainer>
      <AppHeader title="Payment Processing" />

      <View style={styles.content}>
        <View style={styles.loaderWrap}>
          <View style={styles.loaderRing}>
            <ActivityIndicator size="large" color="#512779" />
          </View>
        </View>

        <Text style={styles.title}>Processing Payment</Text>
        <Text style={styles.subtitle}>
          Please do not close the app while your payment is being processed.
        </Text>

        <AppCard style={styles.stepsCard}>
          {PAYMENT_STEPS.map((step, index) => {
            const isCurrent = index === 1;
            const isComplete = index === 0;

            return (
              <View key={step} style={styles.stepRow}>
                <View style={styles.timeline}>
                  <View
                    style={[
                      styles.stepDot,
                      isComplete && styles.stepDotComplete,
                      isCurrent && styles.stepDotCurrent,
                    ]}>
                    {isComplete ? (
                      <Text style={styles.checkMark}>✓</Text>
                    ) : isCurrent ? (
                      <View style={styles.currentDot} />
                    ) : null}
                  </View>
                  {index < PAYMENT_STEPS.length - 1 ? (
                    <View style={styles.timelineLine} />
                  ) : null}
                </View>

                <View style={styles.stepTextWrap}>
                  <Text
                    style={[
                      styles.stepText,
                      (isComplete || isCurrent) && styles.stepTextActive,
                    ]}>
                    {step}
                  </Text>
                  {isCurrent ? (
                    <Text style={styles.stepSubtext}>Please wait…</Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </AppCard>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={styles.infoText}>
            Keep your app open until the payment status is confirmed. Never
            share your OTP or payment PIN with anyone.
          </Text>
        </View>

        <AppButton
          title="Cancel"
          variant="outline"
          onPress={handleCancel}
          style={styles.cancelButton}
        />

        <Text style={styles.previewNote}>
          UI preview only — no payment gateway is connected.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  loaderWrap: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1,
    borderColor: '#E7DCEF',
    backgroundColor: '#F5EFF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 23,
  },
  loaderRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#E3D7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#251A30',
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#746C78',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
    paddingHorizontal: 14,
  },
  stepsCard: {
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 19,
    marginBottom: 16,
  },
  stepRow: {
    minHeight: 57,
    flexDirection: 'row',
  },
  timeline: {
    width: 27,
    alignItems: 'center',
  },
  stepDot: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CFC5D7',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  stepDotComplete: {
    borderColor: '#351759',
    backgroundColor: '#351759',
  },
  stepDotCurrent: {
    borderColor: '#684395',
    backgroundColor: '#F0E8F5',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  currentDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#684395',
  },
  timelineLine: {
    position: 'absolute',
    top: 19,
    bottom: -1,
    width: 2,
    backgroundColor: '#E5DDE9',
  },
  stepTextWrap: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 1,
  },
  stepText: {
    color: '#9A929F',
    fontSize: 13,
    fontWeight: '600',
  },
  stepTextActive: {
    color: '#351759',
    fontWeight: '700',
  },
  stepSubtext: {
    color: '#817985',
    fontSize: 10,
    marginTop: 4,
  },
  infoBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0E8F5',
    borderRadius: 12,
    padding: 13,
  },
  infoIcon: {
    fontSize: 15,
    marginRight: 9,
  },
  infoText: {
    flex: 1,
    color: '#665A70',
    fontSize: 11,
    lineHeight: 17,
  },
  cancelButton: {
    width: '100%',
    marginTop: 22,
  },
  previewNote: {
    color: '#817985',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 12,
  },
});
