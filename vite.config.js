import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],

    server: {
        proxy: {
            "/musicbrainz": {
                target: "https://musicbrainz.org",
                changeOrigin: true,
                rewrite: (path) =>
                    path.replace(/^\/musicbrainz/, "/ws/2")
            }
        }
    }
});