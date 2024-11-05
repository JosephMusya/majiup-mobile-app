import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  Tank,
  MetaInformation,
  Profile,
  Sensor,
  SensorAlert,
  X,
} from "../../types";
import { color, flex, fontSize } from "../../theme/theme";
import CustomTextInput from "../text-input/CustomTextInput";
import CustomButton from "../button/Button";
import axios from "axios";
import { getBackendUrl } from "../../private/env";
import { useDeviceContext } from "../../providers/devices/DeviceProvider";

export default function EditSettings({ navigation }: any) {
  type MyParamList = {
    Params: { tank: X; waterLevelSensor: Profile };
  };

  const { devices, ipAddress, setTanks } = useDeviceContext();

  const backendUrl = getBackendUrl(ipAddress);

  const [updating, setUpdating] = useState<boolean>(false);

  const route = useRoute<RouteProp<MyParamList>>();
  const { tank } = route.params;
  const waterLevelSensor: Sensor | undefined = tank.sensors?.find(
    (sensor: Sensor) => sensor.meta.kind === "WaterLevel"
  );
  const [selectedDevice, setSelectedDevice] = useState<Tank>();

  const Alt = {
    location: {
      cordinates: { latitude: 0, longitude: 0 },
      address: "",
    },
    notifications: selectedDevice?.notifications
      ? selectedDevice?.notifications
      : { messages: [] },
    receivenotifications: selectedDevice?.meta.receivenotifications ?? false,
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

  async function handeleSubmit() {
    setUpdating(true);
    const promises: any = [];
    // const rs = confirm(
    //   `Are you sure you want to save changes to ${changedMetaInfo.name}?`
    // );

    if (true) {
      if (selectedDevice?.name !== changedMetaInfo.name) {
        try {
          const nameUpdate = await axios.post(
            `${backendUrl}/tanks/${selectedDevice?.id}/name`,
            changedMetaInfo.name,
            {
              headers: {
                "Content-Type": "text/plain",
              },
            }
          );

          if (nameUpdate.status !== 200) {
            // toast.error("Failed to change tank name");
          }
          promises.push(nameUpdate);
        } catch (err) {
          console.error(err);
          // toast.error("Error occured changing tank name");
        }
      }

      if (
        selectedDevice?.sensors?.find(
          (sensor: Sensor) => sensor.meta.kind === "WaterLevel"
        )?.meta !== changedMetaInfo.waterlevelSensorAlert &&
        selectedDevice &&
        selectedDevice?.sensors?.some?.(
          (sensor: Sensor) => sensor.meta.kind === "WaterLevel"
        )
      ) {
        try {
          const sensorUpdate = await axios.post(
            `${backendUrl}/tanks/${selectedDevice.id}/tank-sensors/waterlevel/alerts`,
            changedMetaInfo.waterlevelSensorAlert
          );
          promises.push(sensorUpdate);

          if (sensorUpdate.status === 200) {
            // toast.error("Error updating tank alerts");
          } else {
          }
        } catch (err) {
          // ToastAndroid.show("Failed to update settings", 2000);
          // toast.error("Error updating tank alerts");
        }
      }

      try {
        const responseMetaData = await axios.post(
          `${backendUrl}/tanks/${selectedDevice?.id}/profile`,
          {
            ...changedMetaInfo.metaData,
            location: {
              cordinates: {
                latitude: changedMetaInfo.metaData.location.cordinates.latitude,
                longitude:
                  changedMetaInfo.metaData.location.cordinates.longitude,
              },
              address: changedMetaInfo.metaData.location.address,
            },
            settings: {
              capacity: parseFloat(
                changedMetaInfo.metaData.settings.capacity.toString()
              ),
              height: parseFloat(
                changedMetaInfo.metaData.settings.height.toString()
              ),
              offset: parseFloat(
                changedMetaInfo.metaData.settings.offset.toString()
              ),
            },
            receivenotifications: changedMetaInfo.metaData.receivenotifications,
            notifications: { ...selectedDevice?.meta.notifications },
            profile: changedMetaInfo.metaData.profile,
          }
        );

        if (responseMetaData.status !== 200) {
          // toast.error("Failed to update tank details");
        }
        promises.push(responseMetaData);
      } catch (err) {
        // toast.error("Error while updating tank");
      }

      Promise.all(promises)
        .then(() => {
          ToastAndroid.show("Settings updated", 2000);
          const device = devices.find(
            (device) => device.id === selectedDevice?.id
          );
          const waterlevelSensorPresent = device?.sensors?.find(
            (sensor) => sensor.meta.kind === "WaterLevel"
          ) as Sensor;

          if (device) {
            device.meta = changedMetaInfo.metaData;
            device.name = changedMetaInfo.name;
            if (waterlevelSensorPresent) {
              waterlevelSensorPresent.meta =
                changedMetaInfo.waterlevelSensorAlert;
            }

            setTanks([...devices]);
            navigation.goBack();
            // setSelectedDevice(undefined);
            // setIsOpenModal(false);
            // toast.success(`${device.name} has been updated`);
          } else {
            // setIsOpenModal(false);
            // setSelectedDevice(undefined);
          }
        })
        .catch((err) => {
          ToastAndroid.show("Failed to update settings", 2000);

          // setIsOpenModal(false);
          // setSelectedDevice(undefined);
        })
        .finally(() => {
          setUpdating(false);
        });
    }
  }

  function handleChange(e: React.ChangeEvent<any>, name: string) {
    const { text } = e.nativeEvent as any;
    const value = String(text);
    // console.log(value);
    // if (
    //   changedMetaInfo.metaData !== selectedDevice?.meta ||
    //   changedMetaInfo.name !== selectedDevice.name ||
    //   changedMetaInfo.waterlevelSensorAlert !==
    //     selectedDevice.sensors?.find(
    //       (sensor: Sensor) => sensor.meta.kind === "WaterLevel"
    //     )?.meta
    // ) {
    //   // setDeviceUpdated(true);
    // } else {
    //   // setDeviceUpdated(false);
    // }

    if (name === "name") {
      setChangedMetaInfo({
        ...changedMetaInfo,
        name: value,
      });
      return;
    } else if (name === "max_alert") {
      value
        ? setChangedMetaInfo({
            ...changedMetaInfo,
            waterlevelSensorAlert: {
              ...changedMetaInfo.waterlevelSensorAlert,
              critical_max: parseInt(value),
            },
          })
        : setChangedMetaInfo({
            ...changedMetaInfo,
            waterlevelSensorAlert: {
              ...changedMetaInfo.waterlevelSensorAlert,
              critical_max: 0,
            },
          });
      return;
    } else if (name === "min_alert") {
      value
        ? setChangedMetaInfo({
            ...changedMetaInfo,
            waterlevelSensorAlert: {
              ...changedMetaInfo.waterlevelSensorAlert,
              critical_min: parseInt(value),
            },
          })
        : setChangedMetaInfo({
            ...changedMetaInfo,
            waterlevelSensorAlert: {
              ...changedMetaInfo.waterlevelSensorAlert,
              critical_min: 0,
            },
          });
      return;
    } else {
      setChangedMetaInfo({
        ...changedMetaInfo,
        metaData: {
          ...changedMetaInfo.metaData,
          location: {
            ...changedMetaInfo.metaData.location,
            cordinates: {
              ...changedMetaInfo.metaData.location.cordinates,
              [name]: value,
            },
            [name]: value,
          },
          settings: {
            ...changedMetaInfo.metaData.settings,
            [name]: value,
          },
          profile: {
            ...changedMetaInfo.metaData.profile,
            [name]: value,
          },
        },
      });
      return;
    }
  }

  const sensorPresent = selectedDevice?.sensors?.some((sensor: Sensor) => {
    sensor.meta.kind === "WaterLevel";
  });

  useEffect(() => {
    setSelectedDevice(tank);
    setChangedMetaInfo({
      name: tank.name,
      metaData: tank.meta,
      waterlevelSensorAlert: waterLevelSensor?.meta ?? DefaultAlerts,
    });
  }, [tank.id]);

  return (
    <ScrollView style={[style.container]}>
      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: fontSize.large, fontWeight: "bold" }}>
          Tank Settings
        </Text>
        <CustomTextInput
          value={changedMetaInfo?.name}
          placeholder="Tank Name"
          label="Tank Name"
          required={true}
          onChange={(e: any) => handleChange(e, "name")}
        />
        <CustomTextInput
          value={changedMetaInfo?.metaData.settings.capacity}
          keyboard="numeric"
          placeholder="Tank Capacity in Liters"
          label="Tank Capacity (Liters)"
          required={true}
          onChange={(e: any) => handleChange(e, "capacity")}
        />
        <CustomTextInput
          value={changedMetaInfo?.metaData.settings.height}
          keyboard="numeric"
          placeholder="Tank Height"
          label="Tank Height (mm)"
          required={true}
          onChange={(e: any) => handleChange(e, "height")}
        />
        <CustomTextInput
          value={changedMetaInfo?.metaData.settings.offset}
          keyboard="numeric"
          placeholder="Tank offset"
          label="Tank offset (mm)"
          required={true}
          onChange={(e: any) => handleChange(e, "offset")}
        />
        {/* <CustomTextInput value={tank.meta} />
        <CustomTextInput value={tank.offset} /> */}
      </View>

      <Text
        style={{
          fontSize: fontSize.large,
          fontWeight: "bold",
          paddingTop: 15,
          paddingBottom: 4,
        }}
      >
        Custom Tank Alerts
      </Text>
      <CustomTextInput
        value={changedMetaInfo?.waterlevelSensorAlert.critical_max}
        keyboard="numeric"
        label="Tank Filled Alert (%)"
        required={true}
        onChange={(e: any) => handleChange(e, "max_alert")}
        disabled={waterLevelSensor ? false : true}
      />
      <CustomTextInput
        value={changedMetaInfo?.waterlevelSensorAlert.critical_min}
        keyboard="numeric"
        label="Tank Empty  Alert (%)"
        required={true}
        onChange={(e: any) => handleChange(e, "min_alert")}
        disabled={waterLevelSensor ? false : true}
      />
      <Text
        style={{
          fontSize: fontSize.large,
          fontWeight: "bold",
          paddingTop: 15,
          paddingBottom: 4,
        }}
      >
        Tank Address
      </Text>
      <CustomTextInput
        value={changedMetaInfo.metaData.location.address}
        placeholder="Tank location/address."
        label="Tank Address"
        required={true}
        onChange={(e: any) => handleChange(e, "address")}
      />

      <View
        style={[flex.row, { justifyContent: "space-between", marginTop: 10 }]}
      >
        <CustomButton
          title={updating ? "Saving..." : "Save Changes"}
          color={color.primaryColor}
          width={150}
          onPress={() => handeleSubmit()}
        />
        <CustomButton
          title="Cancel"
          color="gray"
          width={150}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    padding: 8,
  },
});
