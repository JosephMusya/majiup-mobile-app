import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  FlatList,
  Dimensions,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import NotificationCard from "../../components/notification-card/NotificationCard";
import { useDeviceContext } from "../../providers/devices/DeviceProvider";
import { Notification, X } from "../../types";
import Separator from "../../components/separator/Separator";
import { markMessageAsRead } from "../../utils/fx/notifications";
import EmptyBox from "../../components/containers/EmptyBox";
import CustomButton from "../../components/button/Button";
import { color } from "../../theme/theme";
import axios from "axios";
import { backendUrl, getBackendUrl } from "../../private/env";
import { MaterialIcons } from "@expo/vector-icons";
export default function Notifications({ navigation }: any) {
  const { ipAddress, devices, unread, notifications, getNotifications } =
    useDeviceContext();

  const backendUrl = getBackendUrl(ipAddress);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const clearAllNotif = async (tanks: X[]) => {
    tanks.map((tank: X) => {
      if (tank.meta.notifications.messages) {
        try {
          axios
            .post(`${backendUrl}/tanks/${tank.id}/profile`, {
              ...tank.meta,
              notifications: {
                ...tank.meta.notifications,
                messages: [],
              },
            })
            .then((status) => {
              getNotifications();

              if (status.data === 200) {
                ToastAndroid.show("Notifications cleared", 2000);
              }
            });
        } catch (error) {
          ToastAndroid.show("Failed to clear notifications", 2000);
        }
      }
    });
  };

  // useEffect(() => {
  //   navigation.setParams({ unread: unread });
  // }, [devices]);
  return (
    <ScrollView
      style={style.container}
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            setRefreshing(true);
            getNotifications();
            setRefreshing(false);
          }}
          refreshing={refreshing}
        />
      }
    >
      {unread ? (
        <View>
          <Text style={{ marginBottom: 8 }}>
            You have {unread} unread notifications tap to mark as read
          </Text>
          <View
            style={{
              paddingBottom: 10,
            }}
          >
            <CustomButton
              title="Clear All"
              width={100}
              onPress={() => {
                clearAllNotif(devices);
              }}
              color={color.primaryColor}
            />
          </View>
        </View>
      ) : null}

      {!notifications?.every((notif) => {
        return notif === undefined;
      }) ? (
        <View
          style={{
            gap: 5,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FlatList
            data={notifications}
            scrollEnabled={false}
            renderItem={({ item }: { item: Notification }) => {
              return (
                item && (
                  <NotificationCard
                    notification={item}
                    onPress={() =>
                      item &&
                      markMessageAsRead(
                        item.deviceId as string,
                        devices,
                        item?.id as string,
                        navigation
                      )
                    }
                  />
                )
              );
            }}
            ItemSeparatorComponent={({}) => Separator({ height: 10 })}
          />
        </View>
      ) : (
        <View
          style={{
            // flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: Dimensions.get("window").height * 0.85,
          }}
        >
          <EmptyBox
            text="You have no pending notifications"
            children={
              <MaterialIcons
                name="notifications-none"
                size={38}
                color={color.primaryColor}
              />
            }
          />
        </View>
      )}
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    padding: 8,
  },
});
