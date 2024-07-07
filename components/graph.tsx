import { View, Text } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";
import { VictoryChart, VictoryTheme, VictoryAxis, VictoryStack, VictoryBar } from "victory-native";
import ContentPanel from "./contentPanel";

interface InfoGraphProps{
    label : string,
    graphTitle: string,
    tickValues: number[],
    tickFormat: string[],
    graphColor: any,
    data: any,
    x: string,
    y: string,
    pickerValue: string,
    setPickerValue: (value: any) => void,
    pickerItemLabels: string[],
    pickerItemValues: string[]
}

export default function InfoGraph(infoGraphProps : InfoGraphProps) {
    return (
        <ContentPanel label={infoGraphProps.label} content={
            <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center' }}>{infoGraphProps.graphTitle}</Text>
                <VictoryChart
                    domainPadding={20}
                    theme={VictoryTheme.material}
                >
                    <VictoryAxis
                        tickValues={[1, 2, 3, 4, 5, 6, 7]}
                        tickFormat={["2018", "2019", "2020", "2021", "2022", "2023", "2024"]}
                    />
                    <VictoryAxis
                        dependentAxis
                        tickFormat={(x) => (x)}
                    />
                    <VictoryStack>
                        <VictoryBar
                            colorScale={infoGraphProps.graphColor}
                            data={infoGraphProps.data}
                            x={infoGraphProps.x}
                            y={infoGraphProps.y}
                            barWidth={20}
                        />
                    </VictoryStack>
                </VictoryChart>
                <Picker
                        selectedValue={infoGraphProps.pickerValue}
                        onValueChange={(itemValue) =>
                            infoGraphProps.setPickerValue(itemValue)
                        }>
                        {infoGraphProps.pickerItemLabels.map((label, index) => <Picker.Item key={index} label={label} value={infoGraphProps.pickerItemValues[index]} />)}
                    </Picker>
            </View>}/>
    )
}