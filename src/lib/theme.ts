export type ThemeName = 'light' | 'dark' | 'auto';

export type Colors = {
    background: string;
    card: string;
    text: string;
    textMuted: string;
    border: string;
    primary: string;
    accent: string;
    danger: string;
};

export const lightColors: Colors = {
    background: '#f2f4f7',
    card: '#ffffff',
    text: '#111111',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    primary: '#007aff',
    accent: '#34c759',
    danger: '#ff3b30',
};

export const darkColors: Colors = {
    background: '#000000',
    card: '#1c1c1e',
    text: '#ffffff',
    textMuted: '#8e8e93',
    border: '#2c2c2e',
    primary: '#0a84ff',
    accent: '#30d158',
    danger: '#ff453a',
};