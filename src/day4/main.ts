import { readInputLines } from '../utils/file';

const inputLines = readInputLines();

type Passport = Map<string, string>;

const parse = (lines: string[]): Passport[] => {
    const passports: Passport[] = [];

    let passport: Passport = new Map();
    let anyData = false;
    for (const line of lines) {
        if (line === '') {
            if (anyData) {
                passports.push(passport);
                anyData = false;
                passport = new Map();
            }
        } else {
            const fields = line.split(' ');
            fields.forEach(field => {
                const [key, value] = field.split(':'); // TODO: limit?
                passport.set(key, value);
                anyData = true;
            });
        }
    }
    if (anyData) {
        passports.push(passport);
    }

    return passports;
}

interface PassportValidationError {
    field: string;
    value: string|undefined;
    message?: string;
}

const requiredFields = [
    'byr',
    'iyr',
    'eyr',
    'hgt',
    'hcl',
    'ecl',
    'pid',
//    'cid',
];

const validateRange = (field: string, value: string|undefined, min: number, max: number): void => {
    if (value === undefined) {
        throw { field, value };
    }
    if (value.match(/\d*/) === null) {
        throw { field, value, message: 'Non-numeric characters' };
    }
    const num = Number(value);
    if (num < min || num > max) {
        throw { field, value, message: `${num} out of range ${min}-${max}` };
    }
};

const validateEyeColor = (value: string|undefined) => {
    if (['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].indexOf(value || '') === -1) {
        throw {field: 'ecl', value };
    }
};

const validateHairColor = (value: string|undefined) => {
    if (!value) {
        throw {field: 'hcl', value };
    }
    if (!value.match(/^#[0-9a-f]{6}$/)) {
        throw {field: 'hcl', value };
    }
};

const validateHeight = (value: string|undefined) => {
    if (!value || value.length < 3) {
        throw { field: 'hgt', value };
    }
    const unit = value.substr(value.length - 2);
    const qty = value.substr(0, value.length - 2);
    if (unit === 'cm') {
        validateRange('hgt', qty, 150, 193);
    } else if (unit === 'in') {
        validateRange('hgt', qty, 59, 76);
    } else {
        throw {field: 'hgt', value, message: `Invalid units: ${unit}`};
    }
};

const validatePid = (value: string|undefined) => {
    if (!value || !value.match(/^\d{9}$/)) {
        throw {field: 'pid', value};
    }
};

const validate = (passport: Passport): void => {
    validateRange('byr', passport.get('byr'), 1920, 2002);
    validateRange('iyr', passport.get('iyr'), 2010, 2020);
    validateRange('eyr', passport.get('eyr'), 2020, 2030);
    validatePid(passport.get('pid'));
    // cid ignored
    validateEyeColor(passport.get('ecl'));
    validateHairColor(passport.get('hcl'));
    validateHeight(passport.get('hgt'));
};

const writePassport = (passport: Passport) => {
    console.log([...passport.entries()].map(([key, value]) => `${key}:${value}`).join(' '));
    console.log();
};

const passports = parse(inputLines);

let validCount = 0;
passports.forEach(passport => {
    try {
        validate(passport);
        validCount++;
        // writePassport(passport);
    } catch (err: PassportValidationError|unknown) {
        console.log('Error:', err);
    }
});
console.log('count', validCount);