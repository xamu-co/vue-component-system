<template>
	<i aria-hidden="true" :class="[...defaultClasses, !!$slots.default ? 'svg' : 'icon']">
		<slot></slot>
	</i>
</template>

<script setup lang="ts">
	import HTMLClasses, { HTMLClassesProps } from "../../composables/HTMLClasses";

	/**
	 * Icon
	 *
	 * @component
	 * @example
	 * <Icon size="50" />
	 */

	const props = defineProps(HTMLClassesProps);

	const defaultClasses = HTMLClasses(props);
</script>
