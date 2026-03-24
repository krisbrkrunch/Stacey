import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [token, setToken] = useState('');

  const pickEML = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
      type: ['text/plain', 'application/eml'], // Approximate for EML
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.[0]) {
      Alert.alert('No file selected');
      return;
    }

    const uri = result.assets[0].uri;
    const content = await FileSystem.readAsStringAsync(uri);
    
    // Simple EML parse: extract token assuming it's in body after 'token:' or regex
    const tokenMatch = content.match(/token[:\s]+([a-zA-Z0-9_-]+)/i) || content.match(/auth[_\s]token[:\s]+([a-zA-Z0-9_-]+)/i);
    if (tokenMatch) {
      const extractedToken = tokenMatch[1];
      await SecureStore.setItemAsync('userToken', extractedToken);
      setToken(extractedToken);
      Alert.alert('Token extracted and stored', `Token: ${extractedToken.substring(0,20)}...`);
      navigation.navigate('Channels');
    } else {
      Alert.alert('No token found', 'Could not parse token from EML. Assuming format: "token: XXXX"');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Channel App MVP</Text>
      <Text>Pick EML file to parse token</Text>
      <Button title="Pick EML" onPress={pickEML} />
      {token ? <Text>Token: {token.substring(0,20)}...</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
