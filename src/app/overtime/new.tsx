import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useApp } from "../../lib/context";
import { useStyles } from '../../lib/styles';
import { MinutesToHHMM, ParseTimeToMinutes } from "../../lib/time";
import NumberField from "../../components/NumberField";

export default function OvertimeNewScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const { settings, addOvertime, colors } = useApp();
    const styles = useStyles();


    const [ minutesOt, setMinutesOt ] = useState(''); 
    const [ rateOt, setRateOt ] = useState(settings.rate);

    const parseInMinutes = parseFloat(minutesOt) || 0

    const canSave = parseInMinutes > 0 && rateOt > 0;
    
    const total = (parseInMinutes / 60) * rateOt;


    const save = () => {
        if (!canSave) return;
        addOvertime({ date: date, minutes: parseInMinutes, rate: rateOt});
        router.back();
    }

    return (
        <ScrollView
            style={{ backgroundColor: colors.background}}
            contentContainerStyle={ styles.overtime.container}
            keyboardShouldPersistTaps='handled'
        >
            <Text style={[styles.overtime.label, { color: colors.textMuted }]}>Дата: {date}</Text>           
            <Text style={[styles.overtime.label, { color: colors.textMuted, marginTop: 16}]}>
                Часов переработки
            </Text>
            <NumberField
                value={MinutesToHHMM(minutesOt)}
                onCommit={(n) => setMinutesOt(String(ParseTimeToMinutes(n)))}
                placeholder="2"
                colors={colors}
                autoFocus
            /> 

            <Text style={[styles.overtime.label, { color: colors.textMuted, marginTop: 16}]}>
                Ставка, ₽/час
            </Text>
            <NumberField 
                value={String(rateOt)}
                onCommit={() => String(setRateOt)}
                placeholder="500"
                colors={colors}
            />

            <View style={ styles.overtime.chipsRow}>
                <TouchableOpacity
                    onPress={() => setRateOt(settings.rate)}
                    style={[ styles.overtime.chip, { borderColor: colors.border, backgroundColor: colors.card}]}
                >
                    <Text style={{ color: colors.text, fontWeight: '600'}}>Базовая</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setRateOt(settings.rate * 1.5)}
                    style={[ styles.overtime.chip, { borderColor: colors.border, backgroundColor: colors.card}]}
                >
                    <Text style={{ color: colors.text, fontWeight: '600'}}>×1.5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setRateOt(settings.rate * 2)}
                    style={[ styles.overtime.chip, { borderColor: colors.border, backgroundColor: colors.card}]}
                >
                    <Text style={{ color: colors.text, fontWeight: '600'}}>×2</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.overtime.preview, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>Итого за эту запись</Text>
                <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 4 }}>
                {total.toFixed(2)} ₽
                </Text>
            </View>
            <TouchableOpacity 
                onPress={save}
                disabled={!canSave}
                style={[styles.overtime.saveBtn, { backgroundColor: canSave ? colors.primary : colors.border}]}
            >
                <Text style={styles.overtime.saveBtnText}>Сохранить</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}