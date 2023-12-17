import { Signal, Source } from "../interface";

export const event =
	<
		Name extends string,
		Target extends {
			addEventListener: <E>(name: Name, listener: (event: E) => void) => void;
			removeEventListener: <E>(
				name: Name,
				listener: (event: E) => void,
			) => void;
		},
	>(
		name: Name,
	) =>
	(target: Target): Source<any, any, any> => {
		let listener: (event: Event) => void;

		return (type, sink) => {
			if (type === Signal.Start) {
				sink(Signal.Start, (type, data) => {
					if (type === Signal.End) {
						target.removeEventListener(name, listener);
					}
				});
				listener = (event: Event) => {
					sink(Signal.Data, event);
				};
				target.addEventListener(name, listener);
			} else if (type === Signal.End) {
				target.removeEventListener(name, listener);
			}
		};
	};
