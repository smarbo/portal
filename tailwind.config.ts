import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.tsx",
  ],
  theme: {
    extend: {
			backgroundImage: {
				"wallpaper-default": "url('/wallpaper.jpg')",
			}
    },
  },
};
export default config;
