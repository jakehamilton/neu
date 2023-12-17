import { Signal, Source, Talkback } from "../interface";

export type Dispose = () => void;

export const subscribe =
	<Value, Error>(fn: (value: Value) => void) =>
	(source: Source<Value, Error, Error>): Dispose => {
		let talkback: Talkback | null = null;

		source(Signal.Start, (type, data) => {
			if (type === Signal.Start) {
				talkback = data;
			} else if (type === Signal.Data) {
				fn(data);
			}
		});

		return () => {
			talkback?.(Signal.End);
		};
	};
