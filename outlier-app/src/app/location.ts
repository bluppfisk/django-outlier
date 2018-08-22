import { Source } from './source';
import { Serialisable } from './serialisable';

export class Location implements Serialisable {
	constructor(
	) {}

	public id: number;
	public page: number;
	public source: Source;

	static readonly EMPTY_MODEL = {
		id: null,
		page: null,
		source: Object.assign(new Source(), Source.EMPTY_MODEL)
	}

	public serialise(): any {
		return Object.assign(this, {"source": this.source.serialise()});
	}

	public deserialise(input: any): this {
		Object.assign(this, input);
		this.source = new Source().deserialise(input.source);
		return this;
	}
}