import { computed, inject, PropType } from "vue";

import type { iPluginOptions, tComposableProps } from "@open-xamu-co/components-types";
import { UtilsComposable } from "@open-xamu-co/components-helpers";
import { toArray } from "@open-xamu-co/common-helpers";

/**
 * Modifiers props
 * Intended to be used as the base of all components
 *
 * @props
 */
export const StateModifiersProps = {
	/**
	 * Active state: Mostly useful on actions
	 * Included here to make his usage less verbose
	 *
	 * @state
	 * @example is--active
	 */
	active: {
		type: Boolean,
		default: null,
	},
	/**
	 * Invalid state: Mostly useful on inputs
	 * Included here to make his usage less verbose
	 *
	 * @state
	 * @example is--invalid
	 */
	invalid: {
		type: Boolean,
		default: null,
	},
	/**
	 * Component states
	 *
	 * @example invalid, active, alert
	 */
	state: {
		type: [Array, Object] as PropType<Record<string, boolean> | Record<string, boolean>[]>,
		default: null,
	},
};

/**
 * State Modifiers Composable
 * Add support for state style modifiers (HTML classes)
 *
 * @param props compatible vue props
 * @composable
 */
export function StateModifiersComposable(props: tComposableProps<typeof StateModifiersProps>) {
	const systemOptions = inject<iPluginOptions>("vueComponentSystem");
	const { getModifierClasses } = UtilsComposable(systemOptions);

	return computed<string[]>(() => {
		const values = [
			...toArray(props.state || []),
			{ active: !!props.active, invalid: !!props.invalid },
		];

		return props.state || props.invalid ? getModifierClasses(values, { suffix: "is" }) : [];
	});
}
