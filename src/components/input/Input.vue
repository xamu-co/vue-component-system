<template>
	<component
		:is="type !== 'textarea' ? 'input' : 'textarea'"
		ref="inputRef"
		v-bind="getInputAttributes"
		v-on="getInputListeners"
	/>
</template>

<script setup lang="ts">
	import { tInputEvents } from "~~/resources/types";
	import { InputPrototypeProps } from "~~/composables/useComponent/input";

	/**
	 * Input Prototype
	 *
	 * @prototype
	 */

	/**
	 * Should all be null by default
	 */
	const props = defineProps({
		...InputPrototypeProps,
		modelValue: {
			type: [String, Number, Boolean, Array],
			default: null,
		},
		placeholder: {
			type: String,
			default: null,
		},
		/**
		 * radio and checkbox inputs only
		 */
		checked: {
			type: Boolean,
			default: null,
		},
		/**
		 * file input only
		 */
		accept: {
			type: String,
			default: null,
		},
		multiple: {
			type: Boolean,
			default: null,
		},

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

		/**
		 * datalist link
		 */
		list: {
			type: String,
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

	const emit = defineEmits(["blur", "focus", "update:modelValue", "input", "change"]);

	const inputRef = ref<HTMLInputElement>();
	const isNumber = computed<boolean>(() => ["number", "tel"].includes(props.type));
	const isPhone = computed<boolean>(() => props.type === "tel");
	const useChange = computed<boolean>(() => ["checkbox", "radio", "file"].includes(props.type));

	/**
	 * Get input listeners
	 */
	const getInputListeners = computed<tInputEvents>(() => {
		/**
		 * setValue SelectFilter
		 */
		function setValue(newValue: any) {
			emit("update:modelValue", newValue);
		}

		return {
			focus: (e) => emit("focus", e),
			blur: (e) => emit("blur", e),
			input: (e) => {
				if (useChange.value) return;
				if (props.emitOnly) return emit("input", e);
				setValue(e.target.value);
			},
			change: (e) => {
				if (!useChange.value) return;
				if (props.emitOnly) return emit("change", e);
				setValue(e.target.checked ?? e.target.value);
			},
		};
	});
	/**
	 * returns required input attributes
	 */
	const getInputAttributes = computed<Record<string, any>>(() => ({
		...props,
		classes: undefined,
		class: props.classes,
		...(props.disabled && { tabIndex: -1 }),
		...((isNumber.value || isPhone.value) && {
			pattern: "[0-9]*",
			oninput: "this.value = this.value.replace(/[^0-9]/g,'')",
		}),
		...(!isNumber.value && { min: undefined, max: undefined }),
	}));

	/**
	 * set input value (override)
	 */
	function overrideInputValue(value: any) {
		if (!inputRef.value) return;
		if (typeof value === "boolean" && inputRef.value.checked !== value) {
			inputRef.value.checked = value;
		}
		if (inputRef.value.value !== value) inputRef.value.value = value;
	}

	// lifecycle
	watch(() => props.modelValue, overrideInputValue, { immediate: false });
	onMounted(() => {
		// set initial value if there is one
		overrideInputValue(props.modelValue);
	});
</script>
