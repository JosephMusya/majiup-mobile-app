import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { color, flex, fontSize } from "../../theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { Notification } from "../../types";
import { dayTimeFormat, formatTime } from "../../utils/fx/timeFormatter";

type NotificationCard = {
  notification: Notification;
  onPress?: () => {};
};

export default function NotificationCard({
  notification,
  onPress,
}: NotificationCard) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          flex.row,
          {
            backgroundColor: notification.read_status
              ? color.complementaryColor
              : color.primaryColor,
            borderRadius: 3,
            minHeight: 55,
            padding: 5,
            gap: 5,
            width: "100%",
          },
        ]}
      >
        <Ionicons
          name="notifications-outline"
          size={24}
          color={notification.read_status ? "black" : "#fff"}
        />

        <View style={[flex.col, { gap: 5, width: "90%" }]}>
          <View
            style={[
              flex.row,
              {
                position: "relative",
                justifyContent: "space-between",
              },
            ]}
          >
            <Text
              style={{
                fontWeight: "500",
                color: notification.read_status ? "black" : "#fff",
              }}
            >
              {notification?.tank_name}
            </Text>
            <Text
              style={{
                fontSize: fontSize.medium,
              }}
            >
              {notification.time && dayTimeFormat(new Date(notification?.time))}
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: notification.read_status ? "black" : "#fff",
              }}
              numberOfLines={2}
            >
              {notification.message}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
