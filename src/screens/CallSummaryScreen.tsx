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

const SAMPLE = {
  panditName: 'Acharya Sharma',
  consultationType: 'Audio Consultation',
  date: '1 November 2026',
  time: '10:30 AM',
  duration: '12 min 30 sec',
  ratePerMinute: 10,
  totalCharge: 125,
  walletBalance: 375,
  transactionId: 'CONSULT-123456',
};

export default function CallSummaryScreen() {
  const [rating, setRating] = useState(0);

  const handleSubmitRating = () => {
    if (rating === 0) {
      Alert.alert('Select a rating', 'Please select a star rating first.');
      return;
    }

    Alert.alert(
      'Thank you!',
      `Your ${rating}-star rating is selected. Rating submission will be connected when the backend API is ready.`,
    );
  };

  const handleWallet = () => {
    Alert.alert(
      'Back to Wallet',
      'Connect this action to your Wallet screen in the navigation setup.',
    );
  };

  return (
    <ScreenContainer>
      <AppHeader title="Consultation Summary" />

      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.title}>Consultation Completed</Text>
        <Text style={styles.subtitle}>
          Here is a summary of your consultation.
        </Text>

        <AppCard style={styles.panditCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>ॐ</Text>
          </View>
          <View style={styles.panditInfo}>
            <Text style={styles.panditName}>{SAMPLE.panditName}</Text>
            <Text style={styles.consultationType}>{SAMPLE.consultationType}</Text>
            <Text style={styles.dateTime}>
              {SAMPLE.date} · {SAMPLE.time}
            </Text>
          </View>
        </AppCard>

        <AppCard style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Call Details</Text>
          <SummaryRow label="Duration" value={SAMPLE.duration} />
          <SummaryRow
            label="Rate per minute"
            value={`₹${SAMPLE.ratePerMinute}/min`}
          />
          <View style={styles.divider} />
          <SummaryRow
            label="Total consultation charge"
            value={`₹${SAMPLE.totalCharge}`}
            strong
          />
          <SummaryRow
            label="Wallet balance after call"
            value={`₹${SAMPLE.walletBalance}`}
            strong
          />
          <View style={styles.divider} />
          <SummaryRow label="Transaction ID" value={SAMPLE.transactionId} />
          <SummaryRow label="Status" value="Completed" success />
        </AppCard>

        <AppCard style={styles.ratingCard}>
          <Text style={styles.ratingTitle}>Rate your experience</Text>
          <Text style={styles.ratingSubtitle}>
            How was your consultation with {SAMPLE.panditName}?
          </Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(value => (
              <Pressable
                key={value}
                onPress={() => setRating(value)}
                accessibilityRole="button"
                accessibilityLabel={`${value} star${value > 1 ? 's' : ''}`}
                accessibilityState={{ selected: rating === value }}>
                <Text
                  style={[
                    styles.star,
                    value <= rating && styles.starSelected,
                  ]}>
                  ★
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.ratingHint}>
            {rating === 0 ? 'Tap a star to rate' : `You selected ${rating} out of 5`}
          </Text>

          <AppButton
            title="Submit Rating"
            onPress={handleSubmitRating}
            disabled={rating === 0}
            style={styles.ratingButton}
          />
        </AppCard>

        <AppButton
          title="Back to Wallet"
          variant="outline"
          onPress={handleWallet}
          style={styles.walletButton}
        />

        <Text style={styles.disclaimer}>
          Sample consultation details for frontend preview only. Actual call
          duration, charges and balance must come from the backend.
        </Text>
      </View>
    </ScreenContainer>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
  success = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  success?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.rowLabel, strong && styles.strongText]}>{label}</Text>
      <Text
        style={[
          styles.rowValue,
          strong && styles.strongText,
          success && styles.successText,
        ]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: 12,
  },
  successIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#DDF5E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  check: {
    color: '#159447',
    fontSize: 32,
    fontWeight: '800',
  },
  title: {
    color: '#251A30',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#746C78',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 17,
  },
  panditCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F0E8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#512779',
    fontSize: 25,
  },
  panditInfo: {
    flex: 1,
  },
  panditName: {
    color: '#30283A',
    fontSize: 14,
    fontWeight: '800',
  },
  consultationType: {
    color: '#512779',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  dateTime: {
    color: '#817985',
    fontSize: 10,
    marginTop: 4,
  },
  summaryCard: {
    width: '100%',
    padding: 16,
  },
  cardTitle: {
    color: '#30283A',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  rowLabel: {
    flex: 1,
    color: '#817985',
    fontSize: 11,
  },
  rowValue: {
    flex: 1,
    color: '#30283A',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
  strongText: {
    color: '#351759',
    fontWeight: '800',
  },
  successText: {
    color: '#16864A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0ECF1',
    marginVertical: 5,
    marginBottom: 14,
  },
  ratingCard: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
  },
  ratingTitle: {
    color: '#30283A',
    fontSize: 14,
    fontWeight: '800',
  },
  ratingSubtitle: {
    color: '#817985',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 5,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  star: {
    color: '#D9D2DE',
    fontSize: 32,
  },
  starSelected: {
    color: '#E2A52E',
  },
  ratingHint: {
    color: '#817985',
    fontSize: 10,
    marginTop: 5,
  },
  ratingButton: {
    width: '100%',
    marginTop: 13,
  },
  walletButton: {
    width: '100%',
    marginTop: 4,
  },
  disclaimer: {
    color: '#817985',
    fontSize: 9,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 14,
  },
});
