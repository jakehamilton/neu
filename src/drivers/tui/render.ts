// @ts-expect-error
import { YogaNode, loadYoga } from "yoga-layout";
import ansi from "ansi-escapes";
import colors from "ansi-colors";
import wrap from "wrap-ansi";
import truncate from "cli-truncate";
import stringWidth from "string-width";
import widestLine from "widest-line";

import { Signal, Source } from "~/streams/interface";
import { Dispose } from "~/streams/sinks/subscribe";

import { VNode, VNodeStream } from "./elements";

const availableColors = [
	"black",
	"blackBright",
	"red",
	"redBright",
	"green",
	"greenBright",
	"yellow",
	"yellowBright",
	"blue",
	"blueBright",
	"magenta",
	"magentaBright",
	"cyan",
	"cyanBright",
	"white",
	"whiteBright",
	"gray",
	"grey",
] as const;

let Yoga: typeof import("yoga-layout");

const clone = (x: any) => JSON.parse(JSON.stringify(x));

const hexToRgb = (hex: string) => {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			}
		: null;
};

type TuiNode = {
	type: string;
	parent: TuiNode | null;
	props?: Record<string, any>;
	yoga: YogaNode;
	children: Array<TuiNode | string | null>;
};

export const create = (
	parent: TuiNode,
	node: VNode,
	write: () => void,
): {
	element: TuiNode | string | null;
	unsubscribes: Array<Dispose>;
} => {
	if (node === undefined || node === null) {
		return { element: null, unsubscribes: [] };
	}

	if (typeof node === "string") {
		const element: TuiNode = {
			type: "text",
			parent,
			yoga: Yoga.Node.create(),
			children: [node],
		};

		element.yoga.setMeasureFunc(
			(width, _widthMeasureMode, height, _heightMeasureMode) => {
				const style = getComputedStyle(element);

				const textHeight =
					element.props?.textWrap ?? true
						? wrap(node, width, {}).split("\n").length
						: node.split("\n").length;

				return {
					width: widestLine(node),
					height:
						style.overflow === "hidden"
							? Math.min(textHeight, height)
							: textHeight,
				};
			},
		);

		parent.yoga.insertChild(element.yoga, parent.yoga.getChildCount());

		return { element, unsubscribes: [] };
	}

	const yoga = Yoga.Node.create();

	const props = node.props ?? {};

	props.textWrap = props.textWrap ?? true;

	const unsubscribes: Array<Dispose> = [];

	for (const prop in props) {
		if (prop === "color" || prop === "background") {
			const value = props[prop];

			if (!availableColors.includes(value)) {
				throw new Error(
					`Invalid color "${value}", expected one of: ${availableColors.join(
						", ",
					)}`,
				);
			}
		} else if (prop === "width" && props[prop] === "auto") {
			yoga.setWidthAuto();
		} else if (prop === "height" && props[prop] === "auto") {
			yoga.setHeightAuto();
		} else if (prop === "overflow") {
			if (props[prop] === "hidden") {
				yoga.setOverflow(Yoga.OVERFLOW_HIDDEN);
			} else if (props[prop] === "scroll") {
				yoga.setOverflow(Yoga.OVERFLOW_SCROLL);
			} else if (props[prop] === "visible") {
				yoga.setOverflow(Yoga.OVERFLOW_VISIBLE);
			}
		} else if (prop === "flexDirection") {
			if (props[prop] === "row") {
				yoga.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
			} else if (props[prop] === "column") {
				yoga.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
			} else if (props[prop] === "rowReverse") {
				yoga.setFlexDirection(Yoga.FLEX_DIRECTION_ROW_REVERSE);
			} else if (props[prop] === "columnReverse") {
				yoga.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN_REVERSE);
			}
		} else if (prop === "alignSelf") {
			if (props[prop] === "auto") {
				yoga.setAlignSelf(Yoga.ALIGN_AUTO);
			} else if (props[prop] === "flex-start") {
				yoga.setAlignSelf(Yoga.ALIGN_FLEX_START);
			} else if (props[prop] === "center") {
				yoga.setAlignSelf(Yoga.ALIGN_CENTER);
			} else if (props[prop] === "flex-end") {
				yoga.setAlignSelf(Yoga.ALIGN_FLEX_END);
			} else if (props[prop] === "stretch") {
				yoga.setAlignSelf(Yoga.ALIGN_STRETCH);
			} else if (props[prop] === "baseline") {
				yoga.setAlignSelf(Yoga.ALIGN_BASELINE);
			} else if (props[prop] === "space-between") {
				yoga.setAlignSelf(Yoga.ALIGN_SPACE_BETWEEN);
			} else if (props[prop] === "space-around") {
				yoga.setAlignSelf(Yoga.ALIGN_SPACE_AROUND);
			}
		} else if (prop === "alignContent") {
			if (props[prop] === "auto") {
				yoga.setAlignContent(Yoga.ALIGN_AUTO);
			} else if (props[prop] === "flex-start") {
				yoga.setAlignContent(Yoga.ALIGN_FLEX_START);
			} else if (props[prop] === "center") {
				yoga.setAlignContent(Yoga.ALIGN_CENTER);
			} else if (props[prop] === "flex-end") {
				yoga.setAlignContent(Yoga.ALIGN_FLEX_END);
			} else if (props[prop] === "stretch") {
				yoga.setAlignContent(Yoga.ALIGN_STRETCH);
			} else if (props[prop] === "baseline") {
				yoga.setAlignContent(Yoga.ALIGN_BASELINE);
			} else if (props[prop] === "space-between") {
				yoga.setAlignContent(Yoga.ALIGN_SPACE_BETWEEN);
			} else if (props[prop] === "space-around") {
				yoga.setAlignContent(Yoga.ALIGN_SPACE_AROUND);
			}
		} else if (prop === "alignItems") {
			if (props[prop] === "auto") {
				yoga.setAlignItems(Yoga.ALIGN_AUTO);
			} else if (props[prop] === "flex-start") {
				yoga.setAlignItems(Yoga.ALIGN_FLEX_START);
			} else if (props[prop] === "center") {
				yoga.setAlignItems(Yoga.ALIGN_CENTER);
			} else if (props[prop] === "flex-end") {
				yoga.setAlignItems(Yoga.ALIGN_FLEX_END);
			} else if (props[prop] === "stretch") {
				yoga.setAlignItems(Yoga.ALIGN_STRETCH);
			} else if (props[prop] === "baseline") {
				yoga.setAlignItems(Yoga.ALIGN_BASELINE);
			} else if (props[prop] === "space-between") {
				yoga.setAlignItems(Yoga.ALIGN_SPACE_BETWEEN);
			} else if (props[prop] === "space-around") {
				yoga.setAlignItems(Yoga.ALIGN_SPACE_AROUND);
			}
		} else if (prop === "justifyContent") {
			if (props[prop] === "flex-start") {
				yoga.setJustifyContent(Yoga.JUSTIFY_FLEX_START);
			} else if (props[prop] === "center") {
				yoga.setJustifyContent(Yoga.JUSTIFY_CENTER);
			} else if (props[prop] === "flex-end") {
				yoga.setJustifyContent(Yoga.JUSTIFY_FLEX_END);
			} else if (props[prop] === "space-evenly") {
				yoga.setJustifyContent(Yoga.JUSTIFY_SPACE_EVENLY);
			} else if (props[prop] === "space-between") {
				yoga.setJustifyContent(Yoga.JUSTIFY_SPACE_BETWEEN);
			} else if (props[prop] === "space-around") {
				yoga.setJustifyContent(Yoga.JUSTIFY_SPACE_AROUND);
			}
		} else if (prop === "position") {
			if (props[prop] === "absolute") {
				yoga.setPositionType(Yoga.POSITION_TYPE_ABSOLUTE);
			} else if (props[prop] === "relative") {
				yoga.setPositionType(Yoga.POSITION_TYPE_RELATIVE);
			}
		} else if (prop === "top") {
			if (typeof props[prop] === "string") {
				yoga.setPositionPercent(
					Yoga.EDGE_TOP,
					Number(props[prop].substring(0, props[prop].length - 1)),
				);
			} else {
				yoga.setPosition(Yoga.EDGE_TOP, props[prop]);
			}
		} else if (prop === "left") {
			if (typeof props[prop] === "string") {
				yoga.setPositionPercent(
					Yoga.EDGE_LEFT,
					Number(props[prop].substring(0, props[prop].length - 1)),
				);
			} else {
				yoga.setPosition(Yoga.EDGE_LEFT, props[prop]);
			}
		} else if (prop === "right") {
			if (typeof props[prop] === "string") {
				yoga.setPositionPercent(
					Yoga.EDGE_RIGHT,
					Number(props[prop].substring(0, props[prop].length - 1)),
				);
			} else {
				yoga.setPosition(Yoga.EDGE_RIGHT, props[prop]);
			}
		} else if (prop === "bottom") {
			if (typeof props[prop] === "string") {
				yoga.setPositionPercent(
					Yoga.EDGE_BOTTOM,
					Number(props[prop].substring(0, props[prop].length - 1)),
				);
			} else {
				yoga.setPosition(Yoga.EDGE_BOTTOM, props[prop]);
			}
		} else if (prop === "margin") {
			yoga.setMargin(Yoga.EDGE_ALL, props[prop]);
		} else if (prop === "marginLeft") {
			yoga.setMargin(Yoga.EDGE_LEFT, props[prop]);
		} else if (prop === "marginRight") {
			yoga.setMargin(Yoga.EDGE_RIGHT, props[prop]);
		} else if (prop === "marginTop") {
			yoga.setMargin(Yoga.EDGE_TOP, props[prop]);
		} else if (prop === "marginBottom") {
			yoga.setMargin(Yoga.EDGE_BOTTOM, props[prop]);
		} else if (prop === "padding") {
			yoga.setPadding(Yoga.EDGE_ALL, props[prop]);
		} else if (prop === "paddingLeft") {
			yoga.setPadding(Yoga.EDGE_LEFT, props[prop]);
		} else if (prop === "paddingRight") {
			yoga.setPadding(Yoga.EDGE_RIGHT, props[prop]);
		} else if (prop === "paddingTop") {
			yoga.setPadding(Yoga.EDGE_TOP, props[prop]);
		} else if (prop === "paddingBottom") {
			yoga.setPadding(Yoga.EDGE_BOTTOM, props[prop]);
		} else {
			const method = `set${prop[0].toUpperCase()}${prop.slice(1)}`;

			if (yoga[method as keyof typeof yoga]) {
				const args = [].concat(props[prop]);

				// @ts-expect-error
				yoga[method as keyof typeof yoga](...args);
			}
		}
	}

	const element: TuiNode = {
		type: node.type,
		parent,
		yoga,
		props,
		children: [],
	};

	let children: Array<VNode | VNodeStream | { tui: VNodeStream }>;

	if (typeof node.children === "function") {
		children = [node.children];
	} else if (Array.isArray(node.children)) {
		children = node.children;
	} else if (node.children != null) {
		children = [node.children];
	} else {
		children = [];
	}

	parent.yoga.insertChild(element.yoga, parent.yoga.getChildCount());

	for (let child of children) {
		if (typeof child === "object" && child !== null && "tui" in child) {
			child = child.tui;
		}

		if (typeof child === "function") {
			// TODO: Handle streams
		} else {
			const result = create(element, child, write);

			element.children.push(result.element);

			unsubscribes.push(...result.unsubscribes);
		}
	}

	return {
		element,
		unsubscribes,
	};
};

type OutputCharacter = {
	value: string;
	style?: Record<string, string>;
};

type ScreenOutput = Array<Array<OutputCharacter>>;

export const getBoundingClientRect = (node: YogaNode) => {
	const layout = node.getComputedLayout();

	const bounds = {
		top: layout.top,
		left: layout.left,
		right: layout.left + layout.width,
		bottom: layout.top + layout.height,
		width: layout.width,
		height: layout.height,
	};

	let parent: YogaNode | null = node;

	while ((parent = parent.getParent())) {
		const parentBounds = parent.getComputedLayout();

		bounds.left += parentBounds.left;
		bounds.top += parentBounds.top;
		bounds.right += parentBounds.right;
		bounds.bottom += parentBounds.bottom;
	}

	return bounds;
};

const getOverflowParentBoundingClientRect = (node: TuiNode) => {
	let parent = node.yoga;

	while (true) {
		const newParent = parent.getParent();

		if (!newParent) {
			break;
		}

		parent = newParent;

		if (parent.getOverflow() === Yoga.OVERFLOW_HIDDEN) {
			break;
		}
	}

	return getBoundingClientRect(parent);
};

export const getComputedStyle = (node: TuiNode) => {
	let style: Record<string, any> = {};

	if (node.parent) {
		style = { ...getComputedStyle(node.parent) };
	}

	if (node.props?.color) {
		style.color = node.props.color;
	}

	if (node.props?.background) {
		style.background = node.props.background;
	}

	if (node.props?.bold) {
		style.bold = true;
	}

	if (node.props?.dim) {
		style.dim = true;
	}

	if (node.props?.italic) {
		style.italic = true;
	}

	if (node.props?.underline) {
		style.underline = true;
	}

	if (node.props?.strikethrough) {
		style.strikethrough = true;
	}

	if (node.props?.textWrap) {
		style.textWrap = node.props.textWrap;
	}

	if (node.props?.overflow) {
		style.overflow = node.props.overflow;
	}

	return style;
};

export const output = (
	node: TuiNode,
	stdout: NodeJS.WriteStream,
	screen: ScreenOutput,
	overlay = false,
	debug = false,
): Array<TuiNode> => {
	if (!overlay && node.yoga.getPositionType() === Yoga.POSITION_TYPE_ABSOLUTE) {
		return [node];
	}

	if (node.type === "root") {
		let absolute: Array<TuiNode> = [];

		for (const child of node.children) {
			if (!child) {
				continue;
			}

			if (typeof child === "string") {
				stdout.write(child);
			} else {
				const result = output(child, stdout, screen, false, debug);

				if (result.length) {
					absolute.push(...result);
				}
			}
		}

		absolute = absolute.sort((a, b) => {
			if (!a.props?.zIndex && !b.props?.zIndex) {
				return 0;
			}

			if (!a.props?.zIndex) {
				return -1;
			}

			if (!b.props?.zIndex) {
				return 1;
			}

			return a.props?.zIndex - b.props?.zIndex;
		});

		for (const child of absolute) {
			output(child, stdout, screen, true, debug);
		}

		for (let y = 0; y < screen.length; y++) {
			// PERF: Optimize the use of escape sequences for colors, etc to not be on a per-character basis.
			let line = "";

			for (let x = 0; x < screen[y].length; x++) {
				const character = screen[y][x];
				let text = character.value;

				if (character.style) {
					if (character.style.color) {
						// @ts-expect-error
						text = colors[character.style.color](text);
					}

					if (character.style.background) {
						text =
							// @ts-expect-error
							colors[
								`bg${
									character.style.background[0].toUpperCase() +
									character.style.background.substring(1)
								}`
							](text);
					}

					if (character.style.bold) {
						text = colors.bold(text);
					}

					if (character.style.dim) {
						text = colors.dim(text);
					}

					if (character.style.italic) {
						text = colors.italic(text);
					}

					if (character.style.underline) {
						text = colors.underline(text);
					}

					if (character.style.strikethrough) {
						text = colors.strikethrough(text);
					}
				}

				line += text;
			}

			if (!debug) {
				stdout.write(line);
			}
		}
	} else if (node.type === "box") {
		const style = getComputedStyle(node);
		const bounds = getBoundingClientRect(node.yoga);
		const overflowBounds = getOverflowParentBoundingClientRect(node);

		for (
			let y = Math.max(bounds.top, overflowBounds.top);
			y < bounds.top + bounds.height &&
			y >= overflowBounds.top &&
			y < overflowBounds.top + overflowBounds.height;
			y++
		) {
			for (
				let x = Math.max(bounds.left, overflowBounds.left);
				x < bounds.left + bounds.width &&
				x >= overflowBounds.left &&
				x < overflowBounds.left + overflowBounds.width;
				x++
			) {
				screen[y][x] = {
					value: " ",
					style,
				};
			}
		}

		let absolute: Array<TuiNode> = [];

		for (const child of node.children) {
			if (!child) {
				continue;
			}

			if (typeof child === "string") {
				stdout.write(child);
			} else {
				const result = output(child, stdout, screen);

				if (result.length) {
					absolute.push(...result);
				}
			}
		}

		return absolute;
	} else if (node.type === "text") {
		let text = node.children
			.filter((child) => typeof child === "string")
			.join("");

		const style = getComputedStyle(node);
		const bounds = getBoundingClientRect(node.yoga);
		const overflowBounds = getOverflowParentBoundingClientRect(node);

		const lines = style?.textWrap
			? wrap(text, bounds.width, {
					trim: false,
					hard: true,
				}).split("\n")
			: text.split("\n");

		for (let y = 0; y < lines.length; y++) {
			if (
				y + bounds.top < overflowBounds.top ||
				y + bounds.top >= overflowBounds.top + overflowBounds.height
			) {
				continue;
			}

			if (style?.overflow === "hidden" && y >= bounds.height) {
				break;
			}

			const line = lines[y];
			for (let x = 0; x < line.length; x++) {
				if (
					x + bounds.left < overflowBounds.left ||
					x + bounds.left >= overflowBounds.left + overflowBounds.width
				) {
					continue;
				}

				if (style?.overflow === "hidden" && x >= bounds.width) {
					break;
				}

				const character = line[x];

				screen[bounds.top + y][bounds.left + x] = {
					value: character,
					style,
				};
			}
		}
	}

	return [];
};

export const render = async (
	stdin: NodeJS.ReadStream,
	stdout: NodeJS.WriteStream,
	source: Source<any>,
) => {
	Yoga = await loadYoga();

	let unsubscribes: Array<Dispose> = [];

	const root: TuiNode = {
		type: "root",
		parent: null,
		yoga: Yoga.Node.create(),
		children: [],
	};

	root.yoga.setWidth(stdout.columns);
	root.yoga.setHeight(stdout.rows);

	let isFirstWrite = true;
	let debug = false;

	stdout.write(ansi.enterAlternativeScreen);

	stdout.addListener("close", () => {
		stdout.write(ansi.exitAlternativeScreen);
	});

	const write = () => {
		root.yoga.calculateLayout(stdout.columns, stdout.rows, Yoga.DIRECTION_LTR);

		const screen: ScreenOutput = Array.from({ length: stdout.rows }, () => {
			return Array.from({ length: stdout.columns }, () => {
				return { value: " " };
			});
		});

		if (!isFirstWrite && !debug) {
			stdout.write(ansi.clearScreen);
		}

		output(root, stdout, screen, false, debug);

		// NOTE: Without this, resizing does not properly rerender the output at the beginning of the screen.
		stdout.write(ansi.cursorTo(0, 0));
		stdout.write("");
	};

	stdout.addListener("resize", () => {
		// console.log("resize", stdout.columns, stdout.rows);
		root.yoga.setWidth(stdout.columns);
		root.yoga.setHeight(stdout.rows);

		write();
	});

	source(Signal.Start, (type, data) => {
		if (type === Signal.Data) {
			for (const unsubscribe of unsubscribes) {
				unsubscribe();
			}

			for (const child of root.children) {
				if (typeof child === "object" && child !== null) {
					root.yoga.removeChild(child.yoga);
					child.yoga.freeRecursive();
				}
			}

			root.children = [];

			const result = create(root, data, write);

			unsubscribes = result.unsubscribes;
			root.children = [result.element];

			write();
		}
	});
};
