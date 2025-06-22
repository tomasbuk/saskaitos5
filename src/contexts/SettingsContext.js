// FILE: src/contexts/SettingsContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as C from '../constants';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [rusysOptions, setRusysOptions] = useState(C.initialRusysOptions);
    const [busenaOptions, setBusenaOptions] = useState(C.initialBusenaOptions);
    const [mokejimoPaskirtisOptions, setMokejimoPaskirtisOptions] = useState(C.initialMokejimoPaskirtisOptions);
    const [tiekejaiOptions, setTiekejaiOptions] = useState(C.initialTiekejaiOptions);
    const [pirkejaiOptions, setPirkejaiOptions] = useState(C.initialPirkejaiOptions);
    const [draftInvoiceSeries, setDraftInvoiceSeries] = useState('GK-');
    const [draftInvoiceLastNumber, setDraftInvoiceLastNumber] = useState('0');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedRusys = await AsyncStorage.getItem(C.STORAGE_KEY_RUSYS); if (storedRusys) setRusysOptions(JSON.parse(storedRusys));
                const storedBusena = await AsyncStorage.getItem(C.STORAGE_KEY_BUSENA); if (storedBusena) setBusenaOptions(JSON.parse(storedBusena));
                const storedMokejimoPaskirtis = await AsyncStorage.getItem(C.STORAGE_KEY_MOKEJIMO_PASKIRTIS); if (storedMokejimoPaskirtis) setMokejimoPaskirtisOptions(JSON.parse(storedMokejimoPaskirtis));
                const storedTiekejai = await AsyncStorage.getItem(C.STORAGE_KEY_SUPPLIERS); if (storedTiekejai) setTiekejaiOptions(JSON.parse(storedTiekejai));
                const storedPirkejai = await AsyncStorage.getItem(C.STORAGE_KEY_BUYERS); if (storedPirkejai) setPirkejaiOptions(JSON.parse(storedPirkejai));
                const storedDraftSeries = await AsyncStorage.getItem(C.STORAGE_KEY_DRAFT_INVOICE_SERIES); if (storedDraftSeries) setDraftInvoiceSeries(storedDraftSeries);
                const storedDraftLastNumber = await AsyncStorage.getItem(C.STORAGE_KEY_DRAFT_INVOICE_LAST_NUMBER); if (storedDraftLastNumber) setDraftInvoiceLastNumber(storedDraftLastNumber);
            } catch (e) { console.error("Failed to load settings", e); } 
            finally { setLoading(false); }
        };
        loadSettings();
    }, []);

    useEffect(() => { if (!loading) AsyncStorage.setItem(C.STORAGE_KEY_RUSYS, JSON.stringify(rusysOptions)); }, [rusysOptions, loading]);
    useEffect(() => { if (!loading) AsyncStorage.setItem(C.STORAGE_KEY_BUSENA, JSON.stringify(busenaOptions)); }, [busenaOptions, loading]);
    useEffect(() => { if (!loading) AsyncStorage.setItem(C.STORAGE_KEY_MOKEJIMO_PASKIRTIS, JSON.stringify(mokejimoPaskirtisOptions)); }, [mokejimoPaskirtisOptions, loading]);
    useEffect(() => { if (!loading) AsyncStorage.setItem(C.STORAGE_KEY_SUPPLIERS, JSON.stringify(tiekejaiOptions)); }, [tiekejaiOptions, loading]);
    useEffect(() => { if (!loading) AsyncStorage.setItem(C.STORAGE_KEY_BUYERS, JSON.stringify(pirkejaiOptions)); }, [pirkejaiOptions, loading]);
    useEffect(() => { if (!loading) AsyncStorage.setItem(C.STORAGE_KEY_DRAFT_INVOICE_SERIES, draftInvoiceSeries); }, [draftInvoiceSeries, loading]);
    useEffect(() => { if (!loading) AsyncStorage.setItem(C.STORAGE_KEY_DRAFT_INVOICE_LAST_NUMBER, draftInvoiceLastNumber); }, [draftInvoiceLastNumber, loading]);

    const value = {
        rusysOptions, setRusysOptions, busenaOptions, setBusenaOptions,
        mokejimoPaskirtisOptions, setMokejimoPaskirtisOptions, tiekejaiOptions, setTiekejaiOptions,
        pirkejaiOptions, setPirkejaiOptions, draftInvoiceSeries, setDraftInvoiceSeries,
        draftInvoiceLastNumber, setDraftInvoiceLastNumber,
        loading
    };

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};