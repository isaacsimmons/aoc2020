import { Counter, Grid } from '../utils/array';
import { readInputLines } from '../utils/file';

const inputLines = readInputLines();

type Space = 'floor' | 'empty' | 'occupied';

const parseSpace = (s: string): Space => {
    switch (s) {
        case '.':
            return 'floor';
        case 'L':
            return 'empty';
        case '#':
            return 'occupied';
        default:
            throw new Error('bad char ' + s);
    }
};

const renderSpace = (s: Space): string => {
    switch (s) {
        case 'empty':
            return 'L';
        case 'occupied':
            return '#';
        case 'floor':
            return '.';
        default:
            throw new Error('bad space ' + s);
    }
};

const inputValues = inputLines.map(row => [...row].map(parseSpace));

const isOccupied = (x: number, y: number, dx: number, dy: number, map: Grid<Space>): number => {
    let d = 1;
    while (true) {
        const space = map.get({x: x + dx * d, y: y + dy * d});
        if (space === null || space === 'empty') {
            return 0;
        }
        if (space === 'occupied') {
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
        const neighbors = countAdjacentOccupied(x, y, prev);
        if (value === 'empty' && neighbors === 0) {
            next.set({x, y}, 'occupied');
        } else if (value === 'occupied' && neighbors >= 5) {
            next.set({x, y}, 'empty');
        }
    }
    return next;
};

const countOccupied = (map: Grid<Space>) => {
    const sums = new Counter<Space>();
    sums.addAll([...map.iter()].map(({value}) => value));
    return sums.get('occupied') || 0;
}

const writeGrid = (grid: Grid<Space>) => {
    const rows = grid.to2d();
    rows.forEach(row => console.log(row.map(renderSpace).join('')));
    console.log();
};

let prev = Grid.from2d(inputValues);
let next = iterate(prev);
while (!prev.equals(next)) {
    prev = next;
    next = iterate(prev);
}
console.log(countOccupied(next));
