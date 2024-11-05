import { View, Text, Modal } from "react-native";
import React, { useState } from "react";
import { color, flex } from "../../theme/theme";
import CustomButton from "../button/Button";
import CustomTextInput from "../text-input/CustomTextInput";
import WifiManager from "react-native-wifi-reborn";
import * as SecureStore from "expo-secure-store";
import { WiFi } from "../../types";
import { useDeviceContext } from "../../providers/devices/DeviceProvider";

export interface Credentials {
  ssid: string;
  password: string;
}

export default function WifiModal({
  isVisible,
  wpa,
  onClose,
  ssid,
  isWep,
  setWifi,
}: {
  isVisible: boolean;
  onClose: () => void;
  setWifi?: () => void;
  ssid: string;
  isWep?: any;
  wpa?: boolean;
}) {
  const [connecting, setConnecting] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const { fetchData } = useDeviceContext();

  const storeCredentials = async ({ ssid, password }: Credentials) => {
    const credentials: Credentials = { ssid, password };
    try {
      await SecureStore.setItemAsync(ssid, JSON.stringify(credentials));
    } catch (err) {
      console.log(err);
    }
  };

  const connectToWiFI = ({
    ssid,
    password,
  }: {
    ssid: string;
    password: string;
  }) => {
    setConnecting(true);
    WifiManager.connectToProtectedWifiSSID({ ssid, password })
      .then(
        () => {
          // console.log("Connected successfully!");
          storeCredentials({ ssid, password });
          const wifi: WiFi = { SSID: ssid };
          setWifi && setWifi(wifi);
          fetchData({});
        },
        () => {
          // console.log("Connection failed!");
        }
      )
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setConnecting(false);
      });
  };
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: `rgba(0,0,0,0.5)`,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={[
            flex.col,
            {
              backgroundColor: "#fff",
              width: "85%",
              borderRadius: 10,
              padding: 10,
              paddingTop: 20,
              paddingBottom: 20,
              // height: "30%",
              gap: 20,
            },
          ]}
        >
          <Text style={{ textAlign: "center" }}>
            Connect to <Text style={{ fontWeight: "bold" }}> {ssid}</Text>{" "}
          </Text>
          <CustomTextInput
            value={password}
            defaultValue=""
            label="Password"
            placeholder="Enter WiFi Password"
            onChangeText={(val) => setPassword(val)}
          />
          <View style={[flex.row, { justifyContent: "space-around" }]}>
            <CustomButton
              color={password ? color.primaryColor : "gray"}
              title={connecting ? "Connecting" : "Connect"}
              width={100}
              onPress={() => {
                connectToWiFI({ ssid, password });
              }}
            />
            <CustomButton
              title="Cancel"
              width={100}
              color="gray"
              onPress={() => {
                onClose();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
