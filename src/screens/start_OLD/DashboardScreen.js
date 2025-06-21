// FILE: src/screens/start/DashboardScreen.js
import React, { useMemo, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { InvoicesContext } from '../../contexts/InvoicesContext';
import { styles as globalStyles, colors, spacing, borderRadius } from '../../utils/styles';

const StatCard = ({ title, value, color = colors.textPrimary }) => (
    <View style={styles.statCard}>
        <Text style={styles.statCardTitle}>{title}</Text>
        <Text style={[styles.statCardValue, { color }]}>{value}</Text>
    </View>
);

export default function DashboardScreen({ navigation }) {
    const { saskaitos, draftSaskaitos } = useContext(InvoicesContext);
    
    const summary = useMemo(() => {
        let overdueCount = 0;
        let overdueSum = 0;
        let unpaidReceivedSum = 0;
        let unpaidDraftsSum = 0;
        const now = new Date();
        now.setHours(0,0,0,0);
        
        saskaitos.forEach(inv => {
            if (inv.busena === 'Neapmokėta' || inv.busena === 'Dalinai apmokėta') {
                unpaidReceivedSum += (inv.suma - inv.paidSuma);
                if (new Date(inv.apmoketiIki) < now) {
                    overdueCount++;
                    overdueSum += (inv.suma - inv.paidSuma);
                }
            }
        });

        draftSaskaitos.forEach(inv => {
             if (inv.busena === 'Neapmokėta' || inv.busena === 'Dalinai apmokėta') {
                unpaidDraftsSum += (inv.suma - inv.paidSuma);
                if (new Date(inv.apmoketiIki) < now) {
                    overdueCount++;
                    overdueSum += (inv.suma - inv.paidSuma);
                }
            }
        });
        
        return { overdueCount, overdueSum, unpaidReceivedSum, unpaidDraftsSum };
    }, [saskaitos, draftSaskaitos]);

    return (
        <View style={globalStyles.screenContent}>
            {summary.overdueCount > 0 ? (
                <TouchableOpacity style={[styles.heroCard, { backgroundColor: colors.danger }]}>
                    <Text style={styles.heroTitle}>⚠️ Vėluojama apmokėti {summary.overdueCount} sąskaitų!</Text>
                    <Text style={styles.heroValue}>{summary.overdueSum.toFixed(2)} €</Text>
                    <Text style={styles.heroSubtext}>(paspauskite norėdami matyti)</Text>
                </TouchableOpacity>
            ) : (
                 <View style={[styles.heroCard, { backgroundColor: colors.accent }]}>
                    <Text style={styles.heroTitle}>✅ Viskas Puiku!</Text>
                    <Text style={styles.heroSubtext}>Neturite pradelstų sąskaitų.</Text>
                </View>
            )}

            <View style={styles.grid}>
                <StatCard title="Laukia apmokėjimo (Gautos)" value={`${summary.unpaidReceivedSum.toFixed(2)} €`} color={colors.warning} />
                <StatCard title="Laukia apmokėjimo (Išrašytos)" value={`${summary.unpaidDraftsSum.toFixed(2)} €`} color={colors.warning} />
                <StatCard title="Gautų sąskaitų" value={`${saskaitos.length} vnt.`} />
                <StatCard title="Išrašytų sąskaitų" value={`${draftSaskaitos.length} vnt.`} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    heroCard: { padding: spacing.large, borderRadius: borderRadius.medium, margin: spacing.medium, alignItems: 'center', elevation: 4 },
    heroTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    heroValue: { fontSize: 28, fontWeight: 'bold', color: 'white', marginVertical: spacing.small },
    heroSubtext: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: spacing.small },
    statCard: { width: '48%', backgroundColor: colors.surface, padding: spacing.medium, borderRadius: borderRadius.medium, alignItems: 'center', marginBottom: spacing.small, elevation: 2 },
    statCardTitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.small },
    statCardValue: { fontSize: 20, fontWeight: 'bold' },
});