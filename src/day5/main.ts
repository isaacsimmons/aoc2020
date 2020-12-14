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

export const leftPad = (s: string, length: number, padding: string) => {
    if (s.length >= length) {
        return s;
    }
    const paddingLength = length - s.length;
    let paddingString = padding.repeat(Math.ceil(paddingLength / padding.length));

    if (paddingString.length > paddingLength) {
        paddingString = paddingString.substr(0, paddingLength);
    }
    return paddingString + s;
};

const seatToBoardingPass = (seat: Seat) => {
    const row = seat.row.toString(2).replaceAll('1', 'B').replaceAll('0', 'F');
    const column = seat.column.toString(2).replaceAll('1', 'R').replaceAll('0', 'L');
    return leftPad(row, 7, 'F') + leftPad(column, 3, 'L');
};

const seatIDs = inputLines.map(boardingPassToSeatID);
const min = Math.min(...seatIDs);
const max = Math.max(...seatIDs);
const available = subtract(range(min, max), seatIDs);
console.log(available);
