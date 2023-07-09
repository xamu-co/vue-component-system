<template>
	<select
		ref="selectRef"
		v-bind="{
			autocomplete: props.autocomplete,
			disabled: props.disabled,
			name: props.name,
			required: props.required,
			title: props.name,
			...(props.disabled && { tabIndex: -1 }),
		}"
		:class="{ inputClasses: selectClasses }"
		v-on="selectListeners(emit)"
	>
		<option v-if="!hasDefault" hidden selected disabled>
			{{ props.modelValue || getLocale("select_placeholder") }}
		</option>
		<option v-for="(option, index) in getOptions" :key="index" :value="option.value">
			{{ option.alias || option.value }}
		</option>
	</select>
</template>

<script setup lang="ts">
	import { computed, inject, onMounted, ref, watch } from "vue";

	import type { iSelectOption } from "@open-xamu-co/common-types";
	import type { iPluginOptions, tInputEvents } from "@open-xamu-co/components-types";
	import { toSelectOption } from "@open-xamu-co/common-helpers";
	import { UtilsComposable } from "@open-xamu-co/components-helpers";

	import { InputModifiersComposable, InputModifiersProps, SelectProps } from "../composables";

	/**
	 * Select Prototype
	 *
	 * @prototype
	 */

	/**
	 * Should all be null by default
	 */
	const props = defineProps({
		...InputModifiersProps,
		...SelectProps,
		type: {
			type: String,
			default: "select",
		},
		/**
		 * Use only emit
		 * useful fot custom event handling
		 *
		 * @internalProp
		 * Do not use v-model alongside this
		 */
		emitOnly: {
			type: Boolean,
			default: false,
		},
	});
	const emit = defineEmits(["focus", "blur", "input", "update:modelValue"]);

	const systemOptions = inject<iPluginOptions>("vueComponentSystem");
	const { getLocale } = UtilsComposable(systemOptions);
	const { inputClasses: selectClasses } = InputModifiersComposable(true)(props);

	const selectRef = ref<HTMLSelectElement>();
	const getOptions = computed<iSelectOption[]>(() => {
		return props.options.map(toSelectOption).filter(({ value }) => {
			return value === props.modelValue || !props.omits.includes(value);
		});
	});
	/**
	 * get the first instance of the model, non reactive
	 */
	const initialValue = (() => props.modelValue)();
	/**
	 * Initial value matches one of the options
	 */
	const hasDefault = computed<boolean>(() => {
		return !!getOptions.value.find(({ value }) => value === "" || value === initialValue);
	});
	/**
	 * Get input listeners
	 */
	function selectListeners(emit: any): tInputEvents {
		return {
			focus: (e) => emit("focus", e),
			blur: (e) => emit("blur", e),
			input: (e) => {
				if (props.emitOnly) return emit("input", e);
				emit("update:modelValue", e.target.value);
			},
		};
	}

	/**
	 * set input value (override)
	 */
	function overrideSelectValue(value: any) {
		if (!selectRef.value) return;
		if (selectRef.value.value !== value) selectRef.value.value = value;
	}

	// lifecycle
	watch(() => props.modelValue, overrideSelectValue, { immediate: false });
	onMounted(() => {
		// set initial value if there is one
		overrideSelectValue(props.modelValue);
	});
</script>
