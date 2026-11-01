import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import type { UserRole } from '../types';
import PanditListScreen from './PanditListScreen';
import ProfileScreen from './ProfileScreen';
import { fetchApprovedPandits, type Pandit } from '../services/pandits';
import { fetchPanditProfileStatus, updatePanditAvailability } from '../services/auth';

type Props = { role: UserRole; uid: string; name?: string; onSignOut: () => void };
type UserTab = 'home' | 'pandits' | 'wallet' | 'history' | 'profile';

export default function HomeScreen({ role, uid, name, onSignOut }: Props) {
  const isPandit = role === 'pandit';
  const [tab, setTab] = useState<UserTab>('home');
  const [popular, setPopular] = useState<Pandit[]>([]);
  const [popularLoading, setPopularLoading] = useState(true);
  const [panditProfileOpen, setPanditProfileOpen] = useState(false);
  const [availability, setAvailability] = useState<'online' | 'offline'>('offline');
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilitySaving, setAvailabilitySaving] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');

  useEffect(() => {
    if (isPandit) return;
    let active = true;
    fetchApprovedPandits()
      .then((items) => { if (active) setPopular(items.slice(0, 3)); })
      .catch(() => { if (active) setPopular([]); })
      .finally(() => { if (active) setPopularLoading(false); });
    return () => { active = false; };
  }, [isPandit]);

  useEffect(() => {
    if (!isPandit) return;
    let active = true;
    fetchPanditProfileStatus(uid)
      .then((status) => { if (active) setAvailability(status.availability === 'online' ? 'online' : 'offline'); })
      .catch(() => { if (active) setAvailabilityError('Could not load your availability.'); })
      .finally(() => { if (active) setAvailabilityLoading(false); });
    return () => { active = false; };
  }, [isPandit, uid]);

  async function toggleAvailability(value: boolean) {
    const next = value ? 'online' : 'offline';
    setAvailabilitySaving(true);
    setAvailabilityError('');
    try {
      await updatePanditAvailability(uid, next);
      setAvailability(next);
    } catch {
      setAvailabilityError('Could not update availability. Please try again.');
    } finally {
      setAvailabilitySaving(false);
    }
  }

  if (isPandit) {
    if (panditProfileOpen) {
      return <ProfileScreen uid={uid} role="pandit" onBack={() => setPanditProfileOpen(false)} onSignOut={onSignOut} />;
    }
    return (
      <ScrollView style={styles.panditScreen} contentContainerStyle={styles.panditContent}>
        <View style={styles.panditHeader}>
          <View>
            <Text style={styles.panditBrand}>NakshatraAI</Text>
            <Text style={styles.panditHeaderCaption}>PANDIT PARTNER</Text>
          </View>
        </View>

        <View style={styles.panditWelcome}>
          <View style={styles.welcomeCopy}>
            <Text style={styles.panditGreeting}>Namaste{name ? `, ${name}` : ''} 🙏</Text>
            <Text style={styles.panditHeadline}>Your guidance can make a difference.</Text>
          </View>
          <View style={styles.welcomeMark}><Text style={styles.welcomeOm}>ॐ</Text></View>
        </View>

        <View style={styles.availabilityCard}>
          <View style={styles.availabilityCopy}>
            <Text style={styles.availabilityTitle}>Your availability</Text>
            <Text style={styles.availabilityCaption}>{availability === 'online' ? 'You are marked available.' : 'You are currently offline.'}</Text>
          </View>
          {availabilityLoading ? <ActivityIndicator color="#512779" /> : (
            <Switch
              value={availability === 'online'}
              onValueChange={toggleAvailability}
              disabled={availabilitySaving}
              trackColor={{ false: '#D9D4DC', true: '#BCA4D1' }}
              thumbColor={availability === 'online' ? '#512779' : '#F5F2F6'}
            />
          )}
        </View>
        {availabilityError ? <Text style={styles.availabilityError}>{availabilityError}</Text> : null}
        <Text style={styles.availabilityNote}>Your status is saved to your profile. Incoming request delivery will be connected in a later step.</Text>

        <Pressable style={styles.profileAction} onPress={() => setPanditProfileOpen(true)}>
          <View style={styles.profileActionIcon}><Text style={styles.profileActionIconText}>✧</Text></View>
          <View style={styles.profileActionCopy}><Text style={styles.profileActionTitle}>View and edit profile</Text><Text style={styles.profileActionCaption}>Update your public Pandit details</Text></View>
          <Text style={styles.profileActionArrow}>›</Text>
        </Pressable>

        <Text style={styles.panditSectionTitle}>Today at a glance</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statValue}>—</Text><Text style={styles.statLabel}>Consultations</Text><Text style={styles.statCaption}>Not connected yet</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>—</Text><Text style={styles.statLabel}>Earnings</Text><Text style={styles.statCaption}>Not connected yet</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>—</Text><Text style={styles.statLabel}>Rating</Text><Text style={styles.statCaption}>After first review</Text></View>
        </View>

        <View style={styles.panditSectionHeader}>
          <Text style={styles.sectionTitle}>Incoming requests</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>
        <View style={styles.emptyDashboardCard}><View style={styles.emptyIcon}><Text style={styles.emptyIconText}>◷</Text></View><Text style={styles.emptyDashboardTitle}>No requests yet</Text><Text style={styles.emptyDashboardText}>New consultation requests will show up here.</Text></View>

        <View style={styles.panditSectionHeader}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          <Text style={styles.viewAll}>History</Text>
        </View>
        <View style={styles.emptyActivity}><Text style={styles.emptyDashboardText}>Your completed consultations and earnings will appear here.</Text></View>

        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Ready to help someone?</Text>
          <Text style={styles.helpText}>Keep your profile up to date. Requests, consultations and earnings will appear here as those features are connected.</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.userApp}>
      {tab === 'home' ? (
        <ScrollView style={styles.screen} contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.brand}>NakshatraAI</Text>
              <Text style={styles.brandTagline}>YOUR PERSONAL ASTROLOGY GUIDE</Text>
            </View>
            <View style={styles.profileButton}>
              <Text style={styles.profileInitial}>{(name?.trim()?.[0] || 'I').toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.greeting}>Namaste, {name || 'there'}  🙏</Text>
          <Text style={styles.homeTitle}>Find clarity with{'\n'}NakshatraAI</Text>
          <Text style={styles.homeSubtitle}>Connect with verified Pandits for guidance.</Text>

          <Pressable style={styles.searchBar} onPress={() => setTab('pandits')} accessibilityRole="button">
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Pandits and services"
              placeholderTextColor="#99929D"
              editable={false}
              pointerEvents="none"
            />
            <View style={styles.searchButton}><Text style={styles.searchButtonText}>Search</Text></View>
          </Pressable>

          <Pressable style={styles.heroCard} onPress={() => setTab('pandits')}>
            <Text style={styles.heroEyebrow}>PERSONAL GUIDANCE</Text>
            <Text
  style={styles.heroTitle}
  allowFontScaling={false}
>
  Your next chapter starts here
</Text>
            <Text style={styles.heroBody}>Explore Vedic astrology, career, relationships and more.</Text>
            <Text style={styles.heroAction}>Explore Pandits  →</Text>
          </Pressable>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Popular Pandits</Text>
              <Text style={styles.sectionSubtitle}>Connect with experienced professionals</Text>
            </View>
            <Pressable onPress={() => setTab('pandits')}><Text style={styles.viewAll}>View all →</Text></Pressable>
          </View>

          {popularLoading ? <ActivityIndicator color="#512779" style={styles.loader} /> : null}
          {!popularLoading && popular.length === 0 ? (
            <Pressable style={styles.emptyPreview} onPress={() => setTab('pandits')}>
              <Text style={styles.emptyTitle}>Verified Pandits will appear here</Text>
              <Text style={styles.emptyText}>Browse the directory to see available profiles.</Text>
            </Pressable>
          ) : null}
          {popular.map((pandit) => (
            <Pressable key={pandit.id} style={styles.popularCard} onPress={() => setTab('pandits')}>
              <View style={styles.avatar}><Text style={styles.avatarOm}>ॐ</Text></View>
              <View style={styles.popularInfo}>
                <Text style={styles.panditName} numberOfLines={1}>{pandit.name}</Text>
                <Text style={styles.panditMeta} numberOfLines={1}>{pandit.specialization}{pandit.experience ? ` · ${pandit.experience}+ years` : ''}</Text>
                <Text style={styles.rating}>{pandit.rating > 0 ? `★ ${pandit.rating.toFixed(1)}` : 'New profile'}{pandit.city ? `  ·  ${pandit.city}` : ''}</Text>
                <Text style={pandit.availability === 'online' ? styles.online : styles.offline}>● {pandit.availability === 'online' ? 'Online' : 'Offline'}</Text>
              </View>
              <View style={styles.priceWrap}>
                <Text style={styles.price}>₹{pandit.ratePerMinute}</Text>
                <Text style={styles.priceUnit}>/min</Text>
                <Text style={styles.cardChevron}>›</Text>
              </View>
            </Pressable>
          ))}

          <Pressable style={styles.walletCta} onPress={() => setTab('wallet')}>
            <View style={styles.walletIcon}><Text style={styles.walletIconText}>₹</Text></View>
            <View style={styles.walletCopy}>
              <Text style={styles.walletTitle}>Your Nakshatra Wallet</Text>
              <Text style={styles.walletSubtitle}>Manage your balance and payments</Text>
            </View>
            <Text style={styles.walletArrow}>›</Text>
          </Pressable>
          <Text style={styles.footerCaption}>Guidance for your journey, all in one place.</Text>
        </ScrollView>
      ) : tab === 'pandits' ? <PanditListScreen /> : tab === 'profile' ? (
        <ProfileScreen uid={uid} role="user" onBack={() => setTab('home')} onSignOut={onSignOut} />
      ) : (
        <ScrollView style={styles.screen} contentContainerStyle={styles.placeholderContent}>
          <Text style={styles.brand}>{tab === 'wallet' ? 'Wallet' : 'Transaction History'}</Text>
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>{tab === 'wallet' ? 'Your wallet is coming next' : 'Your history is coming next'}</Text>
            <Text style={styles.placeholderText}>{tab === 'wallet' ? 'Wallet balance and secure top-ups will be added with the payment system.' : 'Consultation and payment records will appear here once bookings are enabled.'}</Text>
          </View>
        </ScrollView>
      )}
      <View style={styles.tabBar}>
        {(['home', 'pandits', 'wallet', 'history', 'profile'] as UserTab[]).map((item) => (
          <Pressable key={item} style={styles.tabButton} onPress={() => setTab(item)}>
            <Text style={[styles.tabIcon, tab === item && styles.activeTab]}>{item === 'home' ? '⌂' : item === 'pandits' ? '✧' : item === 'wallet' ? '₹' : item === 'history' ? '≡' : '●'}</Text>
            <Text style={[styles.tabLabel, tab === item && styles.activeTab]}>{item === 'history' ? 'History' : item[0].toUpperCase() + item.slice(1)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userApp: { flex: 1, backgroundColor: '#FAF5EF' },
  screen: { flex: 1, backgroundColor: '#FAF5EF' },
  content: { paddingHorizontal: 22, paddingTop: 32, paddingBottom: 36 },
  panditScreen: { flex: 1, backgroundColor: '#FAF5EF' },
  panditContent: { paddingHorizontal: 20, paddingBottom: 32 },
  panditHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 18, paddingBottom: 17, borderBottomWidth: 1, borderBottomColor: '#EEE6E9', marginHorizontal: -20, paddingHorizontal: 20 },
  panditBrand: { color: '#301653', fontSize: 19, fontWeight: '800' },
  panditHeaderCaption: { color: '#8A8190', fontSize: 9, fontWeight: '800', letterSpacing: 1.3, marginTop: 2 },
  panditWelcome: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 22, paddingBottom: 18 },
  welcomeCopy: { flex: 1, paddingRight: 12 },
  panditGreeting: { color: '#684395', fontSize: 14, fontWeight: '700' },
  panditHeadline: { color: '#251A30', fontSize: 22, lineHeight: 28, fontWeight: '800', marginTop: 7 },
  welcomeMark: { width: 58, height: 58, borderRadius: 29, borderWidth: 1, borderColor: '#E7BD60', backgroundColor: '#F0E5F6', alignItems: 'center', justifyContent: 'center' },
  welcomeOm: { color: '#512779', fontSize: 29 },
  availabilityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBE4EC', borderRadius: 15, paddingHorizontal: 15, paddingVertical: 14 },
  availabilityCopy: { flex: 1 },
  availabilityTitle: { color: '#342A3D', fontSize: 14, fontWeight: '800' },
  availabilityCaption: { color: '#89828E', fontSize: 11, marginTop: 4 },
  availabilityError: { color: '#B3261E', fontSize: 12, marginTop: 7 },
  availabilityNote: { color: '#89828E', fontSize: 10, lineHeight: 15, marginTop: 7, paddingHorizontal: 2 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, minHeight: 90, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBE4EC', borderRadius: 14, padding: 10 },
  statValue: { color: '#351759', fontSize: 20, fontWeight: '800' },
  statLabel: { color: '#342A3D', fontSize: 10, fontWeight: '800', marginTop: 5 },
  statCaption: { color: '#89828E', fontSize: 8, marginTop: 3 },
  panditSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 13, marginBottom: 10 },
  emptyDashboardCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBE4EC', borderRadius: 15, padding: 20 },
  emptyIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F0E5F6', alignItems: 'center', justifyContent: 'center', marginBottom: 9 },
  emptyIconText: { color: '#512779', fontSize: 20 },
  emptyDashboardTitle: { color: '#342A3D', fontSize: 14, fontWeight: '800', marginBottom: 5 },
  emptyDashboardText: { color: '#89828E', fontSize: 11, lineHeight: 17, textAlign: 'center' },
  emptyActivity: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBE4EC', borderRadius: 14, padding: 16 },
  reviewCard: { backgroundColor: '#351759', borderRadius: 17, padding: 17 },
  reviewCardTop: { flexDirection: 'row', alignItems: 'center' },
  reviewIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#4B2C6B', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  reviewIconText: { color: '#EAC45F', fontSize: 18, fontWeight: '800' },
  reviewTitleWrap: { flex: 1 },
  reviewTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  reviewSubtitle: { color: '#D7C9E4', fontSize: 11, marginTop: 3 },
  reviewDivider: { height: 1, backgroundColor: '#563B70', marginTop: 14, marginBottom: 13 },
  statusBadge: { flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', backgroundColor: '#4A3760', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#EAC45F', marginRight: 7 },
  statusBadgeText: { color: '#F7E7B3', fontSize: 9, fontWeight: '800', letterSpacing: 0.7 },
  reviewBody: { color: '#E5D9ED', fontSize: 12, lineHeight: 18, marginTop: 10 },
  profileAction: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBE4EC', borderRadius: 14, padding: 12, marginTop: 12 },
  profileActionIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F0E5F6', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  profileActionIconText: { color: '#512779', fontSize: 20, fontWeight: '800' },
  profileActionCopy: { flex: 1 },
  profileActionTitle: { color: '#342A3D', fontSize: 13, fontWeight: '800' },
  profileActionCaption: { color: '#89828E', fontSize: 10, marginTop: 3 },
  profileActionArrow: { color: '#948D99', fontSize: 22, marginLeft: 8 },
  panditSectionTitle: { color: '#251A30', fontSize: 17, fontWeight: '800', marginTop: 23, marginBottom: 11 },
  journeyCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBE4EC', borderRadius: 16, paddingHorizontal: 15, paddingVertical: 4 },
  journeyRow: { flexDirection: 'row', alignItems: 'center', minHeight: 65 },
  journeyIconDone: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E8F3EB', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  journeyIconText: { color: '#27814D', fontSize: 14, fontWeight: '800' },
  journeyIconPending: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F8EFCF', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  journeyPendingText: { color: '#8A6818', fontSize: 12, fontWeight: '800' },
  journeyIconLocked: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F1EEF3', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  lockText: { color: '#89828E', fontSize: 16, fontWeight: '800' },
  journeyCopy: { flex: 1 },
  journeyTitle: { color: '#342A3D', fontSize: 12, fontWeight: '700' },
  journeyCaption: { color: '#89828E', fontSize: 10, marginTop: 3 },
  journeyStateDone: { color: '#27814D', fontSize: 10, fontWeight: '700' },
  journeyStatePending: { color: '#8A6818', fontSize: 10, fontWeight: '700' },
  journeyStateLocked: { color: '#89828E', fontSize: 10, fontWeight: '600' },
  journeyLine: { height: 1, backgroundColor: '#F0ECF1', marginLeft: 39 },
  workspaceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBE4EC', borderRadius: 14, padding: 13, marginBottom: 9 },
  workspaceIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F0E5F6', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  workspaceIconText: { color: '#512779', fontSize: 20, fontWeight: '700' },
  goldIcon: { backgroundColor: '#FAF0D3' },
  goldIconText: { color: '#92701C', fontSize: 18, fontWeight: '800' },
  workspaceCopy: { flex: 1 },
  workspaceTitle: { color: '#342A3D', fontSize: 13, fontWeight: '800' },
  workspaceCaption: { color: '#89828E', fontSize: 10, lineHeight: 15, marginTop: 3 },
  offlinePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F1F4', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5 },
  offlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#8B8490', marginRight: 5 },
  offlineText: { color: '#716A76', fontSize: 10, fontWeight: '700' },
  workspaceArrow: { color: '#948D99', fontSize: 22, marginLeft: 8 },
  helpCard: { backgroundColor: '#F0E8F5', borderRadius: 14, padding: 15, marginTop: 8 },
  helpTitle: { color: '#512779', fontSize: 13, fontWeight: '800' },
  helpText: { color: '#665574', fontSize: 11, lineHeight: 17, marginTop: 5 },
  homeContent: { paddingHorizontal: 20, paddingBottom: 112, flexGrow: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 13, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#EEE6E9', marginHorizontal: -20, paddingHorizontal: 20 },
  brand: { color: '#301653', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  brandTagline: { color: '#8A8190', fontSize: 9, letterSpacing: 1.5, marginTop: 5, fontWeight: '600' },
  profileButton: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#351759', borderWidth: 2, borderColor: '#EAC45F', alignItems: 'center', justifyContent: 'center' },
  profileInitial: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  signOutLink: { color: '#684395', fontSize: 13, fontWeight: '700' },
  greeting: { color: '#684395', fontWeight: '700', fontSize: 15, marginTop: 16 },
  homeTitle: { color: '#251A30', fontSize: 32, lineHeight: 39, fontWeight: '800', marginTop: 8, letterSpacing: -0.8 },
  homeSubtitle: { color: '#746C78', fontSize: 15, marginTop: 6, marginBottom: 18 },
  searchBar: { height: 64, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E7E0E8', borderRadius: 18, paddingLeft: 16, paddingRight: 7, marginBottom: 27 },
  searchIcon: { color: '#512779', fontSize: 28, marginRight: 10 },
  searchInput: { flex: 1, color: '#342A3D', fontSize: 14, paddingVertical: 6 },
  searchButton: { backgroundColor: '#351759', borderRadius: 13, paddingHorizontal: 17, paddingVertical: 11 },
  searchButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  heroCard: { backgroundColor: '#351759', borderRadius: 27, paddingHorizontal: 25, paddingVertical: 24, minHeight: 216, justifyContent: 'center' },
  heroEyebrow: { color: '#EAC45F', fontSize: 11, fontWeight: '800', letterSpacing: 1.7, marginBottom: 12 },
  heroTitle: { color: '#FFFFFF', fontSize: 22, lineHeight: 28, fontWeight: '800', letterSpacing: -0.3 },
  heroBody: { color: '#F2EAF7', fontSize: 14, lineHeight: 20, marginTop: 8 },
  heroAction: { color: '#EAC45F', fontSize: 14, fontWeight: '800', marginTop: 17 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 16 },
  sectionTitle: { color: '#251A30', fontSize: 20, fontWeight: '800' },
  sectionSubtitle: { color: '#8A828D', fontSize: 13, marginTop: 5 },
  viewAll: { color: '#512779', fontSize: 13, fontWeight: '700' },
  loader: { marginVertical: 22 },
  emptyPreview: { alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBE4EC', borderRadius: 15, padding: 20 },
  emptyTitle: { color: '#352A3D', fontSize: 14, fontWeight: '700' },
  emptyText: { color: '#817985', fontSize: 12, marginTop: 5, textAlign: 'center' },
  popularCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 23, borderWidth: 1, borderColor: '#EBE4EC', padding: 15, minHeight: 126, marginBottom: 12 },
  avatar: { width: 72, height: 72, borderRadius: 23, backgroundColor: '#F0E5F6', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  avatarOm: { color: '#512779', fontSize: 34 },
  popularInfo: { flex: 1 },
  panditName: { color: '#271C30', fontWeight: '800', fontSize: 16 },
  panditMeta: { color: '#817985', fontSize: 13, marginTop: 5 },
  rating: { color: '#927A35', fontSize: 12, fontWeight: '700', marginTop: 6 },
  online: { color: '#27814D', fontSize: 11, fontWeight: '700', marginTop: 5 },
  offline: { color: '#837D89', fontSize: 11, fontWeight: '600', marginTop: 5 },
  priceWrap: { alignItems: 'flex-end', marginLeft: 5 },
  price: { color: '#321953', fontSize: 20, fontWeight: '800' },
  priceUnit: { color: '#8A828D', fontSize: 11, marginTop: 1 },
  cardChevron: { color: '#512779', fontSize: 23, marginTop: 7 },
  walletCta: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0E8F5', borderWidth: 1, borderColor: '#E2D5E9', borderRadius: 22, padding: 17, marginTop: 24, minHeight: 104 },
  walletIcon: { width: 60, height: 60, borderRadius: 17, backgroundColor: '#351759', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  walletIconText: { color: '#EAC45F', fontSize: 27, fontWeight: '800' },
  walletCopy: { flex: 1 },
  walletTitle: { color: '#351759', fontSize: 16, fontWeight: '800' },
  walletSubtitle: { color: '#716A76', fontSize: 12, marginTop: 5 },
  walletArrow: { color: '#351759', fontSize: 27, marginLeft: 8 },
  footerCaption: { color: '#AAA3AD', textAlign: 'center', fontSize: 12, marginTop: 34, marginBottom: 20 },
  walletCtaText: { color: '#321953', fontSize: 14, fontWeight: '800' },
  tabBar: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEE7EF', paddingTop: 10, paddingBottom: 11 },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  tabIcon: { color: '#938B98', fontSize: 20, lineHeight: 22 },
  tabLabel: { color: '#817985', fontSize: 10, marginTop: 3 },
  activeTab: { color: '#351759', fontWeight: '800' },
  placeholderContent: { padding: 22, flexGrow: 1 },
  placeholderCard: { borderRadius: 16, padding: 22, backgroundColor: '#FFFFFF', borderColor: '#EBE4EC', borderWidth: 1, marginTop: 24 },
  placeholderTitle: { color: '#30283A', fontSize: 18, fontWeight: '800' },
  placeholderText: { color: '#716A76', fontSize: 14, lineHeight: 21, marginTop: 9 },
  title: { marginTop: 10, color: '#21182B', fontSize: 28, fontWeight: '700' },
  subtitle: { marginTop: 5, marginBottom: 24, color: '#6A6470', fontSize: 15 },
  statusCard: { backgroundColor: '#FFF9E9', borderColor: '#F1D995', borderWidth: 1, borderRadius: 16, padding: 18 },
  cardTitle: { color: '#30283A', fontWeight: '700', fontSize: 17 },
  cardBody: { color: '#635C67', lineHeight: 20, fontSize: 14, marginTop: 7 },
  badge: { alignSelf: 'flex-start', borderRadius: 20, backgroundColor: '#F6E7B8', paddingHorizontal: 10, paddingVertical: 6, marginTop: 14 },
  badgeText: { color: '#75590C', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  tile: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#EEEAF1' },
  tileTitle: { color: '#30283A', fontWeight: '700', fontSize: 15 },
  tileBody: { color: '#716B76', fontSize: 13, lineHeight: 19, marginTop: 5 },
});
