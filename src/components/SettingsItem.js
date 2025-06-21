// FILE: src/components/SettingsItem.js

import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../utils/styles';

const SettingsItem = ({ icon, title, onPress, isDanger = false }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.icon}>{icon}</Text>
            <View style={styles.textContainer}>
                <Text style={[styles.title, isDanger && styles.dangerText]}>{title}</Text>
            </View>
            <Text style={[styles.arrow, isDanger && styles.dangerText]}>›</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.medium,
        borderRadius: borderRadius.medium,
        marginBottom: spacing.medium,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    icon: {
        fontSize: 24,
        marginRight: spacing.medium,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    arrow: {
        fontSize: 24,
        color: colors.textSecondary,
    },
    dangerText: {
        color: colors.danger,
    }
});

export default SettingsItem;