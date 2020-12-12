import { Coordinate } from '../utils/array';
import { readInputLines } from '../utils/file';

const inputLines = readInputLines();

interface Position {
    heading: Direction;
    location: Coordinate;
}

type Direction = 'N' | 'S' | 'E' | 'W';
type Command = Direction | 'R' | 'L' | 'F';

interface Instruction {
    command: Command;
    value: number;
}

const parseCommand = (s: string): Command => {
    switch (s) {
        case 'N':
        case 'S':
        case 'E':
        case 'W':
        case 'R':
        case 'L':
        case 'F':
            return s;
        default:
            throw new Error('invalid command ' + s);
    }
};

const parseInstruction = (s: string): Instruction => {
    const first = s.substring(0, 1);
    const rest = s.substring(1);
    return {
        command: parseCommand(first),
        value: Number(rest),
    };
};

const turn = (heading: Direction, command: 'L' | 'R', amount: number): Direction => {
    if (amount === 0) {
        return heading;
    }
    if (amount < 0) {
        throw new Error('negative turns not supported');
    }
    if (amount % 90 !== 0) {
        throw new Error('non-right-angle turns not supported');
    }
    const times = amount / 90;
    let result = heading;
    for (let i = 0; i < times; i++) {
        result = turn90(result, command);
    }
    return result;
};

const turn90 = (heading: Direction, command: 'L' | 'R'): Direction => {
    if (heading === 'N' && command === 'R') {
        return 'E';
    }
    if (heading === 'N' && command === 'L') {
        return 'W';
    }
    if (heading === 'E' && command === 'R') {
        return 'S';
    }
    if (heading === 'E' && command === 'L') {
        return 'N';
    }
    if (heading === 'S' && command === 'R') {
        return 'W';
    }
    if (heading === 'S' && command === 'L') {
        return 'E';
    }
    if (heading === 'W' && command === 'R') {
        return 'N';
    }
    if (heading === 'W' && command === 'L') {
        return 'S';
    }
    throw new Error('missed a case?');
};

const moveHeading = ({x, y}: Coordinate, direction: Direction, distance: number): Coordinate => {
    switch (direction) {
        case 'E':
            return {
                x: x + distance,
                y,
            };
        case 'W':
            return {
                x: x - distance,
                y,
            };
        case 'S':
            return {
                x,
                y: y + distance,
            };
        case 'N':
            return {
                x,
                y: y - distance,
            };
        default:
            throw new Error('bad direction');
    }
};


const move = ({heading, location}: Position, instruction: Instruction): Position => {
    switch (instruction.command) {
        case 'S':
        case 'N':
        case 'E':
        case 'W':
            return {
                heading,
                location: moveHeading(location, instruction.command, instruction.value),
            };
        case 'F':
            return {
                heading,
                location: moveHeading(location, heading, instruction.value),
            };
        case 'L':
        case 'R':
            return {
                heading: turn(heading, instruction.command, instruction.value),
                location,
            };
    }
};

const instructions = inputLines.map(parseInstruction);
const initialPosition: Position = {
    location: {x: 0, y: 0},
    heading: 'E',
};

let position = initialPosition;
instructions.forEach(instruction => {
    position = move(position, instruction);
});
console.log('done', position);
console.log('mhtn', Math.abs(position.location.x) + Math.abs(position.location.y));
//2301 too high
