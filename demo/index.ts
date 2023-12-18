import "./styles";

import { css, glob } from "@littlethings/css";

import * as neu from "~/index";

import * as theme from "./theme";

import { Header } from "./components/header";
import { Button } from "./components/button";
import { Hero } from "./components/hero";

export type Theme = {
	accent: {
		text: string;
		background: string;
	};
	foreground: {
		light: string;
		normal: string;
		dark: string;
	};
	background: {
		light: string;
		normal: string;
		dark: string;
	};
};

const AppClass = css({
	height: "400vh",
});

export type Drivers = {
	dom: neu.DomDriver;
	state: neu.StateDriver;
	theme: theme.ThemeDriver<Theme>;
};

const App: neu.App<Drivers> = ({ dom, state, theme }) => {
	glob`
		html {
			color: ${theme.foreground.light};
			background: ${theme.background.dark};
		}
	`;

	const clicks = (selector: string) =>
		neu.pipe(
			dom.select(selector),
			neu.filter<Element | null, Element>((x) => x !== null),
			neu.flatMap<Element, Event>(neu.event("click")),
			neu.fold((acc) => acc + 1, 0),
			neu.start(0),
		);

	const countA$ = neu.pipe(clicks("#a"));

	const countB$ = neu.pipe(clicks("#b"));

	const textA$ = neu.pipe(
		state.select("countA"),
		neu.map((count) => neu.dom.span(String(count))),
	);

	const textB$ = neu.pipe(
		state.select("countB"),
		neu.map((count) => neu.dom.span(String(count))),
	);

	const header = Header({ dom, state, theme });
	const hero = Hero({ dom, state, theme });

	const state$ = neu.merge(
		neu.pipe(countA$, state.write<number>("countA")),
		neu.pipe(countB$, state.write<number>("countB")),
	);

	return {
		state: state$,
		dom: neu.of(
			neu.dom.div(
				{
					class: AppClass,
				},
				[
					header.dom,
					hero.dom,
					Button(
						{
							id: "a",
						},
						"Click me!",
					),
					Button(
						{
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
	theme: theme.driver<Theme>({
		accent: {
			text: "#eceff4",
			background: "#b48ead",
		},
		foreground: {
			light: "#eceff4",
			normal: "#e5e9f0",
			dark: "#d8dee9",
		},
		background: {
			light: "#434c5e",
			normal: "#3b4252",
			dark: "#2e3440",
		},
	}),
});
