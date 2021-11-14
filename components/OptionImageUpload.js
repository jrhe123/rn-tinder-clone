import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import tw from "tailwind-rn";
import { Ionicons } from "@expo/vector-icons";

const OptionImageUpload = ({ source, pickImage, deleteImage }) => {
  return (
    <TouchableOpacity onPress={pickImage}>
      {source ? (
        <View style={tw("relative")}>
          <View
            style={tw(
              "justify-center items-center bg-red-400 absolute right-0 bottom-0 z-30 h-10 w-10"
            )}
          >
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                deleteImage();
              }}
            >
              <Ionicons name="ios-trash" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Image source={{ uri: source }} style={tw("w-full h-full")} />
        </View>
      ) : (
        <View
          style={tw("justify-center items-center w-full h-full bg-gray-200")}
        >
          <Text style={tw("text-gray-800 text-xl")}>+</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default OptionImageUpload;
