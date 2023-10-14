import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View,Text} from "react-native";
import { Button, IconButton, TextInput} from "react-native-paper";
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
            <View >
            <CheckBox
            backgroundcolor = '#FDECF0'
            center
            title={item}
            size={26}
            right
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checkedColor="#EE4266"
            checked={checked[it.indexOf(item)]}
            containerStyle = {styles.itembox}
            textStyle = {{fontSize: 20, fontWeight: 'normal'}}
            onPress={() => handleOnChange(it.indexOf(item))}
            />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style = {{marginTop:40}}>
            <IconButton style = {{alignSelf:'flex-end'}} size = {32} icon="plus" />
        <View style = {{flexDirection:"column", width: 350, justifyContent :'center'}}>
            <View style ={styles.textwrap}>
                <View style = {{flexDirection:'row'}}>
                <Text style = {{fontWeight: 600, fontSize : 28}} > Here's a </Text>
                <Text style = {{fontWeight: 600, fontSize : 28,color :'#EE4266' }}> list of Items</Text>
               </View>
                <Text style = {{fontWeight: 600, fontSize : 28}}> we came up with </Text>
             </View>
            <View style = {{marginLeft:50,marginBottom:50,alignSelf:'center',height: 300, width:'110%'}}>
                <ScrollView contentContainerStyle = {styles.container}>
                    {items}
                </ScrollView>
            </View>
        <Button labelStyle = {styles.buttontext} style = {styles.button} mode = "contained">Optimize Cost!</Button>
        </View>
        </View>
    )

    }

const styles = StyleSheet.create({
    container:{
        padding:10,
        backgroundcolor : '#FFFFFF',
        flexDirection : 'column',
        borderColor : '#303030',
        justifyContent: 'center',
        
    },
    itembox :{
        flexDirection : 'row',
        backgroundColor :'rgba(238, 66, 102, 0.1)', 
        padding: 5, 
        paddingLeft: 20,
        height: 60,
        borderRadius: 2,
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
        marginLeft : 45
        
    },
    button : {
        marginBottom : 50,
        marginTop : 50,
        marginLeft : 45,
        height : 40,
        backgroundColor : '#303030',
        justifyContent :'center',
        borderRadius:10
    },
    buttontext :{
        justifyContent : 'center',
        alignItems : 'center'
    },
    add:{
        alignSelf:'flex-end'
    }
}
);