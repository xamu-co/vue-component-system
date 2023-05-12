<template>
	<div class="flx --flxRow --flx-center --flx">
		<div v-if="icon && !long" v-bind="{ class: defaultInputClasses, disabled }">
			<ProtoInput
				v-model="model"
				v-bind="getProps({ classes: undefined, placeholder, type })"
				v-on="getInputListeners(emit)"
			/>
			<LazyIcon v-bind="{ ...iconProps, name: icon }" />
		</div>
		<ProtoInput
			v-else
			v-model="model"
			v-bind="
				getProps({
					classes: defaultInputClasses,
					placeholder,
					type: long ? 'textarea' : type,
				})
			"
			v-on="getInputListeners(emit)"
		/>
		<template v-if="type === 'number' && (Number.isInteger(min) || Number.isInteger(max))">
			<LazyActionButtonToggle
				:disabled="model >= max"
				:size="size"
				:aria-label="t('increase')"
				:tooltip="t('increase')"
				tooltip-position="bottom"
				tooltip-as-text
				round
				@click="increase"
			>
				<LazyIcon name="plus" />
				<LazyIcon name="plus" />
			</LazyActionButtonToggle>
			<LazyActionButtonToggle
				:disabled="model <= min"
				:size="size"
				:aria-label="t('decrease')"
				:tooltip="t('decrease')"
				tooltip-position="bottom"
				tooltip-as-text
				round
				@click="decrease"
			>
				<LazyIcon name="minus" />
				<LazyIcon name="minus" />
			</LazyActionButtonToggle>
		</template>
	</div>
</template>

<script setup lang="ts">
	import type { PropType } from "vue";
	import type { iFormIconProps, tFontAwesome } from "@xamu-co/shared-types";

	import type { tInputText } from "~~/composables/useComponent/input";
	import { InputComposable } from "~~/composables/useComponent/input";

	/**
	 * Text Input element
	 * TODO: text validation
	 * TODO: validator function prop & default validator
	 *
	 * @component
	 * @example
	 * <LazyInputText :value=""></LazyInputText>
	 */

	const props = defineProps({
		...InputComposable,
		type: {
			type: String as PropType<tInputText>,
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
		placeholder: {
			type: String,
			default: "Tu texto...",
		},
		/**
		 * FontAwesome icon
		 */
		icon: {
			type: String as PropType<tFontAwesome>,
			default: "user-group",
		},
		iconProps: {
			type: Object as PropType<iFormIconProps>,
			default: null,
		},
		min: {
			type: [Number, String],
			default: null,
		},
		max: {
			type: Number,
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
		 * datalist link
		 */
		list: {
			type: String,
			default: null,
		},
	});

	const emit = defineEmits(["focus", "blur", "update:modelValue"]);

	const { t } = useI18n();
	const { defaultInputClasses, getProps, getInputListeners } = useComponentInput(props);

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
		if (model.value < props.max) model.value++;
	}

	/**
	 * decrease number
	 */
	function decrease() {
		if (typeof model.value !== "number") return;
		if (model.value > props.min) model.value--;
	}
</script>
