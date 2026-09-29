import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeName } from "./theme";
import { ScheduleMonth, ShortDay } from "./dates";
import { WorkTimeDay } from "./time";

const SETTINGS_KEY = 'daily-income:settings';
const OVERTIME_KEY = 'daily-income:overtime';
const EXCEPTION_KEY = 'daily-income:exception';

export type Settings = {
    rate: number;
    minutesPerDay: number;
    schedule: ScheduleMonth;
    startDate: string | null;
    workDays: number[];
    workTime: WorkTimeDay;
    dayRules: ShortDay[];
    isEnableRules: boolean;
    theme: ThemeName;
};

export type OvertimeEntry = {
    id: string;
    date: string;
    rate: number;
    minutes: number;
};

export type Exception = {
    id: string;
    date: string;
    minutes: number;
}

export const defaultSettings: Settings = {
    rate: 500,
    minutesPerDay: 480,
    schedule: '5/2',
    startDate: null,
    workDays: [0, 1, 2, 3, 4],
    workTime: { start: 540, end: 1080, lunch: 60},
    dayRules: [],
    isEnableRules: false,
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

export const saveSettings = async (s:Settings):Promise<void> => {
    try {
        AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    } catch (e) {
        console.log('Ошибка сохранения настроек: ', e);
    }
};

export const loadOvertime = async ():Promise<OvertimeEntry[]> => {
    try {
        const raw = await AsyncStorage.getItem(OVERTIME_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const saveOvertime = async (entries: OvertimeEntry[]):Promise<void> => {
    try {
        AsyncStorage.setItem(OVERTIME_KEY, JSON.stringify(entries));
    } catch (e) {
        console.log('Ошибка сохранения переработок: ', e);
    }
}
export const loadException = async ():Promise<Exception[]> => {
    try {
        const raw = await AsyncStorage.getItem(EXCEPTION_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export const saveException = async (except: Exception[]):Promise<void> => {
    try {
        AsyncStorage.setItem(EXCEPTION_KEY, JSON.stringify(except));
    } catch(e) {
        console.log('Ошибка сохранения сокращённых дней: ', e);
    }
}