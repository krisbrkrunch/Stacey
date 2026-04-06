import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ChatSession, loadChatSessions } from '../lib/openclaw';

export default function ChatListScreen({ navigation }: any) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => { loadChatSessions().then(setSessions); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Stacey Chat</Text>
        <Ionicons name="settings-outline" size={22} color="#e0e0e0" />
      </View>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Chat', { session: item })}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{item.avatarLabel || item.title.slice(0, 2).toUpperCase()}</Text></View>
            <View style={styles.meta}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.preview} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            {!!item.unreadCount && <View style={styles.badge}><Text style={styles.badgeText}>{item.unreadCount}</Text></View>}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Chat')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, marginBottom: 10 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#121212', borderRadius: 18, marginBottom: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1e1e1e', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#00d4ff', fontWeight: '700' },
  meta: { flex: 1 },
  itemTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  preview: { color: '#b0b0b0', marginTop: 3 },
  badge: { minWidth: 24, height: 24, borderRadius: 12, backgroundColor: '#00d4ff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  badgeText: { color: '#000', fontWeight: '700' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#00d4ff', alignItems: 'center', justifyContent: 'center' },
});
