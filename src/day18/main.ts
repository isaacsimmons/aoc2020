import { sum } from '../utils/array';
import { readInputLines } from '../utils/file';

const inputLines = readInputLines();

type Segment = BasicSegment | '(' | ')';
type BasicSegment = Number | Operator;
type Operator = '+' | '*';

const parseLine = (line: string): Segment[] => {
    return line.split(/([0-9]+|\(|\)|\+|\*)/g).map(segment => segment.trim()).filter(segment => segment.length > 0).map(segment => segment.match(/^[0-9]+$/)? Number(segment) : segment) as Segment[];
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
    if (first === ')' || first === '(') {
        throw new Error('Unexpected parens when looking for a value');
    }

    return [Number(first), rest];
};

const computeLine = (line: Segment[]): number => {
    line = [...line];

    let openIndex = line.indexOf('(');
    if (openIndex === -1) {
        return computeBasicLine(line as BasicSegment[]);
    }

    let depth = 1;
    let i = openIndex + 1;
    while (depth > 0) {
        if (line[i] === '(') {
            depth++;
        } else if (line[i] === ')') {
            depth--;
        }
        i++;

        if (i > line.length) {
            throw new Error('Unexpected end of line when looking for )');
        }
    }

//    console.log(line);
    const subsection = line.slice(openIndex + 1, i - 1);
//    console.log('snipping out ', subsection);
    const value = computeLine(subsection);

    line.splice(openIndex, i - openIndex, value);
 //   console.log('stitched', line);

    return computeLine(line);
};

const computeBasicLine = (line: BasicSegment[]): number => {
    if (line.length === 0) {
        throw new Error('Unexpected empty segment');
    }

 //   console.log('before', line);
    while (true) {
        const plusIndex = line.indexOf('+');
        if (plusIndex === -1) {
            break;
        }

        const left = line[plusIndex - 1] as number;
        const right = line[plusIndex + 1] as number;
        const value = left + right;
        line.splice(plusIndex - 1, 3, value);
        // do the addition, update "line"
    }
 //   console.log('add done', line);

    while (true) {
        const multIndex = line.indexOf('*');
        if (multIndex === -1) {
            break;
        }

        const left = line[multIndex - 1] as number;
        const right = line[multIndex + 1] as number;
        const value = left * right;
        line.splice(multIndex - 1, 3, value);
        // do the multiplication, update "line"
    }
   // console.log('done', line);

    if (line.length !== 1) {
        throw new Error('Something went wrong computing basic line');
    }
    return line[0] as number;
};

//console.log('result', sum(lines.map(line => computeBasicLine(line as any))));
let s = 0;
lines.forEach(line => {
    const result = computeLine(line);
    console.log(line, result);
    s += result;
});

console.log('total', s);
// low; 694173