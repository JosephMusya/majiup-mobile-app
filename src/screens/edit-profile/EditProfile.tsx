import { View, Text, ScrollView, ToastAndroid } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "../../components/text-input/CustomTextInput";
import { Profile, UserProfile } from "../../types";
import { RouteProp, useRoute } from "@react-navigation/native";
import CustomButton from "../../components/button/Button";
import { color, flex } from "../../theme/theme";
import axios from "axios";
import { getBackendUrl } from "../../private/env";
import { useDeviceContext } from "../../providers/devices/DeviceProvider";
import { showAlert } from "../../utils/fx/alert";

export default function EditProfile({ navigation }: any) {
  type MyParamList = {
    Params: { profile: Profile };
  };

  const { ipAddress } = useDeviceContext();

  const backendUrl = getBackendUrl(ipAddress);

  const route = useRoute<RouteProp<MyParamList>>();

  const [updating, setUpdating] = useState<boolean>(false);

  const { updateProfile } = useDeviceContext();

  const profile = route.params.profile;

  const DefaultProfile: Profile = {
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    username: "",
    address: "",
  };

  const [updatedProfileInfo, setUpdatedProfileInfo] = useState<{
    profile: Profile;
  }>({
    profile: profile ?? DefaultProfile,
  });

  const handleChange = (e: React.ChangeEvent<any>, name: string) => {
    const { text } = e.nativeEvent as any;
    const value = String(text);
    // if ((profile as undefined) !== updatedProfileInfo) {
    //   setProfileChanged(true);
    // } else {
    //   setProfileChanged(false);
    // }

    const newProfile: Profile = {
      ...updatedProfileInfo.profile,
      [name]: value,
    };

    setUpdatedProfileInfo({
      profile: newProfile,
    });
  };

  const updateUserProfile = async () => {
    try {
      setUpdating(true);
      const sendUpdateReq = await axios.post(
        `${backendUrl}/gateway-profile`,
        updatedProfileInfo,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );
      if (sendUpdateReq.status === 200) {
        navigation.goBack();
        // setModalOpen(false);
        ToastAndroid.show("Profile updated", 2000);
        updateProfile(updatedProfileInfo.profile);
        // toast.success("Your profile has been updated");
      } else {
        // toast.error("Failed to update your profile");
        showAlert({
          title: "Error Updating Profile",
          message: "We encountered an error while saving your Profile",
          cancelText: "Close",
          okText: "",
        });
      }
    } catch (err) {
      // toast.error("Error updating user profile");
      showAlert({
        title: "Error Updating Profile",
        message: "We encountered an error while saving your Profile",
        cancelText: "Close",
        okText: "",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ScrollView style={{ padding: 8 }}>
      <View>
        <CustomTextInput
          label="First Name"
          value={updatedProfileInfo?.profile.first_name}
          onChange={(e) => handleChange(e, "first_name")}
        />
        <CustomTextInput
          label="Last Name"
          value={updatedProfileInfo?.profile?.last_name}
          onChange={(e) => handleChange(e, "last_name")}
        />
        <CustomTextInput
          label="Username"
          value={updatedProfileInfo?.profile?.username}
          onChange={(e) => handleChange(e, "username")}
        />
        <CustomTextInput
          label="phone"
          value={updatedProfileInfo?.profile?.phone}
          onChange={(e) => handleChange(e, "phone")}
          keyboard="name-phone-pad"
        />
        <CustomTextInput
          label="email"
          value={updatedProfileInfo?.profile?.email}
          onChange={(e) => handleChange(e, "email")}
        />
        <CustomTextInput
          label="Address"
          value={updatedProfileInfo?.profile?.address}
          onChange={(e) => handleChange(e, "address")}
        />
      </View>
      <View
        style={[flex.row, { justifyContent: "space-between", marginTop: 10 }]}
      >
        <CustomButton
          title={updating ? "Saving..." : "Save Changes"}
          color={color.primaryColor}
          width={150}
          onPress={() => updateUserProfile()}
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
