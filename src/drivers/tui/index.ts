import { Source } from "~/streams/interface";

import { VNode } from "./elements";
import { render } from "./render";

export * from "./elements";

export type TuiSource = {};

export type TuiDriver = (source: Source<VNode>) => TuiSource;

export const driver =
	(stdin: NodeJS.ReadStream, stdout: NodeJS.WriteStream): TuiDriver =>
	(source) => {
		render(stdin, stdout, source);

		return {};
	};
