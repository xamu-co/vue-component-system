import { computed, inject, PropType } from "vue";

import type { tThemeModifier, tThemeTuple } from "@open-xamu-co/common-types";
import type { iPluginOptions, tComposableProps, tProp } from "@open-xamu-co/components-types";
import { eColors } from "@open-xamu-co/common-enums";
import { UtilsComposable } from "@open-xamu-co/components-helpers";

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
export function ThemeModifiersComposable(themeAsUnion: boolean = false) {
	/**
	 * Theme Modifiers Composable
	 * Add support for style modifiers (HTML classes)
	 *
	 * @param props compatible vue props
	 * @composable
	 */
	return function (props: tComposableProps<typeof ThemeModifiersProps>) {
		const systemOptions = inject<iPluginOptions>("vueComponentSystem");
		const { getModifierClasses } = UtilsComposable(systemOptions);

		/**
		 * returns the theme classes
		 */
		function getThemeClasses(values: tThemeTuple): string[] {
			if (themeAsUnion) values[1] = values[1] || eColors.LIGHT;
			return getModifierClasses([values.join("-")], { modifier: "tm", divider: "-" });
		}

		/**
		 * return theme tuple
		 */
		function getThemeValues(values: tThemeTuple | tProp<tThemeModifier>): tThemeTuple {
			if (Array.isArray(values)) {
				if (themeAsUnion) values[1] = values[1] || eColors.LIGHT;
				return values;
			} else if (typeof values === "object") {
				const themeArr = (Object.keys(values) as tThemeModifier[])
					.map((key) => {
						if (!!values[key]) return getThemeValues([key]);
					})
					.filter((value): value is tThemeTuple => !!value);
				// There could be multiple valid theme combinations, but we are only returning the first one
				return themeArr[0];
			}

			return getThemeValues([values]);
		}

		const themeValues = computed<tThemeTuple>(() => {
			return getThemeValues(props.theme || eColors.SECONDARY);
		});

		const themeClasses = computed<string[]>(() => {
			return props.theme ? getThemeClasses(themeValues.value) : [];
		});

		return { themeValues, themeClasses };
	};
}
