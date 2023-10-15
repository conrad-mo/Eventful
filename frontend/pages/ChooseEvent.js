import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { MD3DarkTheme, MD3LightTheme, PaperProvider, Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Searchbar } from 'react-native-paper';



const ChooseEvent = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const { theme } = useMaterial3Theme();
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);


    const paperTheme =
        colorScheme === 'dark'
            ? { ...MD3DarkTheme, colors: theme.dark }
            : { ...MD3LightTheme, colors: theme.light };

    return (
        <PaperProvider theme={paperTheme}>
            
            <StatusBar style="auto"/>
            <View style={styles.text}>
                <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 24 }}>
                    Type in an <Text style={{ fontWeight: 'bold', color: '#EE4266', fontSize: 24 }}>event</Text> that you would like to host
                </Text>
                <Searchbar style={{ backgroundColor: '#eaeaea', borderRadius: 4, top:20, borderColor: 'black', }}
                    placeholder="Enter an event..."
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                />
                <Button mode="contained" onPress={() => navigation.navigate('Budget', {eventName: searchQuery})} style={styles.whiteButton}
                    labelStyle={{ textAlign: 'center', color: 'white', }} contentStyle={{ backgroundColor: 'black', }} title="Next">Next
                </Button>
                <Button mode="contained" onPress={() => navigation.navigate('HomeScreen')} style={styles.blackButton}
                    labelStyle={{ textAlign: 'center', color: 'black',}} contentStyle={{ backgroundColor: 'white' }} title="Back">Back
                </Button>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({

    container:{
        backgroundColor: 'white',
    },
    text: {
        top: 200,
        padding: 30,

    },
    whiteButton: {
        width: '85%',
        height: 40,
        marginTop: 340,
        borderRadius: 10,
        left: 30
    },

    blackButton: {
        width: '85%',
        height: 40,
        marginTop: 24,
        borderRadius: 10,
        left: 30
    }
});

export default ChooseEvent;