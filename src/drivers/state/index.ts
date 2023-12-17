import { Driver } from "~/lifecycle/run";
import { Signal, Sink, Source, Talkback } from "../../streams/interface";
import { tap } from "~/streams/transformers/tap";
import { pipe } from "~/streams/util/pipe";

export type State = any;

export type StateDriver = Driver<State, unknown, ReturnType<typeof helpers>>;

const helpers = (
	store: Source<any>,
	state: Map<string, any>,
	listeners: Map<string, Array<(value: any) => void>>,
) => ({
	write: (key: string) => (source: Source<any, any, any>) => {
		return pipe(
			source,
			tap((value) => {
				state.set(key, value);

				if (listeners.has(key)) {
					listeners.get(key)!.forEach((listener) => listener(value));
				}
			}),
		);
	},
	select:
		(key: string): Source<any, any, any> =>
		(type, sink) => {
			if (type !== Signal.Start) {
				return;
			}

			const listener = (value: any) => {
				sink(Signal.Data, value);
			};

			sink(Signal.Start, (type, data) => {
				if (type === Signal.End) {
					const keyListeners = listeners.get(key) ?? [];
					const index = keyListeners.indexOf(listener);

					if (index !== -1) {
						keyListeners.splice(index, 1);
						listeners.set(key, keyListeners);
					}
				}
			});

			if (state.has(key)) {
				sink(Signal.Data, state.get(key));
			}

			const keyListeners = listeners.get(key) ?? [];
			listeners.set(key, keyListeners.concat(listener));
		},
});

export const state =
	(initial = {}) =>
	(source: Source<any>) => {
		const state = new Map<string, any>(Object.entries(initial));
		const listeners = new Map<string, Array<(value: any) => void>>();

		return helpers(source, state, listeners);
	};
