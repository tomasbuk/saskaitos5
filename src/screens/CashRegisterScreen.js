// FILE: src/screens/CashRegisterScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { CashContext } from '../contexts/CashContext';
import { styles as globalStyles, colors, spacing, typography } from '../utils/styles';

export default function CashRegisterScreen() {
    const { cashRegisterBalance, safeBalance, bankBalance } = useContext(CashContext);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Kasos Likutis</Text>
                <Text style={styles.balanceAmount}>{(Number(cashRegisterBalance) || 0).toFixed(2)} €</Text>
            </View>
            <View style={styles.subBalanceContainer}>
                <View style={styles.subBalanceBox}>
                    <Text style={styles.subBalanceLabel}>Seife</Text>
                    <Text style={styles.subBalanceValue}>{(Number(safeBalance) || 0).toFixed(2)} €</Text>
                </View>
                <View style={styles.subBalanceBox}>
                    <Text style={styles.subBalanceLabel}>Banke</Text>
                    <Text style={styles.subBalanceValue}>{(Number(bankBalance) || 0).toFixed(2)} €</Text>
                </View>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={globalStyles.inputLabel}>Daugiau funkcijų bus pridėta vėliau.</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    balanceContainer: {
        padding: spacing.large,
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderColor: colors.border
    },
    balanceLabel: {
        fontSize: 18,
        color: colors.textSecondary,
    },
    balanceAmount: {
        fontSize: 42,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginVertical: spacing.small,
    },
    subBalanceContainer: {
        flexDirection: 'row',
        padding: spacing.small,
        backgroundColor: colors.surface,
    },
    subBalanceBox: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.medium,
    },
    subBalanceLabel: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    subBalanceValue: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    }
});