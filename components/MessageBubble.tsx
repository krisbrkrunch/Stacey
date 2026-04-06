import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MarkdownMessage from './MarkdownMessage';
import { ChatMessage } from '../lib/openclaw';

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAi]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Ionicons name="sparkles" size={18} color="#00d4ff" />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <MarkdownMessage content={message.content} />
        <Text style={styles.timestamp}>{time}</Text>
      </View>
      {isUser && <View style={[styles.avatar, styles.userAvatar]}><Text style={styles.userAvatarText}>K</Text></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 6 },
  rowAi: { justifyContent: 'flex-start' },
  rowUser: { justifyContent: 'flex-end' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  userAvatar: { marginRight: 0, marginLeft: 8, backgroundColor: '#2a5f2a' },
  userAvatarText: { color: '#fff', fontWeight: '700' },
  bubble: { maxWidth: '78%', borderRadius: 16, padding: 12, backgroundColor: '#1e1e1e' },
  aiBubble: { borderTopLeftRadius: 6 },
  userBubble: { backgroundColor: '#2a5f2a', borderTopRightRadius: 6 },
  timestamp: { marginTop: 6, fontSize: 11, color: '#b0b0b0', alignSelf: 'flex-end' },
});
