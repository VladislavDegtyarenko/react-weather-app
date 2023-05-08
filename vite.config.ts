import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/react-weather-app/",
  plugins: [react(), EnvironmentPlugin(["VITE_RAPID_API_KEY", "VITE_WEATHER_API_KEY"])],
});
