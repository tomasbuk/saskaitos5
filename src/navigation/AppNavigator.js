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
import CashRegisterScreen from '../screens/CashRegisterScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsDashboardScreen from '../screens/settings/SettingsDashboardScreen';
import BalanceSettingsScreen from '../screens/settings/BalanceSettingsScreen';
import PartnerListScreen from '../screens/settings/PartnerListScreen';
import GeneralSettingsScreen from '../screens/settings/GeneralSettingsScreen';
import DangerZoneScreen from '../screens/settings/DangerZoneScreen';
import ImportScreen from '../screens/settings/ImportScreen';
import ZReportImportScreen from '../screens/settings/ZReportImportScreen';
import ClassifierTabNavigator from './ClassifierTabNavigator';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const stackScreenOptions = { header: (props) => <CustomHeader {...props} /> };

function StartStack() { return ( <Stack.Navigator screenOptions={stackScreenOptions}><Stack.Screen name="Start" component={StartScreen} options={{ title: 'Pradžia' }} /><Stack.Screen name="AddInvoice" component={AddInvoiceScreen} options={{ title: 'Nauja Gauta Sąskaita' }} /><Stack.Screen name="AddDraftInvoice" component={AddDraftInvoiceScreen} options={{ title: 'Nauja Išrašoma Sąskaita' }} /></Stack.Navigator> ); }
function ReceivedInvoicesStack() { return ( <Stack.Navigator screenOptions={stackScreenOptions}><Stack.Screen name="ReceivedInvoices" component={ReceivedInvoicesScreen} options={{ title: 'Gautos Sąskaitos' }} /></Stack.Navigator> ); }
function DraftInvoicesStack() { return ( <Stack.Navigator screenOptions={stackScreenOptions}><Stack.Screen name="DraftInvoices" component={DraftInvoicesScreen} options={{ title: 'Išrašomos Sąskaitos' }} /></Stack.Navigator> ); }
function CashRegisterStack() { return ( <Stack.Navigator screenOptions={stackScreenOptions}><Stack.Screen name="CashRegister" component={CashRegisterScreen} options={{ title: 'Kasa' }} /></Stack.Navigator> ); }
function ReportsStack() { return ( <Stack.Navigator screenOptions={stackScreenOptions}><Stack.Screen name="Reports" component={ReportsScreen} options={{ title: 'Ataskaitos' }} /></Stack.Navigator> ); }

function SettingsStack() {
    return (
        <Stack.Navigator screenOptions={stackScreenOptions}>
            <Stack.Screen name="SettingsDashboard" component={SettingsDashboardScreen} options={{ title: 'Visi Nustatymai' }}/>
            <Stack.Screen name="BalanceSettings" component={BalanceSettingsScreen} options={{ title: 'Likučių Valdymas' }} />
            <Stack.Screen name="PartnerLists" component={PartnerListScreen} options={{ title: 'Partnerių Sąrašai' }} />
            <Stack.Screen name="ClassifierLists" component={ClassifierTabNavigator} options={{ title: 'Sąskaitų Klasifikatoriai' }} />
            <Stack.Screen name="Import" component={ImportScreen} options={{ title: 'Sąskaitų Importavimas' }}/>
            <Stack.Screen name="ZReportImport" component={ZReportImportScreen} options={{ title: 'Kasos Duomenų Importavimas' }}/>
            <Stack.Screen name="GeneralSettings" component={GeneralSettingsScreen} options={{ title: 'Operacijų Valdymas' }}/>
            <Stack.Screen name="DangerZone" component={DangerZoneScreen} options={{ title: 'Pavojinga Zona' }}/>
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => { const icons = { 'Pradžia': '🏠', 'Gautos': '📄', 'Išrašomos': '🖊️', 'Kasa': '💰', 'Ataskaitos': '📊', 'Nustatymai': '⚙️' }; return <Text style={{ fontSize: focused ? 28 : 24, color: focused ? colors.primary : 'gray' }}>{icons[route.name]}</Text>; },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border }
            })}
        >
            <Tab.Screen name="Pradžia" component={StartStack} />
            <Tab.Screen name="Gautos" component={ReceivedInvoicesStack} />
            <Tab.Screen name="Išrašomos" component={DraftInvoicesStack} />
            <Tab.Screen name="Kasa" component={CashRegisterStack} />
            <Tab.Screen name="Ataskaitos" component={ReportsStack} />
            <Tab.Screen name="Nustatymai" component={SettingsStack} />
        </Tab.Navigator>
    );
}