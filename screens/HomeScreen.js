import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/core";
import useAuth from "../hooks/useAuth";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import tw from "tailwind-rn";
import Swiper from "react-native-deck-swiper";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../firebase";
import generateId from "../lib/generateId";

const HomeScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isActiveMatch, setIsActiveMatch] = useState(false);
  const [isNewMatch, setIsNewMatch] = useState(false);
  const [isOpenSuperLike, setIsOpenSuperLike] = useState(false);
  const [superLike, setSuperLike] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const swipeRef = useRef();

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches"),
          where("usersMatched", "array-contains", user.uid)
        ),
        (snapshot) => {
          setMatches(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
          setLoadingInitial(false);
        }
      ),
    [user]
  );

  useEffect(() => {
    if (!loadingInitial && !isActiveMatch) {
      setIsNewMatch(true);
    }
  }, [matches]);

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        }
      }),
    []
  );

  useEffect(() => {
    let unsub;
    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));
      const swipes = await getDocs(
        collection(db, "users", user.uid, "swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      // Filter out passed & swiped
      // dummy is for firebase need something not null
      const passedUserIds = passes.length > 0 ? passes : ["dummy"];
      const swipedUserIds = swipes.length > 0 ? swipes : ["dummy"];

      // console.log("passedUserIds: ", passedUserIds);
      // console.log("swipedUserIds: ", swipedUserIds);

      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid) // filter out myself
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };

    fetchCards();
    return unsub;
  }, []);

  const swipeLeft = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };

  const swipeRight = async (cardIndex, isSuperLike = false) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();

    if (isSuperLike) {
      setSuperLike(userSwiped);
    }

    // Check user swiped on you before
    getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          // Add to swipes
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
          // Create a MATCH
          const matchId = generateId(user.uid, userSwiped.id);
          setDoc(doc(db, "matches", matchId), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });
          // Pass matched users info
          setIsActiveMatch(true);
          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        } else {
          // Add to swipes
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
        }
      }
    );
  };

  const calculateImages = (card) => {
    let numberOfImages = 1;
    const object = card.optionImageURLs || {};
    for (const [key, value] of Object.entries(object)) {
      if (key && value) {
        numberOfImages++;
      }
    }
    return numberOfImages;
  };

  const swipeBack = () => {
    swipeRef.current.swipeBack();
  };

  const swipeUp = () => {
    swipeRef.current.swipeTop();
    fadeIn();
    setTimeout(() => {
      fadeOut();
    }, 1000);
  };

  const fadeIn = () => {
    setIsOpenSuperLike(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    setIsOpenSuperLike(false);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={tw("flex-1 relative")}>
      {/* Header */}
      <View style={tw("flex-row items-center justify-between px-5")}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw("h-10 w-10 rounded-full")}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={tw("h-14 w-14")}
            resizeMode="contain"
            source={require("../assets/tinder/tinder-logo.png")}
          />
        </TouchableOpacity>

        <View style={tw("relative")}>
          {isNewMatch && (
            <View
              style={tw(
                "justify-center items-center absolute -top-1 -left-1 w-5 h-5 rounded-full bg-yellow-500 z-10"
              )}
            >
              <Text style={tw("text-white")}>1</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => {
              setIsNewMatch(false);
              navigation.navigate("Chat");
            }}
          >
            <Ionicons name="chatbubbles-sharp" size={36} color="#FF5864" />
          </TouchableOpacity>
        </View>
      </View>
      {/* End of Header */}

      {/* Animation */}
      <Animated.View
        style={[
          tw("flex-1 bg-blue-500 w-full justify-center items-center"),
          {
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 999,
            opacity: fadeAnim,
            height: isOpenSuperLike ? Dimensions.get("window").height : 0,
          },
        ]}
      >
        <View
          style={[
            tw("border-white border-4 rounded-2xl p-2 px-4"),
            {
              position: "relative",
              zIndex: 1000,
            },
          ]}
        >
          <Text
            style={[tw("text-white"), { fontSize: 40, fontWeight: "bold" }]}
          >
            Super Like!
          </Text>
          <View style={[tw("absolute -top-7 -right-6")]}>
            <Ionicons name="ios-star" size={42} color="white" />
          </View>
        </View>

        <View>
          {superLike && (
            <Image
              style={tw("h-60 w-60 rounded-full")}
              source={{ uri: superLike.photoURL }}
            />
          )}
        </View>
      </Animated.View>
      {/* End of Animation */}

      {/* Swiper */}
      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          swipeBackCard={true}
          onSwipedLeft={(cardIndex) => swipeLeft(cardIndex)}
          onSwipedRight={(cardIndex) => swipeRight(cardIndex)}
          onSwipedTop={(cardIndex) => {
            swipeRight(cardIndex, true);
          }}
          overlayLabels={{
            left: {
              title: "Nope",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                  fontWeight: "bold",
                  fontSize: 42,
                },
              },
            },
            right: {
              title: "Like",
              style: {
                label: {
                  textAlign: "left",
                  color: "#4DED30",
                  fontWeight: "bold",
                  fontSize: 42,
                },
              },
            },
            top: {
              element: (
                <Text
                  style={[
                    tw("text-blue-500"),
                    {
                      fontSize: 42,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  Super Like
                </Text>
              ),
              style: {
                wrapper: {
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                },
              },
            },
          }}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw("relative bg-white h-3/4 rounded-xl")}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 15,
                    left: 15,
                    width: 60,
                    height: 36,
                    zIndex: 1,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Ionicons name="image" size={24} color="#FFFFFF" />
                  <Text style={tw("text-white text-xl")}>
                    {" "}
                    {calculateImages(card)}
                  </Text>
                </View>
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
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw(
                    "relative bg-white h-3/4 rounded-xl justify-center items-center"
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
                <Text style={tw("font-bold pb-5")}>No more profles</Text>
                <Image
                  style={tw("h-20 w-full")}
                  height={100}
                  width={100}
                  source={require("../assets/tinder/tinder-not-found.png")}
                />
              </View>
            )
          }
        />
      </View>
      {/* End of Swiper */}

      {/* Buttons */}
      <View style={tw("flex flex-row justify-evenly")}>
        <TouchableOpacity
          style={tw(
            "items-center justify-center rounded-full w-12 h-12 bg-yellow-400"
          )}
          onPress={() => swipeBack()}
        >
          <Ionicons
            style={{ transform: [{ rotateY: "180deg" }] }}
            name="ios-arrow-redo-sharp"
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-red-400"
          )}
          onPress={() => swipeRef.current.swipeLeft()}
        >
          <Entypo name="cross" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-green-400"
          )}
          onPress={() => swipeRef.current.swipeRight()}
        >
          <Entypo name="heart" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw(
            "items-center justify-center rounded-full w-12 h-12 bg-blue-400"
          )}
          onPress={() => swipeUp()}
        >
          <Ionicons name="ios-star" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {/* End of Buttons */}
    </SafeAreaView>
  );
};

export default HomeScreen;
