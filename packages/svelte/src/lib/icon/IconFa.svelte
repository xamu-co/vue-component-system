<script setup lang="ts">
	import type { IconName } from "@fortawesome/fontawesome-common-types";

	import type { tPropsModifier } from "@open-xamu-co/components-types";
	import { UtilsComposable } from "@open-xamu-co/components-helpers";

	import Icon from "./Icon.svelte";

	/**
	 * FontAwesome Icon
	 *
	 * @component
	 * @example
	 * <IconFa size="50" />
	 */

	/** @props Wheter or not render the wrapper */
	export let hidden: tPropsModifier;
	/** @props Wheter or not render the wrapper */
	export let size: string | number;
	/** @props HTML class attribute */
	export let classes: string | string[];
	/** @props FA icon name */
	export let name: IconName = "cubes";
	/** @props FA icon of regular type */
	export let regular: boolean = false;
	/** @props FA icon of brand type */
	export let brand: boolean = false;

	const { getClassesString } = UtilsComposable();

	/**
	 * Free version of FA only delivers brand, solid and regular
	 * Assumes solid as default
	 */
	$: typeClass = (brand && "fab") || (regular && "far") || "fas";
</script>

<Icon classes={getClassesString([`fa-${name}`, typeClass, classes])} {size} {hidden} />
