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

export default function ActuatorCard({ actuator }: { actuator: X }) {
    const { ipAddress } = useDeviceContext();
    const backendUrl = getBackendUrl(ipAddress);
    const [actuatorState, setPumpState] = useState<boolean | undefined>(false);

    const getPumpState = async (actuator?: X) => {
        const value: boolean =
            actuator?.actuators[0].value.state === 1 ? true : false;

        setPumpState(value);
    };

    const togglePump = async (state: boolean | number, actuatorId: string) => {
        try {
            const actuatePump = await axios.post(
                `${backendUrl}/tanks/${actuatorId}/actuators/state`,
                { state }
            );

            if (actuatePump.status === 200) {
                setPumpState(state === 1 ? true : false);
                ToastAndroid.show(
                    `${actuator.name} turned ${state === 1 ? "ON" : "OFF"}`,
                    3000
                );
            }
        } catch (error) {
            ToastAndroid.show(
                `Failed to switch actuator ${state === 1 ? "ON" : "OFF"}`,
                3000
            );
        } finally {
        }
    };

    useEffect(() => {
        actuator && getPumpState(actuator);
    }, [actuator]);

    return (
        <View>
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
                            {actuator.name}
                        </Text>
                        <Text
                            style={{
                                fontSize: fontSize.medium,
                                color: "gray",
                            }}
                        >
                            {actuator.id}
                        </Text>
                    </View>
                </View>
                <Switch
                    value={actuatorState}
                    thumbColor={actuatorState ? color.primaryColor : "gray"}
                    onChange={() => {
                        togglePump(actuatorState ? 0 : 1, actuator.id);
                    }}
                />
            </View>
        </View>
    );
}
