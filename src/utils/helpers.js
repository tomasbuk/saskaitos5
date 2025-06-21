// FILE: src/utils/helpers.js
import { Alert } from 'react-native';
import { statusColors } from './styles';

export const normalizeText = (text) => {
    if (typeof text !== 'string') return '';
    return text
        .toLowerCase()
        .replace(/ą/g, 'a')
        .replace(/č/g, 'c')
        .replace(/ę/g, 'e')
        .replace(/ė/g, 'e')
        .replace(/į/g, 'i')
        .replace(/š/g, 's')
        .replace(/ų/g, 'u')
        .replace(/ū/g, 'u')
        .replace(/ž/g, 'z');
};

export const getBusenaColor = (busena) => {
  switch (busena) {
    case 'Apmokėta': return statusColors.paid;
    case 'Neapmokėta': return statusColors.unpaid;
    case 'Dalinai apmokėta': return statusColors.partial;
    case 'Nuosavos lėšos': return statusColors.own_funds;
    default: return '#e9f5ff';
  }
};

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