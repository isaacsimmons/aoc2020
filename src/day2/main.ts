import { truthy } from '../utils/array';
import { readInputLines } from '../utils/file';

const inputLines = readInputLines();

interface Line {
    idx2: number;
    idx1: number;
    char: string;
    password: string;
}

const isValid = (line: Line) => 
    (line.password[line.idx1 - 1] === line.char) !== (line.password[line.idx2 - 1] === line.char);

const parseLine = (s: string): Line => {
    const [range, charToken, password] = s.trim().split(' ');
    const [idx1, idx2] = range.split('-');
    const char = charToken[0];
    return {
        idx1: Number(idx1), idx2: Number(idx2), char, password
    };
}

console.log(inputLines.map(parseLine).map(isValid).filter(truthy).length);