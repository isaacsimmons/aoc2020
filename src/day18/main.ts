import { sum } from '../utils/array';
import { readInputLines } from '../utils/file';

const inputLines = readInputLines();

type Segment = Number | Operator | '(' | ')';
type Operator = '+' | '*';

const parseLine = (line: string): Segment[] => {
    return line.split(/([0-9]+|\(|\)|\+|\*)/g).map(segment => segment.trim()).filter(segment => segment.length > 0) as Segment[];
};

const lines = inputLines.map(parseLine);

const readValue = (line: Segment[]): [number, Segment[]] => {
    const [first, ...rest] = line;
    if (first === undefined) {
        throw new Error('Unexpected end of line');
    }
    if (first === '+' || first === '*') {
        throw new Error('Unexpected operator when value was expected');
    }
    if (first === ')') {
        throw new Error('Unsupported close parens');
    }
    if (first === '(') {
        return computeLine(rest);
    }

    return [Number(first), rest];
};

const readOperator = (line: Segment[]): [Operator, Segment[]] => {
    const [first, ...rest] = line;
    if (first === undefined) {
        throw new Error('Unexpected end of line when looking for operator');
    }
    if (first === '+' || first === '*') {
        return [first, rest];
    }
    throw new Error(`Unexpected token: ${first} when looking for operator`);
};

const apply = (left: number, operator: Operator, right: number): number => {
    switch (operator) {
        case '*':
            return left * right;
        case '+':
            return left + right;
        default:
            throw new Error('Unexpected operator: ' + operator);
    }
};

//1 + 2 * 3 + 4 * 5 + 6
const computeLine = (line: Segment[]): [number, Segment[]] => {
    let value: number;
    let right: number;
    let operator: Operator;

    [value, line] = readValue(line);
    while (true) {
        if (line.length === 0) {
            return [value, []];
        } else if (line[0] === ')') {
            return [value, line.slice(1)];
        }

        [operator, line] = readOperator(line);
        [right, line] = readValue(line);
        value = apply(value, operator, right);
    }
};

console.log('result', sum(lines.map(line => computeLine(line)[0])));

