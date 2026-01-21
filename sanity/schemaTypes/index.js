// sanity/schemaTypes/index.js

const product = {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Product Name",
      type: "string",
    },
    {
      name: "price",
      title: "Price (INR)",
      type: "number",
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Dresses", value: "dresses" },
          { title: "Bags", value: "bags" },
          { title: "Jewellery", value: "jewellery" },
        ],
      },
    },

    // IMAGE (fallback)
    {
      name: "image",
      title: "Product Image (Fallback)",
      type: "image",
      options: { hotspot: true },
    },

    // VIDEO (MP4 looping GIF-style)
    {
      name: "video",
      title: "Product Video (MP4 – Looping, Muted)",
      type: "file",
      options: {
        accept: "video/mp4",
      },
    },

    {
      name: "isNew",
      title: "Is New Arrival?",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "isOutOfStock",
      title: "Out of Stock?",
      type: "boolean",
      initialValue: false,
    },
  ],
};

export const schemaTypes = [product];
