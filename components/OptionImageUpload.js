import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import tw from "tailwind-rn";

const OptionImageUpload = ({ pickImage }) => {
  return (
    <TouchableOpacity onPress={pickImage}>
      <View style={tw("justify-center items-center w-full h-full bg-gray-200")}>
        <Text style={tw("text-gray-800 text-xl")}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

export default OptionImageUpload;
