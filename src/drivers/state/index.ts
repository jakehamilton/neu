import { Driver } from "~/lifecycle/run";
import { tap } from "~/streams/transformers/tap";
import { pipe } from "~/streams/util/pipe";
import { Signal, Source, Transformer } from "../../streams/interface";

export type State = any;

export type StateDriver = Driver<State, unknown, ReturnType<typeof helpers>>;

const helpers = (
	_store: Source<any>,
	state: Map<string, any>,
	listeners: Map<string, Array<(value: any) => void>>,
) => ({
	write:
		<T>(key: string): Transformer<T, T> =>
		(source) => {
			return pipe(
				source,
				tap((value: T) => {
					state.set(key, value);

					if (listeners.has(key)) {
						listeners.get(key)!.forEach((listener) => listener(value));
					}
				}),
			);
		},
	select:
		<T>(key: string): Source<T> =>
		(type, sink) => {
			if (type !== Signal.Start) {
				return;
			}

			const listener = (value: any) => {
				sink(Signal.Data, value);
			};

			sink(Signal.Start, (type, _data) => {
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

export const driver =
	(initial = {}) =>
	(source: Source<any>) => {
		const state = new Map<string, any>(Object.entries(initial));
		const listeners = new Map<string, Array<(value: any) => void>>();

		return helpers(source, state, listeners);
	};
