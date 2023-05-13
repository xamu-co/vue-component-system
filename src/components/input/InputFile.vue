<template>
	<div :class="classes" class="box --button flx --flxColumn --flx-start-stretch --gap-10">
		<ul
			v-if="amount > 1 && thumbnails.length >= 1"
			class="flx --flxRow --flx-start-center --gap-10"
		>
			<li
				v-for="(thumb, thumb_index) in thumbnails"
				:key="thumb_index"
				class="flx --flxRow --flx-start-center --gap-5"
			>
				<Action
					class="avatar --index --bdr"
					:tooltip="getLocale('input_delete_files', 1)"
					tooltip-position="bottom"
					@click.prevent="removeFile(thumb_index)"
				>
					<div class="back">
						<Img :src="thumb" :alt="getLocale('input_thumb')" />
					</div>
					<ActionLink theme="light" class="--shadow">
						<IconFa name="xmark" size="20" />
					</ActionLink>
				</Action>
			</li>
			<li>
				{{ getLocale("input_one_of_amount", { count: model.length, amount }) }}
			</li>
		</ul>
		<label
			v-show="model.length < amount && !isLoading"
			ref="dropAreaRef"
			:class="[...inputThemeClasses, { '--bgColor-none': !isDragover }]"
			class="box --bdr-dashed --size-xs flx --flxColumn --flx-center --minHeight-90"
			:for="id"
		>
			<div class="--txtColor-none txt --txtAlignFlx-center">
				<template v-if="!isDragover">
					<p>
						<b>
							{{ getLocale("input_choose_file", amount) }}
						</b>
						{{
							(isAdvancedUpload &&
								!isDragover &&
								getLocale("input_or_drop_files_here", amount)) ||
							""
						}}
					</p>
					<p class="--txtSize-xs">
						{{ getLocale("input_max_file_size_mb", { size: maxSize / 1e6 }) }}
					</p>
				</template>
				<p v-else>
					<b>
						{{ getLocale("input_drop_files_here", amount) }}
					</b>
				</p>
			</div>
			<Input
				v-bind="{
					id,
					name: `${name}[]`,
					accept: 'image/*',
					multipe: amount > 1,
					emitOnly: true,
					type,
				}"
				hidden
				@change="processFile"
			/>
		</label>
		<div
			v-if="isLoading || (model.length === amount && !isLoading)"
			:class="inputThemeClasses"
			class="box --bdr-solid --size-xs --bgColor-none flx --flxRow --flx-center"
		>
			<template v-if="isLoading">
				{{ getLocale("input_loading_files", amount) }}
			</template>
			<template v-else>
				<p>
					{{ getLocale("input_completed") }}
				</p>
				<ActionButton
					:theme="inputThemeValues[0]"
					:aria-label="getLocale('input_delete_files', amount)"
					@click.prevent="clearFiles"
				>
					{{ getLocale("input_delete_files", amount) }}
				</ActionButton>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { PropType, computed, onBeforeUnmount, onMounted, ref } from "vue";
	import debounce from "lodash/debounce";

	import {
		fileMatchesMimeTypes,
		standardImageMimeTypes,
		renameFile,
		getBase64FromImageFile,
	} from "@open-xamu-co/common-helpers";

	import Img from "../Img.vue";
	import Input from "./Input.vue";
	import IconFa from "../icon/IconFa.vue";
	import Action from "../action/Action.vue";
	import ActionButton from "../action/ActionButton.vue";
	import ActionLink from "../action/ActionLink.vue";
	import {
		InputModifiersComposable,
		InputModifiersProps,
		InputProps,
		UtilsComposable,
		SwalComposable,
	} from "../../composables";
	import { iDropEvent } from "../../types";

	/**
	 * File Input element
	 * TODO: Theme support
	 * TODO: Support more than images, add dinamyc file types (mapping mimes)
	 *
	 * Apparently using ref is enough to link a dom element to a vue3 ref()
	 * @see: https://markus.oberlehner.net/blog/refs-and-the-vue-3-composition-api/
	 *
	 * @component
	 */

	const props = defineProps({
		...InputModifiersProps,
		...InputProps,
		type: {
			type: String as PropType<"file">,
			default: "file",
		},
		value: {
			type: Array as PropType<File[]>,
			default: () => [],
		},
		modelValue: {
			type: Array as PropType<File[]>,
			default: null,
		},
		filePrefix: {
			type: String,
			default: "xamu",
		},
		amount: {
			type: Number,
			default: 1,
		},
		maxSize: {
			type: Number,
			default: 1e7,
		},
	});

	const emit = defineEmits(["blur", "focus", "update:modelValue"]);

	const { Swal } = SwalComposable();
	const { getModifierClasses, getLocale, isBrowser } = UtilsComposable();
	const { inputClasses, inputThemeClasses, inputThemeValues } = InputModifiersComposable()(props);

	const isAdvancedUpload = ref(false);
	const thumbnails = ref<string[]>([]);
	const isLoading = ref(false);
	const isDragover = ref(false);
	const dropAreaRef = ref<HTMLElement>();

	/**
	 * Input model
	 */
	const model = computed({
		get: () => props.modelValue ?? props.value,
		set: (value) => emit("update:modelValue", value),
	});

	const classes = computed<string[]>(() => {
		return [
			inputClasses.value,
			getModifierClasses(
				[
					{
						disabled: !isLoading.value && props.disabled,
					},
				],
				{ suffix: "is" }
			),
		].flat(2);
	});

	/**
	 * setValue File
	 */
	function setValue(newValue: File[] = []) {
		model.value = newValue;
	}

	/**
	 * check support for drag and drop
	 */
	function checkAdvancedUploadSupport() {
		const div = document.createElement("div");
		return (
			("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
			"FormData" in window &&
			"FileReader" in window
		);
	}

	/**
	 * just a prevent
	 */
	function prevent(e: Event) {
		e.preventDefault();
		e.stopPropagation();
	}

	/**
	 * stores the files
	 */
	async function storeFiles(files: FileList) {
		//store the file object in a normal array
		const archives = [...model.value];
		const thumbs = [...thumbnails.value];
		try {
			// reset files
			isLoading.value = true;
			thumbnails.value = [];
			setValue();

			for (let i = 0; i < files.length; i++) {
				// omit if max file reached
				if (archives.length >= props.amount) {
					if (i === files.length - 1) {
						//last one, launch swal
						Swal.fire({
							title: getLocale("dialog.input_file_limit"),
							text: getLocale("dialog.input_file_limit_text", {
								count: props.amount,
								amount: props.amount,
							}),
							icon: "warning",
						});
					}
				} else {
					// TODO: Allow for multiple file types
					//validate file "mime type"
					const isImage = await fileMatchesMimeTypes(files[i], standardImageMimeTypes);
					// 50MB max file size
					if (isImage && files[i].size < props.maxSize) {
						// is image file
						archives.push(renameFile(files[i], props.filePrefix + "_" + i));
						if (props.amount > 1) {
							//build thumbs
							thumbs.push(await getBase64FromImageFile(files[i]));
						}
					} else if (!isImage) {
						// not image
						Swal.fire({
							title: getLocale("dialog.input_wrong_format_image"),
							text: getLocale("dialog.input_wrong_format_image_text"),
							icon: "warning",
						});
					} else {
						// file too big
						Swal.fire({
							title: getLocale("dialog.input_too_big"),
							text: getLocale("dialog.input_too_big_text"),
							icon: "warning",
						});
					}
				}
				if (i === files.length - 1) {
					// last one, save all.
					thumbnails.value = thumbs;
					setValue(archives);
					isLoading.value = false;
					return;
				}
			}
		} catch (error) {
			// algo paso
			// console.log(error);
			thumbnails.value = thumbs;
			setValue(archives);
			isLoading.value = false;
			return Swal.fire({
				title: getLocale("dialog.input_unknown_error"),
				text: getLocale("dialog.input_unknown_error_text"),
				icon: "error",
				timer: undefined,
				showConfirmButton: true,
			});
		}
	}
	/**
	 * drag event is over
	 */
	function isOver(e: Event) {
		//cursor is over
		prevent(e);
		isDragover.value = true;
	}
	/**
	 * cursor is out of bounds
	 */
	function isOut(e: Event) {
		//cursor is out
		prevent(e);
		isDragover.value = false;
	}
	/**
	 * file was droped
	 */
	function isDrop(e: Event) {
		isOut(e);
		const store = (drop: iDropEvent) => {
			storeFiles(drop.dataTransfer?.files || drop.originalEvent.dataTransfer.files);
		};
		store(e as iDropEvent);
	}
	/**
	 * file was selected from file explorer
	 * process files on explorer search
	 */
	function processFile(e: Event) {
		//
		prevent(e);
		storeFiles((e.target as HTMLInputElement).files!);
	}
	/**
	 * delete saved files
	 */
	function clearFiles() {
		debounce(() => {
			setValue();
			thumbnails.value = [];
		})();
	}
	/**
	 * remove the given file in the given key
	 */
	function removeFile(index: number) {
		debounce(() => {
			const archives = [...model.value];
			const thumbs = [...thumbnails.value];
			// reset files
			setValue();
			thumbnails.value = [];
			// modify
			archives.splice(index, 1);
			thumbs.splice(index, 1);
			// set again
			setValue(archives);
			thumbnails.value = thumbs;
		})();
	}
	/**
	 * check if files are complete
	 */
	// function validFiles() {
	// 	return fileStore.value.length === props.amount;
	// }

	// lifecycle
	if (isBrowser()) {
		/**
		 * set/unset drag & drop listeners
		 */
		function setListeners(set = true) {
			if (!isAdvancedUpload.value && set) return;
			const call = set ? "addEventListener" : "removeEventListener";
			if (!dropAreaRef.value) return;
			// Add/remove our drag&drop listeners
			dropAreaRef.value[call]("drag", prevent, false);
			dropAreaRef.value[call]("dragstart", prevent, false);
			dropAreaRef.value[call]("dragend", isOut, false);
			dropAreaRef.value[call]("dragleave", isOut, false);
			dropAreaRef.value[call]("drop", isDrop, false);
			dropAreaRef.value[call]("dragover", isOver, false);
			dropAreaRef.value[call]("dragenter", isOver, false);
		}
		isAdvancedUpload.value = checkAdvancedUploadSupport();

		onMounted(() => {
			setListeners();
		});
		onBeforeUnmount(() => {
			setListeners(false);
		});
	}
</script>
