import {
    View,
    Text,
    Dimensions,
    FlatList,
    TouchableNativeFeedback,
    Switch,
    ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { X } from "../../types";
import { color, flex, fontSize } from "../../theme/theme";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { getBackendUrl } from "../../private/env";
import { useDeviceContext } from "../../providers/devices/DeviceProvider";

export default function PumpCard({ pump }: { pump: X }) {
    const { ipAddress } = useDeviceContext();
    const backendUrl = getBackendUrl(ipAddress);
    const [pumpState, setPumpState] = useState<boolean | undefined>(false);

    const getPumpState = async (pump?: X) => {
        const value: boolean =
            pump?.actuators[0].value.state === 1 ? true : false;

        setPumpState(value);
    };

    const togglePump = async (state: boolean | number, pumpId: string) => {
        try {
            const actuatePump = await axios.post(
                `${backendUrl}/tanks/${pumpId}/pumps/state`,
                { state }
            );

            if (actuatePump.status === 200) {
                setPumpState(state === 1 ? true : false);
                ToastAndroid.show(
                    `${pump.name} turned ${state === 1 ? "ON" : "OFF"}`,
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

    useEffect(() => {
        pump && getPumpState(pump);
    }, [pump]);
    return (
        <View>
            {/* <TouchableNativeFeedback> */}
            <View
                style={[
                    flex.row,
                    {
                        gap: 10,
                        justifyContent: "space-between",
                        paddingVertical: 5,
                        paddingHorizontal: 0,
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
                        color={color.primaryColor}
                    />
                    <View style={[flex.col, { gap: 5 }]}>
                        <Text
                            style={{
                                color: "black",
                            }}
                        >
                            {pump.name}
                        </Text>
                        <Text
                            style={{
                                fontSize: fontSize.medium,
                                color: "gray",
                            }}
                        >
                            {pump.id}
                        </Text>
                    </View>
                </View>
                <Switch
                    value={pumpState}
                    thumbColor={pumpState ? color.primaryColor : "gray"}
                    onChange={() => {
                        togglePump(pumpState ? 0 : 1, pump.id);
                    }}
                />
            </View>
            {/* </TouchableNativeFeedback> */}
        </View>
    );
}
