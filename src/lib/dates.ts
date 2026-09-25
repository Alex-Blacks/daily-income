export const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
export const MONTH_FOR_DAYS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
export const WEEKDAYS_SHORT = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс',];

export type ScheduleMonth = '1/3' | '2/2' | '3/3' | '5/2' | 'Свой';
export const SCHEDULE_OPTIONS: ScheduleMonth[] = ['1/3', '2/2', '3/3', '5/2', 'Свой'];
export const SCHEDULE_HINTS: Record<ScheduleMonth, string> = {
    '1/3': '1 рабочий день, 3 выходных',
    '2/2': '2 рабочих дня, 2 выходных',
    '3/3': '3 рабочих дня, 3 выходных',
    '5/2': '5 рабочих дней, 2 выходных',
    'Свой': 'Выберите рабочие дни вручную',
};

export type ShortDay = { dayOfWeek: number, shortByMinutes: number };

export const toKey = (d:Date):string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
}

export const fromKey = (key: string):Date => {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y,m-1,d);
}

export const todayKey = ():string => toKey(new Date());

export const getMonthGrid = (year:number, month:number):(Date|null)[] => {
    const firstDay = new Date(year, month, 1);
    const firstWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month +1, 0).getDate();

    const cells:(Date | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length < 42) cells.push(null);
    return cells;
};