export const ParseTimeToMinutes = (text: string): number => {
    if (!text) return 0;

    const parts = text.replace(/[:,]/g,'.').split('.');

    let hours = 0;
    let minutes = 0;
    if (parts.length === 1) {
        const digits = parts[0].replace(/\D/g, '');
        if (digits.length <= 2) {
            hours = Number(digits) || 0;
        } else {
            hours = Number(digits.slice(0, 2)) || 0;
            minutes = Number(digits.slice(2, 4)) || 0;
        }
    } else {
        hours = Number(parts[0]) || 0;
        minutes = Number(parts[1]) || 0;
    }

    hours = Math.min(Math.max(hours, 0), 23);
    minutes = Math.min(Math.max(minutes, 0), 59);

    return hours * 60 + minutes;
};

export const MinutesToParts = (m: number): [number,number] => {
    if ( !Number.isFinite(m) || m < 0) return [0,0];
    const hours = Math.floor(m / 60);
    const minutes = Math.floor(m % 60);

    return [hours, minutes];
};

export const MinutesToHHMM = (minutes: number): string => {
    const [h, m] = MinutesToParts(minutes);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};