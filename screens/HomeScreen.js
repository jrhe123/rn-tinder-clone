import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/core";
import useAuth from "../hooks/useAuth";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  return (
    <View>
      <Text>home screen</Text>
      <Button title="click me" onPress={() => navigation.navigate("Chat")} />
      <Button title="logout" onPress={logout} />
    </View>
  );
};

export default HomeScreen;
