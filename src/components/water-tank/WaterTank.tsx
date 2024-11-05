import { View, Text } from "react-native";
import React, { useEffect, useRef } from "react";
import { color, flex } from "../../theme/theme";
import { Svg, Path } from "react-native-svg";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const AnimatedWave = ({ height, width, percentage, color }: any) => {
  const waveHeight = height * (percentage / 100);
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(500, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, [translateX, width * 2]);

  const animatedStyle1 = useAnimatedStyle(() => {
    return {
      zIndex: 2,
      transform: [{ translateX: translateX.value * 0.2 }],
    };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      zIndex: 1,
      transform: [{ translateX: -translateX.value * 0.2 }],
    };
  });

  const wavePath = `
    M 0 ${waveHeight / 80}
    Q ${width / 4} 0 ${width / 2} ${waveHeight / 20}
    T ${width} ${waveHeight / 20}
    T ${width * 1.5} ${waveHeight / 80}
    T ${width * 2} ${waveHeight / 20}
    T ${width * 2.5} ${waveHeight / 80}
    V ${waveHeight}
    H 0
    Z
  `;

  return (
    <>
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            backgroundColor: "transparent",
            width: width * 2,
          },
          animatedStyle1,
        ]}
      >
        <Svg
          height={waveHeight}
          width={width * 2}
          viewBox={`0 0 ${width * 2} ${waveHeight}`}
        >
          <Path d={wavePath} fill="#4E97F5" />
        </Svg>
      </Animated.View>
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            width: width * 2,
          },
          animatedStyle2,
        ]}
      >
        <Svg
          height={waveHeight}
          width={width * 2}
          viewBox={`0 0 ${width * 2} ${waveHeight}`}
        >
          <Path d={wavePath} fill={"#A1C1EA"} />
        </Svg>
      </Animated.View>
    </>
  );
};

export default function WaterTank({
  percentage = 0,
}: {
  percentage: number | undefined;
}) {
  return (
    <View
      style={[
        flex.row,
        {
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: 200,
          aspectRatio: 1,
          backgroundColor: "#d5d5d5",
          borderRadius: 100,
          overflow: "hidden",
          borderWidth: 2.5,
          borderColor: color.complementaryColor,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 55,
            fontWeight: "bold",
            zIndex: 3,
            opacity: 0.5,
          }}
        >
          {percentage.toFixed(0)}%
        </Text>
        <AnimatedWave
          height={200}
          width={200}
          percentage={percentage}
          color={color.primaryColor}
        />
      </View>
    </View>
  );
}
