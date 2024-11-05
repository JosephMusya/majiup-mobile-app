import { View, Text } from "react-native";
import React from "react";

export default function Separator({ height = 10 }: { height: number }) {
  return <View style={{ height: height }}></View>;
}
