// FILE: src/utils/helpers.js
import { Alert } from 'react-native';
import { statusColors } from './styles';

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

export const generateRandomInvoices = (count, currentRusys, currentBusena, currentMokejimoPaskirtis, currentTiekejai) => {
    const invoices = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = now;
    const maxDateTimestamp = endDate.getTime();
    const minDateTimestamp = startDate.getTime();

    for (let i = 0; i < count; i++) {
      const randomTimestamp = minDateTimestamp + Math.random() * (maxDateTimestamp - minDateTimestamp);
      const randomDateObj = new Date(randomTimestamp);
      const randomDate = `${randomDateObj.getFullYear()}-${String(randomDateObj.getMonth() + 1).padStart(2, '0')}-${String(randomDateObj.getDate()).padStart(2, '0')}`;
      const randomSaskaitosNr = `SF-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      const randomTiekejas = currentTiekejai[Math.floor(Math.random() * currentTiekejai.length)];
      const randomPaskirtis = currentMokejimoPaskirtis[Math.floor(Math.random() * currentMokejimoPaskirtis.length)];
      const randomSuma = parseFloat((Math.random() * 40 + 10).toFixed(2));
      const randomRusis = currentRusys[Math.floor(Math.random() * currentRusys.length)];
      let randomBusena = currentBusena[Math.floor(Math.random() * currentBusena.length)];
      let paidSuma = 0;

      if (randomBusena === 'Apmokėta' || randomBusena === 'Nuosavos lėšos') {
        paidSuma = randomSuma;
      } else if (randomBusena === 'Dalinai apmokėta') {
        if (randomSuma > 0) {
          paidSuma = parseFloat((Math.random() * randomSuma * 0.8 + 0.1).toFixed(2));
          if (paidSuma >= randomSuma) {
            paidSuma = parseFloat((randomSuma * 0.5).toFixed(2));
          }
        } else {
          paidSuma = 0;
        }
      } else {
        paidSuma = 0;
      }

      const randomComment = Math.random() > 0.7 ? `Atsitiktinis komentaras apie ${randomPaskirtis}.` : '';
      let apmoketiIkiDate = new Date(randomDateObj);
      if (randomBusena === 'Neapmokėta' && Math.random() < 0.4) {
        apmoketiIkiDate.setDate(randomDateObj.getDate() - Math.floor(Math.random() * 10 + 1));
      } else {
        apmoketiIkiDate.setDate(randomDateObj.getDate() + Math.floor(Math.random() * 20 + 5));
      }
      const apmoketiIki = `${apmoketiIkiDate.getFullYear()}-${String(apmoketiIkiDate.getMonth() + 1).padStart(2, '0')}-${String(apmoketiIkiDate.getDate()).padStart(2, '0')}`;

      invoices.push({
        id: Date.now() + i,
        data: randomDate,
        saskaitosNr: randomSaskaitosNr,
        tiekejas: randomTiekejas,
        mokejimoPaskirtis: randomPaskirtis,
        suma: randomSuma,
        paidSuma: paidSuma,
        rusis: randomRusis,
        busena: randomBusena,
        createdAt: new Date().toISOString(),
        comment: randomComment,
        apmoketiIki: apmoketiIki,
      });
    }
    return invoices.sort((a, b) => new Date(b.data) - new Date(a.data));
};
  
export const generateRandomDraftInvoices = (count, currentBusena, currentMokejimoPaskirtis, currentPirkejai) => {
    const invoices = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = now;
    const maxDateTimestamp = endDate.getTime();
    const minDateTimestamp = startDate.getTime();

    for (let i = 0; i < count; i++) {
        const randomTimestamp = minDateTimestamp + Math.random() * (maxDateTimestamp - minDateTimestamp);
        const randomDateObj = new Date(randomTimestamp);
        const randomDate = `${randomDateObj.getFullYear()}-${String(randomDateObj.getMonth() + 1).padStart(2, '0')}-${String(randomDateObj.getDate()).padStart(2, '0')}`;
        const randomSaskaitosNr = `ISF-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        const randomPirkejas = currentPirkejai[Math.floor(Math.random() * currentPirkejai.length)];
        const randomPaskirtis = currentMokejimoPaskirtis[Math.floor(Math.random() * currentMokejimoPaskirtis.length)];
        const randomSuma = parseFloat((Math.random() * 100 + 50).toFixed(2));
        const randomBusena = currentBusena[Math.floor(Math.random() * currentBusena.length)];
        let paidSuma = 0;

        if (randomBusena === 'Apmokėta' || randomBusena === 'Nuosavos lėšos') {
            paidSuma = randomSuma;
        } else if (randomBusena === 'Dalinai apmokėta') {
            if (randomSuma > 0) {
                paidSuma = parseFloat((Math.random() * randomSuma * 0.8 + 0.1).toFixed(2));
                if (paidSuma >= randomSuma) {
                    paidSuma = parseFloat((randomSuma * 0.5).toFixed(2));
                }
            } else {
                paidSuma = 0;
            }
        } else {
            paidSuma = 0;
        }
        
        const randomComment = Math.random() > 0.7 ? `Komentaras apie išrašytą sąskaitą ${randomPaskirtis}.` : '';
        let apmoketiIkiDate = new Date(randomDateObj);
        if (randomBusena === 'Neapmokėta' && Math.random() < 0.4) {
            apmoketiIkiDate.setDate(randomDateObj.getDate() + Math.floor(Math.random() * 10 + 1));
        } else {
            apmoketiIkiDate.setDate(randomDateObj.getDate() + Math.floor(Math.random() * 20 + 5));
        }
        const apmoketiIki = `${apmoketiIkiDate.getFullYear()}-${String(apmoketiIkiDate.getMonth() + 1).padStart(2, '0')}-${String(apmoketiIkiDate.getDate()).padStart(2, '0')}`;
        
        invoices.push({
            id: `DRAFT-${Date.now() + i}`,
            data: randomDate,
            saskaitosNr: randomSaskaitosNr,
            pirkejas: randomPirkejas,
            mokejimoPaskirtis: randomPaskirtis,
            suma: randomSuma,
            paidSuma: paidSuma,
            busena: randomBusena,
            createdAt: new Date(randomTimestamp).toISOString(),
            comment: randomComment,
            apmoketiIki: apmoketiIki,
        });
    }
    return invoices.sort((a, b) => new Date(b.data) - new Date(a.data));
};
  
export const incrementReceivedInvoiceNumber = (invoiceNr) => {
    const match = invoiceNr.match(/^(.*?)(\d+)$/);
    if (match) {
        const prefix = match[1];
        const numberPart = parseInt(match[2], 10);
        const newNumber = numberPart + 1;
        const paddedNumber = String(newNumber).padStart(match[2].length, '0');
        return `${prefix}${paddedNumber}`;
    }
    if (invoiceNr.includes('-')) {
        const parts = invoiceNr.split('-');
        const lastPart = parts[parts.length - 1];
        const parsedLastPart = parseInt(lastPart, 10);
        if (!isNaN(parsedLastPart)) {
            const newLastPart = parsedLastPart + 1;
            const paddedLastPart = String(newLastPart).padStart(lastPart.length, '0');
            return [...parts.slice(0, -1), paddedLastPart].join('-');
        }
    }
    return `${invoiceNr}-NEW`;
};

export const incrementInvoiceNumberGenerator = (series, lastNumber) => {
    const numPart = parseInt(lastNumber, 10);
    const newNumPart = numPart + 1;
    const paddedNewNumPart = String(newNumPart).padStart(String(lastNumber).length, '0');
    return `${series}${paddedNewNumPart}`;
};
  
export const extractNumericPart = (invoiceNr, series) => {
    if (invoiceNr.startsWith(series) && invoiceNr.length > series.length) {
      const numPartStr = invoiceNr.substring(series.length);
      const numPart = parseInt(numPartStr, 10);
      return isNaN(numPart) ? 0 : numPart;
    }
    return 0;
};
  
export const findHighestDraftInvoiceNumber = (drafts, series, defaultNum) => {
    let maxNum = parseInt(defaultNum, 10) || 0;
    let maxNumString = defaultNum;
  
    drafts.forEach(draft => {
      const numPart = extractNumericPart(draft.saskaitosNr, series);
      if (numPart > maxNum) {
        maxNum = numPart;
        maxNumString = draft.saskaitosNr.substring(series.length);
      }
    });
    return maxNumString;
};