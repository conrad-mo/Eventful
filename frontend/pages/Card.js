import * as React from "react";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import { StyleSheet, View } from "react-native";

const LeftContent = (props) => (
  <Avatar.Icon
    {...props}
    style={{ backgroundColor: "#EE4266" }}
    icon="folder"
  />
);
const RightContent = (props) => (
  <Avatar.Icon
    {...props}
    style={{ backgroundColor: "transparent" }}
    size={40}
    color="#828282"
    icon="dots-vertical"
  />
);

export default function Cards() {
  return (
    <View style={styles.wrap}>
      <Card style={styles.card}>
        <Card.Title
          style={styles.title}
          title="Card Title"
          subtitle="Card Subtitle"
          left={LeftContent}
          right={RightContent}
        />
        <Card.Cover style={styles.cover} source={{ uri: "" }} />
        <Card.Content>
          <Title>Card title</Title>
          <View style={{ height: "25%" }}>
            <Paragraph>content</Paragraph>
          </View>
        </Card.Content>

        <Card.Actions style={{ position: "fixed" }}>
          <Button textColor="#EE4266">Back</Button>
          <Button style={{ backgroundColor: "#EE4266" }}>Next</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    padding: 10,
  },
  wrap: {
    height: "100%",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    height: 500,
    borderRadius: 12,
    backgroundColor: "#F7F2FA",
  },
  cover: {
    borderRadius: 0,
  },
});
