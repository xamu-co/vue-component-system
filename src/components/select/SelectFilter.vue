<template>
	<div>
		<datalist :id="name">
			<!-- Select is used as fallback for older browsers -->
			<LazyInputSelect
				v-model="model"
				v-bind="{ omits, options: selectOptions, class: '--maxWidth-180:md' }"
				v-on="getInputListeners(emit)"
			/>
		</datalist>
		<div v-if="supportsDatalist" class="flx --flxRow --flx-start-center --gap-5">
			<LazyInputText
				v-model="model"
				v-bind="
					getProps({
						classes: defaultInputClasses,
						type: 'text',
						placeholder,
						list: name,
						invalid: isInvalid,
						disabled: isSelected || disabled,
					})
				"
				v-on="getInputListeners(emit)"
			/>
			<LazyActionLink
				v-if="isSelected"
				:aria-label="t('restablish_field')"
				:title="t('restablish_field')"
				@click.prevent="resetModel"
			>
				<LazyIcon name="xmark" size="20" />
			</LazyActionLink>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { PropType } from "vue";
	import type { iFormIconProps, iSelectOption, tFontAwesome } from "@xamu-co/shared-types";
	import { toSelectOption } from "@xamu-co/shared-helpers";

	import { InputComposable } from "~~/composables/useComponent/input";

	/**
	 * Select element with filtering
	 *
	 * @component
	 */

	const props = defineProps({
		...InputComposable,
		value: {
			type: [String, Number],
			default: "",
		},
		modelValue: {
			type: [String, Number],
			default: null,
		},
		placeholder: {
			type: String,
			default: "Buscar...",
		},
		/**
		 * FontAwesome icon
		 */
		icon: {
			type: String as PropType<tFontAwesome>,
			default: "user-group",
		},
		iconProps: {
			type: Object as PropType<iFormIconProps>,
			default: null,
		},
		options: {
			type: Array as PropType<(string | number | iSelectOption)[]>,
			required: true,
		},
		omits: {
			type: Array as PropType<(string | number)[]>,
			default() {
				return [];
			},
		},
	});

	const emit = defineEmits(["focus", "blur", "update:modelValue"]);

	const { t } = useI18n();
	const { defaultInputClasses, getProps, getInputListeners } = useComponentInput(props);

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
	const getOptions = computed<iSelectOption[]>(() => {
		return props.options.map(toSelectOption).filter(({ value }) => {
			return !props.omits.includes(value);
		});
	});
	/**
	 * options should be reactive
	 * uses filtered version
	 */
	const selectOptions = computed<Array<number | string>>(() => {
		return getOptions.value.map((option) => {
			const { alias, value } = toSelectOption(option);
			return alias ?? value;
		});
	});
	const supportsDatalist = ref(false);

	// lifecycle
	if (process.client) {
		supportsDatalist.value = !!HTMLDataListElement;
	}
</script>
