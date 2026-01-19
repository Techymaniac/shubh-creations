import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

export const client = createClient({
  // Hardcoding these ensures the connection works immediately in the browser
  projectId: "k9jhault", 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true, // Enabling CDN for faster delivery of your Mangalsutra and Dress items
});

const builder = createImageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}