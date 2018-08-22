import { Location } from './location';
import { AltChar } from './altchar';
import { Serialisable } from './serialisable';


export class Char implements Serialisable {
	constructor (
	) {}
	public id: number;
	public name: string;
	public locations: Location[];
	public altchars: AltChar[];

	static readonly EMPTY_MODEL = {
		id: null,
		name: '',
		locations: [],
		altchars: []
	}

	public deserialise(input: any): this {
		Object.assign(this, input);
		this.locations.forEach((location, index, locations) => {
			locations[index] = new Location().deserialise(location);
		});
		this.altchars.forEach((altchar, index, altchars) => {
			altchars[index] = new AltChar().deserialise(altchar);
		})
		return this;
	}

	public serialise(): any {
		var locations = []
		var altchars = []
		this.locations.forEach((l) => {
			l.serialise();
			locations.push(l);
		});
		this.altchars.forEach((ac) => {
			ac.serialise();
			locations.push(ac);
		});
		return Object.assign(this, {
			'locations': locations,
			'altchars': altchars,
		});
	}
}