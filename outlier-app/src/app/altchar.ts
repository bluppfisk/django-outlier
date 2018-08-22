import { Source } from './source';
import { Char } from './char';
import { Serialisable } from './serialisable';

export class AltChar implements Serialisable {
	public id: number;
	public name: string;
	public canonical: Char;
	public sequence_no: number;
	public source: Source;
	public page: number;
	public source_obj: string;
	public image: string;

	static readonly EMPTY_MODEL = {
		id: null,
		name: '',
		canonical: null,
		sequence_no: null,
		source: Object.assign(new Source, Source.EMPTY_MODEL),
		page: null,
		source_obj: '',
		image: ''
	};

	public deserialise(input: any): this {
		Object.assign(this, input);
		this.source = new Source().deserialise(input.source);
		return this;
	};

	public serialise(): any {
		return Object.assign(this, {
			"source": this.source.serialise()
		});
	}
}