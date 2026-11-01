import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  authErrorMessage,
  fetchPanditProfile,
  fetchPanditProfileStatus,
  fetchUserProfile,
  savePanditProfile,
  saveUserProfile,
  type PanditProfile,
  type UserProfile,
} from '../services/auth';
import type { UserRole } from '../types';

type Props = { uid: string; role: UserRole; onBack: () => void; onSignOut: () => void };
type Field = { key: keyof PanditProfile | keyof UserProfile; label: string; optional?: boolean; keyboardType?: 'numeric' | 'email-address'; multiline?: boolean };
type Form = Record<string, string>;

const userFields: Field[] = [
  { key: 'name', label: 'Full name' },
  { key: 'email', label: 'Email', optional: true, keyboardType: 'email-address' },
  { key: 'city', label: 'City' },
  { key: 'birthDate', label: 'Date of birth', optional: true },
  { key: 'birthTime', label: 'Time of birth', optional: true },
  { key: 'birthPlace', label: 'Place of birth', optional: true },
];
const panditFields: Field[] = [
  { key: 'name', label: 'Full name' },
  { key: 'city', label: 'City' },
  { key: 'specialization', label: 'Specialization' },
  { key: 'experience', label: 'Experience (years)', keyboardType: 'numeric' },
  { key: 'languages', label: 'Languages (comma separated)' },
  { key: 'ratePerMinute', label: 'Consultation rate (₹/minute)', keyboardType: 'numeric' },
  { key: 'bio', label: 'About you', optional: true, multiline: true },
];

export default function ProfileScreen({ uid, role, onBack, onSignOut }: Props) {
  const isPandit = role === 'pandit';
  const fields = isPandit ? panditFields : userFields;
  const [form, setForm] = useState<Form>({});
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [availability, setAvailability] = useState('offline');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (isPandit) {
          const [profile, status] = await Promise.all([fetchPanditProfile(uid), fetchPanditProfileStatus(uid)]);
          if (!active) return;
          setForm((profile || {}) as unknown as Form);
          setVerificationStatus(status.verificationStatus);
          setAvailability(status.availability);
        } else {
          const profile = await fetchUserProfile(uid);
          if (!active) return;
          setForm((profile || {}) as unknown as Form);
        }
      } catch (err) {
        if (active) setError(authErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [isPandit, uid]);

  function update(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  async function save() {
    if (!form.name?.trim() || !form.city?.trim()) {
      setError('Name and city are required.');
      return;
    }
    if (isPandit && (!form.specialization?.trim() || !form.languages?.trim() || !Number.isFinite(Number(form.experience)) || Number(form.experience) < 0 || !Number.isFinite(Number(form.ratePerMinute)) || Number(form.ratePerMinute) <= 0)) {
      setError('Enter valid specialization, experience, languages and consultation rate.');
      return;
    }
    if (form.email?.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (isPandit) await savePanditProfile(uid, form as unknown as PanditProfile);
      else await saveUserProfile(uid, form as unknown as UserProfile);
      setEditing(false);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>‹</Text></Pressable>
        <View style={styles.headerCopy}><Text style={styles.headerTitle}>My profile</Text><Text style={styles.headerSubtitle}>{isPandit ? 'Pandit account' : 'User account'}</Text></View>
        {!editing && !loading ? <Pressable style={styles.editButton} onPress={() => setEditing(true)}><Text style={styles.editText}>Edit</Text></Pressable> : null}
      </View>
      {loading ? <View style={styles.center}><ActivityIndicator color="#512779" /></View> : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.identityCard}>
            <View style={styles.avatar}><Text style={styles.avatarSymbol}>{isPandit ? 'ॐ' : (form.name?.trim().charAt(0).toUpperCase() || 'N')}</Text></View>
            <Text style={styles.displayName}>{form.name || (isPandit ? 'Pandit profile' : 'Your profile')}</Text>
            <Text style={styles.roleLabel}>{isPandit ? 'PANDIT' : 'USER'}</Text>
            {isPandit ? <View style={[styles.statusPill, verificationStatus === 'approved' && styles.approvedPill]}><Text style={[styles.statusText, verificationStatus === 'approved' && styles.approvedText]}>{verificationStatus === 'approved' ? '✓ APPROVED' : '● PENDING REVIEW'}</Text></View> : null}
          </View>

          {fields.map((field) => {
            const fieldValue = form[field.key] || '';
            if (!editing && !fieldValue && field.optional) return null;
            return (
              <View style={styles.fieldCard} key={field.key}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                {editing ? (
                  <TextInput
                    style={[styles.input, field.multiline && styles.multiline]}
                    value={fieldValue}
                    onChangeText={(value) => update(field.key, value)}
                    placeholder={field.optional ? 'Optional' : `Enter ${field.label.toLowerCase()}`}
                    placeholderTextColor="#9A929E"
                    keyboardType={field.keyboardType || 'default'}
                    autoCapitalize={field.key === 'email' ? 'none' : 'sentences'}
                    multiline={field.multiline}
                    textAlignVertical={field.multiline ? 'top' : 'center'}
                    editable={!saving}
                  />
                ) : <Text style={styles.fieldValue}>{fieldValue || 'Not added'}</Text>}
              </View>
            );
          })}

          {isPandit && !editing ? (
            <View style={styles.fieldCard}>
              <Text style={styles.fieldLabel}>Availability</Text>
              <Text style={styles.fieldValue}>{availability === 'online' ? 'Online' : 'Offline'}</Text>
            </View>
          ) : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {editing ? (
            <View style={styles.actions}>
              <Pressable style={styles.cancelButton} disabled={saving} onPress={() => { setEditing(false); setError(null); }}><Text style={styles.cancelText}>Cancel</Text></Pressable>
              <Pressable style={[styles.saveButton, saving && styles.disabled]} disabled={saving} onPress={save}>{saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveText}>Save changes</Text>}</Pressable>
            </View>
          ) : <Pressable style={styles.signOutButton} onPress={onSignOut}><Text style={styles.signOutText}>Sign out</Text></Pressable>}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAF5EF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, backgroundColor: '#FAF5EF', borderBottomWidth: 1, borderBottomColor: '#EEE6E9' },
  back: { width: 36, height: 40, justifyContent: 'center' },
  backText: { color: '#351759', fontSize: 32, lineHeight: 34 },
  headerCopy: { flex: 1, marginLeft: 7 },
  headerTitle: { color: '#251A30', fontSize: 18, fontWeight: '800' },
  headerSubtitle: { color: '#817985', fontSize: 11, marginTop: 2 },
  editButton: { backgroundColor: '#F0E5F6', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8 },
  editText: { color: '#512779', fontWeight: '800', fontSize: 12 },
  content: { padding: 18, paddingBottom: 30 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  identityCard: { backgroundColor: '#351759', alignItems: 'center', borderRadius: 18, padding: 22, marginBottom: 15 },
  avatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 1.5, borderColor: '#E7BD60', backgroundColor: '#F0E5F6', alignItems: 'center', justifyContent: 'center' },
  avatarSymbol: { color: '#512779', fontSize: 29, fontWeight: '800' },
  displayName: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginTop: 12 },
  roleLabel: { color: '#EAC45F', fontSize: 10, fontWeight: '800', letterSpacing: 1.3, marginTop: 4 },
  statusPill: { backgroundColor: '#4C3B5C', borderRadius: 15, paddingHorizontal: 11, paddingVertical: 6, marginTop: 12 },
  approvedPill: { backgroundColor: '#DDF1E3' },
  statusText: { color: '#F7E7B3', fontSize: 10, fontWeight: '800' },
  approvedText: { color: '#247044' },
  fieldCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBE4EC', borderRadius: 13, padding: 14, marginBottom: 9 },
  fieldLabel: { color: '#817985', fontSize: 11, fontWeight: '700', marginBottom: 5 },
  fieldValue: { color: '#30283A', fontSize: 15, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#DED9E4', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, color: '#21182B', fontSize: 15, minHeight: 46 },
  multiline: { minHeight: 100, paddingTop: 12 },
  error: { color: '#B3261E', marginTop: 7, fontSize: 13 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  cancelButton: { borderWidth: 1, borderColor: '#D8D0DC', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 18, justifyContent: 'center' },
  cancelText: { color: '#514A58', fontWeight: '700' },
  saveButton: { flex: 1, backgroundColor: '#351759', borderRadius: 12, minHeight: 50, alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  disabled: { opacity: 0.65 },
  signOutButton: { borderWidth: 1, borderColor: '#351759', borderRadius: 12, minHeight: 50, alignItems: 'center', justifyContent: 'center', marginTop: 8, backgroundColor: '#FFFFFF' },
  signOutText: { color: '#351759', fontSize: 14, fontWeight: '800' },
});
