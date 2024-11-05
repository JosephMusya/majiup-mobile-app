import { View, Text, Image } from "react-native";
import React from "react";
import { flex } from "../../theme/theme";

export default function EmptyBox({
  text,
  color = "black",
  children,
}: {
  text: string;
  color?: string;
  children?: any;
}) {
  return (
    <View
      style={[
        {
          flex: 1,
          flexGrow: 1,
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        },
      ]}
    >
      <Text style={{ color: color }}>{text}</Text>
      {children}
    </View>
  );
}
