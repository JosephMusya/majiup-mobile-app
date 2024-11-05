import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { color, flex, fontSize } from "../../theme/theme";
import { Sensor, UserProfile, X } from "../../types";
import { Feather } from "@expo/vector-icons";

interface T extends X {
  onEdit: () => void;
}

export default function SettingsCard({
  name,
  id,
  meta,
  sensors,
  onEdit,
}: Partial<T>) {
  const WaterLevelSensor: Sensor | undefined = sensors?.find(
    (sensor: Sensor) => sensor.meta.kind === "WaterLevel"
  );

  return (
    <View style={[styles.container]}>
      <View
        style={[styles.flexSpace, { padding: 8, backgroundColor: "#d6d6d6" }]}
      >
        <View>
          <Text style={{ fontSize: fontSize.xlarge, fontWeight: "500" }}>
            {name}
          </Text>
          <Text style={{ fontSize: 10, color: "gray" }}>{id}</Text>
        </View>
        <TouchableOpacity onPress={onEdit}>
          <MaterialIcons name="edit" size={18} color="black" />
        </TouchableOpacity>
      </View>
      <View style={[styles.flexSpace, { padding: 8 }]}>
        <Text>Tank Capacity</Text>
        <Text>{meta?.settings.capacity} Liters</Text>
      </View>
      <View style={[styles.flexSpace, { padding: 8 }]}>
        <View style={[flex.row, { gap: 10 }]}>
          <Entypo name="location-pin" size={24} color="black" />
          <Text style={{ color: color.secondaryColor }}>Location</Text>
        </View>
        {meta?.profile.address ? (
          <Text>{meta?.profile.address}</Text>
        ) : (
          <Text style={{ color: color.secondaryColor }}>
            Add Location to this tank
          </Text>
        )}
      </View>

      {!sensors?.some?.(
        (sensor: Sensor) => sensor.meta.kind === "WaterLevel"
      ) ? (
        <View style={[flex.row, { gap: 5, padding: 8, alignItems: "center" }]}>
          <Feather
            name="alert-triangle"
            size={20}
            color={color.secondaryColor}
          />
          <Text style={{ color: color.secondaryColor }}>
            No majiup sensors detected
          </Text>
        </View>
      ) : (
        <View style={[{ padding: 8 }]}>
          <View style={{ gap: 10, flexDirection: "column" }}>
            <View style={[flex.row, { gap: 10 }]}>
              <MaterialIcons name="sensors" size={24} color="black" />
              <Text style={{ color: color.secondaryColor }}>
                Sensors connected
              </Text>
            </View>
            <View>
              <Text>{WaterLevelSensor?.name}</Text>
              {WaterLevelSensor?.meta.critical_max === 0 &&
                WaterLevelSensor.meta.critical_min === 0 && (
                  <Text style={{ color: "orange" }}>
                    <Text>
                      {WaterLevelSensor.name} alerts not configured properly
                    </Text>
                  </Text>
                )}
            </View>
            <View style={[styles.flexSpace]}>
              <Text>Max Alert</Text>
              <Text>{WaterLevelSensor?.meta?.critical_max}%</Text>
            </View>
            <View style={[styles.flexSpace]}>
              <Text>Min Alert</Text>
              <Text>{WaterLevelSensor?.meta?.critical_min}%</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
    borderRadius: 5,
    overflow: "hidden",
    borderColor: color.complementaryColor,
    borderWidth: 1,
  },
  flexSpace: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
