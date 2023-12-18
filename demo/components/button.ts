import { clsx, css } from "@littlethings/css";
import { isVNode } from "~/drivers/dom/elements";

import * as neu from "~/index";

const ButtonClass = css({});

export const Button: typeof neu.dom.button = (props, children) => {
	if (Array.isArray(props) || isVNode(props)) {
		return neu.dom.button({}, props);
	} else {
		return neu.dom.button(
			{
				...props,
				class: clsx(ButtonClass, props?.class),
			},
			children,
		);
	}
};
