import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { fetchApprovedPandits, type Pandit } from '../services/pandits';

const filters = ['All', 'Astrology', 'Puja', 'Numerology', 'Tarot'];

export default function PanditListScreen() {
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<Pandit | null>(null);

  useEffect(() => {
    let active = true;
    fetchApprovedPandits()
      .then((items) => { if (active) setPandits(items); })
      .catch(() => { if (active) setError('Could not load Pandits. Check your connection and try again.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const visiblePandits = useMemo(() => {
    const term = search.trim().toLowerCase();
    return pandits.filter((pandit) => {
      const matchesFilter = filter === 'All' || pandit.specialization.toLowerCase().includes(filter.toLowerCase());
      const haystack = [pandit.name, pandit.city, pandit.specialization, ...pandit.languages].join(' ').toLowerCase();
      return matchesFilter && (!term || haystack.includes(term));
    });
  }, [filter, pandits, search]);

  if (selected) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Pressable onPress={() => setSelected(null)} style={styles.back}><Text style={styles.backText}>‹  All Pandits</Text></Pressable>
        <View style={styles.profileHero}>
          <View style={styles.avatarLarge}><Text style={styles.avatarOm}>ॐ</Text></View>
          <Text style={styles.profileName}>{selected.name}</Text>
          <Text style={styles.profileSpecialty}>{selected.specialization}{selected.experience ? ` · ${selected.experience}+ years` : ''}</Text>
          <Text style={styles.profileLocation}>{selected.city}{selected.languages.length ? ` · ${selected.languages.join(', ')}` : ''}</Text>
          <View style={styles.badge}><Text style={selected.availability === 'online' ? styles.online : styles.offline}>● {selected.availability === 'online' ? 'Online' : 'Offline'}</Text></View>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About</Text>
          <Text style={styles.infoBody}>{selected.bio || 'Pandit profile verified by NakshatraAI.'}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Consultation</Text>
          <Text style={styles.infoBody}>₹{selected.ratePerMinute}/min  ·  {selected.rating > 0 ? `★ ${selected.rating.toFixed(1)}` : 'New on NakshatraAI'}</Text>
        </View>
        <View style={styles.notice}><Text style={styles.noticeText}>Chat, audio and video consultations will be enabled in the next feature step.</Text></View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Find your Pandit</Text>
      <Text style={styles.subtitle}>Explore verified spiritual guides.</Text>
      <TextInput
        style={styles.search}
        placeholder="Search name, specialty or language"
        placeholderTextColor="#8A8490"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {filters.map((item) => (
          <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filterChip, filter === item && styles.filterSelected]}>
            <Text style={[styles.filterText, filter === item && styles.filterTextSelected]}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {loading ? <View style={styles.center}><ActivityIndicator color="#512779" /><Text style={styles.muted}>Loading verified Pandits…</Text></View> : null}
      {error ? (
        <View style={styles.empty}><Text style={styles.emptyTitle}>Unable to load</Text><Text style={styles.muted}>{error}</Text><Pressable onPress={() => { setLoading(true); setError(null); fetchApprovedPandits().then(setPandits).catch(() => setError('Could not load Pandits. Check your connection and try again.')).finally(() => setLoading(false)); }}><Text style={styles.retry}>Try again</Text></Pressable></View>
      ) : null}
      {!loading && !error && visiblePandits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyOm}>ॐ</Text>
          <Text style={styles.emptyTitle}>{search || filter !== 'All' ? 'No matching Pandits' : 'Pandits are on their way'}</Text>
          <Text style={styles.muted}>{search || filter !== 'All' ? 'Try another search or specialty.' : 'Verified Pandit profiles will appear here once approved.'}</Text>
        </View>
      ) : null}
      {visiblePandits.map((pandit) => (
        <Pressable key={pandit.id} style={styles.panditCard} onPress={() => setSelected(pandit)}>
          <View style={styles.avatar}><Text style={styles.avatarOm}>ॐ</Text></View>
          <View style={styles.panditInfo}>
            <Text style={styles.panditName}>{pandit.name}</Text>
            <Text style={styles.panditMeta} numberOfLines={1}>{pandit.specialization}{pandit.experience ? ` · ${pandit.experience}+ years` : ''}</Text>
            <Text style={styles.rating}>{pandit.rating > 0 ? `★ ${pandit.rating.toFixed(1)}` : 'New profile'}{pandit.city ? `  ·  ${pandit.city}` : ''}</Text>
            <Text style={pandit.availability === 'online' ? styles.online : styles.offline}>● {pandit.availability === 'online' ? 'Online' : 'Offline'}</Text>
          </View>
          <View style={styles.priceBox}><Text style={styles.price}>₹{pandit.ratePerMinute}</Text><Text style={styles.perMinute}>/min</Text><Text style={styles.chevron}>›</Text></View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAF5EF' },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 22 },
  title: { color: '#251A30', fontSize: 26, fontWeight: '800' },
  subtitle: { color: '#746C78', fontSize: 14, marginTop: 5, marginBottom: 18 },
  search: { height: 52, backgroundColor: '#FFFFFF', borderColor: '#E8DFE8', borderWidth: 1, borderRadius: 14, paddingHorizontal: 15, fontSize: 14, color: '#251A30' },
  filters: { gap: 8, paddingVertical: 16 },
  filterChip: { borderWidth: 1, borderColor: '#E5DDE9', backgroundColor: '#FFFFFF', borderRadius: 22, paddingHorizontal: 15, paddingVertical: 9 },
  filterSelected: { borderColor: '#351759', backgroundColor: '#351759' },
  filterText: { color: '#564C5E', fontWeight: '600', fontSize: 13 },
  filterTextSelected: { color: '#FFFFFF' },
  panditCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBE4EC', borderRadius: 16, padding: 13, marginBottom: 11 },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#F0E5F6', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarLarge: { width: 92, height: 92, borderRadius: 46, backgroundColor: '#F0E5F6', borderColor: '#E7BD60', borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  avatarOm: { color: '#512779', fontSize: 28, fontWeight: '600' },
  panditInfo: { flex: 1 },
  panditName: { color: '#271C30', fontWeight: '700', fontSize: 15 },
  panditMeta: { color: '#817985', fontSize: 12, marginTop: 3 },
  rating: { color: '#42384A', fontSize: 12, fontWeight: '600', marginTop: 4 },
  online: { color: '#27814D', fontSize: 11, fontWeight: '700', marginTop: 4 },
  offline: { color: '#837D89', fontSize: 11, fontWeight: '600', marginTop: 4 },
  priceBox: { alignItems: 'flex-end', minWidth: 48, marginLeft: 5 },
  price: { color: '#321953', fontSize: 14, fontWeight: '800' },
  perMinute: { color: '#77717D', fontSize: 10 },
  chevron: { color: '#8B8490', fontSize: 22, lineHeight: 24, marginTop: 8 },
  center: { alignItems: 'center', paddingVertical: 44, gap: 12 },
  muted: { color: '#77717D', fontSize: 13, lineHeight: 20, textAlign: 'center' },
  empty: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 22, paddingVertical: 30, marginTop: 8, borderWidth: 1, borderColor: '#EBE4EC' },
  emptyOm: { color: '#684395', fontSize: 30, marginBottom: 8 },
  emptyTitle: { color: '#30283A', fontSize: 17, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  retry: { color: '#512779', fontSize: 14, fontWeight: '700', marginTop: 14 },
  back: { paddingVertical: 4, marginBottom: 20 },
  backText: { color: '#512779', fontWeight: '700', fontSize: 15 },
  profileHero: { alignItems: 'center', paddingVertical: 22 },
  profileName: { color: '#251A30', fontSize: 24, fontWeight: '800', marginTop: 15 },
  profileSpecialty: { color: '#665D6E', fontSize: 14, marginTop: 6, textAlign: 'center' },
  profileLocation: { color: '#807984', fontSize: 13, marginTop: 5, textAlign: 'center' },
  badge: { backgroundColor: '#EAF5ED', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginTop: 12 },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#EBE4EC' },
  infoTitle: { color: '#30283A', fontSize: 15, fontWeight: '700' },
  infoBody: { color: '#716A76', fontSize: 14, lineHeight: 21, marginTop: 7 },
  notice: { backgroundColor: '#F0E8F5', borderRadius: 12, padding: 14 },
  noticeText: { color: '#52366B', fontSize: 13, lineHeight: 19, textAlign: 'center' },
});
