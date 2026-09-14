import { createContext, useState, ReactNode } from "react";

type AppContextValue = {
    rate: string;
    setRate: (r: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children:ReactNode }) {
    const [rate, setRate] = useState('');
    return (
        <AppContext.Provider value={{rate, setRate}}>
            {children}
        </AppContext.Provider>
    )
}

