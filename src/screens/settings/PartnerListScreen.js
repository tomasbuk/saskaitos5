// FILE: src/screens/settings/PartnerListScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, ScrollView } from 'react-native';
import { SettingsContext } from '../../contexts/SettingsContext';
import { styles as globalStyles, colors, spacing, borderRadius } from '../../utils/styles';

const SettingsListManager = ({ options, setOptions }) => {
    const [newItem, setNewItem] = useState('');
    const handleAddItem = () => { const trimmedItem = newItem.trim(); if (trimmedItem === '') { return Alert.alert('Klaida', 'Reikšmė negali būti tuščia.'); } if (options.some(option => option.toLowerCase() === trimmedItem.toLowerCase())) { return Alert.alert('Klaida', 'Tokia reikšmė jau egzistuoja sąraše.'); } setOptions(prev => [trimmedItem, ...prev].sort((a, b) => a.localeCompare(b))); setNewItem(''); };
    const handleRemoveItem = (itemToRemove) => { Alert.alert('Ištrinti', `Ar tikrai norite ištrinti "${itemToRemove}"?`, [{ text: 'Atšaukti', style: 'cancel' }, { text: 'Ištrinti', style: 'destructive', onPress: () => setOptions(prev => prev.filter(item => item !== itemToRemove)) }]); };
    return (
        <View><View style={styles.inputContainer}><TextInput style={styles.input} placeholder="Įveskite naują reikšmę..." value={newItem} onChangeText={setNewItem} /><TouchableOpacity style={styles.addButton} onPress={handleAddItem}><Text style={styles.addButtonText}>+</Text></TouchableOpacity></View><FlatList style={{ maxHeight: 250 }} nestedScrollEnabled={true} data={options} keyExtractor={(item) => item} renderItem={({ item }) => ( <View style={styles.listItem}><Text style={styles.listItemText}>{item}</Text><TouchableOpacity onPress={() => handleRemoveItem(item)}><Text style={styles.removeButtonText}>⊗</Text></TouchableOpacity></View> )} ListEmptyComponent={<Text style={styles.emptyListText}>Sąrašas tuščias.</Text>} /></View>
    );
};

export default function PartnerListScreen() {
    const { tiekejaiOptions, setTiekejaiOptions, pirkejaiOptions, setPirkejaiOptions } = useContext(SettingsContext);
    return (
        <ScrollView style={globalStyles.screenContent}>
            <View style={globalStyles.inputSection}>
                <Text style={styles.sectionTitle}>Tiekėjų Valdymas</Text>
                <SettingsListManager options={tiekejaiOptions} setOptions={setTiekejaiOptions} />
            </View>
            <View style={globalStyles.inputSection}>
                <Text style={styles.sectionTitle}>Pirkėjų Valdymas</Text>
                <SettingsListManager options={pirkejaiOptions} setOptions={setPirkejaiOptions} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    sectionTitle: { ...globalStyles.inputTitle, textAlign: 'left', fontSize: 18, marginBottom: 16 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    input: { ...globalStyles.input, flex: 1, marginBottom: 0, marginRight: 8 },
    addButton: { backgroundColor: colors.primary, width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    addButtonText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
    listItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    listItemText: { fontSize: 16, color: colors.textPrimary, flexShrink: 1, marginRight: 8 },
    removeButtonText: { color: colors.danger, fontSize: 24 },
    emptyListText: { textAlign: 'center', color: colors.textSecondary, padding: 10 },
});