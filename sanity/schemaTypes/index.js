// sanity/schemaTypes/index.js

const product = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
    },
    {
      name: 'price',
      title: 'Price (INR)',
      type: 'number',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Dresses', value: 'dresses' },
          { title: 'Bags', value: 'bags' },
          { title: 'Jewellery', value: 'jewellery' },
        ],
      },
    },
    {
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true }, // Allows you to crop images on your phone
    },
    {
      name: 'isNew',
      title: 'Is New Arrival?',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'isOutOfStock',
      title: 'Out of Stock?',
      description: 'Turn this ON to hide the item from the website',
      type: 'boolean',
      initialValue: false
    }
  ],
}

export const schemaTypes = [product]