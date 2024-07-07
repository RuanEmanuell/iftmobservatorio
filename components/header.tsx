import { View, Text, StyleSheet, Image } from "react-native";
import React, { ReactNode } from "react";
import { ActivityIndicator } from "react-native-paper";
import DSGovButton from "./button";

export default function HeaderIFTM({ navigation }) {
    return (
        <>
            <View style={styles.header}>
                <Text style={styles.headerText}>IFTM - Uberaba Parque Tecnológico</Text>
                <Text style={[styles.headerText, { fontWeight: 'bold', fontSize: 24 }]}>Observatório IFTM</Text>
                <Text style={styles.headerText}>Ministério da Educação</Text>
            </View>
            <View style={styles.subHeader}>
                <Image source={require('../assets/obs.png')} style={styles.subHeaderImage} />
                <View style={styles.subHeaderTextContainer}>
                    <Text>bservatório</Text>
                    <Text style={{ fontWeight: 'bold' }}> IFTM</Text>
                </View>
                <DSGovButton label="Inicio" onPress={() => navigation.navigate('home')} />
                <DSGovButton label="Indicadores" onPress={() => navigation.navigate('indicator')} />
                <DSGovButton label="Docentes" onPress={() => navigation.navigate('teacher')} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'green',
        paddingVertical: 35,
        paddingHorizontal: '5%'
    },
    headerText: {
        color: 'white',
    },
    subHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '2.5%',
        borderBottomColor: 'lightgray',
        borderBottomWidth: 2
    },
    subHeaderImage: {
        height: 30,
        width: 30,
    },
    subHeaderTextContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    }
});
