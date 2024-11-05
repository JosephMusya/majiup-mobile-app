import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme/theme";
import { MaterialIcons } from "@expo/vector-icons";
import StackNavigation from "../stack/StackNavigation";
import SettingsStack from "../stack/SettingsStack";
import ProfileStack from "../stack/ProfileStack";
import Notifications from "../../screens/notifications/Notifications";
import { useDeviceContext } from "../../providers/devices/DeviceProvider";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  const { unread } = useDeviceContext();
  return (
    <Tab.Navigator
      initialRouteName=""
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#ADADAE",
        tabBarStyle: {
          paddingBottom: 3,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          paddingTop: 2,
          height: 60,
          backgroundColor: color.primaryColor,
        },
        tabBarLabelStyle: {
          fontSize: 15,
          // color: "#fff",
        },
        headerStyle: {
          backgroundColor: color.primaryColor,
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={StackNavigation}
        initialParams={{}}
        options={({}) => ({
          title: "My Tanks",
          headerTintColor: "#fff",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
          headerShown: false,

          //   headerRight: ({}) => (
          //     <Octicons name="search" size={24} color="black" />
          //   ),
        })}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        initialParams={{}}
        options={({ route }: any) => ({
          tabBarBadge: unread ? unread : (null as unknown as string),
          title: "Notifcations",
          headerTintColor: "#fff",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={24} color={color} />
          ),
        })}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStack}
        initialParams={{}}
        options={({ navigation }) => ({
          title: "Settings",
          headerTintColor: "#fff",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        })}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        initialParams={{}}
        options={({ navigation }) => ({
          title: "Profile",
          headerShown: false,
          headerTintColor: "#fff",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        })}
      />
    </Tab.Navigator>
  );
}
