// FILE: src/screens/settings/ImportScreen.js

import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform, TextInput } from 'react-native';
import Papa from 'papaparse';
import { InvoicesContext } from '../../contexts/InvoicesContext';
import { SettingsContext } from '../../contexts/SettingsContext';
import { styles as globalStyles, colors, spacing } from '../../utils/styles';
import { normalizeText } from '../../utils/helpers';

export default function ImportScreen() {
    const { handleBulkAddSaskaitos } = useContext(InvoicesContext);
    const { tiekejaiOptions, setTiekejaiOptions, busenaOptions } = useContext(SettingsContext);
    const [csvText, setCsvText] = useState('');

    const handleImportFromText = () => {
        if (csvText.trim() === '') {
            return Alert.alert("Klaida", "Teksto laukas yra tuščias. Įklijuokite CSV duomenis.");
        }

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            transformHeader: header => header.trim(),
            complete: (results) => {
                const { data, errors, meta } = results;

                if (errors.length > 0) {
                    const errorDetails = errors.map(e => `Eilutė ${e.row}: ${e.message}`).join('\n');
                    return Alert.alert("Importavimo klaida", `CSV faile yra formatavimo klaidų:\n\n${errorDetails}`);
                }

                if (data.length === 0) {
                    return Alert.alert("Informacija", "Tekste nerasta duomenų arba formatas netinkamas.");
                }

                const requiredHeaders = ['Data', 'SaskaitosNr', 'Tiekejas', 'Suma'];
                if (!requiredHeaders.every(h => meta.fields.includes(h))) {
                    return Alert.alert("Netinkamas formatas", `Tekste trūksta būtinų stulpelių. Privalomi: ${requiredHeaders.join(', ')}.`);
                }

                const newInvoices = data.map(row => {
                    const csvStatus = row.Busena || '';
                    const normalizedCsvStatus = normalizeText(csvStatus);
                    const foundStatus = busenaOptions.find(opt => normalizeText(opt) === normalizedCsvStatus);
                    const finalStatus = foundStatus || 'Neapmokėta';

                    return {
                        id: Date.now() + Math.random(),
                        data: (row.Data && row.Data.trim()) || new Date().toISOString().split('T')[0],
                        saskaitosNr: (row.SaskaitosNr && row.SaskaitosNr.trim()) || 'N/A',
                        tiekejas: (row.Tiekejas && row.Tiekejas.trim()) || 'N/A',
                        suma: parseFloat(String(row.Suma || '0').replace(',', '.')) || 0,
                        busena: finalStatus,
                        apmoketiIki: (row.ApmoketiIki && row.ApmoketiIki.trim()) || '',
                        comment: (row.Komentaras && row.Komentaras.trim()) || '',
                        paidSuma: parseFloat(String(row.ApmoketaSuma || '0').replace(',', '.')) || 0,
                        createdAt: new Date().toISOString(),
                        mokejimoPaskirtis: (row.Paskirtis && row.Paskirtis.trim()) || 'Kita',
                        rusis: (row.Rusis && row.Rusis.trim()) || 'Išlaidos',
                    };
                });

                const importedSuppliers = new Set(newInvoices.map(inv => inv.tiekejas).filter(t => t && t !== 'N/A'));
                const existingSuppliers = new Set(tiekejaiOptions);
                const newUniqueSuppliers = [...importedSuppliers].filter(s => !existingSuppliers.has(s));

                if (newUniqueSuppliers.length > 0) {
                    setTiekejaiOptions(prev => [...prev, ...newUniqueSuppliers].sort((a, b) => a.localeCompare(b)));
                    Alert.alert("Aptikta naujų tiekėjų", `Į jūsų tiekėjų sąrašą buvo sėkmingai pridėta: ${newUniqueSuppliers.join(', ')}`);
                }

                handleBulkAddSaskaitos(newInvoices);
                Alert.alert("Importavimas sėkmingas", `Sėkmingai importuota ${newInvoices.length} sąskaitų.`);
                setCsvText('');
            },
            error: (error) => {
                 Alert.alert("Apdorojimo klaida", `Nepavyko apdoroti teksto: ${error.message}`);
            }
        });
    };

    return (
        <ScrollView style={globalStyles.screenContent}>
            <View style={styles.container}>
                <View style={globalStyles.inputSection}><Text style={styles.title}>Instrukcijos</Text><Text style={styles.instructions}>Įklijuokite CSV duomenis. Pirma eilutė privalo turėti šias antraštes:</Text><Text style={styles.headers} selectable={true}>Data,SaskaitosNr,Tiekejas,Suma,Busena,ApmoketiIki,Komentaras,ApmoketaSuma,Paskirtis,Rusis</Text><Text style={styles.instructions}>- Stulpeliai `Paskirtis` ir `Rusis` yra neprivalomi.{"\n"}- Datos turi būti YYYY-MM-DD formatu.</Text></View>
                <View style={globalStyles.inputSection}><Text style={styles.title}>Įklijuokite CSV duomenis čia</Text><TextInput style={styles.textInput} multiline={true} numberOfLines={10} placeholder="Data,SaskaitosNr,Tiekejas,Suma..." value={csvText} onChangeText={setCsvText} /></View>
                <TouchableOpacity style={globalStyles.button} onPress={handleImportFromText}><Text style={globalStyles.buttonText}>Importuoti Iš Teksto</Text></TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: spacing.medium },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.medium, color: colors.textPrimary },
    instructions: { fontSize: 16, marginBottom: spacing.small, color: colors.textSecondary, lineHeight: 22 },
    headers: { fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', color: colors.primary, backgroundColor: '#f1f1f1', padding: spacing.medium, borderRadius: 5, marginBottom: spacing.medium, lineHeight: 20 },
    textInput: { ...globalStyles.input, height: 200, textAlignVertical: 'top', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', }
});