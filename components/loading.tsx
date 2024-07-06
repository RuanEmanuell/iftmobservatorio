import { View } from "react-native";
import React from "react";
import { ActivityIndicator } from "react-native-paper";

export default function DSGovLoadingCircle() {
    return (
        <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
          <ActivityIndicator size='large' color='#1351B4' />
        </View>
    )
}