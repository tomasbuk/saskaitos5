// FAILAS: src/screens/SettingsScreen.js

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager, SafeAreaView, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Papa from 'papaparse';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

import { SettingsContext } from '../contexts/SettingsContext';
import { CashContext } from '../contexts/CashContext';
import { styles, colors } from '../utils/styles';
import { showCustomAlert } from '../utils/helpers';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) { UIManager.setLayoutAnimationEnabledExperimental(true); }

// Nauja, atskirta importavimo funkcija
const importCsvData = (csvData, handleIncome, handleExpense) => {
    if (!csvData || csvData.length < 2) {
        Alert.alert("Klaida", "Nėra duomenų importavimui arba failas tuščias.");
        return;
    }
    try {
        let importedCount = 0;
        let skippedCount = 0;
        for (let i = 1; i < csvData.length; i++) {
            const row = csvData[i];
            
            if (row.length < 9) {
                skippedCount++;
                continue;
            }

            const dateStr = row[0];
            const suma = parseFloat(row[3]);
            const paskirtis = row[7];
            const rusis = row[8];
            const komentaras = row[6] !== 'Nera' ? row[6] : '';

            const date = new Date(dateStr);
            if (!dateStr || isNaN(date.getTime()) || isNaN(suma)) {
                console.warn(`Praleidžiama eilutė dėl blogų duomenų: ${row.join(',')}`);
                skippedCount++;
                continue;
            }

            if (rusis === 'Išlaidos') {
                const description = paskirtis ? `${paskirtis}` : "Bendros išlaidos";
                handleExpense(suma, description, 'cash_out', dateStr);
                importedCount++;
            } else if (rusis === 'Pardavimai' || rusis === 'Įvairūs') {
                const description = paskirtis ? `${paskirtis}` : "Bendros įplaukos";
                const finalComment = komentaras ? `${description} (${komentaras})` : description;
                handleIncome(suma, 'cash_in', finalComment, dateStr);
                importedCount++;
            } else {
                skippedCount++;
            }
        }
        Alert.alert("Importavimas baigtas", `Sėkmingai importuota: ${importedCount} operacijų.\nPraleista: ${skippedCount} eilučių.`);
    } catch (error) {
        console.error("Klaida importuojant CSV:", error);
        Alert.alert("Kritinė klaida", "Įvyko klaida apdorojant duomenis.");
    }
};

export default function SettingsScreen() {
    const {
        rusysOptions, setRusysOptions, busenaOptions, setBusenaOptions, mokejimoPaskirtisOptions, setMokejimoPaskirtisOptions,
        tiekejaiOptions, setTiekejaiOptions, pirkejaiOptions, setPirkejaiOptions,
        draftInvoiceSeries, setDraftInvoiceSeries, draftInvoiceLastNumber, setDraftInvoiceLastNumber,
        headerLeftText, setHeaderLeftText, headerRightText, setHeaderRightText
    } = useContext(SettingsContext);
    
    const { 
        cashRegisterBalance, setCashRegisterBalance, 
        safeBalance, setSafeBalance, 
        bankBalance, setBankBalance,
        handleIncomeConfirm, handleExpenseConfirm // Gauname funkcijas iš konteksto
    } = useContext(CashContext);

    const [openSection, setOpenSection] = useState(null);
    const [cashInput, setCashInput] = useState(String(cashRegisterBalance));
    const [safeInput, setSafeInput] = useState(String(safeBalance));
    const [bankInput, setBankInput] = useState(String(bankBalance));
    const [isPinModalVisible, setPinModalVisible] = useState(false);
    const [pinInput, setPinInput] = useState('');
    const DELETION_PIN = "19851007";
    
    const [newTiekejas, setNewTiekejas] = useState('');
    const [newPirkejas, setNewPirkejas] = useState('');
    const [newPaskirtis, setNewPaskirtis] = useState('');
    const [newRusis, setNewRusis] = useState('');
    const [newBusena, setNewBusena] = useState('');

    useEffect(() => { setCashInput(String(cashRegisterBalance)); }, [cashRegisterBalance]);
    useEffect(() => { setSafeInput(String(safeBalance)); }, [safeBalance]);
    useEffect(() => { setBankInput(String(bankBalance)); }, [bankBalance]);

    const handleImportPress = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
            if (result.type === 'success' || (result.assets && result.assets[0])) {
                const uri = result.assets[0].uri;
                const fileContent = await FileSystem.readAsStringAsync(uri);
                
                Papa.parse(fileContent, {
                    complete: (results) => {
                        importCsvData(results.data, handleIncomeConfirm, handleExpenseConfirm);
                    },
                    error: (error) => {
                        Alert.alert("Klaida", "Nepavyko apdoroti CSV failo.");
                        console.error("CSV apdorojimo klaida:", error);
                    }
                });
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const toggleSection = (sectionName) => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setOpenSection(openSection === sectionName ? null : sectionName); };
    const handleBalanceBlur = (inputType) => { let localStringValue, setGlobalState; if (inputType === 'cash') { localStringValue = cashInput; setGlobalState = setCashRegisterBalance; } else if (inputType === 'safe') { localStringValue = safeInput; setGlobalState = setSafeBalance; } else if (inputType === 'bank') { localStringValue = bankInput; setGlobalState = setBankBalance; } else return; const parsedValue = parseFloat(String(localStringValue).replace(',', '.')) || 0; setGlobalState(parsedValue); };
    const handlePinConfirm = async () => { if (pinInput === DELETION_PIN) { setPinInput(''); setPinModalVisible(false); try { await AsyncStorage.clear(); Alert.alert( "Sėkmė", "Visi duomenys ištrinti. Prašome perkrauti programėlę, kad pakeitimai įsigaliotų.", [{ text: "Gerai" }]); } catch (e) { showCustomAlert("Klaida", "Nepavyko išvalyti duomenų."); } } else { showCustomAlert("Klaida", "Neteisingas PIN kodas."); setPinInput(''); } };
    const handleAddOption = (value, setter, list, listName) => { const trimmedValue = value.trim(); if (!trimmedValue) { showCustomAlert('Klaida', 'Laukas negali būti tuščias.'); return false; } if (list.includes(trimmedValue)) { showCustomAlert('Klaida', `Toks ${listName} jau egzistuoja.`); return false; } setter(prev => [...prev, trimmedValue].sort()); return true; };
    const handleRemoveOption = (setter, valueToRemove) => { setter(prev => prev.filter(item => item !== valueToRemove)); };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView style={styles.screenContent} contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.listTitle}>Nustatymai</Text>

                {/* NAUJAS BLOKAS: Importavimas */}
                <View style={styles.collapsibleSection}>
                    <TouchableOpacity onPress={handleImportPress} style={[styles.collapsibleHeader, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.collapsibleHeaderText, { color: 'white' }]}>Importuoti CSV operacijas</Text>
                    </TouchableOpacity>
                </View>
                
                {/* ... likęs kodas toks pat ... */}
                <View style={styles.collapsibleSection}><TouchableOpacity onPress={() => toggleSection('antraštė')} style={styles.collapsibleHeader}><Text style={styles.collapsibleHeaderText}>Antraštės valdymas</Text><Text style={styles.collapsibleIcon}>{openSection === 'antraštė' ? '▲' : '▼'}</Text></TouchableOpacity>{openSection === 'antraštė' && <View style={styles.collapsibleContent}><Text style={styles.inputLabel}>Tekstas kairėje:</Text><TextInput style={styles.input} value={headerLeftText} onChangeText={setHeaderLeftText} /><Text style={styles.inputLabel}>Tekstas dešinėje:</Text><TextInput style={styles.input} value={headerRightText} onChangeText={setHeaderRightText} /></View>}</View>
                <View style={styles.collapsibleSection}><TouchableOpacity onPress={() => toggleSection('likuciai')} style={styles.collapsibleHeader}><Text style={styles.collapsibleHeaderText}>Pinigų likučiai</Text><Text style={styles.collapsibleIcon}>{openSection === 'likuciai' ? '▲' : '▼'}</Text></TouchableOpacity>{openSection === 'likuciai' && <View style={styles.collapsibleContent}><Text style={styles.inputLabel}>Kasa (EUR):</Text><TextInput style={styles.input} value={cashInput} onChangeText={setCashInput} onBlur={() => handleBalanceBlur('cash')} keyboardType="decimal-pad" /><Text style={styles.inputLabel}>Seifas (EUR):</Text><TextInput style={styles.input} value={safeInput} onChangeText={setSafeInput} onBlur={() => handleBalanceBlur('safe')} keyboardType="decimal-pad" /><Text style={styles.inputLabel}>Bankas (EUR):</Text><TextInput style={styles.input} value={bankInput} onChangeText={setBankInput} onBlur={() => handleBalanceBlur('bank')} keyboardType="decimal-pad" /></View>}</View>
                <View style={styles.collapsibleSection}><TouchableOpacity onPress={() => toggleSection('tiekejai')} style={styles.collapsibleHeader}><Text style={styles.collapsibleHeaderText}>Tiekėjų valdymas</Text><Text style={styles.collapsibleIcon}>{openSection === 'tiekejai' ? '▲' : '▼'}</Text></TouchableOpacity>{openSection === 'tiekejai' && <View style={styles.collapsibleContent}>{tiekejaiOptions.map(opt => <View key={opt} style={styles.settingsListItem}><Text style={styles.settingsItemText}>{opt}</Text><TouchableOpacity onPress={() => handleRemoveOption(setTiekejaiOptions, opt)} style={styles.removeButton}><Text style={styles.buttonText}>X</Text></TouchableOpacity></View>)}<View style={{ marginTop: 15, borderTopWidth: 1, borderColor: colors.border, paddingTop: 15 }}><TextInput style={styles.input} value={newTiekejas} onChangeText={setNewTiekejas} placeholder="Naujas tiekėjas..."/><TouchableOpacity style={styles.button} onPress={() => {if(handleAddOption(newTiekejas, setTiekejaiOptions, tiekejaiOptions, 'tiekėjas')) setNewTiekejas('');}}><Text style={styles.buttonText}>Pridėti</Text></TouchableOpacity></View></View>}</View>
                <View style={styles.collapsibleSection}><TouchableOpacity onPress={() => toggleSection('pirkejai')} style={styles.collapsibleHeader}><Text style={styles.collapsibleHeaderText}>Pirkėjų valdymas</Text><Text style={styles.collapsibleIcon}>{openSection === 'pirkejai' ? '▲' : '▼'}</Text></TouchableOpacity>{openSection === 'pirkejai' && <View style={styles.collapsibleContent}>{pirkejaiOptions.map(opt => <View key={opt} style={styles.settingsListItem}><Text style={styles.settingsItemText}>{opt}</Text><TouchableOpacity onPress={() => handleRemoveOption(setPirkejaiOptions, opt)} style={styles.removeButton}><Text style={styles.buttonText}>X</Text></TouchableOpacity></View>)}<View style={{ marginTop: 15, borderTopWidth: 1, borderColor: colors.border, paddingTop: 15 }}><TextInput style={styles.input} value={newPirkejas} onChangeText={setNewPirkejas} placeholder="Naujas pirkėjas..."/><TouchableOpacity style={styles.button} onPress={() => {if(handleAddOption(newPirkejas, setPirkejaiOptions, pirkejaiOptions, 'pirkėjas')) setNewPirkejas('');}}><Text style={styles.buttonText}>Pridėti</Text></TouchableOpacity></View></View>}</View>
                <View style={styles.collapsibleSection}><TouchableOpacity onPress={() => toggleSection('paskirtys')} style={styles.collapsibleHeader}><Text style={styles.collapsibleHeaderText}>Mokėjimo Paskirčių valdymas</Text><Text style={styles.collapsibleIcon}>{openSection === 'paskirtys' ? '▲' : '▼'}</Text></TouchableOpacity>{openSection === 'paskirtys' && <View style={styles.collapsibleContent}>{mokejimoPaskirtisOptions.map(opt => <View key={opt} style={styles.settingsListItem}><Text style={styles.settingsItemText}>{opt}</Text><TouchableOpacity onPress={() => handleRemoveOption(setMokejimoPaskirtisOptions, opt)} style={styles.removeButton}><Text style={styles.buttonText}>X</Text></TouchableOpacity></View>)}<View style={{ marginTop: 15, borderTopWidth: 1, borderColor: colors.border, paddingTop: 15 }}><TextInput style={styles.input} value={newPaskirtis} onChangeText={setNewPaskirtis} placeholder="Nauja paskirtis..."/><TouchableOpacity style={styles.button} onPress={() => {if(handleAddOption(newPaskirtis, setMokejimoPaskirtisOptions, mokejimoPaskirtisOptions, 'paskirtis')) setNewPaskirtis('');}}><Text style={styles.buttonText}>Pridėti</Text></TouchableOpacity></View></View>}</View>
                <View style={styles.collapsibleSection}><TouchableOpacity onPress={() => toggleSection('rusys')} style={styles.collapsibleHeader}><Text style={styles.collapsibleHeaderText}>Rūšių valdymas</Text><Text style={styles.collapsibleIcon}>{openSection === 'rusys' ? '▲' : '▼'}</Text></TouchableOpacity>{openSection === 'rusys' && <View style={styles.collapsibleContent}>{rusysOptions.map(opt => <View key={opt} style={styles.settingsListItem}><Text style={styles.settingsItemText}>{opt}</Text><TouchableOpacity onPress={() => handleRemoveOption(setRusysOptions, opt)} style={styles.removeButton}><Text style={styles.buttonText}>X</Text></TouchableOpacity></View>)}<View style={{ marginTop: 15, borderTopWidth: 1, borderColor: colors.border, paddingTop: 15 }}><TextInput style={styles.input} value={newRusis} onChangeText={setNewRusis} placeholder="Nauja rūšis..."/><TouchableOpacity style={styles.button} onPress={() => {if(handleAddOption(newRusis, setRusysOptions, rusysOptions, 'rūšis')) setNewRusis('');}}><Text style={styles.buttonText}>Pridėti</Text></TouchableOpacity></View></View>}</View>
                <View style={styles.collapsibleSection}><TouchableOpacity onPress={() => toggleSection('busenos')} style={styles.collapsibleHeader}><Text style={styles.collapsibleHeaderText}>Būsenų valdymas</Text><Text style={styles.collapsibleIcon}>{openSection === 'busenos' ? '▲' : '▼'}</Text></TouchableOpacity>{openSection === 'busenos' && <View style={styles.collapsibleContent}>{busenaOptions.map(opt => <View key={opt} style={styles.settingsListItem}><Text style={styles.settingsItemText}>{opt}</Text><TouchableOpacity onPress={() => handleRemoveOption(setBusenaOptions, opt)} style={styles.removeButton}><Text style={styles.buttonText}>X</Text></TouchableOpacity></View>)}<View style={{ marginTop: 15, borderTopWidth: 1, borderColor: colors.border, paddingTop: 15 }}><TextInput style={styles.input} value={newBusena} onChangeText={setNewBusena} placeholder="Nauja būsena..."/><TouchableOpacity style={styles.button} onPress={() => {if(handleAddOption(newBusena, setBusenaOptions, busenaOptions, 'būsena')) setNewBusena('');}}><Text style={styles.buttonText}>Pridėti</Text></TouchableOpacity></View></View>}</View>
                <View style={styles.collapsibleSection}><TouchableOpacity onPress={() => toggleSection('numeracija')} style={styles.collapsibleHeader}><Text style={styles.collapsibleHeaderText}>Išrašomų sąskaitų numeracija</Text><Text style={styles.collapsibleIcon}>{openSection === 'numeracija' ? '▲' : '▼'}</Text></TouchableOpacity>{openSection === 'numeracija' && <View style={styles.collapsibleContent}><Text style={styles.inputLabel}>Serija:</Text><TextInput style={styles.input} value={draftInvoiceSeries} onChangeText={setDraftInvoiceSeries} /><Text style={styles.inputLabel}>Paskutinis numeris:</Text><TextInput style={styles.input} value={String(draftInvoiceLastNumber)} onChangeText={setDraftInvoiceLastNumber} keyboardType="numeric" /></View>}</View>
                <View style={[styles.collapsibleSection, { borderColor: colors.danger, borderWidth: 1}]}><TouchableOpacity onPress={() => toggleSection('isvalymas')} style={styles.collapsibleHeader}><Text style={[styles.collapsibleHeaderText, {color: colors.danger}]}>Duomenų valdymas</Text><Text style={[styles.collapsibleIcon, {color: colors.danger}]}>{openSection === 'isvalymas' ? '▲' : '▼'}</Text></TouchableOpacity>{openSection === 'isvalymas' && <View style={styles.collapsibleContent}><Text style={styles.infoText}>Atsargiai! Šis veiksmas ištrins visus programėlės duomenis negrįžtamai.</Text><TouchableOpacity style={[styles.button, {backgroundColor: colors.danger}]} onPress={() => setPinModalVisible(true)}><Text style={styles.buttonText}>IŠVALYTI VISUS DUOMENIS</Text></TouchableOpacity></View>}</View>
            </ScrollView>
            <Modal visible={isPinModalVisible} transparent={true} animationType="fade" onRequestClose={() => setPinModalVisible(false)}><View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20}}><View style={styles.inputSection}><Text style={styles.listTitle}>Patvirtinimas</Text><Text style={styles.inputLabel}>Norėdami ištrinti visus duomenis, įveskite PIN kodą.</Text><Text style={[styles.inputLabel, {color: colors.primary, alignSelf: 'center', marginBottom: 10}]}>Užuomina: BDAY</Text><TextInput style={styles.input} value={pinInput} onChangeText={setPinInput} keyboardType="number-pad" secureTextEntry={true} maxLength={8} placeholder="PIN kodas" autoFocus={true}/><TouchableOpacity style={[styles.button, {backgroundColor: colors.danger}]} onPress={handlePinConfirm}><Text style={styles.buttonText}>Patvirtinti ir Ištrinti</Text></TouchableOpacity><TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => {setPinInput(''); setPinModalVisible(false);}}><Text style={styles.buttonText}>Atšaukti</Text></TouchableOpacity></View></View></Modal>
        </SafeAreaView>
    );
}