import { View, Text, Button } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TankView from "../../screens/tank-view/TankView";
import Dashboard from "../../screens/dashboard/Dashboard";
import { color } from "../../theme/theme";
import { Ionicons } from "@expo/vector-icons";
import Wifi from "../../screens/wifi/Wifi";

const Stack = createNativeStackNavigator();

export default function StackNavigation({ navigation }: any) {
    return (
        <Stack.Navigator
            initialRouteName="HomeScreen"
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
                name="Dashboard"
                options={{
                    title: "Majiup",
                    headerRight: () => (
                        <Ionicons
                            onPress={() => navigation.navigate("WiFi")}
                            name="wifi"
                            size={20}
                            color="#fff"
                        />
                    ),
                }}
                component={Dashboard}
            />
            <Stack.Screen
                name="TankView"
                options={({ route }: any) => ({
                    title: route.params?.name || "Tank View",
                })}
                component={TankView}
            />
            <Stack.Screen
                name="WiFi"
                component={Wifi}
                options={{
                    title: "WiFi Networks",
                }}
            />
        </Stack.Navigator>
    );
}
