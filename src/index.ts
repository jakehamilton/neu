import * as elements from "~/drivers/dom/elements";
import * as domDriver from "~/drivers/dom";

import * as stateDriver from "~/drivers/state";

export type DomDriver = domDriver.DomDriver;

export const dom = {
	...elements,
	driver: domDriver.driver,
};

export type StateDriver = stateDriver.StateDriver;

export const state = {
	driver: stateDriver.driver,
};

export * from "~/lifecycle/run";

export { each } from "~/streams/sinks/each";
export { subscribe } from "~/streams/sinks/subscribe";

export { event } from "~/streams/sources/event";
export { interval } from "~/streams/sources/interval";
export { merge } from "~/streams/sources/merge";
export { of } from "~/streams/sources/of";

export { filter } from "~/streams/transformers/filter";
export { flatMap } from "~/streams/transformers/flatMap";
export { fold } from "~/streams/transformers/fold";
export { map } from "~/streams/transformers/map";
export { start } from "~/streams/transformers/start";
export { takeWhile } from "~/streams/transformers/takeWhile";
export { tap } from "~/streams/transformers/tap";

export { pipe } from "~/streams/util/pipe";
export { proxy } from "./streams/util/proxy";
export { share } from "./streams/util/share";
