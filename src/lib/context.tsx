import { useEffect, createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type OvertimeEntry = {
    id: string;
    date: string;
    hoursOvertime: number;
    rateOvertime: number;
}

type Cursor = {
    year: number;
    month: number;
}

type AppContextValue = {
    rate: string;
    setRate: (r: string) => void;
    hoursPerDay: string;
    setHoursPerDay: (h: string) => void;
    workDays: number[];
    setWorkDays: (w: number[]) => void;
    cursor: Cursor;
    setCursor: (c: Cursor) => void;
    overtime: OvertimeEntry[];
    addOvertime: (entry: Omit<OvertimeEntry, 'id'>) => void;
    removeOvertime: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children:ReactNode }) {
    const [loaded, setLoaded] = useState(false);
    const [rate, setRate] = useState('');
    const [hoursPerDay, setHoursPerDay] = useState('');
    const [workDays, setWorkDays] = useState([0,1,2,3,4]);
    const [cursor, setCursor] = useState(() => {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth()}
    });
    const [overtime, setOvertime] = useState<OvertimeEntry[]>([]);

    function addOvertime(entry: Omit<OvertimeEntry, 'id'>) {
        const newEntry = { ...entry, id: Date.now().toString()};
        setOvertime(prev => [...prev,newEntry]);
    }

    function removeOvertime(id:string) {
        setOvertime(prev => prev.filter(o => o.id !== id));
    }

    useEffect(() => {
        (async () => {
        const getRate = await AsyncStorage.getItem('rate')
        if (getRate !== null) setRate(getRate)

        const getHours = await AsyncStorage.getItem('hoursPerDay')
        if (getHours !== null) setHoursPerDay(getHours)

        const getDays = await AsyncStorage.getItem('workDays')
        if (getDays !== null) setWorkDays(JSON.parse(getDays))

        const getOvertime = await AsyncStorage.getItem('overtime')
        if (getOvertime !== null) setOvertime(JSON.parse(getOvertime))

        setLoaded(true)
        })();
    },[]);

    useEffect(() => {
        if (!loaded) return;
        AsyncStorage.setItem('rate', rate);
        AsyncStorage.setItem('hoursPerDay', hoursPerDay);
        AsyncStorage.setItem('workDays', JSON.stringify(workDays));
        AsyncStorage.setItem('overtime', JSON.stringify(overtime));
    },[rate, hoursPerDay, workDays, overtime, loaded]);

    return (
        <AppContext.Provider value={{ rate, setRate, hoursPerDay, setHoursPerDay, workDays, setWorkDays, cursor, setCursor, overtime, addOvertime, removeOvertime }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error ('useApp must be used inside AppProvider');
    return ctx;
}
