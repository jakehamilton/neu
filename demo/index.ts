import "./styles";

import { css } from "@littlethings/css";

import { DomDriver, dom } from "~/drivers/dom";
import { button, div, p, span } from "~/drivers/dom/elements";
import { StateDriver, state } from "~/drivers/state";
import { App, run } from "~/lifecycle/run";
import { event } from "~/streams/sources/event";
import { merge } from "~/streams/sources/merge";
import { of } from "~/streams/sources/of";
import { filter } from "~/streams/transformers/filter";
import { flatMap } from "~/streams/transformers/flatMap";
import { fold } from "~/streams/transformers/fold";
import { map } from "~/streams/transformers/map";
import { start } from "~/streams/transformers/start";
import { pipe } from "~/streams/util/pipe";
import { Header } from "./components/header";

const AppClass = css({});

const ButtonClass = css({
	background: "pink",
});

export type Drivers = { dom: DomDriver; state: StateDriver };

const App: App<Drivers> = ({ dom, state }) => {
	const clicks = (selector: string) =>
		pipe(
			dom.select(selector),
			filter<Element | null, Element>((x) => x !== null),
			flatMap<Element, Event>(event("click")),
			fold((acc) => acc + 1, 0),
			start(0),
		);

	const countA$ = pipe(clicks("#a"), state.write("countA"));

	const countB$ = pipe(clicks("#b"), state.write("countB"));

	const textA$ = pipe(
		state.select("countA"),
		map((count) => span(String(count))),
	);

	const textB$ = pipe(
		state.select("countB"),
		map((count) => span(String(count))),
	);

	const state$ = merge(
		pipe(countA$, state.write("countA")),
		pipe(countB$, state.write("countB")),
	);

	return {
		state: state$,
		dom: of(
			div(
				{
					class: AppClass,
				},
				[
					Header({ dom, state }).dom,
					button(
						{
							class: ButtonClass,
							id: "a",
						},
						"Click me!",
					),
					button(
						{
							class: ButtonClass,
							id: "b",
						},
						"Click me!",
					),
					p(["CountA: ", textA$]),
					p(["CountB: ", textB$]),
				],
			),
		),
	};
};

run<Drivers>({
	app: App,
	state: state(),
	dom: dom("#app"),
});
