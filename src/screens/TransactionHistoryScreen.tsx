import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import AppCard from '../components/AppCard';

type TransactionType = 'call' | 'add-money' | 'refund';
type FilterType = 'All' | 'Calls' | 'Add Money' | 'Refunds';

type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  amount: number;
  type: TransactionType;
  status: 'Successful' | 'Processing' | 'Failed';
};

const FILTERS: FilterType[] = ['All', 'Calls', 'Add Money', 'Refunds'];

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Added Money',
    subtitle: 'Wallet top-up',
    date: '1 Nov 2026, 10:30 AM',
    amount: 500,
    type: 'add-money',
    status: 'Successful',
  },
  {
    id: '2',
    title: 'Audio Call with Acharya V.',
    subtitle: 'Consultation · 12 min',
    date: '31 Oct 2026, 7:15 PM',
    amount: -120,
    type: 'call',
    status: 'Successful',
  },
  {
    id: '3',
    title: 'Video Call with Maa Tripura',
    subtitle: 'Consultation · 20 min',
    date: '30 Oct 2026, 5:40 PM',
    amount: -300,
    type: 'call',
    status: 'Successful',
  },
  {
    id: '4',
    title: 'Refund from Pandit',
    subtitle: 'Cancelled consultation',
    date: '29 Oct 2026, 2:20 PM',
    amount: 150,
    type: 'refund',
    status: 'Successful',
  },
  {
    id: '5',
    title: 'Added Money',
    subtitle: 'Wallet top-up',
    date: '27 Oct 2026, 11:05 AM',
    amount: 1000,
    type: 'add-money',
    status: 'Successful',
  },
];

export default function TransactionHistoryScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const visibleTransactions = useMemo(() => {
    if (activeFilter === 'All') return SAMPLE_TRANSACTIONS;

    const typeByFilter: Record<Exclude<FilterType, 'All'>, TransactionType> = {
      Calls: 'call',
      'Add Money': 'add-money',
      Refunds: 'refund',
    };

    return SAMPLE_TRANSACTIONS.filter(
      transaction => transaction.type === typeByFilter[activeFilter],
    );
  }, [activeFilter]);

  return (
    <ScreenContainer>
      <AppHeader title="Transaction History" />

      <View style={styles.intro}>
        <Text style={styles.heading}>Your Transactions</Text>
        <Text style={styles.subtitle}>
          Track wallet additions, consultation charges and refunds.
        </Text>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map(filter => {
          const active = activeFilter === filter;

          return (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[styles.filterChip, active && styles.filterChipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Text style={styles.countText}>
          {visibleTransactions.length} transactions
        </Text>
      </View>

      {visibleTransactions.length > 0 ? (
        <AppCard style={styles.transactionCard}>
          {visibleTransactions.map((transaction, index) => (
            <React.Fragment key={transaction.id}>
              <TransactionRow transaction={transaction} />
              {index < visibleTransactions.length - 1 ? (
                <View style={styles.separator} />
              ) : null}
            </React.Fragment>
          ))}
        </AppCard>
      ) : (
        <AppCard style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>↔</Text>
          </View>
          <Text style={styles.emptyTitle}>No transactions found</Text>
          <Text style={styles.emptySubtitle}>
            There are no {activeFilter.toLowerCase()} transactions to show.
          </Text>
        </AppCard>
      )}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          Sample transaction records for frontend preview only. Live transaction
          history will be displayed after the backend API is connected.
        </Text>
      </View>
    </ScreenContainer>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isCredit = transaction.amount > 0;
  const icon =
    transaction.type === 'add-money'
      ? '+'
      : transaction.type === 'refund'
        ? '↶'
        : '☎';

  return (
    <View style={styles.transactionRow}>
      <View
        style={[
          styles.transactionIcon,
          transaction.type === 'call' && styles.callIcon,
          transaction.type === 'refund' && styles.refundIcon,
        ]}>
        <Text style={styles.transactionIconText}>{icon}</Text>
      </View>

      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle} numberOfLines={1}>
          {transaction.title}
        </Text>
        <Text style={styles.transactionSubtitle}>{transaction.subtitle}</Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
        <Text
          style={[
            styles.statusText,
            transaction.status === 'Successful'
              ? styles.successStatus
              : styles.pendingStatus,
          ]}>
          ● {transaction.status}
        </Text>
      </View>

      <Text
        style={[
          styles.transactionAmount,
          isCredit ? styles.creditAmount : styles.debitAmount,
        ]}>
        {isCredit ? '+' : '−'}₹{Math.abs(transaction.amount)}
      </Text>
    </View>
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
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 21,
  },
  filterChip: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5DDE9',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  filterChipActive: {
    backgroundColor: '#351759',
    borderColor: '#351759',
  },
  filterText: {
    color: '#62586A',
    fontSize: 11,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#30283A',
    fontSize: 15,
    fontWeight: '800',
  },
  countText: {
    color: '#817985',
    fontSize: 10,
  },
  transactionCard: {
    paddingHorizontal: 13,
    paddingVertical: 4,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  transactionIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: '#E7F7F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  callIcon: {
    backgroundColor: '#FDEBED',
  },
  refundIcon: {
    backgroundColor: '#E9E3F7',
  },
  transactionIconText: {
    color: '#351759',
    fontSize: 19,
    fontWeight: '800',
  },
  transactionInfo: {
    flex: 1,
    paddingRight: 6,
  },
  transactionTitle: {
    color: '#30283A',
    fontSize: 12,
    fontWeight: '800',
  },
  transactionSubtitle: {
    color: '#746C78',
    fontSize: 10,
    marginTop: 3,
  },
  transactionDate: {
    color: '#96909A',
    fontSize: 9,
    marginTop: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 5,
  },
  successStatus: {
    color: '#16864A',
  },
  pendingStatus: {
    color: '#C18419',
  },
  transactionAmount: {
    fontSize: 12,
    fontWeight: '800',
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  creditAmount: {
    color: '#159B75',
  },
  debitAmount: {
    color: '#E34D5B',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0ECF1',
    marginLeft: 50,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#F0E8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyIconText: {
    color: '#512779',
    fontSize: 25,
    fontWeight: '800',
  },
  emptyTitle: {
    color: '#30283A',
    fontSize: 14,
    fontWeight: '800',
  },
  emptySubtitle: {
    color: '#817985',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 6,
  },
  disclaimer: {
    marginTop: 14,
    paddingHorizontal: 5,
  },
  disclaimerText: {
    color: '#817985',
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
  },
});
