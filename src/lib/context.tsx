import { useEffect, createContext, useContext, useState, ReactNode, useMemo } from "react";
import { useColorScheme } from "react-native";
import { Settings, OvertimeEntry, defaultSettings, loadSettings, saveSettings, loadOvertime, saveOvertime } from "./storage";
import { Colors, darkColors, lightColors } from "./theme";

export type Cursor = {
    year: number;
    month: number;
};

type Ctx = {
    ready: boolean;
    settings: Settings;
    updateSettings: (patch: Partial<Settings>) => void;

    overtime: OvertimeEntry[];
    addOvertime: (entry: Omit<OvertimeEntry, 'id'>) => void;
    removeOvertime: (id: string) => void;

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
    const [ cursor, setCursor ] = useState(() => {
            const d = new Date();
            return { year: d.getFullYear(), month: d.getMonth()}
        });

    useEffect(() => {
        (async () => {
            const [s, o] = await Promise.all([loadSettings(), loadOvertime()]);
            setSettings(s);
            setOvertime(o);
            setReady(true);
        })();
    },[]);

    useEffect(() => {
        if (!ready) return;
        saveSettings(settings)
        saveOvertime(overtime)
    },[settings, overtime, ready]);

    const updateSettings = (patch: Partial<Settings>) => {
        setSettings(prev =>  ({...prev, ...patch}));
    }

    const addOvertime = (entry: Omit<OvertimeEntry, 'id'>) => {
        setOvertime(prev => [...prev, {...entry, id: String(Date.now())}]);
    }

    const removeOvertime = (id:string) => {
        setOvertime(prev => prev.filter(o => o.id !== id));
    }

    const isDark = settings.theme === 'dark' || (settings.theme === 'auto' && system === 'dark');
    const colors = isDark ? darkColors : lightColors; 

    const value = useMemo(
        () => ({ ready, settings, updateSettings, overtime, addOvertime, removeOvertime, cursor, setCursor, colors, isDark }),
        [ready, settings,overtime, cursor, colors, isDark],
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
