import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url"; // FIXED: Uses named export

export const client = createClient({
  projectId: "k9jhault",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = createImageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);