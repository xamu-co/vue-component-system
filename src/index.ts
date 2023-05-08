import { App } from "vue";
import capitalize from "lodash/capitalize";

import components from "./components";
import type { iPluginOptions } from "./types";

type tComponentKey = keyof typeof components;

const plugin = {
	install<T>(V: App<T>, options?: iPluginOptions<tComponentKey>) {
		// define options fallbacks
		const pluginOptions: iPluginOptions<tComponentKey> = {
			globalComponents: true,
			...options,
		};

		// Set plugin options globally
		V.provide("vueComponentSystem", pluginOptions);

		if (!pluginOptions.globalComponents) return;

		// Filter components
		const componentKeys: tComponentKey[] = Array.isArray(pluginOptions.globalComponents)
			? pluginOptions.globalComponents
			: (Object.keys(components) as tComponentKey[]);

		// Register components
		componentKeys.forEach((key) => {
			const component = components[key];
			V.component(capitalize(pluginOptions.componentsPrefix) + key, component);
		});
	},
};

declare module "@vue/runtime-core" {
	export interface GlobalComponents {
		IconFa: (typeof components)["IconFa"];
		Icon: (typeof components)["Icon"];
		Action: (typeof components)["Action"];
		ActionButton: (typeof components)["ActionButton"];
		ActionButtonLink: (typeof components)["ActionButtonLink"];
		ActionButtonToggle: (typeof components)["ActionButtonToggle"];
		ActionLink: (typeof components)["ActionLink"];
		ActionLinkBox: (typeof components)["ActionLinkBox"];
	}
}

export default plugin;
