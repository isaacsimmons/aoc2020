import { readInputLines } from '../utils/file';

const startingNumbers = readInputLines()[0].split(',').map(Number);

const fn = function* fn(): Generator<number, void, void> {
    const lastSeen = new Map<number, number>();
    let turn = 1;
    let lastYield = 0;
    for (const startingNumber of startingNumbers) {
        lastSeen.set(startingNumber, turn);
        turn++;
        lastYield = startingNumber;
        yield lastYield;
    }
    let nextYield = 0;

    while (true) {
        const lastSpoken = lastSeen.get(nextYield);
        yield nextYield;
        lastSeen.set(nextYield, turn);

        if (lastSpoken === undefined) {
            nextYield = 0;
        } else {
            nextYield = turn - lastSpoken;
        }
        turn++;
    }
};

const getNth = <T>(generator: Generator<T, void, void>, n: number): T => {
    for (let i = 0; i < n - 1; i++) {
        const result = generator.next();
        if (result.done) {
            throw new Error('Generator ran out of values');
        }
//        console.log('turn', (i + 1), result.value);
    }
    const result = generator.next();
    if (result.done) {
        throw new Error('Generator ran out of values');
    }
    console.log('turn', n, result.value);
    return result.value;
};


console.log(getNth(fn(), 30000000));
