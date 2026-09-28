import { useEffect, createContext, useContext, useState, ReactNode, useMemo } from "react";
import { useColorScheme } from "react-native";
import { Settings, OvertimeEntry, defaultSettings, loadSettings, saveSettings, loadOvertime, saveOvertime, Exception, loadException, saveException } from "./storage";
import { Colors, darkColors, lightColors } from "./theme";
import { fromKey } from "./dates";

export type Cursor = {
    year: number;
    month: number;
};

type Ctx = {
    ready: boolean;
    settings: Settings;
    getDayMinutes: (dateStr: string) => number;
    updateSettings: (patch: Partial<Settings>) => void;

    overtime: OvertimeEntry[];
    addOvertime: (entry: Omit<OvertimeEntry, 'id'>) => void;
    removeOvertime: (id: string) => void;

    exception: Exception[];
    addException: (except: Omit<Exception, 'id'>) => void;
    removeException: (id:string) => void;

    cursor: Cursor;
    setCursor: React.Dispatch<React.SetStateAction<Cursor>>;
    colors: Colors;
    isDark: boolean;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children:ReactNode }) {
    const system = useColorScheme();
    const [ ready, setReady ] = useState(false);
    const [ settings, setSettings ] = useState<Settings>(defaultSettings);
    const [ overtime, setOvertime ] = useState<OvertimeEntry[]>([]);
    const [ exception, setException ] = useState<Exception[]>([]);
    const [ cursor, setCursor ] = useState(() => {
            const d = new Date();
            return { year: d.getFullYear(), month: d.getMonth()}
        });

    useEffect(() => {
        (async () => {
            const [s, o, e] = await Promise.all([loadSettings(), loadOvertime(), loadException()]);
            setSettings(s);
            setOvertime(o);
            setException(e);
            setReady(true);
        })();
    },[]);

    useEffect(() => {
        if (!ready) return;
        saveSettings(settings);
        saveOvertime(overtime);
        saveException(exception);
    },[settings, overtime, exception, ready]);

    const updateSettings = (patch: Partial<Settings>) => {
        setSettings(prev =>  ({...prev, ...patch}));
    }

    const addOvertime = (entry: Omit<OvertimeEntry, 'id'>) => {
        setOvertime(prev => [...prev, {...entry, id: String(Date.now())}]);
    }

    const removeOvertime = (id:string) => {
        setOvertime(prev => prev.filter(o => o.id !== id));
    }

    const addException = (except: Omit<Exception, 'id'>) => {
        setException(prev => [
            ...prev.filter(e => e.date !== except.date), 
            {...except, id: String(Date.now())}]);
    }

    const removeException = (id:string) => {
        setException(prev => prev.filter(e => e.id != id));
    }

    const isScheduledWorkDay = (dateStr: string): boolean => {
        const { schedule, startDate, workDays } = settings;
        const date = fromKey(dateStr);

        if (schedule === '5/2' || schedule === 'Свой') {
            return workDays.includes((date.getDay() + 6) % 7);
        } 

        if (startDate === null) return false;
        
        const start = fromKey(startDate);
        if (date < start) return false;

        const days = Math.floor((date.getTime() - start.getTime())/86400000);
        if (schedule === '3/3') return (days % 6 < 3);
        if (schedule === '2/2') return (days % 4 < 2);
        if (schedule === '1/3') return (days % 4 < 1);

        return false;
    }

    const getDayMinutes = (dateStr: string): number => {
        const { minutesPerDay } = settings;
        const exc = exception.find(f => f.date === dateStr)?.minutes || 0;

        const result = isScheduledWorkDay(dateStr) ? minutesPerDay - exc : 0;
        return result;
    }

    const isDark = settings.theme === 'dark' || (settings.theme === 'auto' && system === 'dark');
    const colors = isDark ? darkColors : lightColors; 

    const value = useMemo(
        () => ({ ready, settings, getDayMinutes, updateSettings, overtime, addOvertime, removeOvertime, exception, addException, removeException, cursor, setCursor, colors, isDark }),
        [ready, settings,overtime, exception, cursor, colors, isDark],
    )

    return (
        <AppCtx.Provider value={value}>
            {children}
        </AppCtx.Provider>
    )
}

export function useApp() {
    const ctx = useContext(AppCtx)
    if (!ctx) throw new Error ('useApp must be used inside AppProvider');
    return ctx;
}
