<template>
	<select ref="selectRef" v-bind="getSelectAttributes" v-on="getSelectListeners">
		<option v-if="!hasDefault" hidden selected disabled>
			{{ props.modelValue || t("select_placeholder") }}
		</option>
		<option v-for="(option, index) in getOptions" :key="index" :value="option.value">
			{{ option.alias || option.value }}
		</option>
	</select>
</template>

<script setup lang="ts">
	import type { PropType } from "vue";
	import type { iSelectOption } from "@xamu-co/shared-types";
	import omit from "lodash/omit";
	import { toSelectOption } from "@xamu-co/shared-helpers";

	import type { tInputEvents } from "~~/resources/types";
	import { InputPrototypeProps } from "~~/composables/useComponent/input";

	/**
	 * Select Prototype
	 *
	 * @prototype
	 */

	/**
	 * Should all be null by default
	 */
	const props = defineProps({
		...InputPrototypeProps,
		modelValue: {
			type: [String, Number],
			default: null,
		},
		options: {
			type: Array as PropType<(string | number | iSelectOption)[]>,
			default: null,
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

	const emit = defineEmits(["blur", "focus", "update:modelValue", "input"]);

	const { t } = useI18n();

	const selectRef = ref<HTMLSelectElement>();
	const getOptions = computed<iSelectOption[]>(() => props.options.map(toSelectOption));
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
	const getSelectListeners = computed<tInputEvents>(() => {
		return {
			focus: (e) => emit("focus", e),
			blur: (e) => emit("blur", e),
			input: (e) => {
				if (props.emitOnly) return emit("input", e);
				emit("update:modelValue", e.target.value);
			},
		};
	});
	/**
	 * returns required select attributes
	 */
	const getSelectAttributes = computed<Record<string, any>>(() => ({
		...omit(props, ["options", "type"]),
		/**
		 * title for better accessibility
		 */
		title: props.name,
		classes: undefined,
		class: props.classes,
		...(props.disabled && { tabIndex: -1 }),
	}));

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
