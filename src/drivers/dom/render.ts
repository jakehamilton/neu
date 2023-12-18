import { Signal, Source } from "~/streams/interface";
import { Dispose, subscribe } from "~/streams/sinks/subscribe";

import { VNode } from "./elements";

const empty = (element: Element) => {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
};

const setProperty = (element: Element, key: string, value: any) => {
	if (key === "style" && typeof value === "object" && value !== null) {
		for (const property in value) {
			// @ts-expect-error
			element.style[property] = value[property];
		}
	} else {
		// @ts-expect-error
		element[key] = value;
	}
};

const setStreamedPropertyOrAttribute = (
	element: Element,
	key: string,
	value: Source<any>,
): Array<Dispose> => {
	const unsubscribes: Array<Dispose> = [];

	if (key in element) {
		unsubscribes.push(
			subscribe((value) => {
				setProperty(element, key, value);
			})(value as Source<unknown>),
		);
	} else {
		unsubscribes.push(
			subscribe((value) => {
				element.setAttribute(key, value as string);
			})(value as Source<unknown>),
		);
	}

	return unsubscribes;
};

const setPropertyOrAttribute = (
	element: Element,
	key: string,
	value: any,
): Array<Dispose> => {
	const unsubscribes: Array<Dispose> = [];

	if (key.startsWith("on")) {
		const name = key.slice(2).toLowerCase();
		element.addEventListener(name, value);

		unsubscribes.push(() => {
			element.removeEventListener(name, value);
		});
	} else if (typeof value === "function" && value.length === 2) {
		unsubscribes.push(...setStreamedPropertyOrAttribute(element, key, value));
	} else {
		if (key in element) {
			setProperty(element, key, value);
		} else {
			element.setAttribute(key, value);
		}
	}

	return unsubscribes;
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
		const result = setPropertyOrAttribute(element, key, props[key]);

		if (result.length) {
			unsubscribes.push(...result);
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
			const result = create(element, child);

			element.appendChild(result.element);

			unsubscribes.push(...result.unsubscribes);
		}
	}

	return { element, unsubscribes };
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
				const result = create(root, node);

				unsubscribes = result.unsubscribes;
				root.appendChild(result.element);
			}
		});
	};
