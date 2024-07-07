import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, ScrollView, StyleSheet, View, Image } from 'react-native';
import ContentPanel from '../components/contentPanel';
import HeaderIFTM from '../components/header';
import { Picker } from '@react-native-picker/picker';
import DSGovLoadingCircle from '../components/loading';
import DSGovButton from '../components/button';

export default function TeacherScreen({ route, navigation }) {
    const [loading, setLoading] = useState(true);
    const [selectedCampusValue, setSelectedCampusValue] = useState('0');
    const [date, setDate] = useState("");
    const [teachers, setTeachers] = useState<any | null>(null);
    const [teacherList, setTeacherList] = useState<any | null>(null);
    const [teacherCount, setTeacherCount] = useState('');
    const [teacherLattesCount, setTeacherLattesCount] = useState('');
    const [currentTeacherCount, setCurrentTeacherCount] = useState(20);

    const campusMap = {
        "0": "Todos os Campi",
        "1": "Uberaba Parque Tecnológico",
        "2": "Uberaba",
        "3": "Campina Verde",
        "4": "Ituitaba",
        "5": "Paracatu",
        "6": "Patos de Minas",
        "7": "Patrocínio",
        "8": "Uberlândia",
        "9": "Uberlândia Centro"
    };

    async function getLastDateLattes() {
        setLoading(true);
        try {
            const result = await fetch("https://obsiftm.midi.upt.iftm.edu.br/api/Home/UltimaAtualizacaoLattes");
            const data = await result.json();
            setDate(data["data"]);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function getTeacherCount() {
        setLoading(true);
        setTeacherCount('');
        setTeacherLattesCount('');
        try {
            const result = await fetch(`https://obsiftm.midi.upt.iftm.edu.br/api/Pesquisadores/ListaPesquisadores?QualInstituicao=${selectedCampusValue}`);
            const data = await result.json();
            setTeacherCount(data.length);
            setTeacherLattesCount(data.filter((item) => item['lattesEndereco'] != "").length);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchData(endpoint: string, fields: string[], setData: (value: any) => void) {
        setLoading(true);
        try {
            const result = await fetch(`https://obsiftm.midi.upt.iftm.edu.br/api/Pesquisadores/${endpoint}?QualInstituicao=${selectedCampusValue}`);
            const data = await result.json();

            // console.log(`Data from ${endpoint}:`, data);

            setTeacherList(data);

            const formattedData = data.map(item => {
                let formattedItem = { ano: item.ano };
                fields.forEach(field => {
                    formattedItem[field] = item[field];
                });
                return formattedItem;
            });

            const groupedData = formattedData.reduce((acc, current) => {
                const year = current.ano;
                if (!acc[year]) {
                    acc[year] = fields.reduce((fieldAcc, field) => {
                        fieldAcc[field] = current[field];
                        return fieldAcc;
                    }, {});
                } else {
                    fields.forEach(field => {
                        acc[year][field] += current[field];
                    });
                }
                return acc;
            }, {});

            const finalData = Object.keys(groupedData).map(year => {
                let finalItem = { ano: year };
                fields.forEach(field => {
                    finalItem[field] = groupedData[year][field];
                });
                return finalItem;
            });

            // console.log(`Formatted data for ${endpoint}:`, finalData);

            setData(finalData);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData(
            "ListaPesquisadores",
            ["professorID", "nome", "email", "graduacao", "mestrado", "doutorado", "lattesEndereco", "idFotoLattes", "dataAtualizacaoLattes",
                "entradaInstituicao", "saidaInstituicao", "urlFoto", "pontos", "descricaoProducao", "instituicaoID", "instituicao"],
            setTeachers
        );
        getTeacherCount();
        getLastDateLattes();
    }, []);

    useEffect(() => {
        fetchData(
            "ListaPesquisadores",
            ["professorID", "nome", "email", "graduacao", "mestrado", "doutorado", "lattesEndereco", "idFotoLattes", "dataAtualizacaoLattes",
                "entradaInstituicao", "saidaInstituicao", "urlFoto", "pontos", "descricaoProducao", "instituicaoID", "instituicao"],
            setTeachers
        );
        getTeacherCount();
        setCurrentTeacherCount(20);
    }, [selectedCampusValue]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <HeaderIFTM showSubHeader={true} navigation={navigation} />
                {!loading && date && teacherCount != "" && teachers ?
                    <View>
                        <Text style={styles.title}>Consulta de decentes</Text>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text style={{ marginLeft: '5%' }}>Dados extraídos da plataforma Lattes em </Text>
                            <Text style={{ fontWeight: 'bold' }}>{date}</Text>
                        </View>
                        <Text style={styles.title}>{campusMap[selectedCampusValue]}</Text>
                        <Text style={{ fontWeight: 'bold', marginLeft: '5%', marginTop: '5%' }}>Número de docentes: {teacherCount}</Text>
                        <Text style={{ fontWeight: 'bold', marginLeft: '5%' }}>Número de docentes com Lattes: {teacherLattesCount}</Text>
                        <ContentPanel label='PESQUISAR' content={
                            <View style={{ width: '100%' }}>
                                <Text style={{ marginLeft: '5%' }}>Escolha o campus: </Text>
                                <View style={{ flex: 1, borderWidth: 2, borderColor: 'lightgray', marginLeft: '5%', width: '90%', marginTop: 5 }}>
                                    <Picker
                                        selectedValue={selectedCampusValue}
                                        onValueChange={(itemValue) =>
                                            setSelectedCampusValue(itemValue)
                                        }>
                                        <Picker.Item label="Todos os Campi" value="0" />
                                        <Picker.Item label="Campina Verde" value="3" />
                                        <Picker.Item label="Ituitaba" value="4" />
                                        <Picker.Item label="Paracatu" value="5" />
                                        <Picker.Item label="Patos de Minas" value="6" />
                                        <Picker.Item label="Patrocínio" value="7" />
                                        <Picker.Item label="Uberaba" value="2" />
                                        <Picker.Item label="Uberaba Parque Tecnológico" value="1" />
                                        <Picker.Item label="Uberlândia" value="8" />
                                        <Picker.Item label="Uberlândia Centro" value="9" />
                                    </Picker>
                                </View>
                            </View>} />
                        <ContentPanel label='DOCENTES' content={
                            <View style={{ flex: 1, backgroundColor: 'white' }}>
                                <View style={{ display: 'flex', flexDirection: 'column' }}>
                                    <View style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                        {teacherList.map((item: any, index: number) => (
                                            <>
                                                {index >= currentTeacherCount - 20 && index <= currentTeacherCount && (item['instituicaoID'] == selectedCampusValue || selectedCampusValue == "0")  ?
                                                    <View key={item['professorID']} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingVertical: 5, marginVertical: 5, elevation: 2, backgroundColor: index % 2 == 0 ? 'lightgray' : 'white' }} >
                                                        <Image
                                                            source={item['urlFoto'] == 'user.svg' ? require('../assets/user.svg') : { uri: item['urlFoto'] }}
                                                            style={{ width: 30, height: 30, objectFit: 'contain', borderRadius: 100}}
                                                        />
                                                        <Text style = {{marginLeft: 5}}>{item['nome']}</Text>
                                                    </View> : <></>}
                                            </>
                                        ))}
                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        {currentTeacherCount > 20 ? <DSGovButton label='Página anterior' onPress={() => setCurrentTeacherCount(prev => prev - 20)} /> : <></>}
                                        {currentTeacherCount <= parseInt(teacherCount) ? <DSGovButton label='Próxima página' onPress={() => setCurrentTeacherCount(prev => prev + 20)} /> : <></>}
                                    </View>
                                </View>
                            </View>
                        } />
                    </View>
                    : <DSGovLoadingCircle />}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flexGrow: 1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginTop: '5%',
    }
});
