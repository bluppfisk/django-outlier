import { Serialisable } from './serialisable';
import { SourceService } from './source.service';

export class Source implements Serialisable {
	constructor () {}

	public id: number;
	public title: string;
	public author: string;
	public offset: number;
	public file: string;

	static readonly EMPTY_MODEL = {
		id: null,
		title: '',
		author: '',
		offset: null,
		file: ''
	}

	deserialise(input: any): this {
		Object.assign(this, input);
		return this;
	}

	serialise(): any {
		return this.id;
	}
}