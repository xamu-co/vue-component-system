import { computed, PropType } from "vue";

import type { tPropsModifier } from "@open-xamu-co/common-types";
import { getModifierClasses } from "@open-xamu-co/common-helpers";

import type { tComposableProps } from "../../types";

export const GlobalModifierProps = {
	hidden: {
		type: [Boolean, String, Array, Object] as PropType<tPropsModifier>,
		default: false,
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
export default function GlobalModifiersComposable(
	props: tComposableProps<typeof GlobalModifierProps>
) {
	const sizeClasses = computed<string[]>(() => {
		const size = String(props.size);
		return size ? getModifierClasses([size], { modifier: "size", divider: "-" }) : [];
	});
	const hiddenClasses = computed<string[]>(() => {
		return props.hidden ? getModifierClasses(props.hidden, { modifier: "hidden" }) : [];
	});

	return computed<string[]>(() => [hiddenClasses.value, sizeClasses.value].flat(2));
}
