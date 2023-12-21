import * as neu from "~/index";

import { Drivers } from "..";

export type Props = {
	routes: Record<string, neu.Source<neu.VNode>>;
	fallback: neu.VNodeStream;
};

export const Router: neu.App<
	{ history: neu.HistoryDriver },
	{
		dom: neu.VNodeStream;
	},
	Props
> = ({ history }, { routes, fallback }) => {
	const vdom$ = neu.pipe(
		history.location(),
		neu.map((location: Location) => {
			for (const [route, vdom] of Object.entries(routes)) {
				const pattern = new URLPattern(route, window.location.origin);

				if (pattern.test(location.href)) {
					return vdom;
				}
			}

			return fallback;
		}),
		neu.flat<neu.VNode>(),
	);

	return {
		dom: vdom$,
	};
};
