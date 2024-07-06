import { Pressable, Text } from "react-native";
import React from "react";

interface buttonProps {
    onPress: (arg?: any) => any,
    label: string,
    primary?: boolean,
    secondary?: boolean,
    block?: boolean
}

export default function DSGovButton({ onPress, label, primary, secondary, block }: buttonProps) {
    return (
        <Pressable style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 24,
            marginVertical: 16,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            //ESTILOS BASEADOS EM PROPS
            backgroundColor: primary ? '#1351B4' : 'white',
            borderWidth: secondary ? 2 : 0,
            borderColor: secondary ? '#1351B4' : 'white',
            width: block ? '100%' : 'auto',
        }}>
            <Text style={{ color: primary ? 'white' : '#1351B4', fontWeight: 'bold' }} onPress={onPress}>{label}</Text>
        </Pressable>
    )
}