import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import ChannelsScreen from './screens/ChannelsScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Chat">
        <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Home'}} />
        <Stack.Screen name="Channels" component={ChannelsScreen} options={{title: 'Channels'}} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{title: 'Chat'}} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
