// FILE: src/components/DatePickerModal.js
import React from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
// PATAISYMAS: `styles` importuojamas ir pervadinamas į `globalStyles`, kad neliktų `undefined`.
import { colors, spacing, styles as globalStyles } from '../utils/styles';

export default function DatePickerModal({ visible, onClose, onSelectDate, initialDate }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPressOut={onClose}>
                <View style={styles.modalContent}>
                    <Calendar
                        current={initialDate || new Date().toISOString().split('T')[0]}
                        onDayPress={(day) => {
                            onSelectDate(day.dateString);
                            onClose();
                        }}
                        monthFormat={'yyyy MMMM'}
                        theme={{
                            backgroundColor: colors.surface,
                            calendarBackground: colors.surface,
                            textSectionTitleColor: colors.textSecondary,
                            selectedDayBackgroundColor: colors.primary,
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: colors.primary,
                            dayTextColor: colors.textPrimary,
                            arrowColor: colors.primary,
                        }}
                    />
                    {/* Dabar `globalStyles.button` bus teisingai atpažintas */}
                    <TouchableOpacity style={[globalStyles.button, globalStyles.cancelButton, {marginTop: spacing.medium}]} onPress={onClose}>
                        <Text style={globalStyles.buttonText}>Atšaukti</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.large,
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: spacing.medium,
        padding: spacing.medium,
        width: '100%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});