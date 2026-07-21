import { Image } from '@shopify/hydrogen';
import { useState, useEffect } from 'react';

/**
 * @param {{
 *   image: ProductVariantFragment['image'];
 * }}
 */
export function ProductImage({ image }) {
  if (!image) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No image</span>
      </div>
    );
  }
  
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="aspect-square rounded-lg overflow-hidden bg-gray-50">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
        loading="eager"
        className={`w-full h-full object-cover transition-all duration-500 ${
          loaded ? 'blur-0 scale-100' : 'blur-xl scale-105'
        }`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */