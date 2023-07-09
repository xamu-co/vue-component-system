// import capitalize from "lodash/capitalize";

// import { tPropertyMapping } from "@open-xamu-co/common-types";

// import * as components from "./components";
// import type { iPluginOptions } from "@open-xamu-co/components-types";

// type tComponentKey = keyof typeof components;

// export const svelteComponentSystemPlugin = {
// 	install(V: App, options: iPluginOptions<tComponentKey>) {
// 		// Define options defaults
// 		const pluginOptions: iPluginOptions<tComponentKey> = {
// 			globalComponents: true,
// 			componentsPrefix: "x",
// 			laptopMQPx: 1080,
// 			tabletMQPx: 768,
// 			mobileMQPx: 576,
// 			...options,
// 		};

// 		// Set plugin options globally
// 		V.provide("svelteComponentSystem", pluginOptions);

// 		if (!pluginOptions.globalComponents) return;
// 		// Filter components
// 		const componentKeys: tComponentKey[] = Array.isArray(pluginOptions.globalComponents)
// 			? pluginOptions.globalComponents
// 			: (Object.keys(components) as tComponentKey[]);

// 		// Register components
// 		componentKeys.forEach((key) => {
// 			const component = components[key];
// 			const componentName = capitalize(pluginOptions.componentsPrefix) + key;

// 			/**
// 			 * There is an issue with custom elements and emits
// 			 *
// 			 * @see https://github.com/sveltejs/core/issues/7782P
// 			 */
// 			if (pluginOptions.webComponents) {
// 				// register as a web component
// 				// const webComponent = defineCustomElement(component);
// 				// customElements.define(kebabCase(componentName), webComponent);
// 			} else {
// 				// register as a Svelte component
// 				V.component(componentName, component);
// 			}
// 		});
// 	},
// };

// export * from ".";
// export * from "./composables";
