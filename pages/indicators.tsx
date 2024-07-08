import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import ContentPanel from '../components/contentPanel';
import HeaderIFTM from '../components/header';
import DSGovLoadingCircle from '../components/loading';
import { Picker } from '@react-native-picker/picker';
import InfoGraph from '../components/graph';

export default function IndicatorScreen({ route, navigation }) {
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState("");
    const [bibliographicProduction, setBibliographicProduction] = useState<any | null>(null);
    const [orientation, setOrientation] = useState<any | null>(null);
    const [inovation, setInovation] = useState<any | null>(null);
    const [selectedBibliographicTypeValue, setSelectedBibliographicTypeValue] = useState('eventoArtigoCompleto');
    const [selectedOrientationTypeValue, setSelectedOrientationTypeValue] = useState('iniciacaoCientifica');
    const [selectedInovationTypeValue, setSelectedInovationTypeValue] = useState('registroSoftware');
    const [selectedCampusValue, setSelectedCampusValue] = useState('0');
    const [teacherCount, setTeacherCount] = useState('');
    const [teacherLattesCount, setTeacherLattesCount] = useState('');

    const campusMap = {
        "0": "Todos os Campi",
        "1": "Uberaba Parque Tecnológico",
        "2": "Uberaba",
        "3": "Campina Verde",
        "4": "Ituituba",
        "5": "Paracatu",
        "6": "Patos de Minas",
        "7": "Patrocínio",
        "8": "Uberlândia",
        "9": "Uberlândia Centro"
    }

    const bibliographicGraphTypeMap = {
        "eventoArtigoCompleto": "Artigo completo em Evento",
        "eventoArtigoResumo": "Resumo em Evento",
        "revistaArtigo": "Artigo em Periódico",
        "capituloLivro": "Capítulo de livro",
        "livro": "Livro"
    }

    const orientationTypeMap = {
        "iniciacaoCientifica": "Iniciação Científica",
        "tccGraduacao": "TCC - Graduação",
        "tccEspecializacao": "TCC - Especialização",
        "mestrado": "Mestrado",
        "doutorado": "Doutorado"
    }
    
    const inovationTypeMap = {
        "registroSoftware": "Software (Outro Registro)",
        "registroSoftwareINPI": "Software (Registro no INPI)",
        "patente": "Patente (Outro Registro)",
        "patenteINPI": "Patente (Registro no INPI)"
    }

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
            const result = await fetch(`https://obsiftm.midi.upt.iftm.edu.br/api/Indicadores/${endpoint}?QualInstituicao=${selectedCampusValue}`);
            const data = await result.json();

            console.log(`Data from ${endpoint}:`, data);

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

            console.log(`Formatted data for ${endpoint}:`, finalData);

            setData(finalData);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData(
            "ProducaoBibliografica",
            ["eventoArtigoCompleto", "eventoArtigoResumo", "revistaArtigo", "capituloLivro", "livro"],
            setBibliographicProduction
        );
        fetchData(
            "Orientacao",
            ["iniciacaoCientifica", "tccGraduacao", "tccEspecializacao", "mestrado", "doutorado"],
            setOrientation
        );
        fetchData(
            "Patente",
            ["registroSoftware", "registroSoftwareINPI", "patente", "patenteINPI"],
            setInovation
        );
        getTeacherCount();
        getLastDateLattes();
    }, []);

    useEffect(() => {
        fetchData(
            "ProducaoBibliografica",
            ["eventoArtigoCompleto", "eventoArtigoResumo", "revistaArtigo", "capituloLivro", "livro"],
            setBibliographicProduction
        );
        fetchData(
            "Orientacao",
            ["iniciacaoCientifica", "tccGraduacao", "tccEspecializacao", "mestrado", "doutorado"],
            setOrientation
        );
        fetchData(
            "Patente",
            ["registroSoftware", "registroSoftwareINPI", "patente", "patenteINPI"],
            setInovation
        );
        getTeacherCount();
    }, [selectedCampusValue]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <HeaderIFTM showSubHeader={false} navigation={navigation} />
                {
                    !loading && date !== "" && teacherCount !== "" && bibliographicProduction && orientation && inovation ?
                        <View>
                            <Text style={styles.title}>Indicadores por Campus</Text>
                            <View style={styles.dateInfo}>
                                <Text style={styles.dateLabel}>Dados extraídos da plataforma Lattes em </Text>
                                <Text style={styles.dateValue}>{date}</Text>
                            </View>
                            <ContentPanel label='PESQUISAR' content={
                                <View style={styles.pickerContainer}>
                                    <Text style={styles.pickerLabel}>Escolha o campus: </Text>
                                    <View style={styles.pickerWrapper}>
                                        <Picker
                                            selectedValue={selectedCampusValue}
                                            onValueChange={(itemValue) => setSelectedCampusValue(itemValue)}
                                        >
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
                                </View>
                            } />
                            <Text style={styles.title}>Indicadores - {campusMap[selectedCampusValue]}</Text>
                            <Text style={styles.teacherInfo}>Número de docentes: {teacherCount}</Text>
                            <Text style={styles.teacherInfo}>Número de docentes com Lattes: {teacherLattesCount}</Text>
                            <Text style={styles.observation}>Observação: Os dados da estatística são relacionados ao docentes permanentes da Instituição. Com isso, alguns dados podem estar vinculados ao docente e não à Instituição.</Text>
                            <InfoGraph
                                label='PRODUÇÃO BIBLIOGRÁFICA'
                                graphTitle={`Quantidade x Anos - ${bibliographicGraphTypeMap[selectedBibliographicTypeValue]}`}
                                tickValues={[1, 2, 3, 4, 5, 6, 7]}
                                tickFormat={["2018", "2019", "2020", "2021", "2022", "2023", "2024"]}
                                graphColor={"warm"}
                                data={bibliographicProduction}
                                x="ano"
                                y={selectedBibliographicTypeValue}
                                pickerValue={selectedBibliographicTypeValue}
                                setPickerValue={(value) => setSelectedBibliographicTypeValue(value)}
                                pickerItemLabels={["Artigo completo em Evento", "Resumo em Evento", "Artigo em Periódico", "Capítulo de livro", "Livro"]}
                                pickerItemValues={["eventoArtigoCompleto", "eventoArtigoResumo", "revistaArtigo", "capituloLivro", "livro"]}
                            />
                            <InfoGraph
                                label='ORIENTAÇÕES CONCLUÍDAS'
                                graphTitle={`Quantidade x Anos - ${orientationTypeMap[selectedOrientationTypeValue]}`}
                                tickValues={[1, 2, 3, 4, 5, 6, 7]}
                                tickFormat={["2018", "2019", "2020", "2021", "2022", "2023", "2024"]}
                                graphColor={"blue"}
                                data={orientation}
                                x="ano"
                                y={selectedOrientationTypeValue}
                                pickerValue={selectedOrientationTypeValue}
                                setPickerValue={(value) => setSelectedOrientationTypeValue(value)}
                                pickerItemLabels={["Iniciação Científica", "TCC - Graduação", "TCC - Especialização", "Mestrado", "Doutorado"]}
                                pickerItemValues={["iniciacaoCientifica", "tccGraduacao", "tccEspecializacao", "mestrado", "doutorado"]}
                            />
                            <InfoGraph
                                label='REGISTRO DE SOFTWARE E PATENTES'
                                graphTitle={`Quantidade x Anos - ${inovationTypeMap[selectedInovationTypeValue]}`}
                                tickValues={[1, 2, 3, 4, 5, 6, 7]}
                                tickFormat={["2018", "2019", "2020", "2021", "2022", "2023", "2024"]}
                                graphColor={"green"}
                                data={inovation}
                                x="ano"
                                y={selectedInovationTypeValue}
                                pickerValue={selectedInovationTypeValue}
                                setPickerValue={(value) => setSelectedInovationTypeValue(value)}
                                pickerItemLabels={["Software (Outro Registro)", "Software (Registro no INPI)", "Patente (Outro Registro)", "Patente (Registro no INPI)"]}
                                pickerItemValues={["registroSoftware", "registroSoftwareINPI", "patente", "patenteINPI"]}
                            />
                        </View> : <DSGovLoadingCircle />
                }
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
    },
    dateInfo: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '5%',
    },
    dateLabel: {
        marginLeft: '5%',
    },
    dateValue: {
        fontWeight: 'bold',
    },
    pickerContainer: {
        width: '100%',
    },
    pickerLabel: {
        marginLeft: '5%',
    },
    pickerWrapper: {
        flex: 1,
        borderWidth: 2,
        borderColor: 'lightgray',
        marginLeft: '5%',
        width: '90%',
        marginTop: 5,
    },
    teacherInfo: {
        fontWeight: 'bold',
        marginLeft: '5%',
        marginTop: '5%',
    },
    observation: {
        marginLeft: '5%',
    }
});
