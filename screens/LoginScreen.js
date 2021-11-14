import React from "react";
import { View, Text, Button } from "react-native";
import useAuth from "../hooks/useAuth";

const LoginScreen = () => {
  const { signInWithGoogles } = useAuth();
  return (
    <View>
      <Text>login</Text>
      <Button title="login" onPress={signInWithGoogles} />
    </View>
  );
};

export default LoginScreen;
