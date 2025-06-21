// FILE: src/screens/settings/SettingsDashboardScreen.js

import React from 'react';
import { View, ScrollView } from 'react-native';
import SettingsItem from '../../components/SettingsItem';
import { styles as globalStyles } from '../../utils/styles';

export default function SettingsDashboardScreen({ navigation }) {
    return (
        <ScrollView style={globalStyles.screenContent}>
            <View style={{ padding: 10 }}>
                <SettingsItem
                    title="Likučių Valdymas"
                    icon="💰"
                    onPress={() => navigation.navigate('BalanceSettings')}
                />
                <SettingsItem
                    title="Partnerių Sąrašai"
                    icon="👥"
                    onPress={() => navigation.navigate('PartnerLists')}
                />
                <SettingsItem
                    title="Sąskaitų Klasifikatoriai"
                    icon="📚"
                    onPress={() => navigation.navigate('ClassifierLists')}
                />
                {/* PATAISYMAS: Pridedame naują meniu punktą */}
                <SettingsItem
                    title="Duomenų Importavimas"
                    icon="📥"
                    onPress={() => navigation.navigate('Import')}
                />
                <SettingsItem
                    title="Bendri Nustatymai"
                    icon="🔧"
                    onPress={() => navigation.navigate('GeneralSettings')}
                />
                <SettingsItem
                    title="Pavojinga Zona"
                    icon="☣️"
                    onPress={() => navigation.navigate('DangerZone')}
                    isDanger={true}
                />
            </View>
        </ScrollView>
    );
}