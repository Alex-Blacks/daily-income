import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { fromKey, MONTH_FOR_DAYS } from "../../lib/dates";
import { useApp } from "../../lib/context";
import { useStyles } from '../../lib/styles';

const money = (n: number) => `${n.toFixed(2)} ₽`;

export default function DayScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const { settings, overtime, removeOvertime, colors } = useApp();
    const styles = useStyles();

    const d = fromKey(date);
    const jsDay = (d.getDay() + 6) % 7;
    const isWorkDay = settings.workDays.includes(jsDay);
    const baseHours = isWorkDay ? settings.hoursPerDay : 0;
    const baseIncome = baseHours * settings.rate;

    const otEntries = overtime.filter(e => e.date === date);
    const otHours = otEntries.reduce((s, e) => s + e.hours, 0);
    const otIncome = otEntries.reduce((s, e) => s + e.hours * e.rate, 0) || 0;
    const total = baseIncome + otIncome;

    return (
        <ScrollView
            style={{ backgroundColor: colors.background}}
            contentContainerStyle={styles.day.container}
        >
        <Stack.Screen 
            options={{ title: `${d.getDate()} ${MONTH_FOR_DAYS[d.getMonth()]}`}}
        />

        <View style={[styles.day.card, { backgroundColor: colors.card, borderColor: colors.border}]}>
            <Text style={[styles.day.label, { color: colors.textMuted}]}>
                {isWorkDay ? 'Рабочий день' : 'Выходной' }
            </Text>
            <Text style={[styles.day.formula, { color: colors.text}]}>
                {baseHours} ч × {settings.rate || 0} ₽ = {money(baseIncome)}
            </Text>
        </View>
            <View style={[ styles.day.card, { backgroundColor: colors.card, borderColor: colors.border}]}>
                <Text style={[styles.day.label, { color: colors.textMuted}]}>Переработка</Text>
                {otEntries.length === 0 ? (
                    <Text style={{ color: colors.textMuted}}>Нет записей</Text>
                ) : (
                    otEntries.map( e => (
                        <View key={e.id} style={styles.day.otRow}>
                            <View style={{ flex: 1}}>
                                <Text style={{ color: colors.text, flex: 1}}>
                                    {e.hours} ч × {e.rate} ₽ = {money(e.hours * e.rate)}
                                </Text>
                                {e.rate !== settings.rate && (
                                    <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2}}>
                                        ставка отличается от базовой ({settings.rate} ₽)
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity onPress={() => removeOvertime(e.id)}>
                                <Text style={{ color: colors.danger, fontWeight: '600'}}>Удалить</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}

                {otEntries.length > 0 && (
                    <View style={[ styles.day.subtotal, { borderTopColor: colors.border}]}>
                        <Text style={{ color: colors.textMuted}}>
                            {otHours} ч → {money(otIncome)}
                        </Text>
                    </View>
                )}
                
                <TouchableOpacity 
                    onPress={() => router.push({ pathname: '/overtime/new', params: { date} })} 
                    style={[styles.day.addBtn, { borderColor: colors.primary}]} 
                >    
                    <Text style={{ color: colors.primary, fontWeight: '600'}}>+ Добавить переработку</Text>
                </TouchableOpacity>
            </View>
            <View style={[ styles.day.totalCard, { backgroundColor: colors.primary}]}>
                <Text style={ styles.day.totalLabel}>Итого за день</Text>
                <Text style={ styles.day.totalValue}>{money(total)}</Text>
            </View>
        </ScrollView>
    )
}