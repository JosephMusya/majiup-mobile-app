import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { color } from "../../theme/theme";
import { MaterialIcons } from "@expo/vector-icons";
// import { Consumption } from "../../types";
import { lineDataItem } from "react-native-gifted-charts";
const Chart = ({
  series,
  title,
  consumed,
  maxY,
  closeChart,
}: {
  series: lineDataItem[] | undefined;
  title: string;
  maxY: number | undefined;
  consumed?: number | undefined;
  closeChart?: () => void;
}) => {
  // Sample data
  // const data = [50, 10, 40, 95, 85, 91, 35, 53, 24, 50];
  // console.log(series[0]);
  return (
    <View style={styles.container}>
      {/* <Text>{title}</Text> */}
      <Text style={{ fontWeight: "500", color: color.primaryColor }}>
        {consumed?.toFixed(0)} Liters used in 1day
      </Text>
      <TouchableOpacity
        onPress={closeChart}
        style={{ position: "absolute", top: "2%", right: "2%" }}
      >
        <MaterialIcons name="minimize" size={24} color={color.primaryColor} />
      </TouchableOpacity>
      {series ? (
        <LineChart
          adjustToWidth
          noOfSections={10}
          scrollToEnd
          initialSpacing={100}
          width={Dimensions.get("window").width * 0.9}
          areaChart
          startFillColor1={"skyblue"}
          curved
          data={series}
          stepValue={maxY ? maxY / 4 : maxY}
          scrollAnimation
          // on={() => console.log("Pressed")}
          height={180}
          spacing={100}
          focusEnabled
          showTextOnFocus
          color1={color.primaryColor}
          dataPointsColor1={color.primaryColor}
          maxValue={maxY}
          isAnimated={true}
          animateOnDataChange={true}
          onlyPositive={true}
          thickness1={3}
          endOpacity1={0.8}
          roundToDigits={0}
          yAxisTextNumberOfLines={5}
          yAxisColor={"#fff"}
          xAxisColor={color.complementaryColor}
          yAxisTextStyle={{
            color: color.textColor,
          }}
          xAxisLabelTextStyle={{
            color: color.textColor,
          }}
          // rulesType="dotted"
          // xAxisTextNumberOfLines={10}
        />
      ) : (
        <Text>No data in the last 10 mins</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    gap: 5,
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 5,
    padding: 8,
  },
});

export default Chart;
