export const MONTH_LABELS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
export const MONTH_LABELS_FOR_DAYS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

export function makeDateKey(year:number, month:number, day:number) {
    return (String(year) + "-" + String(month+1).padStart(2,"0") + "-" + String(day).padStart(2,"0"));
}

export function parseDateKey(date: string) {
    const [y, m, d] = date.split('-')
    return [Number(y), Number(m), Number(d)]
}