<template>
	<div>
		<datalist :id="name">
			<!-- Select is used as fallback for older browsers -->
			<Select
				v-model="model"
				v-bind="{ omits, options: selectOptions }"
				:class="classes"
				v-on="inputListeners($emit)"
			/>
		</datalist>
		<div v-if="supportsDatalist" class="flx --flxRow --flstart-center --gap-5">
			<InputText
				v-model="model"
				v-bind="{
					type: 'text',
					placeholder,
					list: name,
					invalid: isInvalid,
					disabled: isSelected || disabled,
				}"
				:class="inputClasses"
				v-on="inputListeners($emit)"
			/>
			<ActionLink
				v-if="isSelected"
				:aria-label="getLocale('input_restablish_field')"
				:title="getLocale('input_restablish_field')"
				@click.prevent="resetModel"
			>
				<IconFa name="xmark" size="20" />
			</ActionLink>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref } from "vue";

	import type { iSelectOption } from "@open-xamu-co/common-types";
	import { toSelectOption } from "@open-xamu-co/common-helpers";

	import Select from "./Select.vue";
	import InputText from "../input/InputText.vue";
	import ActionLink from "../action/ActionLink.vue";
	import IconFa from "../icon/IconFa.vue";
	import {
		InputModifiersComposable,
		InputModifiersProps,
		SelectProps,
		TextInputProps,
		inputListeners,
		UtilsComposable,
	} from "../../composables";

	/**
	 * Select element with filtering
	 *
	 * @component
	 */

	const props = defineProps({
		...InputModifiersProps,
		...SelectProps,
		...TextInputProps,
		value: {
			type: [String, Number],
			default: "",
		},
	});

	const emit = defineEmits(["focus", "blur", "update:modelValue"]);

	const { getLocale, getModifierClasses, isBrowser } = UtilsComposable();
	const { inputClasses } = InputModifiersComposable()(props);
	const { inputClasses: selectClasses } = InputModifiersComposable(true)(props);

	/**
	 * get option from value
	 */
	function getOptionFromValue(match: string | number): iSelectOption | undefined {
		return props.options.map(toSelectOption).find(({ alias, value }) => {
			return alias === match || value === match;
		});
	}
	/**
	 * resets the model
	 */
	function resetModel(): void {
		emit("update:modelValue", "");
	}

	const supportsDatalist = ref(false);
	/**
	 * Input model
	 *
	 * Prefer alias
	 */
	const model = computed({
		get: () => {
			const option = getOptionFromValue(props.modelValue ?? props.value);
			return option?.alias ?? option?.value ?? "";
		},
		set: (value) => {
			const option = getOptionFromValue(value);
			// if matched emit
			if (!!option) emit("update:modelValue", option.value);
		},
	});
	const isSelected = computed<boolean>(() => {
		return (
			!!props.options.length &&
			!!String(model.value).length &&
			!!getOptionFromValue(model.value)
		);
	});
	const isInvalid = computed<boolean>(() => {
		return (String(model.value).length && !getOptionFromValue(model.value)) || props.invalid;
	});
	/**
	 * options should be reactive
	 * uses filtered version
	 */
	const selectOptions = computed<Array<number | string>>(() => {
		return props.options.map(toSelectOption).map((option) => {
			const { alias, value } = toSelectOption(option);
			return alias ?? value;
		});
	});

	const classes = computed<string[]>(() => {
		return [
			selectClasses.value,
			getModifierClasses(["180:md"], { modifier: "maxWidth", divider: "-" }),
		].flat(2);
	});

	// lifecycle
	if (isBrowser()) {
		supportsDatalist.value = !!HTMLDataListElement;
	}
</script>
