import interpolate from "interpolate-string";
import get from "lodash/get";
import trim from "lodash/trim";

import { iPluginOptions, tPluginLocale, tPropsModifier } from "../types";
import { inject } from "vue";

interface igetModifiersArgs {
	modifier?: string;
	suffix?: string;
	divider?: string;
	/**
	 * internal usage only
	 */
	modifierClass?: string;
}

/**
 * Utils Composable
 *
 * @composable
 */
export function UtilsComposable() {
	const vueComponentSystem = inject<iPluginOptions>("vueComponentSystem");

	/**
	 * returns the modifier classes
	 *
	 * @examples "--modifier", "--modifier-value", "suffi-modifier-value", "suffi-value"
	 */
	function getModifierClasses(
		values: tPropsModifier,
		config?: { modifier: string; divider?: string }
	): string[];
	function getModifierClasses(values: tPropsModifier, config: { suffix: string }): string[];
	function getModifierClasses(
		values: tPropsModifier,
		config?: { modifier: string; suffix: string; divider?: string }
	): string[];
	function getModifierClasses(
		values: tPropsModifier,
		config?: { modifierClass: string }
	): string[];
	function getModifierClasses(values: tPropsModifier, config?: igetModifiersArgs): string[] {
		if (!values) return [];

		const suffix = config?.suffix || "";
		const modifier = config?.modifier || "";
		const divider = config?.divider || "";
		const modifierClass = config?.modifierClass || `${suffix}--${modifier + divider}`;
		if (Array.isArray(values)) {
			return values
				.map((value) => {
					if (typeof value === "string") return modifierClass + value;

					return Object.keys(value).map((key) => {
						if (!!value[key]) return modifierClass + value;
					});
				})
				.flat(2)
				.filter((value): value is string => !!value);
		} else if (typeof values === "boolean") {
			return [modifierClass];
		}

		return getModifierClasses([values], { modifierClass });
	}

	/**
	 * returns the compatible prop data
	 * this function asumes your object only contains a key
	 */
	function getPropData<T extends any>(prop: any): T | undefined {
		if (typeof prop !== "string" && !Array.isArray(prop) && prop !== null) {
			const key = Object.keys(prop)[0];
			if (!prop[key] || !isNaN(parseInt(key))) return undefined;
			return key as T;
		}
		return prop as T;
	}

	/**
	 * Interpolates localized text
	 *
	 * @param locale Text to interpolate. Ex: "Hello {name}!"
	 * @param data Optional number or variables to interpolate into text
	 * @returns {string}
	 */
	function getLocale(
		key:
			| Exclude<keyof tPluginLocale, "dialog">
			| `dialog.${keyof Required<tPluginLocale>["dialog"]}`,
		data?: number | { [key: string]: any; count?: number }
	): string {
		// console.log("before error");
		let locale = get(vueComponentSystem?.locale || {}, key, "NO LOCALE");
		// console.log("after error", locale);
		const pattern = /\{(.+?)\}/g;
		const plurals = locale.split("|");
		const count = typeof data === "number" ? data : data?.count ?? -1;

		// Pluralization
		if (count > -1 && plurals.length > 1) {
			if (plurals.length === 2) {
				// product, products
				locale = plurals[count > 1 ? 1 : 0];
			} else if (plurals.length === 3) {
				// no products, product, products
				locale = plurals[count ? (count > 1 ? 2 : 1) : 0];
			}
		}

		return interpolate(trim(locale), typeof data === "number" ? {} : data, pattern);
	}

	function isBrowser(): boolean {
		return typeof window !== "undefined";
	}

	return { getModifierClasses, getPropData, getLocale, isBrowser };
}
