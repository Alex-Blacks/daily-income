import { Stack } from "expo-router";
import { AppProvider } from "../lib/context";
import { useApp } from "../lib/context";
import { StatusBar } from "expo-status-bar";

function RootStack() {
    const { colors, isDark} = useApp();

    return (
        <>
            <StatusBar style={isDark ? 'light' : 'dark'}/>
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: colors.card },
                    headerTintColor: colors.text,
                    contentStyle: { backgroundColor: colors.background},
                }}
            >
                <Stack.Screen name='(tabs)' options={{ headerShown: false}} />
                <Stack.Screen name="day/[date]" options={{ title: 'День' }} />
                <Stack.Screen name="overtime/new" options={{ title: 'Переработка' }} />
            </Stack>
        </>
    );
}


export default function RootLayout() {
    return (
        <AppProvider>
            <RootStack />
        </AppProvider>
    );
}