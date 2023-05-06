import { eColors } from "@open-xamu-co/common-enums";
import { tProp, tPropsModifier, tThemeModifier, tThemeTuple } from "@open-xamu-co/common-types";

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
 * returns the modifier classes
 *
 * @examples "--modifier", "--modifier-value", "suffix--modifier-value", "suffix--value"
 */
export function getModifierClasses(
	values: tPropsModifier,
	config: { modifier: string; divider?: string }
): string[];
export function getModifierClasses(values: tPropsModifier, config: { suffix: string }): string[];
export function getModifierClasses(
	values: tPropsModifier,
	config: { modifier: string; suffix: string; divider?: string }
): string[];
export function getModifierClasses(
	values: tPropsModifier,
	config: { modifierClass: string }
): string[];
export function getModifierClasses(values: tPropsModifier, config: igetModifiersArgs): string[] {
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
export function getThemeClasses(
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
