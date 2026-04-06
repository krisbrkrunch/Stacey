import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';
import MessageBubble from '../components/MessageBubble';
import InputBar from '../components/InputBar';
import { ChatMessage, ChatSession, sendChatMessage } from '../lib/openclaw';

const seedMessages: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'I\'m live. Try **markdown**, lists, and links like [OpenClaw](https://docs.openclaw.ai).',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
];

export default function ChatScreen({ route }: any) {
  const session: ChatSession | undefined = route?.params?.session;
  const [messages, setMessages] = useState<ChatMessage[]>(session?.messages?.length ? session.messages : seedMessages);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);

  const lastAssistant = useMemo(() => [...messages].reverse().find(m => m.role === 'assistant'), [messages]);

  const playLast = () => {
    if (lastAssistant?.content) Speech.speak(lastAssistant.content, { language: 'en-US', rate: 0.95 });
  };

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    const userMsg: ChatMessage = { id: `${Date.now()}`, role: 'user', content: trimmed, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);
    setTyping(true);
    try {
      const { reply } = await sendChatMessage({ sessionId: session?.id, message: trimmed });
      const aiMsg: ChatMessage = { id: `${Date.now() + 1}`, role: 'assistant', content: reply, createdAt: new Date().toISOString() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e: any) {
      setMessages(prev => [...prev, { id: `${Date.now() + 2}`, role: 'assistant', content: `Gateway unavailable, so I used a local fallback.\n\n${e?.message || 'Unknown error'}`, createdAt: new Date().toISOString() }]);
    } finally {
      setTyping(false);
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>{session?.title || 'Chat'}</Text></View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.listContent}
      />
      {typing && <View style={styles.typing}><ActivityIndicator size="small" color="#00d4ff" /><Text style={styles.typingText}>AI is typing...</Text></View>}
      <InputBar value={input} onChangeText={setInput} onSend={send} onSpeakLast={playLast} isSending={sending} canSpeak={!!lastAssistant} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#222' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  listContent: { padding: 16, paddingBottom: 8 },
  typing: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  typingText: { color: '#b0b0b0' },
});
