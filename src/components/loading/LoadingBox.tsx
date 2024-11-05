import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { color } from "../../theme/theme";

export default function () {
  return (
    <View
      style={{
        justifyContent: "center",
        flex: 1,
        display: "flex",
        flexGrow: 1,
        backgroundColor: color.shadowColor,
      }}
    >
      <ActivityIndicator size={40} color={color.primaryColor} />
    </View>
  );
}
