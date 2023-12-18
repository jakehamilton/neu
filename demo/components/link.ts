import * as neu from "~/index";

import { Drivers, Theme } from "..";
import { clsx, css } from "@littlethings/css";

const LinkClass = (theme: Theme) =>
	css({
		color: theme.accent.background,
		textDecoration: "underline",
		textUnderlineOffset: "0.175rem",
	});

type Props = {
	text: neu.VNode | neu.VNodeStream;
	href: string;
	[key: string]: any;
};

export const Link: neu.App<Drivers, {}, Props> = ({ theme }, props) => {
	const { text, ...rest } = props;

	return {
		dom: neu.of(
			neu.dom.a(
				{
					...rest,
					class: clsx(LinkClass(theme), rest?.class),
				},
				[text],
			),
		),
	};
};
