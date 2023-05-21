<template>
	<Action
		v-bind="props"
		:class="['link', { '--shadow': props.shadow }]"
		v-on="actionListeners(emit)"
	>
		<slot></slot>
	</Action>
</template>

<script setup lang="ts">
	import Action from "./Action.vue";
	import { ActionProps, actionListeners } from "../../composables";

	/**
	 * Action Link Component
	 *
	 * @component
	 * @example
	 * <ActionLink></ActionLink>
	 */

	const props = defineProps({
		...ActionProps,
		shadow: {
			type: Boolean,
			default: null,
		},
	});
	const emit = defineEmits(["focus", "blur", "click", "submit"]);
</script>
