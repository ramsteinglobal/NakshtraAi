import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';

const QUICK_AMOUNTS = [100, 500, 1000, 2000];

export default function WalletScreen() {
  const [selectedAmount, setSelectedAmount] = useState(500);

  const showComingSoon = (feature: string) => {
    Alert.alert(feature, 'This frontend screen will be implemented in the next step.');
  };

  const handleAddMoney = () => {
    Alert.alert(
      'Add Money',
      `Selected amount: ₹${selectedAmount}\nThe Add Money screen and payment integration will be added next.`,
    );
  };

  return (
    <ScreenContainer>
      <AppHeader title="Wallet Home" showBack={false} />

      <View style={styles.headingBlock}>
        <Text style={styles.heading}>Your Wallet</Text>
        <Text style={styles.subtitle}>
          Manage your balance and consultation payments.
        </Text>
      </View>

      <AppCard style={styles.balanceCard}>
        <View style={styles.balanceTopRow}>
          <View>
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
            <Text style={styles.balanceAmount}>₹500</Text>
            <Text style={styles.balanceCaption}>Available balance</Text>
          </View>
          <View style={styles.walletIcon}>
            <Text style={styles.walletIconText}>₹</Text>
          </View>
        </View>

        <AppButton
          title="+  Add Money"
          variant="secondary"
          onPress={handleAddMoney}
          style={styles.addMoneyButton}
        />
      </AppCard>

      <Text style={styles.sectionTitle}>Quick Add</Text>
      <Text style={styles.sectionSubtitle}>
        Choose an amount to add to your wallet.
      </Text>

      <View style={styles.amountGrid}>
        {QUICK_AMOUNTS.map(amount => {
          const active = selectedAmount === amount;
          return (
            <Pressable
              key={amount}
              onPress={() => setSelectedAmount(amount)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[styles.amountChip, active && styles.amountChipActive]}>
              <Text style={[styles.amountText, active && styles.amountTextActive]}>
                ₹{amount}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <AppButton
        title={`Add ₹${selectedAmount}`}
        onPress={handleAddMoney}
        style={styles.proceedButton}
      />

      <Text style={styles.sectionTitle}>Wallet Activities</Text>

      <AppCard style={styles.menuCard}>
        <WalletMenuRow
          icon="↔"
          title="Transaction History"
          subtitle="View wallet credits and debits"
          onPress={() => showComingSoon('Transaction History')}
        />
        <View style={styles.separator} />
        <WalletMenuRow
          icon="▣"
          title="Payment Methods"
          subtitle="Manage your payment options"
          onPress={() => showComingSoon('Payment Methods')}
        />
        <View style={styles.separator} />
        <WalletMenuRow
          icon="%"
          title="Promo Codes"
          subtitle="Apply an offer or discount"
          onPress={() => showComingSoon('Promo Codes')}
        />
        <View style={styles.separator} />
        <WalletMenuRow
          icon="⚙"
          title="Manage Wallet"
          subtitle="Wallet settings and preferences"
          onPress={() => showComingSoon('Manage Wallet')}
        />
      </AppCard>

      <View style={styles.footerNote}>
        <Text style={styles.footerNoteText}>
          Your wallet balance and transactions shown here are sample frontend
          data. Live wallet information will be connected when the backend API
          is provided.
        </Text>
      </View>
    </ScreenContainer>
  );
}

type WalletMenuRowProps = {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
};

function WalletMenuRow({
  icon,
  title,
  subtitle,
  onPress,
}: WalletMenuRowProps) {
  return (
    <Pressable onPress={onPress} style={styles.menuRow} accessibilityRole="button">
      <View style={styles.menuIcon}>
        <Text style={styles.menuIconText}>{icon}</Text>
      </View>
      <View style={styles.menuTextBlock}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.menuChevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headingBlock: { marginTop: 8, marginBottom: 16 },
  heading: { color: '#251A30', fontSize: 23, fontWeight: '800' },
  subtitle: { color: '#746C78', fontSize: 13, lineHeight: 19, marginTop: 4 },
  balanceCard: {
    backgroundColor: '#351759',
    borderColor: '#351759',
    padding: 18,
    marginBottom: 22,
  },
  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: { color: '#E9DFF1', fontSize: 13, fontWeight: '600' },
  balanceAmount: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginTop: 5 },
  balanceCaption: { color: '#D6C7E2', fontSize: 11, marginTop: 2 },
  walletIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletIconText: { color: '#EAC45F', fontSize: 29, fontWeight: '800' },
  addMoneyButton: { marginTop: 18, minHeight: 46 },
  sectionTitle: { color: '#30283A', fontSize: 16, fontWeight: '800', marginBottom: 5 },
  sectionSubtitle: { color: '#817985', fontSize: 12, marginBottom: 12 },
  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  amountChip: {
    flexGrow: 1,
    flexBasis: '20%',
    minHeight: 43,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5DDE9',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountChipActive: { borderColor: '#351759', backgroundColor: '#F0E8F5' },
  amountText: { color: '#564C5E', fontSize: 13, fontWeight: '700' },
  amountTextActive: { color: '#351759' },
  proceedButton: { marginBottom: 24 },
  menuCard: { paddingVertical: 4, paddingHorizontal: 14, marginTop: 8 },
  menuRow: { minHeight: 67, flexDirection: 'row', alignItems: 'center' },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0E8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIconText: { color: '#512779', fontSize: 19, fontWeight: '800' },
  menuTextBlock: { flex: 1 },
  menuTitle: { color: '#30283A', fontSize: 13, fontWeight: '700' },
  menuSubtitle: { color: '#817985', fontSize: 11, marginTop: 3 },
  menuChevron: { color: '#8B8490', fontSize: 24, marginLeft: 8 },
  separator: { height: 1, backgroundColor: '#F0ECF1', marginLeft: 50 },
  footerNote: { paddingHorizontal: 4, paddingTop: 5, paddingBottom: 16 },
  footerNoteText: {
    color: '#817985',
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
  },
});
