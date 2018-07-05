import { Source } from './source';
import { AltChar } from './altchar';

export class Char {
	id: number;
	name: string;
	locations: Source[];
	altChars: AltChar[];
}