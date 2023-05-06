<template>
	<Icon :class="[nameClass, typeClass]" />
</template>

<script setup lang="ts">
	import type { IconName } from "@fortawesome/fontawesome-common-types";

	import { PropType, computed } from "vue";

	import { HTMLClassesProps } from "../../composables/HTMLClasses";
	import Icon from "./Icon.vue";

	/**
	 * FontAwesome Icon
	 *
	 * @component
	 * @example
	 * <IconFa size="50" />
	 */

	const props = defineProps({
		...HTMLClassesProps,
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

	const nameClass = computed<string>(() => {
		return `fa-${props.name}`;
	});
	const typeClass = computed<string>(() => {
		// free version of FA only delivers brand, solid and regular
		if (props.brand) return "fab";
		if (props.regular) return "far";
		return "fas"; //assumes solid as default
	});
</script>
