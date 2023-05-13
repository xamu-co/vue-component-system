<template>
	<Action v-bind="props" class="bttnLink" :theme-as-union="true" v-on="actionListeners($emit)">
		<slot></slot>
	</Action>
</template>

<script setup lang="ts">
	import Action from "./Action.vue";
	import { ActionProps, actionListeners } from "../../composables";

	/**
	 * Action Button Link Component
	 * Switch between bttn & link
	 *
	 * @component
	 * @example
	 * <ActionButtonLink></ActionButtonLink>
	 */

	const props = defineProps(ActionProps);
</script>
