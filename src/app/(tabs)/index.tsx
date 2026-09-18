import { useMemo } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { router} from 'expo-router';
import { Cursor, useApp } from '../../lib/context';
import { MONTHS, WEEKDAYS_SHORT, getMonthGrid, toKey, todayKey,  } from '../../lib/dates';
import { useStyles} from '../../lib/styles';

const formatShort = (n: number) => (n >= 1000 ? `${Math.round(n/100)/10}k` : `${Math.round(n)}`);

export default function CalendarScreen() {
    const { settings, overtime, cursor, setCursor, colors } = useApp();
    const styles = useStyles();
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

    const monthTotal = (monthlyAmount + monthlyAmountOvertime) || 0;

    return (
        <>
        <View style={[styles.calendar.container, { backgroundColor: colors.background}]}>
            <View style={styles.calendar.header}>
                <TouchableOpacity onPress={() => shiftMonth(-1)} style={styles.calendar.navBtn} >
                    <Text style={[styles.calendar.navBtnText, { color: colors.primary }]}>‹</Text>
                </TouchableOpacity>
                <View style={{ alignItems: 'center'}}>
                    <Text style={[styles.calendar.monthLabel, { color: colors.text}]}>
                        {MONTHS[cursor.month]} {cursor.year}
                    </Text>
                    <Text style={[styles.calendar.monthTotal, { color: colors.accent}]}>
                        {monthTotal.toLocaleString('ru-RU', { maximumFractionDigits: 0})} ₽
                    </Text>
                </View>
                <TouchableOpacity onPress={() => shiftMonth(+1)} style={styles.calendar.navBtn} >
                    <Text style={[styles.calendar.navBtnText, { color: colors.primary }]}>›</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.calendar.weekdaysRow}>
                {WEEKDAYS_SHORT.map(w => (
                    <Text key={w} style={[styles.calendar.weekday, { color: colors.textMuted }]}>{w}</Text>
                ))}
            </View>

            <View style={styles.calendar.grid}>
                {cells.map((date, i) => {
                    if (!date) return <View key={i} style={styles.calendar.cellWrap}/>;

                    const key = toKey(date);
                    const jsDay = (date.getDay() + 6) % 7;
                    const isWorkDay = (settings.workDays.includes(jsDay))
                    const base = isWorkDay ? income() : 0;
                    const ot = overtimeByDate.get(key) ?? { hours: 0, income: 0};
                    const total = base + ot.income;
                    const isToday = key === today;

                    return (
                        <View key={i} style={styles.calendar.cellWrap}>
                            <TouchableOpacity
                                style={[
                                    styles.calendar.cell,
                                    { backgroundColor: colors.card },
                                    isToday && { borderColor: colors.primary, borderWidth: 2},
                                ]}
                                onPress={() => router.push(`/day/${key}` as any)}
                            >
                                <Text style={[styles.calendar.dayNum, { color: colors.text }]}>{date.getDate()}</Text>
                                {total > 0 && (
                                    <Text style={[styles.calendar.income, { color: colors.accent}]} numberOfLines={1}>
                                        {formatShort(total)}
                                    </Text>
                                )}
                                {ot.hours > 0 && (
                                    <Text style={[styles.calendar.ot, { color: colors.primary}]}>+{ot.hours}ч</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    );
                })}
                </View>
            </View>
        </>
    );
}