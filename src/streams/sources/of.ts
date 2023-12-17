import { Signal, Source } from "../interface";

export const of =
	<Value>(value: Value): Source<Value, any, any> =>
	(type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		sink(Signal.Start, () => {});

		sink(Signal.Data, value);
	};
