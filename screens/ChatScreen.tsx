import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      const userMsg: Message = { id: Date.now().toString(), text: input, isUser: true };
      setMessages(prev => [...prev, userMsg]);
      setInput('');

      // Mock AI response
      setTimeout(() => {
        const aiMsg: Message = { id: (Date.now() + 1).toString(), text: 'This is a mock response from the AI.', isUser: false };
        setMessages(prev => [...prev, aiMsg]);
      }, 500);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.message, item.isUser ? styles.userMessage : styles.aiMessage]}>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={!input.trim()}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 10,
  },
  message: {
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 20,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#343541',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#000000',
  },
  input: {
    flex: 1,
    backgroundColor: '#343541',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    fontSize: 16,
    maxHeight: 120,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    justifyContent: 'center',
  },
  sendText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatScreen;
