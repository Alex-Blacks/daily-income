import { Stack } from "expo-router";
import { AppProvider } from "../lib/context";

export default function RootLayout() {
    return (
        <AppProvider>
            <Stack />
        </AppProvider>
    );
}