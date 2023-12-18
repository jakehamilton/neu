import { css } from "@littlethings/css";

import * as neu from "~/index";

import { Drivers, Theme } from "..";

const HeroClass = css({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: "40svh",
	minHeight: "15rem",
	maxHeight: "30rem",
	padding: "0 1rem",
});

const HeroTitleClass = css({
	fontFamily: "Ysabeau SC",
	fontSize: "4rem",
});

const NeuClass = (theme: Theme) =>
	css({
		color: theme.accent.background,
		textShadow: `0 0 5rem ${theme.accent.background}`,
	});

export const Hero: neu.App<Drivers> = ({ dom, theme }) => {
	return {
		dom: neu.of(
			neu.dom.div({ class: HeroClass }, [
				neu.dom.div([
					neu.dom.h1(
						{
							class: HeroTitleClass,
						},
						[
							"the ",
							neu.dom.span({ class: NeuClass(theme) }, ["neu"]),
							,
							" web",
						],
					),
				]),
			]),
		),
	};
};
