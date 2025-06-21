// FILE: src/screens/settings/DangerZoneScreen.js

import React, { useContext } from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import SettingsItem from '../../components/SettingsItem';
import { InvoicesContext } from '../../contexts/InvoicesContext';
import { CashContext } from '../../contexts/CashContext';
import { styles as globalStyles, spacing } from '../../utils/styles';

export default function DangerZoneScreen() {
    const { saskaitos, draftSaskaitos, clearAllInvoices } = useContext(InvoicesContext);
    const { transactions, clearCashData } = useContext(CashContext);

    const handleClearInvoices = () => {
        Alert.alert(
            "Ištrinti visas sąskaitas?",
            "Šis veiksmas negrįžtamas. Visos gautos ir išrašytos sąskaitos bus pašalintos visam laikui. Ar tikrai norite tęsti?",
            [
                { text: "Atšaukti", style: "cancel" },
                { text: "Ištrinti", style: "destructive", onPress: clearAllInvoices }
            ]
        );
    };

    const handleClearCashData = () => {
        Alert.alert(
            "Ištrinti visus kasos duomenis?",
            "Šis veiksmas negrįžtamas. Visos kasos, seifo ir banko operacijos bus pašalintos, o likučiai atstatyti į pradinius. Ar tikrai norite tęsti?",
            [
                { text: "Atšaukti", style: "cancel" },
                { text: "Ištrinti", style: "destructive", onPress: clearCashData }
            ]
        );
    };

    const showDebugData = () => {
        const sampleInvoices = saskaitos.slice(0, 2);
        const sampleDrafts = draftSaskaitos.slice(0, 2);
        const sampleTransactions = transactions.slice(0, 2);

        const debugString = 
            "--- KASOS OPERACIJOS (pavyzdys) ---\n" +
            JSON.stringify(sampleTransactions, null, 2) +
            "\n\n--- GAUTOS SĄSKAITOS (pavyzdys) ---\n" +
            JSON.stringify(sampleInvoices, null, 2) +
            "\n\n--- IŠRAŠYTOS SĄSKAITOS (pavyzdys) ---\n" +
            JSON.stringify(sampleDrafts, null, 2);

        Alert.alert("Diagnostiniai Duomenys", debugString, [{ text: "Gerai" }]);
    };

    return (
        <ScrollView style={globalStyles.screenContent}>
            <View style={{ padding: spacing.medium }}>
                <Text style={globalStyles.listTitle}>Pavojinga Zona</Text>
                
                <SettingsItem
                    title="Rodyti duomenis diagnostikai"
                    icon="🐛"
                    onPress={showDebugData}
                />
                
                <SettingsItem
                    title="Išvalyti visas sąskaitas"
                    icon="🗑️"
                    onPress={handleClearInvoices}
                    isDanger={true}
                />
                
                <SettingsItem
                    title="Išvalyti visus kasos duomenis"
                    icon="🔥"
                    onPress={handleClearCashData}
                    isDanger={true}
                />
            </View>
        </ScrollView>
    );
}