import { Signal, Source } from "../../streams/interface";
import { Dispose, subscribe } from "../../streams/sinks/subscribe";
import { VNode } from "./elements";

const empty = (element: Element) => {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
};

export const create = <T extends Element>(_root: T, node: VNode) => {
	if (node === undefined || node === null) {
		return { element: document.createComment("neu:node"), unsubscribes: [] };
	}

	if (typeof node === "string") {
		return { element: document.createTextNode(node), unsubscribes: [] };
	}

	const element = document.createElement(node.type);

	const props = node.props ?? {};

	const unsubscribes: Array<Dispose> = [];

	for (const key in props) {
		if (key.startsWith("on")) {
			const name = key.slice(2).toLowerCase();
			element.addEventListener(name, props[key]);
		} else {
			const value = props[key];

			if (key in element) {
				// If it looks like a Callbag...
				if (typeof value === "function" && value.length === 2) {
					unsubscribes.push(
						subscribe((value) => {
							// @ts-expect-error
							element[key] = value;
						})(value as Source<unknown>),
					);
				} else {
					// @ts-expect-error
					element[key] = props[key];
				}
			} else {
				// If it looks like a Callbag...
				if (typeof value === "function" && value.length === 2) {
					unsubscribes.push(
						subscribe((value) => {
							element.setAttribute(key, props[key]);
						})(value as Source<unknown>),
					);
				} else {
					element.setAttribute(key, props[key]);
				}
			}
		}
	}

	for (const child of node.children ?? []) {
		if (typeof child === "function") {
			let childElement: Element | Comment = document.createComment("neu:node");
			let childUnsubscribes: Array<Dispose> = [];

			element.appendChild(childElement);

			const unsubscribe = subscribe<VNode, any>((value) => {
				const result = create(element, value);

				for (const unsubscribe of childUnsubscribes) {
					unsubscribe();
				}

				childElement.parentNode?.replaceChild(result.element, childElement);
				childElement = result.element;
				childUnsubscribes = result.unsubscribes;
			})(child);

			unsubscribes.push(() => {
				for (const unsubscribe of childUnsubscribes) {
					unsubscribe();
				}

				unsubscribe();

				if (childElement.parentNode) {
					childElement.parentNode.removeChild(childElement);
				}
			});
		} else {
			write(element, child);
		}
	}

	return { element, unsubscribes };
};

export const write = <T extends Element>(
	root: T,
	node: VNode,
): Array<Dispose> => {
	if (node === undefined || node === null) {
		return [];
	}

	if (typeof node === "string") {
		root.appendChild(document.createTextNode(node));
		return [];
	}

	const element = document.createElement(node.type);

	const props = node.props ?? {};

	const unsubscribes: Array<Dispose> = [];

	for (const key in props) {
		if (key.startsWith("on")) {
			const name = key.slice(2).toLowerCase();
			element.addEventListener(name, props[key]);
		} else {
			const value = props[key];

			if (key in element) {
				// If it looks like a Callbag...
				if (typeof value === "function" && value.length === 2) {
					unsubscribes.push(
						subscribe((value) => {
							// @ts-expect-error
							element[key] = value;
							console.log("set", key, value);
						})(value as Source<unknown>),
					);
				} else {
					// @ts-expect-error
					element[key] = props[key];
				}
			} else {
				// If it looks like a Callbag...
				if (typeof value === "function" && value.length === 2) {
					unsubscribes.push(
						subscribe((value) => {
							element.setAttribute(key, props[key]);
						})(value as Source<unknown>),
					);
				} else {
					element.setAttribute(key, props[key]);
				}
			}
		}
	}

	for (const child of node.children ?? []) {
		if (typeof child === "function") {
			let childElement: Element | Comment = document.createComment("");
			let childUnsubscribes: Array<Dispose> = [];

			element.appendChild(childElement);

			const unsubscribe = subscribe<VNode, any>((value) => {
				const result = create(element, value);

				for (const unsubscribe of childUnsubscribes) {
					unsubscribe();
				}

				childElement.parentNode?.replaceChild(result.element, childElement);
				childElement = result.element;
				childUnsubscribes = result.unsubscribes;
			})(child);

			unsubscribes.push(() => {
				for (const unsubscribe of childUnsubscribes) {
					unsubscribe();
				}

				unsubscribe();

				if (childElement.parentNode) {
					childElement.parentNode.removeChild(childElement);
				}
			});
		} else {
			write(element, child);
		}
	}

	root.appendChild(element);

	return unsubscribes;
};

export const render =
	<T extends Element>(root: T) =>
	(source: Source<any>) => {
		let unsubscribes: Array<Dispose> = [];
		source(Signal.Start, (type, node) => {
			if (type === Signal.Data) {
				for (const unsubscribe of unsubscribes) {
					unsubscribe();
				}

				empty(root);
				unsubscribes = write(root, node);
			}
		});
	};
