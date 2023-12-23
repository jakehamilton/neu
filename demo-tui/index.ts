import * as neu from "~/index";
import ansi from "ansi-escapes";
import supportsHyperlinks from "supports-hyperlinks";

export type State = {
	focus: string;
};

export type Drivers = {
	tui: neu.tui.TuiDriver;
	state: neu.state.StateDriver<State>;
	effect: neu.effect.EffectDriver;
};

const app: neu.App<Drivers> = ({ tui, state }) => {
	const focusable = ["cancel", "submit"];

	const exit$ = neu.pipe(
		tui.keypress(),
		neu.when((key: neu.tui.Key) => key.name === "c" && key.ctrl),
		neu.tap(() => {
			process.exit(0);
		}),
	);

	const focus$ = neu.broadcast(
		neu.pipe(
			tui.keypress(),
			neu.when((key: neu.tui.Key) => key.name === "tab"),
			neu.fold((index: number, key: neu.tui.Key) => {
				if (key.shift) {
					if (index === 0) {
						return focusable.length - 1;
					}
					return (index - 1) % focusable.length;
				} else {
					if (index === focusable.length - 1) {
						return 0;
					}

					return (index + 1) % focusable.length;
				}
			}, 0),
			neu.start(0),
			neu.map((index: number) => focusable[index]),
			state.write("focus"),
		),
	);

	const cancelStyle$ = neu.pipe(
		focus$,
		neu.map((focus) =>
			focus === "cancel"
				? {
						color: "red",
						borderColor: "red",
					}
				: { color: "white", borderColor: "white" },
		),
	);

	const submitStyle$ = neu.pipe(
		focus$,
		neu.map((focus) =>
			focus === "submit"
				? {
						color: "green",
						borderColor: "green",
					}
				: { color: "white", borderColor: "white" },
		),
	);

	return {
		effect: exit$,
		tui: neu.of(
			neu.tui.box(
				{
					flexGrow: 1,
				},
				[
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
							neu.tui.text("WELCOME TO"),
							neu.tui.text(
								supportsHyperlinks.supportsHyperlink(process.stdout)
									? ansi.link(" GitHub", "https://github.com/jakehamilton/neu")
									: " jakehamilton/neu",
							),
						],
					),
					neu.tui.box(
						{
							alignItems: "center",
							justifyContent: "center",
							flexGrow: 1,
						},
						[
							neu.tui.box(
								{
									flexDirection: "row",
								},
								[
									"THE ",
									neu.tui.text(
										{
											color: "magenta",
											bold: true,
										},
										"NEU",
									),
									" WEB",
								],
							),
							neu.tui.box(
								{
									flexDirection: "row",
									alignItems: "center",
									overflow: "hidden",
								},
								[
									neu.tui.box(
										{
											paddingLeft: 1,
											paddingRight: 1,
											border: "round",
											style: cancelStyle$,
										},
										"Cancel",
									),
									neu.tui.box(
										{
											marginLeft: 2,
											paddingLeft: 1,
											paddingRight: 1,
											border: "round",
											style: submitStyle$,
										},
										"Submit",
									),
								],
							),
						],
					),
				],
			),
		),
	};
};

neu.run<Drivers>({
	app,
	tui: neu.tui.driver(process.stdin, process.stdout),
	state: neu.state.driver({
		focus: "",
	}),
	effect: neu.effect.driver(),
});
