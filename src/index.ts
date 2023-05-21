import { App, Plugin } from "vue";
import capitalize from "lodash/capitalize";

import { tPropertyMapping } from "@open-xamu-co/common-types";

import * as components from "./components";
import type { iPluginOptions } from "./types";

type tComponentKey = keyof typeof components;

export const vueComponentSystemPlugin: Plugin = {
	install(V: App, options: iPluginOptions<tComponentKey>) {
		// Define options defaults
		const pluginOptions: iPluginOptions<tComponentKey> = {
			globalComponents: true,
			componentsPrefix: "x",
			laptopMQPx: 1080,
			tabletMQPx: 768,
			mobileMQPx: 576,
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
			const componentName = capitalize(pluginOptions.componentsPrefix) + key;

			/**
			 * There is an issue with custom elements and emits
			 *
			 * @see https://github.com/vuejs/core/issues/7782P
			 */
			if (pluginOptions.webComponents) {
				// register as a web component
				// const webComponent = defineCustomElement(component);
				// customElements.define(kebabCase(componentName), webComponent);
			} else {
				// register as a Vue component
				V.component(componentName, component);
			}
		});
	},
};

// TODO: (filter components & add suffix) plugin based
declare module "@vue/runtime-core" {
	export interface GlobalComponents extends tPropertyMapping<typeof components, string> {}
}

export * from "./components";
export * from "./composables";
