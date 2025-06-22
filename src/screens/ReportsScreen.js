// FILE: src/screens/ReportsScreen.js

import React from 'react';
import { View, Text } from 'react-native';
import { styles as globalStyles } from '../utils/styles';

export default function ReportsScreen() {
    return (
        <View style={[globalStyles.screenContent, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={globalStyles.inputTitle}>Ataskaitos</Text>
            <Text style={globalStyles.inputLabel}>Ši skiltis yra kuriama.</Text>
        </View>
    );
}