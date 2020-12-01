import { readInputFile } from '../utils/file';

const inputText = readInputFile(Number(process.env.DAY), process.env.FILE);

const numbers = inputText.split('\n').filter(n => n.length > 0).map(Number);
console.log(numbers);

outer: for (let i = 0; i < numbers.length - 2; i++) {
    if (numbers[i] > 2020) {
        continue;
    }
    for (let j = i + 1; j < numbers.length - 1; j++) {
        if (numbers[i] + numbers[j] > 2020) {
            continue;
        }
        for (let k = j + 1; k < numbers.length; k++) {
            if (numbers[i] + numbers[j] + numbers[k] === 2020) {
                console.log(i, j, k, numbers[i] * numbers[j]* numbers[k]);
                break outer;
            }
            }
    }
}