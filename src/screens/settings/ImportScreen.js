// FILE: src/screens/settings/ImportScreen.js

import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
// PATAISYMAS: Importuojame Expo bibliotekas
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { InvoicesContext } from '../../contexts/InvoicesContext';
import { styles as globalStyles, colors, spacing } from '../../utils/styles';

export default function ImportScreen() {
    const { handleBulkAddSaskaitos } = useContext(InvoicesContext);

    const handleImport = async () => {
        try {
            // PATAISYMAS: Naudojame Expo Document Picker
            const result = await DocumentPicker.getDocumentAsync({
                type: 'text/csv',
                copyToCacheDirectory: true, // Svarbu, kad galėtume nuskaityti failą
            });

            if (result.type === 'success') {
                // PATAISYMAS: Naudojame Expo File System failo nuskaitymui
                const csvContent = await FileSystem.readAsStringAsync(result.uri, {
                    encoding: FileSystem.EncodingType.UTF8,
                });

                Papa.parse(csvContent, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const { data, errors } = results;
                        if (errors.length > 0) {
                            Alert.alert("Importavimo klaida", "CSV faile yra klaidų. Patikrinkite formatavimą.");
                            console.error("CSV parsing errors:", errors);
                            return;
                        }

                        if (data.length === 0) {
                            return Alert.alert("Informacija", "CSV failas tuščias arba neteisingo formato.");
                        }

                        const newInvoices = data.map(row => ({
                            id: Date.now() + Math.random(),
                            data: row.Data || new Date().toISOString().split('T')[0],
                            saskaitosNr: row.SaskaitosNr || 'Nenurodyta',
                            tiekejas: row.Tiekejas || 'Nenurodyta',
                            suma: parseFloat(String(row.Suma).replace(',', '.')) || 0,
                            busena: row.Busena || 'Neapmokėta',
                            apmoketiIki: row.ApmoketiIki || '',
                            comment: row.Komentaras || '',
                            paidSuma: parseFloat(String(row.ApmoketaSuma).replace(',', '.')) || 0,
                            createdAt: new Date().toISOString(),
                            rusis: 'Išlaidos',
                        }));

                        handleBulkAddSaskaitos(newInvoices);
                        Alert.alert("Importavimas sėkmingas", `Sėkmingai importuota ${newInvoices.length} sąskaitų.`);
                    },
                    error: (error) => {
                         Alert.alert("Apdorojimo klaida", "Nepavyko apdoroti CSV failo.");
                         console.error("CSV parsing error:", error.message);
                    }
                });
            }
        } catch (err) {
            // Klaidų valdymas lieka toks pat
            Alert.alert("Klaida", "Įvyko nenumatyta klaida bandant pasirinkti failą.");
            console.error("Document Picker Error:", err);
        }
    };

    return (
        <ScrollView style={globalStyles.screenContent}>
            <View style={styles.container}>
                <View style={globalStyles.inputSection}>
                    <Text style={styles.title}>Instrukcijos</Text>
                    <Text style={styles.instructions}>
                        Pasiruoškite CSV failą su šiomis antraštėmis pirmoje eilutėje:
                    </Text>
                    <Text style={styles.headers}>Data,SaskaitosNr,Tiekejas,Suma,Busena,ApmoketiIki,Komentaras,ApmoketaSuma</Text>
                    <Text style={styles.instructions}>
                        - Datos turi būti YYYY-MM-DD formatu.
                        {"\n"}- Sumos turi būti skaičiai (pvz., 123.45).
                    </Text>
                </View>
                <TouchableOpacity style={globalStyles.button} onPress={handleImport}>
                    <Text style={globalStyles.buttonText}>Importuoti Gautas Sąskaitas (CSV)</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: spacing.medium },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.medium, color: colors.textPrimary },
    instructions: { fontSize: 16, marginBottom: spacing.small, color: colors.textSecondary, lineHeight: 22 },
    headers: { fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', color: colors.primary, backgroundColor: '#f1f1f1', padding: spacing.medium, borderRadius: 5, marginBottom: spacing.medium, flexWrap: 'wrap' },
});