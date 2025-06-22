// FILE: surinktiKoda.js
const fs = require('fs');
const path = require('path');

const filesToRead = [
    'package.json',
    'App.js',
    'src/navigation/AppNavigator.js',
    'src/navigation/ClassifierTabNavigator.js',
    'src/contexts/CashContext.js',
    'src/contexts/InvoicesContext.js',
    'src/contexts/SettingsContext.js',
    'src/constants/index.js',
    'src/utils/helpers.js',
    'src/utils/styles.js',
    'src/components/AnimatedWarningIcon.js',
    'src/components/CustomDropdown.js',
    'src/components/CustomHeader.js',
    'src/components/DatePickerModal.js',
    'src/components/EditInvoiceModal.js',
    'src/components/FilterPanel.js',
    'src/components/SettingsItem.js',
    'src/screens/AddDraftInvoiceScreen.js',
    'src/screens/AddInvoiceScreen.js',
    'src/screens/CashRegisterScreen.js',
    'src/screens/DraftInvoicesScreen.js',
    'src/screens/ReceivedInvoicesScreen.js',
    'src/screens/ReportsScreen.js',
    'src/screens/StartScreen.js',
    'src/screens/settings/BalanceSettingsScreen.js',
    'src/screens/settings/ClassifierListScreen.js', // Jei egzistuoja
    'src/screens/settings/DangerZoneScreen.js',
    'src/screens/settings/GeneralSettingsScreen.js',
    'src/screens/settings/ImportScreen.js',
    'src/screens/settings/ListManagerScreen.js',
    'src/screens/settings/PartnerListScreen.js',
    'src/screens/settings/SettingsDashboardScreen.js',
    'src/screens/settings/ZReportImportScreen.js'
];

let fullContent = '';

filesToRead.forEach(filePath => {
    try {
        const absolutePath = path.resolve(__dirname, filePath);
        if (fs.existsSync(absolutePath)) {
            const content = fs.readFileSync(absolutePath, 'utf8');
            fullContent += `// FILE: ${filePath}\n\n`;
            fullContent += content;
            fullContent += '\n\n// --- END OF FILE ---\n\n';
        } else {
            console.log(`Failas nerastas, praleidžiama: ${filePath}`);
        }
    } catch (error) {
        console.error(`Nepavyko nuskaityti failo ${filePath}:`, error);
    }
});

fs.writeFileSync('visas_kodas.txt', fullContent);
console.log('Sukurta bylas "visas_kodas.txt" su visu programėlės kodu.');