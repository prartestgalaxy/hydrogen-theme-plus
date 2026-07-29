// // import { useSearchParams } from "react-router-dom";
// // import { useLoaderData, Link, useFetcher, useLocation, useParams } from 'react-router';
// // import {
// //   getSelectedProductOptions,
// //   Analytics,
// //   useOptimisticVariant,
// //   getProductOptions,
// //   getAdjacentAndFirstAvailableVariants,
// //   useSelectedOptionInUrlParam,
// //   Image,
// //   Money,
// //   CartForm,
// // } from '@shopify/hydrogen';
// // import { ProductPrice } from '~/components/ProductPrice';
// // import { ProductForm } from '~/components/ProductForm';
// // import { redirectIfHandleIsLocalized } from '~/lib/redirect';
// // import { useState, useEffect, useRef ,useMemo} from 'react';
// // import { WISHLIST_SETTINGS_QUERY } from '~/sanity/queries/wishlist';
// // import { useWishlist } from '~/context/WishlistContext';
// // import { RECOMMENDATIONS_SETTINGS_QUERY } from '~/sanity/queries/recommendations';
// // import { Recommendations } from '~/components/Recommendations';
// // import { setRecentlyViewed } from '~/lib/recentlyViewed';
// // import { RecentlyViewedSection } from '~/components/RecentlyViewed';
// // import { RECENTLY_SETTINGS_QUERY } from '~/sanity/queries/recentlyViewed';
// // import { INVENTORY_SETTINGS_QUERY } from '~/sanity/queries/inventorythreshold';
// // import { AddToCartButton } from '~/components/AddToCartButton';
// // import { useAside } from '~/components/Aside';
// // import { ProductDetailsTabs } from "~/components/ProductDetailsTabs";
// // import { PDP_SETTINGS_QUERY } from '~/sanity/queries/pdpSettings';
// // import LogoSlider from '~/components/LogoSlider';
// // import KeenSlider from 'keen-slider';
// // import 'keen-slider/keen-slider.min.css';

// // /**
// //  * @type {Route.MetaFunction}
// //  */
// // export const meta = ({ data, params }) => {
// //   const locale = params?.locale;
// //   const localePath = locale ? `/${locale}` : '';

// //   return [
// //     { title: `Hydrogen | ${data?.product?.title ?? ''}` },
// //     {
// //       rel: 'canonical',
// //       href: `${localePath}/products/${data?.product?.handle ?? ''}`,
// //     },
// //   ];
// // };

// // /**
// //  * Helper function to resolve which tabs data to use
// //  * Priority: Product-specific tabs > Global PDP tabs
// //  */
// // function resolveDetailsTabsData(sanityProduct, pdpSettings) {
// //   if (sanityProduct?.productTabsSection?.enable) {
// //     return {
// //       source: 'product',
// //       data: sanityProduct.productTabsSection
// //     };
// //   }

// //   if (pdpSettings?.enableDetailsSection && pdpSettings?.detailsSection?.enable) {
// //     return {
// //       source: 'global',
// //       data: pdpSettings.detailsSection
// //     };
// //   }

// //   return null;
// // }

// // /**
// //  * @param {Route.LoaderArgs} args
// //  */
// // export async function loader(args) {
// //   const { context } = args;
// //   const deferredData = loadDeferredData(args);
// //   const criticalData = await loadCriticalData(args);

// //   const resolvedTabs = resolveDetailsTabsData(
// //     criticalData.sanityProduct,
// //     criticalData.pdpSettings
// //   );

// //   return {
// //     ...deferredData,
// //     ...criticalData,
// //     i18n: context.storefront.i18n,
// //     detailsTabsData: resolvedTabs?.data || null,
// //     detailsTabsSource: resolvedTabs?.source
// //   };
// // }

// // /**
// //  * Load data necessary for rendering content above the fold.
// //  */
// // async function loadCriticalData({ context, params, request }) {
// //   const { handle } = params;
// //   const { storefront } = context;

// //   if (!handle) {
// //     throw new Error('Expected product handle to be defined');
// //   }

// //   const [{ product }] = await Promise.all([
// //     storefront.query(PRODUCT_QUERY, {
// //       variables: { handle, selectedOptions: getSelectedProductOptions(request) },
// //       country: storefront.i18n?.country || 'US',
// //       language: storefront.i18n?.language || 'EN',
// //     }),
// //   ]);

// //   if (!product?.id) {
// //     throw new Response(null, { status: 404 });
// //   }

// //   redirectIfHandleIsLocalized(request, { handle, data: product });

// //   const cookie = request.headers.get('cookie') || '';
// //   const match = cookie.match(/customerAccessToken=([^;]+)/);
// //   const accessToken = match?.[1];
// //   const isLoggedIn = !!accessToken;

// //   const wishlistSettings = await context.sanityClient.fetch(WISHLIST_SETTINGS_QUERY);
// //   const stickyBarSetting = await context.sanityClient.fetch(PRODUCT_SETTINGS_QUERY);
// //   const sanityProduct = await context.sanityClient.fetch(SANITY_PRODUCT_QUERY, {
// //     handle: params.handle
// //   });
// //   const recentlyViewedData = await context.sanityClient.fetch(RECENTLY_SETTINGS_QUERY);

// //   let inventorySettings = null;
// //   try {
// //     inventorySettings = await context.sanityClient.fetch(INVENTORY_SETTINGS_QUERY);
// //   } catch (error) {
// //     console.error('📦 SERVER: Error fetching inventory settings:', error);
// //   }

// //   let isInWishlist = false;
// //   let wishlistCount = 0;
// //   let variantWishlistStatus = {};

// //   if (wishlistSettings.enabled && isLoggedIn && accessToken) {
// //     try {
// //       const customerRes = await storefront.query(
// //         `
// //         query getCustomer($customerAccessToken: String!) {
// //           customer(customerAccessToken: $customerAccessToken) {
// //             id
// //           }
// //         }
// //         `,
// //         {
// //           variables: {
// //             customerAccessToken: accessToken,
// //           },
// //         }
// //       );

// //       const customerId = customerRes?.customer?.id;

// //       if (customerId) {
// //         const adminQuery = `
// //           query getCustomerWishlistInProduct($id: ID!) {
// //             customer(id: $id) {
// //               id
// //               wishlist: metafield(namespace: "custom", key: "wishlist") {
// //                 id
// //                 namespace
// //                 key
// //                 value
// //                 type
// //               }
// //             }
// //           }
// //         `;

// //         const adminRes = await fetch(
// //           `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
// //           {
// //             method: 'POST',
// //             headers: {
// //               'Content-Type': 'application/json',
// //               'X-Shopify-Access-Token': context.env.PRIVATE_ADMIN_TOKEN,
// //             },
// //             body: JSON.stringify({
// //               query: adminQuery,
// //               variables: { id: customerId },
// //             }),
// //           }
// //         );

// //         const adminData = await adminRes.json();
// //         const metafield = adminData?.data?.customer?.wishlist;

// //         if (metafield?.value) {
// //           try {
// //             const parsed = JSON.parse(metafield.value);
// //             const wishlistProducts = parsed.products || [];
// //             wishlistCount = wishlistProducts.length;
// //             const productNumericId = product.id.split('/').pop();

// //             // Check if product is in wishlist (any variant)
// //             isInWishlist = wishlistProducts.some(p => {
// //               const wishlistNumericId = p.id.match(/\d+/)?.[0];
// //               return wishlistNumericId === productNumericId;
// //             });

// //             // Check variant-specific wishlist status
// //             product.variants?.nodes?.forEach(variant => {
// //               const variantId = variant.id;
// //               const isVariantInWishlist = wishlistProducts.some(p => {
// //                 // Check by variant ID
// //                 if (p.variantId) {
// //                   return p.variantId === variantId;
// //                 }
// //                 // Check by selected options for base product without variantId
// //                 if (p.selectedOptions && variant.selectedOptions) {
// //                   const matchesOptions = p.selectedOptions.every(opt =>
// //                     variant.selectedOptions.some(vOpt =>
// //                       vOpt.name === opt.name && vOpt.value === opt.value
// //                     )
// //                   );
// //                   if (matchesOptions) {
// //                     return true;
// //                   }
// //                 }
// //                 return false;
// //               });
// //               variantWishlistStatus[variant.id] = isVariantInWishlist;
// //             });

// //           } catch (e) {
// //             console.error('Error parsing wishlist:', e);
// //           }
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Error fetching wishlist:', error);
// //     }
// //   }

// //   const recommendationsSettings = await context.sanityClient.fetch(
// //     RECOMMENDATIONS_SETTINGS_QUERY
// //   );
// //   const pdpSettings = await context.sanityClient.fetch(PDP_SETTINGS_QUERY);

// //   return {
// //     product,
// //     pdpSettings,
// //     isInWishlist,
// //     wishlistCount,
// //     isWishlistEnabled: wishlistSettings.enabled,
// //     isLoggedIn,
// //     recommendationsSettings,
// //     enableStickyBar: stickyBarSetting ?? true,
// //     sanityProduct,
// //     recentlyViewedData,
// //     inventorySettings,
// //     variantWishlistStatus,
// //   };
// // }

// // function loadDeferredData({ context, params }) {
// //   return {};
// // }

// // function getBadgeColor(color) {
// //   const colorMap = {
// //     red: "bg-red-600",
// //     orange: "bg-orange-500",
// //     yellow: "bg-yellow-500",
// //     gray: "bg-gray-500",
// //   };
// //   return colorMap[color] || "bg-gray-500";
// // }

// // export default function Product() {
// //   const {
// //     product,
// //     pdpSettings,
// //     i18n,
// //     isInWishlist: initialIsInWishlist,
// //     wishlistCount: initialWishlistCount,
// //     isWishlistEnabled,
// //     isLoggedIn,
// //     recommendationsSettings,
// //     enableStickyBar,
// //     sanityProduct,
// //     recentlyViewedData,
// //     inventorySettings,
// //     detailsTabsData,
// //     variantWishlistStatus: initialVariantWishlistStatus,
// //   } = useLoaderData();

// //   const { open } = useAside();
// //   const locale = i18n?.country?.toLowerCase() ?? 'us';
// //   const fetcher = useFetcher();
// //   const {
// //     canAddToWishlist,
// //   } = useWishlist();

// //   const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
// //   const [wishlistCount, setWishlistCount] = useState(initialWishlistCount);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [recommendations, setRecommendations] = useState([]);
// //   const [wishlist, setWishlist] = useState([]);
// //   const [isStickyVisible, setIsStickyVisible] = useState(false);
// //   const [selectedImage, setSelectedImage] = useState(null);
// //   const [allImages, setAllImages] = useState([]);
// //   const [activeIndex, setActiveIndex] = useState(0);
// //   const productFormRef = useRef(null);
// //   const [searchParams] = useSearchParams();
// //   const [variantWishlistStatus, setVariantWishlistStatus] = useState(initialVariantWishlistStatus || {});
// //   const [isSliderReady, setIsSliderReady] = useState(false);
// //   // Keen-Slider refs
// //   const mainSliderRef = useRef(null);
// //   const thumbSliderRef = useRef(null);
// //   const mainSliderInstance = useRef(null);
// //   const thumbSliderInstance = useRef(null);

// //   useEffect(() => {
// //     if (product?.id) {
// //       setRecentlyViewed(product.id);
// //     }
// //   }, [product?.id]);

// //   useEffect(() => {
// //     if (isLoggedIn && isWishlistEnabled) {
// //       loadWishlist();
// //     }
// //   }, [isLoggedIn, isWishlistEnabled]);

// //   useEffect(() => {
// //     const images = [];
// //     if (product.featuredImage) {
// //       images.push(product.featuredImage);
// //     }
// //     product.variants?.nodes?.forEach(variant => {
// //       if (variant.image && !images.some(img => img.id === variant.image.id)) {
// //         images.push(variant.image);
// //       }
// //     });
// //     setAllImages(images);
// //     setSelectedImage(product.featuredImage || images[0]);
// //   }, [product]);

// //   const loadWishlist = async () => {
// //     try {
// //       const response = await fetch('/api/wishlist', {
// //         credentials: 'include',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         }
// //       });
// //       const data = await response.json();
// //       if (data.success && data.items) {
// //         setWishlist(data.items);

// //         const productNumericId = product.id.split('/').pop();

// //         // Check if ANY variant of this product is in wishlist (for overall product status)
// //         const isProductInWishlist = data.items.some(item => {
// //           const itemNumericId = item.productId.match(/\d+/)?.[0];
// //           return itemNumericId === productNumericId;
// //         });
// //         setIsInWishlist(isProductInWishlist);
// //         setWishlistCount(data.items.length);

// //         // Track variant-specific wishlist status
// //         const newVariantStatus = {};
// //         product.variants?.nodes?.forEach(variant => {
// //           const isVariantInWishlist = data.items.some(item => {
// //             // Direct variant ID match
// //             if (item.variantId) {
// //               return item.variantId === variant.id;
// //             }
// //             // Match by selected options for products without variantId
// //             if (item.selectedOptions?.length && variant.selectedOptions?.length) {
// //               const matchesOptions = item.selectedOptions.every(opt =>
// //                 variant.selectedOptions.some(vOpt =>
// //                   vOpt.name === opt.name && vOpt.value === opt.value
// //                 )
// //               );
// //               if (matchesOptions) {
// //                 return true;
// //               }
// //             }
// //             return false;
// //           });
// //           newVariantStatus[variant.id] = isVariantInWishlist;
// //         });

// //         setVariantWishlistStatus(newVariantStatus);
// //       }
// //     } catch (error) {
// //       console.error('Error loading wishlist:', error);
// //     }
// //   };

// //   useEffect(() => {
// //     const observer = new IntersectionObserver(
// //       ([entry]) => {
// //         setIsStickyVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
// //       },
// //       { threshold: 0 }
// //     );

// //     if (productFormRef.current) {
// //       observer.observe(productFormRef.current);
// //     }

// //     return () => {
// //       if (productFormRef.current) observer.disconnect();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (fetcher.data?.success) {
// //       setIsInWishlist(fetcher.data.isInWishlist);
// //       setWishlistCount(fetcher.data.wishlistCount);
// //       setWishlist(fetcher.data.wishlist || []);
// //       setIsLoading(false);

// //       if (fetcher.data.wishlist) {
// //         const newVariantStatus = {};
// //         product.variants?.nodes?.forEach(variant => {
// //           const isVariantInWishlist = fetcher.data.wishlist.some(item => {
// //             if (item.variantId) {
// //               return item.variantId === variant.id;
// //             }
// //             if (item.selectedOptions && variant.selectedOptions) {
// //               return item.selectedOptions.every(opt =>
// //                 variant.selectedOptions.some(vOpt =>
// //                   vOpt.name === opt.name && vOpt.value === opt.value
// //                 )
// //               );
// //             }
// //             return false;
// //           });
// //           newVariantStatus[variant.id] = isVariantInWishlist;
// //         });
// //         setVariantWishlistStatus(newVariantStatus);
// //       }
// //     }
// //     if (fetcher.data?.disabled || fetcher.data?.requiresLogin) {
// //       setIsLoading(false);
// //       if (fetcher.data?.requiresLogin) {
// //         window.location.href = '/signin';
// //       }
// //     }
// //   }, [fetcher.data, product.variants?.nodes]);

// //   const selectedVariant = useOptimisticVariant(
// //     product.selectedOrFirstAvailableVariant,
// //     getAdjacentAndFirstAvailableVariants(product),
// //   );

// //   useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

// //   const productOptions = getProductOptions({
// //     ...product,
// //     selectedOrFirstAvailableVariant: selectedVariant,
// //   });

// //   // useEffect(() => {
// //   //   if (selectedVariant?.image) {
// //   //     setSelectedImage(selectedVariant.image);
// //   //     const index = filteredImages.findIndex(img => img.id === selectedVariant.image.id);
// //   //     if (index !== -1 && mainSliderInstance.current) {
// //   //       mainSliderInstance.current.moveToIdx(index);
// //   //       setActiveIndex(index);
// //   //     }
// //   //   }
// //   // }, [selectedVariant]);

// //   const { title } = product;
// //   const price = selectedVariant?.price || product.priceRange?.minVariantPrice;

// //   const [inventoryBadge, setInventoryBadge] = useState(null);
// //   const [badgeColorClass, setBadgeColorClass] = useState("bg-gray-500");

// //   useEffect(() => {
// //     if (!inventorySettings || !inventorySettings.enableInventoryBadges) {
// //       setInventoryBadge(null);
// //       return;
// //     }

// //     const quantity = selectedVariant?.quantityAvailable ??
// //       product.variants?.nodes?.[0]?.quantityAvailable ?? 0;

// //     let badge = null;
// //     let color = "bg-gray-500";

// //     if (quantity === 0) {
// //       badge = inventorySettings.outOfStockMessage;
// //       color = getBadgeColor(inventorySettings.outOfStockBadgeColor);
// //     }
// //     else if (quantity <= inventorySettings.criticalStockThreshold) {
// //       badge = inventorySettings.criticalStockMessage;
// //       color = getBadgeColor(inventorySettings.criticalStockBadgeColor);
// //     }
// //     else if (quantity <= inventorySettings.lowStockThreshold) {
// //       badge = inventorySettings.lowStockMessage;
// //       color = getBadgeColor(inventorySettings.lowStockBadgeColor);
// //     }

// //     setInventoryBadge(badge);
// //     setBadgeColorClass(color);
// //   }, [selectedVariant, inventorySettings, product.variants?.nodes]);

// //   useEffect(() => {
// //     const apiPath = locale ? `/${locale}/api/track-view` : '/api/track-view';
// //     fetch(apiPath, {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({
// //         productId: product.id,
// //         category: product.productType || product.productType,
// //         handle: product.handle
// //       })
// //     });
// //   }, [product.id, locale]);

// //   const handleWishlistToggle = () => {
// //     if (!canAddToWishlist(isLoggedIn)) {
// //       window.location.href = '/signin';
// //       return;
// //     }

// //     setIsLoading(true);

// //     const currentVariantId = selectedVariant?.id;
// //     const isCurrentVariantInWishlist = currentVariantId ? variantWishlistStatus[currentVariantId] || false : isInWishlist;

// //     // Optimistic UI update
// //     if (currentVariantId) {
// //       const newVariantStatus = {
// //         ...variantWishlistStatus,
// //         [currentVariantId]: !isCurrentVariantInWishlist
// //       };
// //       setVariantWishlistStatus(newVariantStatus);
// //     } else {
// //       setIsInWishlist(!isInWishlist);
// //     }

// //     // Update count based on toggle action
// //     setWishlistCount(isCurrentVariantInWishlist ? wishlistCount - 1 : wishlistCount + 1);

// //     const numericId = product.id.split('/').pop();
// //     const wishlistProductId = `shopifyProduct-${numericId}`;

// //     const wishlistItem = {
// //       productId: wishlistProductId,
// //       productTitle: product.title,
// //       productHandle: product.handle,
// //       productImage: selectedImage?.url || selectedVariant?.image?.url || product.featuredImage?.url || '',
// //       productPrice: selectedVariant?.price?.amount || price?.amount || '',
// //       variantId: selectedVariant?.id || '',
// //       variantTitle: selectedVariant?.title || '',
// //       selectedOptions: selectedVariant?.selectedOptions || [],
// //       action: 'toggle'
// //     };

// //     fetcher.submit(
// //       wishlistItem,
// //       {
// //         method: 'POST',
// //         action: '/api/wishlist',
// //         encType: 'application/json'
// //       }
// //     );
// //   };

// //   // CRITICAL FIX: Get the current variant's wishlist status
// //   // In your PDP component, when fetching recommendations
// //   useEffect(() => {
// //     if (!recommendationsSettings?.enabled) return;

// //     const apiPath = locale ? `/${locale}/api/recommendations` : '/api/recommendations';

// //     // Get the first variant ID
// //     const firstVariant = product?.variants?.nodes?.[0];
// //     const variantId = firstVariant?.id || '';
// //     const variantOptions = firstVariant?.selectedOptions ? JSON.stringify(firstVariant.selectedOptions) : '';

// //     // Build URL with variant parameters
// //     let url = `${apiPath}?productId=${product.id}`;
// //     if (variantId) {
// //       url += `&variantId=${encodeURIComponent(variantId)}`;
// //     }
// //     if (variantOptions) {
// //       url += `&variantOptions=${encodeURIComponent(variantOptions)}`;
// //     }

// //     fetch(url)
// //       .then(res => res.json())
// //       .then(data => {
// //         setRecommendations(data.products || []);

// //       })
// //       .catch(console.error);
// //   }, [product.id, product?.variants?.nodes, recommendationsSettings?.enabled, locale]);

// //   const currentVariantWishlistStatus = selectedVariant?.id ?
// //     (variantWishlistStatus[selectedVariant.id] || false) :
// //     isInWishlist;

// //   const handleWishlistUpdate = (newWishlist) => {
// //     setWishlist(newWishlist);
// //     const productNumericId = product.id.split('/').pop();
// //     const isNowInWishlist = newWishlist.some(item => {
// //       const itemNumericId = item.id.match(/\d+/)?.[0];
// //       return itemNumericId === productNumericId;
// //     });
// //     setIsInWishlist(isNowInWishlist);
// //     setWishlistCount(newWishlist.length);

// //     const newVariantStatus = {};
// //     product.variants?.nodes?.forEach(variant => {
// //       const isVariantInWishlist = newWishlist.some(item => {
// //         if (item.variantId) {
// //           return item.variantId === variant.id;
// //         }
// //         if (item.selectedOptions && variant.selectedOptions) {
// //           return item.selectedOptions.every(opt =>
// //             variant.selectedOptions.some(vOpt =>
// //               vOpt.name === opt.name && vOpt.value === opt.value
// //             )
// //           );
// //         }
// //         return false;
// //       });
// //       newVariantStatus[variant.id] = isVariantInWishlist;
// //     });
// //     setVariantWishlistStatus(newVariantStatus);
// //   };

// //   const selectedColor = selectedVariant?.selectedOptions?.find(
// //     (option) => option.name.toLowerCase() === "color"
// //   )?.value;

// //   const sliderImages = product?.images?.nodes || [];

// //   // let filteredImages = sliderImages;
// //   const filteredImages = useMemo(() => {
// //   if (!selectedColor) return sliderImages;

// //   const colorImages = sliderImages.filter((image) =>
// //     image.altText?.toLowerCase().includes(selectedColor.toLowerCase())
// //   );

// //   return colorImages.length > 0 ? colorImages : sliderImages;
// // }, [sliderImages, selectedColor]);

// //   // if (selectedColor) {
// //   //   const colorImages = sliderImages.filter((image) =>
// //   //     image.altText
// //   //       ?.toLowerCase()
// //   //       .includes(selectedColor.toLowerCase())
// //   //   );

// //   //   if (colorImages.length > 0) {
// //   //     filteredImages = colorImages;
// //   //   }
// //   // }

// //   // Initialize Keen-Slider
// //   // useEffect(() => {
// //   //   if (filteredImages.length > 0 && mainSliderRef.current) {
// //   //     // Main slider
// //   //     const mainSlider = new KeenSlider(
// //   //       mainSliderRef.current,
// //   //       {
// //   //         loop: true,
// //   //         slides: {
// //   //           perView: 1,
// //   //           spacing: 0,
// //   //         },
// //   //         slideChanged(slider) {
// //   //           setActiveIndex(slider.track.details.rel);

// //   //           // Sync thumbnail slider
// //   //           if (thumbSliderInstance.current) {
// //   //             thumbSliderInstance.current.moveToIdx(slider.track.details.rel);
// //   //           }
// //   //         },
// //   //       },
// //   //       []
// //   //     );
// //   //     mainSliderInstance.current = mainSlider;

// //   //     // Thumbnail slider
// //   //     if (thumbSliderRef.current) {
// //   //       const thumbSlider = new KeenSlider(
// //   //         thumbSliderRef.current,
// //   //         {
// //   //           loop: true,
// //   //           slides: {
// //   //             perView: 4,
// //   //             spacing: 12,
// //   //           },
// //   //           slideChanged(slider) {
// //   //             // Sync main slider when thumbnail changes
// //   //             if (mainSliderInstance.current) {
// //   //               mainSliderInstance.current.moveToIdx(slider.track.details.rel);
// //   //             }
// //   //           },
// //   //         },
// //   //         []
// //   //       );
// //   //       thumbSliderInstance.current = thumbSlider;
// //   //     }

// //   //     return () => {
// //   //       if (mainSliderInstance.current) mainSliderInstance.current.destroy();
// //   //       if (thumbSliderInstance.current) thumbSliderInstance.current.destroy();
// //   //     };
// //   //   }
// //   // }, [filteredImages]);
// // //   useEffect(() => {
// // //   if (!mainSliderRef.current) return;

// // //   if (!mainSliderInstance.current) {
// // //     const mainSlider = new KeenSlider(mainSliderRef.current, {
// // //       loop: false, // safer
// // //       slides: {
// // //         perView: 1,
// // //         spacing: 0,
// // //       },
// // //       slideChanged(slider) {
// // //         const idx = slider.track.details.rel;
// // //         setActiveIndex(idx);

// // //         if (thumbSliderInstance.current) {
// // //           thumbSliderInstance.current.moveToIdx(idx);
// // //         }
// // //       },
// // //     });

// // //     mainSliderInstance.current = mainSlider;
// // //   }

// // //   if (!thumbSliderInstance.current && thumbSliderRef.current) {
// // //     const thumbSlider = new KeenSlider(thumbSliderRef.current, {
// // //       loop: false,
// // //       slides: {
// // //         perView: 4,
// // //         spacing: 12,
// // //       },
// // //       slideChanged(slider) {
// // //         const idx = slider.track.details.rel;
// // //         mainSliderInstance.current?.moveToIdx(idx);
// // //       },
// // //     });

// // //     thumbSliderInstance.current = thumbSlider;
// // //   }

// // //   return () => {
// // //     mainSliderInstance.current?.destroy();
// // //     thumbSliderInstance.current?.destroy();
// // //     mainSliderInstance.current = null;
// // //     thumbSliderInstance.current = null;
// // //   };
// // // }, []);
// // useEffect(() => {
// //   if (!mainSliderRef.current || filteredImages.length === 0) return;

// //   // Destroy old instances
// //   mainSliderInstance.current?.destroy();
// //   thumbSliderInstance.current?.destroy();

// //   // Create main slider
// //   mainSliderInstance.current = new KeenSlider(mainSliderRef.current, {
// //     loop: false,
// //     slides: { perView: 1 },
// //     slideChanged(slider) {
// //       const idx = slider.track.details.rel;
// //       setActiveIndex(idx);
// //       thumbSliderInstance.current?.moveToIdx(idx);
// //     },
// //   });

// //   // Create thumbnail slider
// //   if (thumbSliderRef.current) {
// //     thumbSliderInstance.current = new KeenSlider(thumbSliderRef.current, {
// //       loop: false,
// //       slides: { perView: 4, spacing: 12 },
// //       slideChanged(slider) {
// //         mainSliderInstance.current?.moveToIdx(slider.track.details.rel);
// //       },
// //     });
// //   }

// //   // Reset index
// //   setActiveIndex(0);

// //   return () => {
// //     mainSliderInstance.current?.destroy();
// //     thumbSliderInstance.current?.destroy();
// //   };
// // }, [filteredImages]); // 🔥 THIS IS KEY

// //   // Update thumbnails when filteredImages changes
// //   useEffect(() => {
// //     if (thumbSliderInstance.current) {
// //       thumbSliderInstance.current.update({
// //         slides: {
// //           perView: 4,
// //           spacing: 12,
// //         },
// //       });
// //     }
// //   }, [filteredImages]);
// // //   useEffect(() => {
// // //   if (mainSliderInstance.current) {
// // //     mainSliderInstance.current.update();
// // //   }

// // //   if (thumbSliderInstance.current) {
// // //     thumbSliderInstance.current.update();
// // //   }
// // // }, [filteredImages]);

// // // useEffect(() => {
// // //   if (activeIndex >= filteredImages.length) {
// // //     setActiveIndex(0);
// // //     mainSliderInstance.current?.moveToIdx(0);
// // //   }
// // // }, [filteredImages]);
// //  useEffect(() => {
// //   if (!selectedVariant?.image || !filteredImages.length) return;

// //   const index = filteredImages.findIndex(
// //     img => img.id === selectedVariant.image.id
// //   );

// // if (index === -1) return;

// //   // 🔥 WAIT for slider to be ready
// //   const timer = setTimeout(() => {
// //     if (mainSliderInstance.current) {
// //       mainSliderInstance.current.moveToIdx(index);
// //       setActiveIndex(index);
// //     }
// //   }, 50); // small delay fixes race condition

// //   return () => clearTimeout(timer);

// // }, [selectedVariant, filteredImages]);

// //   const NavigationArrows = () => (
// //     <>
// //       <button
// //         className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
// //         onClick={() => mainSliderInstance.current?.prev()}
// //         disabled={activeIndex === 0}
// //         aria-label="Previous image"
// //       >
// //         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
// //           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
// //         </svg>
// //       </button>
// //       <button
// //         className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
// //         onClick={() => mainSliderInstance.current?.next()}
// //         disabled={activeIndex === filteredImages.length - 1}
// //         aria-label="Next image"
// //       >
// //         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
// //           <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
// //         </svg>
// //       </button>
// //     </>
// //   );

// //   return (
// //     <div className="max-w-[100%] mx-auto lg:py-8" key={i18n?.country}>
// //       <nav className="flex mb-6 text-sm px-[10%]" aria-label="Breadcrumb">
// //         <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors">
// //           Home
// //         </Link>
// //         <span className="mx-2 text-gray-400">›</span>
// //         <Link to="/collections/all" className="text-gray-500 hover:text-gray-700 transition-colors">
// //           Shop
// //         </Link>
// //         <span className="mx-2 text-gray-400">›</span>
// //         <span className="text-gray-900 font-medium">Product Detail</span>
// //       </nav>

// //       <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start px-[10%]">
// //         <div className="flex flex-col gap-4">
// //           <div className="relative group">
// //             <div
// //             //  key={filteredImages.map(i => i.id).join('-')}
// //               ref={mainSliderRef}
// //               className="keen-slider rounded-lg overflow-hidden"
// //               style={{ height: 'auto' }}
// //             >
// //               {filteredImages.map((image, index) => (
// //                 <div key={image.id} className="keen-slider__slide">
// //                   <div className="aspect-square bg-gray-50 relative">
// //                     <img
// //                       src={image.url}
// //                       alt={image.altText || product.title}
// //                       className="w-full h-full object-cover"
// //                       loading={index === 0 ? 'eager' : 'lazy'}
// //                       onError={(e) => {
// //                         console.error('Image failed to load:', image.url);
// //                         e.target.src = '/fallback-image.jpg';
// //                       }}
// //                     />
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             {filteredImages.length > 1 && <NavigationArrows />}

// //             {inventoryBadge && (
// //               <div className="absolute top-4 left-4 z-10">
// //                 <span
// //                   className={`${badgeColorClass} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md`}
// //                 >
// //                   {inventoryBadge}
// //                 </span>
// //               </div>
// //             )}
// //           </div>

// //           {filteredImages.length > 1 && (
// //             <div className="mt-1">
// //               <div
// //                 // key={`thumb-${filteredImages.map(i => i.id).join('-')}`}
// //                 ref={thumbSliderRef}
// //                 className="keen-slider"
// //                 style={{ marginTop: '0.5rem' }}
// //               >
// //                 {filteredImages.map((image, index) => (
// //                   <div
// //                     key={`thumb-${image.id}`}
// //                     className={`keen-slider__slide cursor-pointer transition-all duration-200 ${
// //                       activeIndex === index ? 'opacity-100' : 'opacity-60 hover:opacity-100'
// //                     }`}
// //                     onClick={() => {
// //                       if (mainSliderInstance.current) {
// //                         mainSliderInstance.current.moveToIdx(index);
// //                       }
// //                     }}
// //                   >
// //                     <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-300 transition-all">
// //                       <img
// //                         src={image.url}
// //                         alt={image.altText || product.title}
// //                         className="w-full h-full object-cover"
// //                         onError={(e) => {
// //                           e.target.style.display = 'none';
// //                         }}
// //                       />
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         <div className="mt-8 lg:mt-0">
// //           <h1 className="text-3xl font-bold text-gray-900 mb-2">
// //             {title}
// //           </h1>

// //           <div className="mb-4">
// //             <ProductPrice
// //               price={selectedVariant?.price || product?.priceRange?.minVariantPrice}
// //               compareAtPrice={selectedVariant?.compareAtPrice}
// //             />
// //           </div>

// //           <div className="mb-6">
// //             <span className="text-sm font-medium text-gray-500">Availability: </span>
// //             <span className="text-sm font-semibold text-[#23A6F0]">
// //               {selectedVariant?.availableForSale ? 'In Stock' : 'Out of Stock'}
// //             </span>
// //           </div>

// //           <div className="mb-8" ref={productFormRef}>
// //             <ProductForm
// //               productOptions={productOptions}
// //               selectedVariant={selectedVariant}
// //               product={product}
// //               isWishlistEnabled={isWishlistEnabled}
// //               isLoggedIn={isLoggedIn}
// //               // initialIsInWishlist={currentVariantWishlistStatus}
// //               onWishlistToggle={handleWishlistToggle}
// //               isLoading={isLoading}
// //              isInWishlist={currentVariantWishlistStatus}
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       <ComparisonTable
// //         data={sanityProduct}
// //         currentProduct={product}
// //       />

// //       {detailsTabsData && (
// //         <ProductDetailsTabs data={detailsTabsData} />
// //       )}

// //       <Recommendations
// //         products={recommendations}
// //         settings={recommendationsSettings}
// //         isLoggedIn={isLoggedIn}
// //         isWishlistEnabled={isWishlistEnabled}
// //         wishlist={wishlist}
// //         onWishlistUpdate={handleWishlistUpdate}
// //         locale={locale}
// //       />

// //       <RecentlyViewedSection
// //         settings={recentlyViewedData}
// //         isLoggedIn={isLoggedIn}
// //         isWishlistEnabled={isWishlistEnabled}
// //         wishlist={wishlist}
// //         onWishlistUpdate={handleWishlistUpdate}
// //         locale={locale}
// //       />

// //       {pdpSettings?.enableLogoSlider &&
// //         pdpSettings?.logoSlider?.enable &&
// //         pdpSettings?.logoSlider?.logos?.length > 0 && (
// //           <LogoSlider
// //             data={{
// //               ...pdpSettings.logoSlider,
// //               logos: pdpSettings.logoSlider.logos.map((logo) => ({
// //                 ...logo,
// //                 imageUrl: logo.image?.url,
// //                 altText: logo.image?.altText,
// //               })),
// //             }}
// //           />
// //         )}

// //       <Analytics.ProductView
// //         data={{
// //           products: [
// //             {
// //               id: product.id,
// //               title: product.title,
// //               price: selectedVariant?.price.amount || '0',
// //               vendor: product.vendor,
// //               variantId: selectedVariant?.id || '',
// //               variantTitle: selectedVariant?.title || '',
// //               quantity: 1,
// //             },
// //           ],
// //         }}
// //       />

// //       {enableStickyBar && (
// //         <StickyAddToCart
// //           product={product}
// //           selectedVariant={selectedVariant}
// //           productOptions={productOptions}
// //           isVisible={isStickyVisible}
// //           locale={locale}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // function ComparisonTable({ data, currentProduct }) {
// //   if (!data?.comparisonEnabled || !data?.comparisonRows?.length) return null;

// //   const {
// //     competitors = [],
// //     comparisonRows,
// //     sectionHeading,
// //     sectionDescription,
// //     comparisonStyling: rawStyling
// //   } = data;

// //   const comparisonStyling = rawStyling || {};

// //   const {
// //     sectionWidth = 'max-w-7xl',
// //     paddingY = 'py-12 md:py-20',
// //     headingAlign = 'text-center',
// //     highlightColor = '#f9fafb',
// //     headerFontSize = 'text-sm md:text-lg',
// //     rowFontSize = 'text-sm'
// //   } = comparisonStyling;

// //   const widthClass =
// //     sectionWidth === 'max-w-4xl' ? 'max-w-5xl' :
// //       sectionWidth === 'max-w-full' ? 'w-full px-0' :
// //         'max-w-7xl';

// //   return (
// //     <div className={`mx-auto ${widthClass} ${paddingY} bg-white`}>
// //       <div className={`mb-8 md:mb-12 px-4 sm:px-6 lg:px-8 ${headingAlign}`}>
// //         <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
// //           {sectionHeading || 'Compare & Decide'}
// //         </h2>
// //         {sectionDescription && (
// //           <p className="mt-3 text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
// //             {sectionDescription}
// //           </p>
// //         )}
// //       </div>

// //       <div className="relative overflow-x-auto shadow-sm border-t border-b border-gray-100 md:border md:rounded-lg">
// //         <table className="w-full text-left border-collapse min-w-full">
// //           <thead>
// //             <tr>
// //               <th className="hidden md:table-cell p-4 md:p-6 bg-white border-b border-gray-200 min-w-[150px]"></th>
// //               <th
// //                 className="sticky left-0 z-20 p-2 md:p-6 border-b border-gray-200 min-w-[50vw] md:min-w-[220px] text-center shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)] md:shadow-none"
// //                 style={{ backgroundColor: highlightColor }}
// //               >
// //                 <div className="flex flex-col items-center gap-2 md:gap-3">
// //                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-white p-2 shadow-sm border border-gray-100">
// //                     {currentProduct.featuredImage?.url && (
// //                       <img
// //                         src={currentProduct.featuredImage.url}
// //                         alt={currentProduct.title}
// //                         className="w-full h-full object-contain"
// //                       />
// //                     )}
// //                   </div>
// //                   <div className="space-y-1 w-full">
// //                     <span className={`font-bold text-gray-900 block ${headerFontSize} leading-tight px-1`}>
// //                       {currentProduct.title}
// //                     </span>
// //                     <span className="inline-block px-2 py-0.5 text-[9px] md:text-[10px] font-bold tracking-wider text-white bg-black rounded-full uppercase">
// //                       Our Pick
// //                     </span>
// //                   </div>
// //                 </div>
// //               </th>
// //               {competitors.map((comp, index) => {
// //                 const title = comp.customTitle || comp.product?.store?.title || 'Competitor';
// //                 const imgUrl = comp.image || comp.product?.store?.previewImageUrl;
// //                 return (
// //                   <th key={index} className="p-2 md:p-6 border-b border-gray-200 min-w-[50vw] md:min-w-[220px] text-center bg-white">
// //                     <div className="flex flex-col items-center gap-2 md:gap-3 opacity-80">
// //                       <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 p-1">
// //                         {imgUrl ? (
// //                           <img src={imgUrl} alt={title} className="w-full h-full object-contain mix-blend-multiply" />
// //                         ) : (
// //                           <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">N/A</div>
// //                         )}
// //                       </div>
// //                       <span className={`font-semibold text-gray-600 ${headerFontSize} leading-tight px-1`}>{title}</span>
// //                     </div>
// //                   </th>
// //                 );
// //               })}
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {comparisonRows.map((row, i) => (
// //               <tr key={i} className="group">
// //                 <td className="hidden md:table-cell p-4 md:p-5 font-semibold text-gray-900 border-b border-gray-100 bg-white text-sm">
// //                   {row.feature}
// //                 </td>
// //                 <td
// //                   className={`sticky left-0 z-10 p-3 md:p-5 text-center font-bold text-gray-900 border-b border-gray-200/50 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)] md:shadow-none ${rowFontSize}`}
// //                   style={{ backgroundColor: highlightColor }}
// //                 >
// //                   <span className="md:hidden block text-[10px] text-gray-400 font-normal uppercase tracking-wider mb-1">
// //                     {row.feature}
// //                   </span>
// //                   {row.ourValue || '—'}
// //                 </td>
// //                 {competitors.map((_, idx) => {
// //                   const valKey = `competitor${idx + 1}Value`;
// //                   const value = row[valKey];
// //                   return (
// //                     <td key={idx} className={`p-3 md:p-5 text-center text-gray-500 border-b border-gray-100 bg-white group-hover:bg-gray-50 transition-colors ${rowFontSize}`}>
// //                       <span className="md:hidden block text-[10px] text-gray-300 font-normal uppercase tracking-wider mb-1">
// //                         {row.feature}
// //                       </span>
// //                       {value || '—'}
// //                     </td>
// //                   );
// //                 })}
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // }

// // function StickyAddToCart({ product, selectedVariant, productOptions, isVisible, locale }) {
// //   if (!product || !selectedVariant) return null;

// //   const location = useLocation();
// //   const searchParams = new URLSearchParams(location.search);
// //   const scrollRef = useRef(null);

// //   const hasVariants = productOptions?.length > 0 &&
// //     !productOptions.some(opt => opt.name === 'Title' && opt.optionValues.length === 1);

// //   const scroll = (direction) => {
// //     if (scrollRef.current) {
// //       const { current } = scrollRef;
// //       const scrollAmount = 200;
// //       if (direction === 'left') {
// //         current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
// //       } else {
// //         current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
// //       }
// //     }
// //   };

// //   return (
// //     <div
// //       className={`fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 transform
// //       ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
// //     >
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
// //         <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
// //           <div className="flex-shrink-0 md:max-w-[200px]">
// //             <h3 className={`text-sm font-bold text-gray-900 leading-tight line-clamp-1 ${!hasVariants ? 'text-center md:text-left' : ''}`}>
// //               {product.title}
// //             </h3>
// //             <div className={`md:hidden mt-1 text-sm text-gray-600 ${!hasVariants ? 'text-center' : ''}`}>
// //               <ProductPrice
// //                 price={selectedVariant?.price || product?.priceRange?.minVariantPrice}
// //                 compareAtPrice={selectedVariant?.compareAtPrice}
// //               />
// //             </div>
// //           </div>

// //           {hasVariants && (
// //             <div className="flex-1 flex items-center justify-center md:justify-start gap-2 min-w-0">
// //               <button
// //                 onClick={() => scroll('left')}
// //                 className="p-1 rounded-full hover:bg-gray-100 text-gray-500 md:hidden flex-shrink-0"
// //                 aria-label="Scroll left"
// //               >
// //                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
// //                   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
// //                 </svg>
// //               </button>

// //               <div
// //                 ref={scrollRef}
// //                 className="flex gap-2 overflow-x-auto scroll-smooth hide-scrollbar px-1"
// //                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
// //               >
// //                 <style>{`
// //                   .hide-scrollbar::-webkit-scrollbar { display: none; }
// //                 `}</style>

// //                 {productOptions.map((option) => {
// //                   const isMoneyOption =
// //                     option.name.toLowerCase().includes('denomination') ||
// //                     option.name.toLowerCase().includes('amount') ||
// //                     option.name.toLowerCase().includes('value');

// //                   return (
// //                     <div key={option.name} className="flex items-center gap-2 flex-shrink-0">
// //                       <span className="text-xs text-gray-500 font-medium uppercase tracking-wide hidden lg:block">
// //                         {option.name}:
// //                       </span>
// //                       <div className="flex gap-2">
// //                         {option.optionValues.map((value) => {
// //                           const isSelected = selectedVariant.selectedOptions.some(
// //                             (selected) => selected.name === option.name && selected.value === value.name
// //                           );

// //                           const newParams = new URLSearchParams(searchParams);
// //                           newParams.set(option.name, value.name);

// //                           const basePath = locale ? `/${locale}/products/${product.handle}` : `/products/${product.handle}`;
// //                           const to = `${basePath}?${newParams.toString()}`;

// //                           const rawOption = product.options?.find(o => o.name === option.name);
// //                           const rawOptionValue = rawOption?.optionValues?.find(v => v.name === value.name);
// //                           const localizedPrice = rawOptionValue?.firstSelectableVariant?.price;

// //                           return (
// //                             <Link
// //                               key={value.name}
// //                               to={to}
// //                               preventScrollReset
// //                               replace
// //                               className={`
// //                                 px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap
// //                                 ${isSelected
// //                                   ? 'bg-black text-white border-black'
// //                                   : 'bg-white text-gray-700 border-gray-300 hover:border-gray-800'
// //                                 }
// //                               `}
// //                             >
// //                               {isMoneyOption && localizedPrice ? (
// //                                 <Money data={localizedPrice} withoutTrailingZeros />
// //                               ) : (
// //                                 value.name
// //                               )}
// //                             </Link>
// //                           );
// //                         })}
// //                       </div>
// //                     </div>
// //                   );
// //                 })}
// //               </div>

// //               <button
// //                 onClick={() => scroll('right')}
// //                 className="p-1 rounded-full hover:bg-gray-100 text-gray-500 md:hidden flex-shrink-0"
// //                 aria-label="Scroll right"
// //               >
// //                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
// //                   <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
// //                 </svg>
// //               </button>
// //             </div>
// //           )}

// //           <div className="flex items-center gap-4 flex-shrink-0 w-full md:w-auto justify-center md:justify-end">
// //             <div className="hidden md:block">
// //               <ProductPrice
// //                 price={selectedVariant?.price || product?.priceRange?.minVariantPrice}
// //                 compareAtPrice={selectedVariant?.compareAtPrice}
// //               />
// //             </div>

// //             <CartForm
// //               route="/cart"
// //               inputs={{
// //                 lines: [{ merchandiseId: selectedVariant.id, quantity: 1 }],
// //               }}
// //               action={CartForm.ACTIONS.LinesAdd}
// //               className="w-full md:w-auto"
// //             >
// //               {(fetcher) => (
// //                 <button
// //                   type="submit"
// //                   disabled={!selectedVariant.availableForSale || fetcher.state !== 'idle'}
// //                   className="w-full md:w-auto bg-black text-white px-6 py-3 rounded text-sm font-bold shadow hover:bg-gray-800 active:scale-95 transition-all uppercase tracking-wide disabled:opacity-50"
// //                 >
// //                   {!selectedVariant.availableForSale
// //                     ? 'Sold Out'
// //                     : fetcher.state !== 'idle'
// //                       ? 'Adding...'
// //                       : 'Add to Cart'}
// //                 </button>
// //               )}
// //             </CartForm>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function HeartIcon({ filled, colorClass }) {
// //   return (
// //     <svg
// //       className={`w-6 h-6 transition-colors duration-200 ${colorClass}`}
// //       viewBox="0 0 24 24"
// //       strokeWidth="1.5"
// //         stroke={filled ? "none" : "#252B42"}
// //       fill={filled ? "currentColor" : "none"}
// //     >
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
// //       />
// //     </svg>
// //   );
// // }

// // const PRODUCT_VARIANT_FRAGMENT = `#graphql
// //   fragment ProductVariant on ProductVariant {
// //     availableForSale
// //     quantityAvailable
// //     compareAtPrice {
// //       amount
// //       currencyCode
// //     }
// //     id
// //     image {
// //       __typename
// //       id
// //       url
// //       altText
// //       width
// //       height
// //     }
// //     price {
// //       amount
// //       currencyCode
// //     }
// //     product {
// //       title
// //       handle
// //     }
// //     selectedOptions {
// //       name
// //       value
// //     }
// //     sku
// //     title
// //     unitPrice {
// //       amount
// //       currencyCode
// //     }
// //   }
// // `;

// // const PRODUCT_FRAGMENT = `#graphql
// //   fragment Product on Product {
// //     id
// //     title
// //     productType
// //     vendor
// //     handle
// //     descriptionHtml
// //     description
// //     encodedVariantExistence
// //     encodedVariantAvailability
// //     featuredImage {
// //       id
// //       url
// //       altText
// //       width
// //       height
// //     }
// //       images(first: 20) {
// //   nodes {
// //     id
// //     url
// //     altText
// //     width
// //     height
// //   }
// // }
// //     priceRange {
// //       minVariantPrice {
// //         amount
// //         currencyCode
// //       }
// //       maxVariantPrice {
// //         amount
// //         currencyCode
// //       }
// //     }
// //     variants(first: 10) {
// //       nodes {
// //         id
// //         quantityAvailable
// //         availableForSale
// //         title
// //         image {
// //           id
// //           url
// //           altText
// //           width
// //           height
// //         }
// //         selectedOptions {
// //           name
// //           value
// //         }
// //       }
// //     }
// //     options {
// //       name
// //       optionValues {
// //         name
// //         firstSelectableVariant {
// //           ...ProductVariant
// //         }
// //         swatch {
// //           color
// //           image {
// //             previewImage {
// //               url
// //             }
// //           }
// //         }
// //       }
// //     }
// //     selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
// //       ...ProductVariant
// //     }
// //     adjacentVariants (selectedOptions: $selectedOptions) {
// //       ...ProductVariant
// //     }
// //     seo {
// //       description
// //       title
// //     }
// //   }
// //   ${PRODUCT_VARIANT_FRAGMENT}
// // `;

// // const PRODUCT_QUERY = `#graphql
// //   query Product(
// //     $country: CountryCode
// //     $handle: String!
// //     $language: LanguageCode
// //     $selectedOptions: [SelectedOptionInput!]!
// //   ) @inContext(country: $country, language: $language) {
// //     product(handle: $handle) {
// //       ...Product
// //     }
// //   }
// //   ${PRODUCT_FRAGMENT}
// // `;

// // const PRODUCT_SETTINGS_QUERY = `*[_type == "settings"][0].enableStickyAddToCart`;

// // const SANITY_PRODUCT_QUERY = `*[_type == "product" && store.slug.current == $handle][0] {
// //   comparisonEnabled,
// //   sectionHeading,
// //   sectionDescription,
// //   comparisonStyling {
// //     sectionWidth,
// //     paddingY,
// //     headingAlign,
// //     highlightColor,
// //     headerFontSize,
// //     rowFontSize
// //   },
// //   competitors[] {
// //     customTitle,
// //     "image": image.asset->url,
// //     product->{
// //       store {
// //         title,
// //         previewImageUrl
// //       }
// //     }
// //   },
// //   comparisonRows,
// //   productTabsSection {
// //     enable,
// //     "rightImage": rightImage.asset->{
// //       url,
// //       altText
// //     },
// //     descriptionTab {
// //       heading,
// //       content
// //     },
// //     additionalInfoTab {
// //       heading,
// //       content
// //     },
// //     reviewsTab {
// //       heading,
// //       "reviewCount": count(reviews),
// //       reviews[] {
// //         reviewerName,
// //         rating,
// //         reviewText,
// //         reviewDate
// //       }
// //     }
// //   }
// // }`;
// // app/routes/products.$handle.jsx

// import {useSearchParams} from 'react-router-dom';
// import {
//   useLoaderData,
//   Link,
//   useFetcher,
//   useLocation,
//   useParams,
//   useRouteLoaderData,
// } from 'react-router';
// import {
//   getSelectedProductOptions,
//   Analytics,
//   useOptimisticVariant,
//   getProductOptions,
//   getAdjacentAndFirstAvailableVariants,
//   useSelectedOptionInUrlParam,
//   Image,
//   Money,
//   CartForm,
// } from '@shopify/hydrogen';
// import {ProductPrice} from '~/components/ProductPrice';
// import {ProductForm} from '~/components/ProductForm';
// import {redirectIfHandleIsLocalized} from '~/lib/redirect';
// import {useState, useEffect, useRef, useMemo} from 'react';
// import {WISHLIST_SETTINGS_QUERY} from '~/sanity/queries/wishlist';
// import {useWishlist} from '~/context/WishlistContext';
// import {RECOMMENDATIONS_SETTINGS_QUERY} from '~/sanity/queries/recommendations';
// import {Recommendations} from '~/components/Recommendations';
// import {setRecentlyViewed} from '~/lib/recentlyViewed';
// import {RecentlyViewedSection} from '~/components/RecentlyViewed';
// import {RECENTLY_SETTINGS_QUERY} from '~/sanity/queries/recentlyViewed';
// import {INVENTORY_SETTINGS_QUERY} from '~/sanity/queries/inventorythreshold';
// import {AddToCartButton} from '~/components/AddToCartButton';
// import {useAside} from '~/components/Aside';
// import {ProductDetailsTabs} from '~/components/ProductDetailsTabs';
// import {PDP_SETTINGS_QUERY} from '~/sanity/queries/pdpSettings';
// import LogoSlider from '~/components/LogoSlider';
// import KeenSlider from 'keen-slider';
// import 'keen-slider/keen-slider.min.css';
// // import { GLOBAL_SETTINGS_QUERY } from '~/sanity/queries/GlobalSettingQuery';

// /**
//  * Helper to get global data from root
//  */
// export function useGlobalData() {
//   const rootData = useRouteLoaderData('root');
//   return rootData?.globalSettings || null;
// }

// /**
//  * @type {Route.MetaFunction}
//  */
// export const meta = ({data, params}) => {
//   const locale = params?.locale;
//   const localePath = locale ? `/${locale}` : '';

//   return [
//     {title: `Hydrogen | ${data?.product?.title ?? ''}`},
//     {
//       rel: 'canonical',
//       href: `${localePath}/products/${data?.product?.handle ?? ''}`,
//     },
//   ];
// };

// /**
//  * Helper function to resolve which tabs data to use
//  * Priority: Product-specific tabs > Global PDP tabs
//  */
// function resolveDetailsTabsData(sanityProduct, pdpSettings) {
//   if (sanityProduct?.productTabsSection?.enable) {
//     return {
//       source: 'product',
//       data: sanityProduct.productTabsSection,
//     };
//   }

//   if (
//     pdpSettings?.enableDetailsSection &&
//     pdpSettings?.detailsSection?.enable
//   ) {
//     return {
//       source: 'global',
//       data: pdpSettings.detailsSection,
//     };
//   }

//   return null;
// }

// /**
//  * @param {Route.LoaderArgs} args
//  */
// export async function loader(args) {
//   const {context} = args;
//   const deferredData = loadDeferredData(args);
//   const criticalData = await loadCriticalData(args);

//   const resolvedTabs = resolveDetailsTabsData(
//     criticalData.sanityProduct,
//     criticalData.pdpSettings,
//   );

//   return {
//     ...deferredData,
//     ...criticalData,
//     i18n: context.storefront.i18n,
//     detailsTabsData: resolvedTabs?.data || null,
//     detailsTabsSource: resolvedTabs?.source,
//   };
// }

// /**
//  * Load data necessary for rendering content above the fold.
//  */
// async function loadCriticalData({context, params, request}) {
//   const {handle} = params;
//   const {storefront} = context;

//   if (!handle) {
//     throw new Error('Expected product handle to be defined');
//   }

//   const [{product}] = await Promise.all([
//     storefront.query(PRODUCT_QUERY, {
//       variables: {handle, selectedOptions: getSelectedProductOptions(request)},
//       country: storefront.i18n?.country || 'US',
//       language: storefront.i18n?.language || 'EN',
//     }),
//   ]);

//   if (!product?.id) {
//     throw new Response(null, {status: 404});
//   }

//   redirectIfHandleIsLocalized(request, {handle, data: product});

//   const cookie = request.headers.get('cookie') || '';
//   const match = cookie.match(/customerAccessToken=([^;]+)/);
//   const accessToken = match?.[1];
//   const isLoggedIn = !!accessToken;

//   const wishlistSettings = await context.sanityClient.fetch(
//     WISHLIST_SETTINGS_QUERY,
//   );
//   const stickyBarSetting = await context.sanityClient.fetch(
//     PRODUCT_SETTINGS_QUERY,
//   );
//   const sanityProduct = await context.sanityClient.fetch(SANITY_PRODUCT_QUERY, {
//     handle: params.handle,
//   });
//   const recentlyViewedData = await context.sanityClient.fetch(
//     RECENTLY_SETTINGS_QUERY,
//   );
//   // const globalSettings = await context.sanityClient.fetch(GLOBAL_SETTINGS_QUERY);

//   let inventorySettings = null;
//   try {
//     inventorySettings = await context.sanityClient.fetch(
//       INVENTORY_SETTINGS_QUERY,
//     );
//   } catch (error) {
//     console.error('📦 SERVER: Error fetching inventory settings:', error);
//   }

//   let isInWishlist = false;
//   let wishlistCount = 0;
//   let variantWishlistStatus = {};

//   if (wishlistSettings.enabled && isLoggedIn && accessToken) {
//     try {
//       const customerRes = await storefront.query(
//         `
//         query getCustomer($customerAccessToken: String!) {
//           customer(customerAccessToken: $customerAccessToken) {
//             id
//           }
//         }
//         `,
//         {
//           variables: {
//             customerAccessToken: accessToken,
//           },
//         },
//       );

//       const customerId = customerRes?.customer?.id;

//       if (customerId) {
//         const adminQuery = `
//           query getCustomerWishlistInProduct($id: ID!) {
//             customer(id: $id) {
//               id
//               wishlist: metafield(namespace: "custom", key: "wishlist") {
//                 id
//                 namespace
//                 key
//                 value
//                 type
//               }
//             }
//           }
//         `;

//         const adminRes = await fetch(
//           `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'X-Shopify-Access-Token': context.env.PRIVATE_ADMIN_TOKEN,
//             },
//             body: JSON.stringify({
//               query: adminQuery,
//               variables: {id: customerId},
//             }),
//           },
//         );

//         const adminData = await adminRes.json();
//         const metafield = adminData?.data?.customer?.wishlist;

//         if (metafield?.value) {
//           try {
//             const parsed = JSON.parse(metafield.value);
//             const wishlistProducts = parsed.products || [];
//             wishlistCount = wishlistProducts.length;
//             const productNumericId = product.id.split('/').pop();

//             isInWishlist = wishlistProducts.some((p) => {
//               const wishlistNumericId = p.id.match(/\d+/)?.[0];
//               return wishlistNumericId === productNumericId;
//             });

//             product.variants?.nodes?.forEach((variant) => {
//               const variantId = variant.id;
//               const isVariantInWishlist = wishlistProducts.some((p) => {
//                 if (p.variantId) {
//                   return p.variantId === variantId;
//                 }
//                 if (p.selectedOptions && variant.selectedOptions) {
//                   const matchesOptions = p.selectedOptions.every((opt) =>
//                     variant.selectedOptions.some(
//                       (vOpt) =>
//                         vOpt.name === opt.name && vOpt.value === opt.value,
//                     ),
//                   );
//                   if (matchesOptions) {
//                     return true;
//                   }
//                 }
//                 return false;
//               });
//               variantWishlistStatus[variant.id] = isVariantInWishlist;
//             });
//           } catch (e) {
//             console.error('Error parsing wishlist:', e);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching wishlist:', error);
//     }
//   }

//   const recommendationsSettings = await context.sanityClient.fetch(
//     RECOMMENDATIONS_SETTINGS_QUERY,
//   );
//   const pdpSettings = await context.sanityClient.fetch(PDP_SETTINGS_QUERY);

//   return {
//     product,
//     pdpSettings,
//     isInWishlist,
//     wishlistCount,
//     isWishlistEnabled: wishlistSettings.enabled,
//     isLoggedIn,
//     recommendationsSettings,
//     enableStickyBar: stickyBarSetting ?? true,
//     sanityProduct,
//     recentlyViewedData,
//     inventorySettings,
//     variantWishlistStatus,
//   };
// }

// function loadDeferredData({context, params}) {
//   return {};
// }

// function getBadgeColor(color) {
//   const colorMap = {
//     red: 'bg-red-600',
//     orange: 'bg-orange-500',
//     yellow: 'bg-yellow-500',
//     gray: 'bg-gray-500',
//   };
//   return colorMap[color] || 'bg-gray-500';
// }

// export default function Product() {
//   const globalData = useGlobalData();

//   console.log('globalData: ', globalData);

//   const {
//     product,
//     pdpSettings,
//     i18n,
//     isInWishlist: initialIsInWishlist,
//     wishlistCount: initialWishlistCount,
//     isWishlistEnabled,
//     isLoggedIn,
//     recommendationsSettings,
//     enableStickyBar,
//     sanityProduct,
//     recentlyViewedData,
//     inventorySettings,
//     detailsTabsData,
//     variantWishlistStatus: initialVariantWishlistStatus,
//   } = useLoaderData();

//   // ── Global Style Variables ──
//   const formatColor = (color) => {
//     if (!color) return null;
//     return color.startsWith('#') ? color : `#${color}`;
//   };

//   const primaryColor = formatColor(globalData?.buttons?.primaryBg) || '#23A6F0';
//   const primaryHoverColor =
//     formatColor(globalData?.buttons?.primaryHoverBg) || '#1D4ED8';
//   const primaryText =
//     formatColor(globalData?.buttons?.primaryText) || '#FFFFFF';
//   const primaryHoverText =
//     formatColor(globalData?.buttons?.primaryHovertxt) || primaryText;
//   const secondaryColor =
//     formatColor(globalData?.buttons?.secondaryBg) || '#000000';
//   const secondaryHoverBg =
//     formatColor(globalData?.buttons?.secondaryHoverBg) || '#D1D5DB';
//   const secondaryText =
//     formatColor(globalData?.buttons?.secondaryText) || '#FFFFFF';
//   const secondaryHoverText =
//     formatColor(globalData?.buttons?.secondaryHovertxt) || '#000000';
//   const textColor =
//     formatColor(globalData?.linksEffect?.linkColor) || '#737373';
//   const labelColor =
//     formatColor(globalData?.linksEffect?.linkColor) || '#737373';
//   const linkHoverColor =
//     formatColor(globalData?.linksEffect?.hoverColor) || '#5a5a5a';
//   const borderRadius = globalData?.buttons?.borderRadius ?? 8;
//   const linkTransition = globalData?.linksEffect?.transitionDuration || 300;
//   const linkUnderline =
//     globalData?.linksEffect?.underlineStyle === 'none'
//       ? 'none'
//       : globalData?.linksEffect?.underlineStyle || 'none';
//   const fontFamily = globalData?.fontFamily || 'Montserrat, sans-serif';
//   const baseFontSize = globalData?.baseFontSize || 16;
//   const hs = globalData?.headingSizes || {};
//   const headingSizes = {
//     h1: hs.h1 || 42,
//     h2: hs.h2 || 40,
//     h3: hs.h3 || 32,
//     h4: hs.h4 || 24,
//     h5: hs.h5 || 20,
//     h6: hs.h6 || 16,
//   };

//   // ── Dynamic <style> tag — single source of truth for global styling ──
//   const dynamicStyles = `
//     .pdp-font { font-family: ${fontFamily}; font-size: ${baseFontSize}px; }
//     .pdp-text { color: ${textColor}; }
//     .pdp-label { color: ${labelColor}; }
//     .pdp-primary-text { color: ${primaryColor}; }
//     .pdp-bg-primary { background-color: ${primaryColor}; }
//     .pdp-link {
//       color: ${textColor};
//       transition: color ${linkTransition}ms ease;
//       text-decoration: ${linkUnderline};
//     }
//     .pdp-link:hover { color: ${linkHoverColor}; }
//     .pdp-heading-h1 { font-size: ${headingSizes.h1}px; font-family: ${fontFamily}; font-weight: bold; line-height: 1.2; }
//     .pdp-heading-h2 { font-size: ${headingSizes.h2}px; font-family: ${fontFamily}; font-weight: bold; line-height: 1.2; }
//     .pdp-heading-h3 { font-size: ${headingSizes.h3}px; font-family: ${fontFamily}; font-weight: bold; line-height: 1.2; }
//     .pdp-heading-h4 { font-size: ${headingSizes.h4}px; font-family: ${fontFamily}; font-weight: bold; line-height: 1.2; }
//     .pdp-heading-h5 { font-size: ${headingSizes.h5}px; font-family: ${fontFamily}; font-weight: bold; line-height: 1.2; }
//     .pdp-heading-h6 { font-size: ${headingSizes.h6}px; font-family: ${fontFamily}; font-weight: bold; line-height: 1.2; }
//     .pdp-primary-btn {
//       background-color: ${primaryColor}; color: ${primaryText};
//       border-radius: ${borderRadius}px; transition: all ${linkTransition}ms ease;
//     }
//     .pdp-primary-btn:hover:not(:disabled) { background-color: ${primaryHoverColor}; color: ${primaryHoverText}; }
//     .pdp-primary-btn:disabled { background-color: #9CA3AF; color: #FFFFFF; cursor: not-allowed; }
//     .pdp-secondary-btn {
//       background-color: ${secondaryColor}; color: ${secondaryText};
//       border-radius: ${borderRadius}px; transition: all ${linkTransition}ms ease;
//     }
//     .pdp-secondary-btn:hover:not(:disabled) { background-color: ${secondaryHoverBg}; color: ${secondaryHoverText}; }
//     .pdp-secondary-btn:disabled { background-color: #9CA3AF; color: #FFFFFF; cursor: not-allowed; }
//     .pdp-variant-btn { background-color: #FFFFFF; color: ${textColor}; border-radius: ${borderRadius}px; }
//     .pdp-variant-btn-selected { background-color: ${primaryColor}; color: #FFFFFF; border-radius: ${borderRadius}px; }
//   `;

//   const {open} = useAside();
//   const locale = i18n?.country?.toLowerCase() ?? 'us';
//   const fetcher = useFetcher();
//   const {canAddToWishlist} = useWishlist();

//   const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
//   const [wishlistCount, setWishlistCount] = useState(initialWishlistCount);
//   const [isLoading, setIsLoading] = useState(false);
//   const [recommendations, setRecommendations] = useState([]);
//   const [wishlist, setWishlist] = useState([]);
//   const [isStickyVisible, setIsStickyVisible] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [allImages, setAllImages] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const productFormRef = useRef(null);
//   const [searchParams] = useSearchParams();
//   const [variantWishlistStatus, setVariantWishlistStatus] = useState(
//     initialVariantWishlistStatus || {},
//   );
//   const [isSliderReady, setIsSliderReady] = useState(false);

//   // Keen-Slider refs
//   const mainSliderRef = useRef(null);
//   const thumbSliderRef = useRef(null);
//   const mainSliderInstance = useRef(null);
//   const thumbSliderInstance = useRef(null);

//   useEffect(() => {
//     if (product?.id) {
//       setRecentlyViewed(product.id);
//     }
//   }, [product?.id]);

//   useEffect(() => {
//     if (isLoggedIn && isWishlistEnabled) {
//       loadWishlist();
//     }
//   }, [isLoggedIn, isWishlistEnabled]);

//   useEffect(() => {
//     const images = [];
//     if (product.featuredImage) {
//       images.push(product.featuredImage);
//     }
//     product.variants?.nodes?.forEach((variant) => {
//       if (variant.image && !images.some((img) => img.id === variant.image.id)) {
//         images.push(variant.image);
//       }
//     });
//     setAllImages(images);
//     setSelectedImage(product.featuredImage || images[0]);
//   }, [product]);

//   const loadWishlist = async () => {
//     try {
//       const response = await fetch('/api/wishlist', {
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       const data = await response.json();
//       if (data.success && data.items) {
//         setWishlist(data.items);

//         const productNumericId = product.id.split('/').pop();

//         const isProductInWishlist = data.items.some((item) => {
//           const itemNumericId = item.productId.match(/\d+/)?.[0];
//           return itemNumericId === productNumericId;
//         });
//         setIsInWishlist(isProductInWishlist);
//         setWishlistCount(data.items.length);

//         const newVariantStatus = {};
//         product.variants?.nodes?.forEach((variant) => {
//           const isVariantInWishlist = data.items.some((item) => {
//             if (item.variantId) {
//               return item.variantId === variant.id;
//             }
//             if (
//               item.selectedOptions?.length &&
//               variant.selectedOptions?.length
//             ) {
//               const matchesOptions = item.selectedOptions.every((opt) =>
//                 variant.selectedOptions.some(
//                   (vOpt) => vOpt.name === opt.name && vOpt.value === opt.value,
//                 ),
//               );
//               if (matchesOptions) {
//                 return true;
//               }
//             }
//             return false;
//           });
//           newVariantStatus[variant.id] = isVariantInWishlist;
//         });

//         setVariantWishlistStatus(newVariantStatus);
//       }
//     } catch (error) {
//       console.error('Error loading wishlist:', error);
//     }
//   };

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setIsStickyVisible(
//           !entry.isIntersecting && entry.boundingClientRect.top < 0,
//         );
//       },
//       {threshold: 0},
//     );

//     if (productFormRef.current) {
//       observer.observe(productFormRef.current);
//     }

//     return () => {
//       if (productFormRef.current) observer.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (fetcher.data?.success) {
//       setIsInWishlist(fetcher.data.isInWishlist);
//       setWishlistCount(fetcher.data.wishlistCount);
//       setWishlist(fetcher.data.wishlist || []);
//       setIsLoading(false);

//       if (fetcher.data.wishlist) {
//         const newVariantStatus = {};
//         product.variants?.nodes?.forEach((variant) => {
//           const isVariantInWishlist = fetcher.data.wishlist.some((item) => {
//             if (item.variantId) {
//               return item.variantId === variant.id;
//             }
//             if (item.selectedOptions && variant.selectedOptions) {
//               return item.selectedOptions.every((opt) =>
//                 variant.selectedOptions.some(
//                   (vOpt) => vOpt.name === opt.name && vOpt.value === opt.value,
//                 ),
//               );
//             }
//             return false;
//           });
//           newVariantStatus[variant.id] = isVariantInWishlist;
//         });
//         setVariantWishlistStatus(newVariantStatus);
//       }
//     }
//     if (fetcher.data?.disabled || fetcher.data?.requiresLogin) {
//       setIsLoading(false);
//       if (fetcher.data?.requiresLogin) {
//         window.location.href = '/signin';
//       }
//     }
//   }, [fetcher.data, product.variants?.nodes]);

//   const selectedVariant = useOptimisticVariant(
//     product.selectedOrFirstAvailableVariant,
//     getAdjacentAndFirstAvailableVariants(product),
//   );

//   useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

//   const productOptions = getProductOptions({
//     ...product,
//     selectedOrFirstAvailableVariant: selectedVariant,
//   });

//   const {title} = product;
//   const price = selectedVariant?.price || product.priceRange?.minVariantPrice;

//   const [inventoryBadge, setInventoryBadge] = useState(null);
//   const [badgeColorClass, setBadgeColorClass] = useState('bg-gray-500');

//   useEffect(() => {
//     if (!inventorySettings || !inventorySettings.enableInventoryBadges) {
//       setInventoryBadge(null);
//       return;
//     }

//     const quantity =
//       selectedVariant?.quantityAvailable ??
//       product.variants?.nodes?.[0]?.quantityAvailable ??
//       0;

//     let badge = null;
//     let color = 'bg-gray-500';

//     if (quantity === 0) {
//       badge = inventorySettings.outOfStockMessage;
//       color = getBadgeColor(inventorySettings.outOfStockBadgeColor);
//     } else if (quantity <= inventorySettings.criticalStockThreshold) {
//       badge = inventorySettings.criticalStockMessage;
//       color = getBadgeColor(inventorySettings.criticalStockBadgeColor);
//     } else if (quantity <= inventorySettings.lowStockThreshold) {
//       badge = inventorySettings.lowStockMessage;
//       color = getBadgeColor(inventorySettings.lowStockBadgeColor);
//     }

//     setInventoryBadge(badge);
//     setBadgeColorClass(color);
//   }, [selectedVariant, inventorySettings, product.variants?.nodes]);

//   useEffect(() => {
//     const apiPath = locale ? `/${locale}/api/track-view` : '/api/track-view';
//     fetch(apiPath, {
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         productId: product.id,
//         category: product.productType || product.productType,
//         handle: product.handle,
//       }),
//     });
//   }, [product.id, locale]);

//   const handleWishlistToggle = () => {
//     if (!canAddToWishlist(isLoggedIn)) {
//       window.location.href = '/signin';
//       return;
//     }

//     setIsLoading(true);

//     const currentVariantId = selectedVariant?.id;
//     const isCurrentVariantInWishlist = currentVariantId
//       ? variantWishlistStatus[currentVariantId] || false
//       : isInWishlist;

//     if (currentVariantId) {
//       const newVariantStatus = {
//         ...variantWishlistStatus,
//         [currentVariantId]: !isCurrentVariantInWishlist,
//       };
//       setVariantWishlistStatus(newVariantStatus);
//     } else {
//       setIsInWishlist(!isInWishlist);
//     }

//     setWishlistCount(
//       isCurrentVariantInWishlist ? wishlistCount - 1 : wishlistCount + 1,
//     );

//     const numericId = product.id.split('/').pop();
//     const wishlistProductId = `shopifyProduct-${numericId}`;

//     const wishlistItem = {
//       productId: wishlistProductId,
//       productTitle: product.title,
//       productHandle: product.handle,
//       productImage:
//         selectedImage?.url ||
//         selectedVariant?.image?.url ||
//         product.featuredImage?.url ||
//         '',
//       productPrice: selectedVariant?.price?.amount || price?.amount || '',
//       variantId: selectedVariant?.id || '',
//       variantTitle: selectedVariant?.title || '',
//       selectedOptions: selectedVariant?.selectedOptions || [],
//       action: 'toggle',
//     };

//     fetcher.submit(wishlistItem, {
//       method: 'POST',
//       action: '/api/wishlist',
//       encType: 'application/json',
//     });
//   };

//   useEffect(() => {
//     if (!recommendationsSettings?.enabled) return;

//     const apiPath = locale
//       ? `/${locale}/api/recommendations`
//       : '/api/recommendations';

//     const firstVariant = product?.variants?.nodes?.[0];
//     const variantId = firstVariant?.id || '';
//     const variantOptions = firstVariant?.selectedOptions
//       ? JSON.stringify(firstVariant.selectedOptions)
//       : '';

//     let url = `${apiPath}?productId=${product.id}`;
//     if (variantId) {
//       url += `&variantId=${encodeURIComponent(variantId)}`;
//     }
//     if (variantOptions) {
//       url += `&variantOptions=${encodeURIComponent(variantOptions)}`;
//     }

//     fetch(url)
//       .then((res) => res.json())
//       .then((data) => {
//         setRecommendations(data.products || []);
//       })
//       .catch(console.error);
//   }, [
//     product.id,
//     product?.variants?.nodes,
//     recommendationsSettings?.enabled,
//     locale,
//   ]);

//   const currentVariantWishlistStatus = selectedVariant?.id
//     ? variantWishlistStatus[selectedVariant.id] || false
//     : isInWishlist;

//   const handleWishlistUpdate = (newWishlist) => {
//     setWishlist(newWishlist);
//     const productNumericId = product.id.split('/').pop();
//     const isNowInWishlist = newWishlist.some((item) => {
//       const itemNumericId = item.id.match(/\d+/)?.[0];
//       return itemNumericId === productNumericId;
//     });
//     setIsInWishlist(isNowInWishlist);
//     setWishlistCount(newWishlist.length);

//     const newVariantStatus = {};
//     product.variants?.nodes?.forEach((variant) => {
//       const isVariantInWishlist = newWishlist.some((item) => {
//         if (item.variantId) {
//           return item.variantId === variant.id;
//         }
//         if (item.selectedOptions && variant.selectedOptions) {
//           return item.selectedOptions.every((opt) =>
//             variant.selectedOptions.some(
//               (vOpt) => vOpt.name === opt.name && vOpt.value === opt.value,
//             ),
//           );
//         }
//         return false;
//       });
//       newVariantStatus[variant.id] = isVariantInWishlist;
//     });
//     setVariantWishlistStatus(newVariantStatus);
//   };

//   const selectedColor = selectedVariant?.selectedOptions?.find(
//     (option) => option.name.toLowerCase() === 'color',
//   )?.value;

//   const sliderImages = product?.images?.nodes || [];

//   const filteredImages = useMemo(() => {
//     if (!selectedColor) return sliderImages;
//     const colorImages = sliderImages.filter((image) =>
//       image.altText?.toLowerCase().includes(selectedColor.toLowerCase()),
//     );
//     return colorImages.length > 0 ? colorImages : sliderImages;
//   }, [sliderImages, selectedColor]);

//   // Initialize Keen-Slider
//   useEffect(() => {
//     if (!mainSliderRef.current || filteredImages.length === 0) return;

//     mainSliderInstance.current?.destroy();
//     thumbSliderInstance.current?.destroy();

//     mainSliderInstance.current = new KeenSlider(mainSliderRef.current, {
//       loop: false,
//       slides: {perView: 1},
//       slideChanged(slider) {
//         const idx = slider.track.details.rel;
//         setActiveIndex(idx);
//         thumbSliderInstance.current?.moveToIdx(idx);
//       },
//     });

//     if (thumbSliderRef.current) {
//       thumbSliderInstance.current = new KeenSlider(thumbSliderRef.current, {
//         loop: false,
//         slides: {perView: 4, spacing: 12},
//         slideChanged(slider) {
//           mainSliderInstance.current?.moveToIdx(slider.track.details.rel);
//         },
//       });
//     }

//     setActiveIndex(0);

//     return () => {
//       mainSliderInstance.current?.destroy();
//       thumbSliderInstance.current?.destroy();
//     };
//   }, [filteredImages]);

//   useEffect(() => {
//     if (thumbSliderInstance.current) {
//       thumbSliderInstance.current.update({
//         slides: {
//           perView: 4,
//           spacing: 12,
//         },
//       });
//     }
//   }, [filteredImages]);

//   useEffect(() => {
//     if (!selectedVariant?.image || !filteredImages.length) return;

//     const index = filteredImages.findIndex(
//       (img) => img.id === selectedVariant.image.id,
//     );

//     if (index === -1) return;

//     const timer = setTimeout(() => {
//       if (mainSliderInstance.current) {
//         mainSliderInstance.current.moveToIdx(index);
//         setActiveIndex(index);
//       }
//     }, 50);

//     return () => clearTimeout(timer);
//   }, [selectedVariant, filteredImages]);

//   const NavigationArrows = () => (
//     <>
//       <button
//         className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
//         onClick={() => mainSliderInstance.current?.prev()}
//         disabled={activeIndex === 0}
//         aria-label="Previous image"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={2}
//           stroke="currentColor"
//           className="w-5 h-5"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M15.75 19.5L8.25 12l7.5-7.5"
//           />
//         </svg>
//       </button>
//       <button
//         className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
//         onClick={() => mainSliderInstance.current?.next()}
//         disabled={activeIndex === filteredImages.length - 1}
//         aria-label="Next image"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={2}
//           stroke="currentColor"
//           className="w-5 h-5"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M8.25 4.5l7.5 7.5-7.5 7.5"
//           />
//         </svg>
//       </button>
//     </>
//   );

//   return (
//     <div className="max-w-[100%] mx-auto lg:py-8 pdp-font" key={i18n?.country}>
//       <style>{dynamicStyles}</style>

//       {/* ── Breadcrumb ── */}
//       <nav className="flex mb-6 text-sm px-[10%]" aria-label="Breadcrumb">
//         <Link to="/" className="pdp-link">
//           Home
//         </Link>
//         <span className="mx-2 pdp-label">›</span>
//         <Link to="/collections/all" className="pdp-link">
//           Shop
//         </Link>
//         <span className="mx-2 pdp-label">›</span>
//         <span className="font-medium pdp-text">Product Detail</span>
//       </nav>

//       <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start px-[10%]">
//         {/* ── Image Gallery ── */}
//         <div className="flex flex-col gap-4">
//           <div className="relative group">
//             <div
//               ref={mainSliderRef}
//               className="keen-slider rounded-lg overflow-hidden"
//               style={{height: 'auto'}}
//             >
//               {filteredImages.map((image, index) => (
//                 <div key={image.id} className="keen-slider__slide">
//                   <div className="aspect-square bg-gray-50 relative">
//                     <img
//                       src={image.url}
//                       alt={image.altText || product.title}
//                       className="w-full h-full object-cover"
//                       loading={index === 0 ? 'eager' : 'lazy'}
//                       onError={(e) => {
//                         e.target.src = '/fallback-image.jpg';
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {filteredImages.length > 1 && <NavigationArrows />}

//             {inventoryBadge && (
//               <div className="absolute top-4 left-4 z-10">
//                 <span
//                   className={`${badgeColorClass} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md`}
//                 >
//                   {inventoryBadge}
//                 </span>
//               </div>
//             )}
//           </div>

//           {filteredImages.length > 1 && (
//             <div className="mt-1">
//               <div
//                 ref={thumbSliderRef}
//                 className="keen-slider"
//                 style={{marginTop: '0.5rem'}}
//               >
//                 {filteredImages.map((image, index) => (
//                   <div
//                     key={`thumb-${image.id}`}
//                     className={`keen-slider__slide cursor-pointer transition-all duration-200 ${activeIndex === index ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
//                     onClick={() => mainSliderInstance.current?.moveToIdx(index)}
//                   >
//                     <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-300 transition-all">
//                       <img
//                         src={image.url}
//                         alt={image.altText || product.title}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.style.display = 'none';
//                         }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── Product Info ── */}
//         <div className="mt-8 lg:mt-0">
//           <h1 className="mb-2 pdp-heading-h1">{title}</h1>

//           <div className="mb-4">
//             <ProductPrice
//               price={
//                 selectedVariant?.price || product?.priceRange?.minVariantPrice
//               }
//               compareAtPrice={selectedVariant?.compareAtPrice}
//             />
//           </div>

//           <div className="mb-6">
//             <span className="text-sm font-medium pdp-label">
//               Availability:{' '}
//             </span>
//             <span className="text-sm font-semibold pdp-primary-text">
//               {selectedVariant?.availableForSale ? 'In Stock' : 'Out of Stock'}
//             </span>
//           </div>

//           <div className="mb-8" ref={productFormRef}>
//             <ProductForm
//               productOptions={productOptions}
//               selectedVariant={selectedVariant}
//               product={product}
//               isWishlistEnabled={isWishlistEnabled}
//               isLoggedIn={isLoggedIn}
//               onWishlistToggle={handleWishlistToggle}
//               isLoading={isLoading}
//               isInWishlist={currentVariantWishlistStatus}
//               globalData={globalData}
//             />
//           </div>
//         </div>
//       </div>

//       <ComparisonTable
//         data={sanityProduct}
//         currentProduct={product}
//         globalData={globalData}
//       />

//       {detailsTabsData && (
//         <ProductDetailsTabs data={detailsTabsData} globalData={globalData} />
//       )}

//       <Recommendations
//         products={recommendations}
//         settings={recommendationsSettings}
//         isLoggedIn={isLoggedIn}
//         isWishlistEnabled={isWishlistEnabled}
//         wishlist={wishlist}
//         onWishlistUpdate={handleWishlistUpdate}
//         locale={locale}
//         globalData={globalData}
//       />

//       <RecentlyViewedSection
//         settings={recentlyViewedData}
//         isLoggedIn={isLoggedIn}
//         isWishlistEnabled={isWishlistEnabled}
//         wishlist={wishlist}
//         onWishlistUpdate={handleWishlistUpdate}
//         locale={locale}
//         globalData={globalData}
//       />

//       {pdpSettings?.enableLogoSlider &&
//         pdpSettings?.logoSlider?.enable &&
//         pdpSettings?.logoSlider?.logos?.length > 0 && (
//           <LogoSlider
//             data={{
//               ...pdpSettings.logoSlider,
//               logos: pdpSettings.logoSlider.logos.map((logo) => ({
//                 ...logo,
//                 imageUrl: logo.image?.url,
//                 altText: logo.image?.altText,
//               })),
//             }}
//             globalData={globalData}
//           />
//         )}

//       <Analytics.ProductView
//         data={{
//           products: [
//             {
//               id: product.id,
//               title: product.title,
//               price: selectedVariant?.price.amount || '0',
//               vendor: product.vendor,
//               variantId: selectedVariant?.id || '',
//               variantTitle: selectedVariant?.title || '',
//               quantity: 1,
//             },
//           ],
//         }}
//       />

//       {enableStickyBar && (
//         <StickyAddToCart
//           product={product}
//           selectedVariant={selectedVariant}
//           productOptions={productOptions}
//           isVisible={isStickyVisible}
//           locale={locale}
//           globalData={globalData}
//         />
//       )}
//     </div>
//   );
// }

// function ComparisonTable({data, currentProduct, globalData}) {
//   if (!data?.comparisonEnabled || !data?.comparisonRows?.length) return null;
//   // Uses .pdp-* classes from <style> tag injected by parent Product component

//   const {
//     competitors = [],
//     comparisonRows,
//     sectionHeading,
//     sectionDescription,
//     comparisonStyling: rawStyling,
//   } = data;

//   const comparisonStyling = rawStyling || {};

//   const {
//     sectionWidth = 'max-w-7xl',
//     paddingY = 'py-12 md:py-20',
//     headingAlign = 'text-center',
//     highlightColor = '#f9fafb',
//     headerFontSize = 'text-sm md:text-lg',
//     rowFontSize = 'text-sm',
//   } = comparisonStyling;

//   const widthClass =
//     sectionWidth === 'max-w-4xl'
//       ? 'max-w-5xl'
//       : sectionWidth === 'max-w-full'
//         ? 'w-full px-0'
//         : 'max-w-7xl';

//   return (
//     <div className={`mx-auto ${widthClass} ${paddingY} bg-white`}>
//       <div className={`mb-8 md:mb-12 px-4 sm:px-6 lg:px-8 ${headingAlign}`}>
//         <h2 className="text-2xl md:text-3xl font-bold tracking-tight pdp-text">
//           {sectionHeading || 'Compare & Decide'}
//         </h2>
//         {sectionDescription && (
//           <p className="mt-3 text-sm md:text-base max-w-2xl mx-auto pdp-label">
//             {sectionDescription}
//           </p>
//         )}
//       </div>

//       <div className="relative overflow-x-auto shadow-sm border-t border-b border-gray-100 md:border md:rounded-lg">
//         <table className="w-full text-left border-collapse min-w-full">
//           <thead>
//             <tr>
//               <th className="hidden md:table-cell p-4 md:p-6 bg-white border-b border-gray-200 min-w-[150px]"></th>
//               <th
//                 className="sticky left-0 z-20 p-2 md:p-6 border-b border-gray-200 min-w-[50vw] md:min-w-[220px] text-center shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)] md:shadow-none"
//                 style={{backgroundColor: highlightColor}}
//               >
//                 <div className="flex flex-col items-center gap-2 md:gap-3">
//                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-white p-2 shadow-sm border border-gray-100">
//                     {currentProduct.featuredImage?.url && (
//                       <img
//                         src={currentProduct.featuredImage.url}
//                         alt={currentProduct.title}
//                         className="w-full h-full object-contain"
//                       />
//                     )}
//                   </div>
//                   <div className="space-y-1 w-full">
//                     <span
//                       className={`font-bold block ${headerFontSize} leading-tight px-1 pdp-text`}
//                     >
//                       {currentProduct.title}
//                     </span>
//                     <span className="inline-block px-2 py-0.5 text-[9px] md:text-[10px] font-bold tracking-wider text-white rounded-full uppercase pdp-bg-primary">
//                       Our Pick
//                     </span>
//                   </div>
//                 </div>
//               </th>
//               {competitors.map((comp, index) => {
//                 const title =
//                   comp.customTitle ||
//                   comp.product?.store?.title ||
//                   'Competitor';
//                 const imgUrl =
//                   comp.image || comp.product?.store?.previewImageUrl;
//                 return (
//                   <th
//                     key={index}
//                     className="p-2 md:p-6 border-b border-gray-200 min-w-[50vw] md:min-w-[220px] text-center bg-white"
//                   >
//                     <div className="flex flex-col items-center gap-2 md:gap-3 opacity-80">
//                       <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 p-1">
//                         {imgUrl ? (
//                           <img
//                             src={imgUrl}
//                             alt={title}
//                             className="w-full h-full object-contain mix-blend-multiply"
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center text-xs pdp-label">
//                             N/A
//                           </div>
//                         )}
//                       </div>
//                       <span
//                         className={`font-semibold ${headerFontSize} leading-tight px-1 pdp-label`}
//                       >
//                         {title}
//                       </span>
//                     </div>
//                   </th>
//                 );
//               })}
//             </tr>
//           </thead>
//           <tbody>
//             {comparisonRows.map((row, i) => (
//               <tr key={i} className="group">
//                 <td className="hidden md:table-cell p-4 md:p-5 font-semibold border-b border-gray-100 bg-white text-sm pdp-text">
//                   {row.feature}
//                 </td>
//                 <td
//                   className={`sticky left-0 z-10 p-3 md:p-5 text-center font-bold border-b border-gray-200/50 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)] md:shadow-none ${rowFontSize} pdp-text`}
//                   style={{backgroundColor: highlightColor}}
//                 >
//                   <span className="md:hidden block text-[10px] font-normal uppercase tracking-wider mb-1 pdp-label">
//                     {row.feature}
//                   </span>
//                   {row.ourValue || '—'}
//                 </td>
//                 {competitors.map((_, idx) => {
//                   const valKey = `competitor${idx + 1}Value`;
//                   const value = row[valKey];
//                   return (
//                     <td
//                       key={idx}
//                       className={`p-3 md:p-5 text-center border-b border-gray-100 bg-white group-hover:bg-gray-50 transition-colors ${rowFontSize} pdp-label`}
//                     >
//                       <span className="md:hidden block text-[10px] font-normal uppercase tracking-wider mb-1 pdp-label">
//                         {row.feature}
//                       </span>
//                       {value || '—'}
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function StickyAddToCart({
//   product,
//   selectedVariant,
//   productOptions,
//   isVisible,
//   locale,
//   globalData,
// }) {
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const scrollRef = useRef(null);

//   // Uses .pdp-* classes from <style> tag injected by parent Product component
//   const formatColor = (c) => (!c ? null : c.startsWith('#') ? c : `#${c}`);
//   const labelColor =
//     formatColor(globalData?.linksEffect?.linkColor) || '#737373';

//   const hasVariants =
//     productOptions?.length > 0 &&
//     !productOptions.some(
//       (opt) => opt.name === 'Title' && opt.optionValues.length === 1,
//     );

//   const scroll = (direction) => {
//     if (scrollRef.current) {
//       const {current} = scrollRef;
//       const scrollAmount = 200;
//       if (direction === 'left') {
//         current.scrollBy({left: -scrollAmount, behavior: 'smooth'});
//       } else {
//         current.scrollBy({left: scrollAmount, behavior: 'smooth'});
//       }
//     }
//   };

//   return (
//     <div
//       className={`fixed bottom-0 left-0 w-full bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 transform
//       ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
//       style={{borderTopColor: labelColor}}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
//           <div className="flex-shrink-0 md:max-w-[200px]">
//             <h3
//               className={`text-sm font-bold leading-tight line-clamp-1 pdp-text ${!hasVariants ? 'text-center md:text-left' : ''}`}
//             >
//               {product.title}
//             </h3>
//             <div
//               className={`md:hidden mt-1 text-sm pdp-label ${!hasVariants ? 'text-center' : ''}`}
//             >
//               <ProductPrice
//                 price={
//                   selectedVariant?.price || product?.priceRange?.minVariantPrice
//                 }
//                 compareAtPrice={selectedVariant?.compareAtPrice}
//               />
//             </div>
//           </div>

//           {hasVariants && (
//             <div className="flex-1 flex items-center justify-center md:justify-start gap-2 min-w-0">
//               <button
//                 onClick={() => scroll('left')}
//                 className="p-1 rounded-full hover:bg-gray-100 text-gray-500 md:hidden flex-shrink-0"
//                 aria-label="Scroll left"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="currentColor"
//                   className="w-5 h-5"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M15.75 19.5L8.25 12l7.5-7.5"
//                   />
//                 </svg>
//               </button>

//               <div
//                 ref={scrollRef}
//                 className="flex gap-2 overflow-x-auto scroll-smooth hide-scrollbar px-1"
//                 style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
//               >
//                 <style>{`
//                   .hide-scrollbar::-webkit-scrollbar { display: none; }
//                 `}</style>

//                 {productOptions.map((option) => {
//                   const isMoneyOption =
//                     option.name.toLowerCase().includes('denomination') ||
//                     option.name.toLowerCase().includes('amount') ||
//                     option.name.toLowerCase().includes('value');

//                   return (
//                     <div
//                       key={option.name}
//                       className="flex items-center gap-2 flex-shrink-0"
//                     >
//                       <span className="text-xs font-medium uppercase tracking-wide hidden lg:block pdp-label">
//                         {option.name}:
//                       </span>
//                       <div className="flex gap-2">
//                         {option.optionValues.map((value) => {
//                           const isSelected =
//                             selectedVariant.selectedOptions.some(
//                               (selected) =>
//                                 selected.name === option.name &&
//                                 selected.value === value.name,
//                             );

//                           const newParams = new URLSearchParams(searchParams);
//                           newParams.set(option.name, value.name);

//                           const basePath = locale
//                             ? `/${locale}/products/${product.handle}`
//                             : `/products/${product.handle}`;
//                           const to = `${basePath}?${newParams.toString()}`;

//                           const rawOption = product.options?.find(
//                             (o) => o.name === option.name,
//                           );
//                           const rawOptionValue = rawOption?.optionValues?.find(
//                             (v) => v.name === value.name,
//                           );
//                           const localizedPrice =
//                             rawOptionValue?.firstSelectableVariant?.price;

//                           return (
//                             <Link
//                               key={value.name}
//                               to={to}
//                               preventScrollReset
//                               replace
//                               className={`
//                                 px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap
//                                 ${isSelected ? 'pdp-variant-btn-selected border-transparent' : 'pdp-variant-btn border-gray-300 hover:border-gray-800'}
//                               `}
//                             >
//                               {isMoneyOption && localizedPrice ? (
//                                 <Money
//                                   data={localizedPrice}
//                                   withoutTrailingZeros
//                                 />
//                               ) : (
//                                 value.name
//                               )}
//                             </Link>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <button
//                 onClick={() => scroll('right')}
//                 className="p-1 rounded-full hover:bg-gray-100 text-gray-500 md:hidden flex-shrink-0"
//                 aria-label="Scroll right"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="currentColor"
//                   className="w-5 h-5"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M8.25 4.5l7.5 7.5-7.5 7.5"
//                   />
//                 </svg>
//               </button>
//             </div>
//           )}

//           <div className="flex items-center gap-4 flex-shrink-0 w-full md:w-auto justify-center md:justify-end">
//             <div className="hidden md:block">
//               <ProductPrice
//                 price={
//                   selectedVariant?.price || product?.priceRange?.minVariantPrice
//                 }
//                 compareAtPrice={selectedVariant?.compareAtPrice}
//               />
//             </div>

//             <CartForm
//               route="/cart"
//               inputs={{
//                 lines: [{merchandiseId: selectedVariant.id, quantity: 1}],
//               }}
//               action={CartForm.ACTIONS.LinesAdd}
//               className="w-full md:w-auto"
//             >
//               {(fetcher) => (
//                 <button
//                   type="submit"
//                   disabled={
//                     !selectedVariant.availableForSale ||
//                     fetcher.state !== 'idle'
//                   }
//                   className="w-full md:w-auto px-6 py-3 text-sm font-bold shadow uppercase tracking-wide transition-all disabled:opacity-50 pdp-primary-btn"
//                 >
//                   {!selectedVariant.availableForSale
//                     ? 'Sold Out'
//                     : fetcher.state !== 'idle'
//                       ? 'Adding...'
//                       : 'Add to Cart'}
//                 </button>
//               )}
//             </CartForm>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const PRODUCT_VARIANT_FRAGMENT = `#graphql
//   fragment ProductVariant on ProductVariant {
//     availableForSale
//     quantityAvailable
//     compareAtPrice {
//       amount
//       currencyCode
//     }
//     id
//     image {
//       __typename
//       id
//       url
//       altText
//       width
//       height
//     }
//     price {
//       amount
//       currencyCode
//     }
//     product {
//       title
//       handle
//     }
//     selectedOptions {
//       name
//       value
//     }
//     sku
//     title
//     unitPrice {
//       amount
//       currencyCode
//     }
//   }
// `;

// const PRODUCT_FRAGMENT = `#graphql
//   fragment Product on Product {
//     id
//     title
//     productType
//     vendor
//     handle
//     descriptionHtml
//     description
//     encodedVariantExistence
//     encodedVariantAvailability
//     featuredImage {
//       id
//       url
//       altText
//       width
//       height
//     }
//     images(first: 20) {
//       nodes {
//         id
//         url
//         altText
//         width
//         height
//       }
//     }
//     priceRange {
//       minVariantPrice {
//         amount
//         currencyCode
//       }
//       maxVariantPrice {
//         amount
//         currencyCode
//       }
//     }
//     variants(first: 10) {
//       nodes {
//         id
//         quantityAvailable
//         availableForSale
//         title
//         image {
//           id
//           url
//           altText
//           width
//           height
//         }
//         selectedOptions {
//           name
//           value
//         }
//       }
//     }
//     options {
//       name
//       optionValues {
//         name
//         firstSelectableVariant {
//           ...ProductVariant
//         }
//         swatch {
//           color
//           image {
//             previewImage {
//               url
//             }
//           }
//         }
//       }
//     }
//     selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
//       ...ProductVariant
//     }
//     adjacentVariants (selectedOptions: $selectedOptions) {
//       ...ProductVariant
//     }
//     seo {
//       description
//       title
//     }
//   }
//   ${PRODUCT_VARIANT_FRAGMENT}
// `;

// const PRODUCT_QUERY = `#graphql
//   query Product(
//     $country: CountryCode
//     $handle: String!
//     $language: LanguageCode
//     $selectedOptions: [SelectedOptionInput!]!
//   ) @inContext(country: $country, language: $language) {
//     product(handle: $handle) {
//       ...Product
//     }
//   }
//   ${PRODUCT_FRAGMENT}
// `;

// const PRODUCT_SETTINGS_QUERY = `*[_type == "settings"][0].enableStickyAddToCart`;

// const SANITY_PRODUCT_QUERY = `*[_type == "product" && store.slug.current == $handle][0] {
//   comparisonEnabled,
//   sectionHeading,
//   sectionDescription,
//   comparisonStyling {
//     sectionWidth,
//     paddingY,
//     headingAlign,
//     highlightColor,
//     headerFontSize,
//     rowFontSize
//   },
//   competitors[] {
//     customTitle,
//     "image": image.asset->url,
//     product->{
//       store {
//         title,
//         previewImageUrl
//       }
//     }
//   },
//   comparisonRows,
//   productTabsSection {
//     enable,
//     "rightImage": rightImage.asset->{
//       url,
//       altText
//     },
//     descriptionTab {
//       heading,
//       content
//     },
//     additionalInfoTab {
//       heading,
//       content
//     },
//     reviewsTab {
//       heading,
//       "reviewCount": count(reviews),
//       reviews[] {
//         reviewerName,
//         rating,
//         reviewText,
//         reviewDate
//       }
//     }
//   }
// }`;
import { useSearchParams } from 'react-router-dom';
import {
  useLoaderData,
  Link,
  useFetcher,
  useLocation,
  useParams,
  useRouteLoaderData,
} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
  Money,
  CartForm,
} from '@shopify/hydrogen';
import { ProductPrice } from '~/components/ProductPrice';
import { ProductForm } from '~/components/ProductForm';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { useState, useEffect, useRef, useMemo } from 'react';
import { WISHLIST_SETTINGS_QUERY } from '~/sanity/queries/wishlist';
import { useWishlist } from '~/context/WishlistContext';
import { RECOMMENDATIONS_SETTINGS_QUERY } from '~/sanity/queries/recommendations';
import { Recommendations } from '~/components/Recommendations';
import { setRecentlyViewed } from '~/lib/recentlyViewed';
import { RecentlyViewedSection } from '~/components/RecentlyViewed';
import { RECENTLY_SETTINGS_QUERY } from '~/sanity/queries/recentlyViewed';
import { INVENTORY_SETTINGS_QUERY } from '~/sanity/queries/inventorythreshold';
import { useAside } from '~/components/Aside';
import { ProductDetailsTabs } from '~/components/ProductDetailsTabs';
import { PDP_SETTINGS_QUERY } from '~/sanity/queries/pdpSettings';
import LogoSlider from '~/components/LogoSlider';
import KeenSlider from 'keen-slider';
import 'keen-slider/keen-slider.min.css';

/**
 * Helper to get global data from root
 */
export function useGlobalData() {
  const rootData = useRouteLoaderData('root');
  return rootData?.globalSettings || null;
}

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({ data, params }) => {
  const locale = params?.locale;
  const localePath = locale ? `/${locale}` : '';

  return [
    { title: `Hydrogen | ${data?.product?.title ?? ''}` },
    {
      rel: 'canonical',
      href: `${localePath}/products/${data?.product?.handle ?? ''}`,
    },
  ];
};

/**
 * Helper function to resolve which tabs data to use
 * Priority: Product-specific tabs > Global PDP tabs
 */
function resolveDetailsTabsData(sanityProduct, pdpSettings) {
  if (sanityProduct?.productTabsSection?.enable) {
    return {
      source: 'product',
      data: sanityProduct.productTabsSection,
    };
  }

  if (
    pdpSettings?.enableDetailsSection &&
    pdpSettings?.detailsSection?.enable
  ) {
    return {
      source: 'global',
      data: pdpSettings.detailsSection,
    };
  }

  return null;
}

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const { context } = args;
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  const resolvedTabs = resolveDetailsTabsData(
    criticalData.sanityProduct,
    criticalData.pdpSettings,
  );

  return {
    ...deferredData,
    ...criticalData,
    i18n: context.storefront.i18n,
    detailsTabsData: resolvedTabs?.data || null,
    detailsTabsSource: resolvedTabs?.source,
  };
}

/**
 * Load data necessary for rendering content above the fold.
 */
async function loadCriticalData({ context, params, request }) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: getSelectedProductOptions(request) },
      country: storefront.i18n?.country || 'US',
      language: storefront.i18n?.language || 'EN',
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  redirectIfHandleIsLocalized(request, { handle, data: product });

  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/customerAccessToken=([^;]+)/);
  const accessToken = match?.[1];
  const isLoggedIn = !!accessToken;

  const wishlistSettings = await context.sanityClient.fetch(
    WISHLIST_SETTINGS_QUERY,
  );
  const stickyBarSetting = await context.sanityClient.fetch(
    PRODUCT_SETTINGS_QUERY,
  );
  const sanityProduct = await context.sanityClient.fetch(SANITY_PRODUCT_QUERY, {
    handle: params.handle,
  });
  const recentlyViewedData = await context.sanityClient.fetch(
    RECENTLY_SETTINGS_QUERY,
  );

  let inventorySettings = null;
  try {
    inventorySettings = await context.sanityClient.fetch(
      INVENTORY_SETTINGS_QUERY,
    );
  } catch (error) {
    console.error('📦 SERVER: Error fetching inventory settings:', error);
  }

  const recommendationsSettings = await context.sanityClient.fetch(
    RECOMMENDATIONS_SETTINGS_QUERY,
  );
  const pdpSettings = await context.sanityClient.fetch(PDP_SETTINGS_QUERY);

  return {
    product,
    pdpSettings,
    isWishlistEnabled: wishlistSettings?.enabled,
    isLoggedIn,
    recommendationsSettings,
    enableStickyBar: stickyBarSetting ?? true,
    sanityProduct,
    recentlyViewedData,
    inventorySettings,
  };
}

function loadDeferredData({ context, params }) {
  return {};
}

function getBadgeColor(color) {
  return color || '#6b7280';
}

export default function Product() {
  const globalData = useGlobalData();

  const {
    product,
    pdpSettings,
    i18n,
    isWishlistEnabled,
    isLoggedIn,
    recommendationsSettings,
    enableStickyBar,
    sanityProduct,
    recentlyViewedData,
    inventorySettings,
    detailsTabsData,
  } = useLoaderData();

  // console.log('detailsTabsData: ', detailsTabsData);
  console.log("pdpSettings: ", pdpSettings);

  // ✅ Use wishlist context
  const {
    toggleWishlist,
    isInWishlist: contextIsInWishlist,
    loading: wishlistLoading,
  } = useWishlist();

  // ── Global Style Variables ──
  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const primaryColor = formatColor(globalData?.buttons?.primaryBg) || '#23A6F0';
  const primaryHoverColor =
    formatColor(globalData?.buttons?.primaryHoverBg) || '#1D4ED8';
  const primaryText =
    formatColor(globalData?.buttons?.primaryText) || '#FFFFFF';
  const primaryHoverText =
    formatColor(globalData?.buttons?.primaryHovertxt) || primaryText;
  const secondaryColor =
    formatColor(globalData?.buttons?.secondaryBg) || '#000000';
  const secondaryHoverBg =
    formatColor(globalData?.buttons?.secondaryHoverBg) || '#D1D5DB';
  const secondaryText =
    formatColor(globalData?.buttons?.secondaryText) || '#FFFFFF';
  const secondaryHoverText =
    formatColor(globalData?.buttons?.secondaryHovertxt) || '#000000';
  const textColor =
    formatColor(globalData?.linksEffect?.linkColor) || '#737373';
  const labelColor =
    formatColor(globalData?.linksEffect?.linkColor) || '#737373';
  const linkHoverColor =
    formatColor(globalData?.linksEffect?.hoverColor) || '#5a5a5a';
  const borderRadius = globalData?.buttons?.borderRadius ?? 8;
  const linkTransition = globalData?.linksEffect?.transitionDuration || 300;
  const linkUnderline =
    globalData?.linksEffect?.underlineStyle === 'none'
      ? 'none'
      : globalData?.linksEffect?.underlineStyle || 'none';
  const fontFamily = globalData?.fontFamily || 'Montserrat, sans-serif';
  const baseFontSize = globalData?.baseFontSize || 16;
  const hs = globalData?.headingSizes || {};
  const headingSizes = {
    h1: hs.h1 || 42,
    h2: hs.h2 || 40,
    h3: hs.h3 || 32,
    h4: hs.h4 || 24,
    h5: hs.h5 || 20,
    h6: hs.h6 || 16,
  };

  // ── Dynamic <style> tag ──
  const dynamicStyles = `
    .pdp-font { font-family: ${fontFamily}; font-size: ${baseFontSize}px; }
    .pdp-text { color: ${textColor}; }
    .pdp-label { color: ${labelColor}; }
    .pdp-primary-text { color: ${primaryColor}; }
    .pdp-bg-primary { background-color: ${primaryColor}; }
    .pdp-link {
      color: ${textColor};
      transition: color ${linkTransition}ms ease;
      text-decoration: ${linkUnderline};
    }
    .pdp-link:hover { color: ${linkHoverColor}; }
    .pdp-heading-h1 { font-size: ${headingSizes.h1}px; font-family: ${fontFamily}; font-weight: bold; line-height: 1.2; }
    .pdp-heading-h2 { font-size: ${headingSizes.h2}px; font-family: ${fontFamily}; font-weight: bold; line-height: 1.2; }
    .pdp-heading-h3 { font-size: ${headingSizes.h3}px; font-family: ${fontFamily}; font-weight: bold; line-height: 1.2; }
    .pdp-heading-h4 { font-size: ${headingSizes.h4}px; font-family: ${fontFamily}; font-weight: bold; line-height: 1.2; }
    .pdp-heading-h5 { font-size: ${headingSizes.h5}px; font-family: ${fontFamily}; font-weight: bold; line-height: 1.2; }
    .pdp-heading-h6 { font-size: ${headingSizes.h6}px; font-family: ${fontFamily}; font-weight: bold; line-height: 1.2; }
    .pdp-primary-btn {
      background-color: ${primaryColor}; color: ${primaryText};
      border-radius: ${borderRadius}px; transition: all ${linkTransition}ms ease;
    }
    .pdp-primary-btn:hover:not(:disabled) { background-color: ${primaryHoverColor}; color: ${primaryHoverText}; }
    .pdp-primary-btn:disabled { background-color: #9CA3AF; color: #FFFFFF; cursor: not-allowed; }
    .pdp-secondary-btn {
      background-color: ${secondaryColor}; color: ${secondaryText};
      border-radius: ${borderRadius}px; transition: all ${linkTransition}ms ease;
    }
    .pdp-secondary-btn:hover:not(:disabled) { background-color: ${secondaryHoverBg}; color: ${secondaryHoverText}; }
    .pdp-secondary-btn:disabled { background-color: #9CA3AF; color: #FFFFFF; cursor: not-allowed; }
    .pdp-variant-btn { background-color: #FFFFFF; color: ${textColor}; border-radius: ${borderRadius}px; }
    .pdp-variant-btn-selected { background-color: ${primaryColor}; color: #FFFFFF; border-radius: ${borderRadius}px; }
  `;

  const { open } = useAside();
  const locale = i18n?.country?.toLowerCase() ?? 'us';

  const [recommendations, setRecommendations] = useState([]);
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const productFormRef = useRef(null);
  const [searchParams] = useSearchParams();

  // Keen-Slider refs
  const mainSliderRef = useRef(null);
  const thumbSliderRef = useRef(null);
  const mainSliderInstance = useRef(null);
  const thumbSliderInstance = useRef(null);

  useEffect(() => {
    if (product?.id) {
      setRecentlyViewed(product.id);
    }
  }, [product?.id]);

  useEffect(() => {
    const images = [];
    if (product.featuredImage) {
      images.push(product.featuredImage);
    }
    product.variants?.nodes?.forEach((variant) => {
      if (variant.image && !images.some((img) => img.id === variant.image.id)) {
        images.push(variant.image);
      }
    });
    setAllImages(images);
    setSelectedImage(product.featuredImage || images[0]);
  }, [product]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyVisible(
          !entry.isIntersecting && entry.boundingClientRect.top < 0,
        );
      },
      { threshold: 0 },
    );

    if (productFormRef.current) {
      observer.observe(productFormRef.current);
    }

    return () => {
      if (productFormRef.current) observer.disconnect();
    };
  }, []);

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const { title } = product;
  const price = selectedVariant?.price || product.priceRange?.minVariantPrice;

  const [inventoryBadge, setInventoryBadge] = useState(null);
  const [badgeColorClass, setBadgeColorClass] = useState('#6b7280');

  useEffect(() => {
    if (!inventorySettings || !inventorySettings.enableInventoryBadges) {
      setInventoryBadge(null);
      return;
    }

    const quantity =
      selectedVariant?.quantityAvailable ??
      product.variants?.nodes?.[0]?.quantityAvailable ??
      0;

    let badge = null;
    let color = '#6b7280';

    if (quantity === 0) {
      badge = inventorySettings.outOfStockMessage;
      color = getBadgeColor(inventorySettings.outOfStockBadgeColor);
    } else if (quantity <= inventorySettings.criticalStockThreshold) {
      badge = inventorySettings.criticalStockMessage;
      color = getBadgeColor(inventorySettings.criticalStockBadgeColor);
    } else if (quantity <= inventorySettings.lowStockThreshold) {
      badge = inventorySettings.lowStockMessage;
      color = getBadgeColor(inventorySettings.lowStockBadgeColor);
    }

    setInventoryBadge(badge);
    setBadgeColorClass(color);
  }, [selectedVariant, inventorySettings, product.variants?.nodes]);

  useEffect(() => {
    const apiPath = locale ? `/${locale}/api/track-view` : '/api/track-view';
    fetch(apiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        category: product.productType || product.productType,
        handle: product.handle,
      }),
    });
  }, [product.id, locale]);

  // ✅ Updated handleWishlistToggle using context
  const handleWishlistToggle = async () => {
    if (!isLoggedIn) {
      window.location.href = '/signin';
      return;
    }

    const currentVariantId = selectedVariant?.id;

    const result = await toggleWishlist({
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle,
      productImage:
        selectedImage?.url ||
        selectedVariant?.image?.url ||
        product.featuredImage?.url ||
        '',
      productPrice: selectedVariant?.price?.amount || price?.amount || '0',
      variantId: currentVariantId || '',
      variantTitle: selectedVariant?.title || '',
      selectedOptions: selectedVariant?.selectedOptions || [],
    });

    if (!result.success && result.requiresLogin) {
      window.location.href = '/signin';
    }
  };

  useEffect(() => {
    if (!recommendationsSettings?.enabled) return;

    const apiPath = locale
      ? `/${locale}/api/recommendations`
      : '/api/recommendations';

    const firstVariant = product?.variants?.nodes?.[0];
    const variantId = firstVariant?.id || '';
    const variantOptions = firstVariant?.selectedOptions
      ? JSON.stringify(firstVariant.selectedOptions)
      : '';

    let url = `${apiPath}?productId=${product.id}`;
    if (variantId) {
      url += `&variantId=${encodeURIComponent(variantId)}`;
    }
    if (variantOptions) {
      url += `&variantOptions=${encodeURIComponent(variantOptions)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data.products || []);
      })
      .catch(console.error);
  }, [
    product.id,
    product?.variants?.nodes,
    recommendationsSettings?.enabled,
    locale,
  ]);

  // ✅ Use context's isInWishlist
  const currentVariantWishlistStatus = contextIsInWishlist(
    product.id,
    selectedVariant?.id,
  );

  const selectedColor = selectedVariant?.selectedOptions?.find(
    (option) => option.name.toLowerCase() === 'color',
  )?.value;

  const sliderImages = product?.images?.nodes || [];

  const filteredImages = useMemo(() => {
    if (!selectedColor) return sliderImages;
    const colorImages = sliderImages.filter((image) =>
      image.altText?.toLowerCase().includes(selectedColor.toLowerCase()),
    );
    return colorImages.length > 0 ? colorImages : sliderImages;
  }, [sliderImages, selectedColor]);

  // Initialize Keen-Slider
  useEffect(() => {
    if (!mainSliderRef.current || filteredImages.length === 0) return;

    mainSliderInstance.current?.destroy();
    thumbSliderInstance.current?.destroy();

    mainSliderInstance.current = new KeenSlider(mainSliderRef.current, {
      loop: false,
      slides: { perView: 1 },
      slideChanged(slider) {
        const idx = slider.track.details.rel;
        setActiveIndex(idx);
        thumbSliderInstance.current?.moveToIdx(idx);
      },
    });

    if (thumbSliderRef.current) {
      thumbSliderInstance.current = new KeenSlider(thumbSliderRef.current, {
        loop: false,
        slides: { perView: 4, spacing: 12 },
        slideChanged(slider) {
          mainSliderInstance.current?.moveToIdx(slider.track.details.rel);
        },
      });
    }

    setActiveIndex(0);

    return () => {
      mainSliderInstance.current?.destroy();
      thumbSliderInstance.current?.destroy();
    };
  }, [filteredImages]);

  useEffect(() => {
    if (thumbSliderInstance.current) {
      thumbSliderInstance.current.update({
        slides: {
          perView: 4,
          spacing: 12,
        },
      });
    }
  }, [filteredImages]);

  useEffect(() => {
    if (!selectedVariant?.image || !filteredImages.length) return;

    const index = filteredImages.findIndex(
      (img) => img.id === selectedVariant.image.id,
    );

    if (index === -1) return;

    const timer = setTimeout(() => {
      if (mainSliderInstance.current) {
        mainSliderInstance.current.moveToIdx(index);
        setActiveIndex(index);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [selectedVariant, filteredImages]);

  const NavigationArrows = () => (
    <>
      <button
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed ${activeIndex == 0 ? "!hidden" : ""}`}
        onClick={() => mainSliderInstance.current?.prev()}
        disabled={activeIndex === 0}
        aria-label="Previous image"
        style={{
          backgroundColor: "#1A1A1A80",
          color: "#FFFFFF"
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed ${activeIndex === filteredImages.length - 1 ? "!hidden" : ""}`}
        onClick={() => mainSliderInstance.current?.next()}
        disabled={activeIndex === filteredImages.length - 1}
        aria-label="Next image"
        style={{
          backgroundColor: "#1A1A1A80",
          color: "#FFFFFF"
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </>
  );

  return (
    <div className="max-w-[100%] mx-auto lg:py-8 pdp-font" key={i18n?.country}>
      <style>{dynamicStyles}</style>

      {/* Breadcrumb */}
      <nav className="flex mt-6 lg:mt-0 mb-6 text-sm px-[7%] text-[#BDBDBD]" aria-label="Breadcrumb">
        <Link to="/" className="pdp-link font-[700] cursor-pointer">
          Home
        </Link>
        <span className="mx-2 pdp-label">›</span>
        <Link to="/collections/all" className="pdp-link cursor-pointer">
          Shop
        </Link>
        <span className="mx-2 pdp-label">›</span>
        <span className="font-medium pdp-text cursor-pointer">Product Detail</span>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start px-[10%]">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-[100px] lg:z-10">
          <div className="relative group">
            <div
              ref={mainSliderRef}
              className="keen-slider rounded-lg overflow-hidden"
              style={{ height: 'auto' }}
            >
              {filteredImages.map((image, index) => (
                <div key={image.id} className="keen-slider__slide">
                  <div className="aspect-square bg-gray-50 relative">
                    <img
                      src={image.url}
                      alt={image.altText || product.title}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      onError={(e) => {
                        e.target.src = '/fallback-image.jpg';
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {filteredImages.length > 1 && <NavigationArrows />}

            {inventoryBadge && (
              <div className="absolute top-4 left-4 z-10">
                <span
                  className="text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md"
                  style={{backgroundColor: badgeColorClass}}
                >
                  {inventoryBadge}
                </span>
              </div>
            )}
          </div>

          {filteredImages.length > 1 && (
            <div className="mt-1">
              <div
                ref={thumbSliderRef}
                className="keen-slider"
                style={{ marginTop: '0.5rem' }}
              >
                {filteredImages.map((image, index) => (
                  <div
                    key={`thumb-${image.id}`}
                    className={`keen-slider__slide cursor-pointer transition-all duration-200 ${activeIndex === index ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                    onClick={() => mainSliderInstance.current?.moveToIdx(index)}
                  >
                    <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-300 transition-all">
                      <img
                        src={image.url}
                        alt={image.altText || product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-8 lg:mt-0 lg:sticky lg:top-[100px] lg:z-10">
          <h4 style={{ fontWeight: '400' }} className="mb-2 pdp-heading-h4 text-[#252B42]">{title}</h4>

          <div className="mb-4">
            <ProductPrice
              price={
                selectedVariant?.price || product?.priceRange?.minVariantPrice
              }
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
          </div>

          <div className="mb-6">
            <span className="text-sm font-medium pdp-label">
              Availability:{' '}
            </span>
            <span className="text-sm font-semibold pdp-primary-text">
              {selectedVariant?.availableForSale ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="mb-8" ref={productFormRef}>
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
              product={product}
              isWishlistEnabled={isWishlistEnabled}
              isLoggedIn={isLoggedIn}
              onWishlistToggle={handleWishlistToggle}
              isLoading={wishlistLoading}
              isInWishlist={currentVariantWishlistStatus}
              globalData={globalData}
            />
          </div>
        </div>
      </div>

      <ComparisonTable
        data={sanityProduct}
        currentProduct={product}
        globalData={globalData}
      />

      {(detailsTabsData && (detailsTabsData?.additionalInfoTab || detailsTabsData?.descriptionTab || detailsTabsData?.rightImage)) && (
        <ProductDetailsTabs data={detailsTabsData} globalData={globalData} />
      )} 

      <Recommendations
        products={recommendations}
        settings={recommendationsSettings}
        isLoggedIn={isLoggedIn}
        isWishlistEnabled={isWishlistEnabled}
        locale={locale}
        globalData={globalData}
      />

      <RecentlyViewedSection
        settings={recentlyViewedData}
        isLoggedIn={isLoggedIn}
        isWishlistEnabled={isWishlistEnabled}
        locale={locale}
        globalData={globalData}
      />

      {pdpSettings?.enableLogoSlider &&
        pdpSettings?.logoSlider?.enable &&
        pdpSettings?.logoSlider?.logos?.length > 0 && (
          <LogoSlider
            data={{
              ...pdpSettings.logoSlider,
              logos: pdpSettings.logoSlider.logos.map((logo) => ({
                ...logo,
                imageUrl: logo.image?.url,
                altText: logo.image?.altText,
              })),
            }}
            globalData={globalData}
          />
        )}

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />

      {enableStickyBar && (
        <StickyAddToCart
          product={product}
          selectedVariant={selectedVariant}
          productOptions={productOptions}
          isVisible={isStickyVisible}
          locale={locale}
          globalData={globalData}
        />
      )}
    </div>
  );
}

function ComparisonTable({ data, currentProduct, globalData }) {
  if (!data?.comparisonEnabled || !data?.comparisonRows?.length) return null;

  const formatColor = (c) => (!c ? null : c.startsWith('#') ? c : `#${c}`);
  const primaryColor = formatColor(globalData?.buttons?.primaryBg) || '#23A6F0';

  const {
    competitors = [],
    comparisonRows,
    sectionHeading,
    sectionDescription,
    comparisonStyling: rawStyling,
  } = data;

  const comparisonStyling = rawStyling || {};

  const {
    sectionWidth = 'max-w-7xl',
    paddingY = 'py-12 md:py-20',
    headingAlign = 'text-center',
    highlightColor = '#f9fafb',
    headerFontSize = 'text-sm md:text-lg',
    rowFontSize = 'text-sm',
  } = comparisonStyling;

  const widthClass =
    sectionWidth === 'max-w-4xl'
      ? 'max-w-5xl'
      : sectionWidth === 'max-w-full'
        ? 'w-full px-0'
        : 'max-w-7xl';

  return (
    <div className={`mx-auto ${widthClass} ${paddingY} bg-white`}>
      <div className={`mb-8 md:mb-12 px-4 sm:px-6 lg:px-8 ${headingAlign}`}>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight pdp-text">
          {sectionHeading || 'Compare & Decide'}
        </h2>
        {sectionDescription && (
          <p className="mt-3 text-sm md:text-base max-w-2xl mx-auto pdp-label">
            {sectionDescription}
          </p>
        )}
      </div>

      <div className="relative overflow-x-auto shadow-sm border-t border-b border-gray-100 md:border md:rounded-lg">
        <table className="w-full text-left border-collapse min-w-full">
          <thead>
            <tr>
              <th className="hidden md:table-cell p-4 md:p-6 bg-white border-b border-gray-200 min-w-[150px]"></th>
              <th
                className="sticky left-0 z-20 p-2 md:p-6 border-b border-gray-200 min-w-[50vw] md:min-w-[220px] text-center shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)] md:shadow-none"
                style={{ backgroundColor: highlightColor }}
              >
                <div className="flex flex-col items-center gap-2 md:gap-3">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-white p-2 shadow-sm border border-gray-100">
                    {currentProduct.featuredImage?.url && (
                      <img
                        src={currentProduct.featuredImage.url}
                        alt={currentProduct.title}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="space-y-1 w-full">
                    <span
                      className={`font-bold block ${headerFontSize} leading-tight px-1 pdp-text`}
                    >
                      {currentProduct.title}
                    </span>
                    <span
                      className="inline-block px-2 py-0.5 text-[9px] md:text-[10px] font-bold tracking-wider text-white rounded-full uppercase"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Our Pick
                    </span>
                  </div>
                </div>
              </th>
              {competitors.map((comp, index) => {
                const title =
                  comp.customTitle ||
                  comp.product?.store?.title ||
                  'Competitor';
                const imgUrl =
                  comp.image || comp.product?.store?.previewImageUrl;
                return (
                  <th
                    key={index}
                    className="p-2 md:p-6 border-b border-gray-200 min-w-[50vw] md:min-w-[220px] text-center bg-white"
                  >
                    <div className="flex flex-col items-center gap-2 md:gap-3 opacity-80">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 p-1">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={title}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs pdp-label">
                            N/A
                          </div>
                        )}
                      </div>
                      <span
                        className={`font-semibold ${headerFontSize} leading-tight px-1 pdp-label`}
                      >
                        {title}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, i) => (
              <tr key={i} className="group">
                <td className="hidden md:table-cell p-4 md:p-5 font-semibold border-b border-gray-100 bg-white text-sm pdp-text">
                  {row.feature}
                </td>
                <td
                  className={`sticky left-0 z-10 p-3 md:p-5 text-center font-bold border-b border-gray-200/50 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)] md:shadow-none ${rowFontSize} pdp-text`}
                  style={{ backgroundColor: highlightColor }}
                >
                  <span className="md:hidden block text-[10px] font-normal uppercase tracking-wider mb-1 pdp-label">
                    {row.feature}
                  </span>
                  {row.ourValue || '—'}
                </td>
                {competitors.map((_, idx) => {
                  const valKey = `competitor${idx + 1}Value`;
                  const value = row[valKey];
                  return (
                    <td
                      key={idx}
                      className={`p-3 md:p-5 text-center border-b border-gray-100 bg-white group-hover:bg-gray-50 transition-colors ${rowFontSize} pdp-label`}
                    >
                      <span className="md:hidden block text-[10px] font-normal uppercase tracking-wider mb-1 pdp-label">
                        {row.feature}
                      </span>
                      {value || '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StickyAddToCart({
  product,
  selectedVariant,
  productOptions,
  isVisible,
  locale,
  globalData,
}) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const scrollRef = useRef(null);

  const { open } = useAside();

  const formatColor = (c) => (!c ? null : c.startsWith('#') ? c : `#${c}`);
  const primaryColor = formatColor(globalData?.buttons?.primaryBg) || '#23A6F0';
  const primaryHoverColor =
    formatColor(globalData?.buttons?.primaryHoverBg) || '#1D4ED8';
  const primaryText =
    formatColor(globalData?.buttons?.primaryText) || '#FFFFFF';
  const borderRadius = globalData?.buttons?.borderRadius ?? 8;
  const linkTransition = globalData?.linksEffect?.transitionDuration || 300;
  const labelColor =
    formatColor(globalData?.linksEffect?.linkColor) || '#737373';

  const hasVariants =
    productOptions?.length > 0 &&
    !productOptions.some(
      (opt) => opt.name === 'Title' && opt.optionValues.length === 1,
    );

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 transform 
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ borderTopColor: labelColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-shrink-0 md:max-w-[200px]">
            <h3
              className={`text-sm font-bold leading-tight line-clamp-1 pdp-text ${!hasVariants ? 'text-center md:text-left' : ''}`}
            >
              {product.title}
            </h3>
            <div
              className={`md:hidden mt-1 text-sm pdp-label ${!hasVariants ? 'text-center' : ''}`}
            >
              <ProductPrice
                price={
                  selectedVariant?.price || product?.priceRange?.minVariantPrice
                }
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
            </div>
          </div>

          {hasVariants && (
            <div className="flex-1 flex items-center justify-center md:justify-start gap-2 min-w-0">
              <button
                onClick={() => scroll('left')}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 md:hidden flex-shrink-0"
                aria-label="Scroll left"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto scroll-smooth hide-scrollbar px-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style>{`
                  .hide-scrollbar::-webkit-scrollbar { display: none; }
                `}</style>

                {productOptions.map((option) => {
                  const isMoneyOption =
                    option.name.toLowerCase().includes('denomination') ||
                    option.name.toLowerCase().includes('amount') ||
                    option.name.toLowerCase().includes('value');

                  return (
                    <div
                      key={option.name}
                      className="flex items-center gap-2 flex-shrink-0"
                    >
                      <span className="text-xs font-medium uppercase tracking-wide hidden lg:block pdp-label">
                        {option.name}:
                      </span>
                      <div className="flex gap-2">
                        {option.optionValues.map((value) => {
                          const isSelected =
                            selectedVariant.selectedOptions.some(
                              (selected) =>
                                selected.name === option.name &&
                                selected.value === value.name,
                            );

                          const newParams = new URLSearchParams(searchParams);
                          newParams.set(option.name, value.name);

                          const basePath = locale
                            ? `/${locale}/products/${product.handle}`
                            : `/products/${product.handle}`;
                          const to = `${basePath}?${newParams.toString()}`;

                          const rawOption = product.options?.find(
                            (o) => o.name === option.name,
                          );
                          const rawOptionValue = rawOption?.optionValues?.find(
                            (v) => v.name === value.name,
                          );
                          const localizedPrice =
                            rawOptionValue?.firstSelectableVariant?.price;

                          return (
                            <Link
                              key={value.name}
                              to={to}
                              preventScrollReset
                              replace
                              className={`
                                px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap
                                ${isSelected ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-800'}
                              `}
                              style={{
                                borderRadius: `${borderRadius}px`,
                                transition: `all ${linkTransition}ms ease`,
                              }}
                            >
                              {isMoneyOption && localizedPrice ? (
                                <Money
                                  data={localizedPrice}
                                  withoutTrailingZeros
                                />
                              ) : (
                                value.name
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => scroll('right')}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 md:hidden flex-shrink-0"
                aria-label="Scroll right"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          )}

          <div className="flex items-center gap-4 flex-shrink-0 w-full md:w-auto justify-center md:justify-end">
            <div className="hidden md:block">
              <ProductPrice
                price={
                  selectedVariant?.price || product?.priceRange?.minVariantPrice
                }
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
            </div>

            <CartForm
              route="/cart"
              inputs={{
                lines: [{ merchandiseId: selectedVariant.id, quantity: 1 }],
              }}
              action={CartForm.ACTIONS.LinesAdd}
              className="w-full md:w-auto"
            >
              {(fetcher) => (
                <button
                  type="submit"
                  onClick={() => {
                    if (selectedVariant.availableForSale) {
                      open('cart');
                    }
                  }}
                  disabled={
                    !selectedVariant.availableForSale ||
                    fetcher.state !== 'idle'
                  }
                  className="w-full md:w-auto px-6 py-3 text-sm font-bold shadow uppercase tracking-wide transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: primaryColor,
                    color: primaryText,
                    borderRadius: `${borderRadius}px`,
                    transition: `all ${linkTransition}ms ease`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = primaryHoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColor;
                  }}
                >
                  {!selectedVariant.availableForSale
                    ? 'Sold Out'
                    : fetcher.state !== 'idle'
                      ? 'Adding...'
                      : 'Add to Cart'}
                </button>
              )}
            </CartForm>
          </div>
        </div>
      </div>
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    quantityAvailable
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    productType
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 20) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 10) {
      nodes {
        id
        quantityAvailable
        availableForSale
        title
        image {
          id
          url
          altText
          width
          height
        }
        selectedOptions {
          name
          value
        }
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PRODUCT_SETTINGS_QUERY = `*[_type == "settings"][0].enableStickyAddToCart`;

const SANITY_PRODUCT_QUERY = `*[_type == "product" && store.slug.current == $handle][0] {
  comparisonEnabled,
  sectionHeading,
  sectionDescription,
  comparisonStyling {
    sectionWidth,
    paddingY,
    headingAlign,
    highlightColor,
    headerFontSize,
    rowFontSize
  },
  competitors[] {
    customTitle,
    "image": image.asset->url,
    product->{
      store {
        title,
        previewImageUrl
      }
    }
  },
  comparisonRows,
  productTabsSection {
    enable,
    "rightImage": rightImage.asset->{
      url,
      altText
    },
    descriptionTab {
      heading,
      content
    },
    additionalInfoTab {
      heading,
      content
    },
    reviewsTab {
      heading,
      "reviewCount": count(reviews),
      reviews[] {
        reviewerName,
        rating,
        reviewText,
        reviewDate
      }
    }
  }
}`;
