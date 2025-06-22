// FILE: src/screens/StartScreen.js

import React, { useMemo, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { InvoicesContext } from '../contexts/InvoicesContext';
import { styles as globalStyles, colors, spacing, borderRadius, typography } from '../utils/styles';

const StatCard = ({ title, value, color = colors.textPrimary }) => (
    <View style={styles.statCard}>
        <View style={styles.statCardContent}>
            <Text style={styles.statCardTitle}>{title}</Text>
            <Text style={[styles.statCardValue, { color }]}>{value}</Text>
        </View>
    </View>
);

export default function StartScreen({ navigation }) {
    // PATAISYMAS: Supaprastiname duomenų gavimą iš konteksto
    const { saskaitos, draftSaskaitos } = useContext(InvoicesContext) || {};
    
    const summary = useMemo(() => {
        // PATAISYMAS: Patikriname, ar masyvai egzistuoja, funkcijos viduje.
        // Tai užtikrina, kad `useMemo` veiks efektyviai.
        const safeSaskaitos = Array.isArray(saskaitos) ? saskaitos : [];
        const safeDraftSaskaitos = Array.isArray(draftSaskaitos) ? draftSaskaitos : [];
        
        const unpaidReceivedSum = safeSaskaitos.reduce((sum, inv) => 
            (inv && (inv.busena === 'Neapmokėta' || inv.busena === 'Dalinai apmokėta')) ? sum + (inv.suma - (inv.paidSuma || 0)) : sum, 0);
        
        const unpaidDraftsSum = safeDraftSaskaitos.reduce((sum, inv) => 
            (inv && (inv.busena === 'Neapmokėta' || inv.busena === 'Dalinai apmokėta')) ? sum + (inv.suma - (inv.paidSuma || 0)) : sum, 0);
        
        return { 
            unpaidReceivedSum, 
            unpaidDraftsSum,
            receivedCount: safeSaskaitos.length,
            draftsCount: safeDraftSaskaitos.length,
        };
    }, [saskaitos, draftSaskaitos]);

    return (
        <ScrollView style={globalStyles.screenContent}>
            <View style={{padding: spacing.medium}}>
                <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
                    <Text style={styles.heroTitle}>Sveiki!</Text>
                    <Text style={styles.heroSubtext}>Sėkmingos darbo dienos.</Text>
                </View>

                <View style={styles.grid}>
                    <StatCard title="Laukia apmokėjimo (Gautos)" value={`${summary.unpaidReceivedSum.toFixed(2)} €`} color={colors.danger} />
                    <StatCard title="Laukia apmokėjimo (Išrašytos)" value={`${summary.unpaidDraftsSum.toFixed(2)} €`} color={colors.warning} />
                    <StatCard title="Gautų sąskaitų" value={`${summary.receivedCount} vnt.`} />
                    <StatCard title="Išrašytų sąskaitų" value={`${summary.draftsCount} vnt.`} />
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
    heroTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    heroSubtext: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: spacing.small },
    grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.small / 2 },
    statCard: { width: '50%', paddingHorizontal: spacing.small / 2, marginBottom: spacing.small },
    statCardContent: { backgroundColor: colors.surface, padding: spacing.medium, borderRadius: borderRadius.medium, alignItems: 'center', height: 110, justifyContent: 'center', elevation: 2, },
    statCardTitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.small, height: 35, },
    statCardValue: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
    actionsContainer: { marginTop: spacing.large, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.large }
});