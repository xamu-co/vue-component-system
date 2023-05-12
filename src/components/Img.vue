<template>
	<component :is="imageComponent" v-bind="props" />
</template>

<script setup lang="ts">
	import { PropType, computed, inject } from "vue";

	import { iPluginOptions } from "../types";

	/**
	 * Img Component
	 *
	 * @component
	 * @example
	 * <Img></Img>
	 */

	const props = defineProps({
		/**
		 * image url or path
		 */
		src: {
			type: String,
			default: null,
		},
		alt: {
			type: String,
			default: null,
		},
		loading: {
			type: String as PropType<"eager" | "lazy">,
			default: "lazy",
		},
	});

	const vueComponentSystem = inject<iPluginOptions>("vueComponentSystem");

	const imageComponent = computed(() => {
		return vueComponentSystem?.imageComponent || "img";
	});
</script>
