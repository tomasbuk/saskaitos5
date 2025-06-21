// FILE: src/contexts/InvoicesContext.js

import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showCustomAlert } from '../utils/helpers';
import { STORAGE_KEY_INVOICES, STORAGE_KEY_DRAFT_INVOICES } from '../constants';

export const InvoicesContext = createContext();

export const InvoicesProvider = ({ children }) => {
    const [saskaitos, setSaskaitos] = useState([]);
    const [draftSaskaitos, setDraftSaskaitos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedInvoices = await AsyncStorage.getItem(STORAGE_KEY_INVOICES);
                setSaskaitos(storedInvoices ? JSON.parse(storedInvoices) : []);
                
                const storedDrafts = await AsyncStorage.getItem(STORAGE_KEY_DRAFT_INVOICES);
                setDraftSaskaitos(storedDrafts ? JSON.parse(storedDrafts) : []);
            } catch (e) { 
                console.error("Failed to load invoices.", e); 
            } finally { 
                setLoading(false); 
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (!loading) {
            AsyncStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(saskaitos));
        }
    }, [saskaitos, loading]);

    useEffect(() => {
        if (!loading) {
            AsyncStorage.setItem(STORAGE_KEY_DRAFT_INVOICES, JSON.stringify(draftSaskaitos));
        }
    }, [draftSaskaitos, loading]);

    const handleAddSaskaita = (newSaskaitaData) => {
        const newSaskaita = { ...newSaskaitaData, id: Date.now() + Math.random(), createdAt: new Date().toISOString(), };
        const updatedList = [newSaskaita, ...saskaitos].sort((a, b) => new Date(b.data) - new Date(a.data));
        setSaskaitos(updatedList);
        showCustomAlert('Sėkmė', 'Sąskaita sėkmingai pridėta!');
    };

    const handleUpdateInvoice = (itemId, updates) => {
        setSaskaitos(prev => prev.map(s => (s.id === itemId ? { ...s, ...updates } : s)));
    };

    const handleDeleteInvoice = (itemId) => {
        Alert.alert("Ištrinti sąskaitą", "Ar tikrai norite ištrinti šį įrašą?", [
            { text: "Atšaukti", style: "cancel" },
            { text: "Ištrinti", onPress: () => setSaskaitos(prev => prev.filter(s => s.id !== itemId)), style: "destructive" }
        ]);
    };

    const handleAddDraftInvoice = (newDraftData) => {
        const newDraft = { ...newDraftData, id: `DRAFT-${Date.now() + Math.random()}`, createdAt: new Date().toISOString(), };
        const updatedList = [newDraft, ...draftSaskaitos].sort((a, b) => new Date(b.data) - new Date(a.data));
        setDraftSaskaitos(updatedList);
        showCustomAlert('Sėkmė', 'Išrašoma sąskaita sėkmingai pridėta!');
    };

    const handleUpdateDraftInvoice = (itemId, updates) => {
        setDraftSaskaitos(prev => prev.map(d => (d.id === itemId ? { ...d, ...updates } : d)));
    };

    const handleDeleteDraftInvoice = (itemId) => {
        Alert.alert("Ištrinti sąskaitą", "Ar tikrai norite ištrinti šį įrašą?", [
            { text: "Atšaukti", style: "cancel" },
            { text: "Ištrinti", onPress: () => setDraftSaskaitos(prev => prev.filter(d => d.id !== itemId)), style: "destructive" }
        ]);
    };

    const handleBulkAddSaskaitos = (newInvoices) => {
        if (!Array.isArray(newInvoices) || newInvoices.length === 0) { return; }
        const combined = [...saskaitos];
        const existingNrs = new Set(saskaitos.map(s => s.saskaitosNr));
        newInvoices.forEach(newInv => { if (!existingNrs.has(newInv.saskaitosNr)) { combined.push(newInv); }});
        const updatedList = combined.sort((a, b) => new Date(b.data) - new Date(a.data));
        setSaskaitos(updatedList);
    };
    
    // PATAISYMAS: Nauja funkcija, skirta tik gautų sąskaitų išvalymui
    const handleClearReceivedInvoices = async () => {
        try {
            setSaskaitos([]);
            await AsyncStorage.removeItem(STORAGE_KEY_INVOICES);
            showCustomAlert('Atlikta', 'Visos gautos sąskaitos buvo ištrintos.');
        } catch (e) {
            console.error("Failed to clear received invoices.", e);
            showCustomAlert('Klaida', 'Nepavyko ištrinti gautų sąskaitų.');
        }
    };

    const value = {
        saskaitos, draftSaskaitos, loading,
        handleAddSaskaita, handleUpdateInvoice, handleDeleteInvoice,
        handleAddDraftInvoice, handleUpdateDraftInvoice, handleDeleteDraftInvoice,
        handleBulkAddSaskaitos,
        handleClearReceivedInvoices, // Pridedame naują funkciją
    };

    return <InvoicesContext.Provider value={value}>{children}</InvoicesContext.Provider>;
};