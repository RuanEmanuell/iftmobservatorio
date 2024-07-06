import { View, Text, Image } from "react-native";
import React from "react";
import { ActivityIndicator } from "react-native-paper";

interface panelProps {
    label: string,
    image?: any,
    text: string
}

export default function ContentPanel({ label, image, text }: panelProps) {
    return (
        <View style={{ height: 'auto', width: '95%', borderTopColor: 'green', borderTopWidth: 2, alignSelf: 'center', elevation: 2, marginVertical: 20}}>
            <View style={{ backgroundColor: '#f4f4f4', paddingVertical: 10, elevation: 2 }}>
                <Text style={{ fontWeight: 'bold', marginLeft: '5%' }}>
                    {label}
                </Text>
            </View>
            <View style={{display: 'flex', flexDirection: 'row', maxWidth: `${image ? '80%' : '100%'}`, paddingVertical: '2.5%'}}>
                {image ?
                <Image
                    source={image}
                    style={{ height: 60, width: 60, marginLeft: '5%', marginTop: '2.5%', objectFit: 'contain', alignSelf: 'center' }}
                />
                : <></>}
                <Text style = {{textAlign: 'justify', marginHorizontal: 7.5}}>
                  {text}
                </Text>
            </View>
        </View>
    )
}