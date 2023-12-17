import { Signal, Source, Transformer } from "../interface";

export const map =
	<Input, Output, Error>(
		fn: (value: Input) => Output,
	): Transformer<Input, Output, Error> =>
	(source: Source<Input, Error, any>) =>
	(type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		source(Signal.Start, (type, data) => {
			// TODO: This is nonsense caused by TypeScript. We can safely call this function, but it refuses to
			// type check properly.
			if (type === Signal.Start) {
				sink(Signal.Start, data);
			} else if (type === Signal.End) {
				sink(Signal.End, data);
			} else {
				sink(Signal.Data, fn(data));
			}
		});
	};
