import { truthy } from '../utils/array';
import { readInputLines } from '../utils/file';

const inputLines = readInputLines().filter(truthy);

type Operator = 'nop' | 'acc' | 'jmp';
interface Instruction {
    op: Operator;
    value: number;
}

const parseInstruction = (s: string): Instruction => {
    const [op, value] = s.split(' ');
    return {
        op: op as Operator,
        value: Number(value),
    }
};

const program = inputLines.map(parseInstruction);


const runProgram = (program: Instruction[]): {acc: number, success: boolean} => {
    let position = 0;
    let acc = 0;
    const positions = new Set<number>();
        while (true) {
        if (positions.has(position)) {
            return {acc, success: false};
            break;
        }
        if (position === program.length) {
            return {acc, success: true};
        }
        if (position < 0 || position > program.length) {
            throw new Error('out of bounds');
        }
        positions.add(position);
        const {op, value} = program[position];
        switch (op) {
            case 'acc':
                acc += value;
                position++;
                break;
            case 'nop':
                position++;
                break;
            case 'jmp':
                position += value;
                break;
            default:
                throw new Error('bad op: ' + op);
        }
    }
};


console.log(runProgram(program));


const tweak = (program: Instruction[], position: number): Instruction[] => {
    const copy = [...program];
    const {op, value} = copy[position];

    if (op === 'nop') {
        copy[position] = {op: 'jmp', value};
    } else if (op === 'jmp') {
        copy[position] = { op: 'nop', value};
    }
    return copy;
};


for (let i = 0; i < program.length; i++) {
    const edited = tweak(program, i);
    const {success, acc} = runProgram(edited);
    if (success) {
        console.log('done', acc);
        break;
    }
}