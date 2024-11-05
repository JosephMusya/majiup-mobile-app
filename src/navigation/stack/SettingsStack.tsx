import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Settings from "../../screens/settings/Settings";
import { color } from "../../theme/theme";
import EditSettings from "../../components/edit-settings/EditSettings";

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: color.primaryColor,
        },
        headerTintColor: "#fff",
        animation: "none",
      }}
    >
      <Stack.Screen
        name="Settings"
        options={{
          title: "Settings",
        }}
        component={Settings}
      />
      <Stack.Screen
        name="EditSettings"
        // options={({ route }: any) => ({
        //   title: route.params?.name || "Tank Edit",
        // })}
        options={({ route }: any) => ({
          title: `Edit ${route?.params?.tank?.name}` || "Edit Tank",
        })}
        component={EditSettings}
      />
      {/* <Stack.Screen name="EditSettings" component={EditSettings} /> */}
    </Stack.Navigator>
  );
}
