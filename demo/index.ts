import "./styles";

import { css, glob } from "@littlethings/css";

import * as neu from "~/index";

import * as theme from "./theme";

import { Button } from "./components/button";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { Dots } from "./components/dots";
import { Callout } from "./components/callout";

export type Theme = {
	accent: {
		foreground: string;
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

const CalloutsClass = css({
	display: "flex",
	flexDirection: "column",
	gap: "6rem",
	padding: "4rem 0",
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

	const header = Header({ dom, state, theme });
	const hero = Hero({ dom, state, theme });
	const dots = Dots({ dom, state, theme }, { sine: true });
	const invertedDots = Dots(
		{ dom, state, theme },
		{ sine: true, invert: true },
	);

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
					dots.dom,
					neu.dom.div({ class: CalloutsClass }, [
						neu.dom.div([
							Callout(
								{ dom, state, theme },
								{
									title: "dynamic",
									description:
										"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in eros vitae sapien ultricies aliquam. Donec auctor, eros quis tincidunt aliquam, nunc nulla facilisis lectus, a ultricies leo lorem eu nunc.",
								},
							).dom,
						]),
						neu.dom.div([
							Callout(
								{ dom, state, theme },
								{
									title: "familiar",
									description:
										"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in eros vitae sapien ultricies aliquam. Donec auctor, eros quis tincidunt aliquam, nunc nulla facilisis lectus, a ultricies leo lorem eu nunc.",
									invert: true,
								},
							).dom,
						]),
						neu.dom.div([
							Callout(
								{ dom, state, theme },
								{
									title: "prepared",
									description:
										"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in eros vitae sapien ultricies aliquam. Donec auctor, eros quis tincidunt aliquam, nunc nulla facilisis lectus, a ultricies leo lorem eu nunc.",
								},
							).dom,
						]),
						neu.dom.div([
							Callout(
								{ dom, state, theme },
								{
									title: "open",
									description:
										"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in eros vitae sapien ultricies aliquam. Donec auctor, eros quis tincidunt aliquam, nunc nulla facilisis lectus, a ultricies leo lorem eu nunc.",
									invert: true,
								},
							).dom,
						]),
					]),
					invertedDots.dom,
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
			foreground: "#eceff4",
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
