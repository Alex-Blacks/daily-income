import { useApp } from '../lib/context';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

const MONTH_LABELS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

function buildMonthGrid(year:number, month:number) {
    let kalendar:any[] = [];
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < 6; i++){
        for (let j = 0; j < 7; j++){
            const cellIndex = i * 7 + j;
            if (cellIndex < offset) {
                kalendar.push(null);
            } else {
                const dayNumber = cellIndex - offset + 1
                if (dayNumber <= daysInMonth) {
                    kalendar.push(dayNumber);
                } else {
                    kalendar.push(null);
                }
            }
        }
    }
    return kalendar
}


export default function App() {
    const { rate, setRate, hoursPerDay, setHoursPerDay, workDays, setWorkDays, cursor, setCursor} = useApp();
    const cells = buildMonthGrid(cursor.year, cursor.month);

    const shiftMonth =(delta: number) => {
        setCursor(cursor.month + delta)
        if (cursor.month == 12 ) {
            setCursor(cursor.month = 0)
            setCursor(cursor.year + 1)
        } else if (cursor.month == -1 ) {
            setCursor(cursor.month = 11)
            setCursor(cursor.year - 1)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.arrow} onPress={() => shiftMonth(-1)}>
                    <Text style={styles.arrowText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.monthTitle}>{MONTH_LABELS[cursor.month]} {cursor.year}</Text>
                <TouchableOpacity style={styles.arrow} onPress={() => shiftMonth(+1)}>
                    <Text style={styles.arrowText}>›</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.weekdaysRow}>
                {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(w => (
                    <Text key={w} style={styles.weekday}>{w}</Text>
                ))}
            </View>
            <View style={styles.grid}>
                {cells.map((dayNumber, index) => (
                    <View key={index} style={styles.cellWrap}>
                        <View style={styles.cell}>
                            {dayNumber !== null && (
                                <Text style={styles.dayNumber}>{dayNumber}</Text>
                            )}
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.fotter}>
            <Link href="/index" asChild>
                <TouchableOpacity style={styles.buttonSettings}>
                    <Text style={styles.buttonSettingsText}>Календарь</Text>
                </TouchableOpacity>
            </Link>
            <Link href="/settings" asChild>
                <TouchableOpacity style={styles.buttonSettings}>
                    <Text style={styles.buttonSettingsText}>Настройки</Text>
                </TouchableOpacity>
            </Link>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f4f7', paddingTop: 20},
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12},
    fotter: { flexDirection: 'row',  marginTop: 'auto', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12},
    monthTitle: { fontSize: 20, fontWeight: '600', color: '#111'},
    arrow: { padding: 8},
    arrowText: { fontSize: 28, color: '#007aff', fontWeight: '300'},
    weekdaysRow: { flexDirection: 'row', paddingHorizontal: 8},
    weekday: { width: `${100 / 7}%`, textAlign: 'center', fontSize: 12, color: '#6b7280', fontWeight: '600', paddingVertical: 6},
    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8},
    cellWrap: { width: `${100 / 7}%`, padding: 2},
    cell: { minHeight: 56, backgroundColor: '#fff', borderRadius: 8, padding: 6, borderWidth: 2, borderColor: 'transparent'},
    cellToday: { borderColor: '#007aff'},
    dayNumber: {fontSize: 14, fontWeight: '600', color: '#111'},
    dayIncome: { fontSize: 11, color: '#34c759', marginTop: 2},
    buttonSettings: { backgroundColor: 'gray', padding: 10, borderRadius: 8, alignItems: 'center' },
    buttonSettingsText: { fontSize: 20, fontWeight: '600', color: 'white'},
})