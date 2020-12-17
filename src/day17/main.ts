import { sum } from '../utils/array';
import { readInputLines } from '../utils/file';

const inputLines = readInputLines();

interface Point {
    x: number;
    y: number;
    z: number;
}

const pointToString = ({x, y, z}: Point) => [x, y, z].join('_');
const stringToPoint = (s: string) => {
    const [x, y, z] = s.split('_').map(Number);
    return {x, y, z};
};

// const neighbors = ({x, y, z}: Point): Point[] => {
//     const points: Point[] = [];
//     for (let dx = -1; dx >= 1; dx++) {
//         for (let dy = -1; dy >= 1; dy++) {
//             for (let dz = -1; dz >= 1; dz++) {
//                 if (dx !== 0 || dy !== 0 || dz !== 0) {
//                     points.push({x: x + dx, y: y + dy, z: z + dz});
//                 }
//             }       
//         }    
//     }
//     return points;
// };

const minus1 = ({x, y, z}: Point): Point => ({x: x - 1, y: y - 1, z: z - 1});
const plus1 = ({x, y, z}: Point): Point => ({x: x + 1, y: y + 1, z: z + 1});

const neighbors = function *neighbors(p: Point): Generator<Point, void, void> {
    yield *pointsInRange(minus1(p), plus1(p), p);
};

const pointsInRange = function *pointsInRange(
    {x: minX, y: minY, z: minZ}: Point,
    {x: maxX, y: maxY, z: maxZ}: Point,
    exclude?: Point
): Generator<Point, void, void> {
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                if (!exclude || x !== exclude.x || y !== exclude.y || z !== exclude.z) {
                    yield {x, y, z};
                }
            }       
        }    
    }
};

const combine = (fn: (...values: number[]) => number, ...points: Point[]): Point => ({
    x: fn(...points.map(value => value.x)),
    y: fn(...points.map(value => value.y)),
    z: fn(...points.map(value => value.z)),
});

class Space {
    public readonly active = new Set<string>();

    public min: Point = {x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER, z: Number.MAX_SAFE_INTEGER};
    public max: Point = {x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER, z: Number.MIN_SAFE_INTEGER};
    
    public add = (point: Point) => {
        this.min = combine(Math.min, point, this.min);
        this.max = combine(Math.max, point, this.max);
        this.active.add(pointToString(point));
    }

    public isActive = (point: Point) => 
        this.active.has(pointToString(point));

    public countActiveNeighbors = (point: Point) =>
        sum([...neighbors(point)].map(n => this.isActive(n) ? 1 : 0));
}

const inputSlice = inputLines.map(line => [...line].map(char => char === '#'));
console.log(inputSlice);

const sliceToSpace = (slice: boolean[][]): Space => {
    const space = new Space();

    for (let y = 0; y < slice.length; y++) {
        for (let x = 0; x < slice[y].length; x++) {
            if (slice[y][x]) {
                space.add({x, y, z: 0});
            }
        }
    }

    return space;
};

const iterate = (prev: Space): Space => {
    const next = new Space();

    for (const coordinate of pointsInRange(minus1(prev.min), plus1(prev.max))) {
        const n = prev.countActiveNeighbors(coordinate);
        const prevActive = prev.isActive(coordinate);
//        console.log('checking', coordinate, 'prev', prevActive, 'n', n);
        if (n === 3) {
            next.add(coordinate);
        } else if (n === 2 && prevActive) {
            next.add(coordinate);
        }
    }

    return next;
};

const c0 = sliceToSpace(inputSlice);
console.log('step 0', c0);
const c1 = iterate(c0);
console.log('step 1', c1);
const c2 = iterate(c1);
console.log('step 2', c2);
const c3 = iterate(c2);
const c4 = iterate(c3);
const c5 = iterate(c4);
const c6 = iterate(c5);
console.log('n6', c6.active.size);
