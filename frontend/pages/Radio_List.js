import { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Modal,
} from "react-native";
import {
  Button,
  IconButton,
  TextInput,
  ActivityIndicator,
} from "react-native-paper";
import { CheckBox } from "react-native-elements";

export default function RadioList({ navigation, route }) {
  let [it, setIt] = useState([]);
  const [checked, setChecked] = useState(new Array(15).fill(false));
  let [isLoading, setIsLoading] = useState(true);
  let [error, setError] = useState();
  let [response, setResponse] = useState();
  let [checkClicked, setCheckedClicked] = useState(false);
  const { eventName, searchQuery } = route.params;
  const trueIndices = [];
  const trueElements = [];

  const getData = async () => {
    try {
      const result = await fetch("http://3.145.78.170:3000/generateitems", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: eventName,
          budget: +searchQuery,
        }),
      });

      const data = await result.json();

      setIt(data);
      setIsLoading(false);
      setResponse(data);
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    console.log("Response from above", response);
  }, [response]);

  useEffect(() => {
    getData();
  }, []);

  const getContent = () => {
    if (isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" animating={true} color="#EE4266" />
          <Text style={{ marginTop: 30, fontSize: 18 }}>
            Generating your items...
          </Text>
        </View>
      );
    }

    if (error) {
      return <Text>{error}</Text>;
    }

    if (!response) {
      return <Text>Invalid response format</Text>;
    }

    return null;
  };
  const chosen = (checked, it) => {
    for (let i = 0; i < checked.length; i++) {
      if (checked[i]) {
        trueIndices.push(i);
      }
    }

    for (let i = 0; i < trueIndices.length; i++) {
      trueElements.push(it[trueIndices[i]]);
    }
    console.log('here ' + trueElements);
  };

  useEffect(() => {
    chosen(checked, it);
  }, [checked]);

  const handleOnChange = (id) => {
    const newChecked = [...checked];
    newChecked[id] = !newChecked[id];
    setChecked(newChecked);
  };

  const itemsArray = it.map((item, index) => (
    <TouchableOpacity key={index}>
      <View>
        <CheckBox
          backgroundcolor="#FDECF0"
          center
          title={item}
          size={26}
          right
          checkedColor="#EE4266"
          checked={checked[index]}
          containerStyle={styles.itembox}
          textStyle={{ fontSize: 20, fontWeight: "normal" }}
          onPress={() => handleOnChange(index)}
        />
      </View>
    </TouchableOpacity>
  ));
  const allitems = itemsArray.slice(0, 10);
  let [items, setItems] = useState(allitems);
  const [visibility, setVisibility] = useState(false);
  const [text, setText] = useState("");
  return (
    <View style={styles.loading}>
      {getContent()}
      {!isLoading && (
        <View>
          {/* IMPORTANT SHIT HERE BRUHHHHHHH HERE HERRE RIGHT HERE WHERE ALL THE IMPORTANT SHIT IS */}
          <IconButton
            style={{ alignSelf: "flex-end" }}
            size={32}
            icon="plus"
            onPress={() => {
              setVisibility(true);
              setItems(checkClicked ? items : allitems);
            }}
          />
          <Modal
            animationType="slide"
            transparent={false}
            visible={visibility}
            onDismiss={() => {
              setVisibility(false);
            }}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setVisibility(false);
            }}
          >
            <View>
              <TextInput
                clearButtonMode="always"
                mode="outlined"
                style={styles.centeredView}
                label="add item"
                value={text}
                onChangeText={(text) => setText(text)}
                activeOutlineColor="#EE4266"
              />
            </View>
            <Button
              style={{ fontSize: 24 }}
              textColor="#EE4266"
              onPress={() => {
                console.log({ items });
                if (items.length < 11 && text) {
                  setIt([...it, text]);
                  setChecked([...checked, false]);
                  setItems([
                    ...items,
                    <TouchableOpacity key={checked.length - 1}>
                      <View>
                        <CheckBox
                          backgroundcolor="#FDECF0"
                          center
                          title={text}
                          size={26}
                          right
                          checkedColor="#EE4266"
                          checked={checked[checked.length - 1]}
                          containerStyle={styles.itembox}
                          textStyle={{ fontSize: 20, fontWeight: "normal" }}
                          onPress={() => handleOnChange(checked.length)}
                        />
                      </View>
                    </TouchableOpacity>,
                  ]);
                  console.log(items.length);
                }
                setVisibility(false);
                setCheckedClicked(true);
              }}
            >
              {" "}
              done!
            </Button>
          </Modal>

          <View
            style={{
              flexDirection: "column",
              width: 350,
              justifyContent: "center",
            }}
          >
            <View style={styles.textwrap}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontWeight: 600, fontSize: 28 }}>Here's a </Text>
                <Text
                  style={{ fontWeight: 600, fontSize: 28, color: "#EE4266" }}
                >
                  list of Items
                </Text>
              </View>
              <Text style={{ fontWeight: 600, fontSize: 28 }}>
                we came up with{" "}
              </Text>
            </View>
            <View
              style={{
                marginLeft: 0,
                marginBottom: 50,
                alignSelf: "center",
                height: 300,
                width: "110%",
              }}
            >
              <ScrollView contentContainerStyle={styles.container}>
                {!checkClicked ? allitems : items}
              </ScrollView>
            </View>
            <Button
              labelStyle={styles.buttontext}
              onPress={() =>
                navigation.navigate("Generate", {
                  chosenElements: trueElements,
                  budget: searchQuery,
                })
              }
              style={styles.button}
              mode="contained"
            >
              Optimize Cost!
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    padding: 10,
    backgroundcolor: "#FFFFFF",
    flexDirection: "column",
    borderColor: "#303030",
    justifyContent: "center",
  },

  itembox: {
    flexDirection: "row",
    backgroundColor: "rgba(238, 66, 102, 0.1)",
    padding: 5,
    paddingLeft: 20,
    height: 60,
    borderRadius: 2,
  },

  itemtext: {
    borderRadius: 6,
    padding: 5,
    textAlign: "right",
  },
  textwrap: {
    justifyContent: "center",
    marginTop: 50,
    marginBottom: 50,
    alignItems: "center",
  },
  button: {
    marginBottom: 50,
    marginTop: 50,
    // marginLeft : 45,
    height: 40,
    width: "90%",
    left: "5%",
    backgroundColor: "#303030",
    justifyContent: "center",
    borderRadius: 10,
  },
  buttontext: {
    justifyContent: "center",
    alignItems: "center",
  },
  add: {
    alignSelf: "flex-end",
  },
  centeredView: {
    marginTop: "90%",
    justifyContent: "center",
    alignSelf: "center",
    height: 60,
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    fontSize: 24,
  },
});
