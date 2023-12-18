import { Signal, Source } from "~/streams/interface";
import { proxy } from "~/streams/util/proxy";

/*
import * as neu from "neu";

const app: neu.app = ({ dom }) => {
	const button$ = dom.select("button");
	const click$ = button$.event("click");

	click$.each((event) => {
		console.log(event);
	});

	return neu.div([
		neu.button("Click me!"),
	]);
}

run({
	app,
	dom: neu.dom("#app"),
});
*/

export type Driver<Value, Error, Return> = (
	source: Source<Value, Error, any>,
) => Return;

export type AnyDriver = Driver<any, any, any>;

export type AnyDrivers = {
	[key: string]: AnyDriver;
};

export type AppSinks = {
	[key: string]: Source<any>;
};

export type App<
	Drivers extends AnyDrivers,
	Sinks extends AppSinks = {},
> = (sources: {
	[key in keyof Drivers]: Drivers[key] extends Driver<any, any, infer Return>
		? Return
		: ReturnType<Drivers[key]>;
}) => {
	[key in keyof Drivers]?: Drivers[key] extends Driver<
		infer Value,
		infer Error,
		any
	>
		? Source<Value, Error, any>
		: Source<any, any>;
} & Sinks;

export const run = <Drivers extends AnyDrivers>({
	app,
	...rest
}: {
	app: App<Drivers>;
} & Drivers) => {
	const proxies = {};
	const drivers = {};

	for (const key in rest) {
		// @ts-expect-error
		proxies[key] = proxy();
		// @ts-expect-error
		drivers[key] = rest[key](proxies[key].source);
	}

	// @ts-expect-error
	const sources = app(drivers);

	for (const key in rest) {
		// @ts-expect-error
		sources[key]?.(Signal.Start, proxies[key].sink);
	}
};
