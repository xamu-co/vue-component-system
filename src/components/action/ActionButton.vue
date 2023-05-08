<template>
	<Action v-bind="props" class="bttn" :theme-as-union="true" v-on="actionListeners($emit)" />
</template>

<script setup lang="ts">
	import { ActionComposableProps, actionListeners } from "../../composables/action";

	/**
	 * Action Button Component
	 *
	 * @component
	 * @example
	 * <ActionButton></ActionButton>
	 */

	const props = defineProps(ActionComposableProps);
</script>
