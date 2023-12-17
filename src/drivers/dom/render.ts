import { Signal, Source } from "../../streams/interface";
import { Dispose, subscribe } from "../../streams/sinks/subscribe";
import { VNode } from "./elements";

const empty = (element: Element) => {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
};

export const create = <T extends Element>(root: T, node: VNode) => {
	if (node === undefined || node === null) {
		return { element: document.createComment("neu:node"), unsubscribes: [] };
	}

	if (typeof node === "string") {
		return { element: document.createTextNode(node), unsubscribes: [] };
	}

	const element = document.createElement(node.type);

	const props = node.props ?? {};

	for (const key in props) {
		if (key.startsWith("on")) {
			const name = key.slice(2).toLowerCase();
			element.addEventListener(name, props[key]);
		} else {
			if (key in element) {
				// @ts-expect-error
				element[key] = props[key];
			} else {
				element.setAttribute(key, props[key]);
			}
		}
	}

	const unsubscribes: Array<Dispose> = [];

	for (const child of node.children ?? []) {
		if (typeof child === "function") {
			let childElement: Element | Comment = document.createComment("neu:node");
			let childUnsubscribes: Array<Dispose> = [];

			element.appendChild(childElement);

			const unsubscribe = subscribe<VNode, any>((value) => {
				const result = create(element, value);
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

	for (const key in props) {
		if (key.startsWith("on")) {
			const name = key.slice(2).toLowerCase();
			element.addEventListener(name, props[key]);
		} else {
			if (key in element) {
				// @ts-expect-error
				element[key] = props[key];
			} else {
				element.setAttribute(key, props[key]);
			}
		}
	}

	const unsubscribes: Array<Dispose> = [];

	for (const child of node.children ?? []) {
		if (typeof child === "function") {
			let childElement: Element | Comment = document.createComment("");
			let childUnsubscribes: Array<Dispose> = [];

			element.appendChild(childElement);

			const unsubscribe = subscribe<VNode, any>((value) => {
				const result = create(element, value);
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
