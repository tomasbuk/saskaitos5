// FILE: src/utils/pdfGenerator.js
import RNHTMLtoPDF from 'react-native-html-to-pdf';

// Ši funkcija sukuria HTML turinį sąskaitai
const createInvoiceHTML = (invoice, companyDetails) => {
    // Apskaičiuojame PVM ir bendrą sumą (pavyzdys su 21% PVM)
    const pvmRate = 0.21;
    const sumaBePVM = (invoice.suma / (1 + pvmRate)).toFixed(2);
    const pvmSuma = (invoice.suma - sumaBePVM).toFixed(2);

    // Naudojame inline CSS stilius, nes jie patikimiausiai veikia su šia biblioteka
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Sąskaita</title>
            <style>
                body { font-family: 'Helvetica Neue', 'Helvetica', sans-serif; color: #333; }
                .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 16px; line-height: 24px; }
                .header { text-align: center; margin-bottom: 40px; }
                .header h1 { margin: 0; font-size: 28px; color: #333; }
                .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
                .details-left, .details-right { width: 48%; }
                .details-right { text-align: right; }
                .details-box { padding: 10px; background-color: #f9f9f9; border-radius: 5px; margin-bottom: 10px; }
                .details-box p { margin: 0; }
                table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
                table td { padding: 8px; vertical-align: top; }
                table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
                table tr.item td { border-bottom: 1px solid #eee; }
                table tr.total td { border-top: 2px solid #eee; font-weight: bold; text-align: right; }
                .text-right { text-align: right; }
            </style>
        </head>
        <body>
            <div class="invoice-box">
                <div class="header">
                    <h1>SĄSKAITA FAKTŪRA</h1>
                    <h2>Serija ${invoice.saskaitosNr}</h2>
                </div>
                <div class="details">
                    <div class="details-left">
                        <div class="details-box">
                            <strong>Pardavėjas:</strong>
                            <p>${companyDetails.left}</p>
                            <p>${companyDetails.right}</p>
                        </div>
                        <div class="details-box">
                            <strong>Pirkėjas:</strong>
                            <p>${invoice.pirkejas}</p>
                        </div>
                    </div>
                    <div class="details-right">
                        <p><strong>Išrašymo data:</strong> ${new Date(invoice.data).toLocaleDateString('lt-LT')}</p>
                        <p><strong>Apmokėti iki:</strong> ${new Date(invoice.apmoketiIki).toLocaleDateString('lt-LT')}</p>
                    </div>
                </div>
                <table>
                    <tr class="heading">
                        <td>Paslauga / Prekė</td>
                        <td class="text-right">Suma</td>
                    </tr>
                    <tr class="item">
                        <td>${invoice.mokejimoPaskirtis}</td>
                        <td class="text-right">${sumaBePVM} EUR</td>
                    </tr>
                    <tr class="total">
                        <td></td>
                        <td>PVM (21%): ${pvmSuma} EUR</td>
                    </tr>
                    <tr class="total">
                        <td></td>
                        <td><strong>Bendra suma: ${invoice.suma.toFixed(2)} EUR</strong></td>
                    </tr>
                </table>
                 <p style="margin-top: 40px;">Sąskaitą išrašė: ${companyDetails.left}</p>
            </div>
        </body>
        </html>
    `;
};

// Pagrindinė funkcija, kurią kviesime iš ekrano
export const generateInvoicePdf = async (invoice, companyDetails) => {
    try {
        const htmlContent = createInvoiceHTML(invoice, companyDetails);
        const options = {
            html: htmlContent,
            fileName: `saskaita_${invoice.saskaitosNr}`,
            directory: 'Documents', // iOS'e bus ignoruojama, Android'e išsaugos į Documents katalogą
        };

        const file = await RNHTMLtoPDF.convert(options);
        console.log('PDF sugeneruotas:', file.filePath);
        return file;
    } catch (error) {
        console.error('Klaida generuojant PDF:', error);
        return null;
    }
};