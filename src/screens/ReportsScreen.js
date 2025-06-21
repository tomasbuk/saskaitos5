// FILE: src/screens/ReportsScreen.js

import React, { useState, useMemo, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { InvoicesContext } from '../contexts/InvoicesContext';
import { CashContext } from '../contexts/CashContext';
import { styles as globalStyles, colors, spacing, borderRadius, typography } from '../utils/styles';

// --- PAGALBINIAI KOMPONENTAI ---
const ReportCard = ({ title, children }) => ( <View style={styles.card}><Text style={styles.cardTitle}>{title}</Text>{children}</View> );
const SimpleBarChart = ({ income, expense }) => { const maxValue = Math.max(income, expense, 1); const incomeHeight = (income / maxValue) * 100 || 0; const expenseHeight = (expense / maxValue) * 100 || 0; return ( <View style={styles.chartContainer}><View style={styles.barGroup}><Text style={styles.barValue}>€{income.toFixed(0)}</Text><View style={[styles.bar, styles.incomeBar, { height: `${incomeHeight}%` }]} /><Text style={styles.barLabel}>Pajamos</Text></View><View style={styles.barGroup}><Text style={styles.barValue}>€{expense.toFixed(0)}</Text><View style={[styles.bar, styles.expenseBar, { height: `${expenseHeight}%` }]} /><Text style={styles.barLabel}>Išlaidos</Text></View></View> );};
const RankedList = ({ title, data }) => ( <View><Text style={styles.listHeader}>{title}</Text>{data.length > 0 ? data.map((item, index) => ( <View key={index} style={styles.listItem}><Text style={styles.listItemText}>{index + 1}. {item.name}</Text><Text style={styles.listItemValue}>{item.total.toFixed(2)} €</Text></View> )) : <Text style={styles.noDataText}>Duomenų nėra</Text>}</View> );

// --- PAGRINDINIS EKRANO KOMPONENTAS ---
export default function ReportsScreen() {
    const { saskaitos, draftSaskaitos } = useContext(InvoicesContext);
    const { transactions } = useContext(CashContext);
    const [period, setPeriod] = useState('thisMonth');

    const reportData = useMemo(() => {
        const now = new Date();
        let startDate, endDate;

        switch (period) {
            case 'lastMonth':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'thisYear':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date();
                break;
            case 'thisMonth':
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date();
                break;
        }
        
        const receivedInPeriod = saskaitos.filter(inv => { const d = new Date(inv.data); return d >= startDate && d <= endDate; });
        const cashTransactionsInPeriod = transactions.filter(tr => { if (!tr.timestamp) return false; const d = new Date(tr.timestamp); return d >= startDate && d <= endDate; });

        const totalOwedToYou = draftSaskaitos.reduce((sum, inv) => (inv.busena === 'Neapmokėta' || inv.busena === 'Dalinai apmokėta') ? sum + (inv.suma - (inv.paidSuma || 0)) : sum, 0);
        const totalYouOwe = saskaitos.reduce((sum, inv) => (inv.busena === 'Neapmokėta' || inv.busena === 'Dalinai apmokėta') ? sum + (inv.suma - (inv.paidSuma || 0)) : sum, 0);

        // PATAISYMAS: Visiškai nauja, patikima skaičiavimo logika, kuri apdoroja visus atvejus
        let incomeInPeriod = 0;
        let expenseInPeriod = 0;
        const cashFlowDetails = { cashIn: 0, cardIn: 0, cashOut: 0, toSafe: 0, fromSafe: 0 };

        cashTransactionsInPeriod.forEach(tr => {
            const type = tr.type || '';
            const positivePrefixes = ['Įplaukos', 'Pervedimas iš seifo', 'Likučio korekcija (+)'];
            const expensePrefixes = ['Išlaidos', 'Likučio korekcija (Išėmimas)', 'Banko komisiniai'];

            // Bendrų srautų skaičiavimas
            if (positivePrefixes.some(p => type.startsWith(p))) {
                incomeInPeriod += tr.amount;
            } else if (expensePrefixes.some(p => type.startsWith(p))) {
                expenseInPeriod += tr.amount;
            }
            
            // Detalios suvestinės skaičiavimas
            if (type === 'Įplaukos (grynais)') cashFlowDetails.cashIn += tr.amount;
            else if (type === 'Įplaukos (kortele)' || type === 'Įplaukos (pavedimu)') cashFlowDetails.cardIn += tr.amount;
            else if (type === 'Išlaidos (iš kasos)') cashFlowDetails.cashOut += tr.amount;
            else if (type.includes('į seifą')) cashFlowDetails.toSafe += tr.amount;
            else if (type.includes('iš seifo')) cashFlowDetails.fromSafe += tr.amount;
            else if (type === 'Importuotos įplaukos (Z)') {
                const cashMatch = tr.description.match(/Grynais: ([\d.]+)/);
                const cardMatch = tr.description.match(/Kortele: ([\d.]+)/);
                cashFlowDetails.cashIn += cashMatch ? parseFloat(cashMatch[1]) : 0;
                cashFlowDetails.cardIn += cardMatch ? parseFloat(cardMatch[1]) : 0;
                // Importuotos pajamos taip pat priskiriamos bendroms pajamoms
                incomeInPeriod += tr.amount; 
            }
        });

        const expenseByCategory = receivedInPeriod.reduce((acc, inv) => { const category = inv.rusis || 'Kita'; acc[category] = (acc[category] || 0) + inv.suma; return acc; }, {});
        const expenseBySupplier = receivedInPeriod.reduce((acc, inv) => { const supplier = inv.tiekejas || 'Nežinomas'; acc[supplier] = (acc[supplier] || 0) + inv.suma; return acc; }, {});
        const topSuppliers = Object.entries(expenseBySupplier).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total).slice(0, 5);

        return {
            totalOwedToYou, totalYouOwe,
            incomeInPeriod, expenseInPeriod,
            cashFlowDetails,
            expenseByCategory: Object.entries(expenseByCategory).map(([name, total]) => ({ name, total })).sort((a,b) => b.total - a.total),
            topSuppliers
        };
    }, [saskaitos, draftSaskaitos, transactions, period]);

    const PeriodFilter = () => ( <View style={styles.filterContainer}><TouchableOpacity style={[styles.filterButton, period === 'thisMonth' && styles.filterButtonActive]} onPress={() => setPeriod('thisMonth')}><Text style={[styles.filterText, period === 'thisMonth' && styles.filterTextActive]}>Šis mėnuo</Text></TouchableOpacity><TouchableOpacity style={[styles.filterButton, period === 'lastMonth' && styles.filterButtonActive]} onPress={() => setPeriod('lastMonth')}><Text style={[styles.filterText, period === 'lastMonth' && styles.filterTextActive]}>Praėjęs mėnuo</Text></TouchableOpacity><TouchableOpacity style={[styles.filterButton, period === 'thisYear' && styles.filterButtonActive]} onPress={() => setPeriod('thisYear')}><Text style={[styles.filterText, period === 'thisYear' && styles.filterTextActive]}>Šie metai</Text></TouchableOpacity></View> );

    return (
        <ScrollView style={globalStyles.screenContent}>
            <PeriodFilter />
            <View style={{ padding: spacing.medium }}>
                <ReportCard title="Skolų Balansas (Bendra)"><View style={styles.balanceRow}><Text style={styles.balanceLabel}>Jums skolingi:</Text><Text style={[styles.balanceValue, { color: colors.warning }]}>{reportData.totalOwedToYou.toFixed(2)} €</Text></View><View style={styles.balanceRow}><Text style={styles.balanceLabel}>Jūs skolingi:</Text><Text style={[styles.balanceValue, { color: colors.danger }]}>{reportData.totalYouOwe.toFixed(2)} €</Text></View></ReportCard>
                <ReportCard title="Bendri Pinigų Srautai per Periodą"><SimpleBarChart income={reportData.incomeInPeriod} expense={reportData.expenseInPeriod} /></ReportCard>
                <ReportCard title="Kasos Operacijų Suvestinė"><View style={styles.balanceRow}><Text style={styles.balanceLabel}>Įplaukos (grynais):</Text><Text style={[styles.balanceValue, { color: colors.accent }]}>+ {reportData.cashFlowDetails.cashIn.toFixed(2)} €</Text></View><View style={styles.balanceRow}><Text style={styles.balanceLabel}>Įplaukos (kortele/pavedimu):</Text><Text style={[styles.balanceValue, { color: colors.accent }]}>+ {reportData.cashFlowDetails.cardIn.toFixed(2)} €</Text></View><View style={styles.balanceRow}><Text style={styles.balanceLabel}>Išlaidos (iš kasos):</Text><Text style={[styles.balanceValue, { color: colors.danger }]}>- {reportData.cashFlowDetails.cashOut.toFixed(2)} €</Text></View><View style={styles.balanceRow}><Text style={styles.balanceLabel}>Pervesta į seifą:</Text><Text style={[styles.balanceValue, { color: colors.textSecondary }]}>{reportData.cashFlowDetails.toSafe.toFixed(2)} €</Text></View><View style={styles.balanceRow}><Text style={styles.balanceLabel}>Paimta iš seifo:</Text><Text style={[styles.balanceValue, { color: colors.textSecondary }]}>{reportData.cashFlowDetails.fromSafe.toFixed(2)} €</Text></View></ReportCard>
                <ReportCard title="Išlaidų Paskirstymas"><RankedList title="Pagal Kategoriją (Rūšis)" data={reportData.expenseByCategory} /></ReportCard>
                <ReportCard title="Top 5 Tiekėjai per Periodą"><RankedList title="" data={reportData.topSuppliers} /></ReportCard>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    card: { ...globalStyles.inputSection, margin: 0, marginBottom: spacing.medium }, cardTitle: { ...globalStyles.inputTitle, textAlign: 'center', marginBottom: spacing.large, fontSize: 20 }, balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.small, borderBottomWidth: 1, borderBottomColor: colors.border }, balanceLabel: { fontSize: 16, color: colors.textSecondary, flex: 1 }, balanceValue: { fontSize: 18, fontWeight: 'bold' }, chartContainer: { flexDirection: 'row', height: 150, alignItems: 'flex-end', justifyContent: 'space-around', borderBottomWidth: 1, borderColor: colors.border, paddingBottom: spacing.small }, barGroup: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' }, barValue: { fontSize: 12, color: colors.textSecondary, fontWeight: 'bold' }, bar: { width: '50%', borderRadius: 4, marginHorizontal: '5%' }, incomeBar: { backgroundColor: colors.accent }, expenseBar: { backgroundColor: colors.warning }, barLabel: { marginTop: spacing.small, fontSize: 14, fontWeight: '500', color: colors.textPrimary }, filterContainer: { flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: colors.surface, paddingVertical: spacing.small, borderBottomWidth: 1, borderColor: colors.border }, filterButton: { paddingHorizontal: spacing.medium, paddingVertical: spacing.small, borderRadius: borderRadius.medium }, filterButtonActive: { backgroundColor: colors.primary }, filterText: { color: colors.primary, fontWeight: 'bold' }, filterTextActive: { color: colors.surface }, listHeader: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary, marginBottom: spacing.small }, listItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.small, borderTopWidth: 1, borderTopColor: colors.border }, listItemText: { fontSize: 16, color: colors.textSecondary }, listItemValue: { fontSize: 16, color: colors.textPrimary, fontWeight: '500' }, noDataText: { fontSize: 14, color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center', padding: spacing.medium }
});