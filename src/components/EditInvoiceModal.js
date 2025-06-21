// FILE: src/components/EditInvoiceModal.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, SafeAreaView, StyleSheet } from 'react-native';
import { styles as globalStyles, colors, spacing, borderRadius } from '../utils/styles';
import { showCustomAlert } from '../utils/helpers';
import CustomDropdown from './CustomDropdown';
import DatePickerModal from './DatePickerModal';

export default function EditInvoiceModal({ 
    visible, 
    onClose, 
    invoice, 
    onSave, 
    tiekejaiOptions, 
    rusysOptions, 
    busenaOptions, 
    mokejimoPaskirtisOptions, 
    pirkejaiOptions, 
    isDraft = false,
    onGeneratePdf 
}) {
    const [data, setData] = useState('');
    const [saskaitosNr, setSaskaitosNr] = useState('');
    const [entityName, setEntityName] = useState('');
    const [mokejimoPaskirtis, setMokejimoPaskirtis] = useState('');
    const [suma, setSuma] = useState('');
    const [paidSuma, setPaidSuma] = useState('');
    const [rusis, setRusis] = useState('');
    const [busena, setBusena] = useState('');
    const [comment, setComment] = useState('');
    const [apmoketiIki, setApmoketiIki] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showApmoketiIkiDatePicker, setShowApmoketiIkiDatePicker] = useState(false);

    useEffect(() => {
        if (invoice) {
            setData(invoice.data || '');
            setSaskaitosNr(invoice.saskaitosNr || '');
            setEntityName(isDraft ? invoice.pirkejas : invoice.tiekejas || '');
            setMokejimoPaskirtis(invoice.mokejimoPaskirtis || '');
            setSuma(String(invoice.suma || ''));
            setPaidSuma(String(invoice.paidSuma || '0'));
            setRusis(invoice.rusis || '');
            setBusena(invoice.busena || '');
            setComment(invoice.comment || '');
            setApmoketiIki(invoice.apmoketiIki || '');
        }
    }, [invoice, isDraft]);

    // NAUJA LOGIKA: Automatiškai nustatome apmokėtą sumą priklausomai nuo būsenos
    useEffect(() => {
        // Jei vartotojas pakeičia būseną į "Apmokėta", automatiškai užpildome pilną sumą.
        if (busena === 'Apmokėta') {
            setPaidSuma(suma);
        } 
        // Jei pakeičia į "Neapmokėta", nustatome apmokėtą sumą į 0.
        else if (busena === 'Neapmokėta') {
            setPaidSuma('0');
        }
        // Jei "Dalinai apmokėta", nieko nedarome ir leidžiame vartotojui įvesti sumą pačiam.
    }, [busena, suma]);


    const handleSave = () => {
        const parsedSuma = parseFloat(String(suma).replace(',', '.'));
        // Paimame paidSuma iš state, kuris jau buvo automatiškai nustatytas arba įvestas ranka
        const parsedPaidSuma = parseFloat(String(paidSuma).replace(',', '.'));

        if (!data || !saskaitosNr || !entityName || !mokejimoPaskirtis || !suma || !apmoketiIki) {
            return showCustomAlert('Klaida', 'Prašome užpildyti visus būtinus laukus!');
        }
        if (isNaN(parsedSuma) || parsedSuma <= 0) {
            return showCustomAlert('Klaida', 'Suma turi būti teigiamas skaičius.');
        }
        if (isNaN(parsedPaidSuma) || parsedPaidSuma < 0 || parsedPaidSuma > parsedSuma) {
            return showCustomAlert('Klaida', 'Apmokėta suma negali būti neigiama arba didesnė už bendrą sumą.');
        }

        const saveData = {
            data, saskaitosNr, mokejimoPaskirtis,
            suma: parsedSuma,
            paidSuma: parsedPaidSuma,
            busena: busena, // Naudojame būseną, kurią pasirinko vartotojas
            comment,
            apmoketiIki: apmoketiIki, // PATAISYMAS: Įtraukiame `apmoketiIki` į išsaugomus duomenis.
        };

        if (isDraft) {
            saveData.pirkejas = entityName;
        } else {
            saveData.tiekejas = entityName;
            saveData.rusis = rusis;
        }

        onSave(invoice.id, saveData);
        onClose();
    };

    return (
        <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <ScrollView contentContainerStyle={{ padding: spacing.medium }} keyboardShouldPersistTaps="handled">
                    <View style={globalStyles.inputSection}>
                        <Text style={globalStyles.listTitle}>Redaguoti Įrašą</Text>
                        
                        {/* Būsenos pasirinkimas dabar yra viršuje, nes nuo jo priklauso kiti laukai */}
                        <CustomDropdown label="Būsena" options={busenaOptions} selectedValue={busena} onSelect={setBusena} />
                        
                        <Text style={globalStyles.inputLabel}>Suma (EUR):</Text>
                        <TextInput style={globalStyles.input} value={suma} onChangeText={setSuma} keyboardType="decimal-pad" />

                        {/* NAUJA LOGIKA: Rodome šį laukelį tik jei būsena yra "Dalinai apmokėta" */}
                        {busena === 'Dalinai apmokėta' && (
                            <>
                                <Text style={globalStyles.inputLabel}>Apmokėta suma (EUR):</Text>
                                <TextInput style={globalStyles.input} value={paidSuma} onChangeText={setPaidSuma} keyboardType="decimal-pad" />
                            </>
                        )}
                        
                        <Text style={globalStyles.inputLabel}>Data:</Text>
                        <TouchableOpacity style={globalStyles.input} onPress={() => setShowDatePicker(true)}><Text>{data}</Text></TouchableOpacity>
                        <DatePickerModal visible={showDatePicker} onClose={() => setShowDatePicker(false)} onSelectDate={setData} initialDate={data} />
                        
                        {isDraft ? (
                            <CustomDropdown label="Pirkėjas" options={pirkejaiOptions} selectedValue={entityName} onSelect={setEntityName} />
                        ) : (
                            <CustomDropdown label="Tiekėjas" options={tiekejaiOptions} selectedValue={entityName} onSelect={setEntityName} />
                        )}

                        <Text style={globalStyles.inputLabel}>Sąskaitos Nr.:</Text>
                        <TextInput style={globalStyles.input} value={saskaitosNr} onChangeText={setSaskaitosNr} />
                        
                        <CustomDropdown label="Mokėjimo paskirtis" options={mokejimoPaskirtisOptions} selectedValue={mokejimoPaskirtis} onSelect={setMokejimoPaskirtis} />
                        
                        {!isDraft && (
                            <CustomDropdown label="Rūšis" options={rusysOptions} selectedValue={rusis} onSelect={setRusis} />
                        )}

                        <Text style={globalStyles.inputLabel}>Apmokėti iki:</Text>
                        <TouchableOpacity style={globalStyles.input} onPress={() => setShowApmoketiIkiDatePicker(true)}><Text>{apmoketiIki}</Text></TouchableOpacity>
                        <DatePickerModal visible={showApmoketiIkiDatePicker} onClose={() => setShowApmoketiIkiDatePicker(false)} onSelectDate={setApmoketiIki} initialDate={apmoketiIki} />
                        
                        <Text style={globalStyles.inputLabel}>Komentaras:</Text>
                        <TextInput style={[globalStyles.input, {height: 80, textAlignVertical: 'top'}]} value={comment} onChangeText={setComment} multiline/>
                        
                        {isDraft && onGeneratePdf && (
                             <TouchableOpacity style={[globalStyles.button, {backgroundColor: colors.accent, marginTop: 16}]} onPress={onGeneratePdf}>
                                <Text style={globalStyles.buttonText}>Generuoti PDF (išjungta)</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={[globalStyles.button, {marginTop: 8}]} onPress={handleSave}>
                            <Text style={globalStyles.buttonText}>Išsaugoti pakeitimus</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[globalStyles.button, globalStyles.cancelButton]} onPress={onClose}>
                            <Text style={globalStyles.buttonText}>Atšaukti</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}