// FILE: src/components/PdfPreviewModal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { styles } from '../utils/styles';

export default function PdfPreviewModal({ visible, onClose, invoice }) {
    if (!visible || !invoice) return null;

    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
             <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                <View style={[styles.inputSection, {margin: 20}]}>
                    <Text style={styles.listTitle}>Sąskaitos Peržiūra</Text>
                    <View style={{marginBottom: 20}}>
                        <Text style={styles.inputLabel}>Sąskaitos Nr.:</Text>
                        <Text style={styles.itemTextBold}>{invoice.saskaitosNr}</Text>
                    </View>
                     <View style={{marginBottom: 20}}>
                        <Text style={styles.inputLabel}>Pirkėjas:</Text>
                        <Text style={styles.itemTextBold}>{invoice.pirkejas}</Text>
                    </View>
                    <View style={{marginBottom: 20}}>
                        <Text style={styles.inputLabel}>Suma:</Text>
                        <Text style={styles.itemTextBold}>{invoice.suma.toFixed(2)} EUR</Text>
                    </View>
                    <View style={{marginBottom: 20}}>
                        <Text style={styles.inputLabel}>Būsena:</Text>
                        <Text style={styles.itemTextBold}>{invoice.busena}</Text>
                    </View>
                    <View style={{borderTopWidth: 1, borderColor: '#eee', paddingTop: 10, marginTop: 20}}>
                         <Text style={styles.infoText}>
                            Norint generuoti tikrą PDF failą, reikėtų integruoti specializuotą biblioteką, pvz., `react-native-html-to-pdf`.
                        </Text>
                    </View>
                    
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Uždaryti</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Modal>
    );
}