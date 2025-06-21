// FILE: src/screens/AddInvoiceScreen.js

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { InvoicesContext } from '../contexts/InvoicesContext';
import { SettingsContext } from '../contexts/SettingsContext';
import CustomDropdown from '../components/CustomDropdown';
import DatePickerModal from '../components/DatePickerModal';
import { styles } from '../utils/styles';
import { showCustomAlert, incrementReceivedInvoiceNumber } from '../utils/helpers';

export default function AddInvoiceScreen({ navigation }) {
    const { saskaitos, handleAddSaskaita } = useContext(InvoicesContext);
    const { tiekejaiOptions, rusysOptions, busenaOptions, mokejimoPaskirtisOptions } = useContext(SettingsContext);

    const [data, setData] = useState(new Date().toISOString().split('T')[0]);
    const [saskaitosNr, setSaskaitosNr] = useState('');
    const [tiekejas, setTiekejas] = useState('');
    const [mokejimoPaskirtis, setMokejimoPaskirtis] = useState('');
    const [suma, setSuma] = useState('');
    const [paidSuma, setPaidSuma] = useState('0');
    const [rusis, setRusis] = useState('');
    const [busena, setBusena] = useState('');
    const [comment, setComment] = useState('');
    const [apmoketiIki, setApmoketiIki] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showApmoketiIkiDatePicker, setShowApmoketiIkiDatePicker] = useState(false);

    useEffect(() => {
        const defaultApmoketiIki = new Date();
        defaultApmoketiIki.setDate(defaultApmoketiIki.getDate() + 30);
        setApmoketiIki(defaultApmoketiIki.toISOString().split('T')[0]);
        
        // Nustatome numatytasias reikšmes tik tada, kai jos yra gautos iš konteksto
        if (rusysOptions && rusysOptions.length > 0) setRusis(rusysOptions[0]);
        if (busenaOptions && busenaOptions.length > 0) setBusena(busenaOptions[0]);
        if (mokejimoPaskirtisOptions && mokejimoPaskirtisOptions.length > 0) setMokejimoPaskirtis(mokejimoPaskirtisOptions[0]);
    // PATAISYMAS: Pridėtos trūkstamos priklausomybės
    }, [busenaOptions, mokejimoPaskirtisOptions, rusysOptions]);
  
    useEffect(() => {
        if (!tiekejas) {
            setSaskaitosNr('');
            return;
        }
        const supplierInvoices = saskaitos.filter(s => s.tiekejas === tiekejas);
        if (supplierInvoices.length > 0) {
            supplierInvoices.sort((a, b) => b.saskaitosNr.localeCompare(a.saskaitosNr));
            const lastInvoiceNr = supplierInvoices[0].saskaitosNr;
            setSaskaitosNr(incrementReceivedInvoiceNumber(lastInvoiceNr));
        } else {
            setSaskaitosNr('');
        }
    }, [tiekejas, saskaitos]);

    const handleSubmit = () => {
        if (!data || !saskaitosNr || !tiekejas || !mokejimoPaskirtis || !suma || !apmoketiIki) {
            return showCustomAlert('Klaida', 'Prašome užpildyti visus privalomus laukus!');
        }
        const parsedSuma = parseFloat(suma.replace(',', '.'));
        const parsedPaidSuma = parseFloat(paidSuma.replace(',', '.'));
        if (isNaN(parsedSuma) || parsedSuma <= 0 || isNaN(parsedPaidSuma) || parsedPaidSuma < 0 || parsedPaidSuma > parsedSuma) {
            return showCustomAlert('Klaida', 'Neteisingai įvesta suma.');
        }
        let newBusena = busena;
        if (parsedPaidSuma >= parsedSuma) newBusena = 'Apmokėta';
        else if (parsedPaidSuma > 0) newBusena = 'Dalinai apmokėta';
        else newBusena = 'Neapmokėta';
    
        handleAddSaskaita({ data, saskaitosNr, tiekejas, mokejimoPaskirtis, suma: parsedSuma, paidSuma: parsedPaidSuma, rusis, busena: newBusena, comment, apmoketiIki });
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.screenContent} contentContainerStyle={{paddingBottom: 50}} keyboardShouldPersistTaps="handled">
            <View style={[styles.inputSection, {marginTop: 20}]}>
                <Text style={styles.inputTitle}>Nauja Gauta Sąskaita</Text>
                
                <Text style={styles.inputLabel}>Data:</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}><Text>{data}</Text></TouchableOpacity>
                <DatePickerModal visible={showDatePicker} onClose={() => setShowDatePicker(false)} onSelectDate={setData} initialDate={data} />
                
                <CustomDropdown label="Tiekėjas" options={tiekejaiOptions} selectedValue={tiekejas} onSelect={setTiekejas} placeholder="Pasirinkite tiekėją" />
                
                <Text style={styles.inputLabel}>Sąskaitos Nr.:</Text>
                <TextInput style={styles.input} value={saskaitosNr} onChangeText={setSaskaitosNr} placeholder="Įveskite arba bus pasiūlytas"/>
                
                <Text style={styles.inputLabel}>Suma (EUR):</Text>
                <TextInput style={styles.input} value={suma} onChangeText={(text) => setSuma(text.replace(',', '.'))} keyboardType="decimal-pad" placeholder="0.00"/>
                
                <CustomDropdown label="Mokėjimo paskirtis" options={mokejimoPaskirtisOptions} selectedValue={mokejimoPaskirtis} onSelect={setMokejimoPaskirtis} />
                <CustomDropdown label="Rūšis" options={rusysOptions} selectedValue={rusis} onSelect={setRusis} />
                <CustomDropdown label="Būsena" options={busenaOptions} selectedValue={busena} onSelect={setBusena} />
                
                <Text style={styles.inputLabel}>Apmokėti iki:</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowApmoketiIkiDatePicker(true)}><Text>{apmoketiIki}</Text></TouchableOpacity>
                <DatePickerModal visible={showApmoketiIkiDatePicker} onClose={() => setShowApmoketiIkiDatePicker(false)} onSelectDate={setApmoketiIki} initialDate={apmoketiIki} />
                
                <Text style={styles.inputLabel}>Komentaras:</Text>
                <TextInput style={[styles.input, {height: 80, textAlignVertical: 'top'}]} value={comment} onChangeText={setComment} multiline placeholder="Neprivaloma"/>
                
                <TouchableOpacity style={styles.button} onPress={handleSubmit}><Text style={styles.buttonText}>Pridėti Sąskaitą</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}><Text style={styles.buttonText}>Atšaukti</Text></TouchableOpacity>
            </View>
        </ScrollView>
    );
}