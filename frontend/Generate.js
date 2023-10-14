import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { MD3DarkTheme, MD3LightTheme, PaperProvider, Button } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { useEffect, useState } from 'react';

const Generate = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const { theme } = useMaterial3Theme();
    let [isLoading, setIsLoading] = useState(true);
    let [error, setError] = useState();
    let [response, setResponse] = useState();

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/posts?_limit=8`).then(res => res.json()).then((result) => {
            setIsLoading(false);
            setResponse(result);
        }, (error) => {
            setIsLoading(false);
            setError(error);
        }
        )
    }, []);

    const getContent = () => {
        if (isLoading) {
            <Text>Generating your items...</Text>
            return <ActivityIndicator size="large" animating={true} color='#6750A4' />

        }
        if (error) {
            return <Text>{error}</Text>
        }

        if (!response) {
            return <Text>Invalid response format</Text>;
          }

        console.log(response);
        return   (
            <View>
              {response}
            </View>
          );


    }
    const paperTheme =
    colorScheme === 'dark'
        ? { ...MD3DarkTheme, colors: theme.dark }
        : { ...MD3LightTheme, colors: theme.light };
return (
    <PaperProvider theme={paperTheme}>
        <StatusBar style="auto" />
        <View style={styles.container}>
            {getContent()}
            <View style={styles.text}>
                
            </View>
        </View>
    </PaperProvider>
);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        top: -20
    },
    text: {
        top: 40
    }
});

export default Generate;
