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
    return readInputFile(day, name, suffix).split('\n').filter(line => line.length > 0);
};

export const splitDoubleNewline = function *splitDoubleNewline(lines: string[]): Generator<string[], void, void> {
    let chunk: string[] = [];
    for (const line of lines) {
        if (line === '') {
            if (chunk.length) {
                yield chunk;
                chunk = [];
            }
        } else {
            chunk.push(line);
        }
    }
    if (chunk.length) {
        yield chunk;
    }
};

export const readNewlineSeparatedChunks = (day?: number, name?: string, suffix?: string) => {
    return [...splitDoubleNewline(readInputFile(day, name, suffix).split('\n'))];
};
