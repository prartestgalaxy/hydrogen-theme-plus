import React, { useState, useEffect } from 'react';
import { Image, Money } from '@shopify/hydrogen';
import { useVariantUrl } from '~/lib/variants';
import QuickView from './QuickView';
import { Link } from '~/components/Link';

// Heart Icon Component
function HeartIcon({ filled, colorClass }) {
  return (
    <svg
      className={`w-5 h-5 transition-colors duration-200 ${colorClass}`}
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}

// Helper function to get badge color from config
const getBadgeColorFromConfig = (colorValue) => {
  return colorValue || '#6b7280';
};

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 *   aspectRatio?: string;
 *   textAlign?: 'left' | 'center';
 *   showQuickView?: boolean;
 *   quickViewConfig?: any;
 *   // Wishlist props - updated to match Products page pattern
 *   wishlist?: Array<{id: string}>;
 *   setWishlist?: (wishlist: Array<any>) => void;
 *   isWishlistEnabled?: boolean;
 *   isLoggedIn?: boolean;
 *   getButtonPosition?: () => string;
 *   getHeartColor?: (isInWishlist: boolean) => string;
 *   canAddToWishlist?: (isLoggedIn: boolean) => boolean;
 *   inventorySettings?: any;
 *   activeCurrency?: string;
 * }}
 */
export function ProductItem({ 
  product, 
  loading, 
  showQuickView = true, 
  quickViewConfig, 
  aspectRatio = 'aspect-square', 
  textAlign = 'left',
  // Wishlist props - updated to match Products page
  wishlist = [],
  setWishlist,
  isWishlistEnabled = false,
  isLoggedIn = false,
  getButtonPosition = () => 'top-2 right-2',
  getHeartColor = (isWished) => isWished ? 'text-red-500' : 'text-gray-400',
  canAddToWishlist = (loggedIn) => loggedIn,
  inventorySettings,
  activeCurrency,
  locale
}) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // force remove blur after hydration
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Check if product is in wishlist - using the wishlist array
  const isWished = wishlist?.some((item) => item.id === product.id) || false;

  // Initial Variant & Options Logic
  const variantsNodes = product.variants?.nodes || product.variants || [];
  const initialVariant = variantsNodes[0] || null;
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);

  const getOptionsFromVariant = (variant) => {
    const opts = {};
    variant?.selectedOptions?.forEach(opt => opts[opt.name] = opt.value);
    return opts;
  };

  const [currentOptions, setCurrentOptions] = useState(getOptionsFromVariant(initialVariant));

  useEffect(() => {
    if (!variantsNodes.length) return;

    const match = variantsNodes.find(v => {
      return v.selectedOptions.every(opt => currentOptions[opt.name] === opt.value);
    });

    if (match) {
      setSelectedVariant(match);
    }
  }, [currentOptions, variantsNodes, initialVariant]);

  // Derived Data
  const productHandle = product.handle || product.slug;
  const variantUrl = useVariantUrl(productHandle, selectedVariant?.selectedOptions);

  // --- IMAGE FIX ---
  const rawImage = selectedVariant?.image || product.featuredImage || product.imageUrl;
  const image = typeof rawImage === 'string' ? { url: rawImage, altText: product.title } : rawImage;

  const imageAspectRatio = aspectRatio === 'aspect-square' ? '1/1' : (aspectRatio.match(/aspect-\[(\d+\/\d+)\]/)?.[1] || '1/1');

  // --- PRICE FIX ---
  const rawPrice = selectedVariant?.price || product.priceRange?.minVariantPrice || product.price;
  
  const priceAmount = typeof rawPrice === 'object' ? rawPrice?.amount : rawPrice?.toString();
  const originalCurrency = typeof rawPrice === 'object' ? rawPrice?.currencyCode : product.priceRange?.minVariantPrice?.currencyCode;

  const price = { 
    amount: priceAmount || "0", 
    currencyCode: activeCurrency || originalCurrency || "USD" 
  };

  const rawCompareAtPrice = selectedVariant?.compareAtPrice || product.compareAtPrice;
  const compareAmount = typeof rawCompareAtPrice === 'object' ? rawCompareAtPrice?.amount : rawCompareAtPrice?.toString();
  
  const compareAtPrice = compareAmount ? { 
    amount: compareAmount, 
    currencyCode: activeCurrency || (typeof rawCompareAtPrice === 'object' ? rawCompareAtPrice?.currencyCode : price.currencyCode) 
  } : null;

  // ---------------- INVENTORY LOGIC (Same as PLP) ----------------
  const variant = selectedVariant || variantsNodes[0];
  const quantity = variant?.quantityAvailable ?? 0;
  const isAvailable = variant?.availableForSale ?? false;

  const config = inventorySettings;

  let inventoryBadge = null;
  let badgeColor = '#6b7280';

  if (config?.enableInventoryBadges) {
    // 1️⃣ OUT OF STOCK - Priority 1 (highest)
    if (!isAvailable || quantity === 0) {
      inventoryBadge = config.outOfStockMessage || "Out of Stock";
      badgeColor = getBadgeColorFromConfig(config.outOfStockBadgeColor);
    }
    // 2️⃣ CRITICAL STOCK - Priority 2
    else if (quantity <= config.criticalStockThreshold) {
      inventoryBadge = config.criticalStockMessage || "Critical Stock";
      badgeColor = getBadgeColorFromConfig(config.criticalStockBadgeColor);
    }
    // 3️⃣ LOW STOCK - Priority 3
    else if (quantity <= config.lowStockThreshold) {
      inventoryBadge = config.lowStockMessage || "Low Stock";
      badgeColor = getBadgeColorFromConfig(config.lowStockBadgeColor);
    }
  }

  // Product Options
  const { productOptions } = React.useMemo(() => {
    const variants = variantsNodes;
    const optionsMap = new Map(); 

    variants.forEach(v => {
      v.selectedOptions.forEach(opt => {
        if (!optionsMap.has(opt.name)) optionsMap.set(opt.name, new Set());
        optionsMap.get(opt.name).add(opt.value);
      });
    });

    const options = [];
    optionsMap.forEach((values, name) => {
      options.push({ name, values: Array.from(values) });
    });

    return { productOptions: options };
  }, [variantsNodes]);

  const handleOptionSelect = (e, optionName, value) => {
    e.preventDefault();
    e.stopPropagation();

    const newOptions = { ...currentOptions, [optionName]: value };

    const variants = variantsNodes;
    const exactMatch = variants.find(v =>
      v.selectedOptions.every(opt => newOptions[opt.name] === opt.value)
    );

    if (exactMatch) {
      setCurrentOptions(newOptions);
      setSelectedVariant(exactMatch);
    } else {
      const partialMatch = variants.find(v =>
        v.selectedOptions.some(opt => opt.name === optionName && opt.value === value)
      );
      if (partialMatch) {
        setCurrentOptions(getOptionsFromVariant(partialMatch));
        setSelectedVariant(partialMatch);
      }
    }
  };

  // Wishlist handler - updated to match Products page pattern
  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!canAddToWishlist(isLoggedIn)) {
      window.location.href = '/signin';
      return;
    }

    if (!isWishlistEnabled) {
      alert("Wishlist is currently disabled");
      return;
    }

    try {
      const price = selectedVariant?.price || product.priceRange?.minVariantPrice || product.price;
      
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productTitle: product.title,
          productHandle: productHandle,
          productImage: image?.url || '',
          productPrice: price?.amount || '0',
          variantId: selectedVariant?.id,
          variantTitle: selectedVariant?.title,
          selectedOptions: currentOptions
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update wishlist state with the new wishlist from the server
        if (setWishlist) {
          setWishlist(data.wishlist);
        }
      } else {
        if (data.disabled) {
          alert("Wishlist is currently disabled");
        } else if (data.requiresLogin) {
          window.location.href = '/signin';
        } else {
          alert(data.error || "Please login first");
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <div className="group relative flex flex-col">
        <Link
          className="product-item block no-underline"
          key={product.id}
          prefetch="intent"
          to={variantUrl}
        >
          <div className={`relative overflow-hidden bg-[#F5F5F5] ${aspectRatio}`}>
            {image?.url && (
              <Image
                alt={image.altText || product.title}
                aspectRatio={imageAspectRatio}
                data={image}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                loaderOptions={{ scale: 0.1 }}
                className={`w-full h-full object-cover filter transition-all duration-500 transform transition-transform duration-[2000ms] ease-out group-hover:scale-105 ${loaded ? 'blur-0' : 'blur-xl'}`}
                onLoad={(e) => (e.currentTarget.style.filter = 'blur(0)')}
              />
            )}

            {/* Inventory Badge - All 3 message types (Same as PLP) */}
            {inventoryBadge && (
              <div className="absolute top-2 left-2 z-20">
                <span className="text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md" style={{backgroundColor: badgeColor}}>
                  {inventoryBadge}
                </span>
              </div>
            )}

            {/* Wishlist Button - Only show if enabled */}
            {isWishlistEnabled && (
              <button
                onClick={handleWishlistClick}
                aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                className={`absolute ${getButtonPosition()} z-20 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-md hover:scale-110 transition-transform duration-200 border border-gray-200 hover:bg-white`}
              >
                <HeartIcon filled={isWished} colorClass={getHeartColor(isWished)} />
              </button>
            )}

            

            {showQuickView && (
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/5 to-transparent z-10">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsQuickViewOpen(true);
                  }}
                  className="w-full bg-white text-black py-3 text-[11px] font-semibold uppercase tracking-[1.6px] text-center rounded-full shadow-md hover:shadow-lg hover:bg-black hover:text-white transition-all duration-300 ease-out active:scale-95"
                >
                  Quick View
                </button>
              </div>
            )}
          </div>

          <div className={`mt-4 space-y-2 ${textAlign === 'center' ? 'text-center items-center' : 'text-left items-start'}`}>
            <h4 className="text-[14px] font-medium text-gray-900 tracking-tight leading-snug">
              {product.title}
            </h4>

            <div className={`flex items-center gap-2 ${textAlign === 'center' ? 'justify-center' : 'justify-start'}`}>
              <span className="text-[14px] font-bold">
                <Money data={price} />
              </span>
              {compareAtPrice && (
                <span className="text-[12px] text-gray-500 line-through">
                  <Money data={compareAtPrice} />
                </span>
              )}
            </div>

            <div className={`flex flex-col gap-2 pt-1 ${textAlign === 'center' ? 'items-center' : 'items-start'}`} onClick={(e) => e.preventDefault()}>
              {productOptions.map((option) => {
                const isColor = option.name === 'Color' || option.name === 'Colour';
                const isSize = option.name === 'Size';

                if (!isColor && !isSize) return null;

                return (
                  <div key={option.name} className="flex flex-wrap gap-2 items-center">
                    {isSize && <span className="text-[10px] uppercase font-semibold text-gray-500 mr-1">{option.name}:</span>}
                    {option.values.map(value => {
                      const isSelected = currentOptions[option.name] === value;

                      if (isColor) {
                        const safeColor = value.toLowerCase().replace(' ', '');
                        return (
                          <button
                            key={value}
                            onClick={(e) => handleOptionSelect(e, option.name, value)}
                            title={value}
                            className={`w-6 h-6 rounded-full border border-gray-200 transition-all duration-200 ${isSelected ? 'ring-1 ring-offset-2 ring-black scale-110' : 'hover:scale-110'}`}
                            style={{ backgroundColor: safeColor === 'multi' ? 'conic-gradient(red, yellow, green, blue)' : safeColor }}
                          />
                        );
                      }

                      if (isSize) {
                        return (
                          <button
                            key={value}
                            onClick={(e) => handleOptionSelect(e, option.name, value)}
                            className={`text-[11px] px-2 py-1 border rounded min-w-[28px] text-center transition-all ${isSelected ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}
                          >
                            {value}
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </Link>
      </div>

      {showQuickView && (
        <QuickView
          productHandle={productHandle}
          config={quickViewConfig}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          locale={locale}
        />
      )}
    </>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */