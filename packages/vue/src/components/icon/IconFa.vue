<template>
	<Icon :class="[nameClass, typeClass]" v-bind="props" />
</template>

<script setup lang="ts">
	import { PropType, computed } from "vue";
	import type { IconName } from "@fortawesome/fontawesome-common-types";

	import Icon from "./Icon.vue";
	import { GlobalModifiersProps } from "../../composables";

	/**
	 * FontAwesome Icon
	 *
	 * @component
	 * @example
	 * <IconFa size="50" />
	 */

	const props = defineProps({
		...GlobalModifiersProps,
		name: {
			type: String as PropType<IconName>,
			default: "cubes",
		},
		regular: {
			type: Boolean,
			default: false,
		},
		brand: {
			type: Boolean,
			default: false,
		},
	});

	const nameClass = computed<string>(() => `fa-${props.name}`);
	const typeClass = computed<string>(() => {
		// free version of FA only delivers brand, solid and regular
		if (props.brand) return "fab";
		if (props.regular) return "far";
		return "fas"; //assumes solid as default
	});
</script>
