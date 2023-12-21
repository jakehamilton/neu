import * as elements from "~/drivers/dom/elements";
import * as domDriver from "~/drivers/dom";

import * as stateDriver from "~/drivers/state";
import * as historyDriver from "~/drivers/history";

export type DomDriver = domDriver.DomDriver;

export type VNode = elements.VNode;
export type VNodeStream = elements.VNodeStream;
export type VNodeChildren = elements.VNodeChildren;

export const dom = {
	...elements,
	driver: domDriver.driver,
};

export type StateDriver<State> = stateDriver.StateDriver<State>;

export const state = {
	driver: stateDriver.driver,
};

export type HistoryDriver = historyDriver.HistoryDriver;

export const history = {
	driver: historyDriver.driver,
};

export * from "~/lifecycle/run";

export * from "~/streams/interface";

export { each } from "~/streams/sinks/each";
export { subscribe } from "~/streams/sinks/subscribe";

export { event } from "~/streams/sources/event";
export { interval } from "~/streams/sources/interval";
export { merge } from "~/streams/sources/merge";
export { of } from "~/streams/sources/of";
export { combine } from "~/streams/sources/combine";

export { filter } from "~/streams/transformers/filter";
export { during } from "~/streams/transformers/during";
export { flat } from "~/streams/transformers/flat";
export { flatMap } from "~/streams/transformers/flatMap";
export { fold } from "~/streams/transformers/fold";
export { sample } from "~/streams/transformers/sample";
export { map } from "~/streams/transformers/map";
export { start } from "~/streams/transformers/start";
export { tap } from "~/streams/transformers/tap";
export { to } from "~/streams/transformers/to";
export { unique } from "~/streams/transformers/unique";
export { when } from "~/streams/transformers/when";

export { broadcast } from "~/streams/util/broadcast";
export { pipe } from "~/streams/util/pipe";
export { proxy } from "./streams/util/proxy";
export { share } from "./streams/util/share";
