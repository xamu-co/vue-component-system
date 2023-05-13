declare module "*.vue" {
	import { DefineComponent } from "vue";
	const component: DefineComponent;
	export default component;
}

declare module "interpolate-string" {
	export default function (text: string, data?: Record<string, any>, pattern?: RegExp): string;
}
