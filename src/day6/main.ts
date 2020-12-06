import { intersection, splitDoubleNewline, sum, union } from '../utils/array';
import { readInputLines } from '../utils/file';

const inputLines = readInputLines();
const groups = [...splitDoubleNewline(inputLines)]
  .map(answers => answers.map(answer => answer.split('')))
  .map(answers => intersection(...answers));
const result = sum(groups.map(group => group.size));
console.log(result);
