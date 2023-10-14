import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
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
    let descriptions = ['pepfdsfvdfghjhgfrtyuikfjdsbvwerbkjfhvwbrtkegyaauvb jvhgfe', 'popo', 'papa', 'pupu', '...'];

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
        return (
            <PaperProvider theme={paperTheme}>
                <StatusBar style="auto"/>
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 28, textAlign: 'center', padding: '5%', top: '140%'}}>Here’s a {'\n'}<Text style= {{color: '#EE4266'}}>list of affordable items</Text>{'\n'} we chose</Text>
                    {/* {response} */}
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(238, 66, 102, 0.1)', marginTop: '12%', top: '20%', maxHeight: '30%', left: '5%', maxWidth: '90%', overflow: 'hidden' }}>    
                    <ScrollView style={{width: '100%'}}>
                    <List.Section style={{ maxHeight: '100%' }}>
                        {items.map((item, index) => (
                            <List.Item
                            key={index}
                            title={item}
                            description={descriptions[index]}
                            left={props => <List.Icon {...props} icon="link-variant" />}
                            onPress={() => Linking.openURL('http://google.com')}
                            style={{ width: '100%', borderBottomWidth: 20, borderBottomColor: '#f1f1f1' }}
                            />
                        ))}
                    </List.Section>
                    </ScrollView>
                </View>
                <Button mode="contained"  onPress={() => navigation.navigate('Card')} style={styles.customButton}
                    labelStyle={{ textAlign: 'center' }} contentStyle={{ backgroundColor: 'black' }}>New Event
                </Button>
            </PaperProvider>
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
    customButton: {
        width: '85%',
        left: '7.5%',
        top: 310,
        color: 'black',
        borderRadius: 10
    },
    text: {
        top: 40
    }
});

export default Generate;
