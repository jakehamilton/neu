import { Signal, Sink, Source, Talkback } from "../interface";

export const share = <Data, EI, EO>(
	source: Source<Data, EI, EO>,
): Source<Data, EI, EO> => {
	let sinks: Array<Sink<Data, EI, EO>> = [];
	let sourceTalkback: Talkback<EO> | null = null;

	const shared: Source<Data, EI, EO> = (type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		sinks.push(sink);

		const sinkTalkback: Talkback<EO> = (type, error) => {
			if (type === Signal.End) {
				const index = sinks.indexOf(sink);
				if (index > -1) {
					sinks.splice(index, 1);
				}
				if (sinks.length > 0) {
					sourceTalkback?.(Signal.End);
				}
			} else {
				sourceTalkback?.(type, error);
			}
		};

		if (sinks.length === 1) {
			source(Signal.Start, (type, data) => {
				if (type === Signal.Start) {
					sourceTalkback = data;
					sink(Signal.Start, sinkTalkback);
				} else {
					for (const sink of sinks.slice()) {
						if (type === Signal.Data) {
							sink(type, data);
						} else {
							sink(type, data);
						}
					}
				}

				if (type === Signal.End) {
					sinks = [];
					sourceTalkback = null;
				}
			});
		}
	};

	return shared;
};
