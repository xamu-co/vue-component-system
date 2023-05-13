<template>
	<Action
		v-bind="props"
		:class="['bttnToggle', { '--shadow': props.shadow }]"
		v-on="actionListeners($emit)"
	>
		<slot></slot>
	</Action>
</template>

<script setup lang="ts">
	import Action from "./Action.vue";
	import { ActionProps, actionListeners } from "../../composables";

	/**
	 * Action Button Toggle Component
	 * Visually toggles
	 *
	 * @component
	 * @example
	 * <ButtonToggle></ButtonToggle>
	 */

	const props = defineProps({
		...ActionProps,
		shadow: {
			type: Boolean,
			default: null,
		},
	});
</script>
