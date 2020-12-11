import { readInputLines } from '../utils/file';

const inputLines = readInputLines();

type Space = 'floor' | 'empty' | 'occupied';

const parse = (s: string): Space => {
    switch (s) {
        case '.':
            return 'floor';
        case 'L':
            return 'empty';
        case '#':
            return 'occupied';
        default:
            throw new Error('bad char' + s);
    }
}

const parseRow = (s: string): Space[] => {
    return [...s].map(parse);
};

const map = inputLines.map(parseRow);


const isOccupied2 = (x: number, y: number, map: Space[][]): Space | null => {
    if (y < 0 || x < 0 || y >= map.length || x >= map[0].length) {
        return null;
    }
    return map[y][x];
};

const isOccupied = (x: number, y: number, dx: number, dy: number, map: Space[][]): number => {
    let d = 1;
    while (true) {
        const space = isOccupied2(x + dx * d, y + dy * d, map);
        if (space === null || space === 'empty') {
            return 0;
        }
        if (space === 'occupied') {
            return 1;
        }
        d++;
    }
};

const countAdjacentOccupied = (x: number, y: number, map: Space[][]): number => {
    return isOccupied(x, y, -1, -1, map) + isOccupied(x, y, -1, 0, map) + isOccupied(x, y, -1, 1, map)
     + isOccupied(x, y, 0, -1, map) + isOccupied(x, y, 0, 1, map)
    + isOccupied(x, y, 1, -1, map) + isOccupied(x, y, 1, 0, map) + isOccupied(x, y, 1, 1, map);
};

const iterate = (prev: Space[][]): Space[][] => {
    const next: Space[][] = [];
    for (let y = 0; y < prev.length; y++) {
        next[y] = [];
        for (let x = 0; x < prev[y].length; x++) {
            const space = prev[y][x];
            const neighbors = countAdjacentOccupied(x, y, prev);
            if (space === 'floor') {
                next[y][x] = 'floor';
            } else if (space === 'empty' && neighbors === 0) {
                next[y][x] = 'occupied';
            } else if (space === 'occupied' && neighbors >= 5) {
                next[y][x] = 'empty';
            } else {
                next[y][x] = space;
            }
        }
    }
    return next;
};

const mapEquals = (map1: Space[][], map2: Space[][]): boolean => {
    if (map1.length !== map2.length) {
        return false;
    }
    for (let y = 0; y < map1.length; y++) {
        if (map1[y].length !== map2[y].length) {
            return false;
        }
        for (let x = 0; x < map1[y].length; x++) {
            if (map1[y][x] !== map2[y][x]) {
                return false;
            }
        }
    }
    return true;
};


const countOccupied = (map: Space[][]) => {
    let sum = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            sum += isOccupied2(x, y, map) === 'occupied' ? 1 : 0;
        }
    }
    return sum;
}

let prev = map;
let next = iterate(prev);
while (!mapEquals(prev, next)) {
    prev = next;
    next = iterate(prev);
}
console.log(next, countOccupied(next));