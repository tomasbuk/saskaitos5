// FILE: src/screens/start/AnalyticsScreen.js
import React, { useMemo, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { InvoicesContext } from '../../contexts/InvoicesContext';
import { CashContext } from '../../contexts/CashContext';
import { styles as globalStyles, colors, spacing, borderRadius } from '../../utils/styles';

export default function AnalyticsScreen() {
    const { saskaitos, draftSaskaitos } = useContext(InvoicesContext);
    const { cashRegisterBalance, safeBalance, bankBalance } = useContext(CashContext);

    // Paprasta logika paskutinių 3 mėn. pajamų/išlaidų grafikui
    const chartData = useMemo(() => {
        const months = [2, 1, 0].map(i => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return { month: d.toLocaleString('lt-LT', { month: 'short' }), year: d.getFullYear(), income: 0, expense: 0 };
        });

        draftSaskaitos.forEach(inv => {
            const invDate = new Date(inv.data);
            const monthIndex = months.findIndex(m => m.month === invDate.toLocaleString('lt-LT', { month: 'short' }) && m.year === invDate.getFullYear());
            if (monthIndex > -1) months[monthIndex].income += inv.suma;
        });

        saskaitos.forEach(inv => {
            const invDate = new Date(inv.data);
            const monthIndex = months.findIndex(m => m.month === invDate.toLocaleString('lt-LT', { month: 'short' }) && m.year === invDate.getFullYear());
            if (monthIndex > -1) months[monthIndex].expense += inv.suma;
        });

        const maxVal = Math.max(...months.map(m => m.income), ...months.map(m => m.expense));
        return { months, maxVal: maxVal === 0 ? 1 : maxVal };
    }, [saskaitos, draftSaskaitos]);

    const totalBalance = cashRegisterBalance + safeBalance + bankBalance;

    return (
        <ScrollView style={globalStyles.screenContent} contentContainerStyle={{ padding: spacing.medium }}>
            <View style={globalStyles.inputSection}>
                <Text style={styles.chartTitle}>Pajamos vs. Išlaidos (pask. 3 mėn.)</Text>
                <View style={styles.chartContainer}>
                    {chartData.months.map(data => (
                        <View key={data.month} style={styles.barGroup}>
                            <View style={styles.barWrapper}>
                                <View style={[styles.bar, styles.incomeBar, { height: `${(data.income / chartData.maxVal) * 100}%` }]} />
                                <View style={[styles.bar, styles.expenseBar, { height: `${(data.expense / chartData.maxVal) * 100}%` }]} />
                            </View>
                            <Text style={styles.barLabel}>{data.month.replace('.', '')}</Text>
                        </View>
                    ))}
                </View>
                 <View style={styles.legendContainer}>
                    <View style={styles.legendItem}><View style={[styles.legendColor, styles.incomeBar]} /><Text>Pajamos</Text></View>
                    <View style={styles.legendItem}><View style={[styles.legendColor, styles.expenseBar]} /><Text>Išlaidos</Text></View>
                </View>
            </View>
            <View style={globalStyles.inputSection}>
                 <Text style={styles.chartTitle}>Svarbiausi Rodikliai</Text>
                 <View style={styles.kpiRow}>
                     <Text style={styles.kpiLabel}>Bendras Pinigų Likutis:</Text>
                     <Text style={[styles.kpiValue, {color: colors.primary}]}>{totalBalance.toFixed(2)} €</Text>
                 </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    chartTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginBottom: spacing.large, textAlign: 'center' },
    chartContainer: { flexDirection: 'row', height: 150, alignItems: 'flex-end', justifyContent: 'space-around', borderBottomWidth: 1, borderColor: colors.border },
    barGroup: { flex: 1, alignItems: 'center' },
    barWrapper: { flexDirection: 'row', height: '100%', alignItems: 'flex-end', justifyContent: 'center', width: '60%' },
    bar: { width: '40%', borderRadius: 4, marginHorizontal: '5%' },
    incomeBar: { backgroundColor: colors.accent },
    expenseBar: { backgroundColor: colors.warning },
    barLabel: { marginTop: spacing.small, fontSize: 12, color: colors.textSecondary },
    legendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.medium, gap: spacing.large },
    legendItem: { flexDirection: 'row', alignItems: 'center' },
    legendColor: { width: 14, height: 14, borderRadius: 7, marginRight: spacing.small },
    kpiRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.medium },
    kpiLabel: { fontSize: 16, color: colors.textSecondary },
    kpiValue: { fontSize: 18, fontWeight: 'bold' },
});