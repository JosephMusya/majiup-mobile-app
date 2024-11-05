import { View, Text } from "react-native";
import React from "react";
import { color } from "../../theme/theme";

export const dataPoint = ({
  liters,
  date,
}: {
  liters: number;
  date?: string;
}) => {
  return (
    <View
      style={{
        backgroundColor: color.complementaryColor,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 4,
      }}
    >
      <Text>Water Quantity - {date}</Text>
      <Text style={{ color: color.primaryColor }}>{liters} Liters</Text>
    </View>
  );
};
