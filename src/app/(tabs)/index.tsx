import { useMemo } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { router} from 'expo-router';
import { Cursor, useApp } from '../../lib/context';
import { MONTHS, WEEKDAYS_SHORT, getMonthGrid, toKey, todayKey,  } from '../../lib/dates';
import { common, calendar } from '../../lib/styles';

const formatShort = (n: number) => (n >= 1000 ? `${Math.round(n/100)/10}k` : `${Math.round(n)}`);

export default function CalendarScreen() {
    const { settings, overtime, cursor, setCursor } = useApp();
    const today = todayKey();

    const overtimeByDate = useMemo(() => {
        const m = new Map<string, { hours: number, income: number}>();
        for (const e of overtime) {
            const current = m.get(e.date) ?? { hours: 0, income: 0}
            m.set(e.date, {
                hours: current.hours + e.hours,
                income: current.income + (e.hours * e.rate),
            });
        }
        return m;
    },[overtime]);

    const cells = useMemo(() => getMonthGrid(cursor.year, cursor.month),[cursor]);
    const shiftMonth = (delta: number) =>
        setCursor((c:Cursor) => {
            const m = c.month + delta
            if (m<0) return {year: c.year - 1, month: 11}
            if (m>11) return {year: c.year + 1, month: 0}
            return {year: c.year, month: m}
        });
    
    const income = () => {
        return (settings.rate * settings.hoursPerDay) || 0;
    }

    const isWorkDay = (day: number) => {
        return settings.workDays.includes((new Date(cursor.year, cursor.month, day).getDay() + 6) % 7)
    }

    const monthlyAmountOvertime = useMemo(() => {
        const requiredMonth = String(cursor.year) + "-" + String(cursor.month+1).padStart(2,"0")
        const filteredOvertime = overtime.filter((data) => data.date.startsWith(requiredMonth))
        return filteredOvertime.reduce((total,data) => {
            return total + (data.hours * data.rate)
        },0)
    },[cursor, overtime])

    const monthlyAmount = useMemo(() => {
        const countDay = new Date(cursor.year, cursor.month + 1, 0).getDate();
        let sumMonth = 0;
        for (let i = 1; i <= countDay; i++) {
            isWorkDay(i) ? sumMonth += income() : sumMonth += 0;
        }
        return sumMonth;
    },[cursor, settings.workDays, settings.rate, settings.hoursPerDay])

    return (
        <View style={common.container}>
            <View style={{flexDirection: 'column', paddingHorizontal: 'auto'}}>
                <View style={calendar.header}>
                    <TouchableOpacity style={calendar.arrow} onPress={() => shiftMonth(-1)}>
                        <Text style={calendar.arrowText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={calendar.monthTitle}>{MONTHS[cursor.month]} {cursor.year}</Text>
                    <TouchableOpacity style={calendar.arrow} onPress={() => shiftMonth(+1)}>
                        <Text style={calendar.arrowText}>›</Text>
                    </TouchableOpacity>
                </View>
                <View style={{alignItems:'center'}}>
                    <Text style={[calendar.dayIncome]}>{(monthlyAmount + monthlyAmountOvertime).toLocaleString('ru-RU', { maximumFractionDigits: 0}) || 0} ₽</Text>
                </View>
            </View>
            <View style={calendar.weekdaysRow}>
                {WEEKDAYS_SHORT.map(w => (
                    <Text key={w} style={calendar.weekday}>{w}</Text>
                ))}
            </View>
            <View style={calendar.grid}>
                {cells.map((date, i) => {
                    if (!date) return <View key={i} style={calendar.cellWrap}/>;
                    const key = toKey(date);
                    const jsDay = (date.getDay() + 6) % 7;
                    const isWorkDay = (settings.workDays.includes(jsDay))
                    const base = isWorkDay ? income() : 0;
                    const ot = overtimeByDate.get(key) ?? { hours: 0, income: 0};
                    const total = base + ot.income;
                    const isToday = key === today;

                    return (
                        <View key={i} style={calendar.cellWrap}>
                            <View style={[isToday && { borderColor: '#007aff', borderRadius: 9, borderWidth: 2}]}>
                                <TouchableOpacity
                                    style={calendar.cell}
                                    onPress={() => router.push(`/day/${key}`)}
                                >
                                    <Text style={calendar.dayNumber}>{date.getDate()}</Text>
                                    {total > 0 && (
                                        <Text style={calendar.dayIncome} numberOfLines={1}>
                                            {formatShort(total)}
                                        </Text>
                                    )}
                                    {ot.hours > 0 && (
                                        <Text style={[calendar.arrowText, { fontSize: 12}]}>+{ot.hours}ч</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}