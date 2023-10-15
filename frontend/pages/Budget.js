import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MD3DarkTheme, MD3LightTheme, PaperProvider, Button } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { Searchbar } from 'react-native-paper';

const Budget = ({ navigation, route }) => {
    const colorScheme = useColorScheme();
    const { theme } = useMaterial3Theme();
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);
    const {eventName} = route.params;

    const paperTheme =
        colorScheme === 'dark'
            ? { ...MD3DarkTheme, colors: theme.dark }
            : { ...MD3LightTheme, colors: theme.light };
  return (
    <PaperProvider theme={paperTheme}>
            
    <StatusBar style="auto"/>
    <View style={styles.text}>
        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 24 }}>
            Give us a <Text style={{ fontWeight: 'bold', color: '#EE4266', fontSize: 24 }}>budget</Text> to work with
        </Text>
        <Searchbar icon = 'cash-multiple' style={{ backgroundColor: '#eaeaea', borderRadius: 4, top:20, borderColor: 'black', }}
            placeholder="Enter a budget..."
            onChangeText={onChangeSearch}
            value={searchQuery}
        />
        <Button mode="contained" onPress={() => navigation.navigate('Radio_List', {eventName, searchQuery})} style={styles.whiteButton}
            labelStyle={{ textAlign: 'center', color: 'white', }} contentStyle={{ backgroundColor: 'black', }} title="Next">Find a list of items
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('ChooseEvent')} style={styles.blackButton}
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
        marginTop: 370,
        borderRadius: 10,
        left: 30
    },

    blackButton: {
        width: '85%',
        height: 40,
        marginTop: 23,
        borderRadius: 10,
        left: 30
    }
});

export default Budget;