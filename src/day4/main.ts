import { readInputLines } from '../utils/file';

const inputLines = readInputLines();

interface Passport {
    [key: string]: string;
}

const parse = (lines: string[]): Passport[] => {
    const passports: Passport[] = [];

    let passport: Passport = {};
    let anyData = false;
    for (const line of lines) {
        if (line === '') {
            if (anyData) {
                passports.push(passport);
                anyData = false;
                passport = {};
            }
        } else {
            const fields = line.split(' ');
            fields.forEach(field => {
                const [key, value] = field.split(':'); // TODO: limit?
                passport[key] = value;
                anyData = true;
            });
        }
    }
    if (anyData) {
        passports.push(passport);
    }

    return passports;
}

const requiredFields = ['byr',
    'iyr',
    'eyr',
    'hgt',
    'hcl',
    'ecl',
    'pid',
//    'cid',
];

const rangeCheck = (s: string|undefined, digits: number, min: number, max: number): boolean => {
    if (s === undefined) {
        return false;
    }
    if (s.match(/\d*/) === null) {
        return false;
    }
    if (s.length !== digits) {
        return false;
    }
    const num = Number(s);
    return num >= min && num <= max;
};

const isValid = (passport: Passport) => {

    if (!rangeCheck(passport.byr, 4, 1920, 2002)) {
        console.log('failed byr', passport.byr);
        return false;
    }
    if (!rangeCheck(passport.iyr, 4, 2010, 2020)) {
        console.log('failed iyr', passport.iyr);
        return false;
    }
    if (!rangeCheck(passport.eyr, 4, 2020, 2030)) {
        console.log('failed eyr', passport.eyr);
        return false;
    }
    if (!rangeCheck(passport.pid, 9, 0, 999999999)) {
        console.log('failed pid', passport.pid);
        return false;
    }
    // cid ignored
    if (['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].indexOf(passport.ecl) === -1) {
        console.log('failed eye', passport.ecl);
        return false;
    }
    if (!passport.hcl) {
        console.log('failed hcl 1');
        return false;
    }
    if (!passport.hcl.match(/#[0-9a-f]{6}/)) {
        console.log('failed hcl', passport.hcl);
        return false;
    }
    if (!passport.hgt) {
        console.log('failed hgt 1');
        return false;
    }
    const units = passport.hgt.substr(passport.hgt.length - 2);
    const value = passport.hgt.substr(0, passport.hgt.length - 2);
    console.log('units, value', units, value);
    if (units === 'cm') {
        if (!rangeCheck(value, 3, 150, 193)) {
            return false;
        }
    } else if (units === 'in') {
        if (!rangeCheck(value, 2, 59, 76)) {
            return false;
        }
    } else {
        return false;
    }

    return true;
};

const passports = parse(inputLines);
//console.log('passportssss', passports);
let validCount = 0;
passports.forEach(passport => {
    const valid = isValid(passport);
    if (valid) {
        validCount++;
    }
    console.log(passport, valid);
});
console.log('count', validCount);