// FILE: src/screens/start/SummaryScreen.js
import React, { useMemo, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { InvoicesContext } from '../../contexts/InvoicesContext';
import { styles as globalStyles, colors, spacing, borderRadius } from '../../utils/styles';

const StatCard = ({ title, stats }) => (
    <View style={globalStyles.inputSection}>
        <Text style={styles.cardTitle}>{title}</Text>
        {stats.map(stat => (
            <View key={stat.label} style={styles.statRow}>
                <Text style={styles.statLabel}>{stat.label}:</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
            </View>
        ))}
    </View>
);

export default function SummaryScreen() {
    const { saskaitos, draftSaskaitos } = useContext(InvoicesContext);

    const summary = useMemo(() => {
        const received = saskaitos.reduce((acc, inv) => {
            acc.total += inv.suma;
            if (inv.busena === 'Neapmokėta' || inv.busena === 'Dalinai apmokėta') {
                acc.unpaidCount++;
                acc.unpaidSum += inv.suma - inv.paidSuma;
            }
            return acc;
        }, { total: 0, unpaidSum: 0, unpaidCount: 0, count: saskaitos.length });

        const drafts = draftSaskaitos.reduce((acc, inv) => {
            acc.total += inv.suma;
            if (inv.busena === 'Neapmokėta' || inv.busena === 'Dalinai apmokėta') {
                acc.unpaidCount++;
                acc.unpaidSum += inv.suma - inv.paidSuma;
            }
            return acc;
        }, { total: 0, unpaidSum: 0, unpaidCount: 0, count: draftSaskaitos.length });

        return { received, drafts, overdueTotal: received.unpaidCount + drafts.unpaidCount };
    }, [saskaitos, draftSaskaitos]);

    return (
        <ScrollView style={globalStyles.screenContent} contentContainerStyle={{ padding: spacing.medium }}>
            <View style={styles.logoContainer}>
                {/* Čia bus jūsų logotipas! */}
                <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
            
            {summary.overdueTotal > 0 ? (
                <View style={[globalStyles.inputSection, { backgroundColor: colors.warning }]}>
                    <Text style={[styles.cardTitle, { color: 'white' }]}>⚠️ Vėluojantys mokėjimai</Text>
                    <Text style={{color: 'white', textAlign: 'center'}}>Iš viso yra {summary.overdueTotal} vnt. vėluojančių apmokėti sąskaitų.</Text>
                </View>
            ) : (
                 <View style={[globalStyles.inputSection, { backgroundColor: colors.accent }]}>
                    <Text style={[styles.cardTitle, { color: 'white' }]}>✅ Viskas Puiku!</Text>
                    <Text style={{color: 'white', textAlign: 'center'}}>Neturite vėluojančių apmokėti sąskaitų.</Text>
                </View>
            )}

            <StatCard title="📄 Gautos Sąskaitos" stats={[
                { label: 'Viso gauta', value: `${summary.received.count} vnt.` },
                { label: 'Bendra suma', value: `${summary.received.total.toFixed(2)} €` },
                { label: 'Laukia apmokėjimo', value: `${summary.received.unpaidSum.toFixed(2)} € (${summary.received.unpaidCount} vnt.)` },
            ]}/>
            <StatCard title="🖊️ Išrašytos Sąskaitos" stats={[
                { label: 'Viso išrašyta', value: `${summary.drafts.count} vnt.` },
                { label: 'Bendra suma', value: `${summary.drafts.total.toFixed(2)} €` },
                { label: 'Laukia apmokėjimo', value: `${summary.drafts.unpaidSum.toFixed(2)} € (${summary.drafts.unpaidCount} vnt.)` },
            ]}/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    logoContainer: { alignItems: 'center', marginBottom: spacing.medium },
    logo: { width: 150, height: 75 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginBottom: spacing.medium },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.small, borderBottomWidth: 1, borderBottomColor: colors.border },
    statLabel: { fontSize: 16, color: colors.textSecondary },
    statValue: { fontSize: 16, color: colors.textPrimary, fontWeight: '600' },
});