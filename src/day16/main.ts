import { sum, truthy } from '../utils/array';
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

const findInvalid = (ticket: Ticket, ranges: Ranges): number[] => {
    return ticket.filter(value => !isValidAny(value, [...ranges.values()]));
};

// console.log(ranges, ownTicket, otherTickets);

const invalids = otherTickets.flatMap(otherTicket => findInvalid(otherTicket, ranges));
console.log(invalids);
console.log(sum(invalids));