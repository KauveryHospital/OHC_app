import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const AddPressure = () => {
    const formatDate = (date) => {
        const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return date.toLocaleDateString('en-GB', options).replace(',', '');
    };

    const [date, setDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState(formatDate(new Date()));
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [systolicError, setSystolicError] = useState('');
    const [diastolicError, setDiastolicError] = useState('');
    const [notes, setNotes] = useState('');
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false); 
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); 

    const [isFocused, setIsFocused] = useState({
        date: false,
        systolic: false,
        diastolic: false,
        notes: false,
    });

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleFocus = (field) => {
        setIsFocused({ ...isFocused, [field]: true });
    };

    const handleBlur = (field) => {
        setIsFocused({ ...isFocused, [field]: false });
    };

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleConfirm = (selectedDate) => {
        setDate(selectedDate);
        setFormattedDate(formatDate(selectedDate));
        hideDatePicker();
    };

    const validateBloodPressure = () => {
        const systolicValue = parseInt(systolic, 10);
        const diastolicValue = parseInt(diastolic, 10);
        let isValid = true;

        setSystolicError('');
        setDiastolicError('');

        if (systolic=='') {
            setSystolicError('Please enter systolic value');
            isValid = false;
        }
        if (diastolic=='') {
            setDiastolicError('Please enter diastolic value');
            isValid = false;
        }
        if (systolicValue <= 30 || systolicValue >= 305) {
            setSystolicError('Blood pressure systolic level should be in range of >=30 to <=305');
            isValid = false;
        }
        if (diastolicValue <= 20 || diastolicValue >= 180) {
            setDiastolicError('Blood pressure diastolic level should be in range of >=20 to <=180');
            isValid = false;
        }
        return isValid;
    };

    const handleSave = () => {
        if (validateBloodPressure()) {
            // Save the data or perform the action you need
            // Alert.alert('Success', 'Blood pressure data saved successfully.');
            // navigation.goBack();
            setLoading(true);
        setTimeout(() => {
            setLoading(false); 
            setShowSuccessMessage(true);
            setTimeout(() => {
                navigation.navigate('pressure', { message: 'Blood pressure added successfully!' });
                setShowSuccessMessage(false);  
            }, 2000); 
        }, 2000); 
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color="#692367" />
            </TouchableOpacity>

            <Text style={styles.title}>Add Blood Pressure</Text>

            <View style={styles.separatorLine} />
            <View style={styles.inputContainer}>
                <Text style={isFocused.date || date ? styles.labelFocused : styles.label}>
                    Date and Time *
                </Text>
                <TouchableOpacity onPress={showDatePicker}>
                    <TextInput
                        style={styles.input}
                        value={formattedDate}
                        editable={false}  // Prevent manual editing of date
                        onFocus={() => handleFocus('date')}
                        onBlur={() => handleBlur('date')}
                    />
                </TouchableOpacity>
            </View>

            {/* Date Picker Modal */}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                date={date}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                is24Hour={false}
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
            />

            {/* Systolic Field */}
            <View style={styles.rowContainer}>
                <View style={styles.halfInputContainer}>
                    <Text style={isFocused.systolic || systolic ? styles.labelFocused : styles.label}>
                        Systolic (mmHg)
                    </Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={systolic}
                        onFocus={() => handleFocus('systolic')}
                        onBlur={() => handleBlur('systolic')}
                        onChangeText={(text) => setSystolic(text)}
                    />
                    {systolicError ? <Text style={styles.errorText}>{systolicError}</Text> : null}
                </View>

                {/* Diastolic Field */}
                <View style={styles.halfInputContainer}>
                    <Text style={isFocused.diastolic || diastolic ? styles.labelFocused : styles.label}>
                        Diastolic (mmHg)
                    </Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={diastolic}
                        onFocus={() => handleFocus('diastolic')}
                        onBlur={() => handleBlur('diastolic')}
                        onChangeText={(text) => setDiastolic(text)}
                    />
                    {diastolicError ? <Text style={styles.errorText}>{diastolicError}</Text> : null}
                </View>
            </View>

            {/* Notes Field */}
            <View style={styles.inputContainer}>
                <Text style={isFocused.notes || notes ? styles.labelFocused : styles.label}>
                    Notes
                </Text>
                <TextInput
                    style={styles.input}
                    multiline
                    value={notes}
                    onFocus={() => handleFocus('notes')}
                    onBlur={() => handleBlur('notes')}
                    onChangeText={(text) => setNotes(text)}
                />
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            {loading && (
                    <BlurView intensity={50} style={StyleSheet.absoluteFill}>
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    </BlurView>
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    //   header: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    //     color: '#6A1B4D',
    //     textAlign: 'center',
    //     marginBottom: 20,
    //   },
    header: {
        flexDirection: 'row',
        // alignItems: 'spa',
        justifyContent: 'space-between',
        // backgroundColor: '#800080',

    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        color: '#692367',
        textAlign: 'center',
    },
    separatorLine: {
        height: 5,
        backgroundColor: '#692367',
        width: '100%',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 16,
        borderBottomWidth: 1,
        borderColor: '#D3D3D3',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    halfInputContainer: {
        flex: 1,
        marginHorizontal: 4,
        borderBottomWidth: 1,
        borderColor: '#D3D3D3',
    },
    label: {
        position: 'absolute',
        top: 14,
        left: 8,
        fontSize: 14,
        color: '#A9A9A9',
    },
    labelFocused: {
        position: 'absolute',
        top: -8,
        left: 8,
        fontSize: 12,
        color: '#6A1B4D',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 4,
    },
    input: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#6A1B4D',
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default AddPressure;
