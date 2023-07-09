<script lang="ts">
	import type { HTMLImgAttributes } from "svelte/elements";

	/**
	 * Img Component
	 *
	 * @component
	 * @example
	 * <Img></Img>
	 */

	interface $$props extends HTMLImgAttributes {
		src: string;
		alt: string;
		loading: "eager" | "lazy";
	}

	/** @props image url or path */
	export let src: string = "";
	/** @props image url or path */
	export let alt: string = "";
	/** @props image url or path */
	export let loading: "eager" | "lazy" = "lazy";
</script>

<img {src} {alt} {loading} {...$$restProps} />
