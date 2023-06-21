import { PropType } from "vue";

import type { tProp, tProps, tPropsModifier } from "@open-xamu-co/components-types";
import { GlobalModifiersProps } from "../modifiers/global";
import { StateModifiersProps } from "../modifiers/state";
import { ThemeModifiersProps } from "../modifiers/theme";

type tActionType = "button" | "submit" | "reset";

type tIndicativeValue<Co extends Uppercase<string> = "CO", I extends number = 57> = `${Co}+${I}`;

/**
 * Action listeners
 */
export function actionListeners(emit: any) {
	return {
		focus: (e: any) => emit("focus", e),
		blur: (e: any) => emit("blur", e),
		click: (e: any) => emit("click", e),
		submit: (e: any) => emit("submit", e),
	};
}

/**
 * Action Props
 *
 * @props
 */
export const ActionProps = {
	...GlobalModifiersProps,
	...StateModifiersProps,
	...ThemeModifiersProps,
	id: {
		type: String,
		default: null,
	},
	to: {
		type: [String, Object] as PropType<string | Record<string, any>>,
		default: null,
	},
	href: {
		type: String,
		default: null,
	},
	target: {
		type: String,
		default: null,
	},
	tel: {
		type: String,
		default: null,
	},
	/**
	 * email adress
	 */
	mailto: {
		type: String,
		default: null,
		// validator(email: any) {
		// 	return isEmail(email);
		// },
	},
	/**
	 * disable
	 */
	disabled: {
		type: Boolean,
		default: false,
	},
	/**
	 * type
	 */
	type: {
		type: String as PropType<tActionType>,
		default: null,
	},
	tag: {
		type: String,
		default: "button",
	},
	/**
	 * Toggleable type
	 * Right now we only support "Dropdown"
	 */
	toggle: {
		type: [String, Object] as PropType<tProp<"dropdown">>,
		default: null,
	},
	/**
	 * While this is button only, there are some cases where is useful for links
	 */
	round: {
		type: [Boolean, String, Array] as PropType<tPropsModifier>,
		default: null,
	},
	tooltip: {
		type: [String, Object] as PropType<tProp>,
		default: null,
	},
	tooltipPosition: {
		type: String as PropType<"right" | "left" | "bottom" | "top">,
		default: "right",
	},
	tooltipAsText: {
		type: Boolean,
		default: null,
	},
	toggleState: {
		type: [String, Array, Object] as PropType<tProps>,
		default: null,
	},
	/**
	 * Phone indicative
	 * override & set default
	 */
	indicative: {
		type: String as PropType<tIndicativeValue>,
		default: "CO+57",
	},
};
