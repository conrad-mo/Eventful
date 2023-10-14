import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View,Text} from "react-native";
import { Button, } from "react-native-paper";
import { CheckBox } from "react-native-elements";
import { ActivityIndicator } from 'react-native-paper';


export default function RadioList({navigation}){
    // let it = ['ahhhh','b','c','d','eeeeeeeeeee','f','gggg','h','i','jjjjjjjj'];
    let [it, setIt] = useState([]);
    const [checked,setChecked] = useState(new Array(15).fill(false));
    let [isLoading, setIsLoading] = useState(true);
    let [error, setError] = useState();
    let [response, setResponse] = useState();

    const getData = async () => {
        try {
            const result = await fetch('http://3.145.78.170:3000/generateitems', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "event": "Birthday party",
                    "budget": 50
                }),
            });

            const data = await result.json()
            console.log(data);
            setIt(data);
            setIsLoading(false);
            setResponse(data);
        } catch (error) {
            setIsLoading(false);
            setError(error);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const getContent = () =>{
        if (isLoading) {
            
            return (
                <View>
                  <ActivityIndicator size="large" animating={true} color='#EE4266' />
                  <Text style={{ marginTop: 20}}>Generating your items...</Text>
                </View>
              );

        }

        if (error) {
            return <Text>{error}</Text>
        }

        if (!response) {
            return <Text>Invalid response format</Text>;
          }

        return null;
    }
    
    const handleOnChange = (id) =>{
        const updatedChecked = checked.map((item, index) =>
        index === id ? !item : item
        );
        setChecked(updatedChecked);
    }

    let items = it.map((item)=> 
        <TouchableOpacity key={item}>
            <View>
            <CheckBox
            backgroundcolor = '#FDECF0'
            center
            title={item}
            size={26}
            right
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checked={checked[it.indexOf(item)]}
            containerStyle = {styles.itembox}
            textStyle = {fontSize = 28}
            onPress={() => handleOnChange(it.indexOf(item))}
            />
            </View>
        </TouchableOpacity>
    );
    return (
        <View  style={styles.loading}>
            {getContent()}
            {!isLoading && (
            <View style = {{flexDirection:"column", width: 350, marginTop:120, justifyContent :'center'}}>
            
            <View style ={styles.textwrap}>
                <View style = {{flexDirection:'row'}}>
                <Text style = {{fontWeight: 600, fontSize : 28}} > Here's a </Text>
                <Text style = {{fontWeight: 600, fontSize : 28,color :'#EE4266' }}> list of Items</Text>
               </View>
                <Text style = {{fontWeight: 600, fontSize : 28}}> we came up with </Text>
             </View>
             <View style = {{height: 300}}>
        <ScrollView contentContainerStyle = {styles.container}>
            {items}
        </ScrollView>
        </View>
        <Button labelStyle = {styles.buttontext} style = {styles.button} mode = "contained" onPress={() => navigation.navigate('Generate')}>Optimize Cost!</Button>
        </View>
        )}
        
        </View>
    )

    }

const styles = StyleSheet.create({
    
    loading:{
        flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    },
    container:{
        padding:10,
        backgroundcolor : '#FFFFFF',
        flexDirection : 'column',
        borderColor : '#303030'
    },
    itembox :{
        flexDirection : 'row',
        backgroundColor :'#FDECF0', 
        padding : 10, 
    },
    itemtext:{
        borderRadius:6,
        padding : 5,
        textAlign : 'right',
        
    },
    textwrap : {
        justifyContent:'center',
        marginTop : 50,
        marginBottom : 50,
        marginLeft : 35
        
    },
    button : {
        marginBottom : 50,
        marginTop : 50,
        height : 40,
    },
    buttontext :{
        padding : 3,
        fontSize : 20,
        justifyContent : 'center',
        alignItems : 'center'
    }
}
);