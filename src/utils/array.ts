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

export const splitDoubleNewline = function *splitDoubleNewline(lines: string[]): Generator<string[], void, void> {
    let chunk: string[] = [];
    for (const line of lines) {
        if (line === '') {
            if (chunk.length) {
                yield chunk;
                chunk = [];
            }
        } else {
            chunk.push(line);
        }
    }
    if (chunk.length) {
        yield chunk;
    }
};

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
