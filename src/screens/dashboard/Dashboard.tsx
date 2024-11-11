import {
    View,
    ScrollView,
    RefreshControl,
    FlatList,
    TouchableNativeFeedback,
    Button,
    Dimensions,
} from "react-native";
import React, { Children, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import TankCard from "../../components/tank-card/TankCard";
import { useDeviceContext } from "../../providers/devices/DeviceProvider";
import LoadingBox from "../../components/loading/LoadingBox";
import EmptyBox from "../../components/containers/EmptyBox";
import { color, flex } from "../../theme/theme";
import { Filter, TankViewProp, X } from "../../types";
import { Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { Text } from "react-native";
import CustomButton from "../../components/button/Button";
import PumpCard from "../../components/pump-card/PumpCard";
import MeterCard from "../../components/meter-card/MeterCard";

const PlaceHolderBox = ({ text }: { text: string }) => {
    return (
        <View
            style={[
                {
                    height: Dimensions.get("screen").height * 0.7,
                },
            ]}
        >
            <EmptyBox
                text={text}
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
    );
};
export default function Dashboard({ navigation }: any) {
    const {
        devices,
        loading,
        refreshing,
        timeoutErr,
        fetchData,
        tanks,
        pumps,
        meters,
    } = useDeviceContext();

    const navigate = ({ id, name }: TankViewProp) => {
        navigation.navigate("TankView", {
            id: id,
            name: name,
        });
    };

    const [filter, setFilter] = useState<Filter>("Tanks");

    const toggleFilter = (arg: Filter) => {
        setFilter(arg);
    };

    return (
        <View style={{ flex: 1, flexGrow: 1, backgroundColor: "#fff" }}>
            {loading ? (
                <LoadingBox />
            ) : !devices.length ? (
                timeoutErr ? (
                    <EmptyBox
                        color={color.secondaryColor}
                        text="Check your connection!"
                        children={
                            <Feather
                                onPress={() => fetchData({})}
                                name="refresh-ccw"
                                size={24}
                                color="black"
                            />
                        }
                    />
                ) : (
                    <EmptyBox
                        color={color.secondaryColor}
                        text="No Tanks found for now"
                    />
                )
            ) : (
                <>
                    <View style={[flex.row, { padding: 8, gap: 8 }]}>
                        {tanks.length > 0 && (
                            <CustomButton
                                title="Tanks"
                                width={90}
                                color={
                                    filter === "Tanks"
                                        ? color.primaryColor
                                        : color.complementaryColor
                                }
                                textColor={
                                    filter === "Tanks"
                                        ? "#fff"
                                        : color.textColor
                                }
                                onPress={() => toggleFilter("Tanks")}
                            />
                        )}
                        {pumps.length > 0 && (
                            <CustomButton
                                title="Pumps"
                                width={90}
                                color={
                                    filter === "Pumps"
                                        ? color.primaryColor
                                        : color.complementaryColor
                                }
                                textColor={
                                    filter === "Pumps"
                                        ? "#fff"
                                        : color.textColor
                                }
                                onPress={() => toggleFilter("Pumps")}
                            />
                        )}
                        {meters.length > 0 && (
                            <CustomButton
                                title="Water Meters"
                                width={90}
                                color={
                                    filter === "Meters"
                                        ? color.primaryColor
                                        : color.complementaryColor
                                }
                                textColor={
                                    filter === "Meters"
                                        ? "#fff"
                                        : color.textColor
                                }
                                onPress={() => toggleFilter("Meters")}
                            />
                        )}
                    </View>
                    {filter === "Tanks" && (
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={() => fetchData({})}
                                />
                            }
                            style={style.container}
                        >
                            {tanks?.length > 0 ? (
                                <FlatList
                                    data={tanks}
                                    // ListEmptyComponent={() => (
                                    //   <EmptyBox text="No Tanks Found" color="orange" />
                                    // )}
                                    renderItem={({ item }) => {
                                        return (
                                            <TankCard
                                                onPress={() =>
                                                    navigate({
                                                        name: item.name,
                                                        id: item.id,
                                                    } as TankViewProp)
                                                }
                                                editTank={() =>
                                                    navigation.navigate(
                                                        "Settings"
                                                    )
                                                }
                                                tank={item}
                                            />
                                        );
                                    }}
                                    scrollEnabled={false}
                                />
                            ) : (
                                <PlaceHolderBox text="Your tanks will appear here!" />
                            )}
                        </ScrollView>
                    )}

                    {filter === "Pumps" && (
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={() => fetchData({})}
                                />
                            }
                            style={style.container}
                        >
                            {pumps?.length > 0 ? (
                                <FlatList
                                    data={pumps}
                                    renderItem={({ item }) => {
                                        return <PumpCard pump={item} />;
                                    }}
                                    scrollEnabled={false}
                                />
                            ) : (
                                <PlaceHolderBox text="No pumps connected!" />
                            )}
                        </ScrollView>
                    )}

                    {filter === "Meters" && (
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={() => fetchData({})}
                                />
                            }
                            style={style.container}
                        >
                            {meters?.length > 0 ? (
                                <FlatList
                                    data={meters}
                                    renderItem={({ item }) => {
                                        return <MeterCard meter={item} />;
                                    }}
                                    scrollEnabled={false}
                                />
                            ) : (
                                <PlaceHolderBox text="No water meters connected!" />
                            )}
                        </ScrollView>
                    )}
                </>
            )}
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
    },
});
