import { Alert } from "react-native";

type AlertProps = {
  title: string;
  message: string;
  cancelText: string;
  okText: string;
  onConfirm?: () => void;
};

export const showAlert = ({
  title,
  message,
  cancelText,
  okText,
  onConfirm,
}: AlertProps) =>
  Alert.alert(title, message, [
    {
      text: cancelText,
      style: "cancel",
    },
    {
      text: okText,
      style: "default",
      onPress: onConfirm,
    },
  ]);
