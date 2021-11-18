import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs(); //Ignore all log notifications

import { AuthProvider } from "./hooks/useAuth";
import StackNavigator from "./StackNavigator";

export default function App() {
  return (
    <NavigationContainer>
      {/* HOC */}
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
