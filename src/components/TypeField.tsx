import { useEffect, useState } from "react";
import { Colors } from "../lib/theme";
import { StyleSheet, TextInput, Platform  } from "react-native";
import { useStyles } from "../lib/styles";

type Props = {
    value: string;
    onCommit: (n: string) => void;
    colors: Colors;
    placeholder?: string;
    autoFocus?: boolean;
    allowNegative?: boolean;
};

export default function NumberField({ value, onCommit, colors, placeholder, autoFocus, allowNegative = false}: Props) {
    const [ text, setText ] = useState(value);
    const styles = useStyles();

    useEffect( () => {
        setText(value);
    },[value]);

    const handleChange = (raw: string) => {
        let next = raw.replace(/[^0-9.,\-]/g, '');
        if (!allowNegative) next = next.replace(/[-]/g, '');

        const parts = next.split(/[.,]/);
        if (parts.length > 2) next = parts[0] + '.' + parts.slice(1).join('');

        setText(next)
    }

    const commit = () => {
        const normalized = text.replace(',', '.');
        const n = parseFloat(normalized);
        const out = Number.isFinite(n) ? String(n) : '';
        setText(out);
        onCommit(out);
    };

    return (
        <TextInput
            style={[ styles.typeField.input, { color: colors.text, borderColor: colors.border}]}
            keyboardType={ Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
            inputMode='decimal'
            value={text}
            onChangeText={handleChange}
            onBlur={commit}
            onSubmitEditing={commit}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            autoFocus={autoFocus}
        ></TextInput>
    );
}

/* ─────────────────────── TimeField ───────────────────────── */

type TimeProps = Omit<Props, 'allowNegative'>;


export function TimeField ({ value, onCommit, colors, placeholder, autoFocus}: TimeProps) {
    const [ text, setText ] = useState(value);
    const styles = useStyles();

    useEffect( () => {
        setText(value.padStart(2, '0'));
    },[value]);

    const handleChange = (raw: string) => {
        let digits = raw.replace(/\D/g, '');
        if (digits.length > 4) digits = digits.slice(0,4);

        let formatted = digits;
        if (digits.length >= 3) {
            formatted = `${digits.slice(0,2)}:${digits.slice(2)}`;
        }
        setText(formatted);
    }

    const commit = () => {
        const normalized = normalizeTime(text);
        setText(normalized);
        onCommit(normalized);
    };

    return (
        <TextInput
            style={[ styles.typeField.input, { color: colors.text, borderColor: colors.border}]}
            keyboardType='numbers-and-punctuation'
            inputMode='numeric'
            value={ text}
            selectTextOnFocus
            onChangeText={handleChange}
            onBlur={commit}
            onSubmitEditing={commit}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            autoFocus={autoFocus}
            maxLength={5}
        ></TextInput>
    );
}


/**
 * Приводит любой ввод к «HH:MM»:
 *   "17"    → "17:00"   "5"     → "05:00"
 *   "1700"  → "17:00"   "17:0"  → "17:00"
 *   "25:00" → "23:59"   ""      → "00:00"
 */

function normalizeTime(input: string): string {
    const clean = input.replace(/\D/, '');

    let hours = 0;
    let minutes = 0;

    if (clean.length === 0) {
        return '00:00';
    } else if (clean.length <= 2) {
        hours = parseInt(clean, 10);
    } else if (clean.length === 3) {
        hours = parseInt(clean.slice(0,1), 10);
        minutes = parseInt(clean.slice(1,3), 10);
    } else {
        hours = parseInt(clean.slice(0,2), 10);
        minutes = parseInt(clean.slice(2,4), 10);
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}