// FILE: src/screens/StartScreen.js

import React, { useMemo, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { InvoicesContext } from '../contexts/InvoicesContext';
import { styles as globalStyles, colors, spacing, borderRadius } from '../utils/styles';

const StatCard = ({ title, value, color = colors.textPrimary }) => (
    <View style={styles.statCard}>
        <View style={styles.statCardContent}>
            <Text style={styles.statCardTitle}>{title}</Text>
            <Text style={[styles.statCardValue, { color }]}>{value}</Text>
        </View>
    </View>
);

export default function StartScreen({ navigation }) {
    const { saskaitos, draftSaskaitos } = useContext(InvoicesContext);
    
    const summary = useMemo(() => {
        let overdueReceivedCount = 0;
        let overdueReceivedSum = 0;
        let overdueDraftsCount = 0;
        let overdueDraftsSum = 0;
        let unpaidReceivedSum = 0;
        let unpaidDraftsSum = 0;
        
        const now = new Date();
        const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

        const isOverdue = (invoice) => {
            if (invoice.busena !== 'Neapmokėta' && invoice.busena !== 'Dalinai apmokėta') return false;
            if (!invoice.apmoketiIki || typeof invoice.apmoketiIki !== 'string' || !invoice.apmoketiIki.includes('-')) return false;
            const parts = invoice.apmoketiIki.split('-');
            if (parts.length !== 3) return false;
            const dueDate = new Date(Date.UTC(parts[0], parseInt(parts[1], 10) - 1, parts[2]));
            if (isNaN(dueDate.getTime())) return false;
            return dueDate < todayUTC;
        };
        
        saskaitos.forEach(inv => {
            if (inv.busena === 'Neapmokėta' || inv.busena === 'Dalinai apmokėta') {
                unpaidReceivedSum += (inv.suma - (inv.paidSuma || 0));
            }
            if (isOverdue(inv)) {
                overdueReceivedCount++;
                overdueReceivedSum += (inv.suma - (inv.paidSuma || 0));
            }
        });

        draftSaskaitos.forEach(inv => {
             if (inv.busena === 'Neapmokėta' || inv.busena === 'Dalinai apmokėta') {
                unpaidDraftsSum += (inv.suma - (inv.paidSuma || 0));
            }
            if (isOverdue(inv)) {
                overdueDraftsCount++;
                overdueDraftsSum += (inv.suma - (inv.paidSuma || 0));
            }
        });
        
        return { 
            overdueReceivedCount, overdueReceivedSum, 
            overdueDraftsCount, overdueDraftsSum,
            unpaidReceivedSum, unpaidDraftsSum 
        };
    }, [saskaitos, draftSaskaitos]);

    const hasOverdue = summary.overdueReceivedCount > 0 || summary.overdueDraftsCount > 0;

    return (
        <ScrollView style={globalStyles.screenContent}>
            <View style={{padding: spacing.medium}}>
                
                {/* PATAISYMAS: Visi perspėjimai dabar yra vienoje kompaktiškoje juostoje */}
                {hasOverdue ? (
                    <View style={styles.warningBar}>
                        {summary.overdueReceivedCount > 0 && (
                            <Text style={styles.warningText}>
                                ⚠️ Vėluojate apmokėti {summary.overdueReceivedCount} sąsk. ({summary.overdueReceivedSum.toFixed(2)} €)
                            </Text>
                        )}
                        {summary.overdueDraftsCount > 0 && (
                            <Text style={styles.warningText}>
                                ⏱️ Jums vėluoja apmokėti {summary.overdueDraftsCount} sąsk. ({summary.overdueDraftsSum.toFixed(2)} €)
                            </Text>
                        )}
                    </View>
                ) : (
                    <View style={[styles.heroCard, { backgroundColor: colors.accent }]}>
                        <Text style={styles.heroTitle}>✅ Viskas Puiku!</Text>
                        <Text style={styles.heroSubtext}>Neturite pradelstų sąskaitų.</Text>
                    </View>
                )}

                <View style={styles.grid}>
                    <StatCard title="Laukia apmokėjimo (Gautos)" value={`${summary.unpaidReceivedSum.toFixed(2)} €`} color={colors.danger} />
                    <StatCard title="Laukia apmokėjimo (Išrašytos)" value={`${summary.unpaidDraftsSum.toFixed(2)} €`} color={colors.warning} />
                    <StatCard title="Gautų sąskaitų" value={`${saskaitos.length} vnt.`} />
                    <StatCard title="Išrašytų sąskaitų" value={`${draftSaskaitos.length} vnt.`} />
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                        style={globalStyles.button} 
                        onPress={() => navigation.navigate('AddInvoice')}>
                        <Text style={globalStyles.buttonText}>+ Nauja Gauta Sąskaita</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[globalStyles.button, {marginTop: spacing.medium}]} 
                        onPress={() => navigation.navigate('AddDraftInvoice')}>
                        <Text style={globalStyles.buttonText}>+ Nauja Išrašoma Sąskaita</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    heroCard: { padding: spacing.large, borderRadius: borderRadius.medium, marginBottom: spacing.medium, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: {width: 0, height: 2} },
    heroTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    heroSubtext: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
    // Nauji stiliai perspėjimo juostai
    warningBar: {
        backgroundColor: colors.warning,
        borderRadius: borderRadius.medium,
        padding: spacing.medium,
        marginBottom: spacing.medium,
        elevation: 4,
    },
    warningText: {
        color: colors.textPrimary,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: spacing.small,
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.small / 2 },
    statCard: { width: '50%', paddingHorizontal: spacing.small / 2, marginBottom: spacing.small, },
    statCardContent: { backgroundColor: colors.surface, padding: spacing.medium, borderRadius: borderRadius.medium, alignItems: 'center', height: 110, justifyContent: 'center', elevation: 2, },
    statCardTitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.small, height: 35, },
    statCardValue: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
    actionsContainer: { marginTop: spacing.large, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.large, }
});