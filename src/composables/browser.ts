import { iPluginOptions } from "../types";
import { Ref, inject, ref } from "vue";

interface iBrowser {
	isBrowser: boolean;
	laptopMQRange?: Ref<boolean>;
	tabletMQRange?: Ref<boolean>;
	mobileMQRange?: Ref<boolean>;
}

/**
 * Browser Composable
 *
 * @composable
 */
export function BrowserComposable(): { isBrowser: boolean };
export function BrowserComposable(setMQlisteners: true): Required<iBrowser>;
export function BrowserComposable(setMQlisteners: boolean = false): iBrowser {
	const vueComponentSystem = inject<iPluginOptions>("vueComponentSystem");

	const isBrowser = typeof window !== "undefined";

	if (setMQlisteners) {
		const laptopMQRange = ref<boolean>(false);
		const tabletMQRange = ref<boolean>(false);
		const mobileMQRange = ref<boolean>(false);

		// listeners only work on browser
		if (isBrowser) {
			// Viewport listeners
			function laptopMQHandler(e: MediaQueryList | MediaQueryListEvent) {
				laptopMQRange.value = e.matches;
			}
			function tabletMQHandler(e: MediaQueryList | MediaQueryListEvent) {
				tabletMQRange.value = e.matches;
			}
			function mobileMQHandler(e: MediaQueryList | MediaQueryListEvent) {
				mobileMQRange.value = e.matches;
			}
			function matchMedia(size?: number) {
				return window.matchMedia(`(max-width: ${size}px)`);
			}
			// Define MQlist
			const laptopMQList = matchMedia(vueComponentSystem?.laptopMQPx);
			const tabletMQList = matchMedia(vueComponentSystem?.tabletMQPx);
			const mobileMQList = matchMedia(vueComponentSystem?.mobileMQPx);
			// Mount listeners
			laptopMQList.addEventListener("change", laptopMQHandler, true);
			tabletMQList.addEventListener("change", tabletMQHandler, true);
			mobileMQList.addEventListener("change", mobileMQHandler, true);
			// Set initial values
			laptopMQHandler(laptopMQList);
			tabletMQHandler(tabletMQList);
			mobileMQHandler(mobileMQList);
		}

		return {
			isBrowser,
			laptopMQRange,
			tabletMQRange,
			mobileMQRange,
		};
	}

	return { isBrowser };
}
