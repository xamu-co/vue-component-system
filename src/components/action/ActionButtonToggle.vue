<template>
	<Action
		v-bind="props"
		:class="['bttnToggle', { '--shadow': props.shadow }]"
		v-on="actionListeners($emit)"
	/>
</template>

<script setup lang="ts">
	import { ActionComposableProps, actionListeners } from "../../composables/action";

	/**
	 * Action Button Toggle Component
	 * Visually toggles
	 *
	 * @component
	 * @example
	 * <ButtonToggle></ButtonToggle>
	 */

	const props = defineProps({
		...ActionComposableProps,
		shadow: {
			type: Boolean,
			default: false,
		},
	});
</script>
