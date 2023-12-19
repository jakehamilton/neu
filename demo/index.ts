import "./styles";

import { css, glob } from "@littlethings/css";

import * as neu from "~/index";

import * as theme from "./theme";

import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { Dots } from "./components/dots";
import { Callout } from "./components/callout";
import { Link } from "./components/link";

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
	font: {
		title: string;
		normal: string;
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
	paddingBottom: "6rem",
	margin: "0 auto",
	maxWidth: "60rem",
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
			font-family: ${theme.font.normal};
		}
	`;

	const header = Header({ dom, state, theme });
	const hero = Hero({ dom, state, theme });

	return {
		dom: neu.of(
			neu.dom.div(
				{
					class: AppClass,
				},
				[
					header,
					hero,
					Dots({ dom, state, theme }, { sine: true }),
					neu.dom.div({ class: CalloutsClass }, [
						neu.dom.div([
							Callout(
								{ dom, state, theme },
								{
									title: "dynamic",
									description: neu.dom.span([
										"React in real-time to users, not the other way around. Neu is built on ",
										Link(
											{ dom, state, theme },
											{
												text: "Callbags",
												href: "https://github.com/callbag/callbag",
												target: "_blank",
												rel: "noopener noreferrer",
											},
										).dom,
										" to enable highly reponsive, reactive applications.",
									]),
								},
							),
						]),
						neu.dom.div([
							Callout(
								{ dom, state, theme },
								{
									title: "familiar",
									description: neu.dom.span([
										"Build applications like you already know and love. Neu applications are made up of components that are mapped to the DOM just like ",
										Link(
											{ dom, state, theme },
											{
												text: "React",
												href: "https://reactjs.org/",
												target: "_blank",
												rel: "noopener noreferrer",
											},
										).dom,
										" and stream data like ",
										Link(
											{ dom, state, theme },
											{
												text: "SolidJS",
												href: "https://www.solidjs.com/",
												target: "_blank",
												rel: "noopener noreferrer",
											},
										).dom,
										".",
									]),
									invert: true,
								},
							),
						]),
						neu.dom.div([
							Callout(
								{ dom, state, theme },
								{
									title: "prepared",
									description:
										"One dependency from start to finish. Neu provides all of the utilities needed to build your application. From stream primitives to state to components, Neu has you covered.",
								},
							),
						]),
						neu.dom.div([
							Callout(
								{ dom, state, theme },
								{
									title: "open",
									description: neu.dom.span([
										"Free to the world, free to you. Neu is Open Source from day one so you can focus on building instead of bureaucracy. ",
										Link(
											{ dom, state, theme },
											{
												text: "Help us build a better web",
												href: "https://github.com/jakehamilton/neu",
												target: "_blank",
												re: "noopener noreferrer",
											},
										).dom,
										".",
									]),
									invert: true,
								},
							),
						]),
					]),
					Dots({ dom, state, theme }, { sine: true, invert: true }),
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
		font: {
			title:
				"Ysabeau SC, San Francisco, -system-font, Helvetica Neue, Helvetica, Arial, sans-serif",
			normal:
				"Manrope, San Francisco, -system-font, Helvetica Neue, Helvetica, Arial, sans-serif",
		},
	}),
});
