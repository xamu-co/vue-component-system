<template>
	<div class="flx --flxColumn --flx-center">
		<div>
			<div ref="firstPulse" :style="spinnerStyle"></div>
			<div ref="secondPulse" :style="spinnerStyle"></div>
			<div ref="thirdPulse" :style="spinnerStyle"></div>
		</div>
		<slot>
			<div v-if="!hideLabel" class="txt --txtAlign-center">
				<p>{{ label }}</p>
			</div>
		</slot>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, reactive, ref } from "vue";

	/**
	 * Loader
	 * @see https://www.npmjs.com/package/vue-spinner
	 * The original one didn't allow to change the animation speed and it was too fast
	 */

	const props = defineProps({
		label: {
			type: String,
			default: null,
		},
		hideLabel: {
			type: Boolean,
			default: false,
		},
		color: {
			type: String,
			default: "#0f47af",
		},
		size: {
			type: String,
			default: "0.5rem",
		},
		margin: {
			type: String,
			default: "2px",
		},
		radius: {
			type: String,
			default: "100%",
		},
		/**
		 * Animation speed in ms
		 */
		speed: {
			type: Number,
			default: 1000,
		},
	});

	const firstPulse = ref<HTMLElement>();
	const secondPulse = ref<HTMLElement>();
	const thirdPulse = ref<HTMLElement>();

	const spinnerStyle = reactive({
		backgroundColor: props.color,
		width: props.size,
		height: props.size,
		margin: props.margin,
		borderRadius: props.radius,
		display: "inline-block",
	});

	onMounted(() => {
		[firstPulse, secondPulse, thirdPulse].forEach((pulse, index) => {
			pulse.value?.animate(
				[
					{ transform: "scale(1)", opacity: 1, offset: 0 },
					{ transform: "scale(0.1)", opacity: 0.7, offset: 0.45 },
					{ transform: "scale(1)", opacity: 1, offset: 0.8 },
				],
				{
					duration: props.speed,
					iterations: Infinity,
					delay: index * 200,
					fill: "both",
					easing: "cubic-bezier(.2,.68,.18,1.08)",
				}
			);
		});
	});
</script>
