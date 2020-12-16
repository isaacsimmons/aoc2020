import { product, sum, truthy } from '../utils/array';
import { readNewlineSeparatedChunks } from '../utils/file';

const [rangesString, myTicketString, otherTicketStrings] = readNewlineSeparatedChunks();

type Ticket = number[];
interface Range {
    min1: number;
    max1: number;
    min2: number;
    max2: number;
}
type Ranges = Map<string, Range>;

const parseRange = (s: string): {fieldName: string, range: Range} => {
    const [fieldName, rest] = s.split(': ');
    const [range1, range2] = rest.split(' or ');
    const [min1, max1] = range1.split('-').map(Number);
    const [min2, max2] = range2.split('-').map(Number); 
    return {fieldName, range: {min1, max1, min2, max2}};
};

const parseRanges = (lines: string[]): Ranges => {
    const ranges = new Map<string, Range>();
    lines.forEach(line => {
        const {fieldName, range} = parseRange(line);
        ranges.set(fieldName, range);
    });

    return ranges;
};

const parseMyTicket = (lines: string[]): Ticket => {
    const [header, ticketLine] = lines;
    if (header !== 'your ticket:') {
        throw new Error('wrong own ticket header');
    }
    return ticketLine.split(',').map(Number);
};

const parseOtherTickets = (lines: string[]): Ticket[] => {
    const [header, ...ticketLines] = lines;
    if (header !== 'nearby tickets:') {
        throw new Error('wrong nearby ticket header');
    }
    return ticketLines.map(ticketLine => ticketLine.split(',').map(Number));
};

const ranges = parseRanges(rangesString);
const ownTicket= parseMyTicket(myTicketString);
const otherTickets = parseOtherTickets(otherTicketStrings);

const isValid = (value: number, {min1, max1, min2, max2}: Range) => 
    (value >= min1 && value <= max1) || (value >= min2 && value <= max2);

const isValidAny = (value: number, ranges: Range[]): boolean => 
    ranges.some(range => isValid(value, range));

const findInvalidValues = (ticket: Ticket, ranges: Ranges): number[] => {
    return ticket.filter(value => !isValidAny(value, [...ranges.values()]));
};

const isTicketInvalid = (ticket: Ticket, ranges: Ranges): boolean => {
    return findInvalidValues(ticket, ranges).length === 0;
};

// console.log(ranges, ownTicket, otherTickets);

const allTickets = [ownTicket, ...otherTickets];
const allValidTickets = allTickets.filter(ticket => isTicketInvalid(ticket, ranges));

const possibleLabels: Set<string>[] = [];
for (let idx = 0; idx < ownTicket.length; idx++) {
    const possible = new Set<string>();
    for (const [key, range] of ranges.entries()) {
        const valuesToCheck = allValidTickets.map(ticket => ticket[idx]);
        const isPossible = valuesToCheck.every(value => isValid(value, range));
        // console.log(valuesToCheck, 'is', isPossible, 'for', range, '(', key, ')');
        if (isPossible) {
            possible.add(key);
        }
    }
    possibleLabels[idx] = possible;
}

const invalidValues = otherTickets.flatMap(otherTicket => findInvalidValues(otherTicket, ranges));
console.log('got', invalidValues.length, 'invalid values for a scanning error rate of', sum(invalidValues));

console.log(possibleLabels);


const reduceLabels = (possible: Set<string>[]): string[] => {
    const solution: Array<string|null> = possible.map(labels => null);
    let n = 0;
    while (true) {
        let stuck = true;

        for (let idx = 0; idx < possible.length; idx++) {
            if (solution[idx] !== null) {
                continue;
            }

            if (possible[idx].size === 1) {
                stuck = false;
                const label = possible[idx].values().next().value as string;
                solution[idx] = label;
                n++;
                possible.forEach(p => p.delete(label));
            }
        }

        if (stuck) {
            throw new Error('stuck');
        }

        if (n === solution.length) {
            return solution as string[];
        }
    }
};

const labelAssignments = reduceLabels(possibleLabels);
console.log(labelAssignments);

const solution = product(labelAssignments.map((labelAssignment, idx) => {
    if (labelAssignment.substring(0, 9) !== 'departure') {
        return 1; // 1 to basically "skip" the value in the product
    }
    return ownTicket[idx];
}));

console.log(solution);