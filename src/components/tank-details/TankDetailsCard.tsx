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
import EmptyBox from "../containers/EmptyBox";

const ActuatorSelection = ({
    actuators,
    tankId,
    onCancel,
    updateActuator,
    meta,
}: {
    tankId: string | undefined;
    actuators: X[];
    onCancel: () => void;
    updateActuator: (actuatorID: string, status?: boolean) => Promise<void>; // Define type for updateActuator
    meta?: MetaInformation;
}) => {
    const { ipAddress, updateDeviceMeta } = useDeviceContext();
    const [selectedActuator, setSelectedActuator] = useState<X | null>();
    const backendUrl = getBackendUrl(ipAddress);
    const [allocatingActuator, setAllocatingActuator] = useState<boolean>(false);

    const [tankMeta, setTankMeta] = useState<{
        metaData: MetaInformation | undefined;
    }>({
        metaData: meta,
    });

    const setActuator = (actuator: X) => {
        if (actuator.meta.assigned === true) {
            actuator.id !== meta?.actuatorID &&
                ToastAndroid.show(
                    "This actuator is allocated to another tank",
                    3000
                );
            setSelectedActuator(null);
            return;
        }
        setSelectedActuator(actuator);
    };

    const allocateActuator = async (actuatorID: string) => {
        const tankMetaBody = {
            ...tankMeta.metaData,
            actuatorID: actuatorID,
        };

        try {
            const response = await axios.post(
                `${backendUrl}/tanks/${tankId}/profile`,
                tankMetaBody
            );
            if (response.status === 200) {
                await updateActuator(actuatorID, true);
                ToastAndroid.show("Actuator allocated", 2000);
                if (tankId) {
                    updateDeviceMeta(
                        tankMetaBody as unknown as MetaInformation,
                        tankId,
                        "TANK"
                    );
                }
            }
            return response;
        } catch (err) {
            ToastAndroid.show("Failed to set actuator", 2000);
        } finally {
            setAllocatingActuator(false);
            onCancel();
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
                    {meta?.actuatorID ? "Edit Actuator" : "Select Actuator"}
                </Text>
            </View>
            <View
                style={{
                    minHeight: Dimensions.get("window").height * 0.35,
                    maxHeight: Dimensions.get("window").height * 0.55,
                    paddingBottom: "22%",
                }}
            >
                {actuators.length ? (
                    <FlatList
                        data={actuators}
                        renderItem={({ item }) => {
                            return (
                                <TouchableNativeFeedback
                                    onPress={() => {
                                        setActuator(item);
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
                                                    item.meta.assigned
                                                        ? "gray"
                                                        : color.primaryColor
                                                }
                                            />
                                            <View
                                                style={[flex.col, { gap: 5 }]}
                                            >
                                                <Text
                                                    style={{
                                                        color: item.meta
                                                            .assigned
                                                            ? "gray"
                                                            : "black",
                                                    }}
                                                >
                                                    {item.name}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize:
                                                            fontSize.medium,
                                                        color: "gray",
                                                    }}
                                                >
                                                    {item.id}
                                                </Text>
                                            </View>
                                        </View>
                                        {selectedActuator?.id === item.id ||
                                        (meta?.actuatorID === item.id &&
                                            !selectedActuator?.id) ? (
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
                                                        fontSize:
                                                            fontSize.medium,
                                                        color: "gray",
                                                    }}
                                                >
                                                    {item.id === meta?.actuatorID
                                                        ? "Current Actuator"
                                                        : "Allocated"}
                                                </Text>
                                            )
                                        )}
                                    </View>
                                </TouchableNativeFeedback>
                            );
                        }}
                    />
                ) : (
                    <View style={[flex.col, { height: 200 }]}>
                        <EmptyBox
                            text="No actuators detected"
                            color={color.secondaryColor}
                            children={
                                <Entypo
                                    name="block"
                                    size={24}
                                    color={color.secondaryColor}
                                />
                            }
                        />
                    </View>
                )}
            </View>
            {actuators.length ? (
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
                        title={allocatingActuator ? "Allocating..." : "Confirm"}
                        onPress={() => {
                            if (!selectedActuator) {
                                if (!meta?.actuatorID) {
                                    ToastAndroid.show("Select a actuator", 3000);
                                    return;
                                }
                                onCancel();
                                return;
                            } else if (
                                meta?.actuatorID !== selectedActuator.id &&
                                meta?.actuatorID
                            ) {
                                showAlert({
                                    title: "Confirm Changes",
                                    message:
                                        "Are you sure you want to change the actuator for this tank?",
                                    cancelText: "cancel",
                                    okText: "Confirm",
                                    onConfirm: () => {
                                        const actuatorToRemoveId = meta?.actuatorID;
                                        allocateActuator(selectedActuator.id).then(
                                            () => {
                                                actuatorToRemoveId &&
                                                    updateActuator(
                                                        actuatorToRemoveId,
                                                        false
                                                    );
                                            }
                                        );
                                    },
                                });

                                return;
                            }
                            allocateActuator(selectedActuator?.id);
                        }}
                    />
                </View>
            ): null}
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
    const { actuators, ipAddress, updateDeviceMeta } = useDeviceContext();
    const [actuatorState, setActuatorState] = useState<boolean | undefined>(false);
    const backendUrl = getBackendUrl(ipAddress);

    const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false);

    const [connectedActuator, setConnectedActuator] = useState<X | undefined>(
        actuators?.find((actuator) => {
            return actuator.id === meta?.actuatorID;
        })
    );

    const getActuatorState = async (actuator?: X) => {
        const value: boolean =
            actuator?.actuators[0].value.state === 1 ? true : false;

        setActuatorState(value);
    };

    const toggleActuator = async (state: boolean | number, actuatorID: string) => {
        try {
            const actuateActuator = await axios.post(
                `${backendUrl}/tanks/${actuatorID}/actuators/state`,
                { state }
            );

            if (actuateActuator.status === 200) {
                setActuatorState(state === 1 ? true : state === 0 && false);
                ToastAndroid.show(
                    `Actuator turned ${state === 1 ? "ON" : "OFF"}`,
                    3000
                );
            }
        } catch (error) {
            ToastAndroid.show(
                `Failed to switch actuator ${state === 1 ? "ON" : "OFF"}`,
                3000
            );
            console.log(error);
        } finally {
        }
    };

    // 672a132a68f31909570aa02e
    // 672a2c3168f31908f86456f7
    // 672a2c8a68f31908f86456f9

    const updateActuator = async (actuatorID: string, status?: boolean) => {
        try {
            const { data: currentMetaData } = await axios.get<MetaInformation>(
                `${backendUrl}/tanks/${actuatorID}/profile`
            );

            const deviceMeta = {
                ...currentMetaData,
                assigned: status,
            };

            await axios.post(
                `${backendUrl}/tanks/${actuatorID}/profile`,
                deviceMeta
            );

            updateDeviceMeta(deviceMeta, actuatorID, "ACTUATOR");
        } catch (err) {
            ToastAndroid.show("Failed to set actuator", 2000);
        }
    };

    const detachActuator = async (actuatorID: string, tankId: string) => {
        try {
            const deviceMeta = {
                ...meta,
                actuatorID: "",
            };

            const responseMetaData = await axios.post(
                `${backendUrl}/tanks/${tankId}/profile`,
                deviceMeta
            );

            if (responseMetaData.status === 200) {
                updateDeviceMeta(
                    deviceMeta as unknown as MetaInformation,
                    tankId,
                    "TANK"
                );

                //update actuator NB: spread data in the update actuator fx
                updateActuator(actuatorID, false).then(() => {
                    ToastAndroid.show("Actuator removed from this tank", 2000);
                });
            }
        } catch (err) {
            ToastAndroid.show("Failed to set actuator", 2000);
        }
    };

    useEffect(() => {
        if (connectedActuator) {
            getActuatorState(connectedActuator);
            return;
        }
        const useActuator = actuators?.find((actuator) => {
            return actuator.id === meta?.actuatorID;
        });

        setConnectedActuator(useActuator);
    }, [connectedActuator, meta]);

    return (
        <View style={style.container}>
            <BottomSheet
                isVisible={showBottomSheet}
                minHeight={Dimensions.get("window").height * 0.45}
                onClose={() => setShowBottomSheet(false)}
                children={
                    <ActuatorSelection
                        actuators={actuators}
                        tankId={id}
                        meta={meta}
                        updateActuator={updateActuator}
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
            {meta?.actuatorID ? (
                <>
                    <View style={[flex.row, style.items]}>
                        <View style={[flex.row, { gap: 10 }]}>
                            <Ionicons
                                name="power"
                                size={20}
                                color={color.primaryColor}
                            />
                            <Text>Actuator Status</Text>
                        </View>
                        <Switch
                            value={actuatorState}
                            thumbColor={actuatorState ? color.primaryColor : "gray"}
                            onChange={() => {
                                meta.actuatorID &&
                                    toggleActuator(actuatorState ? 0 : 1, meta.actuatorID);
                                // setActuatorState((actuatorState) => !actuatorState);
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
                            title="Detach Actuator"
                            color="gray"
                            onPress={() => {
                                showAlert({
                                    title: "Remove Actuator",
                                    message: `Are you sure you want to disconnect ${connectedActuator?.name} from this tank?  `,
                                    cancelText: "Back",
                                    okText: "Disconnect",
                                    onConfirm: () => {
                                        connectedActuator?.id &&
                                            id &&
                                            detachActuator(connectedActuator?.id, id);
                                    },
                                });
                            }}
                            width={120}
                        />
                        <CustomButton
                            title="Modify Actuator"
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
                        title="Connect actuator to this tank"
                        onPress={() => {
                            setShowBottomSheet(true);
                            //showBottomSheetWith actuators available
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
