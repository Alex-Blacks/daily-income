import { Text, View, TouchableOpacity } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { fromKey, MONTH_FOR_DAYS } from "../../lib/dates";
import { useApp } from "../../lib/context";
import { common } from '../../lib/styles';

const money = (n: number) => `${n.toFixed(2)} ₽`;

export default function DayScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const { settings, overtime, removeOvertime } = useApp();
    const d = fromKey(date);
    const jsDay = (d.getDay() + 6) % 7;
    const isWorkDay = settings.workDays.includes(jsDay);
    const baseHours = isWorkDay ? settings.hoursPerDay : 0;
    const baseIncome = baseHours * settings.rate;

    const otEntries = overtime.filter(e => e.date === date);
    const otHours = otEntries.reduce((s,e) => s + e.hours,0) || 0;
    const otIncome = otEntries.reduce((s, e) => s + e.hours * e.rate, 0) || 0;
    const total = baseIncome + otIncome;

    return (
        <>
        <Stack.Screen options={{ title: `${d.getDate()} ${MONTH_FOR_DAYS[d.getMonth()]}`}}/>
        <View style={common.container}>
            <Text style={common.label}>
                {isWorkDay ? 'Рабочий день' : 'Выходной' }
            </Text>
            <Text style={common.label}>
                {baseHours} ч × {settings.rate || 0} ₽ = {money(baseIncome)}
            </Text>
            <View>
                <Text style={common.label}>Переработка</Text>
                {otEntries.length === 0 ? (
                    <Text style={common.label}>Нет записей</Text>
                ) : (
                    otEntries.map((e) => (
                        <View key={e.id}>
                            <Text style={common.label}>
                                {e.hours} ч × {e.rate} ₽ = {money(e.hours * e.rate)}
                            </Text>
                            <TouchableOpacity style={common.buttonDanger} onPress={() => removeOvertime(e.id)}>
                                <Text style={common.buttonText}>Удалить</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
                
                <TouchableOpacity style={common.button} onPress={() => router.push('/overtime/new/'+date)}> 
                    <Text style={common.buttonText}>+ Добавить переработку</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={{ padding: 10, alignItems: 'center', backgroundColor: '#007aff' }}>
            <Text style={{ color: '#fff', fontSize: 13, opacity: 0.9 }}>Итого за день</Text>
            <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 4 }}>{money(total)}</Text>
        </View>
        </>
    )
}