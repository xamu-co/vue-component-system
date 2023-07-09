import { tPluginLocale } from "./locale";

export interface iPluginOptions<
	ComponentKeys extends string = string,
	ComponentType extends any = any
> {
	/**
	 * Use web components instead of vue components
	 */
	webComponents?: boolean;
	/**
	 * Register all or specific components globally
	 *
	 * @default true
	 */
	globalComponents?: boolean | ComponentKeys[];
	/**
	 * Components prefix
	 *
	 * @default "x"
	 * @example component-name or XComponentName
	 */
	componentsPrefix?: string;
	/**
	 * Router component
	 * If a router like "vue-router" is used this component is required for buttons to work
	 */
	routerComponent?: ComponentType;
	/**
	 * Image component
	 * Optional image optimization component
	 */
	imageComponent?: ComponentType;
	/**
	 * Global locale values
	 */
	locale?: tPluginLocale;
	/**
	 * Laptop media query limit (max-width) in px
	 *
	 * @default 1080
	 * @mediaQuery
	 */
	laptopMQPx?: number;
	/**
	 * Tablet media query limit (max-width) in px
	 *
	 * @default 768
	 * @mediaQuery
	 */
	tabletMQPx?: number;
	/**
	 * Mobile media query limit (max-width) in px
	 *
	 * @default 576
	 * @mediaQuery
	 */
	mobileMQPx?: number;
}
