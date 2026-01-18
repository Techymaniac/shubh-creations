import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url"; // FIX: Used specific import

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}