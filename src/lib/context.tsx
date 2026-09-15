import { useEffect, createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AppContextValue = {
    rate: string;
    setRate: (r: string) => void;
    hoursPerDay: string;
    setHoursPerDay: (h: string) => void;
    workDays: number[];
    setWorkDays: (w: number[]) => void;
    cursor: {year: number, month: number};
    setCursor: (c: any) => void;
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
    
    useEffect(() => {
        (async () => {
        const getRate = await AsyncStorage.getItem('rate')
        if (getRate !== null) setRate(getRate)

        const getHours = await AsyncStorage.getItem('hoursPerDay')
        if (getHours !== null) setHoursPerDay(getHours)

        const getDays = await AsyncStorage.getItem('workDays')
        if (getDays !== null) setWorkDays(JSON.parse(getDays))

        setLoaded(true)
        })();
    },[]);

    useEffect(() => {
        if (!loaded) return;
        AsyncStorage.setItem('rate', rate);
        AsyncStorage.setItem('hoursPerDay', hoursPerDay);
        AsyncStorage.setItem('workDays', JSON.stringify(workDays));
    },[rate, hoursPerDay, workDays, loaded]);

    return (
        <AppContext.Provider value={{rate, setRate, hoursPerDay, setHoursPerDay, workDays, setWorkDays, cursor, setCursor}}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error ('useApp must be used inside AppProvider');
    return ctx;
}

