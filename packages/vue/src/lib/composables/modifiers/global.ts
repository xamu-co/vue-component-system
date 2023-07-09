import { computed, inject, PropType } from "vue";

import type {
	iPluginOptions,
	tComposableProps,
	tPropsModifier,
} from "@open-xamu-co/components-types";
import { UtilsComposable } from "@open-xamu-co/components-helpers";

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
	const systemOptions = inject<iPluginOptions>("vueComponentSystem");
	const { getModifierClasses } = UtilsComposable(systemOptions);

	const sizeClasses = computed<string[]>(() => {
		const size = String(props.size);
		return props.size ? getModifierClasses([size], { modifier: "size", divider: "-" }) : [];
	});
	const hiddenClasses = computed<string[]>(() => {
		return props.hidden ? getModifierClasses(props.hidden, { modifier: "hidden" }) : [];
	});

	return computed<string[]>(() => [hiddenClasses.value, sizeClasses.value].flat(2));
}
