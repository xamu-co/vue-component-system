<script lang="ts">
	import { UtilsComposable } from "@open-xamu-co/components-helpers";

	import type { tPropsModifier } from "@open-xamu-co/components-types";

	/**
	 * Global modifier classes component
	 *
	 * @component
	 * @example
	 * <Global />
	 */

	/** @props Wheter or not render the wrapper */
	export let hidden: tPropsModifier;
	/** @props Wheter or not render the wrapper */
	export let size: string | number;

	const { getModifierClasses: GMC } = UtilsComposable();

	$: sizeClasses = size ? GMC([String(size)], { modifier: "size", divider: "-" }) : [];
	$: hiddenClasses = hidden ? GMC(hidden, { modifier: "hidden" }) : [];
	$: globalClasses = [hiddenClasses, sizeClasses].flat(2);
</script>

<div><slot {globalClasses} /></div>
