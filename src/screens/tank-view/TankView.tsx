import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    Button,
    SafeAreaView,
    RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { X } from "../../types";
import { useDeviceContext } from "../../providers/devices/DeviceProvider";
import { getBackendUrl } from "../../private/env";
import axios from "axios";
import { color, flex, fontSize } from "../../theme/theme";
import TankDetailsCard from "../../components/tank-details/TankDetailsCard";
import { RouteProp, useRoute } from "@react-navigation/native";
import DeviceHealth from "../../components/device-health/DeviceHealth";
import Chart from "../../components/chart/Chart";
import CustomButton from "../../components/button/Button";
import * as Notifications from "expo-notifications";
import { showNotification } from "../../utils/fx/notifications";
import ActionsCard from "../../components/actions/ActionsCard";
import WaterTank from "../../components/water-tank/WaterTank";

// import { lineDataItem } from "react-native-gifted-charts";
// import WatertankComponent from "../../components/water-tank/WaterTank";
// import WaterTank from "../../components/water-tank/WaterTank";
// import Tank from "../../components/water-tank/WaterTank";

export type BatteryInfo = {
    charging?: boolean;
    percentage?: number;
};

export default function TankView({}) {
    type MyParamList = {
        Params: { tank: X };
    };

    const { ipAddress, tanks, fetchData } = useDeviceContext();
    const backendUrl = getBackendUrl(ipAddress);

    const route = useRoute<RouteProp<MyParamList>>();
    const { id }: any = route.params;

    const device = tanks.find((device: X) => device.id === id);

    type usage = "h" | "d";

    const [usage, setUsage] = useState<usage>("h");

    const [showGraph, setShowGraph] = useState<boolean>(false);

    interface RefillType {
        amount?: number;
        amount_liters?: number;
        created_at?: any;
        id?: string;
        location?: {
            lat: number;
            lng: number;
        };
        owner?: any;
        status?: string;
        tank_capacity?: number;
        tank_id?: any;
        tank_info?: any;
        tank_name?: string;
        confirmed?: boolean;
        vendor?: any;
    }

    const [battery, setBattery] = useState<BatteryInfo>();

    const getBattery = async () => {
        const retrieveBatt = await axios.get(
            `${backendUrl}/tanks/${id}/battery-info`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        if (retrieveBatt.status === 200) {
            const battInfo: BatteryInfo = retrieveBatt.data;
            setBattery(battInfo);
        } else {
            console.log("Error code: ", retrieveBatt.status);
        }
    };

    useEffect(() => {
        // showNotification({
        //   title: `${device?.name} overflowing`,
        //   body: "Water level exceeding fill level",
        // });
        if (device) {
            getBattery();
        }
    }, [device]);

    return (
        <SafeAreaView>
            <ScrollView
                style={[style.container]}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => fetchData({})}
                    />
                }
            >
                <View style={[flex.col, { gap: 10 }]}>
                    {device?.capacity ? (
                        <WaterTank
                            percentage={
                                device &&
                                (device?.liters / device?.capacity) * 100
                            }
                        />
                    ) : null}
                    {/* <ActionsCard /> */}
                    <TankDetailsCard
                        id={id}
                        on={device?.on}
                        usage={usage}
                        liters={device?.liters}
                        analytics={device?.analytics}
                        meta={device?.meta}
                    />
                    <DeviceHealth
                        charging={battery?.charging}
                        percentage={battery?.percentage}
                        on={device?.on}
                    />
                    {showGraph && (
                        <Chart
                            title="Water Consumption History"
                            series={device?.consumption}
                            maxY={device?.capacity}
                            consumed={device?.analytics?.trend?.amountUsed}
                            closeChart={() => setShowGraph(false)}
                        />
                    )}
                    {/* {!showGraph && (
                        <View style={[flex.row, { justifyContent: "center" }]}>
                            <CustomButton
                                color={color.primaryColor}
                                onPress={
                                    () => {
                                        setShowGraph(!showGraph);
                                    }
                                    // showNotifications({
                                    //   id: String(1),
                                    //   title: "St Francis Tank",
                                    //   body: "Tank is almost full",
                                    // })
                                }
                                width={150}
                                title={"Show Graph"}
                            />
                        </View>
                    )} */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    container: {
        padding: 8,
        gap: 10,
    },
});
