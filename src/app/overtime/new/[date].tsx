import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useApp } from "../../../lib/context";
import { OvertimeEntry } from "../../../lib/storage";
import { common } from '../../../lib/styles';


export default function OvertimeNewScreen() {
    const { settings, addOvertime } = useApp();
    const {date} = useLocalSearchParams<{ date: string }>();
    const [ entryHoursOvertime, setHoursOvertime ] = useState(1); 
    const [ entryRateOvertime, setRateOvertime ] = useState(settings.rate)

    const clickSave = () => {
        const entry:(Omit<OvertimeEntry, 'id'>) = {
            date: date,
            hours: Number(entryHoursOvertime),
            rate: Number(entryRateOvertime),
        }
        addOvertime(entry)
        router.back()
    }

    const isValid = () => {
        return Number(entryHoursOvertime) > 0 && Number(entryRateOvertime) > 0
    }
    return (
        <>
        <Stack.Screen options={{ title: 'Переработка'}} />
        <View style={common.container}>
            <Text style={common.label}>Дата: {date}</Text>
            <Text style={common.label}> Часов переработки</Text>
            <TextInput
                value={String(entryHoursOvertime)}
                onChangeText={(t) => setHoursOvertime(Number(t) || 0)}
                placeholder= {String(settings.hoursPerDay)}
                keyboardType="decimal-pad"
                style={common.input}
            /> 
            <Text style={common.label}>Ставка,₽/час</Text>
            <TextInput 
                value={String(entryRateOvertime)}
                onChangeText={(t) => setRateOvertime(Number(t) || 0)}
                placeholder={String(settings.rate)}
                keyboardType="decimal-pad"
                style={common.input}
            />
            <Text style={common.label}>Итого за эту переработку: {(Number(entryRateOvertime) * Number(entryHoursOvertime)) || 0}</Text>
            <TouchableOpacity 
                onPress={clickSave}
                disabled={!isValid()}
                style={common.button}
            >
                <Text style={common.label}>Сохранить</Text>
            </TouchableOpacity>
        </View>
        </>
    )
}