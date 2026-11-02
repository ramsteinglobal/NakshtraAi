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
import AppInput from '../components/AppInput';

type PaymentMethod = 'razorpay' | 'upi' | 'card' | 'netbanking';

const PAYMENT_METHODS: {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  icon: string;
}[] = [
  {
    id: 'razorpay',
    title: 'Razorpay',
    subtitle: 'UPI, Cards, Net Banking',
    icon: 'R',
  },
  {
    id: 'upi',
    title: 'UPI',
    subtitle: 'Google Pay, PhonePe, Paytm',
    icon: '₹',
  },
  {
    id: 'card',
    title: 'Credit / Debit Card',
    subtitle: 'Visa, Mastercard and RuPay',
    icon: '▤',
  },
  {
    id: 'netbanking',
    title: 'Net Banking',
    subtitle: 'Pay using your bank account',
    icon: '⌂',
  },
];

const QUICK_AMOUNTS = [100, 500, 1000, 2000];

export default function AddMoneyScreen() {
  const [amount, setAmount] = useState('500');
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod>('razorpay');
  const [amountError, setAmountError] = useState('');

  const numericAmount = Number(amount);
  const isValidAmount =
    amount.trim().length > 0 &&
    Number.isFinite(numericAmount) &&
    Number.isInteger(numericAmount) &&
    numericAmount >= 10 &&
    numericAmount <= 50000;

  const chooseAmount = (value: number) => {
    setAmount(String(value));
    setAmountError('');
  };

  const handleProceed = () => {
    if (!isValidAmount) {
      setAmountError('Enter an amount between ₹10 and ₹50,000.');
      return;
    }

    const method = PAYMENT_METHODS.find(item => item.id === selectedMethod);

    Alert.alert(
      'Payment flow pending',
      `Amount: ₹${numericAmount}\nPayment method: ${method?.title}\n\nThis is a frontend preview. The payment gateway will be connected by the assigned payments/backend team.`,
    );
  };

  return (
    <ScreenContainer>
      <AppHeader title="Add Money" />

      <View style={styles.intro}>
        <Text style={styles.heading}>Add money to your wallet</Text>
        <Text style={styles.subtitle}>
          Choose an amount and payment method to continue.
        </Text>
      </View>

      <AppCard style={styles.amountCard}>
        <Text style={styles.label}>Enter Amount</Text>

        <View style={styles.amountInputWrap}>
          <Text style={styles.currency}>₹</Text>
          <AppInput
            label=""
            value={amount}
            onChangeText={value => {
              setAmount(value.replace(/[^0-9]/g, ''));
              setAmountError('');
            }}
            keyboardType="number-pad"
            placeholder="Enter amount"
            maxLength={5}
            style={styles.amountInput}
          />
        </View>

        {amountError ? (
          <Text style={styles.errorText}>{amountError}</Text>
        ) : (
          <Text style={styles.helperText}>Minimum ₹10 · Maximum ₹50,000</Text>
        )}

        <Text style={styles.quickLabel}>Quick select</Text>

        <View style={styles.quickAmounts}>
          {QUICK_AMOUNTS.map(value => {
            const active = amount === String(value);

            return (
              <Pressable
                key={value}
                onPress={() => chooseAmount(value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[styles.quickChip, active && styles.quickChipActive]}>
                <Text style={[styles.quickText, active && styles.quickTextActive]}>
                  ₹{value}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </AppCard>

      <Text style={styles.sectionTitle}>Pay with</Text>
      <Text style={styles.sectionSubtitle}>
        Select your preferred payment method.
      </Text>

      <AppCard style={styles.methodsCard}>
        {PAYMENT_METHODS.map((method, index) => {
          const active = selectedMethod === method.id;

          return (
            <React.Fragment key={method.id}>
              <Pressable
                onPress={() => setSelectedMethod(method.id)}
                style={styles.methodRow}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}>
                <View style={styles.methodIcon}>
                  <Text style={styles.methodIconText}>{method.icon}</Text>
                </View>

                <View style={styles.methodInfo}>
                  <Text style={styles.methodTitle}>{method.title}</Text>
                  <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                </View>

                <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                  {active ? <View style={styles.radioInner} /> : null}
                </View>
              </Pressable>

              {index < PAYMENT_METHODS.length - 1 ? (
                <View style={styles.separator} />
              ) : null}
            </React.Fragment>
          );
        })}
      </AppCard>

      <View style={styles.paymentNote}>
        <Text style={styles.paymentNoteIcon}>🔒</Text>
        <Text style={styles.paymentNoteText}>
          Payments will be processed securely once the approved payment
          integration is connected.
        </Text>
      </View>

      <AppButton
        title={`Proceed to Pay  ₹${amount || '0'}`}
        onPress={handleProceed}
        style={styles.payButton}
      />

      <Text style={styles.disclaimer}>
        No payment will be charged in this frontend preview.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  intro: {
    marginTop: 8,
    marginBottom: 18,
  },
  heading: {
    color: '#251A30',
    fontSize: 21,
    fontWeight: '800',
  },
  subtitle: {
    color: '#746C78',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  amountCard: {
    padding: 17,
  },
  label: {
    color: '#30283A',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 9,
  },
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 58,
    borderWidth: 1,
    borderColor: '#E5DDE9',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
  },
  currency: {
    color: '#351759',
    fontSize: 25,
    fontWeight: '800',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    borderWidth: 0,
    minHeight: 54,
    paddingHorizontal: 0,
    marginBottom: 0,
    fontSize: 23,
    fontWeight: '800',
  },
  helperText: {
    color: '#817985',
    fontSize: 11,
    marginTop: 7,
  },
  errorText: {
    color: '#C62828',
    fontSize: 11,
    marginTop: 7,
  },
  quickLabel: {
    color: '#564C5E',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 19,
    marginBottom: 10,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickChip: {
    flex: 1,
    minWidth: '20%',
    minHeight: 39,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5DDE9',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 7,
  },
  quickChipActive: {
    borderColor: '#351759',
    backgroundColor: '#F0E8F5',
  },
  quickText: {
    color: '#564C5E',
    fontSize: 12,
    fontWeight: '700',
  },
  quickTextActive: {
    color: '#351759',
  },
  sectionTitle: {
    color: '#30283A',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 23,
    marginBottom: 5,
  },
  sectionSubtitle: {
    color: '#817985',
    fontSize: 12,
    marginBottom: 10,
  },
  methodsCard: {
    paddingVertical: 3,
    paddingHorizontal: 14,
  },
  methodRow: {
    minHeight: 69,
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#F0E8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodIconText: {
    color: '#512779',
    fontSize: 18,
    fontWeight: '800',
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    color: '#30283A',
    fontSize: 13,
    fontWeight: '700',
  },
  methodSubtitle: {
    color: '#817985',
    fontSize: 10,
    marginTop: 4,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#BDB4C4',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioOuterActive: {
    borderColor: '#351759',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#351759',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0ECF1',
    marginLeft: 51,
  },
  paymentNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0E8F5',
    borderRadius: 12,
    padding: 12,
    marginTop: 15,
  },
  paymentNoteIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  paymentNoteText: {
    flex: 1,
    color: '#665A70',
    fontSize: 11,
    lineHeight: 17,
  },
  payButton: {
    marginTop: 18,
  },
  disclaimer: {
    color: '#817985',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 9,
    marginBottom: 12,
  },
});
