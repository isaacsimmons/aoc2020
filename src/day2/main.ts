import { readInputFile, readInputLines } from '../utils/file';

const inputLines = readInputLines();

interface Line {
    max: number;
    min: number;
    char: string;
    password: string;
}

const isValid = (line: Line): boolean => {
    let count = 0;
    for(const char of line.password) {
        if (char === line.char) {
            count ++;
        }
    }
    return count >= line.min && count <= line.max;
};

const parseLine = (s: string): Line => {
    const [range, charToken, password] = s.trim().split(' ');
    const [min, max] = range.split('-');
    const char = charToken[0];
    return {
        min: Number(min), max: Number(max), char, password
    };
}

console.log(inputLines.map(parseLine).map(isValid).filter(x => x).length);