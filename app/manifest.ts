import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DE PERFUME SHOP",
    short_name: "DE PERFUME",
    description: "Signature fragrances, curated for every occasion.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f4f0",
    theme_color: "#111111",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
