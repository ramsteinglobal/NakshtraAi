import type { ConfirmationResult } from 'firebase/auth';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { authErrorMessage, confirmOtp, sendOtp } from '../services/auth';

type Step = 'phone' | 'otp';

export default function LoginScreen() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmation = useRef<ConfirmationResult | null>(null);

  async function handleSendOtp() {
    setError(null);
    setBusy(true);
    try {
      confirmation.current = await sendOtp(phone);
      setStep('otp');
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyOtp() {
    if (!confirmation.current) {
      setStep('phone');
      return;
    }

    setError(null);
    setBusy(true);
    try {
      await confirmOtp(confirmation.current, code);
      // Auth state listener in App.tsx takes over from here.
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.brand}>NakshatraAI</Text>
      <Text style={styles.subtitle}>
        {step === 'phone' ? 'Sign in with your phone number' : `Enter the OTP sent to ${phone}`}
      </Text>

      {step === 'phone' ? (
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+91 98765 43210"
          placeholderTextColor="#8A8A8A"
          keyboardType="phone-pad"
          autoComplete="tel"
          editable={!busy}
        />
      ) : (
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="6-digit OTP"
          placeholderTextColor="#8A8A8A"
          keyboardType="number-pad"
          maxLength={6}
          editable={!busy}
        />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.button, busy && styles.buttonDisabled]}
        disabled={busy}
        onPress={step === 'phone' ? handleSendOtp : handleVerifyOtp}
      >
        {busy ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonLabel}>{step === 'phone' ? 'Send OTP' : 'Verify OTP'}</Text>
        )}
      </Pressable>

      {step === 'otp' ? (
        <Pressable disabled={busy} onPress={() => setStep('phone')}>
          <Text style={styles.link}>Change phone number</Text>
        </Pressable>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  brand: {
    fontSize: 32,
    fontWeight: '700',
    color: '#21182B',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 32,
    fontSize: 15,
    color: '#5A5A5A',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#21182B',
  },
  error: {
    marginTop: 12,
    color: '#B3261E',
    fontSize: 14,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#301653',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 20,
    color: '#542B82',
    textAlign: 'center',
    fontSize: 14,
  },
});
