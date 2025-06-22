// FILE: src/screens/SettingsScreen.js
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { styles as globalStyles } from '../utils/styles';

export default function SettingsScreen() {
    return (
        <ScrollView style={globalStyles.screenContent}>
            <View style={globalStyles.inputSection}>
                <Text style={globalStyles.inputTitle}>Nustatymai</Text>
                <Text>Ši skiltis yra tobulinama.</Text>
                <Text>Ateityje čia galėsite valdyti tiekėjų, pirkėjų ir kitus sąrašus.</Text>
            </View>
        </ScrollView>
    );
}