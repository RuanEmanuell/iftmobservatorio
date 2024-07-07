import React from 'react';
import { Text, View, SafeAreaView, ScrollView, Image, StyleSheet } from 'react-native';
import ContentPanel from '../components/contentPanel';
import HeaderIFTM from '../components/header';
import DSGovButton from '../components/button';

export default function HomeScreen({ route, navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <HeaderIFTM navigation={navigation} />
        <Text style={styles.title}>Bem vindo ao Observatório IFTM</Text>
        <ContentPanel
          image={require('../assets/obs.png')}
          label='OBSERVATÓRIO'
          content={
            <Text style={{ textAlign: 'justify', marginHorizontal: 7.5 }}>'O Observatório tem como principal objetivo o mapeamento das áreas de pesquisa, perfis de professores e elaboração de indicadores de pesquisa. O Observatório faz parte do Grupo de Pesquisa em Mineração da Dados e Imagens (MiDI) do IFTM Campus Avançado Uberaba Parque Tecnológico. As estatísticas são realizadas usando o currículo Lattes dos professores permanentes da instituição.'.</Text>
          }
        />
        <ContentPanel
          image={require('../assets/iftm.png')}
          label='IFTM'
          content={
            <Text style={{ textAlign: 'justify', marginHorizontal: 7.5 }}>O Instituto Federal de Educação, Ciência e Tecnologia do Triângulo Mineiro (IFTM) é composto, atualmente, pelos Campus Campina Verde, Ibiá, Ituiutaba, Paracatu, Patos de Minas, Patrocínio, Uberaba, Uberaba Parque Tecnológico, Uberlândia e Uberlândia Centro e pela Reitoria. A missão do IFTM é ofertar a Educação Profissional
              e Tecnológica por meio do Ensino, Pesquisa e Extensão.</Text>
          }
        />
        <ContentPanel
          label='ENTRE EM CONTATO'
          content={
            <Text style={{ textAlign: 'justify', marginHorizontal: 7.5 }}>Você pode entrar em contato com a equipe de desenvolvimento do Observatório
              IFTM para relatar problemas, deixar sugestões ou comentários. Basta enviar um email para o líder do projeto.</Text>
          }
        />
        <View style={styles.footer} />
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
