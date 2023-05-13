<template>
	<component
		:is="type !== 'textarea' ? 'input' : 'textarea'"
		ref="inputRef"
		v-bind="{
			...props,
			...(props.disabled && { tabIndex: -1 }),
			...((isNumber || isPhone) && {
				pattern: '[0-9]*',
				oninput: 'this.value = this.value.replace(/[^0-9]/g,\'\')',
			}),
			...(!isNumber && { min: undefined, max: undefined }),
		}"
		:class="globalClasses"
		v-on="inputListeners($emit)"
	/>
</template>

<script setup lang="ts">
	import { computed, onMounted, ref, watch } from "vue";

	import { GlobalModifiersComposable, GlobalModifiersProps, InputProps } from "../../composables";
	import { tInputEvents } from "../../types";

	/**
	 * Input Prototype
	 *
	 * @prototype
	 */

	/**
	 * Should all be null by default
	 */
	const props = defineProps({
		...GlobalModifiersProps,
		...InputProps,
		/**
		 * Vue model value
		 *
		 * @internalProp
		 */
		modelValue: {
			type: [String, Number, Boolean, Array],
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
		/**
		 * Input type
		 */
		type: {
			type: String,
			default: null,
		},
		/**
		 * Match files type
		 * file input only
		 *
		 * @internalProp
		 */
		accept: {
			type: String,
			default: null,
		},
		/**
		 * Multiple files
		 * file input only
		 *
		 * @internalProp
		 */
		multiple: {
			type: Boolean,
			default: null,
		},
	});

	const inputRef = ref<HTMLInputElement>();
	const isNumber = computed<boolean>(() => ["number", "tel"].includes(props.type));
	const isPhone = computed<boolean>(() => props.type === "tel");
	const useChange = computed<boolean>(() => ["checkbox", "radio", "file"].includes(props.type));

	const globalClasses = GlobalModifiersComposable(props);

	/**
	 * Get input listeners
	 */
	function inputListeners(emit: any): tInputEvents {
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
	}

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
