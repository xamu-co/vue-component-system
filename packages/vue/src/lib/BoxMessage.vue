<template>
	<div :class="globalClasses" class="flx --flxColumn --flx-center --width">
		<div class="txt --txtAlign-center --width">
			<div :class="boxClasses" class="box">
				<p v-if="text" v-safe-html="text"></p>
				<slot v-else></slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";

	import {
		GlobalModifiersComposable,
		GlobalModifiersProps,
		StateModifiersComposable,
		StateModifiersProps,
		ThemeModifiersComposable,
		ThemeModifiersProps,
	} from "./composables";

	/**
	 * BoxMessage
	 * Displays a box with a message
	 * Useful for warnings or just general info
	 *
	 * @component
	 * @example
	 * <BoxMessage name="50"></BoxMessage>
	 */

	const props = defineProps({
		...GlobalModifiersProps,
		...StateModifiersProps,
		...ThemeModifiersProps,
		/**
		 * Text or html
		 */
		text: {
			type: String,
			default: null,
		},
		/**
		 * less padding
		 */
		asButton: {
			type: Boolean,
			default: false,
		},
	});

	const globalClasses = GlobalModifiersComposable(props);
	const stateClasses = StateModifiersComposable(props);
	const { themeClasses, themeValues } = ThemeModifiersComposable()(props);

	/**
	 * Base classes
	 */
	const boxClasses = computed<string[]>(() => {
		return [
			globalClasses.value,
			stateClasses.value,
			themeClasses.value,
			[`--txtColor-${themeValues.value[0]}`, props.asButton ? "--button" : ""],
		].flat(2);
	});
</script>
