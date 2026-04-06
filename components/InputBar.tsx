import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function InputBar({
  value,
  onChangeText,
  onSend,
  onSpeakLast,
  isSending,
  canSpeak,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onSpeakLast: () => void;
  isSending?: boolean;
  canSpeak?: boolean;
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.iconButton, !canSpeak && styles.disabled]} onPress={onSpeakLast} disabled={!canSpeak}>
        <Ionicons name="mic" size={20} color={canSpeak ? '#00d4ff' : '#666'} />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type a message..."
        placeholderTextColor="#888"
        multiline
      />
      <TouchableOpacity style={[styles.sendButton, (!value.trim() || isSending) && styles.disabled]} onPress={onSend} disabled={!value.trim() || isSending}>
        <Ionicons name="send" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, backgroundColor: '#0a0a0a' },
  input: { flex: 1, minHeight: 48, maxHeight: 120, borderRadius: 24, backgroundColor: '#121212', color: '#fff', paddingHorizontal: 16, paddingVertical: 12 },
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#121212' },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00d4ff' },
  disabled: { opacity: 0.45 },
});
