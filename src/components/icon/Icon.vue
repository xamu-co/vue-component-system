<template>
	<i aria-hidden="true" :class="[...defaultClasses, !!$slots.default ? 'svg' : 'icon']">
		<slot></slot>
	</i>
</template>

<script setup lang="ts">
	import GlobalModifiersComposable, {
		GlobalModifiersProps,
	} from "../../composables/modifiers/global";

	/**
	 * Icon
	 *
	 * @component
	 * @example
	 * <Icon size="50" />
	 */

	const props = defineProps(GlobalModifiersProps);

	const defaultClasses = GlobalModifiersComposable(props);
</script>
