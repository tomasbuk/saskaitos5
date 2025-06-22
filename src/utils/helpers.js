// FILE: src/utils/helpers.js
import { Alert } from 'react-native';

export const showCustomAlert = (title, message) => {
  Alert.alert(title, message);
};

export const incrementReceivedInvoiceNumber = (invoiceNr) => {
    if (typeof invoiceNr !== 'string' || invoiceNr.trim() === '') return '';
    const match = invoiceNr.match(/^(.*?)(\d+)$/);
    if (match) {
        const prefix = match[1];
        const numberPart = match[2];
        const newNumber = parseInt(numberPart, 10) + 1;
        const paddedNumber = String(newNumber).padStart(numberPart.length, '0');
        return `${prefix}${paddedNumber}`;
    }
    return `${invoiceNr}-1`;
};

// PATAISYMAS: Pridedame funkcijas duomenų generavimui
export const generateRandomInvoices = (count, tiekejai, rusys, busena, paskirtys) => {
    const invoices = [];
    for (let i = 0; i < count; i++) {
        const randomDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
        const dueDate = new Date(randomDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        const status = busena[Math.floor(Math.random() * busena.length)];
        const total = parseFloat((Math.random() * 200 + 20).toFixed(2));
        let paid = 0;
        if (status === 'Apmokėta') paid = total;
        if (status === 'Dalinai apmokėta') paid = parseFloat((total * Math.random() * 0.8).toFixed(2));
        
        invoices.push({
            id: Date.now() + i + Math.random(),
            data: randomDate.toISOString().split('T')[0],
            saskaitosNr: `TEST-${1000 + i}`,
            tiekejas: tiekejai[Math.floor(Math.random() * tiekejai.length)],
            suma: total,
            paidSuma: paid,
            rusis: rusys[Math.floor(Math.random() * rusys.length)],
            busena: status,
            mokejimoPaskirtis: paskirtys[Math.floor(Math.random() * paskirtys.length)],
            apmoketiIki: dueDate.toISOString().split('T')[0],
            comment: '',
            createdAt: new Date().toISOString(),
        });
    }
    return invoices;
};

export const generateRandomDraftInvoices = (count, pirkejai, busena, paskirtys) => {
    const invoices = [];
     for (let i = 0; i < count; i++) {
        const randomDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
        const dueDate = new Date(randomDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        const status = busena[Math.floor(Math.random() * busena.length)];
        const total = parseFloat((Math.random() * 500 + 50).toFixed(2));
        let paid = 0;
        if (status === 'Apmokėta') paid = total;
        if (status === 'Dalinai apmokėta') paid = parseFloat((total * Math.random() * 0.8).toFixed(2));

        invoices.push({
            id: `DRAFT-${Date.now() + i + Math.random()}`,
            data: randomDate.toISOString().split('T')[0],
            saskaitosNr: `KRAUT-${202500 + i}`,
            pirkejas: pirkejai[Math.floor(Math.random() * pirkejai.length)],
            suma: total,
            paidSuma: paid,
            busena: status,
            mokejimoPaskirtis: paskirtys[Math.floor(Math.random() * paskirtys.length)],
            apmoketiIki: dueDate.toISOString().split('T')[0],
            comment: '',
            createdAt: new Date().toISOString(),
        });
    }
    return invoices;
};