import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { WiFi } from "../../types";
import { color, flex } from "../../theme/theme";
import { useDeviceContext } from "../../providers/devices/DeviceProvider";
import WifiModal, { Credentials } from "./WifiModal";
import { Entypo } from "@expo/vector-icons";
import { WifiEntry } from "react-native-wifi-reborn";
import WifiManager from "react-native-wifi-reborn";
import * as SecureStore from "expo-secure-store";

export default function WifiCard({ SSID, capabilities }: Partial<WifiEntry>) {
  const { connectedWifi, setWifi, fetchData } = useDeviceContext();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const wpa: boolean = capabilities ? capabilities?.includes("WPA") : true;
  let ssid: string = SSID ? SSID : "";
  let password: string = "";
  return (
    <View style={[flex.row, { justifyContent: "space-between", padding: 8 }]}>
      <View style={[flex.row, { gap: 10 }]}>
        {wpa ? (
          <Entypo name="lock" size={18} color={color.primaryColor} />
        ) : (
          <Entypo name="lock-open" size={18} color={color.primaryColor} />
        )}
        <Text>{SSID}</Text>
      </View>
      {connectedWifi?.SSID === SSID ? (
        <Text style={{ color: "green" }}>Connected</Text>
      ) : (
        <>
          <TouchableOpacity
            onPress={() =>
              wpa
                ? SecureStore.getItemAsync(ssid).then((details) => {
                    if (details) {
                      const credentials = JSON.parse(details) as Credentials;

                      ssid = credentials.ssid;
                      password = credentials.password;

                      WifiManager.connectToProtectedWifiSSID({
                        ssid,
                        password,
                      }).then(() => {
                        const wifi: WiFi = { SSID: SSID as string };
                        setWifi && setWifi(wifi);
                        fetchData({});
                      });
                    } else {
                      setIsVisible(true);
                    }
                  })
                : WifiManager.connectToProtectedWifiSSID({
                    ssid,
                    password,
                  }).then(() => {
                    fetchData({});
                    const wifi: WiFi = { SSID: SSID as string };
                    setWifi && setWifi(wifi);
                  })
            }
          >
            <Text>Connect</Text>
          </TouchableOpacity>
          <WifiModal
            ssid={SSID ? SSID : ""}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
            wpa={capabilities?.includes("WPA")}
            setWifi={() => setWifi}
          />
        </>
      )}
    </View>
  );
}
