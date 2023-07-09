<template>
	<Action v-bind="props" class="bttn" :theme-as-union="true" v-on="actionListeners(emit)">
		<slot></slot>
	</Action>
</template>

<script setup lang="ts">
	import Action from "./Action.vue";
	import { ActionProps, actionListeners } from "../composables";

	/**
	 * Action Button Component
	 *
	 * @component
	 * @example
	 * <ActionButton></ActionButton>
	 */

	const props = defineProps(ActionProps);
	const emit = defineEmits(["focus", "blur", "click", "submit"]);
</script>
