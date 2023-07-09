<script lang="ts">
	import type { ComponentType } from "svelte";

	/**
	 * Wrapper Component
	 *
	 * @component
	 * @example
	 * <Wrapper></Wrapper>
	 */

	/** @props Wheter or not render the wrapper */
	export let render: boolean;
	/** @props Component or tag to render */
	export let el: ComponentType<any> | string = "div";
</script>

{#if render}
	{#if typeof el == "string"}
		<svelte:element this={el}>
			<slot />
		</svelte:element>
	{:else}
		<svelte:component this={el}>
			<slot />
		</svelte:component>
	{/if}
{:else}
	<slot />
{/if}
