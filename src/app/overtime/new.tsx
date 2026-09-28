import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useApp } from "../../lib/context";
import { useStyles } from '../../lib/styles';
import { MinutesToHHMM, ParseTimeToMinutes } from "../../lib/time";
import NumberField, { TimeField } from "../../components/TypeField";

type RateOt = 1 | 1.5 | 2;
const RateOptionsOt: RateOt[] = [1, 1.5, 2];
const RateLabel: Record<RateOt,string> = {
    '1' : 'Базовая',
    '1.5' : 'x1.5',
    '2' : 'x2'
}

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
            <TimeField
                value={MinutesToHHMM(Number(minutesOt))}
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
                onCommit={(n) => String(setRateOt(Number(n)))}
                placeholder="500"
                colors={colors}
            />

            <View style={ styles.overtime.chipsRow}>
                {RateOptionsOt.map(rate => {
                    return(
                        <TouchableOpacity
                            key={rate}
                            onPress={() => setRateOt(settings.rate * rate)}
                            style={[ styles.overtime.chip, { borderColor: colors.border, backgroundColor: colors.card}]}
                        >
                            <Text style={{ color: colors.text, fontWeight: '600'}}>{RateLabel[rate]}</Text>
                        </TouchableOpacity>
                    )
                })}
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