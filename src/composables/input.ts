import { PropType, computed } from "vue";
import { v4 as uuid } from "uuid";
import omit from "lodash/omit";
import capitalize from "lodash/capitalize";

import type { tFormAutocomplete } from "@open-xamu-co/common-types";

import { tComposableProps, tProp, tProps } from "../types";

export type tInputText = "text" | "email" | "password" | "search" | "url" | "number" | "tel";

/**
 * input listeners/events object
 */
interface iInputEvent extends Omit<Event, "target"> {
	target: HTMLInputElement;
}
export type tInputEvents = Record<string, (e: iInputEvent) => void>;

/**
 * Should all be null by default
 */
export const InputPrototypeProps = {
	type: {
		type: String,
		default: null,
	},
	id: {
		type: String,
		default: null,
	},
	name: {
		type: String,
		default: null,
	},
	title: {
		type: String,
		default: null,
	},
	autocomplete: {
		type: String as PropType<tFormAutocomplete>,
		default: null,
	},
	required: {
		type: Boolean,
		default: null,
	},
	disabled: {
		type: Boolean,
		default: null,
	},
	classes: {
		type: [String, Array, Object] as PropType<tProps>,
		default: null,
	},
};

export const InputComposable = {
	// ...ClassesComposableProps,
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
	/**
	 * Intended to be overriden
	 */
	type: {
		type: String as PropType<any>,
		default: null,
	},
};

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
		case "switch":
			return `i${capitalize(inputType)}`;
		case "file":
			return "";
		default:
			return "iTxt";
	}
}

/**
 * Input Composable
 *
 * @composable
 */
export default function (useInnerComponentClasses: typeof useComponentClasses) {
	return function (props: tComposableProps<typeof InputComposable>) {
		const Classes = useInnerComponentClasses(props);

		/**
		 * Base classes for input composable based component
		 */
		const defaultInputClasses = computed<tProp[]>(() => [
			...Classes.defaultClasses.value,
			inputTypeClass(props.type),
		]);

		/**
		 * Input listeners
		 * only basic events no models
		 */
		function getInputListeners(emit: any): tInputEvents {
			return {
				focus: (e) => emit("focus", e),
				blur: (e) => emit("blur", e),
			};
		}

		/**
		 * returns required props
		 */
		function getProps(additionalProps = {}) {
			return omit(
				{
					...props,
					...additionalProps,
				},
				["value", "size", "modelValue"]
			);
		}

		return { getProps, defaultInputClasses, getInputListeners, ...Classes };
	};
}
