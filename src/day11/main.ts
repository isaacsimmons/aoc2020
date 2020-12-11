import { Counter, Grid } from '../utils/array';
import { readInputLines } from '../utils/file';

const inputLines = readInputLines();

const enum Space {
    FLOOR = '.',
    EMPTY = 'L',
    OCCUPIED = '#',
}

const parseSpace = (s: string): Space => {
    switch (s) {
        case '.':
        case 'L':
        case '#':
            return s as Space;
        default:
            throw new Error('bad char ' + s);
    }
};

const isOccupied = (x: number, y: number, dx: number, dy: number, map: Grid<Space>): number => {
    let d = 1;
    while (true) {
        const space = map.get({x: x + dx * d, y: y + dy * d});
        if (space === null || space === Space.EMPTY) {
            return 0;
        }
        if (space === Space.OCCUPIED) {
            return 1;
        }
        d++;
    }
};

const countAdjacentOccupied = (x: number, y: number, map: Grid<Space>): number => {
    return isOccupied(x, y, -1, -1, map) + isOccupied(x, y, -1, 0, map) + isOccupied(x, y, -1, 1, map)
     + isOccupied(x, y, 0, -1, map) + isOccupied(x, y, 0, 1, map)
    + isOccupied(x, y, 1, -1, map) + isOccupied(x, y, 1, 0, map) + isOccupied(x, y, 1, 1, map);
};

const iterate = (prev: Grid<Space>): Grid<Space> => {
    const next = prev.copy();
    for (const {x, y, value} of next.iter()) {
        if (value === Space.FLOOR) {
            // Little optimization -- no need to count adjacent seats for floor spaces
            continue;
        }
        const neighbors = countAdjacentOccupied(x, y, prev);
        if (value === Space.EMPTY && neighbors === 0) {
            next.set({x, y}, Space.OCCUPIED);
        } else if (value === Space.OCCUPIED && neighbors >= 5) {
            next.set({x, y}, Space.EMPTY);
        }
    }
    return next;
};

const countOccupied = (map: Grid<Space>) => {
    const sums = new Counter<Space>();
    sums.addAll([...map.iter()].map(({value}) => value));
    return sums.get(Space.OCCUPIED) || 0;
}

const writeGrid = <T>(grid: Grid<T>, renderer: (value: T) => string) => {
    const rows = grid.to2d();
    rows.forEach(row => console.log(row.map(renderer).join('')));
    console.log();
};

const readGrid = <T>(lines: string[], parser: (s: string) => T): Grid<T> => {
    const values = lines.map(row => [...row].map(parser));
    return Grid.from2d(values);
};

let prev = readGrid(inputLines, parseSpace);
let next = iterate(prev);
while (!prev.equals(next)) {
    prev = next;
    next = iterate(prev);
}
writeGrid(next, value => value);
console.log(countOccupied(next));
