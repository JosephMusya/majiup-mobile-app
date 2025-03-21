import {
    View,
    Text,
    ScrollView,
    FlatList,
    RefreshControl,
    SafeAreaView,
    Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useDeviceContext } from "../../providers/devices/DeviceProvider";
import {
    // Device,
    MetaInformation,
    Profile,
    Sensor,
    SensorAlert,
} from "../../types";
import axios from "axios";
import { getBackendUrl } from "../../private/env";
import LoadingBox from "../../components/loading/LoadingBox";
import SettingsCard from "../../components/settings-card/SettingsCard";
import EmptyBox from "../../components/containers/EmptyBox";
import { color, flex } from "../../theme/theme";
import Separator from "../../components/separator/Separator";
import { Tank } from "../../types";
import CustomTextInput from "../../components/text-input/CustomTextInput";
import CustomButton from "../../components/button/Button";

export default function Settings({ navigation }: any) {
    const {
        ipAddress,
        storeIpAddress,
        devices,
        setTanks,
        loading,
        refreshing,
        fetchData,
        userProfile,
        timeoutErr,
    } = useDeviceContext();
    const [deviceUpdated, setDeviceUpdated] = useState<boolean>(false);
    const [selectedDevice, setSelectedDevice] = useState<Tank>();

    const backendUrl = getBackendUrl(ipAddress);

    const Alt = {
        location: {
            cordinates: { latitude: 0, longitude: 0 },
            address: "",
        },
        notifications: selectedDevice?.notifications
            ? selectedDevice?.notifications
            : { messages: [] },
        receivenotifications:
            selectedDevice?.meta.receivenotifications ?? false,
        settings: selectedDevice?.meta.settings ?? {
            capacity: 0,
            radius: 0,
            height: 0,
            offset: 0,
            length: 0,
            width: 0,
            maxalert: 0,
            minalert: 0,
        },
        profile: {} as Profile,
    };
    const DefaultAlerts: SensorAlert = {
        critical_min: 0,
        critical_max: 0,
        kind: "",
    };

    const [changedMetaInfo, setChangedMetaInfo] = useState<{
        name: string;
        waterlevelSensorAlert: SensorAlert;
        metaData: MetaInformation;
    }>({
        name: selectedDevice?.name ?? "",
        waterlevelSensorAlert:
            selectedDevice?.sensors?.find(
                (sensor: Sensor) => sensor.meta.kind === "WaterLevel"
            )?.meta ?? DefaultAlerts,
        metaData: selectedDevice?.meta ?? Alt,
    });

    const deleteAlert = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        id: string
    ) => {
        e.preventDefault();
        const rs = confirm(
            `Are you sure you want to remove ${selectedDevice?.name}?`
        );
        if (rs) {
            await axios.delete(`${backendUrl}/tanks/${id}`);
            setTanks(devices.filter((device: Tank) => device.id !== id));
            // setIsOpenModal(false);
            setDeviceUpdated(false);
            setSelectedDevice(undefined);
            // navigate('/dashboard');
            //refresh the page
        }
    };

    const [ip, setIp] = useState<string | null | undefined>(ipAddress);

    const toggleIp = (ip: string) => {
        if (ip === "") {
            setIp(undefined);
        } else {
            setIp(ip.trim());
        }
    };

    const handleSubmitIp = () => {
        storeIpAddress && storeIpAddress(ip);
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                flexGrow: 1,
            }}
        >
            <ScrollView
                style={{
                    padding: 8,
                    flex: 1,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchData({})}
                    />
                }
            >
                <View style={[flex.col, { gap: 5, paddingBottom: 10 }]}>
                    <CustomTextInput
                        label="Enter IP Address"
                        // value={ipAddress as string}
                        value={ip as string}
                        defaultValue={ipAddress}
                        onChangeText={(text) => {
                            toggleIp(text);
                        }}
                    />
                    {ip !== ipAddress && (
                        <CustomButton
                            title="Submit"
                            onPress={handleSubmitIp}
                            width={100}
                        />
                    )}
                </View>
                {loading ? (
                    <LoadingBox />
                ) : devices.length > 0 ? (
                    <FlatList
                        data={devices}
                        ItemSeparatorComponent={() => <Separator height={10} />}
                        renderItem={({ item }) => {
                            return (
                                <SettingsCard
                                    sensors={item.sensors}
                                    liters={item.liters}
                                    meta={item.meta}
                                    name={item.name}
                                    id={item.id}
                                    onEdit={() =>
                                        navigation.navigate("EditSettings", {
                                            tank: item,
                                            profile: userProfile,
                                        })
                                    }
                                />
                            );
                        }}
                        scrollEnabled={false}
                    />
                ) : timeoutErr ? (
                    <View style={{ marginTop: 12 }}>
                        <EmptyBox
                            text="Check your connection!"
                            color={color.secondaryColor}
                        />
                    </View>
                ) : (
                    <View style={{ marginTop: 12 }}>
                        <EmptyBox
                            text="No tanks found at the moment!"
                            color={color.secondaryColor}
                        />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
