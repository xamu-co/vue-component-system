import { computed, PropType } from "vue";

import type { tComposableProps, tPropsModifier } from "../../types";
import { UtilsComposable } from "../utils";

/**
 * Global Modifiers Props
 *
 * @props
 */
export const GlobalModifiersProps = {
	hidden: {
		type: [Boolean, String, Array, Object] as PropType<tPropsModifier>,
		default: null,
	},
	size: {
		type: [String, Number],
		default: null,
	},
};

/**
 * Global Modifiers Composable
 * Add support for global style modifiers (HTML classes)
 *
 * @param props compatible vue props
 * @composable
 */
export function GlobalModifiersComposable(props: tComposableProps<typeof GlobalModifiersProps>) {
	const { getModifierClasses } = UtilsComposable();

	const sizeClasses = computed<string[]>(() => {
		const size = String(props.size);
		return props.size ? getModifierClasses([size], { modifier: "size", divider: "-" }) : [];
	});
	const hiddenClasses = computed<string[]>(() => {
		return props.hidden ? getModifierClasses(props.hidden, { modifier: "hidden" }) : [];
	});

	return computed<string[]>(() => [hiddenClasses.value, sizeClasses.value].flat(2));
}
