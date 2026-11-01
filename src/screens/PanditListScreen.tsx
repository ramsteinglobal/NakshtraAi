import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { fetchApprovedPandits, type Pandit } from '../services/pandits';

const filters = ['All', 'Astrology', 'Puja', 'Numerology', 'Tarot'] as const;
type ProfileTab = 'About' | 'Specialties' | 'Reviews';

export default function PanditListScreen() {
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('All');
  const [selected, setSelected] = useState<Pandit | null>(null);
  const [profileTab, setProfileTab] = useState<ProfileTab>('About');

  const loadPandits = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchApprovedPandits();
      setPandits(items);
    } catch {
      setError('Could not load Pandits. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetchApprovedPandits()
      .then(items => {
        if (active) setPandits(items);
      })
      .catch(() => {
        if (active) setError('Could not load Pandits. Check your connection and try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visiblePandits = useMemo(() => {
    const term = search.trim().toLowerCase();
    return pandits.filter(pandit => {
      const matchesFilter =
        filter === 'All' ||
        pandit.specialization.toLowerCase().includes(filter.toLowerCase());

      const haystack = [
        pandit.name,
        pandit.city,
        pandit.specialization,
        ...pandit.languages,
      ]
        .join(' ')
        .toLowerCase();

      return matchesFilter && (!term || haystack.includes(term));
    });
  }, [filter, pandits, search]);

  const openProfile = (pandit: Pandit) => {
    setProfileTab('About');
    setSelected(pandit);
  };

  if (selected) {
    return (
      <View style={styles.profileScreen}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.profileContent}
          showsVerticalScrollIndicator={false}>

          <View style={styles.profileHeader}>
            <Pressable
              onPress={() => setSelected(null)}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Back to all Pandits">
              <Text style={styles.backText}>‹</Text>
            </Pressable>

            <Text style={styles.profileHeaderTitle}>Pandit Profile</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.profileHero}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarOmLarge}>ॐ</Text>
            </View>

            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>✓</Text>
            </View>

            <Text style={styles.profileName}>{selected.name}</Text>

            <Text style={styles.profileSpecialty}>
              {selected.specialization}
              {selected.experience ? ` · ${selected.experience}+ years` : ''}
            </Text>

            <View style={styles.profileMetaRow}>
              <Text style={styles.profileMeta}>
                {selected.city || 'Location not provided'}
              </Text>

              <Text style={styles.metaDot}>•</Text>

              <Text
                style={[
                  styles.profileOnline,
                  selected.availability !== 'online' && styles.profileOffline,
                ]}>
                {selected.availability === 'online' ? '● Online' : '● Offline'}
              </Text>
            </View>

            <View style={styles.ratingSummary}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingNumber}>
                {selected.rating > 0 ? selected.rating.toFixed(1) : 'New'}
              </Text>
              <Text style={styles.ratingOutOf}>
                {selected.rating > 0 ? 'rating' : 'profile'}
              </Text>
            </View>

            <Text style={styles.profilePrice}>
              ₹{selected.ratePerMinute}/min
            </Text>
          </View>

          <View style={styles.profileTabs}>
            {(['About', 'Specialties', 'Reviews'] as ProfileTab[]).map(item => (
              <Pressable
                key={item}
                onPress={() => setProfileTab(item)}
                style={[
                  styles.profileTab,
                  profileTab === item && styles.profileTabActive,
                ]}>
                <Text
                  style={[
                    styles.profileTabText,
                    profileTab === item && styles.profileTabTextActive,
                  ]}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          {profileTab === 'About' ? (
            <View style={styles.detailCard}>
              <Text style={styles.detailTitle}>About Pandit</Text>

              <Text style={styles.detailBody}>
                {selected.bio?.trim() ||
                  'This Pandit has not added an introduction yet.'}
              </Text>

              <View style={styles.detailDivider} />

              <Text style={styles.detailTitle}>Languages</Text>

              {selected.languages.length > 0 ? (
                <View style={styles.languageWrap}>
                  {selected.languages.map(language => (
                    <View key={language} style={styles.languageChip}>
                      <Text style={styles.languageText}>{language}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.detailBody}>
                  Languages not provided.
                </Text>
              )}

              <View style={styles.detailDivider} />

              <Text style={styles.detailTitle}>Experience</Text>

              <Text style={styles.detailBody}>
                {selected.experience
                  ? `${selected.experience}+ years of experience`
                  : 'Experience details not provided.'}
              </Text>
            </View>
          ) : null}

          {profileTab === 'Specialties' ? (
            <View style={styles.detailCard}>
              <Text style={styles.detailTitle}>Specialties</Text>

              <View style={styles.specialtyChip}>
                <Text style={styles.specialtyChipText}>
                  {selected.specialization || 'Specialization not provided'}
                </Text>
              </View>

              <Text style={styles.detailBody}>
                Contact this Pandit to confirm which specific services are available.
              </Text>
            </View>
          ) : null}
                    {profileTab === 'Reviews' ? (
            <View>
              <View style={styles.reviewSummaryCard}>
                <View style={styles.reviewSummaryLeft}>
                  <Text style={styles.reviewScore}>
                    {selected.rating > 0 ? selected.rating.toFixed(1) : '—'}
                    <Text style={styles.reviewScoreSmall}> / 5</Text>
                  </Text>

                  <Text style={styles.reviewStars}>★★★★★</Text>

                  <Text style={styles.reviewSummaryCaption}>
                    Overall profile rating
                  </Text>
                </View>

                <View style={styles.reviewSummaryDivider} />

                <View style={styles.reviewSummaryRight}>
                  <Text style={styles.reviewCount}>Rating summary</Text>

                  <Text style={styles.reviewSummaryNote}>
                    {selected.rating > 0
                      ? 'This score comes from the Pandit profile.'
                      : 'A rating has not been added yet.'}
                  </Text>
                </View>
              </View>

              <View style={styles.reviewNotice}>
                <Text style={styles.reviewNoticeTitle}>
                  Customer reviews
                </Text>

                <Text style={styles.reviewNoticeText}>
                  Individual customer reviews are not available from the current
                  profile data. They will appear here when the backend team
                  provides the reviews API.
                </Text>
              </View>

              <View style={styles.reviewEmptyCard}>
                <View style={styles.reviewEmptyIcon}>
                  <Text style={styles.reviewEmptyStar}>★</Text>
                </View>

                <Text style={styles.reviewEmptyTitle}>
                  No written reviews yet
                </Text>

                <Text style={styles.reviewEmptyText}>
                  Customer feedback will be displayed here after consultations
                  and once review data is connected.
                </Text>
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.consultationBar}>
          <View style={styles.consultationPriceWrap}>
            <Text style={styles.consultationPrice}>
              ₹{selected.ratePerMinute}
            </Text>
            <Text style={styles.consultationUnit}>per minute</Text>
          </View>

          <Pressable
            style={[styles.consultButton, styles.audioButton]}
            onPress={() => {}}
            disabled>
            <Text style={styles.audioButtonText}>Audio Call</Text>
          </Pressable>

          <Pressable
            style={[styles.consultButton, styles.videoButton]}
            onPress={() => {}}
            disabled>
            <Text style={styles.videoButtonText}>Video Call</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>

      <Text style={styles.title}>Find your Pandit</Text>

      <Text style={styles.subtitle}>
        Explore verified spiritual guides.
      </Text>

      <TextInput
        style={styles.search}
        placeholder="Search name, specialty or language"
        placeholderTextColor="#8A8490"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
        returnKeyType="search"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}>
        {filters.map(item => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.filterChip,
              filter === item && styles.filterSelected,
            ]}>
            <Text
              style={[
                styles.filterText,
                filter === item && styles.filterTextSelected,
              ]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#512779" />
          <Text style={styles.muted}>Loading verified Pandits…</Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Unable to load</Text>
          <Text style={styles.muted}>{error}</Text>

          <Pressable onPress={loadPandits}>
            <Text style={styles.retry}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {!loading && !error && visiblePandits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyOm}>ॐ</Text>

          <Text style={styles.emptyTitle}>
            {search || filter !== 'All'
              ? 'No matching Pandits'
              : 'Pandits are on their way'}
          </Text>

          <Text style={styles.muted}>
            {search || filter !== 'All'
              ? 'Try another search or specialty.'
              : 'Verified Pandit profiles will appear here once approved.'}
          </Text>
        </View>
      ) : null}

      {visiblePandits.map(pandit => (
        <Pressable
          key={pandit.id}
          style={styles.panditCard}
          onPress={() => openProfile(pandit)}
          accessibilityRole="button">

          <View style={styles.avatar}>
            <Text style={styles.avatarOm}>ॐ</Text>
          </View>

          <View style={styles.panditInfo}>
            <Text style={styles.panditName} numberOfLines={1}>
              {pandit.name}
            </Text>

            <Text style={styles.panditMeta} numberOfLines={1}>
              {pandit.specialization}
              {pandit.experience ? ` · ${pandit.experience}+ years` : ''}
            </Text>

            <Text style={styles.rating}>
              {pandit.rating > 0
                ? `★ ${pandit.rating.toFixed(1)}`
                : 'New profile'}
              {pandit.city ? `  ·  ${pandit.city}` : ''}
            </Text>

            <Text
              style={
                pandit.availability === 'online'
                  ? styles.online
                  : styles.offline
              }>
              ● {pandit.availability === 'online' ? 'Online' : 'Offline'}
            </Text>
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.price}>₹{pandit.ratePerMinute}</Text>
            <Text style={styles.perMinute}>/min</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAF5EF',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    color: '#251A30',
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: '#746C78',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 18,
  },
  search: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderColor: '#E8DFE8',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#251A30',
  },
  filters: {
    gap: 8,
    paddingVertical: 16,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: '#E5DDE9',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  filterSelected: {
    borderColor: '#351759',
    backgroundColor: '#351759',
  },
  filterText: {
    color: '#564C5E',
    fontWeight: '600',
    fontSize: 13,
  },
  filterTextSelected: {
    color: '#FFFFFF',
  },
  panditCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBE4EC',
    borderRadius: 18,
    padding: 13,
    marginBottom: 11,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: '#F0E5F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarLarge: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#F0E5F6',
    borderColor: '#E7BD60',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOm: {
    color: '#512779',
    fontSize: 28,
    fontWeight: '600',
  },
  avatarOmLarge: {
    color: '#512779',
    fontSize: 49,
    fontWeight: '600',
  },
  panditInfo: {
    flex: 1,
  },
  panditName: {
    color: '#271C30',
    fontWeight: '700',
    fontSize: 15,
  },
  panditMeta: {
    color: '#817985',
    fontSize: 12,
    marginTop: 3,
  },
  rating: {
    color: '#42384A',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  online: {
    color: '#27814D',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  offline: {
    color: '#837D89',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  priceBox: {
    alignItems: 'flex-end',
    minWidth: 48,
    marginLeft: 5,
  },
  price: {
    color: '#321953',
    fontSize: 15,
    fontWeight: '800',
  },
  perMinute: {
    color: '#77717D',
    fontSize: 10,
  },
  chevron: {
    color: '#8B8490',
    fontSize: 22,
    lineHeight: 24,
    marginTop: 8,
  },
  center: {
    alignItems: 'center',
    paddingVertical: 44,
    gap: 12,
  },
  muted: {
    color: '#77717D',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  empty: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 30,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#EBE4EC',
  },
  emptyOm: {
    color: '#684395',
    fontSize: 30,
    marginBottom: 8,
  },
  emptyTitle: {
    color: '#30283A',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  retry: {
    color: '#512779',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 14,
  },
  profileScreen: {
    flex: 1,
    backgroundColor: '#FAF5EF',
  },
  profileContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE6E9',
  },
  backButton: {
    width: 42,
    height: 36,
    justifyContent: 'center',
  },
  backText: {
    color: '#351759',
    fontSize: 34,
    lineHeight: 36,
  },
  profileHeaderTitle: {
    color: '#251A30',
    fontSize: 16,
    fontWeight: '800',
  },
  headerSpacer: {
    width: 42,
  },
  profileHero: {
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 22,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 99,
    right: '34%',
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#351759',
    borderWidth: 2,
    borderColor: '#FAF5EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  profileName: {
    color: '#251A30',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 13,
    textAlign: 'center',
  },
  profileSpecialty: {
    color: '#665D6E',
    fontSize: 13,
    marginTop: 5,
    textAlign: 'center',
  },
  profileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
  profileMeta: {
    color: '#807984',
    fontSize: 12,
  },
  metaDot: {
    color: '#A49BA8',
    marginHorizontal: 7,
  },
  profileOnline: {
    color: '#27814D',
    fontSize: 12,
    fontWeight: '700',
  },
  profileOffline: {
    color: '#837D89',
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
  },
  ratingStar: {
    color: '#D99B25',
    fontSize: 17,
    marginRight: 5,
  },
  ratingNumber: {
    color: '#30283A',
    fontSize: 16,
    fontWeight: '800',
  },
  ratingOutOf: {
    color: '#817985',
    fontSize: 12,
    marginLeft: 5,
  },
  profilePrice: {
    color: '#351759',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 7,
  },
  profileTabs: {
    flexDirection: 'row',
    backgroundColor: '#F0E8F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  profileTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 9,
  },
  profileTabActive: {
    backgroundColor: '#FFFFFF',
  },
  profileTabText: {
    color: '#756A7D',
    fontSize: 12,
    fontWeight: '700',
  },
  profileTabTextActive: {
    color: '#351759',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBE4EC',
    borderRadius: 16,
    padding: 17,
    marginBottom: 13,
  },
  detailTitle: {
    color: '#30283A',
    fontSize: 15,
    fontWeight: '800',
  },
  detailBody: {
    color: '#716A76',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#F0ECF1',
    marginVertical: 15,
  },
  languageWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  languageChip: {
    backgroundColor: '#F0E8F5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  languageText: {
    color: '#512779',
    fontSize: 12,
    fontWeight: '700',
  },
  specialtyChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0E8F5',
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginTop: 12,
  },
  specialtyChipText: {
    color: '#512779',
    fontSize: 12,
    fontWeight: '700',
  },

  // Reviews UI
  reviewSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBE4EC',
    borderRadius: 16,
    padding: 17,
    marginBottom: 13,
  },
  reviewSummaryLeft: {
    flex: 0.9,
    alignItems: 'center',
  },
  reviewScore: {
    color: '#30283A',
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
  },
  reviewScoreSmall: {
    color: '#817985',
    fontSize: 15,
    fontWeight: '500',
  },
  reviewStars: {
    color: '#E2A52E',
    fontSize: 20,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 5,
  },
  reviewSummaryCaption: {
    color: '#817985',
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
  },
  reviewSummaryDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: '#EEE7EF',
    marginHorizontal: 14,
  },
  reviewSummaryRight: {
    flex: 1.1,
    justifyContent: 'center',
  },
  reviewCount: {
    color: '#30283A',
    fontSize: 13,
    fontWeight: '800',
  },
  reviewSummaryNote: {
    color: '#716A76',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },
  reviewNotice: {
    backgroundColor: '#F0E8F5',
    borderRadius: 13,
    padding: 14,
    marginBottom: 13,
  },
  reviewNoticeTitle: {
    color: '#351759',
    fontSize: 13,
    fontWeight: '800',
  },
  reviewNoticeText: {
    color: '#665A70',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },
  reviewEmptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBE4EC',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 25,
  },
  reviewEmptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FBF3DF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 11,
  },
  reviewEmptyStar: {
    color: '#D99B25',
    fontSize: 25,
  },
  reviewEmptyTitle: {
    color: '#30283A',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  reviewEmptyText: {
    color: '#716A76',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 7,
  },

  consultationBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE7EF',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 8,
  },
  consultationPriceWrap: {
    marginRight: 'auto',
  },
  consultationPrice: {
    color: '#351759',
    fontSize: 17,
    fontWeight: '800',
  },
  consultationUnit: {
    color: '#817985',
    fontSize: 10,
    marginTop: 2,
  },
  consultButton: {
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
    alignItems: 'center',
  },
  audioButton: {
    backgroundColor: '#351759',
  },
  videoButton: {
    backgroundColor: '#EAC45F',
  },
  audioButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  videoButtonText: {
    color: '#351759',
    fontSize: 11,
    fontWeight: '800',
  },
});