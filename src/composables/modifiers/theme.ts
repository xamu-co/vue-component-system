import { computed, PropType } from "vue";

import type { tThemeModifier, tThemeTuple } from "@open-xamu-co/common-types";

import type { tComposableProps, tProp } from "../../types";
import UtilsComposable from "../utils";

/**
 * Theme Modifiers Props
 *
 * @param theme defaultTheme
 * @props
 */
export const ThemeModifiersProps = {
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
	return function (props: tComposableProps<typeof ThemeModifiersProps>) {
		const { getThemeClasses } = UtilsComposable();

		return computed<string[]>(() => {
			return props.theme ? getThemeClasses(props.theme, themeAsUnion) : [];
		});
	};
}
