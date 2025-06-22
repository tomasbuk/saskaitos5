// FILE: src/screens/settings/DangerZoneScreen.js

import React, { useContext } from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import SettingsItem from '../../components/SettingsItem';
import { SettingsContext } from '../../contexts/SettingsContext';
import { styles as globalStyles, spacing } from '../../utils/styles';

export default function DangerZoneScreen() {
    const settings = useContext(SettingsContext);

    const handleClearAllData = () => {
        Alert.alert( "Dėmesio! Visi duomenys bus ištrinti!", "Ar tikrai norite ištrinti visas sąskaitas, operacijas ir nustatymus? Šio veiksmo negalėsite atšaukti.",
            [
                { text: 'Atšaukti', style: 'cancel' },
                { text: 'Ištrinti viską', style: 'destructive', onPress: async () => { 
                    try {
                        await AsyncStorage.clear();
                        Alert.alert('Sėkmė', 'Visi duomenys ištrinti. Perkraukite programėlę, kad pamatytumėte pakeitimus.');
                    } catch (e) {
                        Alert.alert('Klaida', 'Nepavyko išvalyti duomenų.');
                    }
                }}
            ]
        );
    };

    return (
        <ScrollView style={globalStyles.screenContent}>
            <View style={{ padding: spacing.medium }}>
                <Text style={globalStyles.listTitle}>Pavojinga Zona</Text>
                
                <SettingsItem
                    title="Išvalyti VISUS Programėlės Duomenis"
                    icon="🔥"
                    onPress={handleClearAllData}
                    isDanger={true}
                />
            </View>
        </ScrollView>
    );
}