import { View, Text, TextInput, KeyboardTypeOptions } from "react-native";
import React, { useState } from "react";
import { color, fontSize } from "../../theme/theme";

export default function CustomTextInput({
  value,
  textColor = color.textColor,
  keyboard = "default",
  placeholder,
  label = "Label",
  required = false,
  onChange,
  onChangeText,
  disabled,
  defaultValue,
}: {
  value?: string | number | undefined;
  textColor?: string;
  keyboard?: KeyboardTypeOptions | undefined;
  placeholder?: string;
  label: string;
  required?: boolean;
  onChange?: (e: any) => void;
  onChangeText?: (e: any) => void;
  disabled?: boolean;
  defaultValue?: any;
}) {
  const [focus, setFocus] = useState<boolean>(false);
  return (
    <View>
      <Text style={{ padding: 4 }}>
        {label}
        {!value && required && <Text style={{ color: "red" }}>*</Text>}
      </Text>
      <TextInput
        keyboardType={keyboard}
        cursorColor={color.primaryColor}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          fontSize: fontSize.large,
          fontWeight: focus ? "500" : "400",
          height: 40,
          // borderBottomColor: color.primaryColor,
          // borderBottomWidth: focus ? 2 : 1.5,
          backgroundColor: focus ? "#c1c1c1" : color.complementaryColor,
          paddingStart: 15,
          paddingEnd: 15,
          color: textColor,
          borderRadius: 10,
        }}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e)}
        // value={String(value)}
        readOnly={disabled}
        defaultValue={value ? String(value) : ""}
        onChangeText={(text) => onChangeText && onChangeText(text)}
      />
    </View>
  );
}
