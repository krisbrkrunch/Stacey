import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface Channel {
  id: string;
  name: string;
}

export default function ChannelsScreen() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    loadTokenAndChannels();
  }, []);

  const loadTokenAndChannels = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('userToken');
      if (!storedToken) {
        // Fallback mock
        setChannels([{id: '1', name: 'Mock Channel 1'}, {id: '2', name: 'Mock Channel 2'}]);
      } else {
        setToken(storedToken);
        // TODO: Fetch real channels using token, e.g., API call
        // For MVP, mock
        setChannels([
          {id: 'ch1', name: `Channel 1 (token: ${storedToken.substring(0,10)})`},
          {id: 'ch2', name: 'Channel 2'},
          {id: 'ch3', name: 'Channel 3'},
        ]);
      }
    } catch (error) {
      console.error('Error loading token/channels:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Channels</Text>
      <Text>Token loaded: {token.substring(0,20)}...</Text>
      <FlatList
        data={channels}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <Text style={styles.channel}>{item.name}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  channel: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
