import { range, subtract, truthy } from '../utils/array';
import { readInputLines } from '../utils/file';

const inputLines = readInputLines().filter(truthy);

const boardingPassToSeatID = (pass: string) => 
    parseInt(pass.replace(/[RB]/g, '1').replace(/[FL]/g, '0').trim(), 2);

interface Seat {
    id: number;
    row: number;
    column: number;
}

const idToSeat = (id: number): Seat => ({
    id,
    row: Math.floor(id / 8),
    column: id % 8,
});

const seatIDs = inputLines.map(boardingPassToSeatID);
const min = Math.min(...seatIDs);
const max = Math.max(...seatIDs);
const available = subtract(range(min, max), seatIDs);
console.log(available);
