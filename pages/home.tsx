import { Text, View, SafeAreaView, Dimensions, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import ContentPanel from '../components/contentPanel';

export default function HomeScreen({ route, navigation }) {
  return (
    <ScrollView contentContainerStyle={{ backgroundColor: '#fff' }}>
      <SafeAreaView>
        <View style={{ backgroundColor: "green", height: 'auto', width: '100%', display: 'flex', justifyContent: 'center', paddingVertical: 30 }}>
          <Text style={{ color: "white", marginLeft: '5%' }}>IFTM - Uberaba Parque Tecnológico</Text>
          <Text style={{ color: "white", marginLeft: '5%', fontWeight: 'bold', fontSize: 24 }}>Observatório IFTM</Text>
          <Text style={{ color: "white", marginLeft: '5%' }}>Ministério da Educação</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', elevation: 1, paddingVertical: '2.5%' }}>
          <Image
            source={require('../assets/obs.png')}
            style={{ height: 30, width: 30, marginLeft: '5%' }}
          />
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text>bservatório</Text>
            <Text style={{ fontWeight: 'bold' }}> IFTM</Text>
          </View>
        </View>
        <Text style={{ fontWeight: 'bold', fontSize: 24, textAlign: 'center', marginTop: '5%' }}>Bem vindo ao Observatório IFTM</Text>
        <ContentPanel
          image={require('../assets/obs.png')}
          label='OBSERVATÓRIO'
          text='O Observatório tem como principal objetivo o mapeamento das áreas de pesquisa, perfis de professores e elaboração de indicadores de
                    pesquisa. O Observatório faz parte do Grupo de Pesquisa em Mineração da Dados e Imagens (MiDI) do IFTM Campus Avançado Uberaba Parque
                    Tecnológico. As estatísticas são realizadas usando o currículo Lattes dos professores permanentes da instituição.'/>
        <ContentPanel
          image={require('../assets/iftm.png')}
          label='IFTM'
          text=' O Instituto Federal de Educação, Ciência e Tecnologia do Triângulo Mineiro (IFTM) é composto, atualmente, pelos Campus Campina Verde, Ibiá, 
          Ituiutaba, Paracatu, Patos de Minas, Patrocínio, Uberaba, Uberaba Parque Tecnológico, Uberlândia e Uberlândia Centro e pela Reitoria. A missão do IFTM 
          é ofertar a Educação Profissional e Tecnológica por meio do Ensino, Pesquisa e Extensão.' />
        <ContentPanel
          label='ENTRE EM CONTATO'
          text='Você pode entrar em contato com a equipe de desenvolvimento do Observatório IFTM para relatar problemas, deixar sugestões ou comentários.
           Basta enviar um email para o líder do projeto.' />
        <View style={{ backgroundColor: "green", height: 'auto', width: '100%', display: 'flex', justifyContent: 'center', paddingVertical: 20 }}>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
