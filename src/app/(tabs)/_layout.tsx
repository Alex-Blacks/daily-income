import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#007aff',
                tabBarInactiveTintColor: '#8e8e93',
            }}
        >
            <Tabs.Screen 
                name='index' 
                options={{
                    title: 'Календарь', 
                    tabBarIcon: () => <Text>📅</Text>,
                }} 
            />
            <Tabs.Screen 
                name='settings' 
                options={{
                    title: 'Настройки',
                    tabBarIcon: () => <Text>⚙️</Text>,
                }} 
            />
        </Tabs>
    );
}