import { Source, Transformer } from "../interface";

export const pipe = (
	source: Source<any, any, any>,
	...transformers: Array<Transformer<any, any, any>>
) => {
	let result: Source<any, any, any> = source;

	for (const transformer of transformers) {
		result = transformer(result);
	}

	return result;
};
