import {
    View,
    Text,
    Touchable,
    TouchableNativeFeedback,
    StyleSheet,
} from "react-native";
import React from "react";
import { X } from "../../types";
import Status from "../status/Status";
import { flex, fontSize } from "../../theme/theme";

export default function MeterCard({ meter }: { meter: X }) {
    return (
        <TouchableNativeFeedback>
            <View style={[flex.col, styles.cardStyle, { gap: 5 }]}>
                <View style={[flex.row, { justifyContent: "space-between" }]}>
                    <Text
                        style={{ fontWeight: "500", fontSize: fontSize.xlarge }}
                    >
                        {meter.name}
                    </Text>
                    <Status status />
                </View>
                <View style={[flex.col]}>
                    <Text>Current Reading: 2394 L/Min</Text>
                    <Text>Last 2 Days: 12L </Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
}

const styles = StyleSheet.create({
    cardStyle: {
        padding: 8,
        overflow: "hidden",
        borderRadius: 5,
        marginBottom: 10,
        borderColor: "#f2f2f2",
        borderStyle: "solid",
        borderWidth: 1.5,
    },
});
