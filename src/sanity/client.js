import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

export const client = createClient({
  projectId: "k9jhault", // Your actual Project ID
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true, // Re-enable CDN for faster loading
});

const builder = createImageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);