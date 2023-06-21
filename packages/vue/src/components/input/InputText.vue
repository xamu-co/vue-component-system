<template>
	<div class="flx --flxRow --flcenter --flx">
		<div v-if="icon && !long" v-bind="{ disabled }" :class="inputClasses">
			<Input v-model="model" v-bind="{ placeholder, type }" v-on="inputListeners(emit)" />
			<IconFa v-bind="{ ...iconProps, name: icon }" />
		</div>
		<Input
			v-else
			v-model="model"
			v-bind="{ placeholder, type: long ? 'textarea' : type }"
			:class="inputClasses"
			v-on="inputListeners(emit)"
		/>
		<template
			v-if="
				type === 'number' &&
				(Number.isInteger(Number(min)) || Number.isInteger(Number(max)))
			"
		>
			<ActionButtonToggle
				:disabled="model >= max"
				:size="size"
				:aria-label="getLocale('increase')"
				:tooltip="getLocale('increase')"
				tooltip-position="bottom"
				tooltip-as-text
				round
				@click="increase"
			>
				<IconFa name="plus" />
				<IconFa name="plus" />
			</ActionButtonToggle>
			<ActionButtonToggle
				:disabled="model <= min"
				:size="size"
				:aria-label="getLocale('decrease')"
				:tooltip="getLocale('decrease')"
				tooltip-position="bottom"
				tooltip-as-text
				round
				@click="decrease"
			>
				<IconFa name="minus" />
				<IconFa name="minus" />
			</ActionButtonToggle>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { PropType, computed } from "vue";
	import type { IconName } from "@fortawesome/fontawesome-common-types";

	import type { iFormIconProps } from "@open-xamu-co/common-types";

	import Input from "./Input.vue";
	import IconFa from "../icon/IconFa.vue";
	import ActionButtonToggle from "../action/ActionButtonToggle.vue";
	import {
		InputModifiersComposable,
		InputModifiersProps,
		InputProps,
		NumberInputProps,
		TextInputProps,
		inputListeners,
		UtilsComposable,
	} from "../../composables";

	/**
	 * Text Input element
	 * TODO: text validation
	 * TODO: validator function prop & default validator
	 *
	 * @component
	 * @example
	 * <InputText :value=""></InputText>
	 */

	const props = defineProps({
		...InputModifiersProps,
		...InputProps,
		...TextInputProps,
		...NumberInputProps,
		type: {
			type: String as PropType<
				"text" | "email" | "password" | "search" | "url" | "number" | "tel"
			>,
			default: "text",
		},
		value: {
			type: [String, Number],
			default: "",
		},
		modelValue: {
			type: [String, Number],
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
		/**
		 * use textarea
		 */
		long: {
			type: Boolean,
			default: false,
		},
		/**
		 * data list link
		 * @see https://www.w3schools.com/TAGS/att_input_list.asp
		 */
		list: {
			type: String,
			default: null,
		},
	});
	const emit = defineEmits(["focus", "blur", "update:modelValue"]);

	const { getLocale } = UtilsComposable();
	const { inputClasses } = InputModifiersComposable()(props);

	/**
	 * Input model
	 */
	const model = computed({
		get: () => {
			const value = props.modelValue ?? props.value;
			return props.type !== "number" ? value : Number(value);
		},
		set: (value) => emit("update:modelValue", value),
	});

	/**
	 * increase number
	 */
	function increase() {
		if (typeof model.value !== "number") return;
		if (model.value < Number(props.max)) model.value++;
	}

	/**
	 * decrease number
	 */
	function decrease() {
		if (typeof model.value !== "number") return;
		if (model.value > Number(props.min)) model.value--;
	}
</script>
