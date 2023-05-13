import type { Component, DefineComponent } from "vue";

// import type * as components from "../components";
import { tPluginLocale } from "./locale";

export interface iPluginOptions<K extends string = string> {
	/**
	 * Register all or specific components globally
	 */
	globalComponents?: boolean | K[];
	/**
	 * Components prefix
	 *
	 * @default x
	 * @example component-name or XComponentName
	 */
	componentsPrefix?: string;
	/**
	 * Router component
	 * If a router like "vue-router" is used this component is required for buttons to work
	 */
	routerComponent?: Component<any> | DefineComponent<any>;
	/**
	 * Image component
	 * Optional image optimization component
	 */
	imageComponent?: Component<any> | DefineComponent<any>;
	/**
	 * Global locale values
	 */
	locale?: tPluginLocale;
}
