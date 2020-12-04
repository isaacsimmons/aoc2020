import { readFileSync } from 'fs';

export const readInputFile = (day?: number, name?: string, suffix?: string) => {
    if (!day) {
        day = Number(process.env.DAY);
    }
    if (!name) {
        name = process.env.FILE || 'input';
    }
    if (!suffix) {
        suffix = '';
    }
    return readFileSync(`inputs/day${day}/${name}${suffix}.txt`).toString().trim();
};

export const readInputLines = (day?: number, name?: string, suffix?: string) => {
    return readInputFile(day, name, suffix).split('\n');
};
