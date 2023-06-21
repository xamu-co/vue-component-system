<template>
	<component
		:is="actionComponent"
		v-bind="{
			...props,
			...tooltipAttributes,
			...(props.disabled && { tabIndex: -1 }),
			...(vueComponentSystem?.routerComponent && !!to ? { to } : { href }),
			type: currentTag === 'button' && !to && !href ? type || 'button' : undefined,
			...((!!mailto || !!tel) && {
				to: undefined,
				href: !!mailto ? `mailto:${mailto}` : `tel:+${indicative}${tel}`,
			}),
		}"
		:class="classes"
		v-on="actionListeners(emit)"
	>
		<slot>
			<template v-if="mailto">
				{{ mailto }}
			</template>
			<template v-else-if="tel">
				{{ getReadableTelNumber }}
			</template>
		</slot>
	</component>
</template>

<script setup lang="ts">
	import { computed, inject } from "vue";

	import { toArray } from "@open-xamu-co/common-helpers";

	import type { iPluginOptions } from "@open-xamu-co/components-types";
	import {
		GlobalModifiersComposable,
		StateModifiersComposable,
		ThemeModifiersComposable,
		ActionProps,
		actionListeners,
		UtilsComposable,
	} from "../../composables";

	/**
	 * Action Prototype
	 *
	 * @prototype
	 */
	const props = defineProps({
		...ActionProps,
		/**
		 * Theme as union
		 * Theme should be union
		 *
		 * @internalProp
		 */
		themeAsUnion: {
			type: Boolean,
			default: null,
		},
	});
	const emit = defineEmits(["focus", "blur", "click", "submit"]);

	const { getModifierClasses, getPropData } = UtilsComposable();
	const vueComponentSystem = inject<iPluginOptions>("vueComponentSystem");

	const currentTag = computed(() => {
		if (!props.mailto && !props.tel && !props.href) return props.tag;
		return "a";
	});

	const actionComponent = computed(() => {
		return (props.to && vueComponentSystem?.routerComponent) || currentTag.value;
	});

	const globalClasses = GlobalModifiersComposable(props);
	const stateClasses = StateModifiersComposable(props);
	const { themeClasses } = ThemeModifiersComposable(props.themeAsUnion)(props);

	/**
	 * Base classes for action composable based component
	 */
	const classes = computed<string[]>(() => {
		const toggleState = [...toArray(props.toggleState)];
		return [
			globalClasses.value,
			stateClasses.value,
			themeClasses.value,
			// round classes
			props.round ? getModifierClasses(props.round, { modifier: "round" }) : [],
			// toggle classes
			props.toggle ? getModifierClasses([props.toggle], { suffix: "toggle" }) : [],
			props.toggleState ? getModifierClasses(toggleState, { suffix: "is" }) : [],
		].flat(2);
	});

	const indicative = computed(() => {
		return props.indicative?.toString().split("+")[1] || props.indicative;
	});

	/**
	 * Human readable number
	 * TODO: split tel prop as well
	 */
	const getReadableTelNumber = computed<string>(() => {
		return `(+${indicative.value}) ${props.tel}`;
	});

	const tooltipAttributes = computed(() => {
		const tooltipText = getPropData(props.tooltip);
		const theme = toArray(props.theme)[0];
		const tooltipData = {
			"data-tooltip": tooltipText,
			"data-tooltip-position": props.tooltipPosition,
			"data-tooltip-text": props.tooltipAsText,
			"data-tooltip-bg": Array.isArray(theme) ? theme?.[0] : theme,
		};
		return tooltipText ? tooltipData : null;
	});
</script>
