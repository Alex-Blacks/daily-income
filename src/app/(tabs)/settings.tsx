import { TouchableOpacity, View, Text, TextInput, ScrollView } from "react-native";
import { useApp } from "../../lib/context";
import { useStyles} from '../../lib/styles';
import { WEEKDAYS_SHORT } from '../../lib/dates';
import { ThemeName, THEME_LABELS } from "../../lib/theme";
import NumberField from "../../components/NumberField";

export default function SettingsScreen() {
    const { settings, updateSettings, colors } = useApp();
    const styles = useStyles();
    
    const toggleDay = (day:number) => {
        if (settings.workDays.includes(day)) {
            updateSettings({workDays: settings.workDays.filter(d => d !== day)});
        } else {
            updateSettings({workDays: [...settings.workDays, day]});
        }
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
                    onCommit={n => updateSettings({ rate: n })}
                    placeholder="500"
                    colors={colors}
                />

                <Text style={[styles.settings.label, { color: colors.textMuted, marginTop: 16}]}>Рабочих часов в день</Text>
                <NumberField 
                    value={String(settings.hoursPerDay)} 
                    onCommit={t => updateSettings({hoursPerDay: t})} 
                    placeholder="8"
                    colors={colors}
                />
                <Text style={[styles.settings.label, { color: colors.textMuted, marginTop: 16}]}>Рабочие дни</Text>
                <View style={styles.settings.row}>
                    {WEEKDAYS_SHORT.map((label, index) => {
                        const active = settings.workDays.includes(index);
                        return (
                        <TouchableOpacity 
                            key={label}
                            onPress={() => toggleDay(index)}
                            style={[
                                styles.settings.chip,
                                { borderColor: colors.border},
                                active && { backgroundColor: colors.primary, borderColor: colors.primary}]}
                        >
                            <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600'}}>{label}</Text>
                        </TouchableOpacity>
                        );
                    })}
                </View>
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
        </ScrollView>
    );
}
