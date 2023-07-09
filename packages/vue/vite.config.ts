import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		outDir: "./dist",
		lib: {
			entry: path.resolve(__dirname, "./src/lib/index.ts"),
			name: "vueComponentSystem",
			fileName: (_, name) => `${name}.js`,
			formats: ["es"],
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ["vue"],
			output: {
				preserveModules: true,
				preserveModulesRoot: "src/lib",
				inlineDynamicImports: false,
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: { vue: "Vue" },
			},
		},
	},
});
