import { exit } from 'process';
import { truthy } from '../utils/array';
import { readInputLines } from '../utils/file';

const line2 = readInputLines()[1];
const busses: Bus[] = line2.split(',')
  .map((value, idx): Bus|null => {return (value === 'x' ? null : {value: Number(value), idx});})
  .filter(truthy) as Bus[]; //FIXME: truthy filter
// const busses: Bus[] = [
//     { value: 7, idx: 0 },
//     { value: 13, idx: 3 },
//     { value: 5, idx: 4 },    
// ];

interface Bus {
    value: number;
    idx: number;
}

const validWait = (startTime: number, bus: Bus) => {
    const wait = (bus.value - (startTime % bus.value)) % bus.value;
 //   console.log('checking offset', bus, 'wait', wait);
    return wait === bus.idx;
};

const allValid = (startTime: number) => {
    const isValid = busses.every(bus => validWait(startTime, bus));
    return isValid;
};

interface Solution {
    multiple: number;
    offset: number;
}


const calculateDelay = (t: number, {value}: Bus) => (value - (t % value)) % value;

const combine = (solution: Solution, bus: Bus): Solution => {
    let t = solution.offset;
    let first: number | null = null;
    const targetDelay = bus.idx % bus.value;
    while (true) {
        const delay = calculateDelay(t, bus);
        if (delay === targetDelay) {
            if (first === null) {
                first = t;
            } else {
                return {
                    offset: first,
                    multiple: t - first,
                };
            }
        }
        t += solution.multiple;
    }
};

let solution = {
    multiple: busses[0].value,
    offset: busses[0].idx,
};

for (let n = 1; n < busses.length; n++) {
    solution = combine(solution, busses[n]);
    console.log(solution);
}

console.log('done', solution.offset);
