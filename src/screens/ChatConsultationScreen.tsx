import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../components/ScreenContainer';
import AppHeader from '../components/AppHeader';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
type Message = {
  id: string;
  text: string;
  time: string;
  sender: 'me' | 'pandit';
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Namaste! How can I help you today?',
    time: '10:30 AM',
    sender: 'pandit',
  },
  {
    id: '2',
    text: 'I would like guidance about my career.',
    time: '10:31 AM',
    sender: 'me',
  },
  {
    id: '3',
    text: 'Certainly. Please tell me what you would like to understand.',
    time: '10:31 AM',
    sender: 'pandit',
  },
];

const ChatConsultationScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');

  const sendMessage = () => {
    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    setMessages(previous => [
      ...previous,
      {
        id: `${Date.now()}`,
        text: trimmed,
        time,
        sender: 'me',
      },
    ]);
    setDraft('');
  };

  const endChat = () => {
    Alert.alert(
      'End consultation?',
      'This prototype stores messages only in local screen state. Connect the chat service and backend session flow before production.',
      [
        { text: 'Continue chatting', style: 'cancel' },
        {
          text: 'End chat',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.sender === 'me';

    return (
      <View
        style={[
          styles.messageRow,
          isMine ? styles.myMessageRow : styles.panditMessageRow,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isMine ? styles.myBubble : styles.panditBubble,
          ]}
        >
          <Text style={[styles.messageText, isMine && styles.myMessageText]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, isMine && styles.myMessageTime]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer scroll={false} style={styles.screen}>
      <AppHeader title="Chat Consultation" />

      <AppCard style={styles.panditCard}>
        <View style={styles.panditAvatar}>
          <Text style={styles.avatarText}>P</Text>
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.panditDetails}>
          <Text style={styles.panditName}>Pandit Raghav Sharma</Text>
          <Text style={styles.onlineText}>Online · Chat consultation</Text>
        </View>
        <View style={styles.rateBadge}>
          <Text style={styles.rateText}>₹10/min</Text>
        </View>
      </AppCard>

      <View style={styles.sessionBanner}>
        <Text style={styles.sessionText}>
          Consultation active · Sample session
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type your message..."
            placeholderTextColor="#9A929F"
            multiline
            maxLength={1000}
            style={styles.input}
            accessibilityLabel="Message"
          />
          <Pressable
            onPress={sendMessage}
            disabled={!draft.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            style={[
              styles.sendButton,
              !draft.trim() && styles.sendButtonDisabled,
            ]}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.bottomArea}>
        <Text style={styles.billingNote}>
          Sample rate: ₹10/min. Live billing and message delivery are not
          connected.
        </Text>
        <AppButton
          title="End Chat Consultation"
          onPress={endChat}
          variant="outline"
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  panditCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  panditAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0E7F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '800',
  },
  onlineDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2EAA62',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    right: 0,
    bottom: 1,
  },
  panditDetails: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  panditName: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  onlineText: {
    color: '#2E9656',
    fontSize: 10,
    marginTop: 4,
  },
  rateBadge: {
    backgroundColor: '#FFF4D8',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  rateText: {
    color: '#91620B',
    fontSize: 10,
    fontWeight: '800',
  },
  sessionBanner: {
    backgroundColor: '#F3EDF7',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  sessionText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  chatArea: {
    flex: 1,
    minHeight: 180,
  },
  messageList: {
    paddingVertical: spacing.md,
    flexGrow: 1,
  },
  messageRow: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  panditMessageRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 7,
  },
  myBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  panditBubble: {
    backgroundColor: '#F0EAF4',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#30283A',
    fontSize: 13,
    lineHeight: 19,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    color: '#817987',
    fontSize: 9,
    textAlign: 'right',
    marginTop: 5,
  },
  myMessageTime: {
    color: '#E5D9EE',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: '#E4DCEB',
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    marginBottom: spacing.sm,
  },
  input: {
    flex: 1,
    color: '#30283A',
    fontSize: 13,
    maxHeight: 90,
    minHeight: 38,
    paddingTop: 9,
    paddingBottom: 7,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  bottomArea: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
  },
  billingNote: {
    color: '#8B8491',
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});

export default ChatConsultationScreen;
