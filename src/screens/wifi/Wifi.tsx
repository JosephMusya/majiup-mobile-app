import { View, Text, ScrollView, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import WifiManager from "react-native-wifi-reborn";
import { WiFi } from "../../types";
import { StyleSheet } from "react-native";
import WifiCard from "../../components/wifi-card/WifiCard";
import { useDeviceContext } from "../../providers/devices/DeviceProvider";
import { Ionicons } from "@expo/vector-icons";
import { color, flex, fontSize } from "../../theme/theme";
import EmptyBox from "../../components/containers/EmptyBox";
import { WifiEntry } from "react-native-wifi-reborn";
import LoadingBox from "../../components/loading/LoadingBox";
export default function Wifi() {
  const [wifiList, setWifiList] = useState<WifiEntry[]>([]);
  const { connectedWifi, timeoutErr } = useDeviceContext();
  const [refreshing, setRefreshing] = useState<boolean>(true);

  const getWifiList = async () => {
    setRefreshing(true);

    try {
      WifiManager.loadWifiList().then((wifiList) => {
        setWifiList(wifiList);
      });
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    getWifiList();
  }, []);
  return (
    <ScrollView
      style={[style.container]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={getWifiList} />
      }
    >
      {refreshing ? (
        <LoadingBox />
      ) : (
        <>
          <View style={{ padding: 8 }}>
            {timeoutErr && (
              <View style={[flex.row]}>
                <View>
                  <Ionicons
                    name="warning-outline"
                    size={18}
                    color={color.secondaryColor}
                  />
                </View>
                <Text style={{ fontSize: fontSize.medium, padding: 8 }}>
                  Ensure you are connected to{" "}
                  <Text style={{ fontWeight: "500" }}>WAZIGATE</Text> or your
                  gateway is connected to{" "}
                  <Text style={{ fontWeight: "500" }}>
                    {connectedWifi?.SSID}
                  </Text>
                </Text>
              </View>
            )}
          </View>
          <FlatList
            data={wifiList}
            renderItem={({ item }) => {
              return (
                <WifiCard SSID={item.SSID} capabilities={item.capabilities} />
              );
            }}
            ListEmptyComponent={<EmptyBox text="No WiFi Networks discovered" />}
            scrollEnabled={false}
          />
        </>
      )}
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    padding: 8,
  },
});
