import { View, Text } from "react-native";
import React from "react";
import { color, flex } from "../../theme/theme";
import { BatteryInfo } from "../../screens/tank-view/TankView";
import { MaterialIcons } from "@expo/vector-icons";

interface BatteryDevice extends BatteryInfo {
  on?: boolean;
}

export default function DeviceHealth({
  charging,
  percentage,
  on,
}: BatteryDevice) {
  return (
    <View
      style={{
        padding: 8,
        elevation: 1,
        borderWidth: 0,
        borderRadius: 5,
        backgroundColor: "#fff",
      }}
    >
      <View style={[flex.row, { gap: 10 }]}>
        <MaterialIcons
          name="battery-charging-full"
          size={20}
          color={color.primaryColor}
        />
        <Text style={{ fontWeight: "500", color: color.primaryColor }}>
          Device Health
        </Text>
      </View>
      <View style={{ gap: 4, marginTop: 4 }}>
        <View style={[flex.row, { justifyContent: "space-between" }]}>
          <Text>Battery Percentage</Text>
          <Text
            style={{
              color:
                percentage && percentage < 15 && !charging
                  ? "red"
                  : charging && on
                  ? "green"
                  : percentage && percentage < 20
                  ? "orange"
                  : "",
            }}
          >
            {percentage ? percentage.toFixed(0) : "---"}%
          </Text>
        </View>
        <View style={[flex.row, { justifyContent: "space-between" }]}>
          <Text>Charging</Text>
          <Text>{on ? (charging ? "Yes" : "No") : "No"}</Text>
        </View>
      </View>
    </View>
  );
}
