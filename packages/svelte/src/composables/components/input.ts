import { PropType, computed } from "vue";
import { v4 as uuid } from "uuid";
import capitalize from "lodash/capitalize";
import type { IconName } from "@fortawesome/fontawesome-common-types";

import type { iFormIconProps, iSelectOption, tFormAutocomplete } from "@open-xamu-co/common-types";

import { tComposableProps, tInputEvents } from "@open-xamu-co/components-types";
import { GlobalModifiersComposable, GlobalModifiersProps } from "../modifiers/global.svelte";
import { StateModifiersComposable, StateModifiersProps } from "../modifiers/state";
import { ThemeModifiersComposable, ThemeModifiersProps } from "../modifiers/theme";

/**
 * Input listeners
 */
export function inputListeners(emit: any): tInputEvents {
	return {
		focus: (e: any) => emit("focus", e),
		blur: (e: any) => emit("blur", e),
		"update:modelValue": (e: any) => emit("update:modelValue", e),
	};
}

export const InputProps = {
	id: {
		type: String,
		default(): string {
			return `input${uuid().replace("-", "").substring(0, 8)}`;
		},
	},
	name: {
		type: String,
		default(): string {
			return `input${uuid().replace("-", "").substring(0, 8)}`;
		},
	},
	title: {
		type: String,
		default: null,
	},
	autocomplete: {
		type: String as PropType<tFormAutocomplete>,
		default: "on",
	},
	required: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
};

export const SelectProps = {
	...InputProps,
	modelValue: {
		type: [String, Number],
		default: null,
	},
	options: {
		type: Array as PropType<(string | number | iSelectOption)[]>,
		default: null,
	},
	/**
	 * omit specific options
	 */
	omits: {
		type: Array as PropType<(string | number)[]>,
		default() {
			return [];
		},
	},
};

export const TextInputProps = {
	placeholder: {
		type: String,
		default: null,
	},
	/**
	 * FontAwesome icon
	 */
	icon: {
		type: String as PropType<IconName>,
		default: "user-group",
	},
	iconProps: {
		type: Object as PropType<iFormIconProps>,
		default: null,
	},
};

export const NumberInputProps = {
	/**
	 * number input only
	 */
	min: {
		type: [Number, String],
		default: null,
	},
	max: {
		type: [Number, String],
		default: null,
	},
};

export const InputModifiersProps = {
	...GlobalModifiersProps,
	...StateModifiersProps,
	...ThemeModifiersProps,
	/**
	 * Intended to be overridden
	 */
	type: {
		type: String,
		default: null,
	},
};

/**
 * Input Modifiers Composable constructor
 *
 * @param themeAsUnion wheter or not prefer union theme
 * @constructor
 */
export function InputModifiersComposable(themeAsUnion: boolean = false) {
	/**
	 * Input Modifiers Composable
	 * Add support for input style modifiers (HTML classes)
	 *
	 * @param props compatible vue props
	 * @composable
	 */
	return function (props: tComposableProps<typeof InputModifiersProps>) {
		/**
		 * returns class depending of input type
		 * @param inputType
		 * @returns
		 */
		function inputTypeClass(inputType: string): string {
			switch (inputType) {
				case "checkbox":
				case "radio":
				case "select":
					return `i${capitalize(inputType)}`;
				case "switch":
				case "file":
					return "";
				default:
					return "iTxt";
			}
		}

		const globalClasses = GlobalModifiersComposable(props);
		const stateClasses = StateModifiersComposable(props);
		const { themeClasses, themeValues } = ThemeModifiersComposable(themeAsUnion)(props);

		/**
		 * Base classes for input composable based component
		 */
		const inputClasses = computed<string[]>(() => {
			return [
				globalClasses.value,
				stateClasses.value,
				themeClasses.value,
				// input class
				props.type ? [inputTypeClass(props.type)] : [],
			].flat(2);
		});

		return { inputClasses, themeClasses, themeValues };
	};
}
