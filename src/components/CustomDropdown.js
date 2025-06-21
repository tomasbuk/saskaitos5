// FILE: src/components/CustomDropdown.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { styles } from '../utils/styles';

export default function CustomDropdown({ label, options, selectedValue, onSelect, placeholder }) {
    const [modalVisible, setModalVisible] = useState(false);
    
    const safeOptions = Array.isArray(options) ? options : [];
    const filteredOptions = safeOptions.filter(option => option !== '' && option !== null && typeof option !== 'undefined');

    return (
        // PATAISYMAS: Pašalintas išorinis `inputSection` apvalkalas
        <View style={{ marginBottom: styles.input.marginBottom }}>
            <Text style={styles.inputLabel}>{label}:</Text>
            <TouchableOpacity
                style={styles.input}
                onPress={() => setModalVisible(true)}
            >
                <Text style={{fontSize: 16, color: selectedValue ? '#333' : '#999'}}>
                    {selectedValue || placeholder}
                </Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity 
                    style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'}}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                >
                    <View style={{width: '90%', maxHeight: '70%', backgroundColor: 'white', borderRadius: 12, padding: 20}}>
                        <Text style={styles.listTitle}>Pasirinkite {label.toLowerCase()}</Text>
                        <ScrollView>
                            {filteredOptions.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={{paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee'}}
                                    onPress={() => {
                                        onSelect(option.value || option);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={{fontSize: 18}}>{option.label || option}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton, {marginTop: 20}]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Uždaryti</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}