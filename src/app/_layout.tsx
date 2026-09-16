import { Stack } from "expo-router";
import { AppProvider } from "../lib/context";

export default function RootLayout() {
    return (
        <AppProvider>
            <Stack>
                <Stack.Screen name='(tabs)' options={{ headerShown: false}} />
                <Stack.Screen name="day/[date]" options={{ title: 'День' }} />
                <Stack.Screen name="overtime/new" options={{ title: 'Переработка' }} />
            </Stack>
        </AppProvider>
    );
}