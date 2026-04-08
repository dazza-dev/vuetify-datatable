import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue(), dts({ tsconfigPath: "./tsconfig.json" })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VuetifyDatatable",
      fileName: "vuetify-datatable",
    },
    rollupOptions: {
      external: ["vue", "vuetify", "vuetify/components", "vuetify/directives"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
          vuetify: "Vuetify",
        },
      },
    },
  },
});
