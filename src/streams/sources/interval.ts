import { Signal, Source } from "../interface";

export const interval =
	(period: number): Source<number, any, any> =>
	(type, sink) => {
		if (type !== Signal.Start) return;

		let i = 0;
		let id = setInterval(() => {
			sink(Signal.Data, i++);
		}, period);

		sink(Signal.Start, (type) => {
			if (type === Signal.End) {
				clearInterval(id);
			}
		});
	};
