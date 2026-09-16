import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Link, router} from 'expo-router';
import { useApp } from '../../lib/context';
import { makeDateKey, MONTH_LABELS } from '../../lib/dates';
import { common, calendar } from '../../lib/styles';


function buildMonthGrid(year:number, month:number) {
    let calendar:(number | null)[] = [];
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < 6; i++){
        for (let j = 0; j < 7; j++){
            const cellIndex = i * 7 + j;
            if (cellIndex < offset) {
                calendar.push(null);
            } else {
                const dayNumber = cellIndex - offset + 1
                if (dayNumber <= daysInMonth) {
                    calendar.push(dayNumber);
                } else {
                    calendar.push(null);
                }
            }
        }
    }
    return calendar
}


export default function CalendarScreen() {
    const { rate, setRate, hoursPerDay, setHoursPerDay, workDays, setWorkDays, cursor, setCursor} = useApp();
    const cells = buildMonthGrid(cursor.year, cursor.month);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    const shiftMonth = (delta: number) => {
        let newMonth = cursor.month + delta;
        let newYear = cursor.year;
        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }
        setCursor({year: newYear, month: newMonth});
    }

    const isToday = (day: (number|null)) => {
        return (cursor.year == currentYear && cursor.month == currentMonth && day == currentDay)
    }

    const income = () => {
        return parseFloat(rate) * parseFloat(hoursPerDay);
    }

    const isWorkDay = (index: number) => {
        return workDays.includes(index % 7)
    }

    return (
        <View style={common.container}>
            <View style={calendar.header}>
                <TouchableOpacity style={calendar.arrow} onPress={() => shiftMonth(-1)}>
                    <Text style={calendar.arrowText}>‹</Text>
                </TouchableOpacity>
                <Text style={calendar.monthTitle}>{MONTH_LABELS[cursor.month]} {cursor.year}</Text>
                <Text style={calendar.monthTitle}></Text>
                <TouchableOpacity style={calendar.arrow} onPress={() => shiftMonth(+1)}>
                    <Text style={calendar.arrowText}>›</Text>
                </TouchableOpacity>
            </View>
            <View style={calendar.weekdaysRow}>
                {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(w => (
                    <Text key={w} style={calendar.weekday}>{w}</Text>
                ))}
            </View>
            <View style={calendar.grid}>
                {cells.map((dayNumber, index) => (
                    <View key={index} style={calendar.cellWrap}>
                        {dayNumber !== null && (
                            <TouchableOpacity 
                                onPress={() => router.push('/day/'+ makeDateKey(cursor.year, cursor.month, dayNumber))} 
                                style={[calendar.cell, isToday(dayNumber) && calendar.cellToday]}
                            >
                                <View>
                                    <Text style={calendar.dayNumber}>{dayNumber}</Text>
                                    {isWorkDay(index) && (
                                        <Text style={calendar.dayIncome}>{income() || 0} ₽</Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}