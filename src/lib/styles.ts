import { StyleSheet } from 'react-native';

// Палитра — если захочешь тёмную тему, поменяешь здесь
export const colors = {
    bg: '#f2f4f7',
    card: '#ffffff',
    text: '#111111',
    muted: '#6b7280',
    border: '#cccccc',
    primary: '#007aff',
    accent: '#34c759',
    danger: '#ff3b30',
    disabled: '#cccccc',
};

// Общие стили — контейнер, поля, кнопки, лейблы
export const common = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
        paddingTop: 20,
    },
    content: {
        padding: 16,
        gap: 8,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: colors.text,
    },
    labelMuted: {
        fontSize: 13,
        color: colors.muted,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        backgroundColor: colors.card,
        color: colors.text,
    },
    row: {
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap',
    },
    button: {
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        alignItems: 'center',
    },
    buttonSecondary: {
        backgroundColor: colors.muted,
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        alignItems: 'center',
    },
    buttonDanger: {
        backgroundColor: colors.danger,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: colors.disabled,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        marginTop: 'auto',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
});

// Только для календаря
export const calendar = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        //paddingHorizontal: 16,
        paddingBottom: 12,
    },
    monthTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
    },
    arrow: {
        padding: 8,
    },
    arrowText: {
        fontSize: 28,
        color: colors.primary,
        fontWeight: '300',
    },
    weekdaysRow: {
        flexDirection: 'row',
        paddingHorizontal: 8,
    },
    weekday: {
        width: `${100 / 7}%`,
        textAlign: 'center',
        fontSize: 12,
        color: colors.muted,
        fontWeight: '600',
        paddingVertical: 6,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 8,
    },
    cellWrap: {
        width: `${100 / 7}%`,
        padding: 2,
    },
    cell: {
        minHeight: 56,
        backgroundColor: colors.card,
        borderRadius: 8,
        padding: 6,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    cellToday: {
        borderColor: colors.primary,
    },
    dayNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    dayIncome: {
        fontSize: 11,
        color: colors.accent,
        marginTop: 2,
    },
});

// Чипы-переключатели (рабочие дни в настройках, тема и т.п.)
export const chips = StyleSheet.create({
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        alignItems: 'center',
        minWidth: 44,
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        color: colors.text,
        fontWeight: '600',
    },
    chipTextActive: {
        color: '#ffffff',
    },
});