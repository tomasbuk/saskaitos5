// FILE: src/screens/ReportsScreen.js
// PATAISYMAS: Pašalintas senas stilių mechanizmas ir pakeistas nauju tiesioginiu importu.

import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../utils/styles';

export default function ReportsScreen() {
    return (
        <View style={[styles.screenContent, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.inputTitle}>Ataskaitos</Text>
            <Text style={styles.inputLabel}>Ši skiltis yra kuriama.</Text>
        </View>
    );
}