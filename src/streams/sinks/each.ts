import { Signal, Source } from "../interface";

export const each =
	<Input, Error>(fn: (value: Input) => void) =>
	(source: Source<Input, Error, Error>) => {
		source(Signal.Start, (type, data) => {
			// TODO: This is nonsense caused by TypeScript. We can safely call this function, but it refuses to
			// type check properly.
			if (type === Signal.Data) {
				fn(data);
			}
		});
	};
