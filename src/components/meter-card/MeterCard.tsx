import { View, Text } from "react-native";
import React from "react";
import { X } from "../../types";

export default function MeterCard({ meter }: { meter: X }) {
    return (
        <View>
            <Text>{meter.name}</Text>
        </View>
    );
}
