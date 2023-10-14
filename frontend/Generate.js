import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { MD3DarkTheme, MD3LightTheme, PaperProvider, Button } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { useEffect, useState } from 'react';
import { List } from 'react-native-paper';

const Generate = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const { theme } = useMaterial3Theme();
    let [isLoading, setIsLoading] = useState(true);
    let [error, setError] = useState();
    let [response, setResponse] = useState();
    let items = ['item1', 'item2', 'item3', 'item4', '...'];

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
        // if (isLoading) {
        //     return (
        //         <>
        //           <ActivityIndicator size="large" animating={true} color='#EE4266' />
        //           <Text style={{ marginTop: 20 }}>Optimizing items and prices...</Text>
        //         </>
        //     )
        // }

        if (error) {
            return <Text>{error}</Text>
        }

        // if (!response) {
        //     return <Text>Invalid response format</Text>;
        // }

        console.log(response);
        return   (
            <View>
                <Text style={{ fontWeight: 'bold', fontSize: 24, textAlign: 'center', padding: '10%', top: '-100%'}}>Here’s {'\n'}<Text style= {{color: '#EE4266'}}>a list of affordable items</Text>{'\n'} we chose</Text>
                {/* {response} */}
                <List.Section>
                    {items.map((item, index) => (
                        <List.Item
                        key={index}
                        title={`Item ${index + 1}`}
                        description="Item description"
                        left={props => <List.Icon {...props} icon="folder" />}
                        />
                    ))}
                </List.Section>
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
