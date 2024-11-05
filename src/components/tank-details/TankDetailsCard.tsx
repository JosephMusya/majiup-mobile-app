import {
    View,
    Text,
    StyleSheet,
    Switch,
    Dimensions,
    FlatList,
    TouchableNativeFeedback,
    ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MetaInformation, X } from "../../types";
import { color, flex, fontSize } from "../../theme/theme";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import { MaterialIcons } from "@expo/vector-icons";
import CustomButton from "../button/Button";
import BottomSheet from "../modal-window/BottomSheet";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { useDeviceContext } from "../../providers/devices/DeviceProvider";
import { getBackendUrl } from "../../private/env";
import axios, { AxiosResponse } from "axios";
import { showAlert } from "../../utils/fx/alert";

const PumpSelection = ({
    pumps,
    tankId,
    onCancel,
    updatePump,
    meta,
}: {
    tankId: string | undefined;
    pumps: X[];
    onCancel: () => void;
    updatePump: (pumpId: string, status?: boolean) => Promise<void>; // Define type for updatePump
    meta?: MetaInformation;
}) => {
    const { ipAddress } = useDeviceContext();
    const [selectedPump, setSelectedPump] = useState<X | null>();
    const backendUrl = getBackendUrl(ipAddress);

    const [tankMeta, setTankMeta] = useState<{
        metaData: MetaInformation | undefined;
    }>({
        metaData: meta,
    });

    const setPump = (pump: X) => {
        if (pump.meta.assigned === true) {
            pump.id !== meta?.pumpID &&
                ToastAndroid.show(
                    "This pump is allocated to another tank",
                    3000
                );
            setSelectedPump(null);
            return;
        }
        setSelectedPump(pump);
    };

    const allocatePump = async (pumpId: string) => {
        try {
            const responseMetaData = await axios.post(
                `${backendUrl}/tanks/${tankId}/profile`,
                {
                    ...tankMeta.metaData,
                    pumpID: pumpId,
                }
            );

            if (responseMetaData.status === 200) {
                updatePump(pumpId, true).then(() => {
                    ToastAndroid.show("Pump allocated", 2000);
                    onCancel();
                });
                // toast.error("Failed to update tank details");
            }
        } catch (err) {
            ToastAndroid.show("Failed to set pump", 2000);
            // toast.error("Error while updating tank");
        }
    };

    return (
        <View
            style={{
                position: "relative",
            }}
        >
            <View
                style={[
                    flex.col,
                    {
                        minHeight: 50,
                        backgroundColor: color.shadowColor,
                        justifyContent: "center",
                        alignContent: "center",
                    },
                ]}
            >
                <Text
                    style={[
                        {
                            fontSize: fontSize.xlarge,
                            fontWeight: "bold",
                            paddingHorizontal: 10,
                        },
                    ]}
                >
                    {meta?.pumpID ? "Edit Pump" : "Select Pump"}
                </Text>
            </View>
            <View
                style={{
                    minHeight: Dimensions.get("window").height * 0.35,
                    maxHeight: Dimensions.get("window").height * 0.55,
                    paddingBottom: "22%",
                }}
            >
                <FlatList
                    data={pumps}
                    renderItem={({ item }) => {
                        return (
                            <TouchableNativeFeedback
                                onPress={() => {
                                    setPump(item);
                                }}
                                key={item.id}
                            >
                                <View
                                    style={[
                                        flex.row,
                                        {
                                            gap: 10,
                                            justifyContent: "space-between",
                                            padding: 10,
                                            width: "100%",
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            flex.row,
                                            {
                                                gap: 10,
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name="power"
                                            size={45}
                                            color={
                                                item.meta.assigned === true
                                                    ? "gray"
                                                    : color.primaryColor
                                            }
                                        />
                                        <View style={[flex.col, { gap: 5 }]}>
                                            <Text
                                                style={{
                                                    color:
                                                        item.meta.assigned ===
                                                        true
                                                            ? "gray"
                                                            : "black",
                                                }}
                                            >
                                                {item.name}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: fontSize.medium,
                                                    color: "gray",
                                                }}
                                            >
                                                {item.id}
                                            </Text>
                                        </View>
                                    </View>
                                    {selectedPump?.id === item.id ||
                                    (meta?.pumpID === item.id &&
                                        !selectedPump?.id) ? (
                                        <View>
                                            <MaterialIcons
                                                name="check-circle"
                                                size={24}
                                                color={color.primaryColor}
                                            />
                                        </View>
                                    ) : (
                                        item.meta.assigned && (
                                            <Text
                                                style={{
                                                    fontSize: fontSize.medium,
                                                    color: "gray",
                                                }}
                                            >
                                                {item.id === meta?.pumpID
                                                    ? "Current Pump"
                                                    : "Allocated"}
                                            </Text>
                                        )
                                    )}
                                </View>
                            </TouchableNativeFeedback>
                        );
                    }}
                />
            </View>
            <View
                style={[
                    flex.row,
                    {
                        justifyContent: "space-around",
                        width: "100%",
                        paddingHorizontal: 20,
                        gap: 30,
                        position: "absolute",
                        bottom: "5%",
                    },
                ]}
            >
                <CustomButton
                    padding={12}
                    width={120}
                    fontSize={fontSize.large}
                    title="Cancel"
                    color="gray"
                    onPress={onCancel}
                />
                <CustomButton
                    padding={12}
                    fontSize={fontSize.large}
                    width={120}
                    title="Confirm"
                    onPress={() => {
                        if (!selectedPump) {
                            if (!meta?.pumpID) {
                                ToastAndroid.show("Select a pump", 3000);
                            }
                            onCancel();
                            return;
                        } else if (
                            meta?.pumpID !== selectedPump.id &&
                            meta?.pumpID
                        ) {
                            showAlert({
                                title: "Confirm Changes",
                                message:
                                    "Are you sure you want change the tank pump?",
                                cancelText: "cancel",
                                okText: "confirm",
                                onConfirm: () => {
                                    allocatePump(selectedPump.id).then(() => {
                                        meta?.pumpID &&
                                            updatePump(meta?.pumpID, false);
                                    });
                                },
                            });

                            return;
                        }
                        allocatePump(selectedPump?.id);
                    }}
                />
            </View>
        </View>
    );
};

export default function TankDetailsCard({
    id,
    meta,
    liters,
    analytics,
    on,
}: Partial<X>) {
    const { pumps, ipAddress } = useDeviceContext();
    const [pumpState, setPumpState] = useState<boolean | undefined>(false);
    const backendUrl = getBackendUrl(ipAddress);

    const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false);

    const [connectedPump, setConnectedPump] = useState<X | undefined>(
        pumps?.find((pump) => {
            return pump.id === meta?.pumpID;
        })
    );

    const getPumpState = async (pump?: X) => {
        const value: boolean =
            pump?.actuators[0].value.state === 1 ? true : false;

        console.log(value);
        setPumpState(value);

        console.log(value);
    };

    const togglePump = async (state: boolean | number, pumpId: string) => {
        try {
            const actuatePump = await axios.post(
                `${backendUrl}/tanks/${pumpId}/pumps/state`,
                { state }
            );

            if (actuatePump.status === 200) {
                setPumpState(state === 1 ? true : state === 0 && false);
                ToastAndroid.show(
                    `Pump turned ${state === 1 ? "ON" : "OFF"}`,
                    3000
                );
            }
        } catch (error) {
            ToastAndroid.show(
                `Failed to switch pump ${state === 1 ? "ON" : "OFF"}`,
                3000
            );
            console.log(error);
        } finally {
        }
    };

    const detachPump = async (pumpId: string, tankId: string) => {
        try {
            const responseMetaData = await axios.post(
                `${backendUrl}/tanks/${tankId}/profile`,
                {
                    ...meta,
                    pumpID: "",
                }
            );

            if (responseMetaData.status === 200) {
                updatePump(pumpId, false).then(() => {
                    ToastAndroid.show("Pump removed from this tank", 2000);
                });
            }
        } catch (err) {
            ToastAndroid.show("Failed to set pump", 2000);
        }
    };

    const updatePump = async (pumpId: string, status?: boolean) => {
        // Implement the updatePump function here
        try {
            const { data: currentData } = await axios.get<MetaInformation>(
                `${backendUrl}/tanks/${pumpId}/profile`
            );
            await axios.post(`${backendUrl}/tanks/${pumpId}/profile`, {
                ...currentData,
                assigned: status,
            });
        } catch (err) {
            ToastAndroid.show("Failed to set pump", 2000);
        }
    };

    useEffect(() => {
        if (connectedPump) {
            getPumpState(connectedPump);
            return;
        }
        const usePump = pumps?.find((pump) => {
            return pump.id === meta?.pumpID;
        });

        setConnectedPump(usePump);
    }, [connectedPump]);

    return (
        <View style={style.container}>
            <BottomSheet
                isVisible={showBottomSheet}
                minHeight={Dimensions.get("window").height * 0.45}
                onClose={() => setShowBottomSheet(false)}
                children={
                    <PumpSelection
                        pumps={pumps}
                        tankId={id}
                        meta={meta}
                        updatePump={updatePump}
                        onCancel={() => setShowBottomSheet(false)}
                    />
                }
            />
            <View style={[flex.row, style.items]}>
                <View style={[flex.row, { gap: 10 }]}>
                    <MaterialIcons
                        name="water-drop"
                        size={20}
                        color={color.primaryColor}
                    />
                    <Text>Current Quantity</Text>
                </View>
                <Text>{liters?.toLocaleString()} Ltrs</Text>
            </View>
            <View style={[flex.row, style.items]}>
                <View style={[flex.row, { gap: 10 }]}>
                    <MaterialIcons
                        name="access-time-filled"
                        size={20}
                        color={color.primaryColor}
                    />
                    <Text>Average Usage</Text>
                </View>
                {/* <Text>
          {usage === "d" && analytics?.average?.daily?.toFixed(0)}{" "}
          {usage === "h" && analytics?.average?.hourly?.toFixed(0)} L/
          {usage === "d" && "day"}
          {usage === "h" && "hr"}
        </Text> */}
                <View style={{}}>
                    <Text style={{ alignSelf: "flex-end" }}>
                        {analytics
                            ? Math.round(
                                  analytics?.average?.hourly
                              ).toLocaleString()
                            : "---"}{" "}
                        L/hr
                    </Text>
                    <Text style={{ alignSelf: "flex-end" }}>
                        {analytics
                            ? Math.round(
                                  analytics?.average?.daily
                              ).toLocaleString()
                            : "---"}{" "}
                        L/day
                    </Text>
                </View>
            </View>
            <View style={[flex.row, style.items]}>
                <View style={[flex.row, { gap: 10 }]}>
                    <Ionicons
                        name="analytics"
                        size={20}
                        color={color.primaryColor}
                    />
                    <Text>Water Level Trend</Text>
                </View>
                <Text>
                    {analytics?.trend?.value ? (
                        analytics?.trend?.value > 0 ? (
                            <Entypo name="arrow-up" size={20} color="green" />
                        ) : (
                            <Entypo
                                name="arrow-down"
                                size={20}
                                color={color.secondaryColor}
                            />
                        )
                    ) : (
                        "---"
                    )}
                </Text>
            </View>
            <View style={[flex.row, style.items]}>
                <View style={[flex.row, { gap: 10 }]}>
                    {on ? (
                        <MaterialIcons
                            name="signal-cellular-alt"
                            size={20}
                            color={color.primaryColor}
                        />
                    ) : (
                        <MaterialIcons
                            name="signal-cellular-nodata"
                            size={20}
                            color={color.primaryColor}
                        />
                    )}
                    <Text>Tank Status</Text>
                </View>
                <Text style={{ color: on ? "green" : color.secondaryColor }}>
                    {on ? "Online" : "Offline"}
                </Text>
            </View>
            {meta?.pumpID ? (
                <>
                    <View style={[flex.row, style.items]}>
                        <View style={[flex.row, { gap: 10 }]}>
                            <Ionicons
                                name="power"
                                size={20}
                                color={color.primaryColor}
                            />
                            <Text>Pump Status</Text>
                        </View>
                        <Switch
                            value={pumpState}
                            thumbColor={pumpState ? color.primaryColor : "gray"}
                            onChange={() => {
                                togglePump(pumpState ? 0 : 1, meta.pumpID);
                                // setPumpState((pumpState) => !pumpState);
                            }}
                        />
                    </View>
                    <View
                        style={[
                            flex.row,
                            {
                                gap: 20,
                                justifyContent: "space-around",
                                paddingVertical: 5,
                            },
                        ]}
                    >
                        <CustomButton
                            title="Detach Pump"
                            color="gray"
                            onPress={() => {
                                showAlert({
                                    title: "Remove Pump",
                                    message: `Are you sure you want to disconnect ${connectedPump?.name}  from this tank?  `,
                                    cancelText: "Back",
                                    okText: "Disconnect",
                                    onConfirm: () => {
                                        connectedPump?.id &&
                                            id &&
                                            detachPump(connectedPump?.id, id);
                                    },
                                });
                            }}
                            width={120}
                        />
                        <CustomButton
                            title="Modify Pump"
                            width={120}
                            onPress={() => setShowBottomSheet(true)}
                        />
                    </View>
                </>
            ) : (
                <View
                    style={[
                        flex.row,
                        {
                            paddingVertical: 10,
                            justifyContent: "center",
                        },
                    ]}
                >
                    <CustomButton
                        title="Connect pump to this tank"
                        onPress={() => {
                            setShowBottomSheet(true);
                            //showBottomSheetWith pumps available
                        }}
                    />
                </View>
            )}
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        gap: 4,
        fontSize: 22,
        borderWidth: 0,
        padding: 8,
        borderRadius: 5,
        backgroundColor: "#fff",
        elevation: 1,
    },
    items: {
        display: "flex",
        flexGrow: 1,
        justifyContent: "space-between",
        paddingTop: 8,
    },
});
