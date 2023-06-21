import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue({
			// customElement: true,
		}),
	],
	build: {
		outDir: "./lib",
		lib: {
			entry: path.resolve(__dirname, "./src/index.ts"),
			name: "vueComponentSystem",
			fileName: "index",
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ["vue"],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					vue: "Vue",
				},
			},
		},
	},
});
