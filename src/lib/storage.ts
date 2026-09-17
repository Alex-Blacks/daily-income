import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeName } from "./theme";

const SETTINGS_KEY = 'daily-income:settings';
const OVERTIME_KEY = 'daily-income:overtime';

export type Settings = {
    rate: number;
    hoursPerDay: number;
    workDays: number[];
    theme: ThemeName;
};

export type OvertimeEntry = {
    id: string;
    date: string;
    rate: number;
    hours: number;
};

export const defaultSettings: Settings = {
    rate: 500,
    hoursPerDay: 8,
    workDays: [0, 1, 2, 3, 4],
    theme: 'auto',
}

export const loadSettings = async ():Promise<Settings> => {
    try {
        const raw = await AsyncStorage.getItem(SETTINGS_KEY);
        return raw ? {...defaultSettings, ...JSON.parse(raw)} : defaultSettings;
    } catch {
        return defaultSettings;
    }
};

export const saveSettings = (s:Settings) => {
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
};

export const loadOvertime = async ():Promise<OvertimeEntry[]> => {
    try {
        const raw = await AsyncStorage.getItem(OVERTIME_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const saveOvertime = (entries: OvertimeEntry[]) => {
    AsyncStorage.setItem(OVERTIME_KEY, JSON.stringify(entries));
}