import { Coordinate, Counter, Grid, sum } from '../utils/array';
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

const isOccupied = ({x, y}: Coordinate, dx: number, dy: number, map: Grid<Space>): boolean => {
    while (true) {
        x += dx;
        y += dy;
        const space = map.get({x, y});
        if (space === null || space === Space.EMPTY) {
            return false;
        }
        if (space === Space.OCCUPIED) {
            return true;
        }
    }
};

const countVisibleOccupied = (c: Coordinate, map: Grid<Space>): number => {
    const headings = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    const occupied = headings.map(([dx, dy]) => isOccupied(c, dx, dy, map));
    return sum(occupied.map(val => val ? 1 : 0));
};

const iterate = (prev: Grid<Space>): Grid<Space> => {
    const next = prev.copy();
    for (const {x, y, value} of next.iter()) {
        if (value === Space.FLOOR) {
            // Little optimization -- no need to count adjacent seats for floor spaces
            continue;
        }
        const neighbors = countVisibleOccupied({x, y}, prev);
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

const iterateUntilDone = (map: Grid<Space>) => {
    let prev = map.copy();
    let next = iterate(prev);
    while (!prev.equals(next)) {
        prev = next;
        next = iterate(prev);
    }
    return next;
};

const inputMap = readGrid(inputLines, parseSpace);
const finalMap = iterateUntilDone(inputMap);
//writeGrid(finalMap, value => value);
console.log(countOccupied(finalMap));
