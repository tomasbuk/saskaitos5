// FILE: src/screens/settings/BalanceSettingsScreen.js
import React, { useContext } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { CashContext } from '../../contexts/CashContext';
import { styles as globalStyles, spacing } from '../../utils/styles';

export default function BalanceSettingsScreen() {
    const { cashRegisterBalance, setCashRegisterBalance, safeBalance, setSafeBalance, bankBalance, setBankBalance } = useContext(CashContext);

    // Ši funkcija leidžia patogiai įvesti kablelį ir matyti pakeitimus iškart
    const handleBalanceChange = (text, setter) => {
        const num = text.replace(/[^0-9.,]/g, '').replace(',', '.');
        setter(num); // Laikinai nustatome kaip tekstą, kad leistų rašyti
    };

    // Ši funkcija, baigus redaguoti, užtikrina, kad būtų išsaugotas skaičius
    const handleBalanceEndEditing = (text, setter) => {
        const num = parseFloat(String(text).replace(',', '.'));
        setter(isNaN(num) ? 0 : num); // Jei įvesta nesąmonė, nustatom 0, kitu atveju - skaičių
    };
    
    return (
        <ScrollView style={globalStyles.screenContent}>
             <View style={[globalStyles.inputSection, { margin: spacing.medium }]}>
                <Text style={globalStyles.inputLabel}>Kasos likutis (EUR)</Text>
                <TextInput 
                    style={globalStyles.input} 
                    value={String(cashRegisterBalance)} 
                    onChangeText={(text) => handleBalanceChange(text, setCashRegisterBalance)} 
                    onEndEditing={(e) => handleBalanceEndEditing(e.nativeEvent.text, setCashRegisterBalance)} 
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                />
                
                <Text style={globalStyles.inputLabel}>Seifo likutis (EUR)</Text>
                <TextInput 
                    style={globalStyles.input} 
                    value={String(safeBalance)} 
                    onChangeText={(text) => handleBalanceChange(text, setSafeBalance)} 
                    onEndEditing={(e) => handleBalanceEndEditing(e.nativeEvent.text, setSafeBalance)} 
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                />
                
                <Text style={globalStyles.inputLabel}>Banko likutis (EUR)</Text>
                <TextInput 
                    style={globalStyles.input} 
                    value={String(bankBalance)} 
                    onChangeText={(text) => handleBalanceChange(text, setBankBalance)} 
                    onEndEditing={(e) => handleBalanceEndEditing(e.nativeEvent.text, setBankBalance)} 
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                />
            </View>
        </ScrollView>
    );
}