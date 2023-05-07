<template>
	<i aria-hidden="true" :class="[...defaultClasses, !!$slots.default ? 'svg' : 'icon']">
		<slot></slot>
	</i>
</template>

<script setup lang="ts">
	import GlobalModifiersComposable, {
		GlobalModifierProps,
	} from "../../composables/modifiers/global";

	/**
	 * Icon
	 *
	 * @component
	 * @example
	 * <Icon size="50" />
	 */

	const props = defineProps(GlobalModifierProps);

	const defaultClasses = GlobalModifiersComposable(props);
</script>
