import { readInputFile, readInputLines } from '../utils/file';

const inputLines = readInputLines();

interface Line {
    max: number;
    min: number;
    char: string;
    password: string;
}

const isValid = (line: Line): boolean => {
    return (line.password[line.min - 1] === line.char) !== (line.password[line.max - 1] === line.char);
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