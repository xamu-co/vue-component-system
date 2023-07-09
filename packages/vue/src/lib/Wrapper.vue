<template>
	<Component :is="el" v-if="render">
		<slot></slot>
	</Component>
	<slot v-else></slot>
</template>

<script setup lang="ts">
	import { Component, DefineComponent, PropType } from "vue";

	/**
	 * Wrapper Component
	 *
	 * @component
	 * @example
	 * <Wrapper></Wrapper>
	 */

	defineProps({
		/**
		 * Wheter or not render the wrapper
		 */
		render: {
			type: Boolean,
			required: true,
		},
		/**
		 * Component or tag to render
		 */
		el: {
			type: [String, Object] as PropType<Component<any> | DefineComponent<any> | string>,
			default: "div",
		},
	});
</script>
