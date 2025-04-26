// lib/sanityImage.ts
// import imageUrlBuilder from '@sanity/image-url';
// import { client } from './client';

// const builder = imageUrlBuilder(client);

// export function urlFor(source: any) {
//   return builder.image(source);
// }

export function slugify  (text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/(^-|-$)+/g, '');   // Remove starting/ending hyphens
  };
  