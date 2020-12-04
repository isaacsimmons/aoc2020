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

interface Coords {
    x: number;
    y: number;
}

const countTrees = (step: Coords) => {
    const position: Coords = { x: 0, y: 0 };
    let trees = 0;
    while (position.y < map.height) {
        if (isTree(map, position)) {
            trees++;
        }
        position.x += step.x;
        position.y += step.y;
    }
    return trees;
};

const isTree = (m: Map, pos: Coords) => {
    return map.trees[pos.y][pos.x % map.width];
};

const steps: Coords[] = [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 5, y: 1 },
    { x: 7, y: 1 },
    { x: 1, y: 2 },
];

let product = 1;
steps.forEach(step => {
    const trees = countTrees(step);
    console.log(step, trees);
    product *= trees;
});
console.log(product);