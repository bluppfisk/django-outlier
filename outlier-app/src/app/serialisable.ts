export interface Serialisable {
	deserialise(input: any): this;
	serialise(input: this): any;
}
