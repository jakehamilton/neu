import { Source, Transformer } from "../interface";
import { pipe } from "../util/pipe";
import { flat } from "./flat";
import { map } from "./map";

export const flatMap =
	<Input, Output, Error>(
		fn: (value: Input) => Output,
	): Transformer<Input, Output, Error> =>
	(source: Source<Input, Error, any>) =>
		pipe(source, map(fn), flat);
