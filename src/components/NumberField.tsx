import { useEffect, useState } from "react";
import { Colors } from "../lib/theme";
import { StyleSheet, TextInput } from "react-native";
import { useStyles } from "../lib/styles";

type Props = {
    value: string;
    onCommit: (n: string) => void;
    colors: Colors;
    placeholder?: string;
    autoFocus?: boolean;
};

export default function NumberField({ value, onCommit, colors, placeholder, autoFocus}: Props) {
    const [ text, setText ] = useState(value);
    const styles = useStyles();

    useEffect( () => {
        setText(value);
    },[value]);

    const commit = () => {
        setText(text)
        onCommit(text);
    };

    return (
        <TextInput
            style={[ styles.typeField.input, { color: colors.text, borderColor: colors.border}]}
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

export function TimeField ({ value, onCommit, colors, placeholder, autoFocus}: Props) {
    const [ text, setText ] = useState(value);
    const styles = useStyles();

    useEffect( () => {
        setText(value.padStart(2, '0'));
    },[value]);

    const commit = () => {
        const t = text.padStart(2, '0')
        setText(t);
        onCommit(t);
    };

    return (
        <TextInput
            style={[ styles.typeField.input, { color: colors.text, borderColor: colors.border}]}
            keyboardType='numbers-and-punctuation'
            inputMode='decimal'
            value={ text}
            onFocus={() => setText('')}
            onChangeText={ setText}
            onBlur={ commit}
            onSubmitEditing={ commit}
            placeholder={ placeholder}
            placeholderTextColor={ colors.textMuted}
            autoFocus={ autoFocus}
        ></TextInput>
    );
}