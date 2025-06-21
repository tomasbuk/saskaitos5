// FILE: src/screens/settings/SettingsDashboardScreen.js
import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import SettingsItem from '../../components/SettingsItem';
import { styles as globalStyles, spacing } from '../../utils/styles';

export default function SettingsDashboardScreen({ navigation }) {
    return (
        <ScrollView style={globalStyles.screenContent}>
            <View style={{ padding: spacing.medium }}>
                <Text style={globalStyles.listTitle}>Nustatymai</Text>
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
                    icon="🏷️"
                    onPress={() => navigation.navigate('ClassifierLists')}
                />
                {/* Šis mygtukas buvo dingęs */}
                <SettingsItem
                    title="Sąskaitų Importavimas"
                    icon="📥"
                    onPress={() => navigation.navigate('Import')}
                />
                <SettingsItem
                    title="Kasos Duomenų Importavimas"
                    icon="🗄️"
                    onPress={() => navigation.navigate('ZReportImport')}
                />
                <SettingsItem
                    title="Operacijų Valdymas"
                    icon="⚙️"
                    onPress={() => navigation.navigate('GeneralSettings')}
                />
                <SettingsItem
                    title="Pavojinga Zona"
                    icon="⚠️"
                    onPress={() => navigation.navigate('DangerZone')}
                    isDanger={true}
                />
            </View>
        </ScrollView>
    );
}