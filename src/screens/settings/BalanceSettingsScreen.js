// FILE: src/screens/settings/BalanceSettingsScreen.js
import React, { useContext, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CashContext } from '../../contexts/CashContext';
import { styles as globalStyles, spacing } from '../../utils/styles';
import * as C from '../../constants';

export default function BalanceSettingsScreen() {
    const { cashRegisterBalance, setCashRegisterBalance, safeBalance, setSafeBalance, bankBalance, setBankBalance } = useContext(CashContext);

    const handleBalanceChange = async (text, setter, storageKey) => {
        const numString = text.replace(/[^0-9.,]/g, '').replace(',', '.');
        const num = parseFloat(numString);
        
        setter(numString); 

        if (!isNaN(num)) {
            try {
                await AsyncStorage.setItem(storageKey, String(num));
            } catch (e) {
                console.error("Failed to save initial balance.", e);
            }
        }
    };

    const handleBalanceEndEditing = (text, setter) => {
        const num = parseFloat(String(text).replace(',', '.'));
        setter(isNaN(num) ? 0 : num);
    };
    
    // Šis efektas įkrauna pradinius likučius į dabartinę būseną TIK atidarius ekraną
    useEffect(() => {
        const loadInitialBalances = async () => {
            const initialCash = await AsyncStorage.getItem(C.STORAGE_KEY_INITIAL_CASH_BALANCE) || '0';
            const initialSafe = await AsyncStorage.getItem(C.STORAGE_KEY_INITIAL_SAFE_BALANCE) || '0';
            const initialBank = await AsyncStorage.getItem(C.STORAGE_KEY_INITIAL_BANK_BALANCE) || '0';
            setCashRegisterBalance(parseFloat(initialCash));
            setSafeBalance(parseFloat(initialSafe));
            setBankBalance(parseFloat(initialBank));
        };
        loadInitialBalances();
    // PATAISYMAS: Pridėtos trūkstamos priklausomybės, kad atitiktų ESLint taisykles.
    }, [setCashRegisterBalance, setSafeBalance, setBankBalance]);

    return (
        <ScrollView style={globalStyles.screenContent}>
             <View style={[globalStyles.inputSection, { margin: spacing.medium }]}>
                <Text style={globalStyles.inputLabel}>Pradinis kasos likutis (EUR)</Text>
                <TextInput 
                    style={globalStyles.input} 
                    value={String(cashRegisterBalance)} 
                    // Pakeista į onEndEditing, kad išsaugojimas vyktų tik baigus redaguoti
                    onEndEditing={(e) => handleBalanceChange(e.nativeEvent.text, setCashRegisterBalance, C.STORAGE_KEY_INITIAL_CASH_BALANCE)} 
                    onChangeText={setCashRegisterBalance} // Paliekame, kad vartotojas matytų, ką rašo
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                />
                
                <Text style={globalStyles.inputLabel}>Pradinis seifo likutis (EUR)</Text>
                <TextInput 
                    style={globalStyles.input} 
                    value={String(safeBalance)} 
                    onEndEditing={(e) => handleBalanceChange(e.nativeEvent.text, setSafeBalance, C.STORAGE_KEY_INITIAL_SAFE_BALANCE)}
                    onChangeText={setSafeBalance} 
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                />
                
                <Text style={globalStyles.inputLabel}>Pradinis banko likutis (EUR)</Text>
                <TextInput 
                    style={globalStyles.input} 
                    value={String(bankBalance)} 
                    onEndEditing={(e) => handleBalanceChange(e.nativeEvent.text, setBankBalance, C.STORAGE_KEY_INITIAL_BANK_BALANCE)}
                    onChangeText={setBankBalance} 
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                />
            </View>
        </ScrollView>
    );
}