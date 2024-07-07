import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import ContentPanel from '../components/contentPanel';
import HeaderIFTM from '../components/header';
import DSGovLoadingCircle from '../components/loading';
import { Picker } from '@react-native-picker/picker';
import { VictoryChart, VictoryTheme, VictoryBar, VictoryAxis, VictoryStack } from 'victory-native';

export default function IndicatorScreen({ route, navigation }) {
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState("");
    const [bibliographicProduction, setBibliographicProduction] = useState<any | null>(null);
    const [selectedValue, setSelectedValue] = useState('3');

    async function getLastDateLattes() {
        setLoading(true);
        try {
            const result = await fetch("https://obsiftm.midi.upt.iftm.edu.br/api/Home/UltimaAtualizacaoLattes");
            const data = await result.json();
            setDate(data["data"]);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    async function getBibliographicProduction() {
        setLoading(true);
        try {
            const result = await fetch(`https://obsiftm.midi.upt.iftm.edu.br/api/Indicadores/ProducaoBibliografica?QualInstituicao=${selectedValue}`);
            const data = await result.json();
            
            // Mapear os dados para o formato necessário para VictoryBar
            const formattedData = data.map(item => ({
                ano: item.ano,
                revistaArtigo: item.revistaArtigo
            }));
    
            // Agrupar os dados por ano (se necessário)
            // Isso é útil se você tiver várias entradas por ano e quiser somar ou consolidar esses valores
            const groupedData = formattedData.reduce((acc, current) => {
                const year = current.ano;
                if (!acc[year]) {
                    acc[year] = current.revistaArtigo;
                } else {
                    acc[year] += current.revistaArtigo;
                }
                return acc;
            }, {});
    
            // Formatar os dados em um array de objetos para cada ano
            const finalData = Object.keys(groupedData).map(year => ({
                ano: year,
                revistaArtigo: groupedData[year]
            }));
    
            setBibliographicProduction(finalData);
            console.log(finalData);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }
    useEffect(() => {
        getBibliographicProduction();
        getLastDateLattes();
    }, []);

    useEffect(() => {
        getBibliographicProduction();
    }, [selectedValue]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <HeaderIFTM navigation={navigation} />
                {
                    !loading && date !== "" && bibliographicProduction ?
                        <View>
                            <Text style={styles.title}>Indicadores por Campus</Text>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Text style={{ marginLeft: '5%' }}>Dados extraídos da plataforma Lattes em </Text>
                                <Text style={{ fontWeight: 'bold' }}>{date}</Text>
                            </View>
                            <ContentPanel label='PESQUISAR' content={
                                <View style={{ width: '100%' }}>
                                    <Text style={{ marginLeft: '5%' }}>Escolha o campus: </Text>
                                    <View style={{ flex: 1, borderWidth: 2, borderColor: 'lightgray', marginLeft: '5%', width: '90%', marginTop: 5 }}>
                                        <Picker
                                            selectedValue={selectedValue}
                                            onValueChange={(itemValue) =>
                                                setSelectedValue(itemValue)
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
                            <Text style={styles.title}>Indicadores - Todos os Campi</Text>
                            {bibliographicProduction && bibliographicProduction.instituicao && (
                                <>
                                    <Text style={{ fontWeight: 'bold', marginLeft: '5%', marginTop: '5%' }}>Número de docentes: {bibliographicProduction.instituicao.quantidadeProfessores}</Text>
                                    <Text style={{ fontWeight: 'bold', marginLeft: '5%' }}>Número de docentes com Lattes: {bibliographicProduction.instituicao.quantidadeProfessoresLattes}</Text>
                                    <Text style={{ marginLeft: '5%' }}>Observação: Os dados da estatística são relacionados ao docentes permanentes da Instituição. Com isso, alguns dados podem estar vinculados ao docente e não à Instituição.</Text>
                                </>
                            )}
                            <ContentPanel label='PRODUÇÃO BIBLIOGRÁFICA' content={
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center' }}>Quantidade x Anos - Artigo em periódico</Text>
                                    <Text style={{ marginLeft: '5%', marginTop: '5%' }}>Clique no tipo de produção para inserir ou remover a seleção:</Text>
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
                                        <VictoryStack colorScale={"qualitative"}>
                                            <VictoryBar
                                                colorScale={"warm"}
                                                data={bibliographicProduction}
                                                x="ano"
                                                y="revistaArtigo"
                                                barWidth={20}
                                            />
                                        </VictoryStack>
                                    </VictoryChart>
                                </View>
                            } />
                            <View style={styles.footer} />
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
    footer: {
        backgroundColor: 'green',
        paddingVertical: 20,
    },
});
