import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { MD3DarkTheme, MD3LightTheme, PaperProvider, Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import {useColorScheme} from 'react-native';

const HomeScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const paperTheme =
    colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  return (
    <PaperProvider theme={paperTheme}>

        <StatusBar style="auto" />
        <Image source={require('./assets/first-page-image.png')} style={styles.logo} />
        <View style={styles.text}>
          <Text>Start budgeting events with Appname</Text>

        </View>


        <Button mode="contained"  onPress={() => navigation.navigate('ChooseEvent')} style={styles.customButton}
          labelStyle={{ textAlign: 'center' }} contentStyle={{ backgroundColor: 'black' }}>Get Started
        </Button>
        
      </PaperProvider>
  );
};

const styles = StyleSheet.create({
  
  text: {
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    top:90
   
  },
  customButton: {
    width: '85%',
    height: 40,
    marginTop: 300,
    color: 'black',
    borderRadius: 10,
    left:30
  },
  logo: {
    width: '50%',
    height: '50%',
    top: 100,
    left: 95,
  },
});

export default HomeScreen;
