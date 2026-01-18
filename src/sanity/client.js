import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

export const client = createClient({
  projectId: "k9jhault", // Hardcoded to ensure build passes
  dataset: "production", // Hardcoded to ensure build passes
  apiVersion: "2024-01-01",
  useCdn: false,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}