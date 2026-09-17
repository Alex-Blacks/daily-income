import { StyleSheet, TouchableOpacity, View, Text, TextInput } from "react-native";
import { useApp } from "../../lib/context";
import { common, chips } from '../../lib/styles';
import { WEEKDAYS_SHORT } from '../../lib/dates';

export default function SettingsScreen() {
    const { settings, updateSettings } = useApp();
    
    const toggleDay = (day:number) => {
        if (settings.workDays.includes(day)) {
            updateSettings({workDays: settings.workDays.filter(d => d !== day)});
        } else {
            updateSettings({workDays: [...settings.workDays, day]});
        }
    }

    return (
        <View style={common.container}>
            <Text style={common.label}>Тариф:</Text>
            <TextInput 
                style={common.input} 
                value={String(settings.rate)} 
                onChangeText={(t) => updateSettings({rate: Number(t) || 0})} 
                placeholder="Например, 500"
                keyboardType="decimal-pad"
            />

            <Text style={common.label}>Часы:</Text>
            <TextInput 
                style={common.input} 
                value={String(settings.hoursPerDay)} 
                onChangeText={(t) => updateSettings({hoursPerDay: Number(t) || 0})} 
                placeholder="Например, 8"
                keyboardType="decimal-pad"
            />
            <Text style={common.label}>Рабочие дни:</Text>
            <View style={common.row}>
            {WEEKDAYS_SHORT.map((label, index) => (
                <TouchableOpacity 
                    key={label}
                    onPress={() => toggleDay(index)}
                    style={[chips.chip, settings.workDays.includes(index) && chips.chipActive]}
                >
                    <Text style={chips.chipText}>{label}</Text>
            </TouchableOpacity>
            ))}
            </View>
        </View>
    );
}