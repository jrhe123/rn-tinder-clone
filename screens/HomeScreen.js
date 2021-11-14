import React, { useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";

import { useNavigation } from "@react-navigation/core";
import useAuth from "../hooks/useAuth";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import tw from "tailwind-rn";
import Swiper from "react-native-deck-swiper";

const DUMMY_DATA = [
  {
    id: 1,
    firstName: "Roy",
    lastName: "He",
    job: "Software Developer",
    photoURL:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    age: 32,
  },
  {
    id: 2,
    firstName: "Roy2",
    lastName: "He2",
    job: "Software Developer",
    photoURL:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    age: 32,
  },
  {
    id: 3,
    firstName: "Roy3",
    lastName: "He3",
    job: "Software Developer",
    photoURL:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    age: 32,
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const swipeRef = useRef();

  return (
    <SafeAreaView style={tw("flex-1")}>
      {/* Header */}
      <View style={tw("flex-row items-center justify-between px-5")}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw("h-10 w-10 rounded-full")}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            style={tw("h-14 w-14")}
            resizeMode="contain"
            source={require("../assets/tinder/tinder-logo.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>
      {/* End of Header */}

      {/* Swiper */}
      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={DUMMY_DATA}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={() => {
            console.log("no");
          }}
          onSwipedRight={() => {
            console.log("yes");
          }}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  textAlign: "left",
                  color: "#4DED30",
                },
              },
            },
          }}
          renderCard={(card) => (
            <View
              key={card.id}
              style={tw("relative bg-white h-3/4 rounded-xl")}
            >
              <Image
                style={tw("absolute top-0 h-full w-full rounded-xl")}
                source={{ uri: card.photoURL }}
              />
              <View
                style={[
                  tw(
                    "px-6 py-2 rounded-b-xl absolute bottom-0 flex-row justify-between items-center bg-white w-full h-20"
                  ),
                  {
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,
                    elevation: 2,
                  },
                ]}
              >
                <View>
                  <Text style={tw("text-xl font-bold")}>
                    {card.firstName} {card.lastName}
                  </Text>
                  <Text>{card.job}</Text>
                </View>
                <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
              </View>
            </View>
          )}
        />
      </View>
      {/* End of Swiper */}

      {/* Buttons */}
      <View style={tw("flex flex-row justify-evenly")}>
        <TouchableOpacity
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
          onPress={() => swipeRef.current.swipeLeft()}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
          onPress={() => swipeRef.current.swipeRight()}
        >
          <Entypo name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
      {/* End of Buttons */}
    </SafeAreaView>
  );
};

export default HomeScreen;
