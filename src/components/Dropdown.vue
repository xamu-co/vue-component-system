<template>
	<Wrapper :render="!!$slots.toggle">
		<div
			v-if="$slots.toggle"
			class="only--active toggle--dropdown"
			:class="{ 'is--active': modelValue }"
		>
			<slot name="toggle"></slot>
		</div>
		<Modal :model-value="modelValue" :disabled="!isModal" @update:model-value="closeDropdown">
			<div ref="dropdownRef" :class="isModal ? [] : classes">
				<slot></slot>
			</div>
		</Modal>
	</Wrapper>
</template>

<script setup lang="ts">
	import { PropType, computed, onMounted, onUnmounted, ref, watch } from "vue";

	import Wrapper from "./Wrapper.vue";
	import Modal from "./Modal.vue";
	import {
		GlobalModifiersComposable,
		GlobalModifiersProps,
		BrowserComposable,
		UtilsComposable,
	} from "../composables";

	type tAlignFirstX = "right" | "left";
	type tAlignFirstY = "top" | "bottom";

	type tAlignX = [tAlignFirstX, "top" | "center" | "bottom"];
	type tAlignY = [tAlignFirstY, "right" | "center" | "left"];

	type tAlign = tAlignFirstX | tAlignFirstY | tAlignX | tAlignY;

	/**
	 * Dropdown Prototype
	 *
	 * @prototype
	 */

	const props = defineProps({
		...GlobalModifiersProps,
		/**
		 * Shows/hides the dropdown
		 */
		modelValue: {
			type: Boolean,
			default: null,
		},
		position: {
			type: [String, Array] as PropType<tAlign>,
			default: null,
		},
	});
	const emit = defineEmits(["close", "update:modelValue"]);

	const { getModifierClasses } = UtilsComposable();
	const { isBrowser, tabletMQRange } = BrowserComposable(true);
	const defaultClasses = GlobalModifiersComposable(props);

	const dropdownRef = ref<HTMLElement>();
	const isModal = computed<boolean>(() => tabletMQRange.value && props.modelValue !== null);
	const classes = computed<string[]>(() => {
		return [
			defaultClasses.value,
			"dropdown",
			getModifierClasses([{ active: props.modelValue }], { suffix: "is" }),
			props.position
				? getModifierClasses([[props.position].flat(2).join("-")], {
						modifier: "position",
						divider: "-",
				  })
				: [],
		].flat(2);
	});

	function closeDropdown() {
		emit("close");
		emit("update:modelValue", false);
	}
	function clickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (
			dropdownRef.value === target ||
			dropdownRef.value?.contains(target) ||
			target.closest("a,label,button")
		) {
			return;
		}
		closeDropdown();
	}

	// lifecycle
	onMounted(() => {
		document.addEventListener("click", clickOutside, true);
	});
	onUnmounted(() => {
		document.removeEventListener("click", clickOutside, true);
	});
	if (isBrowser) {
		// close if tabletMQRange changes
		watch(() => tabletMQRange.value, closeDropdown, { immediate: false });
	}
</script>
