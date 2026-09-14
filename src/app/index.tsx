import { useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
    const [rate, setRate] = useState('');
    const [hours, setHours] = useState('');

    const rateNum = parseFloat(rate) || 0;
    const hoursNum = parseFloat(hours) || 0;
    const dailyIncome = rateNum * hoursNum

    return (
        <View style={styles.container}>
            <Link href="/settings" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Настройки</Text>
                </TouchableOpacity>
            </Link>
            <Text style={styles.label}>Тариф:</Text>
            <TextInput 
                style={styles.input} 
                value={rate} 
                onChangeText={setRate} 
                placeholder="Например, 500"
                keyboardType="decimal-pad"
            />
            <Text style={styles.label}>Часы:</Text>
            <TextInput 
                style={styles.input} 
                value={hours} 
                onChangeText={setHours} 
                placeholder="Например, 8"
                keyboardType="decimal-pad"
            />
            <TouchableOpacity style={styles.button} onPress={() => setHours(String(hoursNum + 1))}>
                <Text style={styles.buttonText}>+1 час</Text>
            </TouchableOpacity>
            <Text style={styles.result}>Сумма за день: {dailyIncome}</Text>
            <TouchableOpacity 
                style={styles.buttonCancel}
                onPress={() => {
                setRate('');
                setHours('')
                }}>
                <Text style={styles.buttonText}>Сброс</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
    label: { fontSize: 16, marginBottom: 8, color: '#333' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 18, marginBottom: 10 },
    button: { backgroundColor: 'gray', padding: 10, borderRadius: 8, alignItems: 'center' },
    buttonCancel: { backgroundColor: '#007aff', padding: 12, borderRadius: 8, marginTop: 12, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    result: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 24 },
})