import type { Component, DefineComponent } from "vue";

export * from "./props";

export interface iPluginOptions<K extends string = string> {
	/**
	 * Register all or specific components globally
	 */
	globalComponents: boolean | K[];
	/**
	 * Components prefix
	 *
	 * @default x
	 * @example x-component-name or XComponentName
	 */
	componentsPrefix?: string;
	/**
	 * Router component
	 * Is a router(vue-router) is used this component is required for buttons to work
	 */
	routerComponent?: Component;
}

export type tComposableProps<T extends Record<string, any>> = InstanceType<
	DefineComponent<T>
>["$props"];
