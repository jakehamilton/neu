import { Driver } from "../../lifecycle/run";
import { Signal, Sink, Source, Talkback } from "../../streams/interface";
import { each } from "../../streams/sinks/each";
import { of } from "../../streams/sources/of";
import { fold } from "../../streams/transformers/fold";
import { map } from "../../streams/transformers/map";
import { pipe } from "../../streams/util/pipe";
import { share } from "../../streams/util/share";
import { VNode } from "./elements";
import { render } from "./render";

export type DomDriver = Driver<VNode, unknown, ReturnType<typeof helpers>>;

const helpers = (source: Source<any, any, any>) => {
	return {
		share: () => {
			const stream = share(source);

			return Object.assign(stream, helpers(stream));
		},
		map: <Input, Output>(fn: (input: Input) => Output) => {
			const stream = map(fn)(source);

			return Object.assign(stream, helpers(stream));
		},
		each: <Fn extends (...args: any[]) => {}>(fn: Fn) => {
			each(fn)(source);
		},
		fold: <Value, Accumulator>(
			fn: (accumulator: Accumulator, value: Value) => Accumulator,
			initial: Accumulator,
		) => {
			const stream = fold(fn, initial)(source);

			return Object.assign(stream, helpers(stream));
		},
		select: (selector: string) => {
			let element: Element | null = null;
			let sinkTalkback: Sink<Element | null> | null = null;
			const observer = new MutationObserver((mutations) => {
				sinkTalkback?.(Signal.Data, element?.querySelector(selector) ?? null);
			});

			const stream = pipe(source, (s): Source<Element | null, any, any> => {
				s(Signal.Start, (type, data) => {
					if (type === Signal.Start) {
					} else if (type === Signal.Data) {
						observer.disconnect();

						element = data;
						if (element) {
							observer.observe(element, {
								// TODO: Determine if this is necessary for nested child elements to
								// retrigger querySelector. Doing so means more full rerenders which means
								// reattaching listeners when potentially unrelated changes are made.
								subtree: false,
								childList: true,
							});
						}
					} else if (type === Signal.End) {
						sinkTalkback?.(Signal.End, undefined);
					}
				});

				return (type, sink) => {
					if (type === Signal.Start) {
						sinkTalkback = sink;
					} else if (type === Signal.End) {
						observer.disconnect();
					}
				};
			});

			return Object.assign(stream, helpers(stream));
		},
		event: (name: string) => {
			const stream = pipe(source, (s): Source<Event, any, any> => {
				let sourceTalkback: Talkback | null = null;
				let sinkTalkback: Sink<Event> | null = null;

				let element: Element | null = null;
				const listener = (event: Event) => {
					sinkTalkback?.(Signal.Data, event);
				};

				s(Signal.Start, (type, data) => {
					if (type === Signal.Start) {
						sourceTalkback = data;
					} else if (type === Signal.Data) {
						element?.removeEventListener(name, listener);
						element = data;
						element?.addEventListener(name, listener);
					} else if (type === Signal.End) {
						sinkTalkback?.(Signal.End, undefined);
						element?.removeEventListener(name, listener);
					}
				});

				return (type, sink) => {
					if (type === Signal.Start) {
						// @ts-expect-error
						sinkTalkback = sink;
					} else if (type === Signal.End) {
						sourceTalkback?.(Signal.End);
						element?.removeEventListener(name, listener);
					}
				};
			});

			return Object.assign(stream, helpers(stream));
		},
	} as const;
};

export const dom =
	(selector: string): DomDriver =>
	(source: Source<any>) => {
		const element = document.querySelector(selector)!;

		render(element)(source);

		return helpers(of(element));
	};
