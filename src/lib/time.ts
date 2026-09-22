export const ParseTimeToMinutes = (text: string) => {
    const strNum = text.replace(/[:,]/g,'.').split('.');
    if (strNum.length > 1) {
        if (Number(strNum[0]) === 0) {
            return Number(strNum[1]);
        } else {
            const hours = Number(strNum[0]) * 60;
            const minutes = Number(strNum[1]);
            return hours + minutes
        }
    } else {
        return Number(strNum[0]) * 60
    }
}

export const MinutesToParts = (m: number):[number,number] => {
    const hours = Math.floor(m / 60) || 0;
    const minutes = Number((m % 60).toFixed(0)) || 0;

    return [hours, minutes]
}

export const MinutesToHHMM = (minutes: string):string => {
    return `${MinutesToParts(Number(minutes))[0]}:${MinutesToParts(Number(minutes))[1]}`
}