import {
    View,
    Text,
    Modal,
    StyleSheet,
    ScrollView,
    Pressable,
    Dimensions,
} from "react-native";
import React from "react";
//   import { Color } from "../../theme/Theme";

export default function BottomSheet({
    children,
    isVisible = false,
    minHeight,
    maxHeight,
    onClose,
    ...props
}: {
    children: React.JSX.Element;
    isVisible: boolean;
    minHeight?: number;
    maxHeight?: number;
    onClose?: () => void;
    [key: string]: any;
}) {
    return (
        <Modal
            visible={isVisible}
            animationType="none"
            transparent={true}
            onRequestClose={onClose}
        >
            <Pressable
                onPress={onClose}
                style={[
                    styles.container,
                    {
                        minHeight:
                            minHeight ?? Dimensions.get("window").height * 0.45,
                    },
                ]}
            >
                <Pressable
                    style={[
                        styles.content,
                        {
                            minHeight:
                                minHeight ??
                                Dimensions.get("window").height * 0.45,
                            maxHeight:
                                maxHeight ??
                                Dimensions.get("window").height * 0.75,
                        },
                    ]}
                >
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        {children}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: `rgba(0,0,0,0.6)`,
    },
    content: {
        backgroundColor: "#fff",
        width: "100%",
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        position: "absolute",
        bottom: 0,
        overflow: "hidden",
    },
});
