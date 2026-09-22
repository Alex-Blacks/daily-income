import { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, ScrollView,  Modal, Switch } from "react-native";
import { useApp, Cursor } from "../../lib/context";
import { useStyles} from '../../lib/styles';
import { SCHEDULE_HINTS, SCHEDULE_OPTIONS, WEEKDAYS_SHORT, MONTHS, getMonthGrid, toKey, todayKey } from '../../lib/dates';
import { ThemeName, THEME_LABELS } from "../../lib/theme";
import NumberField from "../../components/NumberField";
import { defaultSettings } from "../../lib/storage";
import { MinutesToHHMM, ParseTimeToMinutes } from "../../lib/time";

export default function SettingsScreen() {
    const { settings, updateSettings, colors} = useApp();
    const [ modalVisible, setModalVisible] = useState(false);
    const [ modalRulesVisible, setModalRulesVisible] = useState(false);
    const [ isEnableRules, setIsEnableRules] = useState(false);
    const [ dayOfWeek, setDayOfWeek] = useState<number[]>([]);
    const [ cursor, setCursor] = useState<Cursor>({ 
        year: new Date().getFullYear(), 
        month: new Date().getMonth()});
    const styles = useStyles();

    const flexibleSchedule =  settings.schedule === 'Свой';
    const standardSchedule = settings.schedule === '5/2';
    const showDateField = !flexibleSchedule && !standardSchedule;

    const today = useMemo(() => todayKey(),[]);

    const toggleWorkDay = (day:number) => {
        if (settings.workDays.includes(day)) {
            updateSettings({workDays: settings.workDays.filter(d => d !== day)});
        } else {
            updateSettings({workDays: [...settings.workDays, day]});
        }
    };

    const toggleDayRules = (day: number) => {
        if (dayOfWeek.includes(day)) {
            setDayOfWeek(dayOfWeek.filter(d => d !== day));
        } else {
            setDayOfWeek([...dayOfWeek, day]);
        }
    }

    const toggleSwitch = () => {
        setModalRulesVisible(true)
    }

    const cells = useMemo(() => getMonthGrid(cursor.year, cursor.month),[cursor]);

    const shiftMonth = (delta: number) =>
        setCursor((c:Cursor) => {
            const m = c.month + delta
            if (m<0) return {year: c.year - 1, month: 11}
            if (m>11) return {year: c.year + 1, month: 0}
            return {year: c.year, month: m}
        });

    const selectedDay = (key: string) => {
        updateSettings({startDate: key})
        setModalVisible(false)
    };

    const remuveRules = (dayOfWeek: number) => {
        const rect = settings.dayRules.filter(d => d.dayOfWeek !== dayOfWeek)
        updateSettings({dayRules: [...rect,]})
    }

    const saveRules = (dayOfWeek: number, untilMinutes: number) => {
        const rect = settings.dayRules.filter(d => d.dayOfWeek !== dayOfWeek)
        updateSettings({dayRules: [...rect,{ dayOfWeek: dayOfWeek, untilMinutes: untilMinutes}]})
        setModalRulesVisible(false)
    }


    return (
        <ScrollView
            style={{ backgroundColor: colors.background }}
            contentContainerStyle={ styles.settings.container }
        >
            <Text style={[styles.settings.sectionTitle, { color: colors.textMuted}]}>Работа</Text>
            <View style={[styles.settings.card, {backgroundColor: colors.card, borderColor: colors.border}]}>
                <Text style={[styles.settings.label, { color: colors.textMuted}]}>Тариф, ₽/час</Text>
                <NumberField 
                    value={String(settings.rate)}
                    onCommit={n => updateSettings({ rate: Number(n) })}
                    placeholder="500"
                    colors={colors}
                />

                <Text style={[styles.settings.label, { color: colors.textMuted, marginTop: 16}]}>Рабочих часов в день</Text>
                <NumberField 
                    value={MinutesToHHMM(String(settings.minutesPerDay))} 
                    onCommit={t => updateSettings({minutesPerDay: ParseTimeToMinutes(String(t))})} 
                    placeholder="8"
                    colors={colors}
                />
                <Text style={[styles.settings.label, { color: colors.textMuted, marginTop: 16}]}>График</Text>
                <View style={ styles.settings.row}>
                    {SCHEDULE_OPTIONS.map( t => {
                        const active = settings.schedule === t;
                        return (
                            <TouchableOpacity
                                key={t}
                                onPress={() => {
                                    if (t === '5/2') {
                                        updateSettings({
                                            workDays: defaultSettings.workDays,
                                            schedule: t
                                        })
                                    } else {
                                        updateSettings({ schedule: t})
                                    }
                                }}
                                style={[
                                    styles.settings.chip, 
                                    styles.settings.chipWide,
                                    { borderColor: colors.border},
                                    active && { backgroundColor: colors.primary, borderColor: colors.primary}
                                ]}
                            >
                                <Text style={{color: active ? '#fff' : colors.text, fontWeight: '600'}}>{t}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <Text style={[styles.settings.hint, { color: colors.textMuted }]}>
                    {SCHEDULE_HINTS[settings.schedule]}
                </Text>
                { flexibleSchedule && (
                    <>
                        <Text style={[styles.settings.label, { color: colors.textMuted, marginTop: 16}]}>Рабочие дни</Text>
                        <View style={styles.settings.row}>
                            {WEEKDAYS_SHORT.map((label, index) => {
                                const active = settings.workDays.includes(index);
                                return (
                                    <TouchableOpacity 
                                        key={label}
                                        onPress={() => toggleWorkDay(index)}
                                        style={[
                                            styles.settings.chip,
                                            { borderColor: colors.border},
                                            active && { backgroundColor: colors.primary, borderColor: colors.primary}
                                        ]}
                                    >
                                        <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600'}}>{label}</Text>
                                    </TouchableOpacity>
                                );
                                })
                            }
                        </View>
                    </>
                )} 

                { standardSchedule && (
                    <>
                        <View style={[styles.settings.row, { justifyContent: 'center', alignItems: 'center'}]}>
                            <Text style={[styles.settings.label, { color: colors.text, marginTop: 16 }]}>
                                Есть сокращённые дни
                            </Text>
                            <Switch style={{ justifyContent: 'center', alignItems: 'center'}} value={isEnableRules} onValueChange={toggleSwitch}/>
                        </View>
                        { isEnableRules && (
                            settings.dayRules.map( rule => {
                                return(
                                    <View key={rule.dayOfWeek} style={styles.day.otRow}>
                                        <View style={{ flex: 1}}>
                                            <Text style={{ color: colors.text, flex: 1}}>
                                                {rule.dayOfWeek} до {rule.untilMinutes}
                                            </Text>
                                        </View>
                                        <TouchableOpacity onPress={() => remuveRules(rule.dayOfWeek)}>
                                            <Text style={{ color: colors.danger, fontWeight: '600'}}>Удалить</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })
                        )}
                    </>
                )}

                { showDateField && (
                    <>
                        <Text style={[styles.settings.label, { color: colors.textMuted, marginTop: 16 }]}>
                            Дата начала отсчёта
                        </Text>
                        <TouchableOpacity 
                            onPress={() => setModalVisible(true)}
                            style={[styles.settings.dateField, { borderColor: colors.border, backgroundColor: colors.background }]}
                        >
                            <Text style={{ color: settings.startDate ? colors.text : colors.textMuted, fontSize: 16 }}>
                                { settings.startDate ? settings.startDate : 'Нажмите чтобы выбрать'}
                            </Text>  
                            <Text style={{ color: colors.primary, fontSize: 18 }}>📅</Text>                          
                        </TouchableOpacity>
                        <Text style={[styles.settings.hint, { color: colors.textMuted }]}>
                            Например: следующий рабочий день после выходных
                        </Text>
                    </>
                )}
            </View>   
            <Text style={[styles.settings.sectionTitle, { color: colors.textMuted}]}>Оформление</Text>
            <View style={[styles.settings.card, { backgroundColor: colors.card, borderColor: colors.border}]}>
                <View style={styles.settings.row}>
                    {(['light', 'dark', 'auto'] as ThemeName[]).map( t => {
                        const active = settings.theme === t;
                        return (
                            <TouchableOpacity 
                                key={t}
                                onPress={() => updateSettings({theme: t})}
                                style={[
                                    styles.settings.chip,
                                    styles.settings.chipWide,
                                    { borderColor: colors.border},
                                    active && { backgroundColor: colors.primary, borderColor: colors.primary}
                                ]}
                            >
                                <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600'}}>
                                    {THEME_LABELS[t]}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <Text style={[styles.settings.footer, { color: colors.textMuted}]}>
                Данные хранятся только на этом устройстве.
            </Text>

            <Modal
                animationType='fade'
                transparent
                visible={modalRulesVisible}
                onRequestClose={() => setModalRulesVisible(false)}
            >
                <View style={styles.settings.overlay}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={() => setModalRulesVisible(false)}
                    />
                    <View style={[styles.settings.modalCard, { backgroundColor: colors.card }]}>
                        <View style={styles.settings.row}>
                            {WEEKDAYS_SHORT.map((label, index) => {
                                const active = dayOfWeek.includes(index);
                                return (
                                    <TouchableOpacity 
                                        key={label}
                                        onPress={() => toggleDayRules(index)}
                                        style={[
                                            styles.settings.chip,
                                            { borderColor: colors.border},
                                            active && { backgroundColor: colors.primary, borderColor: colors.primary}
                                        ]}
                                    >
                                        <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600'}}>{label}</Text>
                                    </TouchableOpacity>
                                );
                                })
                            }
                        </View>
                        <View style={styles.settings.row}>
                            <TouchableOpacity
                                onPress={() => saveRules()}
                                style={[styles.settings.closeBtn, { borderColor: colors.border }]}
                            >
                                <Text style={{ color: colors.primary, fontWeight: '600' }}>Сохранить</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setModalRulesVisible(false)}
                                style={[styles.settings.closeBtn, { borderColor: colors.border }]}
                            >
                                <Text style={{ color: colors.primary, fontWeight: '600' }}>Закрыть</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType='fade'
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.settings.overlay}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={() => setModalVisible(false)}
                    />
                    <View style={[styles.settings.modalCard, { backgroundColor: colors.card }]}>
                        <View style={styles.calendar.header}>
                            <TouchableOpacity onPress={() => shiftMonth(-1)} style={styles.calendar.navBtn}>
                                <Text style={[styles.calendar.navBtnText, { color: colors.primary }]}>‹</Text>
                            </TouchableOpacity>
                            <Text style={[styles.calendar.monthLabel, { color: colors.text }]}>
                                {MONTHS[cursor.month]} {cursor.year}
                            </Text>
                            <TouchableOpacity onPress={() => shiftMonth(1)} style={styles.calendar.navBtn}>
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
                                if (!date) return <View key={i} style={styles.calendar.cellWrap} />;

                                const key = toKey(date);
                                const isToday = key === today;
                                const isSelected = key === settings.startDate;

                                return (
                                <View key={i} style={styles.calendar.cellWrap}>
                                    <TouchableOpacity
                                        style={[
                                            styles.calendar.cell,
                                            { backgroundColor: colors.background },
                                            isToday && { borderColor: colors.primary, borderWidth: 2 },
                                            isSelected && { borderColor: colors.accent, borderWidth: 2 },
                                        ]}
                                        onPress={() => selectedDay(key)}
                                    >
                                    <Text style={[styles.calendar.dayNum, { color: colors.text }]}>
                                        {date.getDate()}
                                    </Text>
                                    </TouchableOpacity>
                                </View>
                                );
                            })}
                        </View>

                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={[styles.settings.closeBtn, { borderColor: colors.border }]}
                        >
                            <Text style={{ color: colors.primary, fontWeight: '600' }}>Закрыть</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}