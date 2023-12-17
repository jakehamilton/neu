import { css } from "@littlethings/css";

import * as neu from "~/index";

import { Drivers } from "..";

const HeaderClass = css({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	height: "3rem",
	padding: "0 1rem",
});
const HeaderLeftClass = css({
	display: "flex",
	flexGrow: "1",
});
const HeaderRightClass = css({
	display: "flex",
	justifyContent: "flex-end",
	flexGrow: "1",
});

export const Header: neu.App<Drivers> = ({ dom }) => {
	return {
		dom: neu.of(
			neu.dom.div({ class: HeaderClass }, [
				neu.dom.div({ class: HeaderLeftClass }, ["Left"]),
				neu.dom.div({ class: HeaderRightClass }, ["Right"]),
			]),
		),
	};
};
