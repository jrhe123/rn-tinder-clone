import React, { useLayoutEffect } from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";

// import { useNavigation } from "@react-navigation/core";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";

const LoginScreen = () => {
  const { signInWithGoogles } = useAuth();
  // const navigation = useNavigation();

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerShown: false,
  //   });
  // }, []);

  return (
    <View style={tw("flex-1")}>
      <ImageBackground
        resizeMode="cover"
        style={tw("flex-1")}
        source={require("../assets/tinder/tinder.png")}
      >
        <TouchableOpacity
          style={[
            tw("absolute bottom-40 w-52 bg-white p-4 rounded-2xl"),
            {
              marginHorizontal: "25%",
            },
          ]}
          onPress={signInWithGoogles}
        >
          <Text style={tw("font-semibold text-center")}>Sign in</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
