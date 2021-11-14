import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/core";
import tw from "tailwind-rn";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  getDoc,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../firebase";
import uploadImage from "../lib/uploadImage";

const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateProfile, setIsUpdateProfile] = useState(false);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);

  const incompleteForm = !image || !job || !age || !imageURL || isLoading;

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), async (snapshot) => {
        if (snapshot.exists()) {
          // Retrieve profile of myself
          const loggedInProfile = await (
            await getDoc(doc(db, "users", user.uid))
          ).data();
          const { photoURL, job, age } = loggedInProfile;
          setImage(photoURL);
          setImageURL(photoURL);
          setJob(job);
          setAge(age);
          setIsUpdateProfile(true);
        }
      }),
    [user.uid]
  );

  const updateUserProfile = () => {
    if (isUpdateProfile) {
      // Update profile
      updateDoc(doc(db, "users", user.uid), {
        id: user.uid,
        displayName: user.displayName,
        photoURL: imageURL,
        job: job,
        age: age,
        timestamp: serverTimestamp(),
      })
        .then(() => {
          navigation.navigate("Home");
        })
        .catch((error) => {
          console.log("error: ", error.message);
        });
    } else {
      // Create profile
      setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        displayName: user.displayName,
        photoURL: imageURL,
        job: job,
        age: age,
        timestamp: serverTimestamp(),
      })
        .then(() => {
          navigation.navigate("Home");
        })
        .catch((error) => {
          console.log("error: ", error.message);
        });
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      try {
        setImage(result.uri);
        setIsLoading(true);
        const uploadRes = await uploadImage(result);
        setImageURL(uploadRes);
        setIsLoading(false);
      } catch (error) {
        setImage(null);
        setImageURL(null);
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={tw("flex-1 items-center pt-1")}>
      <Image
        style={tw("h-20 w-full")}
        resizeMode="contain"
        source={require("../assets/tinder/tinder-logo-modal.png")}
      />
      <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>
        Welcome {user.displayName}
      </Text>

      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 1: The Profile Pic
      </Text>
      <View style={tw("relative")}>
        <TouchableOpacity onPress={pickImage}>
          {isLoading && (
            <View
              style={tw(
                "absolute top-0 left-0 h-full w-full z-10 justify-center items-center"
              )}
            >
              <ActivityIndicator size="large" color="#FFF" />
            </View>
          )}
          {image ? (
            <Image source={{ uri: image }} style={tw("w-80 h-80")} />
          ) : (
            <View style={[tw("p-3 rounded-full mb-3 bg-red-400")]}>
              <Ionicons name="ios-camera" size={34} color="#FFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 2: The Job
      </Text>
      <TextInput
        value={job}
        onChangeText={(text) => setJob(text)}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your occupation"
      />

      <Text style={tw("text-center p-4 font-bold text-red-400")}>
        Step 3: The Age
      </Text>
      <TextInput
        value={age}
        onChangeText={(text) => setAge(text)}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your age"
        keyboardType="numeric"
        maxLength={2}
      />

      <TouchableOpacity
        disabled={incompleteForm}
        style={[
          tw("w-64 p-3 rounded-xl absolute bottom-10"),
          incompleteForm ? tw("bg-gray-400") : tw("bg-red-400"),
        ]}
        onPress={updateUserProfile}
      >
        <Text style={tw("text-center text-white text-xl")}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
