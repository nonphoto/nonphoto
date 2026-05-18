// @ts-check
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Mono",
      cssVariable: "--font-mono",
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/KHTekaMono-Book.woff2"],
          },
          {
            weight: 700,
            style: "normal",
            src: ["./src/assets/fonts/KHTekaMono-Medium.woff2"],
          },
        ],
      },
    },
  ],
});
