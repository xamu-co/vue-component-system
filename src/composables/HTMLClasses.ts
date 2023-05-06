import { computed, DefineComponent, PropType } from "vue";

import type {
	tThemeModifier,
	tThemeTuple,
	tProp,
	tPropsModifier,
} from "@open-xamu-co/common-types";
import { toArray } from "@open-xamu-co/common-helpers";

import { getModifierClasses, getThemeClasses } from "../utils/HTMLclasses";

export const HTMLClassesProps = {
	theme: {
		type: [String, Array, Object] as PropType<tThemeTuple | tProp<tThemeModifier>>,
		default: null,
		required: false,
	},
	/**
	 * This one is intended to be overriden on each action composable component that requires it
	 * defines if component should use union like theme
	 */
	themeAsUnion: {
		type: Boolean,
		default: false,
	},
	size: {
		type: [String, Number],
		default: null,
	},
	hidden: {
		type: [Boolean, String, Array, Object] as PropType<tPropsModifier>,
		default: false,
	},
	/**
	 * Invalid state: Mostly useful on inputs
	 * Included here to make his usage less verbose
	 */
	invalid: {
		type: Boolean,
		default: false,
	},
	state: {
		type: [Array, Object] as PropType<Record<string, boolean> | Record<string, boolean>[]>,
		default: null,
	},
};

/**
 * Classes Composable
 *
 * @composable
 */
export default function (props: InstanceType<DefineComponent<typeof HTMLClassesProps>>["$props"]) {
	const sizeClasses = computed<string[]>(() => {
		const size = String(props.size);
		return size ? getModifierClasses([size], { modifier: "size", divider: "-" }) : [];
	});
	const hiddenClasses = computed<string[]>(() => {
		return props.hidden ? getModifierClasses(props.hidden, { modifier: "hidden" }) : [];
	});
	const stateClasses = computed<string[]>(() => {
		const values = [...toArray(props.state || []), { invalid: !!props.invalid }];

		return props.state || props.invalid ? getModifierClasses(values, { suffix: "is" }) : [];
	});
	const themeClasses = computed<string[]>(() => {
		return props.theme ? getThemeClasses(props.theme, props.themeAsUnion) : [];
	});

	const defaultClasses = computed<string[]>(() =>
		[themeClasses.value, hiddenClasses.value, sizeClasses.value, stateClasses.value].flat(2)
	);

	return defaultClasses;
}
