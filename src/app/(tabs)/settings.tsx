import { StyleSheet, TouchableOpacity, View, Text, TextInput } from "react-native";
import { useApp } from "../../lib/context";
import { common, chips } from '../../lib/styles';

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
        <View style={common.container}>
            <Text style={common.label}>Тариф:</Text>
            <TextInput 
                style={common.input} 
                value={rate} 
                onChangeText={setRate} 
                placeholder="Например, 500"
                keyboardType="decimal-pad"
            />

            <Text style={common.label}>Часы:</Text>
            <TextInput 
                style={common.input} 
                value={hoursPerDay} 
                onChangeText={setHoursPerDay} 
                placeholder="Например, 8"
                keyboardType="decimal-pad"
            />
            <Text style={common.label}>Рабочие дни:</Text>
            <View style={common.row}>
            {WEEK_LABELS.map((label, index) => (
                <TouchableOpacity 
                    key={label}
                    onPress={() => toggleDay(index)}
                    style={[chips.chip, workDays.includes(index) && chips.chipActive]}
                >
                    <Text style={chips.chipText}>{label}</Text>
            </TouchableOpacity>
            ))}
            </View>
        </View>
    );
}