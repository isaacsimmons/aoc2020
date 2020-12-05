import { range, sum, truthy } from '../utils/array';
import { readInputLines } from '../utils/file';

const inputLines = readInputLines().filter(truthy);

const boardingPassToSeatID = (pass: string): number => {
    const binary = pass.replace(/[RB]/g, '1').replace(/[FL]/g, '0').trim();
    console.log(pass, binary);
    return parseInt(binary, 2);
};

const seats = inputLines.map(boardingPassToSeatID);
seats.sort();
seats.forEach(seat => console.log(seat));
//console.log(seats);
const min = Math.min(...seats);
const max = Math.max(...seats);

const available = new Set(range(min, max));
seats.forEach(seat => available.delete(seat));
console.log(available);

console.log(max);