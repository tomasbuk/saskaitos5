// FILE: src/screens/settings/GeneralSettingsScreen.js
import React, { useContext } from 'react';
import { View, Text, TextInput, ScrollView, Switch, StyleSheet } from 'react-native';
import { SettingsContext } from '../../contexts/SettingsContext';
import { styles as globalStyles, colors, spacing, typography } from '../../utils/styles';

export default function GeneralSettingsScreen() {
    const settings = useContext(SettingsContext);
    return (
        <ScrollView style={globalStyles.screenContent}>
            <View style={globalStyles.inputSection}>
                <Text style={styles.sectionTitle}>Sąskaitų Serijos Nustatymai</Text>
                <Text style={globalStyles.inputLabel}>Išrašomų sąskaitų serija (pvz., GK-)</Text>
                <TextInput style={globalStyles.input} value={settings.draftInvoiceSeries} onChangeText={settings.setDraftInvoiceSeries}/>
                <Text style={globalStyles.inputLabel}>Paskutinis išrašytos sąskaitos numeris</Text>
                <TextInput style={globalStyles.input} value={settings.draftInvoiceLastNumber} onChangeText={settings.setDraftInvoiceLastNumber} keyboardType="number-pad"/>
            </View>
            <View style={globalStyles.inputSection}>
                <Text style={styles.sectionTitle}>Antraščių Tekstai (PDF Eksportui)</Text>
                <Text style={globalStyles.inputLabel}>Antraštės tekstas (kairė)</Text>
                <TextInput style={globalStyles.input} value={settings.headerLeftText} onChangeText={settings.setHeaderLeftText}/>
                <Text style={globalStyles.inputLabel}>Antraštės tekstas (dešinė)</Text>
                <TextInput style={globalStyles.input} value={settings.headerRightText} onChangeText={settings.setHeaderRightText}/>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    sectionTitle: { ...globalStyles.inputTitle, textAlign: 'left', fontSize: 18, marginBottom: 16 },
});