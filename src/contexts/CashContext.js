// FILE: src/contexts/CashContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as C from '../constants';
import { showCustomAlert } from '../utils/helpers';

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
                const cash = await AsyncStorage.getItem(C.STORAGE_KEY_CURRENT_CASH_REGISTER_BALANCE);
                const safe = await AsyncStorage.getItem(C.STORAGE_KEY_CURRENT_SAFE_BALANCE);
                const bank = await AsyncStorage.getItem(C.STORAGE_KEY_CURRENT_BANK_BALANCE);
                const storedTransactions = await AsyncStorage.getItem(C.STORAGE_KEY_TRANSACTIONS);
                setCashRegisterBalance(cash ? parseFloat(cash) : 0);
                setSafeBalance(safe ? parseFloat(safe) : 0);
                setBankBalance(bank ? parseFloat(bank) : 0);
                setTransactions(storedTransactions ? JSON.parse(storedTransactions) : []);
            } catch (e) { console.error("Failed to load cash balances", e); } 
            finally { setLoading(false); }
        };
        loadBalances();
    }, []);

    useEffect(() => { if (!loading) AsyncStorage.setItem(C.STORAGE_KEY_CURRENT_CASH_REGISTER_BALANCE, String(cashRegisterBalance)); }, [cashRegisterBalance, loading]);
    useEffect(() => { if (!loading) AsyncStorage.setItem(C.STORAGE_KEY_CURRENT_SAFE_BALANCE, String(safeBalance)); }, [safeBalance, loading]);
    useEffect(() => { if (!loading) AsyncStorage.setItem(C.STORAGE_KEY_CURRENT_BANK_BALANCE, String(bankBalance)); }, [bankBalance, loading]);
    useEffect(() => { if (!loading) AsyncStorage.setItem(C.STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions)); }, [transactions, loading]);

    const addTransaction = (type, amount, updatedCash, updatedSafe, updatedBank, description = '', timestamp = null) => {
        const newTransaction = {
            id: Date.now() + Math.random(),
            type: type, amount: amount,
            cashRegisterBalance: updatedCash,
            safeBalance: updatedSafe,
            bankBalance: updatedBank,
            description: description,
            timestamp: timestamp || new Date().toISOString(),
        };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const removeTransactionById = (transactionId) => {
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
    };

    const clearCashData = async () => {
        try {
            const initialCash = await AsyncStorage.getItem(C.STORAGE_KEY_INITIAL_CASH_BALANCE) || '0';
            const initialSafe = await AsyncStorage.getItem(C.STORAGE_KEY_INITIAL_SAFE_BALANCE) || '0';
            const initialBank = await AsyncStorage.getItem(C.STORAGE_KEY_INITIAL_BANK_BALANCE) || '0';
            setCashRegisterBalance(parseFloat(initialCash));
            setSafeBalance(parseFloat(initialSafe));
            setBankBalance(parseFloat(initialBank));
            setTransactions([]);
            showCustomAlert("Atlikta", "Visos kasos operacijos ištrintos, o likučiai atstatyti į pradinius.");
        } catch (e) {
            console.error("Failed to clear cash data", e);
            showCustomAlert("Klaida", "Nepavyko išvalyti kasos duomenų.");
        }
    };

    const value = {
        cashRegisterBalance, setCashRegisterBalance,
        safeBalance, setSafeBalance,
        bankBalance, setBankBalance,
        transactions, addTransaction,
        removeTransactionById,
        clearCashData,
        loading
    };

    return <CashContext.Provider value={value}>{children}</CashContext.Provider>;
};