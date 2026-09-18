import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useApp } from "../../lib/context";

export default function TabsLayout() {
    const { colors } = useApp();
    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: colors.card },
                headerTintColor: colors.text,
                tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
            }}
        >
            <Tabs.Screen 
                name='index' 
                options={{
                    title: 'Календарь',
                    tabBarIcon: ({color}) => <Text style={{ fontSize: 20, color}}>📅</Text>,
                }} 
            />
            <Tabs.Screen 
                name='settings' 
                options={{
                    title: 'Настройки',
                    tabBarIcon: ({color}) => <Text style={{ fontSize: 20, color}}>⚙️</Text>,
                }} 
            />
        </Tabs>
    );
}