<template>
	<Action
		v-bind="props"
		:class="['link', { '--shadow': props.shadow }]"
		v-on="actionListeners($emit)"
	/>
</template>

<script setup lang="ts">
	import { ActionComposableProps, actionListeners } from "../../composables/action";

	/**
	 * Action Link Component
	 *
	 * @component
	 * @example
	 * <ActionLink></ActionLink>
	 */

	const props = defineProps({
		...ActionComposableProps,
		shadow: {
			type: Boolean,
			default: false,
		},
	});
</script>
