import { Location } from './location';
import { AltChar } from './altchar';

export class Char {
	id: number;
	name: string;
	locations: Location[];
	altChars: AltChar[];
}