import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View,Text} from "react-native";
import { Button, } from "react-native-paper";
import { CheckBox } from "react-native-elements";

export default function RadioList(){
    let it = ['ahhhh','b','c','d','eeeeeeeeeee','f','gggg','h','i','jjjjjjjj'];
    const [checked,setChecked] = useState(new Array(it.length).fill(false));
    const handleOnChange = (id) =>{
        const updatedChecked = checked.map((item, index) =>
        index === id ? !item : item
        );
        setChecked(updatedChecked);
    }

    let items = it.map((item)=> 
        <TouchableOpacity>
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
        </ScrollView></View>
        <Button labelStyle = {styles.buttontext} style = {styles.button} mode = "contained">Optimize Cost!</Button>
        </View>
    )

    }

const styles = StyleSheet.create({
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