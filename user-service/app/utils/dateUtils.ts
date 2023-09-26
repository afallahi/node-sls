import dayUtil from 'dayjs';

export const TimeDiff = (from: string, to: string, type: "d" | "h" | "m") => {
    const start = dayUtil(from);
    return start.diff(dayUtil(to), type, true);
}