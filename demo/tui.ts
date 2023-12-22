import * as neu from "~/index";

type Drivers = {
	tui: neu.tui.TuiDriver;
};

const app: neu.App<Drivers> = () => {
	return {
		tui: neu.of(
			neu.tui.box(
				{
					flexGrow: 1,
				},
				[
					// Header
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
						[neu.tui.text("WELCOME TO"), neu.tui.text(" GitHub")],
					),
					// Body
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
										},
										"NEU",
									),
									" WEB",
								],
							),
							neu.tui.box(
								{
									position: "relative",
									width: 35,
									height: 14,
									overflow: "hidden",
									background: "red",
								},
								[
									neu.tui.box(
										{
											position: "absolute",
											width: 11,
											height: 5,
											color: "black",
											background: "white",
											top: 10,
											left: -5,
										},
										"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, erat quis ultrices egestas, libero nisl varius libero, sed lacinia",
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
});
