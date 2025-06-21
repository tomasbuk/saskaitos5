// FILE: src/components/FilterPanel.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CustomDropdown from './CustomDropdown';
import DatePickerModal from './DatePickerModal';
import { styles as globalStyles, colors, spacing, borderRadius } from '../utils/styles';

const StatusPill = ({ status, isSelected, onPress, style }) => (
    <TouchableOpacity 
        style={[styles.pill, { borderColor: style.borderColor }, isSelected && { backgroundColor: style.borderColor }]} 
        onPress={onPress}
    >
        <Text style={[styles.pillText, { color: style.color }, isSelected && { color: colors.surface }]}>{status}</Text>
    </TouchableOpacity>
);

export default function FilterPanel({
    filters,
    onFilterChange,
    entityOptions,
    entityLabel,
    statusOptions,
    statusStyleGetter
}) {
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const handleClearFilters = () => {
        onFilterChange({ status: null, entity: null, startDate: null, endDate: null });
    };

    const statusOptionsWithClear = ["Visos", ...statusOptions];
    const entityOptionsWithClear = [`Visi ${entityLabel.toLowerCase()}`, ...entityOptions];

    return (
        <View style={styles.container}>
            {/* Būsenų filtras */}
            <Text style={globalStyles.inputLabel}>Filtruoti pagal būseną:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsContainer}>
                {statusOptionsWithClear.map(status => {
                    const style = status === 'Visos' 
                        ? { borderColor: colors.textSecondary, color: colors.textSecondary } 
                        : statusStyleGetter(status);
                    
                    return (
                        <StatusPill
                            key={status}
                            status={status}
                            isSelected={filters.status === status || (!filters.status && status === 'Visos')}
                            onPress={() => onFilterChange({ ...filters, status: status === 'Visos' ? null : status })}
                            style={style}
                        />
                    );
                })}
            </ScrollView>

            {/* Tiekėjo / Pirkėjo filtras */}
            <View style={{ marginBottom: spacing.medium }}>
                <CustomDropdown
                    label={entityLabel}
                    options={entityOptionsWithClear}
                    selectedValue={filters.entity}
                    onSelect={(entity) => onFilterChange({ ...filters, entity: entity.startsWith('Visi') ? null : entity })}
                    placeholder={`Visi ${entityLabel.toLowerCase()}`}
                />
            </View>
            
            {/* Datų filtras */}
            <View>
                <Text style={globalStyles.inputLabel}>Filtruoti pagal datą:</Text>
                <View style={styles.dateInputsContainer}>
                    <TouchableOpacity style={[globalStyles.input, { flex: 1 }]} onPress={() => setShowStartDatePicker(true)}>
                        <Text>{filters.startDate || 'Nuo'}</Text>
                    </TouchableOpacity>
                    <DatePickerModal visible={showStartDatePicker} onClose={() => setShowStartDatePicker(false)} onSelectDate={(date) => onFilterChange({ ...filters, startDate: date })} initialDate={filters.startDate} />
                    
                    <Text style={styles.dateSeparator}>-</Text>
                    
                    <TouchableOpacity style={[globalStyles.input, { flex: 1 }]} onPress={() => setShowEndDatePicker(true)}>
                        <Text>{filters.endDate || 'Iki'}</Text>
                    </TouchableOpacity>
                    <DatePickerModal visible={showEndDatePicker} onClose={() => setShowEndDatePicker(false)} onSelectDate={(date) => onFilterChange({ ...filters, endDate: date })} initialDate={filters.endDate} />
                </View>
            </View>

            <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
                <Text style={styles.clearButtonText}>Išvalyti visus filtrus</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        backgroundColor: '#f8f9fa', 
        padding: spacing.medium, 
        borderBottomWidth: 1, 
        borderBottomColor: colors.border, 
        marginBottom: spacing.small 
    },
    pillsContainer: { 
        flexDirection: 'row', 
        marginBottom: spacing.medium 
    },
    pill: { 
        borderWidth: 1.5, 
        borderRadius: 20, 
        paddingHorizontal: spacing.medium, 
        paddingVertical: spacing.small / 2, 
        marginRight: spacing.small, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    pillText: { 
        fontWeight: 'bold' 
    },
    dateInputsContainer: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    dateSeparator: { 
        marginHorizontal: spacing.small, 
        fontSize: 16, 
        color: colors.textSecondary 
    },
    clearButton: { 
        alignSelf: 'center', 
        padding: spacing.small, 
        marginTop: spacing.medium 
    },
    clearButtonText: { 
        color: colors.primary, 
        fontSize: 14, 
        fontWeight: 'bold' 
    },
});