<template>
	<div :class="{ '--width': fullWidth }">
		<ProtoInput
			v-model="model"
			v-bind="getProps({ classes, value: modelValue, type })"
			v-on="getInputListeners(emit)"
		/>
		<!-- Do not hide, since this is used by a pseudo element -->
		<label :for="id" class="flx --flxRow --flx-start-center --gap-none">
			<div class="flx --flxColumn --flx-start --flx --gap-none">
				<span v-if="label">{{ label }}</span>
				<span v-else-if="showPlaceholder">
					{{ model ? t("yes") : t("no") }}
				</span>
				<slot></slot>
			</div>
		</label>
	</div>
</template>

<script setup lang="ts">
	import type { PropType } from "vue";

	import { tProp } from "~~/resources/types";
	import { InputComposable } from "~~/composables/useComponent/input";

	/**
	 * Toggle Input element
	 *
	 * @component
	 */

	const props = defineProps({
		...InputComposable,
		type: {
			type: String as PropType<"checkbox" | "radio" | "switch">,
			default: "checkbox",
		},
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

	const emit = defineEmits(["blur", "focus", "update:modelValue"]);

	const { t } = useI18n();
	const { defaultInputClasses, getProps, getInputListeners } = useComponentInput(props);

	/**
	 * Input model
	 */
	const model = computed({
		get: () => props.modelValue ?? props.checked ?? props.value,
		set: (value) => emit("update:modelValue", value),
	});

	const classes = computed<tProp[]>(() => [
		...defaultInputClasses.value,
		{ "--full": props.fullWidth },
	]);
</script>
