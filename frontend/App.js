import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen.js';
import ChooseEvent from './ChooseEvent.js';
import Budget from './Budget.js';
import Generate from './Generate.js';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChooseEvent"
          component={ChooseEvent}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Budget"
          component={Budget}
          options={{ headerShown: false }}
        
        />

<Stack.Screen
          name="Generate"
          component={Generate}
          options={{ headerShown: false }}
        
        />

        


        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;