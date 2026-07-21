import React, {useState, useEffect, useRef, useCallback} from 'react';
import {createPortal} from 'react-dom';
import {useFetcher, useRouteLoaderData} from 'react-router';
import {useAside} from './Aside';
import {Image, Money, CartForm} from '@shopify/hydrogen';


export default function QuickView({
  productHandle,
  config,
  isOpen,
  onClose,
  locale,
  isWishlistEnabled,
  isLoggedIn,
  wishlist, // Add this
  setWishlist, // Add this
  globalData,
}) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const sliderRef = useRef(null);
  const isScrollingRef = useRef(false);
  const {open} = useAside();
  const fetcher = useFetcher();
  const cartFetcher = useFetcher();
  const rootData = useRouteLoaderData('root');
  const [loaded, setLoaded] = useState(false);


  // Check if current product and variant is in wishlist
  const isWished = () => {
    if (!product || !selectedVariant) return false;

    return (
      wishlist?.some((item) => {
        // Check if it's the same product
        if (item.id === product.id) {
          // If the wishlist item has a variant ID, check if it matches the selected variant
          if (item.variantId && selectedVariant.id) {
            return item.variantId === selectedVariant.id;
          }
          // If the wishlist item doesn't have variant ID, check if it's the same product
          if (!item.variantId && !selectedVariant) {
            return true;
          }
          // If the wishlist item has selected options, check if they match
          if (item.selectedOptions && selectedVariant.selectedOptions) {
            return item.selectedOptions.every((opt) =>
              selectedVariant.selectedOptions.some(
                (vOpt) => vOpt.name === opt.name && vOpt.value === opt.value,
              ),
            );
          }
        }
        return false;
      }) || false
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const activeCountryCode = locale?.country;

  useEffect(() => {
    if (isOpen && productHandle) {
      const countryPrefix =
        activeCountryCode && activeCountryCode !== 'us'
          ? `/${activeCountryCode}`
          : '';
      fetcher.load(`${countryPrefix}/api/quickview?handle=${productHandle}`);
    }
  }, [isOpen, productHandle, activeCountryCode]);

  // Update product when data is loaded
  useEffect(() => {
    if (fetcher.data?.product) {
      const productData = fetcher.data.product;
      setProduct(productData);

      // Set the selected variant - prioritize selectedOrFirstAvailableVariant
      if (productData.selectedOrFirstAvailableVariant) {
        setSelectedVariant(productData.selectedOrFirstAvailableVariant);
      } else if (productData.variants?.nodes?.length > 0) {
        setSelectedVariant(productData.variants.nodes[0]);
      }

      // Collect unique images from variants
      const images = [];
      const seenUrls = new Set();

      if (productData.featuredImage) {
        images.push({
          url: productData.featuredImage.url,
          altText: productData.featuredImage.altText,
          variantIds:
            productData.variants?.nodes
              ?.filter((v) => v.image?.url === productData.featuredImage.url)
              .map((v) => v.id) || [],
        });
        seenUrls.add(productData.featuredImage.url);
      }

      productData.variants?.nodes?.forEach((variant) => {
        if (variant.image?.url && !seenUrls.has(variant.image.url)) {
          images.push({
            url: variant.image.url,
            altText: variant.image.altText || productData.title,
            variantIds: [variant.id],
          });
          seenUrls.add(variant.image.url);
        } else if (variant.image?.url && seenUrls.has(variant.image.url)) {
          const existing = images.find((img) => img.url === variant.image.url);
          if (existing && !existing.variantIds.includes(variant.id)) {
            existing.variantIds.push(variant.id);
          }
        }
      });

      setProductImages(images);
    }
  }, [fetcher.data]);

  // Scroll to the correct image when variant changes
  // useEffect(() => {
  //     if (selectedVariant && productImages.length > 0 && !isScrollingRef.current) {
  //         const imageIndex = productImages.findIndex(img =>
  //             img.variantIds.includes(selectedVariant.id) ||
  //             img.url === selectedVariant.image?.url
  //         );

  //         if (imageIndex !== -1 && sliderRef.current) {
  //             const slider = sliderRef.current;
  //             const scrollLeft = imageIndex * slider.offsetWidth;
  //             slider.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  //             setActiveIndex(imageIndex);
  //         }
  //     }
  // }, [selectedVariant, productImages]);

  // Scroll to the correct image when variant changes
  useEffect(() => {
    // Only trigger if we aren't currently swiping manually
    if (
      selectedVariant &&
      productImages.length > 0 &&
      !isScrollingRef.current
    ) {
      const imageIndex = productImages.findIndex(
        (img) =>
          img.variantIds.includes(selectedVariant.id) ||
          img.url === selectedVariant.image?.url,
      );

      if (
        imageIndex !== -1 &&
        sliderRef.current &&
        imageIndex !== activeIndex
      ) {
        // 1. LOCK the manual scroll listener
        isScrollingRef.current = true;

        const slider = sliderRef.current;
        const scrollLeft = imageIndex * slider.offsetWidth;
        slider.scrollTo({left: scrollLeft, behavior: 'smooth'});
        setActiveIndex(imageIndex);

        // 2. UNLOCK after the smooth scroll finishes (600ms is a safe buffer)
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 600);
      }
    }
  }, [selectedVariant, productImages]); // Removed activeIndex from deps to prevent re-triggering

  // Sync slider scroll to variant selection
  // const handleScroll = useCallback(() => {
  //     if (!sliderRef.current || productImages.length === 0) return;

  //     const slider = sliderRef.current;
  //     const scrollPosition = slider.scrollLeft;
  //     const index = Math.round(scrollPosition / slider.offsetWidth);

  //     if (index !== activeIndex) {
  //         setActiveIndex(index);
  //     }

  //     const currentImage = productImages[index];
  //     if (currentImage && currentImage.variantIds.length > 0 && fetcher.data?.product) {
  //         const variantId = currentImage.variantIds[0];
  //         const matchingVariant = fetcher.data.product.variants.nodes.find(v => v.id === variantId);

  //         if (matchingVariant && matchingVariant.id !== selectedVariant?.id) {
  //             isScrollingRef.current = true;
  //             setSelectedVariant(matchingVariant);
  //             setTimeout(() => {
  //                 isScrollingRef.current = false;
  //             }, 500);
  //         }
  //     }
  // }, [productImages, selectedVariant, fetcher.data, activeIndex]);

  // Sync slider scroll to variant selection
  const handleScroll = useCallback(() => {
    // ADDED: Exit immediately if the automated smooth scroll is happening
    if (
      !sliderRef.current ||
      productImages.length === 0 ||
      isScrollingRef.current
    )
      return;

    const slider = sliderRef.current;
    const scrollPosition = slider.scrollLeft;
    const index = Math.round(scrollPosition / slider.offsetWidth);

    if (index !== activeIndex) {
      setActiveIndex(index);
    }

    const currentImage = productImages[index];
    if (
      currentImage &&
      currentImage.variantIds.length > 0 &&
      fetcher.data?.product
    ) {
      const variantId = currentImage.variantIds[0];
      const matchingVariant = fetcher.data.product.variants.nodes.find(
        (v) => v.id === variantId,
      );

      if (matchingVariant && matchingVariant.id !== selectedVariant?.id) {
        // Since we aren't locked, this is a genuine user swipe. Update the variant!
        setSelectedVariant(matchingVariant);
      }
    }
  }, [productImages, selectedVariant, fetcher.data, activeIndex]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Wishlist toggle function with variant support
  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      window.location.href = '/signin';
      return;
    }

    if (!isWishlistEnabled) {
      alert('Wishlist is currently disabled');
      return;
    }

    if (!product || !selectedVariant) {
      alert('Please select a variant first');
      return;
    }

    setIsAddingToWishlist(true);

    try {
      const wishlistItem = {
        productId: product.id,
        productTitle: product.title,
        productHandle: product.handle,
        productImage:
          selectedVariant?.image?.url || product.featuredImage?.url || '',
        productPrice:
          selectedVariant?.price?.amount ||
          product.priceRange?.minVariantPrice?.amount ||
          '0',
        // Include variant details
        variantId: selectedVariant.id,
        variantTitle: selectedVariant.title,
        selectedOptions: selectedVariant.selectedOptions,
        action: 'toggle',
      };

      const res = await fetch('/api/wishlist', {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(wishlistItem),
      });

      const data = await res.json();

      if (data.success) {
        // Update the wishlist state in the parent component
        setWishlist(data.wishlist);
      } else {
        if (data.disabled) {
          alert('Wishlist is currently disabled');
        } else if (data.requiresLogin) {
          window.location.href = '/signin';
        } else {
          alert(data.error || 'Failed to update wishlist');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Something went wrong');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  if (!isOpen) return null;

  const loading = fetcher.state === 'loading';

  // Prioritize global data over statically passed config, so Sanity settings take precedence everywhere
  const sanityQuickViewConfig = rootData?.sanityData?.settings?.quickViewConfig;
  const effectiveConfig = sanityQuickViewConfig || globalData?.settings?.quickViewConfig || globalData?.quickViewConfig || config;

  // Styling configuration
  const styling = {
    maxWidth: effectiveConfig?.styling?.maxWidth || 'max-w-4xl',
    backgroundColor: effectiveConfig?.styling?.backgroundColor || '#ffffff',
    textColor: effectiveConfig?.styling?.textColor || '#1a1a1a',
    buttonColor: effectiveConfig?.styling?.buttonColor || '#23A6F0',
    buttonTextColor: effectiveConfig?.styling?.buttonTextColor || '#ffffff',
    fontSize: effectiveConfig?.styling?.fontSize || 'text-base',
    borderRadius: effectiveConfig?.styling?.borderRadius || 'rounded-none',
  };

  // console.log("stylking qw "+ JSON.stringify(styling,null,2))

  const isTailwindClass = (val) => {
    if (!val || typeof val !== 'string') return false;
    const standardPatterns = [
      /^max-w-(xs|sm|md|lg|xl|[2-7]xl|full|min|max|prose|screen-(sm|md|lg|xl|2xl))$/,
      /^text-(xs|sm|base|lg|xl|[2-9]xl)$/,
      /^rounded(-(none|sm|md|lg|xl|[2-3]xl|full))?$/,
    ];
    return standardPatterns.some((pattern) => pattern.test(val));
  };

  const extractCssValue = (val) => {
    if (!val || typeof val !== 'string') return undefined;
    if (isTailwindClass(val)) return undefined;
    const bracketMatch = val.match(/\[(.*?)\]/);
    if (bracketMatch) return bracketMatch[1];
    const parenMatch = val.match(/\((.*?)\)/);
    if (parenMatch) return parenMatch[1];
    if (
      val.match(/^[0-9]+(px|rem|em|%|vh|vw)$/) ||
      val.startsWith('#') ||
      val.startsWith('rgb')
    ) {
      return val;
    }
    if (val.includes(' ') || val.includes('-')) return undefined;
    return val;
  };

  const modalStyles = {
    backgroundColor: styling.backgroundColor,
    maxWidth: extractCssValue(styling.maxWidth) || '900px',
    borderRadius: extractCssValue(styling.borderRadius),
    fontSize: extractCssValue(styling.fontSize),
  };

  const contentElements = effectiveConfig?.contentElements || [
    {elementType: 'image', enabled: true, imageSize: 'large'},
    {elementType: 'title', enabled: true, titleSize: 'text-2xl'},
    {elementType: 'price', enabled: true, showCompareAtPrice: true},
    {elementType: 'variants', enabled: true, variantStyle: 'buttons'},
    {elementType: 'addToCart', enabled: true, buttonText: 'ADD TO CART'},
  ];

  const handleAddToCart = () => {
    if (selectedVariant) {
      cartFetcher.submit(
        {
          [CartForm.INPUT_NAME]: JSON.stringify({
            action: CartForm.ACTIONS.LinesAdd,
            inputs: {lines: [{merchandiseId: selectedVariant.id, quantity: 1}]},
          }),
        },
        {method: 'POST', action: '/cart'},
      );
      open('cart');
      onClose();
    }
  };

  const handleVariantChange = (optionName, value) => {
    if (!product) return;

    // Create new selected options array
    const currentOptions = selectedVariant?.selectedOptions || [];
    const newSelectedOptions = currentOptions.map((opt) =>
      opt.name === optionName ? {name: optionName, value} : opt,
    );

    // If the option doesn't exist yet, add it
    if (!newSelectedOptions.find((opt) => opt.name === optionName)) {
      newSelectedOptions.push({name: optionName, value});
    }

    // Find matching variant
    const matchingVariant = product.variants?.nodes?.find((variant) => {
      return newSelectedOptions.every((selectedOpt) =>
        variant.selectedOptions.some(
          (vOpt) =>
            vOpt.name === selectedOpt.name && vOpt.value === selectedOpt.value,
        ),
      );
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  // Helper to get CSS color for swatches
  // Covers all Shopify common/demo color names + hash fallback for unknowns
  const getSwatchColor = (colorName) => {
    if (!colorName) return '#d1d5db';
    const normalized = colorName.toLowerCase().replace(/[\s_-]+/g, '');
    const map = {
      // Basic
      white: '#ffffff',
      black: '#000000',
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#22c55e',
      orange: '#f97316',
      yellow: '#eab308',
      purple: '#a855f7',
      pink: '#ec4899',
      brown: '#92400e',
      gray: '#9ca3af',
      grey: '#9ca3af',
      silver: '#c0c0c0',
      gold: '#d4af37',
      beige: '#f5f0e8',
      ivory: '#fffff0',
      // Extended blues
      navy: '#1e3a8a',
      cobalt: '#0047ab',
      royal: '#4169e1',
      sky: '#87ceeb',
      skyblue: '#87ceeb',
      ocean: '#006994',
      teal: '#14b8a6',
      cyan: '#06b6d4',
      turquoise: '#40e0d0',
      aqua: '#00ffff',
      indigo: '#4f46e5',
      denim: '#1560bd',
      sapphire: '#0f52ba',
      slate: '#475569',
      steel: '#708090',
      powder: '#b0e0e6',
      powderblue: '#b0e0e6',
      periwinkle: '#ccccff',
      electric: '#7b2fff',
      ice: '#d6f4ff',
      dawn: '#f2e6d9',
      cloud: '#f0f4f8',
      fog: '#e8edf0',
      // Greens
      olive: '#808000',
      lime: '#84cc16',
      sage: '#87a878',
      mint: '#98ff98',
      forest: '#228b22',
      emerald: '#50c878',
      hunter: '#355e3b',
      moss: '#8a9a5b',
      // Reds / Pinks
      crimson: '#dc143c',
      scarlet: '#ff2400',
      rose: '#ff007f',
      blush: '#de5d83',
      coral: '#ff6b6b',
      salmon: '#fa8072',
      magenta: '#ff00ff',
      fuchsia: '#ff0090',
      burgundy: '#800020',
      wine: '#722f37',
      maroon: '#800000',
      raspberry: '#e30b5d',
      // Browns / Neutrals
      tan: '#d2b48c',
      sand: '#c2b280',
      camel: '#c19a6b',
      taupe: '#483c32',
      khaki: '#c3b091',
      cream: '#fffdd0',
      nude: '#e8c9a0',
      mocha: '#967117',
      espresso: '#4e2e1e',
      chestnut: '#954535',
      rust: '#b7410e',
      terracotta: '#e27d60',
      // Purples / Pinks
      lavender: '#e6e6fa',
      lilac: '#c8a2c8',
      violet: '#8b5cf6',
      mauve: '#e0b0ff',
      plum: '#8e4585',
      orchid: '#da70d6',
      wisteria: '#c9a0dc',
      amethyst: '#9966cc',
      // Yellows / Oranges
      amber: '#ffbf00',
      honey: '#ec9d00',
      mustard: '#e1ad01',
      lemon: '#fff44f',
      peach: '#ffcba4',
      apricot: '#fbceb1',
      // Whites / Grays / Blacks
      offwhite: '#faf9f6',
      natural: '#f5f0e8',
      eggshell: '#fff8e7',
      bone: '#e3dac9',
      chalk: '#f5f5f0',
      snow: '#fffafa',
      pearl: '#f8f6f0',
      ash: '#b2beb5',
      smoke: '#738276',
      charcoal: '#36454f',
      onyx: '#353839',
      graphite: '#474a51',
      jet: '#343434',
    };

    if (map[normalized]) return map[normalized];

    // Deterministic hash fallback: generates a consistent, distinct color from any unknown name
    let hash = 0;
    for (let i = 0; i < colorName.length; i++) {
      hash = colorName.charCodeAt(i) + ((hash << 5) - hash);
      hash |= 0;
    }
    // Use hue from hash, keep saturation/lightness in a visible range
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 60%, 55%)`;
  };

  // Wishlist Icon Component
  const WishlistIcon = ({filled, hovered}) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M14.031 2.8125H14.032C14.6118 2.81271 15.1858 2.92807 15.7205 3.15234C16.2552 3.37666 16.7398 3.70554 17.1462 4.11914C17.9751 4.96296 18.4392 6.09841 18.4392 7.28125C18.4392 8.46409 17.9751 9.59954 17.1462 10.4434L9.99976 17.6797L2.85425 10.4434C2.0255 9.59956 1.56128 8.46398 1.56128 7.28125C1.56128 6.09852 2.0255 4.96294 2.85425 4.11914C3.26082 3.70576 3.74625 3.37743 4.28101 3.15332C4.81567 2.9293 5.38978 2.81348 5.96948 2.81348C6.54921 2.81351 7.12329 2.92925 7.65796 3.15332C8.19262 3.37741 8.67722 3.70584 9.08374 4.11914L9.08472 4.12012L9.77808 4.82031L10.0007 5.04395L10.2224 4.82031L10.9158 4.12012L10.9177 4.11914C11.3237 3.70511 11.8078 3.37568 12.3425 3.15137C12.8771 2.92711 13.4513 2.81207 14.031 2.8125Z"
        fill={filled ? '#EF4444' : 'transparent'}
        stroke={filled ? '#EF4444' : hovered ? '#ffffff' : '#252B42'}
        strokeWidth="1.5"
      />
    </svg>
  );

  const isMoneyValue = (val) => {
    return /^(\$|₹|€|£)?\s?\d+(\.\d+)?$/.test(val);
  };

  const extractAmount = (val) => {
    return val.replace(/[^\d.]/g, '');
  };

  const renderElement = (element) => {
    if (!element.enabled || !product) return null;

    switch (element.elementType) {
      case 'image':
        return (
          <div
            key="image"
            className="relative w-full h-full flex flex-col bg-gray-100/50 group"
          >
            {/* Main Image Slider */}
            <div
              ref={sliderRef}
              className="flex-1 flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar items-center"
              onScroll={handleScroll}
              style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
            >
              {productImages.length > 0 ? (
                productImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-full h-full flex items-center justify-center snap-center p-4"
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || product.title}
                      className={`w-full h-full object-contain max-h-[500px] transition-all duration-500 mix-blend-multiply ${loaded ? 'blur-0' : 'blur-xl'}`}
                      loading="lazy"
                      onLoad={(e) => (e.currentTarget.style.filter = 'blur(0)')}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    />
                  </div>
                ))
              ) : (
                <div className="flex-shrink-0 w-full h-full flex items-center justify-center p-4">
                  <Image
                    src={product.featuredImage?.url}
                    alt={product.title}
                    className={`w-full h-full object-contain max-h-[500px] transition-all duration-500 mix-blend-multiply ${loaded ? 'blur-0' : 'blur-xl'}`}
                    loading="lazy"
                    onLoad={(e) => (e.currentTarget.style.filter = 'blur(0)')}
                  />
                </div>
              )}
            </div>

            {/* Slider Arrows */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={() => {
                    if (sliderRef.current) {
                      sliderRef.current.scrollBy({
                        left: -sliderRef.current.offsetWidth,
                        behavior: 'smooth',
                      });
                    }
                  }}
                  className="absolute left-4 top-[40%] w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-500 z-10"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (sliderRef.current) {
                      sliderRef.current.scrollBy({
                        left: sliderRef.current.offsetWidth,
                        behavior: 'smooth',
                      });
                    }
                  }}
                  className="absolute right-4 top-[40%] w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-500 z-10"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </>
            )}

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-2 p-4 pt-0 overflow-x-auto hide-scrollbar">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (sliderRef.current) {
                        sliderRef.current.scrollTo({
                          left: idx * sliderRef.current.offsetWidth,
                          behavior: 'smooth',
                        });
                      }
                    }}
                    className={`flex-shrink-0 w-16 h-16 bg-white border-2 overflow-hidden transition-all duration-200 ${activeIndex === idx ? 'border-gray-400' : 'border-transparent'}`}
                  >
                    <Image
                      src={img.url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}

            <style
              dangerouslySetInnerHTML={{
                __html: `.hide-scrollbar::-webkit-scrollbar { display: none; }`,
              }}
            />
          </div>
        );

      case 'title':
        return (
          <div key="title" className="mb-4">
            <h2 className="text-2xl font-normal tracking-wide text-gray-700 mb-2">
              {product.title}
            </h2>
            {/* Display selected variant title */}
            {selectedVariant && selectedVariant.title !== 'Default Title' && (
              <p className="text-sm text-gray-500 mt-1">
                {selectedVariant.title}
              </p>
            )}
          </div>
        );

      case 'price':
        const price = {
          amount:
            selectedVariant?.price?.amount ||
            product?.priceRange?.minVariantPrice?.amount ||
            '0',
          currencyCode:
            selectedVariant?.price?.currencyCode ||
            product?.priceRange?.minVariantPrice?.currencyCode ||
            'USD',
        };

        return (
          <div key="price" className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                <Money data={price} />
              </span>
            </div>

            {/* Availability */}
            <div className="text-sm text-gray-600 mb-6 font-medium">
              Availability :{' '}
              <span className="text-[#0095FF]">
                {selectedVariant?.availableForSale
                  ? 'In Stock'
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <div className="text-sm text-gray-500 leading-relaxed max-w-md">
              {product.description ||
                'Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie. Excitation venial consequent sent nostrum met.'}
            </div>
          </div>
        );

      case 'variants':
        if (!product.options || product.options.length === 0) return null;

        return (
          <div key="variants" className="space-y-4 mb-8">
            {product.options.map((option) => {
              if (option.optionValues.length === 1) return null;
              const isColor =
                option.name.toLowerCase() === 'color' ||
                option.name.toLowerCase() === 'colour';

              return (
                <div key={option.name}>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    {option.name}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {option.optionValues.map((value) => {
                      const isSelected = selectedVariant?.selectedOptions?.some(
                        (opt) =>
                          opt.name === option.name && opt.value === value.name,
                      );
                      const isAvailable =
                        value.firstSelectableVariant?.availableForSale;

                      if (isColor) {
                        // Priority: Shopify swatch color > swatch image > getSwatchColor fallback
                        const swatchColor =
                          value.swatch?.color || getSwatchColor(value.name);
                        const swatchImage =
                          value.swatch?.image?.previewImage?.url;

                        return (
                          <button
                            key={value.name}
                            onClick={() =>
                              handleVariantChange(option.name, value.name)
                            }
                            disabled={!isAvailable}
                            title={value.name}
                            className={`w-8 h-8 rounded-full border-2 outline-none transition-all duration-200 
                                                            ${isSelected ? 'border-gray-900 scale-110' : 'border-gray-300 hover:scale-105'}
                                                            ${!isAvailable ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                                                        `}
                            style={{
                              backgroundColor: swatchImage
                                ? 'transparent'
                                : swatchColor,
                              backgroundImage: swatchImage
                                ? `url(${swatchImage})`
                                : 'none',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          />
                        );
                      } else {
                        return (
                          <button
                            key={value.name}
                            onClick={() =>
                              handleVariantChange(option.name, value.name)
                            }
                            disabled={!isAvailable}
                            className={`min-w-[44px] h-[40px] px-3 border rounded-[4px] text-xs font-medium transition-all duration-200 uppercase
                                                        ${isSelected ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}
                                                        ${!isAvailable ? 'opacity-30 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}`}
                          >
                            {(() => {
                              const variantForValue =
                                product.variants?.nodes?.find((variant) =>
                                  variant.selectedOptions.some(
                                    (opt) =>
                                      opt.name === option.name &&
                                      opt.value === value.name,
                                  ),
                                );

                              return variantForValue?.price ? (
                                <Money data={variantForValue.price} />
                              ) : (
                                value.name
                              );
                            })()}
                          </button>
                        );
                      }
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'addToCart':
        return (
          <div
            key="addToCart"
            className="flex items-center gap-4 border-t border-gray-100 pt-6"
          >
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale}
              className={`px-8 py-3 text-sm font-bold uppercase transition-all duration-300 shadow-sm
                                ${selectedVariant?.availableForSale ? 'hover:brightness-105 active:scale-[0.98]' : ''}
                            `}
              style={{
                backgroundColor: styling.buttonColor || '#23A6F0',
                color: styling.buttonTextColor,
                opacity: selectedVariant?.availableForSale ? 1 : 0.6,
                cursor: selectedVariant?.availableForSale
                  ? 'pointer'
                  : 'not-allowed',
                borderRadius:
                  styling.borderRadius === 'rounded-none' ? '4px' : '12px',
              }}
            >
              {selectedVariant?.availableForSale
                ? element.buttonText || 'ADD TO CART'
                : 'SOLD OUT'}
            </button>

            {/* Wishlist Button */}
            {isWishlistEnabled && (
              <button
                onClick={toggleWishlist}
                onMouseEnter={() => setHoveredIcon('wishlist')}
                onMouseLeave={() => setHoveredIcon(null)}
                disabled={isAddingToWishlist}
                className={`w-[44px] h-[44px] flex items-center justify-center rounded-full border transition-all duration-300 shadow-sm
                                    ${
                                      isWished()
                                        ? 'border-red-200 bg-red-50'
                                        : 'border-gray-200 bg-white hover:bg-black'
                                    }
                                    ${isAddingToWishlist ? 'opacity-50 cursor-wait' : ''}
                                `}
                aria-label={
                  isWished() ? 'Remove from wishlist' : 'Add to wishlist'
                }
              >
                {isAddingToWishlist ? (
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  <WishlistIcon
                    filled={isWished()}
                    hovered={hoveredIcon === 'wishlist'}
                  />
                )}
              </button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const imageElement = contentElements.find((e) => e.elementType === 'image');
  const infoElements = contentElements.filter((e) => e.elementType !== 'image');

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`relative w-full shadow-2xl overflow-hidden bg-white max-h-[95vh] flex flex-col md:flex-row
                    ${isTailwindClass(styling.fontSize) ? styling.fontSize : 'text-base'} 
                    ${isTailwindClass(styling.borderRadius) ? (styling.borderRadius === 'rounded-none' ? 'rounded-none' : styling.borderRadius) : ''} 
                    ${isTailwindClass(styling.maxWidth) ? styling.maxWidth : ''}`}
        style={modalStyles}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 text-white hover:bg-gray-500 transition-colors shadow-sm"
          aria-label="Close"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {loading ? (
          <div className="flex-1 flex items-center justify-center min-h-[500px]">
            <div
              className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200"
              style={{borderTopColor: styling.buttonColor}}
            ></div>
          </div>
        ) : product ? (
          <div className="flex-1 overflow-y-auto w-full">
            <div className="flex flex-col md:flex-row h-full">
              {/* Left Side - Image */}
              <div className="w-full md:w-1/2 min-h-[300px] md:min-h-[500px]">
                {imageElement &&
                  imageElement.enabled &&
                  renderElement(imageElement)}
              </div>

              {/* Right Side - Info */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-start pt-12 md:pt-10">
                <div className="space-y-1">
                  {infoElements.map((element, idx) => (
                    <React.Fragment key={idx}>
                      {renderElement(element)}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-[300px] text-gray-500">
            Product not found
          </div>
        )}
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
}
