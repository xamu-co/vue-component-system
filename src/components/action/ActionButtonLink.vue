<template>
	<Action v-bind="props" class="bttnLink" :theme-as-union="true" v-on="actionListeners($emit)" />
</template>

<script setup lang="ts">
	import { ActionComposableProps, actionListeners } from "../../composables/action";

	/**
	 * Action Button Link Component
	 * Switch between bttn & link
	 *
	 * @component
	 * @example
	 * <ActionButtonLink></ActionButtonLink>
	 */

	const props = defineProps(ActionComposableProps);
</script>
