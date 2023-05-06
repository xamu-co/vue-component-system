import { App, h } from "vue";
import capitalize from "lodash/capitalize";

import components from "./components";

type tComponentKey = keyof typeof components;

interface iPluginOptions {
	// include?: tComponentKey[];
	// exclude?: tComponentKey[];
	/**
	 * Components prefix
	 *
	 * @default x
	 * @example x-component-name or XComponentName
	 */
	componentPrefix?: string;
}

const defaultOptions: iPluginOptions = {
	componentPrefix: "x",
};

const plugin = {
	install<T>(V: App<T>, options: iPluginOptions = defaultOptions) {
		let key: tComponentKey;
		for (key in components) {
			const component = components[key];
			const wrappedComponent = h(component, {});
			V.component(capitalize(options.componentPrefix) + key, wrappedComponent);
		}
	},
};

export default plugin;
