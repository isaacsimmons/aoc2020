import { sum } from '../utils/array';
import { readInputLines } from '../utils/file';
import { leftPad } from '../day5/main';

const inputLines = readInputLines();

interface Instruction {
    address: number;
    value: number;
}

const parseInstruction = (s: string): Instruction => {
    const [left, right] = s.split(' = ');
    const value = Number(right);
    if (left.substring(0, 4) !== 'mem[' || left[left.length - 1] !== ']') {
        throw new Error('bad instruction: ' + s);
    }
    const address = Number(left.substring(4, left.length - 1));
    return {value, address};
};


type PartialBitmask = Array<'1' | '0' | 'X'>;

const parseBitmask = (line: string): PartialBitmask => {
    const maskString = line.substring(7);
    return [...maskString] as PartialBitmask;
};


const applyMask = (value: number, mask: PartialBitmask) => {
    const valueBits = [...leftPad(value.toString(2), 36, '0')];
    const result: string[] = [];
    for (let i = 0; i < 36; i++) {
        if (mask[i] === '1') {
            result[i] = '1';
        } else if (mask[i] === '0') {
            result[i] = '0';
        } else {
            result[i] = valueBits[i];
        }
    }

    const resultString = result.join('');
    return parseInt(resultString, 2);
};

const runInstruction = (line: string) => {
    if (line.substring(0, 7) === 'mask = ') {
        mask = parseBitmask(line);
 //       console.log('new bitmask', mask);
    } else {
        const {address, value} = parseInstruction(line);
//        console.log('instruction', {address, value}, 'mask', mask);
        memory.set(address, applyMask(value, mask));
    }
};

const memory = new Map<number, number>();
let mask: PartialBitmask = [...'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'] as PartialBitmask;

inputLines.forEach(runInstruction);

console.log(memory);

const memoryTotal = sum([...memory.values()]);
console.log('sum', memoryTotal);

// 332440436143 too low
