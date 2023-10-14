import { useState,useEffect} from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View,Text,Modal,} from "react-native";
import { Button, IconButton, TextInput,ActivityIndicator} from "react-native-paper";
import { CheckBox } from "react-native-elements";



export default function RadioList({navigation}){
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
                    "event": "Birthday party under 10 items",
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

    let items = it.map((item,index)=> 
        index < 10?
        <TouchableOpacity key = {item}>
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
        </TouchableOpacity> : ""
    );

   const [visibility,setVisibility] = useState(false);
   const [text, setText] = useState("");
    return (
        <View   style={styles.loading}>
             {getContent()}
            {!isLoading && (
                <View>
            <IconButton style = {{alignSelf:'flex-end'}} size = {32} icon="plus" onPress = {()=>{
                setVisibility(true);
            }}/>
            <Modal
            animationType="slide" 
            transparent = {true}
            visible={visibility}
            onDismiss={()=>{setVisibility(false)}}
            onRequestClose={() => {
             Alert.alert('Modal has been closed.');
            setVisibility(false);
        }}>
         <View>
            <TextInput
                clearButtonMode="always"
                mode="outlined"
                style = {styles.centeredView}
                label="add item"
                value={text}
                onChangeText={text => setText(text)}
                activeOutlineColor="#EE4266"
                />
        </View>
            <Button onPress={()=>{
                if(items.length < 30){
                    items.push(<TouchableOpacity>
                        <View >
                        <CheckBox
                        backgroundcolor = '#FDECF0'
                        center
                        title={text}
                        size={26}
                        right
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor="#EE4266"
                        checked={checked[it.indexOf(text)]}
                        containerStyle = {styles.itembox}
                        textStyle = {fontSize = 28}
                        onPress={() => handleOnChange(it.indexOf(text))}
                        />
                        </View>
                    </TouchableOpacity>)
                    console.log({items})
                }
                setVisibility(false)
                }}> done!</Button>
        </Modal>
    
        <View style = {{flexDirection:"column", width: 350, justifyContent :'center'}}>
            <View style ={styles.textwrap}>
                <View style = {{flexDirection:'row'}}>
                <Text style = {{fontWeight: 600, fontSize : 28}} > Here's a </Text>
                <Text style = {{fontWeight: 600, fontSize : 28,color :'#EE4266' }}> list of Items</Text>
               </View>
                <Text style = {{fontWeight: 600, fontSize : 28}}> we came up with </Text>
             </View>
            <View style = {{marginLeft:0,marginBottom:50,alignSelf:'center',height: 300, width:'110%'}}>
                <ScrollView contentContainerStyle = {styles.container}>
                    {items}
                </ScrollView>
            </View>
        <Button labelStyle = {styles.buttontext} onPress={() => navigation.navigate('Generate')} style = {styles.button} mode = "contained">Optimize Cost!</Button>
        </View>
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
        // marginLeft : 45,
        height : 40,
        width: '90%',
        left: '5%',
        backgroundColor : '#303030',
        justifyContent :'center',
        borderRadius: 10
    },
    buttontext :{
        justifyContent : 'center',
        alignItems : 'center'
    },
    add:{
        alignSelf:'flex-end'
    },
    centeredView:{
        marginTop: '90%',
        justifyContent:'center',
        alignSelf:'center',
        height: 60,
        width:'80%',
        backgroundColor:'#FFFFFF',
        borderRadius:10,
        fontSize : 24

    }
}
);
