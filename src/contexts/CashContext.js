// FILE: src/contexts/CashContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as C from '../constants';

export const CashContext = createContext();

export const CashProvider = ({ children }) => {
    const [cashRegisterBalance, setCashRegisterBalance] = useState(0);
    const [safeBalance, setSafeBalance] = useState(0);
    const [bankBalance, setBankBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBalances = async () => {
            try {
                const cash = await AsyncStorage.getItem(C.STORAGE_KEY_CURRENT_CASH_REGISTER_BALANCE); setCashRegisterBalance(cash ? parseFloat(cash) : 0);
                const safe = await AsyncStorage.getItem(C.STORAGE_KEY_CURRENT_SAFE_BALANCE); setSafeBalance(safe ? parseFloat(safe) : 0);
                const bank = await AsyncStorage.getItem(C.STORAGE_KEY_CURRENT_BANK_BALANCE); setBankBalance(bank ? parseFloat(bank) : 0);
                const storedTransactions = await AsyncStorage.getItem(C.STORAGE_KEY_TRANSACTIONS); setTransactions(storedTransactions ? JSON.parse(storedTransactions) : []);
            } catch (e) { console.error("Failed to load balances", e); } 
            finally { setLoading(false); }
        };
        loadBalances();
    }, []);

    useEffect(() => { if (!loading) AsyncStorage.setItem(C.STORAGE_KEY_CURRENT_CASH_REGISTER_BALANCE, String(cashRegisterBalance)); }, [cashRegisterBalance, loading]);
    useEffect(() => { if (!loading) AsyncStorage.setItem(C.STORAGE_KEY_CURRENT_SAFE_BALANCE, String(safeBalance)); }, [safeBalance, loading]);
    useEffect(() => { if (!loading) AsyncStorage.setItem(C.STORAGE_KEY_CURRENT_BANK_BALANCE, String(bankBalance)); }, [bankBalance, loading]);
    useEffect(() => { if (!loading) AsyncStorage.setItem(C.STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions)); }, [transactions, loading]);

    const addTransaction = (type, amount, updatedCash, updatedSafe, updatedBank, description = '') => {
        const newTransaction = {
            id: Date.now() + Math.random(),
            type: type, amount: amount, cashRegisterBalance: updatedCash,
            safeBalance: updatedSafe, bankBalance: updatedBank,
            description: description, timestamp: new Date().toISOString(),
        };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const removeTransactionById = (transactionId) => {
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
    };

    const value = {
        cashRegisterBalance, setCashRegisterBalance,
        safeBalance, setSafeBalance,
        bankBalance, setBankBalance,
        transactions, addTransaction,
        removeTransactionById,
        loading
    };

    return <CashContext.Provider value={value}>{children}</CashContext.Provider>;
};