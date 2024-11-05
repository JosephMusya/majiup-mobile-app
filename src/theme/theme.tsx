import { StyleSheet } from "react-native";

export type ColorTheme = {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  shadowColor: string;
  complementaryColor: string;
};
export const color: ColorTheme = {
  primaryColor: "#1565C0",
  secondaryColor: "#E46B26",
  textColor: "#707070",
  shadowColor: "#F6F6F6",
  complementaryColor: "#d6d6d6",
};

export const fontSize = {
  XXlarge: 32,
  xxlarge: 26,
  xlarge: 18,
  large: 16,
  medium: 12,
  small: 10,
};

export const flex = StyleSheet.create({
  row: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  col: {
    display: "flex",
    // alignItems: "center",
    flexDirection: "column",
  },
});
