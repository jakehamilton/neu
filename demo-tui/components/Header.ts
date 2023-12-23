import * as neu from "~/index";
import ansi from "ansi-escapes";
import supportsHyperlinks from "supports-hyperlinks";

import { Drivers } from "..";

export type HeaderProps = {
	scroll: neu.Source<number>;
};

export const Header: neu.App<Drivers, {}, HeaderProps> = (sources, props) => {
	const title$ = neu.pipe(
		props.scroll,
		neu.map((scroll) => {
			if (scroll > 7) {
				return neu.tui.box(
					{
						flexDirection: "row",
					},
					[
						neu.tui.text("THE "),
						neu.tui.text(
							{
								color: "magenta",
								bold: true,
							},
							"NEU",
						),
						neu.tui.text(" WEB"),
					],
				);
			}
			return neu.tui.text("WELCOME TO");
		}),
	);

	return {
		tui: neu.of(
			neu.tui.box(
				{
					flexDirection: "row",
					justifyContent: "space-between",
					paddingTop: 1,
					paddingBottom: 1,
					paddingLeft: 2,
					paddingRight: 2,
					background: "blackBright",
				},
				[
					title$,
					neu.tui.text(
						supportsHyperlinks.supportsHyperlink(process.stdout)
							? ansi.link(" GitHub", "https://github.com/jakehamilton/neu")
							: " jakehamilton/neu",
					),
				],
			),
		),
	};
};
