// lib/sanityImage.ts
import imageUrlBuilder from '@sanity/image-url';
import { client } from './client';

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export function buildCroppedImageUrl(imageUrl: string, crop: any): string {
    const match = imageUrl.match(/-(\d+)x(\d+)\./);
    if (!match) return imageUrl;
  
    const width = parseInt(match[1], 10);
    const height = parseInt(match[2], 10);
  
    const rectX = Math.round(width * crop.left);
    const rectY = Math.round(height * crop.top);
    const rectWidth = Math.round(width * (1 - crop.left - crop.right));
    const rectHeight = Math.round(height * (1 - crop.top - crop.bottom));
  
    return `${imageUrl}?rect=${rectX},${rectY},${rectWidth},${rectHeight}&w=2000&fit=max&auto=format`;
  }
  