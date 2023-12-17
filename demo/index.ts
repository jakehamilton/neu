import "./styles";

import { css } from "@littlethings/css";

import * as neu from "~/index";

import { Header } from "./components/header";

const AppClass = css({});

const ButtonClass = css({
	background: "pink",
});

export type Drivers = { dom: neu.DomDriver; state: neu.StateDriver };

const App: neu.App<Drivers> = ({ dom, state }) => {
	const clicks = (selector: string) =>
		neu.pipe(
			dom.select(selector),
			neu.filter<Element | null, Element>((x) => x !== null),
			neu.flatMap<Element, Event>(neu.event("click")),
			neu.fold((acc) => acc + 1, 0),
			neu.start(0),
		);

	const countA$ = neu.pipe(clicks("#a"), state.write("countA"));

	const countB$ = neu.pipe(clicks("#b"), state.write("countB"));

	const textA$ = neu.pipe(
		state.select("countA"),
		neu.map((count) => neu.dom.span(String(count))),
	);

	const textB$ = neu.pipe(
		state.select("countB"),
		neu.map((count) => neu.dom.span(String(count))),
	);

	const state$ = neu.merge(
		neu.pipe(countA$, state.write("countA")),
		neu.pipe(countB$, state.write("countB")),
	);

	return {
		state: state$,
		dom: neu.of(
			neu.dom.div(
				{
					class: AppClass,
				},
				[
					Header({ dom, state }).dom,
					neu.dom.button(
						{
							class: ButtonClass,
							id: "a",
						},
						"Click me!",
					),
					neu.dom.button(
						{
							class: ButtonClass,
							id: "b",
						},
						"Click me!",
					),
					neu.dom.p(["CountA: ", textA$]),
					neu.dom.p(["CountB: ", textB$]),
				],
			),
		),
	};
};

neu.run<Drivers>({
	app: App,
	state: neu.state.driver(),
	dom: neu.dom.driver("#app"),
});
