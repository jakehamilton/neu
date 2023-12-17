import { Signal, Source } from "../interface";

export const interval =
	(period: number): Source<number> =>
	(type, sink) => {
		if (type !== Signal.Start) return;

		let i = 0;
		let id: ReturnType<typeof setInterval>;

		sink(Signal.Start, (type) => {
			if (type === Signal.End) {
				clearInterval(id);
			}
		});

		setInterval(() => {
			sink(Signal.Data, i++);
		}, period);
	};
