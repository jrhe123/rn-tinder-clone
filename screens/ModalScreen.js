import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
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
import OptionImageUpload from "../components/OptionImageUpload";

const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateProfile, setIsUpdateProfile] = useState(false);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [optionImages, setOptionImages] = useState({});
  const [optionImageURLs, setOptionImageURLs] = useState({});
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
          const { photoURL, job, age, optionImageURLs } = loggedInProfile;
          setImage(photoURL);
          setImageURL(photoURL);
          setOptionImages(optionImageURLs || {});
          setOptionImageURLs(optionImageURLs || {});
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
        optionImageURLs: optionImageURLs,
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
        optionImageURLs: {},
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

  const pickImage = async (index = 0) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      if (index > 0) {
        try {
          setOptionImages({ ...optionImages, ...{ [index]: result.uri } });
          setIsLoading(true);
          const uploadRes = await uploadImage(result);
          setOptionImageURLs({ ...optionImageURLs, ...{ [index]: uploadRes } });
          setIsLoading(false);
        } catch (error) {
          setOptionImages({ ...optionImages, ...{ [index]: null } });
          setOptionImageURLs({ ...optionImageURLs, ...{ [index]: null } });
          setIsLoading(false);
        }
      } else {
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
    }
  };

  const deleteImage = (index) => {
    setOptionImages({ ...optionImages, ...{ [index]: null } });
    setOptionImageURLs({ ...optionImageURLs, ...{ [index]: null } });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={70}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
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
            isUpdateProfile ? (
              <>
                <View style={tw("flex-row")}>
                  <TouchableOpacity onPress={pickImage}>
                    <Image source={{ uri: image }} style={tw("w-64 h-64")} />
                  </TouchableOpacity>
                  <View style={tw("w-32 h-32 ml-2")}>
                    <View style={tw("mb-1")}>
                      <OptionImageUpload
                        source={optionImages["1"] || ""}
                        pickImage={() => pickImage(1)}
                        deleteImage={() => deleteImage(1)}
                      />
                    </View>
                    <View>
                      <OptionImageUpload
                        source={optionImages["2"]}
                        pickImage={() => pickImage(2)}
                        deleteImage={() => deleteImage(2)}
                      />
                    </View>
                  </View>
                </View>
                <View style={tw("w-full h-32 mt-1 flex-row")}>
                  <View style={tw("w-32 h-32 mr-1")}>
                    <OptionImageUpload
                      source={optionImages["3"]}
                      pickImage={() => pickImage(3)}
                      deleteImage={() => deleteImage(3)}
                    />
                  </View>
                  <View style={tw("w-32 h-32 mr-1")}>
                    <OptionImageUpload
                      source={optionImages["4"]}
                      pickImage={() => pickImage(4)}
                      deleteImage={() => deleteImage(4)}
                    />
                  </View>
                  <View style={tw("w-32 h-32")}>
                    <OptionImageUpload
                      source={optionImages["5"]}
                      pickImage={() => pickImage(5)}
                      deleteImage={() => deleteImage(5)}
                    />
                  </View>
                </View>
              </>
            ) : (
              <TouchableOpacity onPress={pickImage}>
                <Image source={{ uri: image }} style={tw("w-80 h-80")} />
              </TouchableOpacity>
            )
          ) : (
            <TouchableOpacity onPress={pickImage}>
              <View style={[tw("p-3 rounded-full mb-3 bg-red-400")]}>
                <Ionicons name="ios-camera" size={34} color="#FFF" />
              </View>
            </TouchableOpacity>
          )}
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
            tw("w-64 p-3 rounded-xl mt-10 mb-10"),
            incompleteForm ? tw("bg-gray-400") : tw("bg-red-400"),
          ]}
          onPress={updateUserProfile}
        >
          <Text style={tw("text-center text-white text-xl")}>
            Update Profile
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ModalScreen;
