import { Signal, Source, Talkback } from "../interface";

export const flat =
	<Value>(source: Source<Source<Value>>): Source<Value, any, any> =>
	(type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		let talkback: Talkback | null = null;
		let innerTalkback: Talkback | null = null;

		source(Signal.Start, (type, data) => {
			if (type === Signal.Start) {
				talkback = data;
			} else if (type === Signal.Data) {
				const innerSource = data;

				innerTalkback?.(Signal.End);

				innerSource(Signal.Start, (type, data) => {
					if (type === Signal.Start) {
						innerTalkback = data;
						innerTalkback(Signal.Data);
					}
					if (type === Signal.Data) {
						sink(Signal.Data, data);
					}
					if (type === Signal.End) {
						innerTalkback = null;
					}
				});
			} else if (type === Signal.End) {
				talkback = null;
				innerTalkback?.(Signal.End);
			}
		});
	};
