// FILE: src/screens/ReceivedInvoicesScreen.js
import React, { useState, useContext, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { InvoicesContext } from '../contexts/InvoicesContext';
import { SettingsContext } from '../contexts/SettingsContext';
import EditInvoiceModal from '../components/EditInvoiceModal';
import FilterPanel from '../components/FilterPanel';
import AnimatedWarningIcon from '../components/AnimatedWarningIcon';
import { styles as globalStyles, colors, spacing, borderRadius, typography } from '../utils/styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const styles = StyleSheet.create({
    itemWrapper: { backgroundColor: colors.surface, borderRadius: borderRadius.medium, marginBottom: spacing.small, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, borderLeftWidth: 5, overflow: 'hidden' },
    itemContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.medium },
    infoContainer: { flex: 1, marginRight: spacing.small },
    itemTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
    itemSubtitle: { fontSize: 14, color: colors.textSecondary },
    itemDate: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.small },
    amountContainer: { alignItems: 'flex-end', justifyContent: 'space-between' },
    itemAmount: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
    statusBadge: { borderWidth: 1, borderRadius: 12, paddingHorizontal: spacing.small, paddingVertical: 2, marginTop: spacing.small },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    expandedContent: { padding: spacing.medium, borderTopWidth: 1, borderTopColor: colors.border },
    detailLabel: { fontWeight: 'bold', color: colors.textSecondary },
    detailText: { fontSize: 14, color: colors.textPrimary, marginBottom: spacing.small },
    buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.medium },
    actionBtn: { flex: 1, marginLeft: spacing.small, paddingVertical: spacing.small },
    filterToggleButton: { padding: spacing.medium, backgroundColor: '#f1f1f1', alignItems: 'center' },
    filterToggleButtonText: { color: colors.primary, fontWeight: 'bold' },
});

const getStatusStyle = (status) => {
    switch (status) {
        case 'Apmokėta': return { borderColor: colors.accent, color: colors.accent };
        case 'Neapmokėta': return { borderColor: colors.danger, color: colors.danger };
        case 'Dalinai apmokėta': return { borderColor: colors.warning, color: colors.warning };
        default: return { borderColor: colors.textSecondary, color: colors.textSecondary };
    }
};

const isOverdue = (invoice) => {
    if (invoice.busena !== 'Neapmokėta' && invoice.busena !== 'Dalinai apmokėta') return false;
    if (!invoice.apmoketiIki || typeof invoice.apmoketiIki !== 'string' || !invoice.apmoketiIki.includes('-')) return false;
    const parts = invoice.apmoketiIki.split('-');
    if (parts.length !== 3) return false;
    const dueDate = new Date(Date.UTC(parts[0], parseInt(parts[1], 10) - 1, parts[2]));
    if (isNaN(dueDate.getTime())) return false;
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    return dueDate < todayUTC;
};

const InvoiceItem = ({ item, isExpanded, onExpand, onEdit, onDelete }) => {
    const statusStyle = getStatusStyle(item.busena);
    const overdue = isOverdue(item);

    return (
        <View style={[styles.itemWrapper, { borderLeftColor: statusStyle.borderColor }]}>
            <TouchableOpacity style={styles.itemContainer} onPress={onExpand}>
                <View style={styles.infoContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.itemTitle}>{item.tiekejas || 'Nenurodytas Tiekėjas'}</Text>
                        {overdue && <AnimatedWarningIcon />}
                    </View>
                    <Text style={styles.itemSubtitle}>{item.saskaitosNr}</Text>
                    <Text style={styles.itemDate}>Data: {item.data}</Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.itemAmount}>{item.suma.toFixed(2)} €</Text>
                    <View style={[styles.statusBadge, { borderColor: statusStyle.borderColor }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.busena}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            {isExpanded && (
                <View style={styles.expandedContent}>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Paskirtis:</Text> {item.mokejimoPaskirtis}</Text>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Apmokėti iki:</Text> {item.apmoketiIki}</Text>
                    {item.comment ? <Text style={styles.detailText}><Text style={styles.detailLabel}>Komentaras:</Text> {item.comment}</Text> : null}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[globalStyles.button, styles.actionBtn, {backgroundColor: colors.danger}]} onPress={onDelete}><Text style={globalStyles.buttonText}>Ištrinti</Text></TouchableOpacity>
                        <TouchableOpacity style={[globalStyles.button, styles.actionBtn, {backgroundColor: colors.primary}]} onPress={onEdit}><Text style={globalStyles.buttonText}>Redaguoti</Text></TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default function ReceivedInvoicesScreen({ navigation }) {
    const { saskaitos, handleUpdateInvoice, handleDeleteInvoice } = useContext(InvoicesContext);
    const settings = useContext(SettingsContext);
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ status: null, entity: null, startDate: null, endDate: null });
    const toggleExpand = (itemId) => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setExpandedItemId(expandedItemId === itemId ? null : itemId); };
    const filteredSaskaitos = useMemo(() => {
        return saskaitos.filter(invoice => {
            if (!invoice || typeof invoice.busena === 'undefined' || typeof invoice.tiekejas === 'undefined') return false;
            const statusMatch = !filters.status || invoice.busena === filters.status;
            const entityMatch = !filters.entity || invoice.tiekejas === filters.entity;
            let dateMatch = true;
            if (filters.startDate || filters.endDate) { if (!invoice.data) { dateMatch = false; } else { const invoiceDate = new Date(invoice.data); if (isNaN(invoiceDate.getTime())) { dateMatch = false; } else { const startMatch = !filters.startDate || invoiceDate >= new Date(filters.startDate); const endMatch = !filters.endDate || invoiceDate <= new Date(filters.endDate); dateMatch = startMatch && endMatch; }}}
            return statusMatch && entityMatch && dateMatch;
        });
    }, [saskaitos, filters]);
    const statusFilterOptions = settings.busenaOptions.filter(b => b !== 'Nuosavos lėšos');

    return (
        <View style={globalStyles.screenContent}>
            <TouchableOpacity style={styles.filterToggleButton} onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setShowFilters(!showFilters); }}><Text style={styles.filterToggleButtonText}>Filtruoti {showFilters ? '▲' : '▼'}</Text></TouchableOpacity>
            {showFilters && ( <FilterPanel filters={filters} onFilterChange={setFilters} entityOptions={settings.tiekejaiOptions} entityLabel="Tiekėjas" statusOptions={statusFilterOptions} statusStyleGetter={getStatusStyle} /> )}
            <FlatList
                data={filteredSaskaitos}
                renderItem={({ item }) => ( <InvoiceItem item={item} isExpanded={expandedItemId === item.id} onExpand={() => toggleExpand(item.id)} onEdit={() => setEditingInvoice(item)} onDelete={() => handleDeleteInvoice(item.id)} /> )}
                keyExtractor={item => String(item.id)}
                ListEmptyComponent={<Text style={globalStyles.noDataText}>Sąskaitų pagal filtrus nerasta.</Text>}
                contentContainerStyle={{ paddingHorizontal: spacing.medium, paddingBottom: spacing.medium, paddingTop: spacing.small }}
            />
            {editingInvoice && ( <EditInvoiceModal visible={!!editingInvoice} onClose={() => setEditingInvoice(null)} invoice={editingInvoice} onSave={(id, data) => { handleUpdateInvoice(id, data); setEditingInvoice(null); }} tiekejaiOptions={settings.tiekejaiOptions} rusysOptions={settings.rusysOptions} busenaOptions={settings.busenaOptions} mokejimoPaskirtisOptions={settings.mokejimoPaskirtisOptions} isDraft={false} /> )}
        </View>
    );
}