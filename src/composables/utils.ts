import { eColors } from "@open-xamu-co/common-enums";
import { tThemeModifier, tThemeTuple } from "@open-xamu-co/common-types";

import { tProp, tPropsModifier } from "../types";

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
export default function UtilsComposable() {
	/**
	 * returns the modifier classes
	 *
	 * @examples "--modifier", "--modifier-value", "suffix--modifier-value", "suffix--value"
	 */
	function getModifierClasses(
		values: tPropsModifier,
		config: { modifier: string; divider?: string }
	): string[];
	function getModifierClasses(values: tPropsModifier, config: { suffix: string }): string[];
	function getModifierClasses(
		values: tPropsModifier,
		config: { modifier: string; suffix: string; divider?: string }
	): string[];
	function getModifierClasses(
		values: tPropsModifier,
		config: { modifierClass: string }
	): string[];
	function getModifierClasses(values: tPropsModifier, config: igetModifiersArgs): string[] {
		if (!values) return [];

		const suffix = config.suffix || "";
		const modifier = config.modifier || "";
		const divider = config.divider || "";
		const modifierClass = config.modifierClass || `${suffix}--${modifier + divider}`;
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
	 * returns the theme classes
	 */
	function getThemeClasses(
		values: tThemeTuple | tProp<tThemeModifier>,
		isUnion = false
	): string[] {
		if (!values) return [];

		const modifier = "tm";
		if (Array.isArray(values)) {
			if (isUnion) values[1] = values[1] || eColors.LIGHT;

			return getModifierClasses([values.join("-")], { modifier });
		} else if (typeof values === "object") {
			return (Object.keys(values) as tThemeModifier[])
				.map((key) => {
					if (!!values[key]) return getThemeClasses([key], isUnion);
				})
				.flat(2)
				.filter((value): value is string => !!value);
		}

		return getThemeClasses([values], isUnion);
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
	return { getModifierClasses, getThemeClasses, getPropData };
}
