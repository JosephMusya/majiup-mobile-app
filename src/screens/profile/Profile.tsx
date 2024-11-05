import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { color, flex, fontSize } from "../../theme/theme";
import {
  getExpoToken,
  useDeviceContext,
} from "../../providers/devices/DeviceProvider";
import LoadingBox from "../../components/loading/LoadingBox";
import { MaterialIcons } from "@expo/vector-icons";
import EmptyBox from "../../components/containers/EmptyBox";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../../components/button/Button";
import { removeExpoToken } from "../../providers/devices/DeviceProvider";

export default function Profile({ navigation }: any) {
  const { devices, userProfile, loadingProfile, timeoutErr, connectedWifi } =
    useDeviceContext();

  const editProfile = () =>
    navigation.navigate("EditProfile", {
      profile: userProfile?.profile,
    });

  return (
    <SafeAreaView>
      {loadingProfile ? (
        <LoadingBox />
      ) : timeoutErr ? (
        <View
          style={{
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ color: color.secondaryColor }}>
            Unable to get your profile!
          </Text>
        </View>
      ) : (
        <View>
          <View
            style={[
              flex.row,
              {
                gap: 15,
                padding: 8,
                backgroundColor: color.complementaryColor,
              },
            ]}
          >
            <View
              style={{
                backgroundColor: color.primaryColor,
                width: 80,
                aspectRatio: 1,
                borderRadius: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff" }}>MAJIUP</Text>
            </View>
            <View>
              <Text>
                {userProfile?.profile?.first_name}{" "}
                {userProfile?.profile?.last_name}
              </Text>
              <Text>@{userProfile?.profile?.username}</Text>
            </View>
            <View style={{ position: "absolute", top: 10, right: 10 }}>
              <TouchableOpacity onPress={editProfile}>
                <MaterialIcons name="edit" size={18} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {userProfile?.profile?.address &&
          userProfile?.profile?.email &&
          userProfile?.profile?.phone ? (
            <View style={{ gap: 10, padding: 8 }}>
              {connectedWifi && (
                <View style={[flex.row, { gap: 15 }]}>
                  <Ionicons name="wifi" size={20} color={color.primaryColor} />
                  <Text>You are connected to {connectedWifi?.SSID}</Text>
                </View>
              )}
              <View style={[flex.row, { gap: 15 }]}>
                <Entypo
                  name="location-pin"
                  size={20}
                  color={color.primaryColor}
                />
                <Text>{userProfile?.profile?.address}</Text>
              </View>
              <View style={[flex.row, { gap: 15 }]}>
                <MaterialCommunityIcons
                  name="email-check-outline"
                  size={20}
                  color={color.primaryColor}
                />
                <Text>{userProfile?.profile?.email}</Text>
              </View>
              <View style={[flex.row, { gap: 15 }]}>
                <SimpleLineIcons
                  name="phone"
                  size={18}
                  color={color.primaryColor}
                />
                <Text>{userProfile?.profile?.phone}</Text>
              </View>
              <View style={[flex.row, { justifyContent: "space-between" }]}>
                <Text>Tanks Connected</Text>
                <View
                  style={{
                    backgroundColor: color.primaryColor,
                    width: 25,
                    aspectRatio: 1,
                    borderRadius: 25,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#fff" }}>{devices.length}</Text>
                </View>
              </View>
              <View style={[flex.row, { justifyContent: "space-between" }]}>
                {getExpoToken() ? (
                  <Text style={{ fontSize: fontSize.small, color: "gray" }}>
                    {getExpoToken()}
                  </Text>
                ) : (
                  <View style={[flex.col, { gap: 5 }]}>
                    <Text style={{ fontSize: fontSize.small, color: "gray" }}>
                      You wont receive notifications
                    </Text>
                    <CustomButton
                      title="Activate"
                      onPress={getExpoToken}
                      width={100}
                    />
                  </View>
                )}
                {getExpoToken() && (
                  <CustomButton
                    title="Clear"
                    onPress={removeExpoToken}
                    width={100}
                  />
                )}
              </View>
            </View>
          ) : (
            <View>
              <Text style={{ color: color.secondaryColor }}>
                User Profile not set!
              </Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
