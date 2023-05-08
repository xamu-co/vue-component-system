<template>
	<Action v-bind="props" class="box --button" v-on="actionListeners($emit)">
		<div class="--tm-light --square-sm box">
			<IconFa v-if="!imageSrc" v-bind="{ ...iconProps, name: icon, size: 50 }" />
			<img
				v-else
				class="--bgColor-light --width --height"
				:src="imageSrc"
				:alt="text"
				loading="lazy"
			/>
		</div>
		<p>
			<!-- Since we only accept text there is no room for slot here -->
			<b>{{ text }}</b>
		</p>
	</Action>
</template>

<script setup lang="ts">
	import type { PropType } from "vue";
	import type { IconName } from "@fortawesome/fontawesome-common-types";

	import type { iFormIconProps } from "@open-xamu-co/common-types";

	import IconFa from "../icon/IconFa.vue";
	import { ActionComposableProps, actionListeners } from "../../composables/action";

	/**
	 * LinkBox Component
	 *
	 * @component
	 * @example
	 * <ActionLinkBox></ActionLinkBox>
	 */

	const props = defineProps({
		...ActionComposableProps,
		/**
		 * FontAwesome icon
		 */
		icon: {
			type: String as PropType<IconName>,
			default: "cubes",
		},
		iconProps: {
			type: Object as PropType<iFormIconProps>,
			default: null,
		},
		/**
		 * image url or path
		 */
		imageSrc: {
			type: String,
			default: null,
		},
		text: {
			type: String,
			required: true,
		},
	});
</script>
