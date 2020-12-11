import { combinations, sum, product } from '../utils/array';
import { readInputLines } from '../utils/file';

const lines = readInputLines().map(Number);

for (const set of combinations(lines, 3)) {
    if (sum(set) === 2020) {
        console.log(product(set));
        break;
    }
}
