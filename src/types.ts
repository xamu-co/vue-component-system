import { DefineComponent } from "vue";

export type tComposableProps<T extends Record<string, any>> = InstanceType<
	DefineComponent<T>
>["$props"];
