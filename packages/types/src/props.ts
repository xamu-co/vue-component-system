import { DefineComponent } from "vue";

export type tProp<T extends string = string> = T | Record<T, boolean>;
export type tProps<T extends string = string> = tProp<T> | tProp<T>[];
export type tPropsModifier<T extends string = string> = boolean | tProps<T>;

export type tComposableProps<T extends Record<string, any>> = InstanceType<
	DefineComponent<T>
>["$props"];
