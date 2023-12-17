import { Signal, Source, Talkback } from "../interface";

export const merge =
	<Value, EI = unknown, EO = unknown>(
		...sources: Array<Source<Value, EI, EO>>
	): Source<Value, EI, EO> =>
	(type, sink) => {
		if (type !== Signal.Start) {
			return;
		}

		let ended = 0;
		let started = 0;
		let isDone = false;

		const talkbacks: Array<Talkback<EO> | null> = Array.from(
			{ length: sources.length },
			() => null,
		);

		const talkback: Talkback<EO> = (type, data) => {
			if (type === Signal.End) {
				isDone = true;
				for (const talkback of talkbacks) {
					talkback?.(Signal.End, data);
				}
			}
		};

		for (let i = 0; i < sources.length; i++) {
			if (isDone) {
				return;
			}

			const source = sources[i];

			source(Signal.Start, (type, data) => {
				if (type === Signal.Start) {
					started++;
					talkbacks[i] = data;

					if (started === 1) {
						sink(Signal.Start, talkback);
					}
				} else if (type === Signal.Data) {
					sink(type, data);
				} else if (type === Signal.End) {
					ended++;
					talkbacks[i] = null;

					if (data) {
						for (let j = 0; j < talkbacks.length; j++) {
							if (i !== j) {
								// @ts-expect-error
								talkbacks[j]?.(Signal.End, data);
							}
						}
					}

					if (ended === sources.length) {
						sink(Signal.End, data);
					}
				}
			});
		}
	};
