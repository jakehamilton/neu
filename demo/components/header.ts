import { css } from "@littlethings/css";

import * as neu from "~/index";

import { Drivers, Theme } from "..";

const HeaderClass = (theme: Theme) =>
	css({
		position: "sticky",
		top: "0",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		height: "3rem",
		padding: "0 1rem",
		background: theme.background.dark,
		transition: "background 0.25s ease",
	});

const HeaderLeftClass = css({
	display: "flex",
	flexGrow: "1",
});

const LeftTitleClass = css({
	fontSize: "1.25rem",
	fontWeight: "bold",
	fontFamily: "Ysabeau SC",
});

const HeaderRightClass = css({
	display: "flex",
	justifyContent: "flex-end",
	flexGrow: "1",
});

export const Header: neu.App<Drivers> = ({ dom, theme }) => {
	const isScrolled$ = neu.pipe(
		neu.event("scroll")(window),
		neu.map(() => window.scrollY),
		neu.map((scrollY: number) => scrollY > window.innerHeight * 0.25),
		neu.start(false),
		neu.unique<boolean>(),
	);

	const title$ = neu.pipe(
		isScrolled$,
		neu.map((isScrolled: boolean) =>
			isScrolled ? "THE NEU WEB" : "WELCOME TO",
		),
	);

	const style$ = neu.pipe(
		isScrolled$,
		neu.map((isScrolled: boolean) => ({
			color: isScrolled ? theme.accent.foreground : theme.foreground.normal,
			background: isScrolled ? theme.background.normal : "transparent",
		})),
	);

	return {
		dom: neu.of(
			neu.dom.div({ class: HeaderClass(theme), style: style$ }, [
				neu.dom.div({ class: HeaderLeftClass }, [
					neu.dom.h1(
						{
							class: LeftTitleClass,
						},
						[title$],
					),
				]),
				neu.dom.div({ class: HeaderRightClass }),
			]),
		),
	};
};
