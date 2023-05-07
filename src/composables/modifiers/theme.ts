import { computed, PropType } from "vue";

import type { tThemeModifier, tThemeTuple, tProp } from "@open-xamu-co/common-types";
import { getThemeClasses } from "@open-xamu-co/common-helpers";

import type { tComposableProps } from "../../types";

export const ThemeModifierProps = {
	theme: {
		type: [String, Array, Object] as PropType<tThemeTuple | tProp<tThemeModifier>>,
		default: null,
		required: false,
	},
};

/**
 * Theme Modifiers Composable constructor
 *
 * @param themeAsUnion wheter or not prefer union theme
 * @constructor
 */
export default function ThemeModifiersComposable(themeAsUnion: boolean = false) {
	/**
	 * Theme Modifiers Composable
	 * Add support for style modifiers (HTML classes)
	 *
	 * @param props compatible vue props
	 * @composable
	 */
	return function (props: tComposableProps<typeof ThemeModifierProps>) {
		return computed<string[]>(() => {
			return props.theme ? getThemeClasses(props.theme, themeAsUnion) : [];
		});
	};
}
