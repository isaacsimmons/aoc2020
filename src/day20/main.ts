import { readNewlineSeparatedChunks } from '../utils/file';
import { Counter, product } from '../utils/array';

interface Tile {
    id: number;
    edges: Set<number>;
}

const convertEdge = (s: string): number => {
    const binaryString = s.replaceAll('.', '0').replaceAll('#', '1');
    const binaryStringReverse = [...binaryString].reverse().join('');
    const n1 = parseInt(binaryString, 2);
    const n2 = parseInt(binaryStringReverse, 2);
    return Math.min(n1, n2);
};

const readTile = ([header, ...lines]: string[]): Tile => {
    if (header.substring(0, 5) !== 'Tile ') {
        throw new Error('Missing tile header');
    }
    const id = Number(header.substring(5, header.length - 1));

    const edges = new Set<number>();
    edges.add(convertEdge(lines[0]));
    edges.add(convertEdge(lines[lines.length - 1]));
    edges.add(convertEdge(lines.map(line => line[0]).join('')));
    edges.add(convertEdge(lines.map(line => line[line.length - 1]).join('')));

    return {id, edges};
};

const tiles = readNewlineSeparatedChunks().map(readTile);
//console.log(tiles);
const edgeCounts = new Counter<number>();
tiles.forEach(tile => {edgeCounts.addAll([...tile.edges])});

console.log(edgeCounts);

const uniqueTiles = tiles.filter(tile => [...tile.edges].filter(edge => edgeCounts.get(edge) === 1).length > 1);
console.log(uniqueTiles);
if (uniqueTiles.length !== 4) {
    console.log('bad news bro', uniqueTiles);
    throw new Error('bad news bro');
}
console.log('result', product(uniqueTiles.map(tile => tile.id)));

