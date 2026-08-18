import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" keeps asset paths relative, so the same build works on a GitHub
// Pages project site (user.github.io/repo-name/), a user site, or any subfolder
// without needing to hard-code the repository name.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
