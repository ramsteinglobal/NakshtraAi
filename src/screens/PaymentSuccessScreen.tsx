import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';

export default function PaymentSuccessScreen() {
  const navigation = useNavigation();

  const handleViewDetails = () => {
    Alert.alert(
      'Payment Details',
      'Transaction details will appear here when the payment API is connected.',
    );
  };

  return (
    <ScreenContainer>
      <AppHeader title="Payment Success" showBack={false} />

      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>
          Your wallet has been credited successfully.
        </Text>

        <AppCard style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount Added</Text>
          <Text style={styles.amount}>₹500</Text>
          <View style={styles.divider} />
          <DetailRow label="Payment Status" value="Successful" valueStyle={styles.successText} />
          <DetailRow label="Payment Method" value="UPI (sample)" />
          <DetailRow label="Transaction ID" value="TXN-123456" />
          <DetailRow label="Date & Time" value="Sample transaction" />
        </AppCard>

        <View style={styles.note}>
          <Text style={styles.noteText}>
            This is a sample success screen. The amount, payment method and
            transaction ID are placeholders until connected to the payment API.
          </Text>
        </View>

        <AppButton
          title="View Details"
          variant="outline"
          onPress={handleViewDetails}
          style={styles.secondaryButton}
        />

        <AppButton
          title="Back to Wallet"
          onPress={() => navigation.goBack()}
          style={styles.primaryButton}
        />
      </View>
    </ScreenContainer>
  );
}

function DetailRow({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: object;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 26,
  },
  successIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#DDF5E6',
    borderWidth: 1,
    borderColor: '#A8E2BC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  check: {
    color: '#159447',
    fontSize: 45,
    fontWeight: '700',
  },
  title: {
    color: '#188447',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#746C78',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 22,
  },
  amountCard: {
    width: '100%',
    padding: 18,
  },
  amountLabel: {
    color: '#817985',
    fontSize: 12,
    textAlign: 'center',
  },
  amount: {
    color: '#251A30',
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0ECF1',
    marginVertical: 17,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 12,
  },
  detailLabel: {
    flex: 1,
    color: '#817985',
    fontSize: 11,
  },
  detailValue: {
    flex: 1,
    color: '#30283A',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
  successText: {
    color: '#188447',
  },
  note: {
    width: '100%',
    backgroundColor: '#F0E8F5',
    borderRadius: 12,
    padding: 12,
    marginTop: 2,
  },
  noteText: {
    color: '#665A70',
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
  },
  secondaryButton: {
    width: '100%',
    marginTop: 18,
  },
  primaryButton: {
    width: '100%',
    marginTop: 10,
  },
});
