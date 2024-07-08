import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, ScrollView, StyleSheet, View, Image, Modal, Pressable, TouchableOpacity, Dimensions } from 'react-native';
import ContentPanel from '../components/contentPanel';
import HeaderIFTM from '../components/header';
import { Picker } from '@react-native-picker/picker';
import DSGovLoadingCircle from '../components/loading';
import DSGovButton from '../components/button';
import { VictoryLegend, VictoryPie } from "victory-native";
import DSGovInput from '../components/input';

export default function TeacherScreen({ route, navigation }) {
    const [loading, setLoading] = useState(true);
    const [selectedCampusValue, setSelectedCampusValue] = useState('0');
    const [date, setDate] = useState('');
    const [teacherDateGraphData, setTeacherDateGraphData] = useState<any | null>(null);
    const [teacherTitleGraphData, setTeacherTitleGraphData] = useState<any | null>(null);
    const [originalTeacherList, setOriginalTeacherList] = useState<any | null>(null);
    const [teacherList, setTeacherList] = useState<any | null>(null);
    const [teacherCount, setTeacherCount] = useState('');
    const [teacherLattesCount, setTeacherLattesCount] = useState('');
    const [currentTeacherCount, setCurrentTeacherCount] = useState(20);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
    const [searchInputValue, setSearchInputValue] = useState('');

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

    async function fetchData(endpoint: string, fields: string[], setData1: (value: any) => void, setData2: (value: any) => void) {
        setLoading(true);
        try {
            const result = await fetch(`https://obsiftm.midi.upt.iftm.edu.br/api/Pesquisadores/${endpoint}?QualInstituicao=${selectedCampusValue}`);
            const data = await result.json();

            setOriginalTeacherList(data);
            setTeacherList(data);

            const filteredData = data.filter((item: any) => item[fields[0]] !== "null" && item[fields[1]] !== "null" && item[fields[2]] !== "null");

            const graduacaoCount = filteredData.length - filteredData.filter((item: any) => item[fields[1]] != null || item[fields[2]] != null).length;
            const mestradoCount = filteredData.filter((item: any) => item[fields[1]] !== null && item[fields[2]] == null).length;
            const doutoradoCount = filteredData.filter((item: any) => item[fields[2]] !== null).length;

            const titleGraphData = [
                { x: "Graduação", y: graduacaoCount },
                { x: "Mestrado", y: mestradoCount },
                { x: "Doutorado", y: doutoradoCount }
            ];

            setData1(titleGraphData);

            const possibleDates = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"]

            const lattesNoDateCount = filteredData.filter((item: any) => possibleDates.indexOf(item[fields[3]].substring(0, 4)) == -1).length;
            const lattes2018Count = filteredData.filter((item: any) => item[fields[3]].substring(0, 4) == "2018").length;
            const lattes2019Count = filteredData.filter((item: any) => item[fields[3]].substring(0, 4) == "2019").length;
            const lattes2020Count = filteredData.filter((item: any) => item[fields[3]].substring(0, 4) == "2020").length;
            const lattes2021Count = filteredData.filter((item: any) => item[fields[3]].substring(0, 4) == "2021").length;
            const lattes2022Count = filteredData.filter((item: any) => item[fields[3]].substring(0, 4) == "2022").length;
            const lattes2023Count = filteredData.filter((item: any) => item[fields[3]].substring(0, 4) == "2023").length;
            const lattes2024Count = filteredData.filter((item: any) => item[fields[3]].substring(0, 4) == "2024").length;

            const dateGraphData = [
                { x: "Sem Lattes", y: lattesNoDateCount },
                { x: "2018", y: lattes2018Count },
                { x: "2019", y: lattes2019Count },
                { x: "2020", y: lattes2020Count },
                { x: "2021", y: lattes2021Count },
                { x: "2022", y: lattes2022Count },
                { x: "2023", y: lattes2023Count },
                { x: "2024", y: lattes2024Count }
            ];

            setData2(dateGraphData);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function searchTeacher(){
        setTeacherList(originalTeacherList.filter(item => item['nome'].includes(searchInputValue.toLocaleUpperCase())));
    }

    async function selectTeacher(teacher: any) {
        setSelectedTeacher(teacher);
        setModalVisible(true);
    }

    useEffect(() => {
        fetchData(
            "ListaPesquisadores",
            ["graduacao", "mestrado", "doutorado", "dataAtualizacaoLattes"],
            setTeacherTitleGraphData,
            setTeacherDateGraphData
        );
        getTeacherCount();
        getLastDateLattes();
    }, []);

    useEffect(() => {
        fetchData(
            "ListaPesquisadores",
            ["graduacao", "mestrado", "doutorado", "dataAtualizacaoLattes"],
            setTeacherTitleGraphData,
            setTeacherDateGraphData
        );
        getTeacherCount();
        setCurrentTeacherCount(20);
    }, [selectedCampusValue]);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <HeaderIFTM showSubHeader={false} navigation={navigation} />
                {!loading && date && teacherCount != "" && teacherTitleGraphData ?
                    <View>
                        <Text style={styles.title}>Consulta de docentes</Text>
                        <View style={styles.dateInfoContainer}>
                            <Text style={styles.dateInfoText}>Dados extraídos da plataforma Lattes em </Text>
                            <Text style={styles.boldText}>{date}</Text>
                        </View>
                        <Text style={styles.title}>{campusMap[selectedCampusValue]}</Text>
                        <Text style={[styles.boldText, { marginLeft: '5%', marginTop: '5%' }]}>Número de docentes: {teacherCount}</Text>
                        <Text style={[styles.boldText, { marginLeft: '5%' }]}>Número de docentes com Lattes: {teacherLattesCount}</Text>
                        <ContentPanel label='PESQUISAR' content={
                            <View style={{ width: '100%' }}>
                                <Text style={{ marginLeft: '5%' }}>Escolha o campus: </Text>
                                <View style={[styles.pickerWrapper, { marginLeft: '5%', width: '90%', marginTop: 5 }]}>
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
                            </View>
                        } />
                        <ContentPanel label='TITULARIDADE' content={
                            <View style={styles.graphContainer}>
                                <VictoryPie
                                    width={windowWidth * 0.9}
                                    height={windowHeight * 0.4}
                                    labelRadius={110}
                                    labelPosition="centroid"
                                    data={teacherTitleGraphData}
                                    colorScale={["tomato", "orange", "gold"]}
                                    x="x"
                                    y="y"
                                    labels={({ datum }) => `${datum.x}: ${datum.y}`}
                                    style={{
                                        labels: {
                                            fill: "black",
                                            fontSize: 12,
                                            fontWeight: "bold",
                                            textAnchor: "middle",
                                        }
                                    }}
                                />
                                <VictoryLegend
                                    x={50}
                                    title="Títulos dos Docentes"
                                    centerTitle
                                    orientation="vertical"
                                    height={windowHeight * 0.2}
                                    style={{ title: { fontSize: 15, fontWeight: 'bold' } }}
                                    data={[
                                        { name: "Graduação", symbol: { fill: "tomato" } },
                                        { name: "Mestrado", symbol: { fill: "orange" } },
                                        { name: "Doutorado", symbol: { fill: "gold" } }
                                    ]}
                                />
                            </View>
                        } />
                        <ContentPanel label='DATA DA ÚLTIMA ATUALIZAÇÃO DO LATTES' content={
                            <View style={styles.graphContainer}>
                                <VictoryPie
                                    width={windowWidth * 0.9}
                                    height={windowHeight * 0.6}
                                    labelRadius={140}
                                    labelPosition="centroid"
                                    labels={({ datum }) => `${datum.y}`}
                                    style={{
                                        labels: {
                                            fill: "black",
                                            fontWeight: "bold",
                                            fontSize: 11
                                        }
                                    }}
                                    data={teacherDateGraphData}
                                    colorScale={["hotpink", "blue", "gold", "red", "deeppink", "purple", "navy", "deepskyblue"]}
                                    x="x"
                                    y="y"
                                />
                                <VictoryLegend
                                    x={50}
                                    title="Última atualização do Lattes dos Docentes"
                                    centerTitle
                                    orientation="vertical"
                                    height={windowHeight * 0.4}
                                    style={{ title: { fontSize: 15, fontWeight: 'bold' } }}
                                    data={[
                                        { name: "Sem Lattes", symbol: { fill: "hotpink" } },
                                        { name: "2018", symbol: { fill: "blue" } },
                                        { name: "2019", symbol: { fill: "gold" } },
                                        { name: "2020", symbol: { fill: "red" } },
                                        { name: "2021", symbol: { fill: "deeppink" } },
                                        { name: "2022", symbol: { fill: "purple" } },
                                        { name: "2023", symbol: { fill: "navy" } },
                                        { name: "2024", symbol: { fill: "deepskyblue" } },
                                    ]}
                                />
                            </View>
                        } />
                        <ContentPanel label='DOCENTES' content={
                            <View style={styles.teacherListContainer}>
                                <View style={styles.searchContainer}>
                                    <DSGovInput placeholder='Pesquisar...' width='66%' value={searchInputValue} onChangeText={(value) => { setSearchInputValue(value) }} />
                                    <View style={styles.searchButton}>
                                        <DSGovButton label='Pesquisar' primary onPress={searchTeacher} />
                                    </View>
                                </View>
                                <View style={styles.teacherList}>
                                    {teacherList.map((item: any, index: number) => (
                                        <Pressable key={index} onPress={() => { selectTeacher(item) }}>
                                            {index >= currentTeacherCount - 20 && index <= currentTeacherCount && (item['instituicaoID'] == selectedCampusValue || selectedCampusValue == "0") ?
                                                <View style={[styles.teacherItem, { backgroundColor: index % 2 == 0 ? 'lightgray' : 'white' }]}>
                                                    <Image
                                                        source={item['urlFoto'] == 'user.svg' ? require('../assets/user.svg') : { uri: item['urlFoto'] }}
                                                        style={styles.teacherImage}
                                                    />
                                                    <Text style={styles.teacherName}>{item['nome']}</Text>
                                                </View> : <></>}
                                        </Pressable>
                                    ))}
                                </View>
                                <View style={styles.pagination}>
                                    {currentTeacherCount > 20 ? <DSGovButton label='Página anterior' onPress={() => setCurrentTeacherCount(prev => prev - 20)} /> : <></>}
                                    {currentTeacherCount <= parseInt(teacherCount) ? <DSGovButton label='Próxima página' onPress={() => setCurrentTeacherCount(prev => prev + 20)} /> : <></>}
                                </View>
                            </View>
                        } />
                        {selectedTeacher ?
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                            >
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalOverlay}>
                                    <View style={styles.modalContent}>
                                        <Image
                                            source={selectedTeacher['urlFoto'] == 'user.svg' ? require('../assets/user.svg') : { uri: selectedTeacher['urlFoto'] }}
                                            style={styles.modalImage}
                                        />
                                        <Text style={styles.modalTitle}>{selectedTeacher['nome']}</Text>
                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.boldText}>EMAIL: </Text>
                                            <Text>{selectedTeacher['email'] ? selectedTeacher['email'] : 'Não consta'} </Text>
                                        </View>
                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.boldText}>GRADUAÇÃO: </Text>
                                            <Text>{selectedTeacher['graduacao'] ? selectedTeacher['graduacao'] : 'Não consta'}</Text>
                                        </View>
                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.boldText}>MESTRADO: </Text>
                                            <Text>{selectedTeacher['mestrado'] ? selectedTeacher['mestrado'] : 'Não consta'}</Text>
                                        </View>
                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.boldText}>DOUTORADO: </Text>
                                            <Text>{selectedTeacher['doutorado'] ? selectedTeacher['doutorado'] : 'Não consta'} </Text>
                                        </View>
                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.boldText}>DATA LATTES: </Text>
                                            <Text>{selectedTeacher['dataAtualizacaoLattes'] ? selectedTeacher['dataAtualizacaoLattes'] : 'Não consta'} </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Modal> : <></>}
    
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
    },
    dateInfoContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '5%',
    },
    dateInfoText: {
        marginLeft: '5%',
    },
    boldText: {
        fontWeight: 'bold',
    },
    boldTextWithMargin: {
        fontWeight: 'bold',
        marginTop: '2%',
        marginLeft: '5%',
    },
    pickerContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    pickerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: '2%',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginTop: '1%',
    },
    graphContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    teacherListContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    searchContainer: {
        flexDirection: 'row',
        margin: 10,
        justifyContent: 'center'
    },
    searchButton: {
        display: 'flex',
        marginHorizontal: 10,
        justifyContent: 'flex-start'
    },
    teacherList: {
        display: 'flex',
        flexDirection: 'column'
    },
    teacherListItems: {
        flexDirection: 'column',
        width: '80%'
    },
    teacherItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    teacherImage: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 25,
    },
    teacherName: {
        fontSize: 14,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInfoRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '66%',
        marginBottom: 5,
    },
});
