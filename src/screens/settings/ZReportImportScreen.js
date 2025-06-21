// FILE: src/screens/settings/ZReportImportScreen.js

import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform, TextInput } from 'react-native';
import Papa from 'papaparse';
import { CashContext } from '../../contexts/CashContext';
import { styles as globalStyles, colors, spacing } from '../../utils/styles';

export default function ZReportImportScreen() {
    const { addTransaction } = useContext(CashContext);
    const [csvText, setCsvText] = useState('');

    const handleImport = () => {
        if (csvText.trim() === '') return Alert.alert("Klaida", "Teksto laukas tuščias.");

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            transformHeader: h => h.trim(),
            complete: (results) => {
                const { data, errors, meta } = results;
                if (errors.length > 0) return Alert.alert("Klaida", `Apdorojant failą rasta klaidų:\n${errors[0].message}`);
                
                // PATAISYMAS: Atnaujiname reikalingų stulpelių sąrašą, kad atitiktų jūsų failą.
                const required = ['Data', 'Gauta_kortele', 'Gauta_grynais', 'Cekiu_kiekis', 'Isimta_is_kasos'];
                if (!required.every(h => meta.fields.includes(h))) {
                    return Alert.alert("Netinkamas formatas", `Faile trūksta būtinų stulpelių. Reikalingi: ${required.join(', ')}`);
                }
                
                let importedCount = 0;
                data.forEach(row => {
                    const date = row.Data ? new Date(row.Data) : new Date();
                    const cardAmount = parseFloat(String(row.Gauta_kortele || '0').replace(',', '.'));
                    const cashAmount = parseFloat(String(row.Gauta_grynais || '0').replace(',', '.'));
                    const totalIncome = cardAmount + cashAmount;
                    // PATAISYMAS: Naudojame teisingą stulpelio pavadinimą
                    const transferAmount = parseFloat(String(row.Isimta_is_kasos || '0').replace(',', '.'));
                    const customers = parseInt(row.Cekiu_kiekis, 10) || 0;
                    
                    if (totalIncome > 0 || transferAmount > 0) {
                        if (totalIncome > 0) {
                            addTransaction(
                                'Importuotos įplaukos (Z)', 
                                totalIncome, 
                                null, null, null,
                                `Grynais: ${cashAmount.toFixed(2)}, Kortele: ${cardAmount.toFixed(2)}, Čekiai: ${customers}.`, 
                                date.toISOString()
                            );
                        }
    
                        if (transferAmount > 0) {
                            addTransaction(
                                'Importuotas pervedimas į seifą',
                                transferAmount,
                                null, null, null,
                                'Istorinis įrašas iš importo.',
                                date.toISOString()
                            );
                        }
                        importedCount++;
                    }
                });

                Alert.alert("Importavimas baigtas", `Sėkmingai apdorota ${importedCount} įrašų. Patikrinkite kasos operacijų istoriją.`);
                setCsvText('');
            }
        });
    };

    return (
        <ScrollView style={globalStyles.screenContent}>
            <View style={styles.container}>
                <View style={globalStyles.inputSection}>
                    <Text style={styles.title}>Instrukcijos</Text>
                    <Text style={styles.instructions}>Įklijuokite CSV duomenis istoriniams kasos duomenims importuoti. Pirma eilutė privalo turėti šias antraštes:</Text>
                    {/* PATAISYMAS: Atnaujiname instrukciją, kad atitiktų jūsų failą */}
                    <Text style={styles.headers} selectable={true}>Data,Isimta_is_kasos,Gauta_kortele,Gauta_grynais,Cekiu_kiekis</Text>
                    <Text style={styles.instructions}>- Datos formatas: YYYY-MM-DD.</Text>
                </View>
                <View style={globalStyles.inputSection}><Text style={styles.title}>Įklijuokite CSV duomenis čia</Text><TextInput style={styles.textInput} multiline={true} numberOfLines={10} placeholder="Data,Isimta_is_kasos..." value={csvText} onChangeText={setCsvText} /></View>
                <TouchableOpacity style={globalStyles.button} onPress={handleImport}><Text style={globalStyles.buttonText}>Importuoti Kasos Duomenis</Text></TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: spacing.medium },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.medium, color: colors.textPrimary },
    instructions: { fontSize: 16, marginBottom: spacing.small, color: colors.textSecondary, lineHeight: 22 },
    headers: { fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', color: colors.primary, backgroundColor: '#f1f1f1', padding: spacing.medium, borderRadius: 5, marginBottom: spacing.medium, lineHeight: 20 },
    textInput: {
        ...globalStyles.input,
        height: 200,
        textAlignVertical: 'top',
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    }
});