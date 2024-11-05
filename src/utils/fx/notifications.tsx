import * as Notifications from "expo-notifications";
import { MetaInformation, Notification, Sensor, Tank, X } from "../../types";
// import * as Permissions from "expo-permissions";
import { backendUrl } from "../../private/env";
import axios from "axios";
import { useDeviceContext } from "../../providers/devices/DeviceProvider";
import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";

export const setNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

function handleRegistrationError(errorMessage: string) {
  throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#ff231f7c",
      sound: "alarm.wav",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log("ALLOWED...");
    }
    if (finalStatus !== "granted") {
      console.log("PERMS DISALLOWED");
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    // console.log("ID:  ");
    // const projectId =
    //   Constants?.expoConfig?.extra?.eas?.projectId ??
    //   Constants?.easConfig?.projectId;

    const projectId: string = "c884bf91-f101-404b-b209-5eef60f91d52";

    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e: unknown) {
      console.log(e);
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

export const showNotification = ({ title, body }: Notification) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      autoDismiss: false,
      sticky: false,
      interruptionLevel: "critical",
      sound: "alarm.wav",
    },
    trigger: null,
  });
};

let lastExecutionTime = 0;

let timer: any;

let receive = true;

export const generateNotifications = ({
  sensor,
  liters,
  device,
}: {
  sensor: Sensor | undefined;
  liters: number;
  device: X;
}) => {
  const maxSensor = sensor?.meta.critical_max;
  const minSensor = sensor?.meta.critical_min;
  const deviceId = device.id;
  const percentage = (liters / device.capacity) * 100;

  const resetNotif = (status: boolean) => {
    timer = setTimeout(() => {
      axios.post(
        `${backendUrl}/tanks/${deviceId}/profile`,
        {
          ...device.meta,
          receivenotifications: status,
        },
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
    }, 10 * 60 * 1000);
  };

  if (percentage) {
    if (device.meta.receivenotifications) {
      if (maxSensor && minSensor) {
        const notification: Notification = { title: "", body: "" };
        if (percentage >= maxSensor) {
          axios.post(
            `${backendUrl}/tanks/${deviceId}/profile`,
            {
              ...device.meta,
              receivenotifications: false,
            },
            {
              headers: {
                "Content-Type": "text/plain",
              },
            }
          );
          resetNotif(true);

          notification.title = `${device.name} almost full`;
          notification.body = `Water level for ${
            device.name
          } is at ${percentage.toFixed(0)}%`;
          const message: string = notification.body;
          // showNotification(notification);
          // postNewNotificationMessage(deviceId, device, message);
        } else if (percentage <= minSensor) {
          axios.post(
            `${backendUrl}/tanks/${deviceId}/profile`,
            {
              ...device.meta,
              receivenotifications: false,
            },
            {
              headers: {
                "Content-Type": "text/plain",
              },
            }
          );
          resetNotif(true);

          notification.title = `${device.name} almost empty`;
          notification.body = `Water level for ${
            device.name
          } at ${percentage.toFixed(0)}%`;
          const message: string = notification.body;
          // showNotification(notification);
          // postNewNotificationMessage(deviceId, device, message);
        }
      }
    } else {
    }
  }
};

export const postNewNotificationMessage = async (
  deviceId: string,
  tank: X,
  message: string
) => {
  if (tank) {
    // Initialize messages as an empty array if it's null
    const prevMessages = tank.meta.notifications.messages || [];
    const response = await axios.post(
      `${backendUrl}/tanks/${deviceId}/profile`,
      {
        ...tank.meta,
        notifications: {
          ...tank.meta.notifications,
          messages: [
            ...prevMessages, // Use the initialized messages array
            {
              id: prevMessages.length + 1,
              message,
              tank_name: tank.name,
              time: new Date(),
              read_status: false,
            },
          ],
        },
      }
    );
    return response;
  }
};

export const markMessageAsRead = async (
  deviceId: string,
  devices: X[],
  messageId: string,
  navigation: any
) => {
  const tank = devices.find((device: X) => device.id === deviceId);
  if (tank) {
    try {
      await axios.post(`${backendUrl}/tanks/${deviceId}/profile`, {
        ...tank.meta,
        notifications: {
          ...tank.meta.notifications,
          messages: tank.meta.notifications.messages.map((message) => {
            if (message.id === messageId) {
              return {
                ...message,
                read_status: true,
              };
            }
            return message;
          }),
        },
      });
    } catch (error) {
      console.log(error);
    }

    navigation.navigate("TankView", {
      id: tank.id,
      name: tank.name,
    });
    // const refetch = true;

    // return response;
  }
};
