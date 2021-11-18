import React, { useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  Dimensions,
  Image,
  Text,
  ScrollView,
} from "react-native";

import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useRoute } from "@react-navigation/core";
import Header from "../components/Header";
import tw from "tailwind-rn";

import { scrollInterpolator, animatedStyles } from "../utils/animations";

const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SLIDER_WIDTH;
const ITEM_HEIGHT = SLIDER_WIDTH;

const DetailScreen = () => {
  const [index, setIndex] = useState(0);
  const isCarousel = useRef(null);
  const { params } = useRoute();
  const { card } = params;
  const { photoURL, optionImageURLs } = card;
  const optionImages = optionImageURLs ? Object.values(optionImageURLs) : [];
  const imageArr = [photoURL, ...optionImages].filter((a) => a);

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const _renderItem = ({ item }) => {
    return (
      <View
        style={{
          width: ITEM_WIDTH,
          height: ITEM_HEIGHT,
        }}
      >
        <Image style={tw("w-full h-full")} source={{ uri: item }} />
      </View>
    );
  };

  return (
    <SafeAreaView>
      <Header title={card.displayName} callEnabled={false} />
      <Carousel
        data={imageArr}
        ref={isCarousel}
        renderItem={_renderItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        containerCustomStyle={{}}
        inactiveSlideShift={0}
        scrollInterpolator={scrollInterpolator}
        slideInterpolatedStyle={animatedStyles}
        onSnapToItem={(index) => setIndex(index)}
        useScrollView={true}
      />
      <Pagination
        dotsLength={imageArr.length}
        activeDotIndex={index}
        carouselRef={isCarousel}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 0,
          backgroundColor: "rgba(0, 0, 0, 0.92)",
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        tappableDots={true}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: 120,
        }}
      >
        <Ionicons name="newspaper-outline" size={42} color="#FF5864" />
        <Text style={tw("text-2xl pt-4 pb-2 font-semibold")}>
          {capitalize(card.displayName)}
        </Text>
        <Text style={tw("text-lg pb-2")}>Job: {card.job}</Text>
        <Text style={tw("text-lg pb-12")}>Age: {card.age}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreen;
