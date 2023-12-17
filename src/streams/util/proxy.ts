import { Signal, Sink, SinkArgs, Source } from "../interface";

export const proxy = <Data>() => {
	let buffer: Array<SinkArgs<Data, unknown, unknown>> = [];

	let downstream: Sink<Data> | null = null;

	const sink: Sink<Data> = (type, data) => {
		if (downstream) {
			// @ts-expect-error
			downstream(type, data);
		} else {
			// @ts-expect-error
			buffer.push([type, data]);
		}
	};

	const source: Source<Data> = (type, data) => {
		if (type === Signal.Start) {
			downstream = data;

			if (buffer.length > 0) {
				for (const [t, d] of buffer.slice()) {
					// @ts-expect-error
					downstream(t, d);
				}

				buffer = [];
			}
		}
	};

	return {
		sink,
		source,
	};
};
