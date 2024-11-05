import { View, Text } from "react-native";
import React from "react";
import CustomButton from "../button/Button";
import { styles } from "react-native-gifted-charts/src/LineChart/styles";
import { flex } from "../../theme/theme";

export default function ActionsCard() {
  return (
    <View>
      {/* <Text>ActionsCard</Text> */}
      <View style={[flex.row, { justifyContent: "space-around" }]}>
        <CustomButton
          title="Order Water Refill"
          width={150}
          onPress={() => {}}
        />
        <Text>Refill tank in {2} days</Text>
      </View>
    </View>
  );
}
