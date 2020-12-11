import { readInputLines } from '../utils/file';

const adapters = readInputLines().map(Number);
adapters.push(0);
adapters.sort((a, b) => a - b); // wtf JS, why do numbers default to a lexigraphical sort?

const counts = [1];
for (let i = 1; i < adapters.length; i++) {
    let n = 0;
    for (let j = Math.max(0, i - 3); j < i; j++) {
        if (adapters[i] - adapters[j] <= 3) {
            n += counts[j];
        }
    }
    counts.push(n);
}

console.log('result:', counts[counts.length - 1]);
