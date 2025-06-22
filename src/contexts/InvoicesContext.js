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
                let invoices = storedInvoices ? JSON.parse(storedInvoices) : [];
                
                const storedDrafts = await AsyncStorage.getItem(STORAGE_KEY_DRAFT_INVOICES);
                let drafts = storedDrafts ? JSON.parse(storedDrafts) : [];

                if (invoices.length === 0 && drafts.length === 0 && !loading) {
                    const sampleInvoice = { id: Date.now(), data: new Date().toISOString().split('T')[0], saskaitosNr: 'PVM-001', tiekejas: 'Bandomasis Tiekėjas', suma: 121.00, paidSuma: 0, rusis: 'Išlaidos', busena: 'Neapmokėta', mokejimoPaskirtis: 'Už paslaugas', apmoketiIki: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], comment: 'Automatiškai sukurta sąskaita.', createdAt: new Date().toISOString() };
                    invoices.push(sampleInvoice);
                }
                
                setSaskaitos(invoices);
                setDraftSaskaitos(drafts);
            } catch (e) { 
                console.error("Failed to load invoices.", e); 
            } finally { 
                setLoading(false); 
            }
        };
        if(loading) {
            loadData();
        }
    }, [loading]);

    useEffect(() => { if (!loading) AsyncStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(saskaitos)); }, [saskaitos, loading]);
    useEffect(() => { if (!loading) AsyncStorage.setItem(STORAGE_KEY_DRAFT_INVOICES, JSON.stringify(draftSaskaitos)); }, [draftSaskaitos, loading]);

    const handleAddSaskaita = (newSaskaitaData) => { const newSaskaita = { ...newSaskaitaData, id: Date.now() + Math.random(), createdAt: new Date().toISOString(), }; setSaskaitos(prev => [newSaskaita, ...prev].sort((a, b) => new Date(b.data) - new Date(a.data))); };
    const handleUpdateInvoice = (itemId, updates) => { setSaskaitos(prev => prev.map(s => (s.id === itemId ? { ...s, ...updates } : s))); };
    const handleDeleteInvoice = (itemId) => { Alert.alert("Ištrinti sąskaitą", "Ar tikrai norite ištrinti šį įrašą?", [{ text: "Atšaukti" }, { text: "Ištrinti", style: "destructive", onPress: () => setSaskaitos(prev => prev.filter(s => s.id !== itemId)) }]); };

    const handleAddDraftInvoice = (newDraftData) => { const newDraft = { ...newDraftData, id: `DRAFT-${Date.now() + Math.random()}`, createdAt: new Date().toISOString(), }; setDraftSaskaitos(prev => [newDraft, ...prev].sort((a, b) => new Date(b.data) - new Date(a.data))); };
    const handleUpdateDraftInvoice = (itemId, updates) => { setDraftSaskaitos(prev => prev.map(d => (d.id === itemId ? { ...d, ...updates } : d))); };
    const handleDeleteDraftInvoice = (itemId) => { Alert.alert("Ištrinti sąskaitą", "Ar tikrai norite ištrinti šį įrašą?", [{ text: "Atšaukti" }, { text: "Ištrinti", style: "destructive", onPress: () => setDraftSaskaitos(prev => prev.filter(d => d.id !== itemId)) }]); };

    const handleBulkAddSaskaitos = (newInvoices) => {
        if (!Array.isArray(newInvoices) || newInvoices.length === 0) return;
        const combined = [...saskaitos];
        const existingNrs = new Set(saskaitos.map(s => s.saskaitosNr));
        newInvoices.forEach(newInv => { if (!existingNrs.has(newInv.saskaitosNr)) { combined.push(newInv); }});
        setSaskaitos(combined.sort((a, b) => new Date(b.data) - new Date(a.data)));
    };
    
    const clearAllInvoices = async () => {
        try {
            setSaskaitos([]);
            setDraftSaskaitos([]);
            await AsyncStorage.removeItem(STORAGE_KEY_INVOICES);
            await AsyncStorage.removeItem(STORAGE_KEY_DRAFT_INVOICES);
            showCustomAlert('Atlikta', 'Visos sąskaitos buvo ištrintos.');
        } catch(e) { console.error("Failed to clear invoices", e); showCustomAlert('Klaida', 'Nepavyko ištrinti sąskaitų.'); }
    };

    const value = {
        saskaitos, draftSaskaitos, loading,
        handleAddSaskaita, handleUpdateInvoice, handleDeleteInvoice,
        handleAddDraftInvoice, handleUpdateDraftInvoice, handleDeleteDraftInvoice,
        handleBulkAddSaskaitos, clearAllInvoices,
    };

    return <InvoicesContext.Provider value={value}>{children}</InvoicesContext.Provider>;
};