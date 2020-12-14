import { Coordinate } from '../utils/array';
import { readInputLines } from '../utils/file';

const inputLines = readInputLines();

interface Position {
    waypoint: Coordinate;
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

const turn = (waypoint: Coordinate, command: 'L' | 'R', amount: number): Coordinate => {
    if (amount === 0) {
        return waypoint;
    }
    if (amount < 0) {
        throw new Error('negative turns not supported');
    }
    if (amount % 90 !== 0) {
        throw new Error('non-right-angle turns not supported');
    }
    const times = amount / 90;
    let result = waypoint;
    for (let i = 0; i < times; i++) {
        result = turn90(result, command);
    }
    return result;
};

const turn90 = (waypoint: Coordinate, command: 'L' | 'R'): Coordinate => {
    if (command === 'L') { // Bleh, my coorinate system is effed up
        return {
            x: waypoint.y,
            y: waypoint.x * -1,
        };
    } else {
        return {
            x: waypoint.y * -1,
            y: waypoint.x,
        };
    }
};

const adjustWaypoint = ({x, y}: Coordinate, direction: Direction, distance: number): Coordinate => {
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

const moveToWaypoint = ({location, waypoint}: Position, distance: number): Coordinate => {
    return {
        x: location.x + waypoint.x * distance,
        y: location.y + waypoint.y * distance,
    };
};


const move = ({waypoint, location}: Position, instruction: Instruction): Position => {
    switch (instruction.command) {
        case 'S':
        case 'N':
        case 'E':
        case 'W':
            return {
                waypoint: adjustWaypoint(waypoint, instruction.command, instruction.value), // TODO: that should just take instruction
                location,
            };
        case 'F':
            return {
                waypoint,
                location: moveToWaypoint({location, waypoint}, instruction.value),
            };
        case 'L':
        case 'R':
            return {
                waypoint: turn(waypoint, instruction.command, instruction.value),
                location,
            };
    }
};

const instructions = inputLines.map(parseInstruction);
const initialPosition: Position = {
    location: {x: 0, y: 0},
    waypoint: { x: 10, y: -1},
};

let position = initialPosition;
instructions.forEach(instruction => {
    console.log('moving', position);
    position = move(position, instruction);
});
console.log('done', position);
console.log('mhtn', Math.abs(position.location.x) + Math.abs(position.location.y));
//2301 too high
