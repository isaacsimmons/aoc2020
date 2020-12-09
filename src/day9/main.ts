import { permutations, sum } from '../utils/array';
import { readInputLines } from '../utils/file';

const xmas = readInputLines().map(Number);
const windowSize = 25;

const window = xmas.slice(0, windowSize);
const body = xmas.slice(windowSize);

const isValid = (n: number, window: number[]) => {
    // TODO: kinda super wasteful to recalculate all permutations from scratch every time
    for (const [x, y] of permutations(window, 2)) {
        if (x + y === n) {
            return true;
        }
    }
    return false;
}

const findInvalid = () => {
    while (body.length) {
        const num = body.shift()!;
        if (!isValid(num, window)) {
            return num;
        }
        window.shift();
        window.push(num);
    }
    throw new Error('No invalid number found');
};

const findRange = (num: number) => {
    for(let start = 0; start < xmas.length - 1; start++) {
        for(let end = start + 1; end < xmas.length; end++) {
            const nums = xmas.slice(start, end);
            const total = sum(nums);
            if (total === num) {
                return nums;
            }
            if (total > num) {
                break;
            }
        }
    }
    throw new Error('range not found');
};

const invalid = findInvalid();
console.log('invalid number', invalid);

const range = findRange(invalid);
const weakness = Math.min(...range) + Math.max(...range);
console.log(weakness);
