import { StyleSheet } from 'react-native';
import { Colors } from './theme';
import { useApp } from './context';
import { useMemo } from 'react';

export const makeStyles = (colors: Colors) => ({
    calendar: StyleSheet.create({
        container: { 
            flex: 1 
        },
        header: {
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingHorizontal: 16, 
            paddingVertical: 8,
        },
        navBtn: { 
            padding: 8 
        },
        navBtnText: { 
            fontSize: 34, 
            lineHeight: 34, 
            fontWeight: '300' 
        },
        monthLabel: { 
            fontSize: 18, 
            fontWeight: '600' 
        },
        monthTotal: { 
            fontSize: 13, 
            fontWeight: '600', 
            marginTop: 2 
        },
        weekdaysRow: { 
            flexDirection: 'row', 
            paddingHorizontal: 4 
        },
        weekday: { 
            flex: 1, 
            textAlign: 'center', 
            fontSize: 12, 
            fontWeight: '600' 
        },
        grid: { 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            paddingHorizontal: 4, 
            paddingTop: 4 
        },
        cellWrap: { 
            width: `${100 / 7}%`, 
            padding: 2 
        },
        cell: {
            minHeight: 60,
            borderRadius: 10,
            padding: 6,
            borderWidth: 2,
            borderColor: 'transparent',
        },
        dayNum: { 
            fontSize: 14, 
            fontWeight: '600' 
        },
        income: { 
            fontSize: 11, 
            fontWeight: '600', 
            marginTop: 2 
        },
        ot: { 
            fontSize: 10, 
            marginTop: 1 
        },
        fab: {
            position: 'absolute', 
            right: 20, 
            bottom: 24,
            width: 56, 
            height: 56, 
            borderRadius: 28,
            alignItems: 'center', 
            justifyContent: 'center',
            shadowColor: '#000', 
            shadowOpacity: 0.25, 
            shadowRadius: 8, 
            shadowOffset: { 
                width: 0, 
                height: 4 
            },
            elevation: 6,
        },
        fabText: { 
            color: '#fff', 
            fontSize: 32, 
            lineHeight: 34, 
            fontWeight: '300' 
        },
    }),
    settings: StyleSheet.create({
        container: { 
            padding: 16 
        },
        sectionTitle: {
            fontSize: 12, 
            fontWeight: '700', 
            textTransform: 'uppercase',
            letterSpacing: 0.5, 
            marginTop: 16, 
            marginBottom: 8,
        },
        card: { 
            borderWidth: 1, 
            borderRadius: 12, 
            padding: 16 
        },
        label: { 
            fontSize: 13, 
            marginBottom: 6 
        },
        input: { 
            borderWidth: 1, 
            borderRadius: 8, 
            padding: 10, 
            fontSize: 16 
        },
        row: { 
            flexDirection: 'row', 
            gap: 6, 
            flexWrap: 'wrap' 
        },
        chip: { 
            paddingHorizontal: 12, 
            paddingVertical: 8, 
            borderWidth: 1, 
            borderRadius: 8, 
            minWidth: 44, 
            alignItems: 'center' 
        },
        chipWide: { 
            flex: 1 
        },
        footer: { 
            fontSize: 12, 
            textAlign: 'center', 
            marginTop: 24 
        },
    }),
    day: StyleSheet.create({
        container: { 
            padding: 16, 
            gap: 12 
        },
        card: { 
            borderWidth: 1, 
            borderRadius: 12, 
            padding: 16 
        },
        label: { 
            fontSize: 12, 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            marginBottom: 8 
        },
        formula: { 
            fontSize: 16 
        },
        otRow: { 
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingVertical: 8 
        },
        addBtn: { 
            marginTop: 12, 
            padding: 12, 
            borderWidth: 1, 
            borderRadius: 8, 
            alignItems: 'center' 
        },
        totalCard: { 
            borderRadius: 12, 
            padding: 20, 
            alignItems: 'center' 
        },
        totalLabel: { 
            color: '#fff', 
            fontSize: 13, 
            opacity: 0.9 
        },
        totalValue: { 
            color: '#fff', 
            fontSize: 32, 
            fontWeight: 'bold',
            marginTop: 4 
        },
        subtotal: { 
            borderTopWidth: 1, 
            paddingTop: 8, 
            marginTop: 4, 
            alignItems: 'flex-end' 
        },
    }),
    overtime: StyleSheet.create({
        container: { 
            padding: 16 
        },
        label: { 
            fontSize: 13, 
            fontWeight: '600', 
            marginBottom: 6 
        },
        input: { 
            borderWidth: 1, 
            borderRadius: 8, 
            padding: 12, 
            fontSize: 16 
        },
        saveBtn: { 
            marginTop: 24, 
            padding: 14, 
            borderRadius: 10, 
            alignItems: 'center' 
        },
        saveBtnText: { 
            color: '#fff', 
            fontSize: 16, 
            fontWeight: '600' 
        },
        chipsRow: { 
            flexDirection: 'row', 
            gap: 8, 
            marginTop: 8 
        },
        chip: {
            flex: 1, 
            paddingVertical: 10, 
            borderWidth: 1, 
            borderRadius: 8,
            alignItems: 'center',
        },
        preview: {
            marginTop: 20, 
            padding: 16, 
            borderRadius: 10, 
            borderWidth: 1,
            alignItems: 'center',
        },
    }),
})

export function useStyles() {
    const { colors } = useApp();
    return useMemo(() => makeStyles(colors),[colors])
}