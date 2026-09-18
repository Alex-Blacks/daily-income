import { useEffect, useState } from "react";
import { Colors } from "../lib/theme";
import { StyleSheet, TextInput } from "react-native";

const parseNum = (s: string): number => {
    const n = parseFloat(s.replace(',','.'));
    return Number.isFinite(n) ? n : 0;
}

const formatNum = (n: number): string => String(n);

type Props = {
    value: string;
    onCommit: (n: number) => void;
    colors: Colors;
    placeholder?: string;
    autoFocus?: boolean;
};

export default function NumberField({ value, onCommit, colors, placeholder, autoFocus}: Props) {
    const [ text, setText ] = useState(value);

    useEffect( () => {
        setText(value);
    },[value]);

    const commit = () => {
        const n = parseNum(text);
        setText(formatNum(n))
        onCommit(n);
    };

    return (
        <TextInput
            style={[ styles.input, { color: colors.text, borderColor: colors.border}]}
            keyboardType='decimal-pad'
            inputMode='decimal'
            value={ text}
            onChangeText={ setText}
            onBlur={ commit}
            onSubmitEditing={ commit}
            placeholder={ placeholder}
            placeholderTextColor={ colors.textMuted}
            autoFocus={ autoFocus}
        ></TextInput>
    );
}

const styles = StyleSheet.create({
    input: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 16 },
});