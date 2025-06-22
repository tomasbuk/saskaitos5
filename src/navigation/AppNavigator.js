// FILE: src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import { colors } from '../utils/styles';

import StartScreen from '../screens/StartScreen';
import AddInvoiceScreen from '../screens/AddInvoiceScreen';
import AddDraftInvoiceScreen from '../screens/AddDraftInvoiceScreen';
import ReceivedInvoicesScreen from '../screens/ReceivedInvoicesScreen';
import DraftInvoicesScreen from '../screens/DraftInvoicesScreen';
import CashRegisterScreen from '../screens/CashRegisterScreen'; // Importuojame
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const stackScreenOptions = { header: (props) => <CustomHeader {...props} /> };

function StartStack() { /* ... nepakitęs kodas ... */ }
function ReceivedInvoicesStack() { /* ... nepakitęs kodas ... */ }
function DraftInvoicesStack() { /* ... nepakitęs kodas ... */ }

// PATAISYMAS: Grąžiname CashRegisterStack
function CashRegisterStack() {
    return (
        <Stack.Navigator screenOptions={stackScreenOptions}>
            <Stack.Screen name="CashRegister" component={CashRegisterScreen} options={{ title: 'Kasa' }} />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    // PATAISYMAS: Grąžiname "Kasa" ikoną
                    const icons = { 'Pradžia': '🏠', 'Gautos': '📄', 'Išrašomos': '🖊️', 'Kasa': '💰', 'Nustatymai': '⚙️' };
                    return <Text style={{ fontSize: focused ? 28 : 24, color: focused ? colors.primary : 'gray' }}>{icons[route.name]}</Text>;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border }
            })}
        >
            <Tab.Screen name="Pradžia" component={StartStack} />
            <Tab.Screen name="Gautos" component={ReceivedInvoicesStack} />
            <Tab.Screen name="Išrašomos" component={DraftInvoicesStack} />
            {/* PATAISYMAS: Grąžiname "Kasa" skiltį */}
            <Tab.Screen name="Kasa" component={CashRegisterStack} />
            <Tab.Screen name="Nustatymai" component={SettingsScreen} />
        </Tab.Navigator>
    );
}