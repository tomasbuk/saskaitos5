// FILE: src/screens/AddDraftInvoiceScreen.js

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { InvoicesContext } from '../contexts/InvoicesContext';
import { SettingsContext } from '../contexts/SettingsContext';
import CustomDropdown from '../components/CustomDropdown';
import DatePickerModal from '../components/DatePickerModal';
import { styles } from '../utils/styles';
import { showCustomAlert, incrementInvoiceNumberGenerator, findHighestDraftInvoiceNumber } from '../utils/helpers';

export default function AddDraftInvoiceScreen({ navigation }) {
  const { draftSaskaitos, handleAddDraftInvoice } = useContext(InvoicesContext);
  const { pirkejaiOptions, busenaOptions, mokejimoPaskirtisOptions, draftInvoiceSeries, draftInvoiceLastNumber, setDraftInvoiceLastNumber } = useContext(SettingsContext);

  const [data, setData] = useState('');
  const [saskaitosNr, setSaskaitosNr] = useState('');
  const [pirkejas, setPirkejas] = useState('');
  const [mokejimoPaskirtis, setMokejimoPaskirtis] = useState('');
  const [suma, setSuma] = useState('');
  const [paidSuma, setPaidSuma] = useState('0');
  const [busena, setBusena] = useState('');
  const [comment, setComment] = useState('');
  const [apmoketiIki, setApmoketiIki] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showApmoketiIkiDatePicker, setShowApmoketiIkiDatePicker] = useState(false);

  useEffect(() => {
    setData(new Date().toISOString().split('T')[0]);

    const defaultApmoketiIki = new Date();
    defaultApmoketiIki.setDate(defaultApmoketiIki.getDate() + 30);
    setApmoketiIki(defaultApmoketiIki.toISOString().split('T')[0]);

    if (mokejimoPaskirtisOptions.length > 0) setMokejimoPaskirtis(mokejimoPaskirtisOptions[0]);
    if (busenaOptions.length > 0) setBusena(busenaOptions[0]);

    const highestNum = findHighestDraftInvoiceNumber(draftSaskaitos, draftInvoiceSeries, draftInvoiceLastNumber);
    setSaskaitosNr(incrementInvoiceNumberGenerator(draftInvoiceSeries, highestNum));
    // PATAISYMAS: Į priklausomybių sąrašą įtraukti trūkstami kintamieji, kuriuos naudoja efektas.
  }, [draftSaskaitos, draftInvoiceSeries, draftInvoiceLastNumber, busenaOptions, mokejimoPaskirtisOptions]);

  const handleSubmit = () => {
    if (!data || !saskaitosNr || !pirkejas || !mokejimoPaskirtis || !suma || !apmoketiIki) {
      showCustomAlert('Klaida', 'Prašome užpildyti visus privalomus laukus!');
      return;
    }
    const parsedSuma = parseFloat(suma.replace(',', '.'));
    const parsedPaidSuma = parseFloat(paidSuma.replace(',', '.'));
    if (isNaN(parsedSuma) || parsedSuma <= 0 || isNaN(parsedPaidSuma) || parsedPaidSuma < 0 || parsedPaidSuma > parsedSuma) {
      showCustomAlert('Klaida', 'Neteisingai įvesta suma.');
      return;
    }
    let newBusena = busena;
    if (parsedPaidSuma >= parsedSuma) newBusena = 'Apmokėta';
    else if (parsedPaidSuma > 0) newBusena = 'Dalinai apmokėta';
    else newBusena = 'Neapmokėta';

    const numericPart = saskaitosNr.replace(draftInvoiceSeries, '');
    if (parseInt(numericPart) > parseInt(draftInvoiceLastNumber)) {
      setDraftInvoiceLastNumber(numericPart);
    }

    handleAddDraftInvoice({ data, saskaitosNr, pirkejas, mokejimoPaskirtis, suma: parsedSuma, paidSuma: parsedPaidSuma, busena: newBusena, comment, apmoketiIki });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.screenContent} contentContainerStyle={{paddingBottom: 50}}>
      <View style={[styles.inputSection, {marginTop: 20}]}>
        <Text style={styles.inputTitle}>Nauja Išrašoma Sąskaita</Text>

        <Text style={styles.inputLabel}>Data (YYYY-MM-DD):</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}><Text>{data}</Text></TouchableOpacity>
        <DatePickerModal visible={showDatePicker} onClose={() => setShowDatePicker(false)} onSelectDate={setData} initialDate={data} />

        <Text style={styles.inputLabel}>Apmokėti iki (YYYY-MM-DD):</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowApmoketiIkiDatePicker(true)}><Text>{apmoketiIki}</Text></TouchableOpacity>
        <DatePickerModal visible={showApmoketiIkiDatePicker} onClose={() => setShowApmoketiIkiDatePicker(false)} onSelectDate={setApmoketiIki} initialDate={apmoketiIki} />

        <Text style={styles.inputLabel}>Sąskaitos Nr.:</Text>
        <TextInput style={styles.input} value={saskaitosNr} onChangeText={setSaskaitosNr} />

        <CustomDropdown label="Pirkėjas" options={pirkejaiOptions} selectedValue={pirkejas} onSelect={setPirkejas} placeholder="Pasirinkite pirkėją" />
        <CustomDropdown label="Mokėjimo paskirtis" options={mokejimoPaskirtisOptions} selectedValue={mokejimoPaskirtis} onSelect={setMokejimoPaskirtis} placeholder="Pasirinkite paskirtį" />

        <Text style={styles.inputLabel}>Suma (EUR):</Text>
        <TextInput style={styles.input} value={suma} onChangeText={(text) => setSuma(text.replace(',', '.'))} keyboardType="decimal-pad" placeholder="pvz., 250.00"/>

        <Text style={styles.inputLabel}>Apmokėta suma (EUR):</Text>
        <TextInput style={styles.input} value={paidSuma} onChangeText={(text) => setPaidSuma(text.replace(',', '.'))} keyboardType="decimal-pad" placeholder="0.00"/>

        <CustomDropdown label="Būsena" options={busenaOptions} selectedValue={busena} onSelect={setBusena} placeholder="Pasirinkite būseną" />

        <Text style={styles.inputLabel}>Komentaras:</Text>
        <TextInput style={[styles.input, {height: 80, textAlignVertical: 'top'}]} value={comment} onChangeText={setComment} multiline placeholder="Neprivaloma"/>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Išrašyti Sąskaitą</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Atšaukti</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}