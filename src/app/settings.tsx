import { StyleSheet, TouchableOpacity, View, Text, TextInput } from "react-native";
import { useApp } from "../lib/context";

const WEEK_LABELS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс',]

export default function SettingsScreen() {
    const { rate, setRate, hoursPerDay, setHoursPerDay, workDays, setWorkDays } = useApp();
    
    const toggleDay = (day:number) => {
        if (workDays.includes(day)) {
            setWorkDays(workDays.filter(d => d !== day));
        } else {
            setWorkDays([...workDays, day]);
        }
    }

    return (
        <View style={styles.container}>
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
                value={hoursPerDay} 
                onChangeText={setHoursPerDay} 
                placeholder="Например, 8"
                keyboardType="decimal-pad"
            />
            <Text style={styles.label}>Рабочие дни:</Text>
            <View style={styles.row}>
            {WEEK_LABELS.map((label, index) => (
                <TouchableOpacity 
                    key={label}
                    onPress={() => toggleDay(index)}
                    style={[styles.button, workDays.includes(index) && styles.buttonActive]}
                >
                    <Text style={styles.buttonText}>{label}</Text>
            </TouchableOpacity>
            ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
    label: { fontSize: 16, marginBottom: 8, color: '#333' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 18, marginBottom: 10 },
    row: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
    button: { backgroundColor: 'gray', padding: 12, borderRadius: 8, marginTop: 12, alignItems: 'center' },
    buttonActive: { backgroundColor: 'blue'},
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})