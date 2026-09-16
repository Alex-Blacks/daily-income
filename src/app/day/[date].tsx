import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { parseDateKey, MONTH_LABELS_FOR_DAYS } from "../../lib/dates";
import { useApp } from "../../lib/context";
import { common } from '../../lib/styles';

export default function DayScreen() {
    const { rate, hoursPerDay, workDays, overtime, addOvertime, removeOvertime } = useApp();
    const {date} = useLocalSearchParams<{ date: string }>();
    const [year, month, day] = parseDateKey(date);
    const screenName = day + ' ' + MONTH_LABELS_FOR_DAYS[month-1] + ' ' + year;
    const basicIncome = `${hoursPerDay || 0} ч × ${rate || 0} ₽ = ${Number(rate) * Number(hoursPerDay)} ₽`;

    const isWorkDay = () => {
        return workDays.includes((new Date(year,month-1,day).getDay() + 6)%7)
    }

    const calculationOvertime = (rateOvertime:number, hoursOvertime: number) => {
        return `${hoursOvertime} ч × ${rateOvertime} ₽ = ${hoursOvertime * rateOvertime} ₽`
    }
    
    const dayOvertime = overtime.filter(o => o.date == date)
    return (
        <>
        <Stack.Screen options={{ title: screenName}}/>
        <View style={common.container}>
            {isWorkDay() ? (
                <View>
                    <Text style={common.label}>Рабочий день</Text>
                    <Text style={common.label}>{basicIncome}</Text>
                </View>
            ):(
                <Text style={common.label}>Выходной</Text>
            )}
            <View>
                <Text style={common.label}>Переработка</Text>
                {dayOvertime.length === 0 ? (
                    <Text style={common.label}>Нет записей</Text>
                ) : (
                    dayOvertime.map((label) => (
                        <View style={common.container} key={label.id}>
                            <Text style={common.label}>{calculationOvertime(label.rateOvertime, label.hoursOvertime)}</Text>
                            <TouchableOpacity style={common.buttonDanger} onPress={() => removeOvertime(label.id)}>
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
        </>
    )
}

