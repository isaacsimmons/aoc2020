import { combinations } from '../utils/array';
import { readInputFile } from '../utils/file';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);

const numbers = inputText.split('\n').filter(n => n.length > 0).map(Number);

const c = combinations(numbers, 3);
for (const combination of c) {
    const sum = combination.reduce((a, b) => a+b, 0);
    if (sum === 2020) {
        const product = combination.reduce((a, b) => a * b, 1);
        console.log(product);
        break;
    }
}
