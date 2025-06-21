// FILE: src/screens/settings/DangerZoneScreen.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsContext } from '../../contexts/SettingsContext';
import { styles as globalStyles, colors, spacing, typography } from '../../utils/styles';

export default function DangerZoneScreen() {
    const settings = useContext(SettingsContext);

    const handleClearData = () => {
        Alert.alert(
            "Dėmesio! Visi duomenys bus ištrinti!",
            "Ar tikrai norite ištrinti visas sąskaitas, operacijas ir nustatymus? Šio veiksmo negalėsite atšaukti.",
            [
                { text: 'Atšaukti', style: 'cancel' },
                { text: 'Ištrinti viską', style: 'destructive', onPress: async () => { 
                    try {
                        await AsyncStorage.clear();
                        Alert.alert('Sėkmė', 'Visi duomenys ištrinti. Perkraukite programėlę.');
                    } catch (e) {
                        Alert.alert('Klaida', 'Nepavyko išvalyti duomenų.');
                    }
                }}
            ]
        );
    };

    return (
        <View style={globalStyles.screenContent}>
            <View style={globalStyles.inputSection}>
                <Text style={styles.sectionTitle}>Operacijų Valdymas</Text>
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Trinant operaciją, kurti atvirkštinį įrašą?</Text>
                    <Switch trackColor={{ false: "#767577", true: colors.accent }} thumbColor={settings.useReversalTransactions ? colors.surface : "#f4f3f4"} onValueChange={settings.setUseReversalTransactions} value={settings.useReversalTransactions} />
                </View>
                <Text style={styles.switchDescription}>(Rekomenduojama. Išjungus, operacijos bus trinamos negrįžtamai.)</Text>
                
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Leisti trinti atšauktų operacijų įrašus?</Text>
                    <Switch trackColor={{ false: "#767577", true: colors.warning }} thumbColor={settings.allowDeletingReversals ? colors.surface : "#f4f3f4"} onValueChange={settings.setAllowDeletingReversals} value={settings.allowDeletingReversals} />
                </View>
                <Text style={styles.switchDescription}>(Skirta tik "išvalyti" istoriją. Gali pažeisti atskaitomybę.)</Text>
            </View>

            <View style={globalStyles.inputSection}>
                <Text style={styles.sectionTitle}>Visiškas Išvalymas</Text>
                <TouchableOpacity style={[globalStyles.button, {backgroundColor: colors.danger}]} onPress={handleClearData}>
                    <Text style={globalStyles.buttonText}>Išvalyti visus programėlės duomenis</Text>
                </TouchableOpacity>
                <Text style={{color: colors.textSecondary, textAlign: 'center', marginTop: 8}}>Atsargiai! Šis veiksmas yra negrįžtamas ir ištrins absoliučiai visą programėlės atmintį.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: { ...globalStyles.inputTitle, textAlign: 'left', fontSize: 18, marginBottom: 16 },
    switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.small,},
    switchLabel: { ...globalStyles.inputLabel, flex: 1, marginRight: spacing.medium, marginBottom: 0,},
    switchDescription: { ...typography.caption, color: colors.textSecondary, fontStyle: 'italic', marginTop: spacing.small, paddingBottom: spacing.medium, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: spacing.medium },
});