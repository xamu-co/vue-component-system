<template>
	<ProtoSelect
		v-model="model"
		v-bind="
			Input.getProps({ options: getOptions, classes: Input.defaultInputClasses.value, type })
		"
		v-on="Input.getInputListeners(emit)"
	/>
</template>

<script setup lang="ts">
	import type { PropType } from "vue";
	import type { iSelectOption } from "@xamu-co/shared-types";
	import { toSelectOption } from "@xamu-co/shared-helpers";

	import { InputComposable } from "~~/composables/useComponent/input";

	/**
	 * Select element
	 *
	 * @component
	 */

	const props = defineProps({
		...InputComposable,
		themeAsUnion: {
			type: Boolean,
			default: true,
		},
		value: {
			type: String,
			default: "",
		},
		modelValue: {
			type: [String, Number],
			default: null,
		},
		options: {
			type: Array as PropType<(string | number | iSelectOption)[]>,
			required: true,
		},
		omits: {
			type: Array as PropType<(string | number)[]>,
			default() {
				return [];
			},
		},
		type: {
			type: String,
			default: "select",
		},
	});

	const emit = defineEmits(["focus", "blur", "update:modelValue"]);

	const Input = useComponentInput(props);

	const getOptions = computed<iSelectOption[]>(() => {
		return props.options.map(toSelectOption).filter(({ value }) => {
			return value === props.modelValue || !props.omits.includes(value);
		});
	});
	const model = computed({
		get: () => props.modelValue ?? props.value,
		set: (value) => emit("update:modelValue", value),
	});
</script>
