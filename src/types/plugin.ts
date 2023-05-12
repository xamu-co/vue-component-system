import type { Component, DefineComponent } from "vue";

import type components from "../components";

export interface iPluginOptions<K extends string = string> {
	/**
	 * Register all or specific components globally
	 */
	globalComponents?: boolean | K[];
	/**
	 * Components prefix
	 *
	 * @default x
	 * @example x-component-name or XComponentName
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
}

declare module "@vue/runtime-core" {
	export interface GlobalComponents {
		Img: (typeof components)["Img"];
		// icon
		IconFa: (typeof components)["IconFa"];
		Icon: (typeof components)["Icon"];
		// action
		Action: (typeof components)["Action"];
		ActionButton: (typeof components)["ActionButton"];
		ActionButtonLink: (typeof components)["ActionButtonLink"];
		ActionButtonToggle: (typeof components)["ActionButtonToggle"];
		ActionLink: (typeof components)["ActionLink"];
		ActionLinkBox: (typeof components)["ActionLinkBox"];
	}
}
