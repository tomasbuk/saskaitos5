// FILE: src/utils/styles.js

import { StyleSheet } from 'react-native';

// Įsitikinkite, kad šie objektai yra apibrėžti BŪTENT taip
export const colors = {
    primary: '#3498db',
    accent: '#1ABC9C',
    danger: '#E74C3C',
    warning: '#F1C40F',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    textPrimary: '#2C3E50',
    textSecondary: '#8E9AAB',
    border: '#EAEFF5',
};

export const statusColors = {
    paid: '#D4EFDF',
    unpaid: '#FADBD8',
    partial: '#FCF3CF',
    own_funds: '#E5E7E9',
};

export const typography = { h1: 24, h2: 20, h3: 18, body: 16, caption: 12 };
export const spacing = { small: 8, medium: 16, large: 24 };
export const borderRadius = { small: 8, medium: 12 };

// Pagrindiniai stiliai, kurie gali būti pernaudojami
export const styles = StyleSheet.create({
    screenContent: {
        flex: 1,
        backgroundColor: colors.background,
    },
    inputSection: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.medium,
        padding: spacing.medium,
        margin: spacing.medium,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
    },
    inputTitle: {
        fontSize: typography.h2,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.large,
    },
    inputLabel: {
        fontSize: typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.small,
        fontWeight: '500',
    },
    input: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.small,
        padding: spacing.medium,
        fontSize: typography.body,
        color: colors.textPrimary,
        marginBottom: spacing.medium,
    },
    button: {
        backgroundColor: colors.primary,
        padding: spacing.medium,
        borderRadius: borderRadius.medium,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.small,
        elevation: 2,
    },
    buttonText: {
        color: colors.surface,
        fontSize: typography.h3,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: colors.textSecondary,
        marginTop: spacing.small,
    },
    // Kiti bendri stiliai...
});