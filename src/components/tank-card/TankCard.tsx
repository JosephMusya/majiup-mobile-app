import {
    View,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import Status from "../status/Status";
import { StyleSheet } from "react-native";
import { flex, fontSize } from "../../theme/theme";
import { Sensor, X } from "../../types";
import { convertDays, getLastSeen } from "../../utils/fx/timeFormatter";
import { showAlert } from "../../utils/fx/alert";

export default function TankCard({
    tank,
    onPress,
    editTank,
}: {
    tank: X;
    onPress: () => void;
    editTank: () => void;
}) {
    const sensors = tank.sensors?.some((sensor: Sensor) => {
        return sensor.meta.kind === "WaterLevel";
    });

    const days = tank?.liters / tank.analytics?.average?.daily;

    useEffect(() => {}, []);

    return (
        <TouchableNativeFeedback
            onPress={() =>
                sensors
                    ? onPress()
                    : showAlert({
                          title: "Tank Setup",
                          cancelText: "Close",
                          message: `Finish setting up ${tank.name}`,
                          okText: "Setup Now",
                          onConfirm: () => editTank(),
                      })
            }
        >
            <View style={[style.container]}>
                <View
                    style={[
                        flex.row,
                        {
                            justifyContent: "space-between",
                            flexGrow: 1,
                            backgroundColor: "#f2f2f2",
                            padding: 8,
                            overflow: "hidden",
                            borderTopEndRadius: 3,
                            borderTopLeftRadius: 3,
                            // borderWidth: 0.8,
                            // bor,
                        },
                    ]}
                >
                    <Text
                        style={{ fontWeight: "500", fontSize: fontSize.xlarge }}
                    >
                        {tank.name}
                    </Text>
                    {!tank.on && (
                        <Text>
                            {getLastSeen(
                                tank?.sensors?.find((sensor) => {
                                    return sensor.meta.kind === "WaterLevel";
                                })?.time
                            )}
                        </Text>
                    )}
                    <Status status={tank.on} />
                </View>
                {sensors ? (
                    <View
                        style={[
                            flex.row,
                            {
                                flexGrow: 1,
                                justifyContent: "space-between",
                                padding: 4,
                            },
                        ]}
                    >
                        <View>
                            <Text
                                style={{
                                    fontSize: fontSize.XXlarge,
                                    fontWeight: "500",
                                    color: (() => {
                                        const percentage = Math.round(
                                            (tank.liters / tank.capacity) * 100
                                        );
                                        const waterLevelSensor =
                                            tank?.sensors?.find((sensor) => {
                                                return (
                                                    sensor?.meta?.kind ===
                                                    "WaterLevel"
                                                );
                                            });

                                        if (
                                            waterLevelSensor &&
                                            typeof waterLevelSensor.meta
                                                ?.critical_min === "number" &&
                                            percentage <=
                                                waterLevelSensor.meta
                                                    .critical_min
                                        ) {
                                            return "orange";
                                        }
                                        return "";
                                    })(),
                                }}
                            >
                                {Math.round(
                                    (tank.liters / tank.capacity) * 100
                                )}
                                %
                            </Text>
                            <Text>
                                {tank.analytics?.average?.hourly
                                    ? Math.round(
                                          tank.analytics?.average?.hourly
                                      ).toLocaleString()
                                    : "---"}{" "}
                                ltrs/hr
                            </Text>
                        </View>
                        <View>
                            <Text
                                style={{
                                    fontSize: fontSize.XXlarge,
                                    fontWeight: "500",
                                }}
                            >
                                {Math.round(tank.liters).toLocaleString()}
                            </Text>
                            <Text>Liters Left</Text>
                        </View>
                        <View>
                            <Text
                                style={{
                                    fontSize: fontSize.XXlarge,
                                    fontWeight: "500",
                                    color:
                                        `${
                                            convertDays(days).type === "Days" &&
                                            convertDays(days).duration < 3
                                                ? "orange"
                                                : ""
                                        }` ||
                                        `${
                                            convertDays(days).type ===
                                                "Hours" &&
                                            convertDays(days).duration < 1
                                                ? "orange"
                                                : ""
                                        }`,
                                }}
                            >
                                {convertDays(days).duration.toFixed(0)}
                            </Text>
                            <Text>
                                {convertDays(days).type
                                    ? convertDays(days).type
                                    : "Days"}{" "}
                                Left
                            </Text>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={() =>
                            showAlert({
                                title: "Tank Setup",
                                cancelText: "Close",
                                message: `Finish setting up ${tank.name}`,
                                okText: "Setup Now",
                                onConfirm: () => editTank(),
                            })
                        }
                    >
                        <View
                            style={{
                                padding: 4,
                                height: 50,
                                justifyContent: "center",
                            }}
                        >
                            <View>
                                <Text style={{ color: "orange" }}>
                                    This tank is not yet setup!
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableNativeFeedback>
    );
}

const style = StyleSheet.create({
    container: {
        overflow: "hidden",
        borderRadius: 5,
        // marginTop: 10,
        marginBottom: 10,
        borderColor: "#f2f2f2",
        borderStyle: "solid",
        borderWidth: 1.5,
    },
});
