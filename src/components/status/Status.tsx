import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { color, flex, fontSize } from "../../theme/theme";
type StatusProp = {
  status: boolean;
};
export default function ({ status }: StatusProp) {
  return (
    <View style={[flex.row, { gap: 5, alignItems: "center" }]}>
      {/* {status && ( */}
      <Text
        style={{
          color: status ? "green" : color.secondaryColor,
          fontSize: fontSize.small,
        }}
      >
        {status ? "Online" : "Offline"}
      </Text>
      {/* )} */}
      <View
        style={{
          width: 7,
          backgroundColor: status ? "green" : color.secondaryColor,
          borderRadius: 10,
          borderWidth: 0,
          aspectRatio: 1,
        }}
      ></View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {},
});
