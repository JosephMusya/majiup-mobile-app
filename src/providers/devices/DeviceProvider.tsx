import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    Analytics,
    // Consumption,
    Tank,
    Notification,
    Profile,
    Sensor,
    Time,
    // UserProfile,
    WiFi,
    X,
    UserProfile,
    // MetaInformation,
} from "../../types";
import mqtt from "precompiled-mqtt";
import { backendUrl, brokerUrl, getBackendUrl } from "../../private/env";
import axios, { AxiosResponse } from "axios";
import { formatDateToISO, formatTime } from "../../utils/fx/timeFormatter";
import React from "react";
import { PermissionsAndroid, ToastAndroid } from "react-native";
import WifiManager from "react-native-wifi-reborn";
import { lineDataItem } from "react-native-gifted-charts";
import * as SecureStore from "expo-secure-store";

// import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {
    generateNotifications,
    postNewNotificationMessage,
    registerForPushNotificationsAsync,
    // registerForPushNotifications,
    setNotifications,
    showNotification,
} from "../../utils/fx/notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// import labeller from "../../components/containers/labeller";
// import * as Devices from "expo-device";
// import * as Notifications from "expo-notifications";
// import notifee from "@notifee/react-native";

type DeviceContextValues = {
    devices: X[];
    user: { token: string; name: string };
    setUser: (user: string, token: string) => void;
    // toggleModal: () => void;
    isOpenNav?: boolean;
    setTanks: (devices: X[]) => void;
    // selectedDevice: X | undefined;
    // setSelectedDevice: (device: X) => void;
    reportRef: HTMLDivElement | null;
    setReportRef: (ref: HTMLDivElement) => void;
    loading: boolean;
    setLoadingFunc: (loading: boolean) => void;
    // fetchinHours: ()=>void,
    // searchDevices: (name: string) => void;
    fetchData: ({}) => void;
    userProfile?: UserProfile;
    loadingProfile?: boolean;
    connected?: boolean;
    updateProfile: (profileDetails: Profile) => void;
    refreshing: boolean;
    timeoutErr?: boolean;
    connectedWifi?: WiFi;
    setWifi: (wifi: WiFi) => void;
    showNotification: (notification: Notification) => void;
    unread: number | undefined;
    notifications: Notification[] | undefined;
    getNotifications: () => void;
    ipAddress: string | null;
    storeIpAddress?: (ip: string | null | undefined) => void;
    tanks: X[];
    pumps: X[];
    meters: X[];
};

type Props = {
    children: ReactNode;
};

//return an array of device data including level, temperature, quality, etc.
//extract the first row and add it as current waterTemp, waterQuality, liters, etc.
//add the rest of the rows as consumption data
function isActiveDevice(modifiedTime: any): boolean {
    const now = new Date();
    const modified = new Date(modifiedTime);
    const diff = now.getTime() - modified.getTime();
    const diffInMinutes = Math.floor(diff / 1000 / 60);
    const active = diffInMinutes < 10;

    return active;
}

function subscriberFn(client: mqtt.MqttClient, topic: string) {
    client.subscribe(topic, (err) => {
        if (err) {
            // toast.error("Failed to connect!");
            console.log(err);
        }
    });
}

const getIpAddress = (): string | null => {
    const ipAdderess = SecureStore.getItem("ip-address");
    return ipAdderess;
};

export const getExpoToken = (): string | null => {
    const expoToken = SecureStore.getItem("expo-token");
    return expoToken;
};

export const removeExpoToken = () => {
    SecureStore.deleteItemAsync("expo-token");
};

const storeExpoToken = async (expoToken: string) => {
    SecureStore.setItemAsync("expo-token", expoToken);
};

// const timeoutDuration = 0.15 * 60 * 1000; //ms
const timeoutDuration = 0.15 * 60 * 1000000000; //ms

export const client: mqtt.MqttClient = mqtt.connect("mqtt://api.waziup.io:443");

export const DeviceContext = createContext<DeviceContextValues>({
    devices: [],
    user: { token: "", name: "" },
    setUser: () => {},
    // toggleModal: () => {},
    isOpenNav: false,
    setTanks: () => {},
    // selectedDevice: undefined,
    // setSelectedDevice() {},
    reportRef: null,
    setReportRef: () => {},
    loading: true,
    setLoadingFunc: () => {},
    fetchData: ({}: Time) => {},
    // searchDevices: () => {},
    userProfile: {} as UserProfile,
    loadingProfile: true,
    connected: false,
    updateProfile: () => {},
    refreshing: false,
    timeoutErr: false,
    connectedWifi: {} as WiFi,
    setWifi: ({}) => {},
    showNotification: () => {},
    unread: 0,
    notifications: [] as Notification[],
    getNotifications: () => {},
    ipAddress: getIpAddress(),
    tanks: [],
    pumps: [],
    meters: [],
});

export const DeviceProvider = ({ children }: Props) => {
    axios.defaults.timeout = 7000; // Set out to 30 seconds
    const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
    const [notifications, setNotififications] = useState<Notification[]>();
    const [devices, setDevices] = useState<X[]>([]);
    const [userProfile, setProfile] = useState<UserProfile>();
    const [filteredDevices, setFilteredDevices] = useState<X[]>(devices);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(true);
    const [mqttActive, setMqttActive] = useState<boolean>(false);
    // const [selectedTank, setSelectedTank] = useState<X>();
    const [connected, setConnected] = useState<boolean>();
    const [user, setLoggedUser] = useState<{ name: string; token: string }>({
        name: "",
        token: "",
    });
    // const [isOpenNav, setIsOpenNav] = useState<boolean>(false);
    // const toggleModal = () => setIsOpenNav(!isOpenNav);
    const [reportRef, setReportRefFunch] = useState<HTMLDivElement | null>(
        null
    );
    const [connectedWifi, setConnectedWifi] = useState<WiFi>();
    const [unread, setUnread] = useState<number>();

    const [ipAddress, setIpAddress] = useState<string | null>(getIpAddress());

    const [notification, setNotification] = useState<
        Notifications.Notification | undefined
    >(undefined);

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    const [tanks, setWaterTanks] = useState<X[]>(
        devices.filter((device) => {
            return device.sensors?.some(
                (sensor) => sensor.meta.kind === "WaterLevel"
            );
        })
    );

    const [pumps, setPumps] = useState<X[]>(
        devices.filter((device) => {
            return device.actuators?.some(
                (actuator) => actuator.meta.kind === "Motor"
            );
        })
    );

    const [meters, setMeters] = useState<X[]>(
        devices.filter((device) => {
            return device.sensors?.some(
                (sensor) => sensor.meta.kind === "WaterMeter"
            );
        })
    );

    const backendUrl = getBackendUrl(ipAddress);

    const updateProfile = (profileDetails: Profile) => {
        setProfile((prev) => {
            return {
                ...prev,
                profile: profileDetails,
            };
        });
        // setProfile({
        //   ...userProfile,
        //   profile: profileDetails
        // });
    };

    const setReportRef = (ref: HTMLDivElement) => {
        if (ref !== null) {
            setReportRefFunch(ref);
        }
    };
    const setLoadingFunc = (loading: boolean) => {
        if (loading) {
        }
        // setLoading(!loading);
    };

    const setTanks = (devices: X[]) => setDevices(devices);

    const [timeoutErr, setTimeoutErr] = useState<boolean>(false);

    const getUserProfile = async () => {
        try {
            const requestProfile: AxiosResponse = await axios.get(
                `${backendUrl}/gateway-profile`,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );
            if (requestProfile.status === 200) {
                const userProfile: UserProfile = await requestProfile.data;
                setProfile(userProfile);
                return userProfile;
            } else {
                throw new Error("Failed to fetch user profile");
            }
        } finally {
            setLoadingProfile(false);
        }
    };

    const getNotifications = () => {
        const messages = devices.map((device) => {
            return device.meta?.notifications?.messages?.map((message) => ({
                ...message,
                deviceId: device.id,
            }));
        });

        let mergedSms: Notification[] = messages.reduce(
            (acc, val) => acc.concat(val),
            []
        );

        setNotififications(mergedSms);

        const unreadCount = mergedSms?.filter((notification: Notification) => {
            return notification?.read_status === false;
        }).length;

        setUnread(unreadCount);
    };

    type AnalyticsParams = {
        tankID: string;
        from: string;
        to: string;
    };

    const getAnalytics = async ({
        tankID,
        from,
        to,
    }: AnalyticsParams): Promise<Analytics | undefined> => {
        try {
            const req: AxiosResponse = await axios.get(
                `${backendUrl}/tanks/${tankID}/analytics?from=${from}&to=${to}`,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (req.status === 200) {
                const analytics: Analytics = req.data;
                return analytics;
            }
        } catch (err) {
            console.error(err);
        }
    };

    const setMajiupDevices = async () => {
        setWaterTanks(
            devices.filter((device) => {
                return device.sensors?.some(
                    (sensor) => sensor.meta.kind === "WaterLevel"
                );
            })
        );

        setPumps(
            devices.filter((device) => {
                return device.actuators?.some(
                    (actuator) => actuator.meta.kind === "Motor"
                );
            })
        );

        setMeters(
            devices.filter((device) => {
                return device.sensors?.some(
                    (sensor) => sensor.meta.kind === "WaterMeter"
                );
            })
        );
    };

    useEffect(() => {
        devices && setMajiupDevices();
    }, [devices]);

    async function fetchData({ from, to, refetch }: Time): Promise<X[]> {
        const durationMins: number = 10;
        // const durationMins: number = 2880;
        // const durationMins: number = 79;
        !refetch && setLoading(true);
        setTimeoutErr(false);
        const time: Time = {};
        // const timeAnalytics: Time = {};

        const toTime = new Date();
        const fromTime = new Date(toTime);
        fromTime.setMinutes(fromTime.getMinutes() - durationMins);

        time.from = fromTime;
        time.to = toTime;

        axios
            .get(`${backendUrl}/tanks`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
            .then(async (response) => {
                const tankValues: any = response.data.map(
                    async (device: Tank) => {
                        if (device.sensors) {
                            const sensorResponse = await axios.get(
                                `${backendUrl}/tanks/${
                                    device.id
                                }/tank-sensors/waterlevel/values?from=${formatDateToISO(
                                    time?.from as Date
                                )}&to=${formatDateToISO(time?.to as Date)}`,
                                {
                                    headers: {
                                        Accept: "application/json",
                                    },
                                }
                            );

                            const plotVals: lineDataItem =
                                sensorResponse.data?.waterLevels?.map(
                                    (val: {
                                        timestamp: string;
                                        liters: number;
                                    }) => {
                                        const date: string = formatTime(
                                            new Date(val.timestamp)
                                        );
                                        return {
                                            value: Number(
                                                val.liters.toFixed(0)
                                            ),
                                            label: date,
                                            // dataPointLabelComponent: () =>
                                            //   labeller({
                                            //     liters: Number(val.liters.toFixed(0)),
                                            //     date: date,
                                            //   }),
                                        };
                                    }
                                );

                            const to = new Date();
                            const from = new Date(to);

                            from.setHours(from.getHours() - 24);

                            const analytics: Analytics | undefined =
                                await getAnalytics({
                                    tankID: device.id,
                                    from: formatDateToISO(from),
                                    to: formatDateToISO(to),
                                });

                            return { plotVals, analytics };
                        }
                    }
                );

                const tankData = await Promise.all(tankValues);

                return {
                    tankData: tankData,
                    res: response.data,
                };
            })
            .then(({ res, tankData }) => {
                setDevices(
                    res.map(function (device: X, index: number) {
                        // subscriberFn(client, `devices/${device.id}/meta/#`);
                        subscriberFn(client, `devices/${device.id}/sensors/#`);
                        // subscriberFn(client, `devices/${device.id}/actuators/#`);
                        if (!refetch) {
                            device.meta.receivenotifications = true;
                        }

                        const sensor = device.sensors?.find(
                            (sensor: Sensor) => {
                                return sensor.meta.kind
                                    .toLowerCase()
                                    .includes("waterlevel");
                            }
                        );

                        const modified = sensor?.time;

                        return {
                            ...device,

                            capacity: device.meta?.settings.capacity,

                            height: Math.round(device.meta?.settings.height),
                            offset: device.meta?.settings.offset,
                            consumption: tankData[index]?.plotVals,
                            liters: device.sensors?.find((sensor: Sensor) =>
                                sensor.meta.kind
                                    .toLowerCase()
                                    .includes("waterlevel")
                            )?.value,
                            tds: device.sensors?.find((sensor: Sensor) =>
                                sensor.meta.kind
                                    .toLowerCase()
                                    .includes("waterpollutantsensor")
                            )?.value,
                            temp: device.sensors?.find((sensor: Sensor) =>
                                sensor.meta.kind
                                    .toLowerCase()
                                    .includes("waterthermometer")
                            )?.value,
                            isSelect: false,
                            on: isActiveDevice(modified),
                            notifications: device.meta?.notifications.messages,
                            analytics: tankData[index]?.analytics,
                        };
                    })
                );
                setLoading(false);
                setRefreshing(false);
            })
            .catch((err) => {
                console.log("Error: ", err);
                if (err.code === "ERR_NETWORK") {
                    setTimeoutErr(true);
                } else {
                    console.log(err.code);
                }
                setLoading(false);
                setRefreshing(false);
                throw new Error(err);
            });

        axios
            .get(`${backendUrl}/pumps`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
            .then(() => {
                // console.log("PUMPS: ", data);
            });

        return devices;
    }

    const setWifi = (wifi: WiFi) => {
        setConnectedWifi(wifi);
    };

    const grantPerms = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location permission is required for WiFi connections",
                message:
                    "This app needs location permission as this is required  " +
                    "to scan for wifi networks.",
                buttonNegative: "DENY",
                buttonPositive: "ALLOW",
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            const wifi: WiFi = { SSID: "" };

            WifiManager.getCurrentWifiSSID()
                .then((ssid) => {
                    wifi.SSID = ssid;
                })
                .finally(() => {
                    setConnectedWifi(wifi);
                });
        } else {
            console.log("Disallowed");
            // Permission denied
        }
    };

    client.on("connect", () => {
        console.log("MQTT Connected");
        // setMqttActive(true);
        // toast.success("Connected!");
    });

    client.on("error", () => {
        // toast.error("Disconnected!");
    });

    client.on("disconnect", () => {
        client.reconnect();
        setMqttActive(false);
        // toast.error("Disconnected!");
    });

    client.on("error", () => {
        console.log("MQTT Error");
    });

    client.on("offline", () => {
        console.log("MQTT Offline");
        console.log("MQTT Reconnecting ...");
        client.reconnect();
    });

    useEffect(() => {
        devices &&
            devices.map((device: X) => {
                const sensor = device?.sensors?.find((sensor: Sensor) => {
                    return (sensor.meta.kind as string) === "WaterLevel";
                });

                const liters = device.liters;

                liters && generateNotifications({ sensor, device, liters });
            });
    }, [devices]);

    client.on("message", (topic, message) => {
        let timer: any;

        setMqttActive(true);
        const topicArr = topic.split("/");
        if (topicArr.includes("sensors") && devices.length > 0) {
            // const arr = topic.split('/');
            const val: any = JSON.parse(message.toString());
            const device: X | undefined = devices.find(
                (device: Tank) => device.id === topicArr[1]
            );
            if (device) {
                clearTimeout(timer);

                timer = setTimeout(() => {
                    setMqttActive(false);
                }, timeoutDuration);

                const sensor = device.sensors.find(
                    (sensor: Sensor) => sensor.id === topicArr[3]
                );
                if (
                    sensor &&
                    sensor.meta.kind
                        .toLowerCase()
                        .includes("WaterLevel".toLowerCase())
                ) {
                    const tankHeight = device.meta.settings.height;
                    const tankCapacity = device.meta.settings.capacity;

                    const liters = Math.round(
                        ((tankHeight - (val - device.meta.settings.offset)) /
                            tankHeight) *
                            tankCapacity
                    );

                    generateNotifications({ sensor, device, liters });

                    // device.meta.receivenotifications = false;

                    device.liters = liters;
                    device.on = true;
                    const date = formatTime(new Date());

                    device.consumption.push({
                        label: date,
                        value: liters,
                    });

                    setTanks([...devices]);

                    // generateNotification({max:,min, percentage})
                } else {
                    device.on = true;
                    return;
                }
                return;
            }
        } else if (topic.toLowerCase().includes("meta")) {
            const device = devices.find(
                (device: Tank) => device.id === topic.split("/")[1]
            );
            if (device) {
                const metaField = {
                    ...device.meta,
                    ...JSON.parse(message.toString()),
                };
                device.meta = metaField;
                setTanks([...devices]);
            }
            // navigate('/dashboard');
        } else if (topic.toLowerCase().includes("actuators")) {
            const device = devices.find(
                (device: Tank) => device.id === topic.split("/")[1]
            );
            const pumpStatus = message.toString();
            if (device) {
                // device.on = true;
                device.actuators[0].value = Boolean(pumpStatus);
                setTanks([...devices]);
            }
        }
    });

    const saveTokenToGateway = async (profile: UserProfile, token: string) => {
        const newProfile = {
            ...profile,
            token: [...(profile.token || []), token],
        };

        const postToken = await axios.post(
            `${backendUrl}/gateway-profile`,
            newProfile,
            {
                headers: {
                    "Content-Type": "text/plain",
                },
            }
        );

        if (postToken.status === 200) {
            console.log("We saved the token");
        } else {
            // retrieve the token stored in the phone
        }
    };

    useEffect(() => {
        // Is there a token in gateway, retrieve it and store it... otherwise, register for notifications
        // Set expo push token with the obtained token
        const expoToken: string | null = getExpoToken();

        if (userProfile) {
            if (!expoToken) {
                registerForPushNotificationsAsync()
                    .then((token) => {
                        ToastAndroid.show("Connected", 2000);
                        // save token to the gateway meta info
                        if (token) {
                            storeExpoToken(token);
                            saveTokenToGateway(userProfile, token);
                        }
                    })
                    .catch((error: any) => {
                        ToastAndroid.show("Failed to connect", 2000);
                    });
            }
        } else {
            console.log("No profile loaded");
        }

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {}
            );

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(
                    notificationListener.current
                );
            responseListener.current &&
                Notifications.removeNotificationSubscription(
                    responseListener.current
                );
        };
    }, [userProfile]);

    const storeIpAddress = (ip: string | null | undefined): void => {
        if (ip) {
            SecureStore.setItemAsync("ip-address", ip.trim());
            setIpAddress(ip);
        }
    };

    useEffect(() => {
        if (!ipAddress) {
            getIpAddress();
        }
    }, [ipAddress]);

    // const getTankOnline = async () => {
    //   try {
    //     const getTanks = await axios.get(
    //       `${backendUrlOnline}/devices?q=gateway_id==b827ebdfc68ad595`
    //     );

    //     if (getTanks.status === 200) {
    //       const tanks = await getTanks.data;

    //       console.log(tanks[0]);
    //     } else {
    //       console.log("Error occured");
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    useEffect(() => {
        // getTankOnline();
    }, []);

    // Long pooling if MQTT is inactive
    useEffect(() => {
        const interval = setInterval(() => {
            const refetch = true;
            if (mqttActive) {
            } else {
                fetchData({ refetch });
            }
        }, timeoutDuration);

        return () => clearInterval(interval);
    }, [mqttActive]);

    useEffect(() => {
        setNotifications();
        setConnected(false);
        setFilteredDevices(devices);
        grantPerms();
        fetchData({});
    }, []);

    useEffect(() => {
        // if (devices) {
        !userProfile && getUserProfile();
        getNotifications();
        // }
    }, [devices]);

    // const setSelectedDevice = (device: X) => setSelectedTank(device);
    const setUser = (userName: string, token: string) =>
        setLoggedUser({ name: userName, token });
    const value = {
        devices: filteredDevices.length === 0 ? devices : filteredDevices,
        user,
        setUser,
        setTanks,
        reportRef,
        setReportRef,
        loading,
        setLoadingFunc,
        fetchData,
        refreshing,
        userProfile,
        loadingProfile,
        connected,
        updateProfile,
        timeoutErr,
        connectedWifi,
        setWifi,
        showNotification,
        unread,
        notifications,
        getNotifications,
        ipAddress,
        storeIpAddress,
        tanks,
        pumps,
        meters,
    };
    return (
        <DeviceContext.Provider value={value}>
            {children}
        </DeviceContext.Provider>
    );
};

export function useDeviceContext() {
    const context = useContext(DeviceContext);
    return context;
}
