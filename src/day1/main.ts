import { readInputFile } from '../utils/file';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);

const numbers = inputText.split('\n').filter(n => n.length > 0).map(Number);
console.log(numbers);

outer: for (let i = 0; i < numbers.length - 1; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
        if (numbers[i] + numbers[j] === 2020) {
            console.log(i, j, numbers[i] * numbers[j]);
            break outer;
        }
    }
}