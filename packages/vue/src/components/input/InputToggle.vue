<template>
	<div :class="{ '--width': fullWidth }">
		<Input
			v-model="model"
			v-bind="{ value: modelValue, type }"
			:class="classes"
			v-on="inputListeners(emit)"
		/>
		<!-- Do not hide, since this is used by a pseudo element -->
		<label :for="id" class="flx --flxRow --flstart-center --gap-none">
			<div class="flx --flxColumn --flstart --flx --gap-none">
				<span v-if="label">{{ label }}</span>
				<span v-else-if="showPlaceholder">
					{{ getLocale(model ? "yes" : "no") }}
				</span>
				<slot></slot>
			</div>
		</label>
	</div>
</template>

<script setup lang="ts">
	import { PropType, computed } from "vue";

	import Input from "./Input.vue";
	import {
		InputModifiersComposable,
		InputModifiersProps,
		InputProps,
		inputListeners,
		UtilsComposable,
	} from "../../composables";

	/**
	 * Toggle Input element
	 *
	 * @component
	 */

	const props = defineProps({
		...InputModifiersProps,
		...InputProps,
		type: {
			type: String as PropType<"checkbox" | "radio" | "switch">,
			default: "checkbox",
		},
		/**
		 * radio and checkbox inputs only
		 */
		checked: {
			type: Boolean,
			default: null,
		},
		value: {
			type: Boolean,
			default: null,
		},
		modelValue: {
			type: Boolean,
			default: null,
		},
		label: {
			type: String,
			default: null,
		},
		showPlaceholder: {
			type: Boolean,
			default: false,
		},
		fullWidth: {
			type: Boolean,
			default: false,
		},
	});
	const emit = defineEmits(["focus", "blur", "update:modelValue"]);

	const { getLocale, getModifierClasses } = UtilsComposable();
	const { inputClasses } = InputModifiersComposable()(props);

	/**
	 * Input model
	 */
	const model = computed({
		get: () => props.modelValue ?? props.checked ?? props.value,
		set: (value) => emit("update:modelValue", value),
	});

	const classes = computed<string[]>(() => {
		return [inputClasses.value, getModifierClasses(["full"])].flat(2);
	});
</script>
