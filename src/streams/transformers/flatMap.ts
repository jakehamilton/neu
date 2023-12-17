import { Source, Transformer } from "../interface";
import { pipe } from "../util/pipe";
import { flat } from "./flat";
import { map } from "./map";

export const flatMap =
	<Input, Output>(
		fn: (value: Input) => Output | Source<Output>,
	): Transformer<Input, Output> =>
	(source) => {
		return pipe(
			source,
			map<Input, Output | Source<Output>>(fn),
			flat<Output>(),
		);
	};
