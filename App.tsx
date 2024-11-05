import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TabNavigation from "./src/navigation/tab/TabNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { DeviceProvider } from "./src/providers/devices/DeviceProvider";
import StackNavigation from "./src/navigation/stack/StackNavigation";
import Dashboard from "./src/screens/dashboard/Dashboard";
import { color } from "./src/theme/theme";

export default function App() {
  return (
    <DeviceProvider>
      <StatusBar backgroundColor={color.primaryColor} />
      <NavigationContainer>
        <TabNavigation />
      </NavigationContainer>
    </DeviceProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
