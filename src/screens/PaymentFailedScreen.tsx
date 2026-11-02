import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';

export default function PaymentFailedScreen() {
  const navigation = useNavigation();

  const handleSupport = () => {
    Alert.alert(
      'Contact Support',
      'Support contact details will be connected in a later frontend step.',
    );
  };

  return (
    <ScreenContainer>
      <AppHeader title="Payment Failed" showBack={false} />

      <View style={styles.content}>
        <View style={styles.failedIcon}>
          <Text style={styles.cross}>×</Text>
        </View>

        <Text style={styles.title}>Payment Failed</Text>
        <Text style={styles.subtitle}>
          Your payment could not be completed. Please try again.
        </Text>

        <AppCard style={styles.infoCard}>
          <Text style={styles.infoTitle}>Payment Details</Text>
          <DetailRow label="Amount" value="₹500" />
          <DetailRow label="Payment Status" value="Failed" valueStyle={styles.failedText} />
          <DetailRow label="Payment Method" value="UPI (sample)" />
          <DetailRow label="Transaction ID" value="TXN-123456" />
        </AppCard>

        <View style={styles.helpBox}>
          <Text style={styles.helpTitle}>What can you do?</Text>
          <Text style={styles.helpText}>
            • Check your internet connection.{'\n'}
            • Check your bank or UPI app for the payment status.{'\n'}
            • If money was deducted, contact support before retrying.
          </Text>
        </View>

        <AppButton
          title="Try Again"
          onPress={() => navigation.goBack()}
          style={styles.primaryButton}
        />

        <AppButton
          title="Contact Support"
          variant="outline"
          onPress={handleSupport}
          style={styles.secondaryButton}
        />

        <Text style={styles.disclaimer}>
          Sample frontend screen. No real payment was attempted.
        </Text>
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
  failedIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#FDE5E5',
    borderWidth: 1,
    borderColor: '#F5B8B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  cross: {
    color: '#E53935',
    fontSize: 54,
    fontWeight: '400',
    lineHeight: 60,
  },
  title: {
    color: '#D83232',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#746C78',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 22,
    paddingHorizontal: 12,
  },
  infoCard: {
    width: '100%',
    padding: 18,
  },
  infoTitle: {
    color: '#30283A',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 17,
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
  failedText: {
    color: '#D83232',
  },
  helpBox: {
    width: '100%',
    backgroundColor: '#F0E8F5',
    borderRadius: 12,
    padding: 13,
    marginTop: 2,
  },
  helpTitle: {
    color: '#351759',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  helpText: {
    color: '#665A70',
    fontSize: 11,
    lineHeight: 19,
  },
  primaryButton: {
    width: '100%',
    marginTop: 18,
  },
  secondaryButton: {
    width: '100%',
    marginTop: 10,
  },
  disclaimer: {
    color: '#817985',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 12,
  },
});
