import { Signal, Talkback, Transformer } from "~/streams/interface";

export const when =
	<Value>(fn: (value: Value) => boolean): Transformer<Value, Value> =>
	(source) =>
	(type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		let talkback: Talkback<unknown> | null = null;

		source(Signal.Start, (type, data) => {
			if (type === Signal.Start) {
				sink(Signal.Start, data);
				talkback = data;
			} else if (type === Signal.End) {
				sink(Signal.End, data);
			} else if (fn(data)) {
				sink(Signal.Data, data);
			}
		});
	};
