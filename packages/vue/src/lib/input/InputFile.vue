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
					:tooltip="getLocale('file_delete_files', 1)"
					tooltip-position="bottom"
					@click.prevent="removeFile(thumb_index)"
				>
					<div class="back">
						<Img :src="thumb" :alt="getLocale('file_thumb')" />
					</div>
					<ActionLink theme="light" class="--shadow">
						<IconFa name="xmark" size="20" />
					</ActionLink>
				</Action>
			</li>
			<li>
				{{ getLocale("file_one_of_amount", { count: model.length, amount }) }}
			</li>
		</ul>
		<label
			v-show="model.length < amount && !isLoading"
			:class="[...themeClasses, { '--bgColor-none': !isDragover }]"
			class="box --bdr-dashed --size-xs flx --flxColumn --flx-center --minHeight-90"
			:for="id"
			@drag="prevent"
			@dragstart="prevent"
			@dragend="isOut"
			@dragleave="isOut"
			@drop="isDrop"
			@dragover="isOver"
			@dragenter="isOver"
		>
			<div class="--txtColor-none txt --txtAlignFlx-center">
				<template v-if="!isDragover">
					<p>
						<b>
							{{ getLocale("file_choose_file", amount) }}
						</b>
						{{
							(isAdvancedUpload &&
								!isDragover &&
								getLocale("file_or_drop_files_here", amount)) ||
							""
						}}
					</p>
					<p class="--txtSize-xs">
						{{ getLocale("file_max_file_size_mb", { size: maxSize / 1e6 }) }}
					</p>
				</template>
				<p v-else>
					<b>
						{{ getLocale("file_drop_files_here", amount) }}
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
				v-on="inputListeners(emit)"
				@change="processFile"
			/>
		</label>
		<div
			v-if="isLoading || (model.length === amount && !isLoading)"
			:class="themeClasses"
			class="box --bdr-solid --size-xs --bgColor-none flx --flxRow --flx-center"
		>
			<template v-if="isLoading">
				{{ getLocale("file_loading_files", amount) }}
			</template>
			<template v-else>
				<p>
					{{ getLocale("file_completed") }}
				</p>
				<ActionButton
					:theme="themeValues[0]"
					:aria-label="getLocale('file_delete_files', amount)"
					@click.prevent="clearFiles"
				>
					{{ getLocale("file_delete_files", amount) }}
				</ActionButton>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { PropType, computed, inject, ref } from "vue";
	import debounce from "lodash/debounce";

	import {
		fileMatchesMimeTypes,
		standardImageMimeTypes,
		renameFile,
		getBase64FromImageFile,
	} from "@open-xamu-co/common-helpers";
	import { SwalComposable, UtilsComposable } from "@open-xamu-co/components-helpers";

	import { iDropEvent, iPluginOptions } from "@open-xamu-co/components-types";

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
		BrowserComposable,
		inputListeners,
	} from "../composables";

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
	const emit = defineEmits(["focus", "blur", "update:modelValue"]);

	const systemOptions = inject<iPluginOptions>("vueComponentSystem");
	const { Swal } = SwalComposable(systemOptions);
	const { getModifierClasses, getLocale } = UtilsComposable(systemOptions);
	const { isBrowser } = BrowserComposable();
	const { inputClasses, themeClasses, themeValues } = InputModifiersComposable()(props);

	const isAdvancedUpload = ref(false);
	const thumbnails = ref<string[]>([]);
	const isLoading = ref(false);
	const isDragover = ref(false);

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
							title: getLocale("swal.file_limit"),
							text: getLocale("swal.file_limit_text", {
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
							title: getLocale("swal.file_wrong_format_image"),
							text: getLocale("swal.file_wrong_format_image_text"),
							icon: "warning",
						});
					} else {
						// file too big
						Swal.fire({
							title: getLocale("swal.file_too_big"),
							text: getLocale("swal.file_too_big_text"),
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
				title: getLocale("swal.file_unknown_error"),
				text: getLocale("swal.file_unknown_error_text"),
				icon: "error",
				timer: undefined,
				showConfirmButton: true,
			});
		}
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
	 * just a prevent
	 *
	 * @listener
	 */
	function prevent(e: Event) {
		if (!isAdvancedUpload.value) return;
		e.preventDefault();
		e.stopPropagation();
	}
	/**
	 * drag event is over
	 *
	 * @listener
	 */
	function isOver(e: Event) {
		//cursor is over
		prevent(e);
		isDragover.value = true;
	}
	/**
	 * cursor is out of bounds
	 *
	 * @listener
	 */
	function isOut(e: Event) {
		//cursor is out
		prevent(e);
		isDragover.value = false;
	}
	/**
	 * file was droped
	 *
	 * @listener
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
	 *
	 * @listener
	 */
	function processFile(e: Event) {
		//
		prevent(e);
		storeFiles((e.target as HTMLInputElement).files!);
	}
	/**
	 * check if files are complete
	 */
	// function validFiles() {
	// 	return fileStore.value.length === props.amount;
	// }

	// lifecycle
	if (isBrowser) isAdvancedUpload.value = checkAdvancedUploadSupport();
</script>
