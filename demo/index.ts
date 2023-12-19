import "./styles";

import { css, glob } from "@littlethings/css";

import * as neu from "~/index";

import * as theme from "./theme";

import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { Dots } from "./components/dots";
import { Callout, CalloutProps } from "./components/callout";
import { Link } from "./components/link";
import { Code } from "./components/code";

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
	paddingBottom: "8rem",
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

const CodeClass = css({
	display: "flex",
	alignItems: "center",
	flexDirection: "column",
	gap: "2rem",
	padding: "6rem 2rem",
});

const CodeTitleClass = (theme: Theme) =>
	css({
		fontSize: "4rem",
		fontFamily: theme.font.title,
	});

const NeuClass = (theme: Theme) =>
	css({
		color: theme.accent.background,
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

	const callouts: Array<CalloutProps> = [
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
				),
				" to enable highly reponsive, reactive applications.",
			]),
		},
		{
			invert: true,
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
				),
				" and stream data like ",
				Link(
					{ dom, state, theme },
					{
						text: "SolidJS",
						href: "https://www.solidjs.com/",
						target: "_blank",
						rel: "noopener noreferrer",
					},
				),
				".",
			]),
		},
		{
			title: "prepared",
			description:
				"One dependency from start to finish. Neu provides all of the utilities needed to build your application. From stream primitives to state to components, Neu has you covered.",
		},
		{
			invert: true,
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
				),
				".",
			]),
		},
	];

	return {
		dom: neu.of(
			neu.dom.div(
				{
					class: AppClass,
				},
				[
					Header({ dom, state, theme }),
					Hero({ dom, state, theme }),
					Dots({ dom, state, theme }, { sine: true }),

					neu.dom.div(
						{ class: CalloutsClass },
						callouts.map((props) => Callout({ dom, state, theme }, props)),
					),
					Dots({ dom, state, theme }, { sine: true, invert: true }),

					neu.dom.div({ class: CodeClass }, [
						neu.dom.h3({ class: CodeTitleClass(theme) }, ["get started"]),
						Code(
							{ dom, state, theme },
							{
								text: neu.dom.span([
									"npm install ",
									neu.dom.span({ class: NeuClass(theme) }, "neu"),
								]),
								center: true,
							},
						),
					]),
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
