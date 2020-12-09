import { truthy } from '../utils/array';
import { readInputLines } from '../utils/file';

const inputLines = readInputLines();

interface Rule {
    color: string;
    contents: Contents[];
}

interface Contents {
    color: string;
    quantity: number;
}

const contents = new Map<string, Map<string, number>>();
const containedIn = new Map<string, Map<string, number>>();
const leaves = new Set<string>();

const saveEntry = (map: Map<string, Map<string, number>>, key1: string, key2: string, value: number) => {
    let inner: Map<string, number>|undefined = map.get(key1);
    if (!inner) {
        inner = new Map<string, number>();
        map.set(key1, inner);
    }
    if (inner.has(key2)) {
        throw new Error(`Duplicate key: ${key1} ${key2}`);
    }
    inner.set(key2, value);
};

const parseContent = (s: string): Contents => {
    const firstSpace = s.indexOf(' ');
    const lastSpace = s.lastIndexOf(' ');
    const quantity = s.substr(0, firstSpace);
    const color = s.substr(firstSpace + 1, lastSpace - firstSpace - 1);
    const bags = s.substr(lastSpace + 1);
    if (bags !== 'bag' && bags !== 'bags') {
        throw new Error('must end with bag');
    }
    return {quantity: Number(quantity), color};
};

const parseLine = (s: string): Rule => {
    const [color, right] = s.split(' bags contain ');
    if (right === 'no other bags.') {
        leaves.add(color);
        return { color, contents: []};
    }
    if (right[right.length - 1] !== '.') {
        throw new Error('no period');
    }
    const pieces = right.substr(0, right.length - 1).split(', ');
    return { color, contents: pieces.map(parseContent)};
};

inputLines.forEach(line => {
    const rule = parseLine(line);
    rule.contents.forEach(({color, quantity}) => {
        saveEntry(contents, rule.color, color, quantity);
        saveEntry(containedIn, color, rule.color, quantity);
    });
});

//console.log(contents);

const result = new Set<string>();
const active = new Set(['shiny gold']);

const check = () => {
    const color = active.values().next().value;
    active.delete(color);
    if (!containedIn.has(color)) {
        return;
    }
    const newColors = [...containedIn.get(color)!.keys()];
    newColors.forEach(newColor => {
        if (!result.has(newColor)) {
            result.add(newColor);
            active.add(newColor);
        }
    });
};

while (active.size > 0) {
    check();
}

// console.log(result);
// console.log(result.size);
// console.log(leaves);

const totalBags = new Map<string, number>([...leaves].map(color => [color, 0]));
// console.log(totalBags);

outer: while (contents.size) {
    mid: for (const [color, bags] of contents.entries()) {
        let numWithin = 0;
        for (const [bagColor, bagQty] of bags) {
            const n = totalBags.get(bagColor);
            if (n === undefined) {
                continue mid;
            }
            numWithin += (1 + n) * bagQty;
        }
        if (color === 'shiny gold') {
            console.log('all done', numWithin);
            break outer;
        }
        totalBags.set(color, numWithin);
        contents.delete(color);
    }
}

//console.log(totalBags);
