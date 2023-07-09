<script lang="ts">
	import type { tPropsModifier } from "@open-xamu-co/components-types";
	import { UtilsComposable } from "@open-xamu-co/components-helpers";

	import Global from "../modifiers/Global.svelte";

	/**
	 * Icon
	 *
	 * @component
	 * @example
	 * <Icon size="50" />
	 */

	/** @props Wheter or not render the wrapper */
	export let hidden: tPropsModifier;
	/** @props Wheter or not render the wrapper */
	export let size: string | number;
	/** @props HTML class attribute */
	export let classes: string | string[];

	const { getClassesString } = UtilsComposable();
</script>

<Global {size} {hidden} let:globalClasses>
	<i
		aria-hidden="true"
		class={getClassesString([globalClasses, !!$$slots.default ? "svg" : "icon", classes])}
	>
		<slot />
	</i>
</Global>
