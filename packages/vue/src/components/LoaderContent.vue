<template>
	<transition name="fade" appear>
		<component :is="tag" v-if="hasContent" class="x-loaderContent" v-bind="$attrs">
			<div class="back --overlay" :class="{ 'is--active': isLoading }">
				<Loader :label="label" :hide-label="!label" />
			</div>
			<slot></slot>
		</component>
		<div v-else class="flx --flxColumn --flx-center --width --height">
			<!-- first load -->
			<template v-if="!isLoading">
				<BoxMessage
					v-if="hasErrors"
					theme="danger"
					:text="getLocale('could_not_get_data')"
				/>
				<BoxMessage v-else :text="noContentMessage || getLocale('nothing_to_show')" />
			</template>
			<Loader v-else :label="label || getLocale('loading')" />
		</div>
	</transition>
</template>

<script setup lang="ts">
	import Loader from "./Loader.vue";
	import BoxMessage from "./BoxMessage.vue";
	import { UtilsComposable } from "../composables";

	/**
	 * Content loader
	 *
	 * Display or hide content while it is loading
	 *
	 * @component
	 * @example
	 * <LoaderContent></LoaderContent>
	 */

	defineProps({
		/**
		 * has content
		 * content was loaded but didnt existed
		 */
		hasContent: {
			type: Boolean,
			default: false,
		},
		/**
		 * is loading
		 */
		isLoading: {
			type: Boolean,
			default: false,
		},
		/**
		 * is loading
		 */
		hasErrors: {
			type: Boolean,
			default: false,
		},
		noContentMessage: {
			type: String,
			default: null,
		},
		/**
		 * root tag
		 */
		tag: {
			type: String,
			default: "div",
		},
		label: {
			type: String,
			default: null,
		},
	});

	const { getLocale } = UtilsComposable();
</script>
