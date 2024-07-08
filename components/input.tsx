import { TextInput } from "react-native";
import React from "react";

interface inputProps {
    onChangeText: (arg: string) => any,
    secureTextEntry?: boolean,
    placeholder: string,
    value: string,
    multiline?: boolean,
    textAlign?: string,
    width?: string
}

export default function DSGovInput({ onChangeText, secureTextEntry, placeholder, value, multiline, textAlign, width }: inputProps) {
    return (
        <TextInput
            value={value}
            placeholder={placeholder}
            onChangeText={text => onChangeText(text)}
            secureTextEntry={secureTextEntry ? secureTextEntry : false}
            multiline={multiline ? multiline : false}
            style={{
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 5,
                color: 'black',
                fontSize: 20,
                fontWeight: 'bold',
                width: width ? width: '75%',
                height: multiline ? 'auto' : 48,
                minHeight: multiline ? 72 : 48,
                marginVertical: 16,
                paddingHorizontal: 8,
                textAlign: textAlign ? textAlign : 'start'
            }}></TextInput>
    )
}