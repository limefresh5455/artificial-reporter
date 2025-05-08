import { urlFor } from '@/lib/sanityImage';
import { PortableText, PortableTextComponents } from '@portabletext/react';

type Props = {
  content: any[]; // Portable Text array from Sanity
};

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;

      const ref = value.asset._ref;
      const [id, dimensions, format] = ref
        .replace('image-', '')
        .split('-');
      const imageUrl = urlFor(value.asset).url();

      return <img src={imageUrl} alt="Article visual" className="my-4 rounded-lg" />;
    }
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  },
  block: {
    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
  },
};

export default function PortableTextRenderer({ content }: Props) {
    // console.log(type)
  return <PortableText value={content} components={components}  />;
}
