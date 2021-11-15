import React from "react";
import { View, Text, SafeAreaView } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/core";
import Header from "../components/Header";
import tw from "tailwind-rn";

const DetailScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { card } = params;

  return (
    <SafeAreaView>
      <Header title={card.displayName} callEnabled={false} />
    </SafeAreaView>
  );
};

export default DetailScreen;
