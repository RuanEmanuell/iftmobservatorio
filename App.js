import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './pages/home';
import IndicatorScreen from './pages/indicators';
import TeacherScreen from './pages/teacher';

export default function App() {
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='home'
                    component={HomeScreen}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name='indicator'
                    component={IndicatorScreen}
                    options={{ headerShown: true, title: 'Indicadores' }} />
                <Stack.Screen
                    name='teacher'
                    component={TeacherScreen}
                    options={{ headerShown: false, title: 'Docentes' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}