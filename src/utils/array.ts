export const permute = <T>(input: T[]) => {
    const result: T[][] = [];
  
    const p = (arr: T[], m: T[] = []) => {
      if (arr.length === 0) {
        result.push(m);
      } else {
        for (let i = 0; i < arr.length; i++) {
          const curr = arr.slice();
          const next = curr.splice(i, 1);
          p(curr.slice(), m.concat(next));
       }
     }
   }
  
   p(input);
   return result;
};

const c = function *c<T>(rest: T[], choose: number, prefix: T[] = []): Generator<T[], void, void> {
    //    loop over the items in "rest", pluck out each one in turn
    //    add it to prefix, snip it out of rest, recurse with choose -= 1
        for (let i = 0; i < rest.length + 1 - choose; i++) {
            const newPrefix = [...prefix, rest[i]];
            if (choose === 1) {
                yield newPrefix;
            } else {
                const newRest = rest.slice(i + 1);
                yield *c(newRest, choose - 1, newPrefix);
            }
        }
    };
    
export const combinations = function *combinations<T>(arr: T[], choose: number): Generator<T[], void, void> {
    if (choose < 0) {
        throw new Error('Choose must be a positive value');
    }
    if (choose === 0) {
        return;
    }
    if (choose > arr.length) {
        throw new Error('Choose cannot be larger than the number of elements');
    }

    yield* c(arr, choose);
};
    
const p = function *c<T>(rest: T[], choose: number, prefix: T[] = []): Generator<T[], void, void> {
    //    loop over the items in "rest", pluck out each one in turn
    //    add it to prefix, snip it out of rest, recurse with choose -= 1
    for (let i = 0; i < rest.length; i++) {
        const newPrefix = [...prefix, rest[i]];
        if (choose === 1) {
            yield newPrefix;
        } else {
            const newRest = [...rest];
            newRest.splice(i, 1);
            yield *c(newRest, choose - 1, newPrefix);
        }
    }
};

export const permutations = function *combinations<T>(arr: T[], choose: number): Generator<T[], void, void> {
    if (choose < 0) {
        throw new Error('Choose must be a positive value');
    }
    if (choose === 0) {
        return;
    }
    if (choose > arr.length) {
        throw new Error('Choose cannot be larger than the number of elements');
    }

    yield* p(arr, choose);
};
        
export const chunk = <T>(arr: T[], size: number) => {
    if (arr.length % size !== 0) {
        throw new Error(`Attempted to chunk array of size ${arr.length} into chunks of size ${size}`)
    }

    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
};

export const range = (n: number, stop: number|undefined = undefined, step: number = 1) => {
    return [...xrange(n, stop, step)];
};

export const xrange = function *xrange(n: number, stop: number|undefined = undefined, step: number = 1) {
    let start = n;
    if (stop === undefined) {
        // Shuffle the params about if no stop argument was specified
        stop = start;
        start = 0;
    }

    while (start < stop) {
        yield start;
        start += step;
    }
};

export const countMatching = <T>(arr: T[], search: T) => {
    return arr.filter(n => n === search).length;
};

export const maxIndex = <T>(arr: T[]) => {
    if (arr.length === 0) {
        throw new Error('Tried to find index of max element of zero-element array');
    }

    let maxVal = arr[0];
    let result = 0;
    for (let i = 2; i < arr.length; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
            result = i;
        }
    }
    return result;
};

export const minIndex = <T>(arr: T[]) => {
    if (arr.length === 0) {
        throw new Error('Tried to find index of min element of zero-element array');
    }

    let minVal = arr[0];
    let result = 0;
    for (let i = 2; i < arr.length; i++) {
        if (arr[i] < minVal) {
            minVal = arr[i];
            result = i;
        }
    }
    return result;
};

export const equals = <T>(arr1: T[], arr2: T[]) => arr1.length == arr2.length && arr1.every((val,idx) => val === arr2[idx]);

export const sum = (arr: number[]) => arr.reduce((a,b) => a + b, 0);
export const product = (arr: number[]) => arr.reduce((a, b) => a * b, 1);

export const truthy = (val: any) => !!val;

export type Collection<T> = Set<T> | Array<T>;

const isSet = <T>(c: Collection<T>): c is Set<T> => c.constructor.name === 'Set';
const toSet = <T>(c: Collection<T>): Set<T> => isSet(c) ? c : new Set(c);
const toArray = <T>(c: Collection<T>): Array<T> => isSet(c) ? [...c] : c;

export const union = <T>(...collections: Collection<T>[]): Set<T> => {
    const arrays = collections.map(toArray);
    const joined = ([] as T[]).concat(...arrays);
    return new Set(joined);
};

export const intersection = <T>(...collections: Collection<T>[]): Set<T> => {
    const [firstColl, ...restColl] = collections;
    const first = toArray(firstColl);
    const rest = restColl.map(toSet);
    return new Set(first.filter(item => rest.every(set => set.has(item))));
};

export const subtract = <T>(collection: Collection<T>, ...others: Collection<T>[]): Set<T> => {
    const remainder = new Set(toSet(collection));
    others.forEach(other => other.forEach((item: T) => remainder.delete(item)));
    return remainder;
};

export class Counter<T> extends Map<T, number> {
    increment(key: T, num: number = 1) {
        const oldValue = this.get(key) || 0;
        this.set(key, oldValue + num);
    }

    addAll(keys: T[], num: number = 1) {
        keys.forEach(key => this.increment(key, num));
    }
}

export interface Coordinate {
    x: number;
    y: number;
}

export class Grid<T> {
    private constructor(public readonly width: number, public readonly height: number, public readonly values: T[]) {
        if (values.length !== width * height) {
            throw new Error('Invalid initial grid data');
        }
    }

    private getOffset({x, y}: Coordinate): number | null {
        if (y < 0 || x < 0 || y >= this.height || x >= this.width) {
            return null;
        }
        return y * this.width + x;
    }

    public get(c: Coordinate): T | null {
        const offset = this.getOffset(c);
        if (offset === null) {
            return null;
        }
        return this.values[offset];
    }

    public set(c: Coordinate, value: T) {
        const offset = this.getOffset(c);
        if (offset === null) {
            throw new Error(`tried to set value out of bounds (${c.x}, ${c.y})`);
        }
        this.values[offset] = value;
    }

    public *iter(): Generator<Coordinate & {value: T}, void, void> {
        for (let y = 0; y < this.height; y++) {                
            for (let x = 0; x < this.width; x++) {
                const offset = this.getOffset({x, y})!;
                yield {x, y, value: this.values[offset]};
            }
        }
    }

    public copy(): Grid<T> {
        return new Grid(this.width, this.height, [...this.values]);
    }

    public to2d(): T[][] {
        return chunk(this.values, this.width)
    } 

    public static from2d<T>(values: T[][]): Grid<T> {
        const height = values.length;
        const width = height > 0 ? values[0].length : 0;
        // TODO: check that the width of every row is the same?
        const merged = ([] as T[]).concat(...values);
        return new Grid(width, height, merged);
    }

    public equals(other: Grid<T>) {
        return equals(this.values, other.values);
    }
}
