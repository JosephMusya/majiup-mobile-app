import {
    View,
    Text,
    ColorValue,
    StyleProp,
    DimensionValue,
    TouchableOpacity,
} from "react-native";
import React from "react";
import { Button } from "react-native";
import { ColorTheme, fontSize } from "../../theme/theme";
import * as Color from "../../theme/theme";
export default function CustomButton({
    onPress,
    color,
    width = 200,
    title = "Button",
    children,
    textColor,
    padding,
    fontSize,
}: {
    onPress: () => void;
    color?: string;
    width?: DimensionValue;
    title: string;
    children?: any;
    textColor?: string;
    padding?: number;
    fontSize?: number;
}) {
    return (
        <TouchableOpacity
            style={{
                maxWidth: width,
                borderRadius: 0,
                width: width,
                backgroundColor: color ? color : Color.color.primaryColor,
                padding: padding ?? 8,
                alignItems: "center",
                borderTopRightRadius: 5,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
            }}
            onPress={() => onPress()}
        >
            <Text
                style={{
                    color: textColor ? textColor : "#fff",
                    fontSize: fontSize,
                }}
            >
                {title}
            </Text>
            {children}
        </TouchableOpacity>
    );
}
