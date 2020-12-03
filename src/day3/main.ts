import { readInputLines } from '../utils/file';

const inputLines = readInputLines();

interface Map {
    trees: boolean[][];
    width: number;
    height: number;
}

const parseRow = (row: string): boolean[] => {
    return [...row].map(char => char === '#');
}

const readMap = (lines: string[]): Map => {
    const trees = lines.map(parseRow);
    return {
        trees,
        width: trees[0].length,
        height: trees.length,
    };
};

const map = readMap(inputLines);
//console.log(map);

interface Coords {
    x: number;
    y: number;
}

const step: Coords = { x: 3, y: 1 };
const position: Coords = { x: 0, y: 0 };

const isTree = (m: Map, pos: Coords) => {
    return map.trees[pos.y][pos.x % map.width];
};

let trees = 0;
while (position.y < map.height) {
    if (isTree(map, position)) {
        console.log('tree at', position);
        trees++;
    }
    position.x += step.x;
    position.y += step.y;
}
console.log('trees: ', trees);