import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './pages/HomeScreen.js';
import ChooseEvent from './pages/ChooseEvent.js';
import Budget from './pages/Budget.js';
import Generate from './pages/Generate.js';
import RadioList from './pages/Radio_List.js';

const Stack = createStackNavigator();

const App = () => {
  return (
    <RadioList/>
    /*<NavigationContainer>
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
    </NavigationContainer>*/
  );
};

export default App;