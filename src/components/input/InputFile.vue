<template>
	<div :class="classes">
		<ul v-if="amount > 1 && thumbnails.length >= 1" class="x-file-thumbs">
			<li v-for="(thumb, thumb_index) in thumbnails" :key="thumb_index">
				<!-- TODO: use avatar -->
				<button
					class="x-file-thumbs-button"
					:data-tooltip="t('input_file.delete_files')"
					data-tooltip-bottom
					data-tooltip-text
					data-tooltip-bg="secondary"
					@click.prevent="removeFile(thumb_index)"
				>
					<NuxtImg format="webp" :src="thumb" :alt="t('input_file.thumb')" />
				</button>
			</li>
			<li>
				{{ t("input_file.one_of_amount", { count: model.length, amount }) }}
			</li>
		</ul>
		<ProtoInput
			v-bind="
				getProps({
					classes: ['--hidden'],
					name: `${name}[]`,
					accept: 'image/*',
					multipe: amount > 1,
					emitOnly: true,
					type,
				})
			"
			@change="processFile"
		/>
		<label
			v-show="model.length < amount && !isLoading"
			ref="dropAreaRef"
			:for="id"
			class="x-file-drop"
		>
			<div
				:class="[
					`--txtColor-${!isDragover ? 'secondary' : 'light'}`,
					'txt',
					'--gap-5',
					'--txtAlignFlx-center',
				]"
			>
				<template v-if="isAdvancedUpload && !isDragover">
					<p>
						<b>
							{{ t("input_file.choose_file", amount) }}
						</b>
						{{ t("input_file.or_drop_files_here", amount) }}
					</p>
					<p class="--txtSize-xs">
						{{ t("input_file.max_file_size_mb", { size: maxSize / 1e6 }) }}
					</p>
				</template>
				<template v-else-if="!isDragover">
					<p>
						<b>
							{{ t("input_file.choose_file", amount) }}
						</b>
					</p>
					<p class="--txtSize-xs">
						{{ t("input_file.max_file_size_mb", { size: maxSize / 1e6 }) }}
					</p>
				</template>
				<p v-else>
					<b>
						{{ t("input_file.drop_files_here", amount) }}
					</b>
				</p>
			</div>
		</label>
		<div v-show="model.length === amount && !isLoading" class="x-file-full">
			<div class="--txtColor-secondary txt --gaping-5 --txtAlignFlx-center">
				<p>
					{{ t("input_file.completed") }}
					<LazyActionButton
						:aria-label="t('input_file.delete_files', amount)"
						@click.prevent="clearFiles"
					>
						{{ t("input_file.delete_files", amount) }}
					</LazyActionButton>
				</p>
			</div>
		</div>
		<div v-show="isLoading" class="x-file-full">
			{{ t("input_file.loading_files", amount) }}
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { PropType } from "vue";

	import {
		fileMatchesMimeTypes,
		getBase64FromImageFile,
		renameFile,
		standardImageMimeTypes,
		debounce,
	} from "@xamu-co/shared-helpers";

	import { iDropEvent, tProp } from "~~/resources/types";
	import { InputComposable } from "~~/composables/useComponent/input";

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
		...InputComposable,
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

	const { t } = useI18n({ useScope: "local" });
	const { defaultInputClasses, getProps, getPrefixedClasses } = useComponentInput(props);
	const { Swal } = useSwal();
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

	const classes = computed<tProp[]>(() => [
		...defaultInputClasses.value,
		...getPrefixedClasses(
			[
				{ full: model.value.length === props.amount },
				{ loading: isLoading.value },
				{ disabled: !isLoading.value && props.disabled },
				{ dragover: isDragover.value },
			],
			"is"
		),
		"x-file",
	]);

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
							title: t("input_file.swal.file_limit"),
							text: t("input_file.swal.file_limit_text", {
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
							title: t("input_file.swal.wrong_format_image"),
							text: t("input_file.swal.wrong_format_image_text"),
							icon: "warning",
						});
					} else {
						// file too big
						Swal.fire({
							title: t("input_file.swal.too_big"),
							text: t("input_file.swal.too_big_text"),
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
				title: t("input_file.swal.unknown_error"),
				text: t("input_file.swal.unknown_error_text"),
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
	function isDrop(e: Event | iDropEvent) {
		isOut(e);
		storeFiles(
			(e as iDropEvent).dataTransfer!.files ||
				(e as iDropEvent).originalEvent.dataTransfer.files
		);
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

	if (process.client) {
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

<i18n lang="json" locale="en" src="~~/resources/locale/en/component/InputFile.json"></i18n>
<i18n lang="json" locale="es" src="~~/resources/locale/es/component/InputFile.json"></i18n>

<style lang="scss">
	.x-file {
		border-radius: 1rem;
		// font-family: Arial, sans-serif;
		letter-spacing: 0.2px;
		padding: 0.6rem;
		background: color(secondary, 0.1);
		transition: all 0.3s ease-out;
		box-sizing: border-box;
		&.is--disabled {
			opacity: 0.3;
			pointer-events: none;
		}
		&.is--full,
		&.is--loading {
			background: transparent;
			&:before {
				opacity: 1;
			}
			.file {
				&-thumbs {
					display: none;
				}
			}
		}
		&:before {
			content: "";
			pointer-events: none;
			display: block;
			position: absolute;
			opacity: 0;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border: 2px dashed color(secondary, 0.1);
			border-radius: 1rem;
			box-sizing: border-box;
			transition: all 0.3s ease-out;
		}
		&:not(.is--full):not(.is--loading) {
			&:hover {
				background: color(secondary, 0.3);
				.x-file-drop {
					border-color: color(secondary, 0.3);
				}
			}
			&.is--dragover {
				// @include linear-gradient($main_back...);
				background-color: color(secondary);
				.x-file-drop {
					border-color: color(light, 0.3);
				}
			}
		}
		input[type~="file"]:focus + .x-file-drop {
			border-color: color(secondary);
		}
		&-drop,
		&-full {
			width: 100%;
			border-radius: 0.6rem;
			padding: 1rem;
			box-sizing: border-box;
			@include flexbox(row, nowrap, center, center);
		}
		&-drop {
			height: 8rem;
			border: 2px dashed color(secondary, 0.1);
			transition: all 0.3s ease-out;
			&:hover {
				cursor: pointer;
			}
			* {
				pointer-events: none;
			}
		}
		&-full {
			background: color(secondary, 0.1);
		}
		&-thumbs {
			width: 100%;
			height: auto;
			// padding: 0 0 0.5rem 0.5rem;
			box-sizing: border-box;
			@include flexbox(row, wrap, flex-start, center);
			> * {
				margin-right: 0.5rem;
				margin-bottom: 0.5rem;
			}
			li {
				color: color(secondary);
			}
			&-button {
				display: block;
				background: color(light);
				border-radius: 1rem;
				overflow: hidden;
				border: 2px solid color(light);
				&:hover {
					cursor: pointer;
					&:before {
						opacity: 1;
					}
					img {
						opacity: 0.3;
					}
				}
				&:before {
					content: "\f00d";
					display: inline-block;
					opacity: 0;
					z-index: 1;
					position: absolute;
					top: 50%;
					left: 50%;
					font-size: 1rem;
					font-family: family(awesome);
					font-weight: 900; // font awesome bold
					color: color(light);
					// text-shadow: 1px 1px 3px color(dark);
					transform: translate(-50%, -50%);
				}
				img {
					z-index: 0;
					display: block;
					width: 3rem;
					height: 3rem;
					border-radius: 0.4rem;
					object-fit: cover;
					object-position: 50% 50%;
					transition: all 0.3s ease-out;
				}
			}
		}
	}
</style>
