// FAILAS: src/utils/storage.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as C from '../constants';

// --- SĄSKAITOS ---
export const loadInvoices = async () => {
    try {
        const stored = await AsyncStorage.getItem(C.STORAGE_KEY_INVOICES);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to load invoices from AsyncStorage", e);
        return [];
    }
};

export const saveInvoices = async (invoices) => {
    try {
        await AsyncStorage.setItem(C.STORAGE_KEY_INVOICES, JSON.stringify(invoices));
    } catch (e) {
        console.error("Failed to save invoices to AsyncStorage", e);
    }
};

// --- PINIGŲ LIKUČIAI ---
export const loadBalances = async () => {
    try {
        const cash = await AsyncStorage.getItem(C.STORAGE_KEY_CURRENT_CASH_REGISTER_BALANCE);
        const safe = await AsyncStorage.getItem(C.STORAGE_KEY_CURRENT_SAFE_BALANCE);
        const bank = await AsyncStorage.getItem(C.STORAGE_KEY_CURRENT_BANK_BALANCE);
        return {
            cash: cash ? parseFloat(cash) : 0,
            safe: safe ? parseFloat(safe) : 0,
            bank: bank ? parseFloat(bank) : 0,
        };
    } catch (e) {
        console.error("Failed to load balances from AsyncStorage", e);
        return { cash: 0, safe: 0, bank: 0 };
    }
};

export const saveBalance = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, String(value));
    } catch (e) {
        console.error(`Failed to save balance for key ${key}`, e);
    }
};

// --- OPERACIJOS ---
export const loadTransactions = async () => {
    try {
        const stored = await AsyncStorage.getItem(C.STORAGE_KEY_TRANSACTIONS);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to load transactions from AsyncStorage", e);
        return [];
    }
};

export const saveTransactions = async (transactions) => {
    try {
        await AsyncStorage.setItem(C.STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
        console.error("Failed to save transactions to AsyncStorage", e);
    }
};