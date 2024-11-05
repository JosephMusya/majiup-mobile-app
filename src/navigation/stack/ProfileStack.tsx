import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../../screens/profile/Profile";
import EditProfile from "../../screens/edit-profile/EditProfile";
import { color } from "../../theme/theme";

export default function ProfileStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerStyle: {
          backgroundColor: color.primaryColor,
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen
        name="EditProfile"
        options={{
          title: "Edit Profile",
        }}
        component={EditProfile}
      />
    </Stack.Navigator>
  );
}
