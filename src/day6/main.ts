import { intersection, splitDoubleNewline, sum, union } from '../utils/array';
import { readNewlineSeparatedChunks } from '../utils/file';

const inputChunks = readNewlineSeparatedChunks();
const groups = inputChunks
  .map(answers => answers.map(answer => answer.split('')))
  .map(answers => intersection(...answers));
const result = sum(groups.map(group => group.size));
console.log(result);
