<template>
	<dialog v-if="!disabled" ref="modalRef" @close="closeModal" @mousedown="clickOutside">
		<div v-if="!loading && canShow" class="modal" role="document" :class="modalClass">
			<slot name="modal-header">
				<div v-if="title" class="flx --flxRow --flx-between-center">
					<div class="txt --gaping-none">
						<h5>{{ title }}</h5>
						<p v-if="subtitle" class="--txtColor --txtSize-xs">
							{{ subtitle }}
						</p>
					</div>
					<ActionLink :aria-label="cancelButtonOptions.title" @click.stop="closeModal">
						<IconFa name="xmark" size="20" />
					</ActionLink>
				</div>
			</slot>
			<slot></slot>
			<slot name="modal-footer">
				<div v-if="!hideFooter" class="flx --flxRow --flx-end-center">
					<ActionButton
						v-if="saveButtonOptions.visible"
						:aria-label="saveButtonOptions.title"
						:class="saveButtonOptions.btnClass"
						@click="emit('save')"
					>
						{{ saveButtonOptions.title }}
					</ActionButton>
					<ActionButtonToggle
						v-if="cancelButtonOptions.visible"
						:aria-label="cancelButtonOptions.title"
						:class="cancelButtonOptions.btnClass"
						data-dismiss="x-modal"
						round=":sm-inv"
						@click.stop="closeModal"
					>
						<IconFa name="xmark" hidden="-full:sm" />
						<IconFa name="xmark" regular hidden="-full:sm" />
						<span class="--hidden-full:sm-inv">
							{{ cancelButtonOptions.title }}
						</span>
					</ActionButtonToggle>
				</div>
			</slot>
		</div>
		<Loader v-else hide-label>
			<transition name="fade">
				<div v-if="loadingTooLong" class="txt --txtAlignFlx-center --gaping-5">
					<p class="--txtColor-light --txtShadow --txtSize-sm">
						{{ getLocale("modal_taking_too_long") }}
					</p>
					<ActionButton :aria-label="getLocale('close')" @click="closeModal">
						{{ getLocale("close") }}
					</ActionButton>
				</div>
			</transition>
		</Loader>
	</dialog>
	<slot v-else></slot>
</template>

<script setup lang="ts">
	import { PropType, computed, inject, onMounted, onUnmounted, ref, watch } from "vue";

	import type { iPluginOptions } from "@open-xamu-co/components-types";
	import { SwalComposable, UtilsComposable } from "@open-xamu-co/components-helpers";

	import IconFa from "./icon/IconFa.vue";
	import ActionLink from "./action/ActionLink.vue";
	import ActionButton from "./action/ActionButton.vue";
	import ActionButtonToggle from "./action/ActionButtonToggle.vue";
	import Loader from "./Loader.vue";

	/**
	 * Based on @innologica/vue-stackable-modal
	 * Modified to support vue3
	 * TODO: Improve logic
	 *
	 * @see https://github.com/Innologica/vue-stackable-modal
	 */

	interface iButtonConfig {
		title?: string;
		visible: boolean;
		btnClass?: string;
	}

	const props = defineProps({
		/**
		 * Shows/hides the modal
		 */
		modelValue: {
			type: Boolean,
			default: false,
		},
		/**
		 * Modal is loading
		 * Some of the modal contents could be still loading
		 */
		loading: {
			type: Boolean,
			default: false,
		},
		/**
		 * The title of the modal shown in .x-modal-header div. If empty title is not rendered
		 */
		title: {
			type: String,
			default: null,
		},
		subtitle: {
			type: String,
			default: null,
		},
		/**
		 * :class object which is attached to the modal modal element
		 */
		modalClass: {
			type: [String, Object, Array],
			default: "flx --flxColumn --flx-start-stretch --width",
		},
		/**
		 * Save button config
		 */
		saveButton: {
			type: Object as PropType<iButtonConfig | null>,
			default: null,
		},
		/**
		 * Cancel button config
		 */
		cancelButton: {
			type: Object as PropType<iButtonConfig | null>,
			default: null,
		},
		/**
		 * Are modal requirement meet?
		 * This is intended to prevent the usage of certain modals
		 *
		 * Ex: user does not have enough permissions
		 */
		canShow: {
			type: Boolean,
			default: true,
		},
		hideFooter: {
			type: Boolean,
			default: false,
		},
		/**
		 * disables modal
		 */
		disabled: {
			type: Boolean,
			default: false,
		},
	});

	const emit = defineEmits(["save", "close", "update:modelValue"]);

	const systemOptions = inject<iPluginOptions>("vueComponentSystem");
	const { Swal } = SwalComposable(systemOptions);
	const { getLocale } = UtilsComposable(systemOptions);

	const modalRef = ref<HTMLDialogElement>();
	/**
	 * Are the requirements for the modal are taking longer than usual?
	 */
	const loadingTooLong = ref(false);
	const saveButtonOptions = computed<iButtonConfig>(() => ({
		title: getLocale("ok"),
		visible: false,
		btnClass: "",
		...(!!props.saveButton && props.saveButton),
	}));
	const cancelButtonOptions = computed<iButtonConfig>(() => ({
		title: getLocale("close"),
		visible: true,
		btnClass: "",
		...(!!props.cancelButton && props.cancelButton),
	}));
	const show = computed(() => !props.disabled && props.modelValue);

	function closeModalDialog() {
		modalRef.value?.close();
		loadingTooLong.value = false;
	}
	function closeModal() {
		emit("close");
		emit("update:modelValue", false);
		closeModalDialog();
	}
	function clickOutside(e: Event) {
		if (modalRef.value !== e.target) return;
		closeModal();
	}
	function toggleModal(open: boolean = !show.value) {
		if (!open) return closeModalDialog();

		modalRef.value?.showModal();
		// display message if loading longer than usual
		setTimeout(() => (loadingTooLong.value = props.loading), 1000);

		// close modal if requirements are not meet
		if (!props.loading && !props.canShow) {
			closeModalDialog();
			Swal.fire({
				title: getLocale("swal.modal_unauthorized"),
				text: getLocale("swal.modal_unauthorized_text"),
				icon: "warning",
			});
		}
	}

	// lifecycle
	onMounted(() => {
		if (show.value) toggleModal(true);
	});
	onUnmounted(() => {
		if (show.value) closeModal();
	});
	watch(show, (show) => toggleModal(show), { immediate: false });
</script>
