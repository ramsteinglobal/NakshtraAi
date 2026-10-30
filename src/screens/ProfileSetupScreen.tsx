import { useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { authErrorMessage, savePanditProfile, saveUserProfile, type PanditProfile, type UserProfile } from '../services/auth';
import type { UserRole } from '../types';

type Props = { uid: string; role: UserRole; onComplete: (name: string) => void };
type ProfileField = {
  key: keyof PanditProfile | keyof UserProfile;
  label: string;
  prompt: string;
  placeholder: string;
  keyboardType?: 'numeric' | 'email-address';
  multiline?: boolean;
  optional?: boolean;
};

const userSteps: ProfileField[] = [
  { key: 'name', label: 'Your name', prompt: 'What should we call you?', placeholder: 'Enter your full name' },
  { key: 'email', label: 'Email address', prompt: 'What is your email?', placeholder: 'name@example.com', keyboardType: 'email-address', optional: true },
  { key: 'city', label: 'Your city', prompt: 'Which city do you live in?', placeholder: 'Enter your city' },
  { key: 'birthDate', label: 'Date of birth', prompt: 'When were you born?', placeholder: 'DD/MM/YYYY', optional: true },
  { key: 'birthTime', label: 'Time of birth', prompt: 'Do you know your birth time?', placeholder: 'HH:MM AM/PM', optional: true },
  { key: 'birthPlace', label: 'Birthplace', prompt: 'Where were you born?', placeholder: 'City of birth', optional: true },
];

const panditSteps: ProfileField[] = [
  { key: 'name', label: 'Your name', prompt: 'What should devotees call you?', placeholder: 'Enter your full name' },
  { key: 'city', label: 'Your city', prompt: 'Where are you based?', placeholder: 'Enter your city' },
  { key: 'specialization', label: 'Specialization', prompt: 'What services do you offer?', placeholder: 'Vedic astrology, puja…' },
  { key: 'experience', label: 'Experience', prompt: 'How many years of experience do you have?', placeholder: 'Years of experience', keyboardType: 'numeric' },
  { key: 'languages', label: 'Languages', prompt: 'Which languages do you speak?', placeholder: 'Hindi, English (comma separated)' },
  { key: 'ratePerMinute', label: 'Consultation rate', prompt: 'What is your rate per minute?', placeholder: 'Amount in ₹ per minute', keyboardType: 'numeric' },
  { key: 'bio', label: 'About you', prompt: 'Tell users a little about yourself', placeholder: 'Your experience and services', multiline: true, optional: true },
];

const userInitial: UserProfile = { name: '', email: '', city: '', birthDate: '', birthTime: '', birthPlace: '' };
const panditInitial: PanditProfile = { name: '', city: '', specialization: '', experience: '', languages: '', ratePerMinute: '', bio: '' };

export default function ProfileSetupScreen({ uid, role, onComplete }: Props) {
  const [user, setUser] = useState(userInitial);
  const [pandit, setPandit] = useState(panditInitial);
  const [stepIndex, setStepIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPandit = role === 'pandit';
  const steps = isPandit ? panditSteps : userSteps;
  const step = steps[stepIndex];
  const value = String(((isPandit ? pandit : user) as unknown as Record<string, string>)[step.key] || '');

  function update(nextValue: string) {
    if (isPandit) setPandit((current) => ({ ...current, [step.key]: nextValue }));
    else setUser((current) => ({ ...current, [step.key]: nextValue }));
    setError(null);
  }

  function validateStep(): boolean {
    const trimmed = value.trim();
    if (!step.optional && !trimmed) {
      setError(`Please enter ${step.label.toLowerCase()}.`);
      return false;
    }
    if (step.key === 'email' && trimmed && !/^\S+@\S+\.\S+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (step.key === 'experience' && trimmed && (!Number.isFinite(Number(trimmed)) || Number(trimmed) < 0)) {
      setError('Enter a valid number of years.');
      return false;
    }
    if (step.key === 'languages' && !trimmed.split(',').some((language) => language.trim())) {
      setError('Enter at least one language.');
      return false;
    }
    if (step.key === 'ratePerMinute' && (!Number.isFinite(Number(trimmed)) || Number(trimmed) <= 0)) {
      setError('Enter a rate greater than zero.');
      return false;
    }
    return true;
  }

  function goNext() {
    if (!validateStep()) return;
    Keyboard.dismiss();
    setError(null);
    setStepIndex((index) => Math.min(index + 1, steps.length - 1));
  }

  async function finish() {
    if (!validateStep()) return;
    Keyboard.dismiss();
    setError(null);
    setBusy(true);
    try {
      if (isPandit) await savePanditProfile(uid, pandit);
      else await saveUserProfile(uid, user);
      onComplete((isPandit ? pandit.name : user.name).trim());
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(false);
    }
  }

  function skip() {
    if (value.trim() && !validateStep()) return;
    Keyboard.dismiss();
    setError(null);
    setStepIndex((index) => Math.min(index + 1, steps.length - 1));
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>{isPandit ? 'PANDIT PROFILE' : 'USER PROFILE'}</Text>
        <View style={styles.progressHeader}>
          <Text style={styles.stepCount}>STEP {stepIndex + 1} OF {steps.length}</Text>
          <Text style={styles.stepPercent}>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</Text>
        </View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${((stepIndex + 1) / steps.length) * 100}%` }]} /></View>
        <Text style={styles.title}>{step.prompt}</Text>
        <Text style={styles.subtitle}>{step.optional ? 'You can skip this and add it later.' : 'This helps us set up your account.'}</Text>
        <Text style={styles.label}>{step.label}{step.optional ? ' · Optional' : ''}</Text>
        <TextInput
          style={[styles.input, step.multiline && styles.multiline]}
          value={value}
          onChangeText={update}
          placeholder={step.placeholder}
          placeholderTextColor="#89838F"
          keyboardType={step.keyboardType || 'default'}
          autoCapitalize={step.key === 'email' ? 'none' : 'sentences'}
          multiline={step.multiline}
          textAlignVertical={step.multiline ? 'top' : 'center'}
          editable={!busy}
          returnKeyType={stepIndex === steps.length - 1 ? 'done' : 'next'}
          onSubmitEditing={step.multiline ? undefined : goNext}
        />
        {isPandit && stepIndex === steps.length - 1 ? <Text style={styles.hint}>Your profile starts as pending verification and offline.</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.actions}>
          {stepIndex > 0 ? (
            <Pressable style={styles.backButton} disabled={busy} onPress={() => { Keyboard.dismiss(); setError(null); setStepIndex((index) => index - 1); }}>
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          ) : <View style={styles.backSpacer} />}
          {step.optional ? <Pressable style={styles.skipButton} disabled={busy} onPress={skip}><Text style={styles.skipText}>Skip</Text></Pressable> : null}
          <Pressable style={[styles.button, busy && styles.disabled]} disabled={busy} onPress={stepIndex === steps.length - 1 ? finish : goNext}>
            {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{stepIndex === steps.length - 1 ? 'Finish' : 'Continue'}</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 34, paddingBottom: 40 },
  eyebrow: { color: '#684395', fontWeight: '700', fontSize: 12, letterSpacing: 1.2 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  stepCount: { color: '#716A78', fontSize: 12, fontWeight: '700', letterSpacing: 0.7 },
  stepPercent: { color: '#684395', fontSize: 12, fontWeight: '700' },
  progressTrack: { height: 5, borderRadius: 5, backgroundColor: '#EEE9F2', marginTop: 9, overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 5, backgroundColor: '#684395' },
  title: { marginTop: 42, color: '#21182B', fontSize: 27, lineHeight: 35, fontWeight: '700' },
  subtitle: { marginTop: 8, marginBottom: 30, color: '#68636D', fontSize: 15, lineHeight: 22 },
  label: { marginBottom: 8, color: '#30283A', fontSize: 14, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#DED9E4', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, color: '#21182B', fontSize: 17, minHeight: 54 },
  multiline: { minHeight: 130, paddingTop: 14 },
  hint: { color: '#77717D', fontSize: 13, lineHeight: 19, marginTop: 14 },
  error: { color: '#B3261E', marginTop: 12, fontSize: 14 },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: 30, gap: 10 },
  backSpacer: { width: 2 },
  backButton: { borderWidth: 1, borderColor: '#DED9E4', borderRadius: 12, minWidth: 75, paddingVertical: 15, alignItems: 'center' },
  backText: { color: '#514A58', fontSize: 15, fontWeight: '600' },
  skipButton: { paddingHorizontal: 8, paddingVertical: 14 },
  skipText: { color: '#684395', fontSize: 14, fontWeight: '600' },
  button: { flex: 1, backgroundColor: '#301653', borderRadius: 12, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', minHeight: 54 },
  disabled: { opacity: 0.65 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
