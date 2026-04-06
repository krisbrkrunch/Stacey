import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export type VoiceOption = { identifier: string; name: string; language?: string };

export default function InputBar({
  value,
  onChangeText,
  onSend,
  onSpeakLast,
  onStopSpeak,
  isSending,
  canSpeak,
  isSpeaking,
  voices,
  selectedVoiceId,
  onSelectVoice,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onSpeakLast: () => void;
  onStopSpeak: () => void;
  isSending?: boolean;
  canSpeak?: boolean;
  isSpeaking?: boolean;
  voices?: VoiceOption[];
  selectedVoiceId?: string | null;
  onSelectVoice?: (voiceId: string) => void;
}) {
  return (
    <View style={styles.wrapper}>
      {!!voices?.length && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.voiceRow} contentContainerStyle={styles.voiceRowContent}>
          {voices.map((voice) => {
            const selected = voice.identifier === selectedVoiceId;
            return (
              <TouchableOpacity key={voice.identifier} style={[styles.voicePill, selected && styles.voicePillSelected]} onPress={() => onSelectVoice?.(voice.identifier)}>
                <Text style={[styles.voicePillText, selected && styles.voicePillTextSelected]} numberOfLines={1}>
                  {voice.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
      <View style={styles.container}>
        <TouchableOpacity style={[styles.iconButton, !canSpeak && styles.disabled]} onPress={isSpeaking ? onStopSpeak : onSpeakLast} disabled={!canSpeak && !isSpeaking}>
          <Ionicons name={isSpeaking ? 'stop' : 'mic'} size={20} color={canSpeak || isSpeaking ? '#00d4ff' : '#666'} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#0a0a0a', paddingTop: 8 },
  voiceRow: { maxHeight: 42 },
  voiceRowContent: { gap: 8, paddingHorizontal: 12, paddingBottom: 8 },
  voicePill: { borderWidth: 1, borderColor: '#2a2a2a', backgroundColor: '#121212', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  voicePillSelected: { borderColor: '#00d4ff', backgroundColor: '#10232a' },
  voicePillText: { color: '#b9b9b9', fontSize: 12, maxWidth: 120 },
  voicePillTextSelected: { color: '#fff' },
  container: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, backgroundColor: '#0a0a0a' },
  input: { flex: 1, minHeight: 48, maxHeight: 120, borderRadius: 24, backgroundColor: '#121212', color: '#fff', paddingHorizontal: 16, paddingVertical: 12 },
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#121212' },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00d4ff' },
  disabled: { opacity: 0.45 },
});
