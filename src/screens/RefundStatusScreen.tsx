import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
const REFUND = {
  amount: 250,
  status: 'Processing',
  reason: 'Pandit was unable to complete the consultation',
  transactionId: 'REFUND_NAK_20261101',
  requestedOn: '1 November 2026',
  expectedBy: '3–5 business days',
  paymentMethod: 'UPI',
};

const timeline = [
  {
    title: 'Refund requested',
    description: 'Your refund request has been received.',
    completed: true,
  },
  {
    title: 'Refund approved',
    description: 'The refund request has been approved.',
    completed: true,
  },
  {
    title: 'Refund processing',
    description: 'The amount is being sent to your original payment method.',
    completed: false,
  },
  {
    title: 'Refund completed',
    description: 'The refunded amount will appear in your account.',
    completed: false,
  },
];

const RefundStatusScreen = () => {
  const navigation = useNavigation();

  const handleHelp = () => {
    Alert.alert(
      'Refund support',
      'Connect this action to the app support or help centre when that flow is available.',
    );
  };

  return (
    <ScreenContainer>
      <AppHeader title="Refund Status" />

      <AppCard style={styles.heroCard}>
        <View style={styles.statusIcon}>
          <Text style={styles.statusIconText}>₹</Text>
        </View>
        <Text style={styles.statusLabel}>REFUND STATUS</Text>
        <Text style={styles.amount}>₹{REFUND.amount.toLocaleString('en-IN')}</Text>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{REFUND.status}</Text>
        </View>
        <Text style={styles.heroNote}>
          Your refund is being processed. It should reach your original payment
          method within {REFUND.expectedBy.toLowerCase()}.
        </Text>
      </AppCard>

      <Text style={styles.sectionTitle}>Refund progress</Text>
      <AppCard style={styles.timelineCard}>
        {timeline.map((item, index) => (
          <View style={styles.timelineRow} key={item.title}>
            <View style={styles.timelineRail}>
              <View
                style={[
                  styles.timelineDot,
                  item.completed && styles.timelineDotCompleted,
                  index === 2 && styles.timelineDotCurrent,
                ]}
              >
                {item.completed ? <Text style={styles.check}>✓</Text> : null}
              </View>
              {index !== timeline.length - 1 ? (
                <View
                  style={[
                    styles.timelineLine,
                    item.completed && styles.timelineLineCompleted,
                  ]}
                />
              ) : null}
            </View>
            <View style={styles.timelineContent}>
              <Text
                style={[
                  styles.timelineTitle,
                  !item.completed && index !== 2 && styles.pendingTitle,
                ]}
              >
                {item.title}
              </Text>
              <Text style={styles.timelineDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </AppCard>

      <Text style={styles.sectionTitle}>Refund details</Text>
      <AppCard style={styles.detailsCard}>
        <DetailRow label="Refund amount" value={`₹${REFUND.amount}`} highlight />
        <DetailRow label="Payment method" value={REFUND.paymentMethod} />
        <DetailRow label="Requested on" value={REFUND.requestedOn} />
        <DetailRow label="Expected timeline" value={REFUND.expectedBy} />
        <DetailRow label="Refund ID" value={REFUND.transactionId} last />
      </AppCard>

      <Text style={styles.sectionTitle}>Reason for refund</Text>
      <AppCard style={styles.reasonCard}>
        <Text style={styles.reasonText}>{REFUND.reason}</Text>
      </AppCard>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>ⓘ</Text>
        <Text style={styles.infoText}>
          Refund timelines depend on your bank or payment provider. If the
          amount is not received after the expected period, contact support.
        </Text>
      </View>

      <AppButton
        title="Contact Support"
        onPress={handleHelp}
        variant="primary"
        style={styles.supportButton}
      />
      <AppButton
        title="Back"
        onPress={() => navigation.goBack()}
        variant="outline"
        style={styles.backButton}
      />
    </ScreenContainer>
  );
};

type DetailRowProps = {
  label: string;
  value: string;
  highlight?: boolean;
  last?: boolean;
};

const DetailRow = ({ label, value, highlight, last }: DetailRowProps) => (
  <View style={[styles.detailRow, !last && styles.detailBorder]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, highlight && styles.detailHighlight]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  heroCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },
  statusIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F2E9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statusIconText: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '800',
  },
  statusLabel: {
    color: '#77717D',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  amount: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: '800',
    marginTop: 5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4D8',
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 7,
    marginTop: spacing.sm,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D99A16',
    marginRight: 7,
  },
  statusText: {
    color: '#91620B',
    fontWeight: '700',
    fontSize: 12,
  },
  heroNote: {
    color: '#716B76',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 13,
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  timelineCard: {
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 75,
  },
  timelineRail: {
    width: 28,
    alignItems: 'center',
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D8D2DE',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineDotCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timelineDotCurrent: {
    borderColor: '#D99A16',
    backgroundColor: '#FFF4D8',
  },
  check: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  timelineLine: {
    position: 'absolute',
    top: 20,
    bottom: 0,
    width: 2,
    backgroundColor: '#E6E1E9',
  },
  timelineLineCompleted: {
    backgroundColor: colors.primary,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.md,
  },
  timelineTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  pendingTitle: {
    color: '#99939E',
  },
  timelineDescription: {
    color: '#77717D',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  detailsCard: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 13,
    gap: spacing.sm,
  },
  detailBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E2EB',
  },
  detailLabel: {
    color: '#77717D',
    fontSize: 12,
    flex: 1,
  },
  detailValue: {
    color: '#30283A',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  detailHighlight: {
    color: colors.primary,
    fontSize: 14,
  },
  reasonCard: {
    marginBottom: spacing.md,
  },
  reasonText: {
    color: '#5F5866',
    fontSize: 13,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F5F0F8',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  infoIcon: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  infoText: {
    color: '#665D70',
    fontSize: 12,
    lineHeight: 19,
    flex: 1,
  },
  supportButton: {
    marginTop: spacing.xs,
  },
  backButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
});

export default RefundStatusScreen;
