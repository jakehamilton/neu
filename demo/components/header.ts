import { App } from "~/lifecycle/run";
import { Drivers } from "..";
import { of } from "~/streams/sources/of";
import { div } from "~/drivers/dom/elements";
import { css } from "@littlethings/css";

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

export const Header: App<Drivers> = ({ dom }) => {
	return {
		dom: of(
			div({ class: HeaderClass }, [
				div({ class: HeaderLeftClass }, ["Left"]),
				div({ class: HeaderRightClass }, ["Right"]),
			]),
		),
	};
};
