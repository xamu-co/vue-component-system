import { App } from "vue";
import capitalize from "lodash/capitalize";
// import "sweetalert2/dist/sweetalert2.min.css";

import { tPropertyMapping } from "@open-xamu-co/common-types";

import * as components from "./components";
import type { iPluginOptions } from "./types";

type tComponentKey = keyof typeof components;

export const vueComponentSystemPlugin = {
	install<T>(V: App<T>, options?: iPluginOptions<tComponentKey>) {
		// define options fallbacks
		const pluginOptions: iPluginOptions<tComponentKey> = {
			globalComponents: true,
			componentsPrefix: "x",
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

// TODO: (filter components & add suffix) plugin based
declare module "@vue/runtime-core" {
	export interface GlobalComponents extends tPropertyMapping<typeof components, string> {}
}

export * from "./components";
export * from "./composables";
