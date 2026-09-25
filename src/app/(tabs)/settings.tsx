import { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, ScrollView,  Modal, Switch } from "react-native";
import { useApp, Cursor } from "../../lib/context";
import { useStyles} from '../../lib/styles';
import { SCHEDULE_HINTS, SCHEDULE_OPTIONS, WEEKDAYS_SHORT, MONTHS, getMonthGrid, toKey, todayKey } from '../../lib/dates';
import { ThemeName, THEME_LABELS } from "../../lib/theme";
import NumberField, { TimeField } from "../../components/TypeField";
import { defaultSettings } from "../../lib/storage";
import { MinutesToHHMM, MinutesToParts, ParseTimeToMinutes } from "../../lib/time";

export default function SettingsScreen() {
    const { settings, updateSettings, colors} = useApp();
    const [ calendarVisible, setCalendarVisible] = useState(false);
    const [ rulesVisible, setRulesVisible] = useState(false);
    const [ pickedDays, setPickedDays] = useState<number[]>([]);
    const [ shortByMinutes, setShortByMinutes ] = useState(0);
    const [ cursor, setCursor] = useState<Cursor>({ 
        year: new Date().getFullYear(), 
        month: new Date().getMonth()});
    const styles = useStyles();

    const flexibleSchedule =  settings.schedule === 'Свой';
    const standardSchedule = settings.schedule === '5/2';
    const showDateField = !flexibleSchedule && !standardSchedule;
    const showRuleToggle = flexibleSchedule || standardSchedule;

    const today = useMemo(() => todayKey(),[]);

    const toggleWorkDay = (day:number) => {
        const next = settings.workDays.includes(day)
            ? settings.workDays.filter(d => d !== day)
            : [...settings.workDays, day].sort((a,b) => a - b);
        updateSettings({ workDays: next});
    };

    const togglePickedDay = (day: number) => {
        setPickedDays( prev => 
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const cells = useMemo(() => getMonthGrid(cursor.year, cursor.month),[cursor]);

    const shiftMonth = (delta: number) =>
        setCursor((c:Cursor) => {
            const m = c.month + delta;
            if (m<0) return {year: c.year - 1, month: 11};
            if (m>11) return {year: c.year + 1, month: 0};
            return {year: c.year, month: m};
        });

    const selectedDay = (key: string) => {
        updateSettings({startDate: key});
        setCalendarVisible(false);
    };

    const removeRules = (dayOfWeek: number) => {
        updateSettings({
            dayRules: settings.dayRules.filter(d => d.dayOfWeek !== dayOfWeek)
        });
    };

    const openRulesModal = () => {
        setPickedDays([]);
        setShortByMinutes (0);
        setRulesVisible(true);
    };

    const saveRules = () => {
        if (pickedDays.length === 0 && shortByMinutes  <= 0) return;
        const filtered = settings.dayRules.filter(d => !pickedDays.includes(d.dayOfWeek))
        const added = pickedDays.map(d => ({ dayOfWeek: d, shortByMinutes  }));
        updateSettings({
            isEnableRules: true, 
            dayRules: [...filtered, ...added].sort((a,b) => a.dayOfWeek - b.dayOfWeek),
        });
        setRulesVisible(false)
    }

    const renderRules = () => (
        <View style={{ marginTop: 12}}>
            {settings.dayRules.length === 0 ? (
                <Text style={{ color: colors.textMuted, fontStyle: 'italic'}}>Правил пока нет</Text>
            ) : (                                
                settings.dayRules.map(rule => (
                    <View key={rule.dayOfWeek} style={styles.day.otRow}>
                        <Text style={{ color: colors.text, flex: 1}}>
                            {WEEKDAYS_SHORT[rule.dayOfWeek]} — до {MinutesToHHMM(rule.shortByMinutes )}
                        </Text>
                        <TouchableOpacity onPress={() => removeRules(rule.dayOfWeek)}>
                            <Text style={{ color: colors.danger, fontWeight: '600'}}>Удалить</Text>
                        </TouchableOpacity>
                    </View>
                ))
            )}
            <TouchableOpacity 
                onPress={openRulesModal}
                style={[ styles.settings.addRuleBtn, { backgroundColor: colors.primary}]} 
            >
                <Text style={{ color: '#fff', fontWeight: '600'}}>+ Добавить правило</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <ScrollView
            style={{ backgroundColor: colors.background }}
            contentContainerStyle={ styles.settings.container }
            keyboardShouldPersistTaps='handled'
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
                <TimeField 
                    value={MinutesToHHMM(settings.minutesPerDay)} 
                    onCommit={t => updateSettings({minutesPerDay: ParseTimeToMinutes(String(t))})} 
                    placeholder="8:00"
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
                {showRuleToggle && (
                    <View style={styles.settings.switchRow}>
                        <Text style={[styles.settings.label, { color: colors.text, flex: 1, marginBottom: 0 }]}>
                            Есть сокращённые дни
                        </Text>
                        <Switch 
                            value={settings.isEnableRules} 
                            onValueChange={() => updateSettings({isEnableRules: !settings.isEnableRules})}
                        />
                    </View>
                )}

                {flexibleSchedule && (
                    <>
                        <Text style={[styles.settings.label, { color: colors.textMuted, marginTop: 16}]}>
                            Рабочие дни
                        </Text>
                        <View style={styles.settings.row}>
                            {WEEKDAYS_SHORT.map((label, index) => {
                                const active = settings.workDays.includes(index);
                                return (
                                    <TouchableOpacity 
                                        key={label}
                                        onPress={() => toggleWorkDay(index)}
                                        style={[
                                            styles.settings.chip,
                                            { borderColor: colors.border, minWidth: 44},
                                            active && { backgroundColor: colors.primary, borderColor: colors.primary}
                                        ]}
                                    >
                                        <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600'}}>{label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {settings.isEnableRules && renderRules()}
                    </>
                )} 

                {standardSchedule && settings.isEnableRules && renderRules()}

                {showDateField && (
                    <>
                        <Text style={[styles.settings.label, { color: colors.textMuted, marginTop: 16 }]}>
                            Дата начала отсчёта
                        </Text>
                        <TouchableOpacity 
                            onPress={() => setCalendarVisible(true)}
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


            {/* ─── Модалка: правило сокращённого дня ─────────────────────── */}
            <Modal
                animationType='fade'
                transparent
                visible={rulesVisible}
                onRequestClose={() => setRulesVisible(false)}
            >
                <View style={styles.settings.overlay}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={() => setRulesVisible(false)}
                    />
                    <View style={[styles.settings.modalCard, { backgroundColor: colors.card }]}>
                        <Text style={[styles.settings.modalTitle, { color: colors.text}]}>Сокращённый день</Text>
                        
                        <Text style={[styles.settings.label, { color: colors.textMuted, marginTop: 12}]}>
                            Дни недели
                        </Text>
                        <View style={styles.settings.row}>
                            {WEEKDAYS_SHORT.map((label, index) => {
                                const active = pickedDays.includes(index);
                                const workDay = settings.workDays.includes(index);
                                return (
                                    <TouchableOpacity 
                                        key={label}
                                        onPress={() => togglePickedDay(index)}
                                        disabled={!workDay}
                                        style={[
                                            styles.settings.chip,
                                            { borderColor: colors.border, minWidth: 44},
                                            active && { backgroundColor: colors.primary, borderColor: colors.primary},
                                            !workDay && { backgroundColor: colors.border, opacity: 0.5}
                                        ]}
                                    >
                                        <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600'}}>{label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Text style={[styles.settings.label, { color: colors.textMuted, marginTop: 16}]}>
                            На сколько часов:минут раньше?
                        </Text>
                        <TimeField
                            value={MinutesToHHMM(shortByMinutes )}
                            onCommit={ t => setShortByMinutes (ParseTimeToMinutes(t))}
                            placeholder="00:15"
                            colors={colors}
                        />

                        <View style={[styles.settings.row, { marginTop: 20}]}>
                            <TouchableOpacity
                                onPress={saveRules}
                                disabled={pickedDays.length === 0 || shortByMinutes  <= 0}
                                style={[
                                    styles.settings.closeBtn, 
                                    { borderColor: colors.border, flex: 1 },
                                    (pickedDays.length === 0 || shortByMinutes  <= 0) && { opacity: 0.5 },
                                ]}
                            >
                                <Text style={{ color: colors.primary, fontWeight: '600' }}>Сохранить</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setRulesVisible(false)}
                                style={[styles.settings.closeBtn, { borderColor: colors.border, flex: 1 }]}
                            >
                                <Text style={{ color: colors.primary, fontWeight: '600' }}>Закрыть</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            {/* ─── Модалка: выбор даты старта ─────────────────────────────── */}
            <Modal
                animationType='fade'
                transparent
                visible={calendarVisible}
                onRequestClose={() => setCalendarVisible(false)}
            >
                <View style={styles.settings.overlay}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={() => setCalendarVisible(false)}
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
                            onPress={() => setCalendarVisible(false)}
                            style={[styles.settings.closeBtn, { borderColor: colors.border, marginTop: 12 }]}
                        >
                            <Text style={{ color: colors.primary, fontWeight: '600' }}>Закрыть</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}