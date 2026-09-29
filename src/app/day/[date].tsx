import { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, Modal, StyleSheet } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { fromKey, MONTH_FOR_DAYS} from "../../lib/dates";
import { useApp } from "../../lib/context";
import { useStyles } from '../../lib/styles';
import { MinutesToHHMM, MinutesToParts, ParseTimeToMinutes } from "../../lib/time";
import { TimeField } from "../../components/InputFields";

type WorkTimeDay = 0.5 | 1;
const WorkTimeOptions: WorkTimeDay[] = [0.5, 1]
const WorkTimeLabel: Record<WorkTimeDay, string> = {
    '0.5' : 'Половина дня',
    '1' : 'Целый день'
}

const money = (n: number) => `${n.toFixed(2)} ₽`;

export default function DayScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const { settings, overtime, removeOvertime, exception, addException, removeException, colors, getDayMinutes } = useApp();
    const [ exceptionVisible, setExceptionVisible] = useState(false);
    const [ shortByMinutes, setShortByMinutes] = useState(0);
    const styles = useStyles();

    const d = fromKey(date);
    const baseMinutes = getDayMinutes(date);
    const isWorkDays = baseMinutes !== 0;
    const baseIncome = ((baseMinutes / 60) * settings.rate) || 0;

    const otEntries = overtime.filter(e => e.date === date);
    const otMinutes = otEntries.reduce((s, e) => s + e.minutes, 0);
    const otIncome = otEntries.reduce((s, e) => s + (e.minutes / 60) * e.rate, 0) || 0;
    const total = baseIncome + otIncome;


    const activeException = () => exception.some(f => f.date === date);
    const dayExceptions = exception.filter( f => f.date === date);
    const minutesException = (): number => {
        return dayExceptions.reduce((total, data) => {
            return (total + data.minutes) || 0;
        },0)
    }

    const openExceptionModal = () => {
        setShortByMinutes(minutesException());
        setExceptionVisible(true);
    }

    const saveException = () => {
        addException({ date: date, minutes: shortByMinutes});
        setExceptionVisible(false);
    }

    const deleteException = (id: string) => {
        removeException(id);
        setExceptionVisible(false);
    }



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
                {isWorkDays? 'Рабочий день' : 'Выходной' }
            </Text>
            <Text style={[styles.day.formula, { color: colors.text}]}>
                {MinutesToHHMM(baseMinutes)} × {settings.rate || 0} ₽ = {money(baseIncome)}
            </Text>
            <TouchableOpacity
                onPress={openExceptionModal} 
                style={[styles.day.addBtn, { borderColor: colors.primary}]} 
            >    
                <Text style={{ color: colors.primary, fontWeight: '600'}}>
                    { activeException() ? `Изменить (${MinutesToHHMM(minutesException())})` : 'Уменьшить рабочий день'}
                </Text>
            </TouchableOpacity>
        </View>
        
        <View style={[ styles.day.card, { backgroundColor: colors.card, borderColor: colors.border}]}>
            <Text style={[styles.day.label, { color: colors.textMuted}]}>Переработка</Text>
            {otEntries.length === 0 ? (
                <Text style={{ color: colors.textMuted}}>Нет записей</Text>
            ) : (
                otEntries.map( e => {
                    const hours = MinutesToParts(e.minutes)[0];
                    const minutes = MinutesToParts(e.minutes)[1]
                    return(
                    <View key={e.id} style={styles.day.otRow}>
                        <View style={{ flex: 1}}>
                            <Text style={{ color: colors.text, flex: 1}}>
                                {hours} ч {minutes} м × {e.rate} ₽ = {money((e.minutes / 60) * e.rate)}
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
                    );
                })
            )}

            {otEntries.length > 0 && (
                <View style={[ styles.day.subtotal, { borderTopColor: colors.border}]}>
                    <Text style={{ color: colors.textMuted}}>
                        {Math.floor(otMinutes / 60)} ч {otMinutes % 60} м → {money(otIncome)}
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


        {/* ─── Модалка: разового исключения на день ─────────────────────── */}
        <Modal
            animationType='fade'
            transparent
            visible={exceptionVisible}
            onRequestClose={() => setExceptionVisible(false)}
        >
            <View style={styles.settings.overlay}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={() => setExceptionVisible(false)}
                />
                <View style={[styles.settings.modalCard, { backgroundColor: colors.card}]}>
                    <Text style={[styles.settings.modalTitle, { color: colors.text}]}>Изменить рабочее время</Text>

                    <Text style={[ styles.settings.label, { color: colors.textMuted, marginTop: 12}]}>Рабочий день</Text>
                    <Text style={[ styles.settings.label, { color: colors.text}]}>{date}</Text>

                    <Text style={[ styles.settings.label, { color: colors.textMuted, marginTop: 12}]}>Сколько часов вычитать?</Text>
                    <TimeField
                        value={MinutesToHHMM(shortByMinutes)}
                        onCommit={ t => setShortByMinutes(ParseTimeToMinutes(t))}
                        placeholder="00:15"
                        colors={colors}
                    />
                    <View style={[styles.settings.row, { marginTop: 12}]}>
                        {WorkTimeOptions.map( t => {
                            const active = shortByMinutes === (settings.minutesPerDay * t)
                            return(
                                <TouchableOpacity
                                    key={t}
                                    onPress={() => setShortByMinutes(settings.minutesPerDay * t)}
                                    style={[
                                        styles.settings.chip,
                                        styles.settings.chipWide,
                                        { borderColor: colors.border},
                                        active && { backgroundColor: colors.primary, borderColor: colors.primary},
                                    ]}
                                >
                                    <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600'}}>{WorkTimeLabel[t]}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    <View style={[styles.settings.row, { marginTop: 20}]}>
                        <TouchableOpacity
                            onPress={saveException}
                            disabled={shortByMinutes <= 0}
                            style={[
                                styles.settings.closeBtn,
                                { borderColor: colors.border, flex: 1},
                                shortByMinutes <= 0 && {opacity: 0.5},
                            ]}
                        >
                            <Text style={{ color: colors.primary, fontWeight: '600'}}>Сохранить</Text>
                        </TouchableOpacity>
                        {activeException() && (
                            dayExceptions.map(exc => {
                                return (
                                    <TouchableOpacity
                                    key={exc.id}
                                    onPress={() => deleteException(exc.id)}
                                    style={[styles.settings.closeBtn, { borderColor: colors.border, flex: 1}]}
                                >
                                    <Text style={{ color: colors.danger, fontWeight: '600'}}>Удалить</Text>
                                </TouchableOpacity>
                                )
                            })
                        )}
                        <TouchableOpacity
                            onPress={() => setExceptionVisible(false)}
                            style={[styles.settings.closeBtn, { borderColor: colors.border, flex: 1}]}
                        >
                            <Text style={{ color: colors.primary, fontWeight: '600'}}>Закрыть</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </Modal>
        </ScrollView>
    )
}