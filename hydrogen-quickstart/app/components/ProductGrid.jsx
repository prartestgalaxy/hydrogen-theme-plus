// import React, { useState, useEffect } from 'react';
// import QuickView from './QuickView';
// import { Link, useFetcher } from 'react-router';
// import { Image, Money, CartForm } from '@shopify/hydrogen';
// import { useAside } from '~/components/Aside';

// export default function ProductGrid({
//   module = {},
//   globalSettings,
//   globalSettingsData,
//   isLoggedIn,
//   wishlistSettings,
//   activeCurrency = 'USD',
//   activeCountry = 'us',
//   wishlist: initialWishlist = []
// }) {

//   console.log("Module settings : " + JSON.stringify(module,null,2));
//   console.log("global settings data : " + JSON.stringify(globalSettingsData,null,2))

//   const { open } = useAside();
//   let quickViewConfig = null;
//   try {
//     quickViewConfig = {
//       styling: {
//         maxWidth: 'max-w-5xl',
//         backgroundColor: '#ffffff',
//         textColor: '#1a1a1a',
//         buttonColor: '#000000',
//         buttonTextColor: '#ffffff',
//         fontSize: 'text-base',
//         borderRadius: 'rounded-xl',
//       },
//       contentElements: [
//         { elementType: 'image', enabled: true, imageSize: 'large' },
//         { elementType: 'title', enabled: true, titleSize: 'text-3xl' },
//         { elementType: 'price', enabled: true, showCompareAtPrice: true },
//         { elementType: 'variants', enabled: true, variantStyle: 'buttons' },
//         { elementType: 'addToCart', enabled: true, buttonText: 'Add to Cart' },
//       ]
//     };
//   } catch (error) {
//     console.error('Error fetching quick view config:', error);
//     quickViewConfig = null;
//   }

//   // console.log("Products grid products : ", JSON.stringify(module.resolvedProducts,null,2));

//   // --- QUICK VIEW STATES ---
//   const [quickViewProductHandle, setQuickViewProductHandle] = useState(null);
//   const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

//   // --- QUICK VIEW HANDLERS ---
//   const openQuickView = (productHandle, e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setQuickViewProductHandle(productHandle);
//     setIsQuickViewOpen(true);
//   };

//   const closeQuickView = () => {
//     setIsQuickViewOpen(false);
//     setQuickViewProductHandle(null);
//   };

//   activeCountry = activeCountry.toLowerCase();

//   const locale = {
//     country: activeCountry,
//     currency: activeCurrency
//   }

//   // 1. FALLBACK DATA
//   const DUMMY_PRODUCTS = Array.from({ length: 10 }).map((_, i) => ({
//     _id: `fallback-${i}`,
//     slug: `fallback-product-${i}`,
//     title: 'Graphic Design',
//     department: 'English Department',
//     price: 6.48,
//     compareAtPrice: 16.48,
//     imageUrl: `https://picsum.photos/seed/${i + 30}/400/600`,
//   }));

//   // 2. EXTRACT PROPS WITH DEFAULTS MATCHING SANITY
//   const {
//     title = 'BESTSELLER PRODUCTS',
//     subtitle = 'Featured Products',
//     description = 'Problems trying to resolve the conflict between',
//     resolvedProducts = [],
//     columnsDesktop = 5,
//     gap = '8',
//     padding = 'py-24',
//     buttonText = 'LOAD MORE PRODUCTS',
//     buttonColor = '#23A6F0',
//     buttonTextColor = '#FFFFFF'
//   } = module;

//   const productsToDisplay = resolvedProducts && resolvedProducts.length > 0
//     ? resolvedProducts
//     : DUMMY_PRODUCTS;

//   // 3. ROW & VISIBILITY LOGIC
//   const initialDisplayCount = columnsDesktop * 2;
//   const [visibleCount, setVisibleCount] = useState(initialDisplayCount);

//   // 4. WISHLIST LOGIC - Use the wishlist from props as the source of truth
//   const [wishlist, setWishlist] = useState(initialWishlist || []);
//   const isWishlistEnabled = wishlistSettings?.enabled ?? true;

//   // Update wishlist state if initialWishlist changes
//   useEffect(() => {
//     setWishlist(initialWishlist);
//   }, [initialWishlist]);

//   // Toggle wishlist function with variant support
//   const toggleWishlist = async (product, e, variantData = null) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!isLoggedIn) {
//       window.location.href = '/signin';
//       return;
//     }

//     if (!isWishlistEnabled) {
//       alert("Wishlist is currently disabled");
//       return;
//     }

//     // Get variant data from the product or from passed variantData
//     const firstVariant = product?.variants?.nodes?.[0];
//     const variantId = variantData?.variantId || firstVariant?.id;
//     const variantTitle = variantData?.variantTitle || firstVariant?.title || 'Default Title';
//     const selectedOptions = variantData?.selectedOptions || firstVariant?.selectedOptions || [];

//     // Optimistically update UI - check if this specific variant is in wishlist
//     const isWished = wishlist.some(item => {
//       if (variantId) {
//         return item.variantId === variantId;
//       }
//       // If no variant, check by product ID
//       const itemId = item.id || item.shopifyGid || item.productId;
//       const productId = product.id || product.productId || product.shopifyGid;
//       return itemId === productId;
//     });

//     let optimisticWishlist;

//     if (isWished) {
//       optimisticWishlist = wishlist.filter(item => {
//         if (variantId) {
//           return item.variantId !== variantId;
//         }
//         const itemId = item.id || item.shopifyGid || item.productId;
//         const productId = product.id || product.productId || product.shopifyGid;
//         return itemId !== productId;
//       });
//     } else {
//       const newItem = {
//         id: product.id,
//         shopifyGid: product.id,
//         title: product.title,
//         handle: product.handle,
//         image: product.featuredImage?.url || '',
//         price: product.priceRange?.minVariantPrice?.amount || '0',
//         variantId: variantId,
//         variantTitle: variantTitle,
//         selectedOptions: selectedOptions
//       };
//       optimisticWishlist = [...wishlist, newItem];
//     }

//     setWishlist(optimisticWishlist);

//     try {
//       const res = await fetch('/api/wishlist', {
//         method: 'POST',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           productId: product.id,
//           productTitle: product.title,
//           productHandle: product.handle,
//           productImage: product.featuredImage?.url || '',
//           productPrice: product.priceRange?.minVariantPrice?.amount || '0',
//           variantId: variantId,
//           variantTitle: variantTitle,
//           selectedOptions: selectedOptions
//         })
//       });

//       const data = await res.json();

//       if (data.success) {
//         setWishlist(data.wishlist);
//         window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: data.wishlist }));
//       } else {
//         // Revert optimistic update on error
//         setWishlist(wishlist);
//         if (data.disabled) {
//           alert("Wishlist is currently disabled");
//         } else if (data.requiresLogin) {
//           window.location.href = '/signin';
//         } else {
//           alert(data.error || "Please login first");
//         }
//       }
//     } catch (error) {
//       console.error('Error toggling wishlist:', error);
//       setWishlist(wishlist);
//       alert("Something went wrong");
//     }
//   };

//   // Load wishlist function (used as fallback)
//   const loadWishlist = async () => {
//     try {
//       const response = await fetch('/api/wishlist', { credentials: 'include' });
//       const data = await response.json();
//       if (data.success && data.items) {
//         setWishlist(data.items);
//       }
//     } catch (error) {
//       console.error('Error loading wishlist:', error);
//     }
//   };

//   // Listen for wishlist updates from other components
//   useEffect(() => {
//     const handleWishlistUpdate = (event) => {
//       if (event.detail) {
//         setWishlist(event.detail);
//       } else {
//         loadWishlist();
//       }
//     };

//     window.addEventListener('wishlist-updated', handleWishlistUpdate);

//     return () => {
//       window.removeEventListener('wishlist-updated', handleWishlistUpdate);
//     };
//   }, []);

//   // ✅ 5. DYNAMIC DATA TRANSFORM
//   // const transformProductForDisplay = (sanityProduct) => {
//   //   let variantGid = null;
//   //   const variantRef = sanityProduct?.store?.variants?.[0]?._ref;
//   //   if (variantRef) {
//   //     const idNumber = variantRef.split('-').pop();
//   //     variantGid = `gid://shopify/ProductVariant/${idNumber}`;
//   //   }

//   //   // Get the Shopify GID from store.gid or construct it
//   //   let shopifyGid = sanityProduct.store?.gid;
//   //   if (!shopifyGid && sanityProduct._id) {
//   //     // Try to construct from Sanity ID if it contains the numeric ID
//   //     const match = sanityProduct._id.match(/\d+$/);
//   //     if (match) {
//   //       shopifyGid = `gid://shopify/Product/${match[0]}`;
//   //     }
//   //   }

//   //   const transformed = {
//   //     id: shopifyGid || sanityProduct._id || sanityProduct.store?.gid,
//   //     shopifyGid: shopifyGid,
//   //     handle: sanityProduct.slug?.current || sanityProduct.slug,
//   //     title: sanityProduct.title || sanityProduct.store?.title || "Graphic Design",
//   //     department: sanityProduct.department || 'English Department',
//   //     priceRange: {
//   //       minVariantPrice: {
//   //         amount: sanityProduct.price?.toString() || sanityProduct.store?.priceRange?.minVariantPrice?.amount || "0",
//   //         currencyCode: activeCurrency
//   //       }
//   //     },
//   //     featuredImage: sanityProduct.imageUrl ? {
//   //       url: sanityProduct.imageUrl,
//   //       altText: sanityProduct.title,
//   //     } : null,
//   //     compareAtPrice: sanityProduct.compareAtPrice && parseFloat(sanityProduct.compareAtPrice) > 0 ? {
//   //       amount: sanityProduct.compareAtPrice.toString(),
//   //       currencyCode: activeCurrency
//   //     } : null,
//   //     options: sanityProduct.store?.options || [],
//   //     variants: {
//   //       nodes: [{
//   //         id: variantGid,
//   //         title: sanityProduct.store?.variants?.[0]?.title || 'Default Title',
//   //         selectedOptions: sanityProduct.store?.variants?.[0]?.selectedOptions || [],
//   //         quantityAvailable: 10,
//   //         availableForSale: sanityProduct.store?.status === 'active'
//   //       }]
//   //     }
//   //   };

//   //   return transformed;
//   // };

//   // ✅ 5. DYNAMIC DATA TRANSFORM
//   const transformProductForDisplay = (sanityProduct) => {
//     let variantGid = null;
//     const variantRef = sanityProduct?.store?.variants?.[0]?._ref;

//     if (variantRef) {
//       // If it's already a Shopify GID (from our merge), use it directly
//       if (variantRef.includes('gid://shopify/')) {
//         variantGid = variantRef;
//       } else {
//         // Fallback for Sanity-style refs (shopifyProductVariant-12345)
//         const idNumber = variantRef.split('-').pop();
//         variantGid = `gid://shopify/ProductVariant/${idNumber}`;
//       }
//     }

//     // Get the Shopify GID from store.gid or construct it
//     let shopifyGid = sanityProduct.store?.gid;
//     if (!shopifyGid && sanityProduct._id) {
//       const match = sanityProduct._id.match(/\d+$/);
//       if (match) {
//         shopifyGid = `gid://shopify/Product/${match[0]}`;
//       }
//     }

//     const transformed = {
//       id: shopifyGid || sanityProduct._id || sanityProduct.store?.gid,
//       shopifyGid: shopifyGid,
//       handle: sanityProduct.slug?.current || sanityProduct.slug,
//       title: sanityProduct.title || sanityProduct.store?.title || "Graphic Design",
//       department: sanityProduct.department || 'English Department',
//       priceRange: {
//         minVariantPrice: {
//           amount: sanityProduct.price?.toString() || sanityProduct.store?.priceRange?.minVariantPrice?.amount || "0",
//           currencyCode: activeCurrency
//         }
//       },
//       featuredImage: sanityProduct.imageUrl ? {
//         url: sanityProduct.imageUrl,
//         altText: sanityProduct.title,
//       } : null,
//       compareAtPrice: sanityProduct.compareAtPrice && parseFloat(sanityProduct.compareAtPrice) > 0 ? {
//         amount: sanityProduct.compareAtPrice.toString(),
//         currencyCode: activeCurrency
//       } : null,
//       options: sanityProduct.store?.options || [],
//       variants: {
//         nodes: [{
//           id: variantGid,
//           title: sanityProduct.store?.variants?.[0]?.title || 'Default Title',
//           selectedOptions: sanityProduct.store?.variants?.[0]?.selectedOptions || [],
//           quantityAvailable: 10,
//           availableForSale: sanityProduct.store?.status === 'active'
//         }]
//       }
//     };

//     return transformed;
//   };

//   const showQuickView = module.showQuickView ?? globalSettings?.showQuickView ?? true;

//   // Style Mappings
//   const gridCols = {
//     2: 'lg:grid-cols-2',
//     3: 'lg:grid-cols-3',
//     4: 'lg:grid-cols-4',
//     5: 'lg:grid-cols-5',
//   }[columnsDesktop] || 'lg:grid-cols-5';

//   const gridGap = {
//     '0': 'gap-0',
//     '4': 'gap-4',
//     '8': 'gap-y-12 md:gap-x-8 md:gap-y-16',
//     '12': 'gap-y-16 md:gap-x-12 md:gap-y-20',
//   }[gap] || 'gap-y-12 md:gap-x-8 md:gap-y-16';

//   return (
//     <section className={`w-full max-w-[100%] px-[7%] mx-auto ${padding} px-[7%] md:px-[7%] bg-white overflow-hidden relative`}>
//       <div className="mx-auto">

//         {/* Header */}
//         {(title || subtitle || description) && (
//           <header className="mb-12 md:mb-16 text-center mx-auto flex flex-col items-center justify-center gap-2">
//             {subtitle && (
//               <span className="block text-[18px] md:text-[20px] leading-[30px] text-[#737373] animate-in fade-in slide-in-from-bottom-2 duration-700">
//                 {subtitle}
//               </span>
//             )}
//             {title && (
//               <h2 className="text-[20px] md:text-[24px] leading-[32px] font-bold uppercase text-[#252B42] tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-1000">
//                 {title}
//               </h2>
//             )}
//             {description && (
//               <p className="text-[14px] leading-[20px] text-[#737373] max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-1000">
//                 {description}
//               </p>
//             )}
//           </header>
//         )}

//         {/* Grid */}
//         <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} ${gridGap}`}>
//           {productsToDisplay.slice(0, visibleCount).map((product, index) => {
//             const transformedProduct = transformProductForDisplay(product);

//             // Hide products after the 3rd one on mobile screens
//             const hideOnMobileClass = index >= 3 ? 'hidden md:block' : 'block';

//             return (
//               <div
//                 key={product._id || index}
//                 className={`product-card-reveal opacity-0 w-full max-w-[280px] mx-auto md:max-w-none ${hideOnMobileClass}`}
//                 style={{ animationDelay: `${(index % initialDisplayCount) * 100}ms` }}
//               >
//                 <CustomProductItem
//                   product={transformedProduct}
//                   showQuickView={showQuickView}
//                   loading={index < 5 ? 'eager' : 'lazy'}
//                   wishlist={wishlist}
//                   onToggleWishlist={toggleWishlist}
//                   isWishlistEnabled={isWishlistEnabled}
//                   isLoggedIn={isLoggedIn}
//                   onQuickView={openQuickView}
//                   activeCountry={activeCountry}
//                   onCartOpen={open}
//                 />
//               </div>
//             );
//           })}
//         </div>

//         {/* View All / Load More Link */}
//         {visibleCount < productsToDisplay.length && (
//           <div className="mt-12 md:mt-16 flex justify-center animate-in fade-in duration-1000">
//             <Link
//               to={`/${activeCountry}/collections/all`}
//               className="inline-block px-10 py-3 border-2 font-bold transition-colors uppercase text-sm tracking-wider text-center"
//               style={{
//                 borderColor: buttonColor,
//                 backgroundColor: 'transparent',
//                 color: buttonColor,
//                 textDecoration: 'none'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = buttonColor;
//                 e.currentTarget.style.color = buttonTextColor;
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = 'transparent';
//                 e.currentTarget.style.color = buttonColor;
//               }}
//             >
//               {buttonText}
//             </Link>
//           </div>
//         )}

//       </div>

//       <QuickView
//         productHandle={quickViewProductHandle}
//         config={quickViewConfig}
//         isOpen={isQuickViewOpen}
//         onClose={closeQuickView}
//         locale={locale}
//         isWishlistEnabled={isWishlistEnabled}
//         isLoggedIn={isLoggedIn}
//         wishlist={wishlist}
//         setWishlist={setWishlist}
//       />

//       <style dangerouslySetInnerHTML={{
//         __html: `
//         @keyframes revealUp {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .product-card-reveal {
//           animation: revealUp 0.8s cubic-bezier(0.2, 0.6, 0.3, 1) forwards;
//         }
//       `}} />
//     </section>
//   );
// }

// // ==========================================
// // CHILD COMPONENT: CUSTOM PRODUCT ITEM
// // ==========================================
// export function CustomProductItem({
//   product,
//   showQuickView = true,
//   loading = 'lazy',
//   wishlist,
//   onToggleWishlist,
//   isWishlistEnabled,
//   isLoggedIn,
//   onQuickView,
//   activeCountry,
//   onCartOpen
// }) {
//   const fetcher = useFetcher();
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [loaded, setLoaded] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [hoveredIcon, setHoveredIcon] = useState(null);

//   // --- Product Data ---
//   const image = product?.featuredImage;
//   const price = product?.priceRange?.minVariantPrice;
//   const compareAtPrice = product?.compareAtPrice;

//   const firstVariant = product?.variants?.nodes?.[0];
//   const variantId = firstVariant?.id;
//   const isOutOfStock = firstVariant && (!firstVariant.availableForSale || firstVariant.quantityAvailable <= 0);

//   // Calculate if sale price is active
//   const currentPriceAmt = price?.amount ? parseFloat(price.amount) : 0;
//   const comparePriceAmt = compareAtPrice?.amount ? parseFloat(compareAtPrice.amount) : 0;
//   const hasCompareAtPrice = comparePriceAmt > currentPriceAmt;

//   // Extract Color Swatches Data
//   const colorOption = product.options?.find(opt => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour');

//   // Check if product is in wishlist with variant support
//   const isWished = wishlist?.some((item) => {
//     const firstVariant = product?.variants?.nodes?.[0];
//     const variantId = firstVariant?.id;

//     // If product has a variant and the wishlist item has a variant ID
//     if (variantId && item.variantId) {
//       return item.variantId === variantId;
//     }

//     // If no variant, check by product ID
//     const itemId = item.id || item.shopifyGid || item.productId;
//     const productId = product.id || product.shopifyGid || product.productId;
//     return itemId === productId;
//   }) || false;

//   // --- Cart Logic ---
//   useEffect(() => {
//     if (fetcher.state === 'idle' && isAddingToCart) {
//       setIsAddingToCart(false);
//       if (onCartOpen && typeof onCartOpen === 'function') {
//           onCartOpen('cart'); // Pass 'cart' as the type
//       }
//     }
//   }, [fetcher.state, isAddingToCart]);

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!variantId || isOutOfStock) return;

//     setIsAddingToCart(true);
//     fetcher.submit(
//       {
//         [CartForm.INPUT_NAME]: JSON.stringify({
//           action: CartForm.ACTIONS.LinesAdd,
//           inputs: { lines: [{ merchandiseId: variantId, quantity: 1 }] },
//         }),
//       },
//       { method: 'POST', action: '/cart' }
//     );
//   };

//   // --- Quick View Logic ---
//   const handleQuickViewClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     onQuickView(product.handle, e);
//   };

//   // --- Wishlist handler with variant data ---
//   const handleWishlistClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     // Get variant data from the product
//     const firstVariant = product?.variants?.nodes?.[0];
//     const variantData = {
//       variantId: firstVariant?.id,
//       variantTitle: firstVariant?.title,
//       selectedOptions: firstVariant?.selectedOptions || []
//     };

//     onToggleWishlist(product, e, variantData);
//   };

//   if (!product) return null;

//   return (
//     // <div
//     //   className="bg-white rounded hover:shadow-lg transition-all duration-300 overflow-hidden group border border-transparent hover:border-gray-100"
//     //   onMouseEnter={() => setIsHovered(true)}
//     //   onMouseLeave={() => setIsHovered(false)}
//     // >
//     //   <Link to={activeCountry ? `/${activeCountry}/products/${product.handle}` : `/products/${product.handle}`} className="block" prefetch="intent">

//     <div
//       // Added: h-full flex flex-col
//       className="bg-white rounded hover:shadow-lg transition-all duration-300 overflow-hidden group border border-transparent hover:border-gray-100 h-full flex flex-col"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Changed block to flex flex-col h-full */}
//       <Link to={activeCountry ? `/${activeCountry}/products/${product.handle}` : `/products/${product.handle}`} className="flex flex-col h-full" prefetch="intent">

//         {/* --- IMAGE & OVERLAYS --- */}
//         {/* <div className={`relative overflow-hidden bg-gray-50 flex items-center justify-center`}>
//           {image ? (
//             <Image
//               data={image}
//               alt={image.altText || product.title}
//               loading={loading}
//               sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
//               className={`w-full h-full object-contain transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'} ${loaded ? 'blur-0' : 'blur-0'}`}
//               // className={`aspect-square w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'} ${loaded ? 'blur-0' : 'blur-0'}`}
//               onLoad={(e) => {
//                 e.currentTarget.style.filter = 'blur(0)';
//                 setLoaded(true);
//               }}
//             />
//           )  */}
//           <div className={`relative overflow-hidden bg-gray-50 flex items-center justify-center w-full aspect-[1/1]`}>
//           {image ? (
//             <Image
//               data={image}
//               alt={image.altText || product.title}
//               loading={loading}
//               sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
//               className={`absolute inset-0 w-full h-full mix-blend-multiply object-contain transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'} ${loaded ? 'blur-0' : 'blur-0'}`}
//               onLoad={(e) => {
//                 e.currentTarget.style.filter = 'blur(0)';
//                 setLoaded(true);
//               }}
//             />

//           )
//           : (
//             <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
//               No Image
//             </div>
//           )}

//           {/* Hover Actions Overlay */}
//           <div className={`absolute inset-0 bg-black/40 flex items-end justify-center pb-6 gap-3 transition-all duration-300 md:opacity-0 ${isHovered ? 'md:opacity-100' : 'md:opacity-0'}`}>
//             {/* Wishlist Button - First */}
//             {isWishlistEnabled && (
//               <button
//                 onClick={handleWishlistClick}
//                 onMouseEnter={() => setHoveredIcon("wishlist")}
//                 onMouseLeave={() => setHoveredIcon(null)}
//                 className={`bg-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${isWished ? 'text-red-500' : 'text-black'
//                   } hover:bg-black`}
//                 aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
//               >
//                 <WishlistIcon filled={isWished} hovered={hoveredIcon === "wishlist"} />
//               </button>
//             )}

//             {/* Cart Button - Second */}
//             <button
//               onClick={handleAddToCart}
//               onMouseEnter={() => setHoveredIcon("cart")}
//               onMouseLeave={() => setHoveredIcon(null)}
//               disabled={isAddingToCart || isOutOfStock || !variantId}
//               className={`bg-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black ${(isAddingToCart || isOutOfStock || !variantId) ? 'opacity-50 cursor-not-allowed' : ''}`}
//             >
//               {isAddingToCart ? (
//                 <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               ) : (
//                 <CartIcon hovered={hoveredIcon === "cart"} />
//               )}
//             </button>

//             {/* Quick View Button - Third */}
//             {showQuickView && (
//               <button
//                 onClick={handleQuickViewClick}
//                 onMouseEnter={() => setHoveredIcon("quick")}
//                 onMouseLeave={() => setHoveredIcon(null)}
//                 className="bg-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black"
//               >
//                 <QuickViewIcon hovered={hoveredIcon === "quick"} />
//               </button>
//             )}
//           </div>

//         </div>

//         {/* --- PRODUCT INFO --- */}
//         {/* <div className="mt-4 md:mt-6 px-2 md:px-4 pb-4 md:pb-6 flex flex-col items-center text-center bg-white">
//           <h4 className="font-bold text-[#252B42] text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] tracking-[0.1px] mb-1 md:mb-2 truncate w-full">
//             {product.title}
//           </h4> */}
//           <div className="mt-4 md:mt-6 px-2 md:px-4 pb-4 md:pb-6 flex flex-col items-center text-center bg-white flex-grow">
//           <h4 className="font-bold text-[#252B42] text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] tracking-[0.1px] mb-1 md:mb-2 truncate w-full">
//             {product.title}
//           </h4>

//           <span className="font-bold text-[#737373] text-[12px] md:text-[14px] leading-[20px] md:leading-[24px] tracking-[0.2px] mb-2 md:mb-3 truncate w-full">
//             {product.department}
//           </span>

//           {/* Prices */}
//           <div className="flex items-center gap-2 justify-center">
//             {hasCompareAtPrice && (
//               <span className="text-[#BDBDBD] font-bold text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] tracking-[0.1px]">
//                 <Money data={{ ...compareAtPrice, amount: parseFloat(compareAtPrice.amount).toFixed(2) }} />
//               </span>
//             )}
//             <span className="text-[#23856D] font-bold text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] tracking-[0.1px]">
//               {price ? <Money data={{ ...price, amount: parseFloat(price.amount).toFixed(2) }} /> : 'Price not available'}
//             </span>
//           </div>

//           {/* Color Swatches */}
//           {colorOption && colorOption.values?.length > 0 && (
//             <div className="mt-3 flex justify-center">
//               <div className="flex items-center gap-1.5">
//                 {colorOption.values.slice(0, 4).map((color, index) => (
//                   <div
//                     key={index}
//                     className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-gray-200 shadow-sm"
//                     style={{ backgroundColor: color.toLowerCase() }}
//                     title={color}
//                   />
//                 ))}
//                 {colorOption.values.length > 4 && (
//                   <span className="text-[10px] md:text-[12px] leading-[16px] text-[#737373] font-bold ml-1">
//                     +{colorOption.values.length - 4}
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}

//         </div>
//       </Link>
//     </div>
//   );
// }

// // Icon components
// const WishlistIcon = ({ filled, hovered }) => (
//   <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//     <path
//       d="M14.031 2.8125H14.032C14.6118 2.81271 15.1858 2.92807 15.7205 3.15234C16.2552 3.37666 16.7398 3.70554 17.1462 4.11914C17.9751 4.96296 18.4392 6.09841 18.4392 7.28125C18.4392 8.46409 17.9751 9.59954 17.1462 10.4434L9.99976 17.6797L2.85425 10.4434C2.0255 9.59956 1.56128 8.46398 1.56128 7.28125C1.56128 6.09852 2.0255 4.96294 2.85425 4.11914C3.26082 3.70576 3.74625 3.37743 4.28101 3.15332C4.81567 2.9293 5.38978 2.81348 5.96948 2.81348C6.54921 2.81351 7.12329 2.92925 7.65796 3.15332C8.19262 3.37741 8.67722 3.70584 9.08374 4.11914L9.08472 4.12012L9.77808 4.82031L10.0007 5.04395L10.2224 4.82031L10.9158 4.12012L10.9177 4.11914C11.3237 3.70511 11.8078 3.37568 12.3425 3.15137C12.8771 2.92711 13.4513 2.81207 14.031 2.8125Z"
//       fill={filled ? "#EF4444" : "transparent"}
//       stroke={filled ? "#EF4444" : hovered ? "#ffffff" : "#252B42"}
//       strokeWidth="1.5"
//     />
//   </svg>
// );

// const CartIcon = ({ hovered }) => (
//   <svg
//     width="20"
//     height="20"
//     viewBox="0 0 20 20"
//     fill={hovered ? "#ffffff" : "#252B42"}
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path d="M0 1.63333C0 1.46536 0.0667281 1.30427 0.185505 1.1855C0.304281 1.06673 0.465377 1 0.633353 1H2.53341C2.67469 1.00004 2.8119 1.04731 2.92322 1.1343C3.03454 1.22129 3.11357 1.34299 3.14776 1.48007L3.66078 3.53333H18.3672C18.4602 3.53342 18.5521 3.55398 18.6362 3.59356C18.7204 3.63315 18.7948 3.69077 18.8541 3.76235C18.9135 3.83393 18.9564 3.9177 18.9797 4.00772C19.0031 4.09774 19.0063 4.19179 18.9892 4.2832L17.0891 14.4165C17.062 14.5617 16.9849 14.6927 16.8714 14.7871C16.7578 14.8815 16.6148 14.9332 16.4672 14.9333H5.06682C4.91917 14.9332 4.7762 14.8815 4.66263 14.7871C4.54906 14.6927 4.47204 14.5617 4.44487 14.4165L2.54608 4.3022L2.0394 2.26667H0.633353C0.465377 2.26667 0.304281 2.19994 0.185505 2.08117C0.0667281 1.96239 0 1.8013 0 1.63333ZM3.92932 4.8L5.59251 13.6667H15.9415L17.6047 4.8H3.92932ZM6.33353 14.9333C5.66163 14.9333 5.01724 15.2002 4.54214 15.6753C4.06703 16.1504 3.80012 16.7948 3.80012 17.4667C3.80012 18.1385 4.06703 18.7829 4.54214 19.258C5.01724 19.7331 5.66163 20 6.33353 20C7.00543 20 7.64981 19.7331 8.12492 19.258C8.60003 18.7829 8.86694 18.1385 8.86694 17.4667C8.86694 16.7948 8.60003 16.1504 8.12492 15.6753C7.64981 15.2002 7.00543 14.9333 6.33353 14.9333ZM15.2005 14.9333C14.5286 14.9333 13.8842 15.2002 13.4091 15.6753C12.934 16.1504 12.6671 16.7948 12.6671 17.4667C12.6671 18.1385 12.934 18.7829 13.4091 19.258C13.8842 19.7331 14.5286 20 15.2005 20C15.8724 20 16.5168 19.7331 16.9919 19.258C17.467 18.7829 17.7339 18.1385 17.7339 17.4667C17.7339 16.7948 17.467 16.1504 16.9919 15.6753C16.5168 15.2002 15.8724 14.9333 15.2005 14.9333ZM6.33353 16.2C6.66948 16.2 6.99167 16.3335 7.22922 16.571C7.46678 16.8085 7.60023 17.1307 7.60023 17.4667C7.60023 17.8026 7.46678 18.1248 7.22922 18.3623C6.99167 18.5999 6.66948 18.7333 6.33353 18.7333C5.99758 18.7333 5.67539 18.5999 5.43783 18.3623C5.20028 18.1248 5.06682 17.8026 5.06682 17.4667C5.06682 17.1307 5.20028 16.8085 5.43783 16.571C5.67539 16.3335 5.99758 16.2 6.33353 16.2ZM15.2005 16.2C15.5364 16.2 15.8586 16.3335 16.0962 16.571C16.3337 16.8085 16.4672 17.1307 16.4672 17.4667C16.4672 17.8026 16.3337 18.1248 16.0962 18.3623C15.8586 18.5999 15.5364 18.7333 15.2005 18.7333C14.8645 18.7333 14.5423 18.5999 14.3048 18.3623C14.0672 18.1248 13.9338 17.8026 13.9338 17.4667C13.9338 17.1307 14.0672 16.8085 14.3048 16.571C14.5423 16.3335 14.8645 16.2 15.2005 16.2Z" />
//   </svg>
// );

// const QuickViewIcon = ({ hovered }) => (
//   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 10 12.5C9.33696 12.5 8.70107 12.2366 8.23223 11.7678C7.76339 11.2989 7.5 10.663 7.5 10C7.5 9.33696 7.76339 8.70107 8.23223 8.23223C8.70107 7.76339 9.33696 7.5 10 7.5C10.663 7.5 11.2989 7.76339 11.7678 8.23223C12.2366 8.70107 12.5 9.33696 12.5 10Z" fill="black" />
//     <path d="M2 10C2 10 5 4.5 10 4.5C15 4.5 18 10 18 10C18 10 15 15.5 10 15.5C5 15.5 2 10 2 10ZM10 13.5C10.9283 13.5 11.8185 13.1313 12.4749 12.4749C13.1313 11.8185 13.5 10.9283 13.5 10C13.5 9.07174 13.1313 8.1815 12.4749 7.52513C11.8185 6.86875 10.9283 6.5 10 6.5C9.07174 6.5 8.1815 6.86875 7.52513 7.52513C6.86875 8.1815 6.5 9.07174 6.5 10C6.5 10.9283 6.86875 11.8185 7.52513 12.4749C8.1815 13.1313 9.07174 13.5 10 13.5Z" fill={hovered ? "#ffffff" : "black"} />
//   </svg>
// );

// import React, { useState, useEffect } from 'react';
// import QuickView from './QuickView';
// import { Link, useFetcher } from 'react-router';
// import { Image, Money, CartForm } from '@shopify/hydrogen';
// import { useAside } from '~/components/Aside';

// export default function ProductGrid({
//   module = {},
//   globalSettings,
//   globalSettingsData,
//   isLoggedIn,
//   wishlistSettings,
//   activeCurrency = 'USD',
//   activeCountry = 'us',
//   wishlist: initialWishlist = []
// }) {
//   const { open } = useAside();

//   // --- STYLING HIERARCHY LOGIC ---
//   const customFont = module.fontFamily || globalSettingsData?.fontFamily || 'Montserrat, sans-serif';

//   const styles = {
//     sectionTitle: {
//       fontFamily: customFont,
//       fontSize: module.titleFontSize || (globalSettingsData?.headingSizes?.h2 ? `${globalSettingsData.headingSizes.h2}px` : '24px'),
//       textAlign: module.textAlign || 'center'
//     },
//     subtitle: {
//       fontFamily: customFont,
//       fontSize: module.subtitleFontSize || (globalSettingsData?.headingSizes?.h5 ? `${globalSettingsData.headingSizes.h5}px` : '20px'),
//     },
//     description: {
//       fontFamily: customFont,
//       fontSize: module.descriptionFontSize || (globalSettingsData?.baseFontSize ? `${globalSettingsData.baseFontSize}px` : '14px'),
//     },
//     productTitle: {
//       fontFamily: customFont,
//       fontSize: module.productTitleFontSize || (globalSettingsData?.headingSizes?.h6 ? `${globalSettingsData.headingSizes.h6}px` : '16px'),
//     }
//   };

//   let quickViewConfig = null;
//   try {
//     quickViewConfig = {
//       styling: {
//         maxWidth: 'max-w-5xl',
//         backgroundColor: '#ffffff',
//         textColor: '#1a1a1a',
//         buttonColor: '#000000',
//         buttonTextColor: '#ffffff',
//         fontSize: 'text-base',
//         borderRadius: 'rounded-xl',
//       },
//       contentElements: [
//         { elementType: 'image', enabled: true, imageSize: 'large' },
//         { elementType: 'title', enabled: true, titleSize: 'text-3xl' },
//         { elementType: 'price', enabled: true, showCompareAtPrice: true },
//         { elementType: 'variants', enabled: true, variantStyle: 'buttons' },
//         { elementType: 'addToCart', enabled: true, buttonText: 'Add to Cart' },
//       ]
//     };
//   } catch (error) {
//     console.error('Error fetching quick view config:', error);
//     quickViewConfig = null;
//   }

//   const [quickViewProductHandle, setQuickViewProductHandle] = useState(null);
//   const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

//   const openQuickView = (productHandle, e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setQuickViewProductHandle(productHandle);
//     setIsQuickViewOpen(true);
//   };

//   const closeQuickView = () => {
//     setIsQuickViewOpen(false);
//     setQuickViewProductHandle(null);
//   };

//   activeCountry = activeCountry.toLowerCase();
//   const locale = { country: activeCountry, currency: activeCurrency };

//   const DUMMY_PRODUCTS = Array.from({ length: 10 }).map((_, i) => ({
//     _id: `fallback-${i}`,
//     slug: `fallback-product-${i}`,
//     title: 'Graphic Design',
//     department: 'English Department',
//     price: 6.48,
//     compareAtPrice: 16.48,
//     imageUrl: `https://picsum.photos/seed/${i + 30}/400/600`,
//   }));

//   const {
//     title = 'BESTSELLER PRODUCTS',
//     subtitle = '',
//     description = '',
//     resolvedProducts = [],
//     columnsDesktop = 5,
//     gap = '8',
//     padding = 'py-24',
//     buttonText = 'LOAD MORE PRODUCTS',
//     buttonColor = '#23A6F0',
//     buttonTextColor = '#FFFFFF'
//   } = module;

//   const productsToDisplay = resolvedProducts && resolvedProducts.length > 0
//     ? resolvedProducts
//     : DUMMY_PRODUCTS;

//   const initialDisplayCount = columnsDesktop * 2;
//   const [visibleCount, setVisibleCount] = useState(initialDisplayCount);
//   const [wishlist, setWishlist] = useState(initialWishlist || []);
//   const isWishlistEnabled = wishlistSettings?.enabled ?? true;

//   useEffect(() => {
//     setWishlist(initialWishlist);
//   }, [initialWishlist]);

//   const toggleWishlist = async (product, e, variantData = null) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!isLoggedIn) { window.location.href = '/signin'; return; }
//     if (!isWishlistEnabled) { alert("Wishlist is currently disabled"); return; }

//     const firstVariant = product?.variants?.nodes?.[0];
//     const variantId = variantData?.variantId || firstVariant?.id;
//     const variantTitle = variantData?.variantTitle || firstVariant?.title || 'Default Title';
//     const selectedOptions = variantData?.selectedOptions || firstVariant?.selectedOptions || [];

//     const isWished = wishlist.some(item => {
//       if (variantId) return item.variantId === variantId;
//       const itemId = item.id || item.shopifyGid || item.productId;
//       const productId = product.id || product.productId || product.shopifyGid;
//       return itemId === productId;
//     });

//     let optimisticWishlist;
//     if (isWished) {
//       optimisticWishlist = wishlist.filter(item => {
//         if (variantId) return item.variantId !== variantId;
//         const itemId = item.id || item.shopifyGid || item.productId;
//         const productId = product.id || product.productId || product.shopifyGid;
//         return itemId !== productId;
//       });
//     } else {
//       const newItem = {
//         id: product.id,
//         shopifyGid: product.id,
//         title: product.title,
//         handle: product.handle,
//         image: product.featuredImage?.url || '',
//         price: product.priceRange?.minVariantPrice?.amount || '0',
//         variantId: variantId,
//         variantTitle: variantTitle,
//         selectedOptions: selectedOptions
//       };
//       optimisticWishlist = [...wishlist, newItem];
//     }

//     setWishlist(optimisticWishlist);

//     try {
//       const res = await fetch('/api/wishlist', {
//         method: 'POST',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           productId: product.id,
//           productTitle: product.title,
//           productHandle: product.handle,
//           productImage: product.featuredImage?.url || '',
//           productPrice: product.priceRange?.minVariantPrice?.amount || '0',
//           variantId: variantId,
//           variantTitle: variantTitle,
//           selectedOptions: selectedOptions
//         })
//       });
//       const data = await res.json();
//       if (data.success) {
//         setWishlist(data.wishlist);
//         window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: data.wishlist }));
//       } else {
//         setWishlist(wishlist);
//       }
//     } catch (error) {
//       console.error('Error toggling wishlist:', error);
//       setWishlist(wishlist);
//     }
//   };

//   const loadWishlist = async () => {
//     try {
//       const response = await fetch('/api/wishlist', { credentials: 'include' });
//       const data = await response.json();
//       if (data.success && data.items) setWishlist(data.items);
//     } catch (error) {
//       console.error('Error loading wishlist:', error);
//     }
//   };

//   useEffect(() => {
//     const handleWishlistUpdate = (event) => {
//       if (event.detail) setWishlist(event.detail);
//       else loadWishlist();
//     };
//     window.addEventListener('wishlist-updated', handleWishlistUpdate);
//     return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
//   }, []);

//   const transformProductForDisplay = (sanityProduct) => {
//     let variantGid = null;
//     const variantRef = sanityProduct?.store?.variants?.[0]?._ref;
//     if (variantRef) {
//       if (variantRef.includes('gid://shopify/')) variantGid = variantRef;
//       else {
//         const idNumber = variantRef.split('-').pop();
//         variantGid = `gid://shopify/ProductVariant/${idNumber}`;
//       }
//     }
//     let shopifyGid = sanityProduct.store?.gid;
//     if (!shopifyGid && sanityProduct._id) {
//       const match = sanityProduct._id.match(/\d+$/);
//       if (match) shopifyGid = `gid://shopify/Product/${match[0]}`;
//     }
//     return {
//       id: shopifyGid || sanityProduct._id || sanityProduct.store?.gid,
//       shopifyGid: shopifyGid,
//       handle: sanityProduct.slug?.current || sanityProduct.slug,
//       title: sanityProduct.title || sanityProduct.store?.title || "Graphic Design",
//       department: sanityProduct.department || 'English Department',
//       priceRange: {
//         minVariantPrice: {
//           amount: sanityProduct.price?.toString() || sanityProduct.store?.priceRange?.minVariantPrice?.amount || "0",
//           currencyCode: activeCurrency
//         }
//       },
//       featuredImage: sanityProduct.imageUrl ? { url: sanityProduct.imageUrl, altText: sanityProduct.title } : null,
//       compareAtPrice: sanityProduct.compareAtPrice && parseFloat(sanityProduct.compareAtPrice) > 0 ? {
//         amount: sanityProduct.compareAtPrice.toString(),
//         currencyCode: activeCurrency
//       } : null,
//       options: sanityProduct.store?.options || [],
//       variants: {
//         nodes: [{
//           id: variantGid,
//           title: sanityProduct.store?.variants?.[0]?.title || 'Default Title',
//           selectedOptions: sanityProduct.store?.variants?.[0]?.selectedOptions || [],
//           quantityAvailable: 10,
//           availableForSale: sanityProduct.store?.status === 'active'
//         }]
//       }
//     };
//   };

//   const showQuickView = module.showQuickView ?? globalSettings?.showQuickView ?? true;

//   const gridCols = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }[columnsDesktop] || 'lg:grid-cols-5';
//   const gridGap = { '0': 'gap-0', '4': 'gap-4', '8': 'gap-y-12 md:gap-x-8 md:gap-y-16', '12': 'gap-y-16 md:gap-x-12 md:gap-y-20' }[gap] || 'gap-y-12 md:gap-x-8 md:gap-y-16';

//   return (
//     <section className={`w-full max-w-[100%] px-[7%] mx-auto ${padding} bg-white overflow-hidden relative`} style={{ fontFamily: customFont }}>
//       <div className="mx-auto">
//         {(title || subtitle || description) && (
//           <header className="mb-12 md:mb-16 text-center mx-auto flex flex-col items-center justify-center gap-2">
//             {subtitle && (
//               <span
//                 className="block leading-[30px] text-[#737373] animate-in fade-in slide-in-from-bottom-2 duration-700"
//                 style={{ fontFamily: styles.subtitle.fontFamily, fontSize: styles.subtitle.fontSize }}
//               >
//                 {subtitle}
//               </span>
//             )}
//             {title && (
//               <h2
//                 className="leading-[32px] font-bold uppercase text-[#252B42] tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-1000"
//                 style={{ fontFamily: styles.sectionTitle.fontFamily, fontSize: styles.sectionTitle.fontSize }}
//               >
//                 {title}
//               </h2>
//             )}
//             {description && (
//               <p
//                 className="leading-[20px] text-[#737373] max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-1000"
//                 style={{ fontFamily: styles.description.fontFamily, fontSize: styles.description.fontSize }}
//               >
//                 {description}
//               </p>
//             )}
//           </header>
//         )}

//         <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} ${gridGap}`}>
//           {productsToDisplay.slice(0, visibleCount).map((product, index) => {
//             const transformedProduct = transformProductForDisplay(product);
//             const hideOnMobileClass = index >= 3 ? 'hidden md:block' : 'block';
//             return (
//               <div
//                 key={product._id || index}
//                 className={`product-card-reveal opacity-0 w-full max-w-[280px] mx-auto md:max-w-none ${hideOnMobileClass}`}
//                 style={{ animationDelay: `${(index % initialDisplayCount) * 100}ms` }}
//               >
//                 <CustomProductItem
//                   product={transformedProduct}
//                   showQuickView={showQuickView}
//                   loading={index < 5 ? 'eager' : 'lazy'}
//                   wishlist={wishlist}
//                   onToggleWishlist={toggleWishlist}
//                   isWishlistEnabled={isWishlistEnabled}
//                   isLoggedIn={isLoggedIn}
//                   onQuickView={openQuickView}
//                   activeCountry={activeCountry}
//                   onCartOpen={open}
//                   textStyles={styles}
//                 />
//               </div>
//             );
//           })}
//         </div>
// {/*
//         {visibleCount < productsToDisplay.length && (
//           <div className="mt-12 md:mt-16 flex justify-center animate-in fade-in duration-1000">
//             <Link
//               to={`/${activeCountry}/collections/all`}
//               className="inline-block px-10 py-3 border-2 font-bold transition-colors uppercase text-sm tracking-wider text-center"
//               style={{
//                 borderColor: buttonColor,
//                 backgroundColor: 'transparent',
//                 color: buttonColor,
//                 textDecoration: 'none'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = buttonColor;
//                 e.currentTarget.style.color = buttonTextColor;
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = 'transparent';
//                 e.currentTarget.style.color = buttonColor;
//               }}
//             >
//               {buttonText}
//             </Link>
//           </div>
//         )} */}

//         {/* View All / Load More Link */}
//         {visibleCount < productsToDisplay.length && (
//           <div className="mt-12 md:mt-16 flex justify-center animate-in fade-in duration-1000">
//             <Link
//               to={`/${activeCountry}/collections/all`}
//               className="inline-block px-10 py-3 border-2 font-bold transition-colors uppercase text-sm tracking-wider text-center"
//               style={{
//                 // 1. Module buttonColor -> 2. Global primaryBg -> 3. Image Default (#23A6F0)
//                 borderColor: module.buttonColor || (globalSettingsData?.buttons?.primaryBg ? `#${globalSettingsData.buttons.primaryBg}` : '#23A6F0'),
//                 backgroundColor: 'transparent',
//                 // Same hierarchy for initial text color
//                 color: module.buttonColor || (globalSettingsData?.buttons?.primaryBg ? `#${globalSettingsData.buttons.primaryBg}` : '#23A6F0'),
//                 borderRadius: globalSettingsData?.buttons?.borderRadius ? `${globalSettingsData.buttons.borderRadius}px` : '0px',
//                 textDecoration: 'none',
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseEnter={(e) => {
//                 // HOVER BG: 1. Module buttonColor -> 2. Global primaryHoverBg -> 3. Image Default
//                 const hoverBg = module.buttonColor || (globalSettingsData?.buttons?.primaryHoverBg ? `#${globalSettingsData.buttons.primaryHoverBg}` : '#23A6F0');

//                 // HOVER TEXT: 1. Module buttonTextColor -> 2. Global primaryHovertxt -> 3. Default White
//                 const hoverTxt = module.buttonTextColor || (globalSettingsData?.buttons?.primaryHovertxt ? `#${globalSettingsData.buttons.primaryHovertxt}` : '#FFFFFF');

//                 e.currentTarget.style.backgroundColor = hoverBg;
//                 e.currentTarget.style.color = hoverTxt;
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = 'transparent';
//                 e.currentTarget.style.color = module.buttonColor || (globalSettingsData?.buttons?.primaryBg ? `#${globalSettingsData.buttons.primaryBg}` : '#23A6F0');
//               }}
//             >
//               {buttonText}
//             </Link>
//           </div>
//         )}

//       </div>

//       <QuickView
//         productHandle={quickViewProductHandle}
//         config={quickViewConfig}
//         isOpen={isQuickViewOpen}
//         onClose={closeQuickView}
//         locale={locale}
//         isWishlistEnabled={isWishlistEnabled}
//         isLoggedIn={isLoggedIn}
//         wishlist={wishlist}
//         setWishlist={setWishlist}
//       />

//       <style dangerouslySetInnerHTML={{
//         __html: `
//         @keyframes revealUp {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .product-card-reveal {
//           animation: revealUp 0.8s cubic-bezier(0.2, 0.6, 0.3, 1) forwards;
//         }
//       `}} />
//     </section>
//   );
// }

// export function CustomProductItem({
//   product,
//   showQuickView = true,
//   loading = 'lazy',
//   wishlist,
//   onToggleWishlist,
//   isWishlistEnabled,
//   isLoggedIn,
//   onQuickView,
//   activeCountry,
//   onCartOpen,
//   textStyles
// }) {
//   const fetcher = useFetcher();
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [loaded, setLoaded] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [hoveredIcon, setHoveredIcon] = useState(null);

//   const image = product?.featuredImage;
//   const price = product?.priceRange?.minVariantPrice;
//   const compareAtPrice = product?.compareAtPrice;
//   const firstVariant = product?.variants?.nodes?.[0];
//   const variantId = firstVariant?.id;
//   const isOutOfStock = firstVariant && (!firstVariant.availableForSale || firstVariant.quantityAvailable <= 0);
//   const currentPriceAmt = price?.amount ? parseFloat(price.amount) : 0;
//   const comparePriceAmt = compareAtPrice?.amount ? parseFloat(compareAtPrice.amount) : 0;
//   const hasCompareAtPrice = comparePriceAmt > currentPriceAmt;
//   const colorOption = product.options?.find(opt => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour');

//   const isWished = wishlist?.some((item) => {
//     const vId = product?.variants?.nodes?.[0]?.id;
//     if (vId && item.variantId) return item.variantId === vId;
//     const itemId = item.id || item.shopifyGid || item.productId;
//     const productId = product.id || product.shopifyGid || product.productId;
//     return itemId === productId;
//   }) || false;

//   useEffect(() => {
//     if (fetcher.state === 'idle' && isAddingToCart) {
//       setIsAddingToCart(false);
//       if (onCartOpen) onCartOpen('cart');
//     }
//   }, [fetcher.state, isAddingToCart]);

//   const handleAddToCart = (e) => {
//     e.preventDefault(); e.stopPropagation();
//     if (!variantId || isOutOfStock) return;
//     setIsAddingToCart(true);
//     fetcher.submit({ [CartForm.INPUT_NAME]: JSON.stringify({ action: CartForm.ACTIONS.LinesAdd, inputs: { lines: [{ merchandiseId: variantId, quantity: 1 }] } }) }, { method: 'POST', action: '/cart' });
//   };

//   const handleQuickViewClick = (e) => { e.preventDefault(); e.stopPropagation(); onQuickView(product.handle, e); };
//   const handleWishlistClick = (e) => {
//     e.preventDefault(); e.stopPropagation();
//     const vData = { variantId: firstVariant?.id, variantTitle: firstVariant?.title, selectedOptions: firstVariant?.selectedOptions || [] };
//     onToggleWishlist(product, e, vData);
//   };

//   if (!product) return null;

//   return (
//     <div
//       className="bg-white rounded hover:shadow-lg transition-all duration-300 overflow-hidden group border border-transparent hover:border-gray-100 h-full flex flex-col"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <Link to={activeCountry ? `/${activeCountry}/products/${product.handle}` : `/products/${product.handle}`} className="flex flex-col h-full" prefetch="intent">
//         <div className={`relative overflow-hidden bg-gray-50 flex items-center justify-center w-full aspect-[1/1]`}>
//           {image ? (
//             <Image
//               data={image}
//               alt={image.altText || product.title}
//               loading={loading}
//               sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
//               className={`absolute inset-0 w-full h-full mix-blend-multiply object-contain transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'} ${loaded ? 'blur-0' : 'blur-0'}`}
//               onLoad={(e) => { setLoaded(true); }}
//             />
//           ) : (
//             <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
//           )}

//           <div className={`absolute inset-0 bg-black/40 flex items-end justify-center pb-6 gap-3 transition-all duration-300 md:opacity-0 ${isHovered ? 'md:opacity-100' : 'md:opacity-0'}`}>
//             {isWishlistEnabled && (
//               <button onClick={handleWishlistClick} onMouseEnter={() => setHoveredIcon("wishlist")} onMouseLeave={() => setHoveredIcon(null)} className={`bg-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${isWished ? 'text-red-500' : 'text-black'} hover:bg-black`} aria-label="Wishlist">
//                 <WishlistIcon filled={isWished} hovered={hoveredIcon === "wishlist"} />
//               </button>
//             )}
//             <button onClick={handleAddToCart} onMouseEnter={() => setHoveredIcon("cart")} onMouseLeave={() => setHoveredIcon(null)} disabled={isAddingToCart || isOutOfStock || !variantId} className={`bg-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black ${(isAddingToCart || isOutOfStock || !variantId) ? 'opacity-50 cursor-not-allowed' : ''}`}>
//               {isAddingToCart ? (
//                 <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
//               ) : (
//                 <CartIcon hovered={hoveredIcon === "cart"} />
//               )}
//             </button>
//             {showQuickView && (
//               <button onClick={handleQuickViewClick} onMouseEnter={() => setHoveredIcon("quick")} onMouseLeave={() => setHoveredIcon(null)} className="bg-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black">
//                 <QuickViewIcon hovered={hoveredIcon === "quick"} />
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="mt-4 md:mt-6 px-2 md:px-4 pb-4 md:pb-6 flex flex-col items-center text-center bg-white flex-grow">
//           <h4
//             className="font-bold text-[#252B42] leading-[20px] md:leading-[24px] tracking-[0.1px] mb-1 md:mb-2 truncate w-full"
//             style={{ fontFamily: textStyles.productTitle.fontFamily, fontSize: textStyles.productTitle.fontSize }}
//           >
//             {product.title}
//           </h4>
//           <span
//             className="font-bold text-[#737373] text-[12px] md:text-[14px] leading-[20px] md:leading-[24px] tracking-[0.2px] mb-2 md:mb-3 truncate w-full"
//             style={{ fontFamily: textStyles.productTitle.fontFamily }}
//           >
//             {product.department}
//           </span>
//           <div className="flex items-center gap-2 justify-center">
//             {hasCompareAtPrice && (
//               <span className="text-[#BDBDBD] font-bold text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] tracking-[0.1px]">
//                 <Money data={{ ...compareAtPrice, amount: parseFloat(compareAtPrice.amount).toFixed(2) }} />
//               </span>
//             )}
//             <span className="text-[#23856D] font-bold text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] tracking-[0.1px]">
//               {price ? <Money data={{ ...price, amount: parseFloat(price.amount).toFixed(2) }} /> : 'Price not available'}
//             </span>
//           </div>
//           {colorOption && colorOption.values?.length > 0 && (
//             <div className="mt-3 flex justify-center">
//               <div className="flex items-center gap-1.5">
//                 {colorOption.values.slice(0, 4).map((color, index) => (
//                   <div key={index} className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: color.toLowerCase() }} title={color} />
//                 ))}
//                 {colorOption.values.length > 4 && <span className="text-[10px] md:text-[12px] leading-[16px] text-[#737373] font-bold ml-1">+{colorOption.values.length - 4}</span>}
//               </div>
//             </div>
//           )}
//         </div>
//       </Link>
//     </div>
//   );
// }

// const WishlistIcon = ({ filled, hovered }) => (
//   <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//     <path d="M14.031 2.8125H14.032C14.6118 2.81271 15.1858 2.92807 15.7205 3.15234C16.2552 3.37666 16.7398 3.70554 17.1462 4.11914C17.9751 4.96296 18.4392 6.09841 18.4392 7.28125C18.4392 8.46409 17.9751 9.59954 17.1462 10.4434L9.99976 17.6797L2.85425 10.4434C2.0255 9.59956 1.56128 8.46398 1.56128 7.28125C1.56128 6.09852 2.0255 4.96294 2.85425 4.11914C3.26082 3.70576 3.74625 3.37743 4.28101 3.15332C4.81567 2.9293 5.38978 2.81348 5.96948 2.81348C6.54921 2.81351 7.12329 2.92925 7.65796 3.15332C8.19262 3.37741 8.67722 3.70584 9.08374 4.11914L9.08472 4.12012L9.77808 4.82031L10.0007 5.04395L10.2224 4.82031L10.9158 4.12012L10.9177 4.11914C11.3237 3.70511 11.8078 3.37568 12.3425 3.15137C12.8771 2.92711 13.4513 2.81207 14.031 2.8125Z" fill={filled ? "#EF4444" : "transparent"} stroke={filled ? "#EF4444" : hovered ? "#ffffff" : "#252B42"} strokeWidth="1.5" />
//   </svg>
// );

// const CartIcon = ({ hovered }) => (
//   <svg width="20" height="20" viewBox="0 0 20 20" fill={hovered ? "#ffffff" : "#252B42"} xmlns="http://www.w3.org/2000/svg">
//     <path d="M0 1.63333C0 1.46536 0.0667281 1.30427 0.185505 1.1855C0.304281 1.06673 0.465377 1 0.633353 1H2.53341C2.67469 1.00004 2.8119 1.04731 2.92322 1.1343C3.03454 1.22129 3.11357 1.34299 3.14776 1.48007L3.66078 3.53333H18.3672C18.4602 3.53342 18.5521 3.55398 18.6362 3.59356C18.7204 3.63315 18.7948 3.69077 18.8541 3.76235C18.9135 3.83393 18.9564 3.9177 18.9797 4.00772C19.0031 4.09774 19.0063 4.19179 18.9892 4.2832L17.0891 14.4165C17.062 14.5617 16.9849 14.6927 16.8714 14.7871C16.7578 14.8815 16.6148 14.9332 16.4672 14.9333H5.06682C4.91917 14.9332 4.7762 14.8815 4.66263 14.7871C4.54906 14.6927 4.47204 14.5617 4.44487 14.4165L2.54608 4.3022L2.0394 2.26667H0.633353C0.465377 2.26667 0.304281 2.19994 0.185505 2.08117C0.0667281 1.96239 0 1.8013 0 1.63333ZM3.92932 4.8L5.59251 13.6667H15.9415L17.6047 4.8H3.92932ZM6.33353 14.9333C5.66163 14.9333 5.01724 15.2002 4.54214 15.6753C4.06703 16.1504 3.80012 16.7948 3.80012 17.4667C3.80012 18.1385 4.06703 18.7829 4.54214 19.258C5.01724 19.7331 5.66163 20 6.33353 20C7.00543 20 7.64981 19.7331 8.12492 19.258C8.60003 18.7829 8.86694 18.1385 8.86694 17.4667C8.86694 16.7948 8.60003 16.1504 8.12492 15.6753C7.64981 15.2002 7.00543 14.9333 6.33353 14.9333ZM15.2005 14.9333C14.5286 14.9333 13.8842 15.2002 13.4091 15.6753C12.934 16.1504 12.6671 16.7948 12.6671 17.4667C12.6671 18.1385 12.934 18.7829 13.4091 19.258C13.8842 19.7331 14.5286 20 15.2005 20C15.8724 20 16.5168 19.7331 16.9919 19.258C17.467 18.7829 17.7339 18.1385 17.7339 17.4667C17.7339 16.7948 17.467 16.1504 16.9919 15.6753C16.5168 15.2002 15.8724 14.9333 15.2005 14.9333ZM6.33353 16.2C6.66948 16.2 6.99167 16.3335 7.22922 16.571C7.46678 16.8085 7.60023 17.1307 7.60023 17.4667C7.60023 17.8026 7.46678 18.1248 7.22922 18.3623C6.99167 18.5999 6.66948 18.7333 6.33353 18.7333C5.99758 18.7333 5.67539 18.5999 5.43783 18.3623C5.20028 18.1248 5.06682 17.8026 5.06682 17.4667C5.06682 17.1307 5.20028 16.8085 5.43783 16.571C5.67539 16.3335 5.99758 16.2 6.33353 16.2ZM15.2005 16.2C15.5364 16.2 15.8586 16.3335 16.0962 16.571C16.3337 16.8085 16.4672 17.1307 16.4672 17.4667C16.4672 17.8026 16.3337 18.1248 16.0962 18.3623C15.8586 18.5999 15.5364 18.7333 15.2005 18.7333C14.8645 18.7333 14.5423 18.5999 14.3048 18.3623C14.0672 18.1248 13.9338 17.8026 13.9338 17.4667C13.9338 17.1307 14.0672 16.8085 14.3048 16.571C14.5423 16.3335 14.8645 16.2 15.2005 16.2Z" />
//   </svg>
// );

// const QuickViewIcon = ({ hovered }) => (
//   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 10 12.5C9.33696 12.5 8.70107 12.2366 8.23223 11.7678C7.76339 11.2989 7.5 10.663 7.5 10C7.5 9.33696 7.76339 8.70107 8.23223 8.23223C8.70107 7.76339 9.33696 7.5 10 7.5C10.663 7.5 11.2989 7.76339 11.7678 8.23223C12.2366 8.70107 12.5 9.33696 12.5 10Z" fill="black" />
//     <path d="M2 10C2 10 5 4.5 10 4.5C15 4.5 18 10 18 10C18 10 15 15.5 10 15.5C5 15.5 2 10 2 10ZM10 13.5C10.9283 13.5 11.8185 13.1313 12.4749 12.4749C13.1313 11.8185 13.5 10.9283 13.5 10C13.5 9.07174 13.1313 8.1815 12.4749 7.52513C11.8185 6.86875 10.9283 6.5 10 6.5C9.07174 6.5 8.1815 6.86875 7.52513 7.52513C6.86875 8.1815 6.5 9.07174 6.5 10C6.5 10.9283 6.86875 11.8185 7.52513 12.4749C8.1815 13.1313 9.07174 13.5 10 13.5Z" fill={hovered ? "#ffffff" : "black"} />
//   </svg>
// );

import React, {useState, useEffect} from 'react';
import QuickView from './QuickView';
import {Link, useFetcher} from 'react-router';
import {Image, Money, CartForm} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {useWishlist} from '~/context/WishlistContext';

export default function ProductGrid({
  module = {},
  globalSettings,
  globalSettingsData,
  isLoggedIn,
  wishlistSettings,
  activeCurrency = 'USD',
  activeCountry = 'us',
  wishlist: initialWishlist = [],
}) {
  const {open} = useAside();

  // --- STYLING HIERARCHY LOGIC ---
  const customFont =
    module?.fontFamily ||
    globalSettingsData?.fontFamily ||
    'Montserrat, sans-serif';

  const ensureHexHash = (hex) => {
    if (!hex) return hex;
    return hex?.toString()?.startsWith('#') ? hex : `#${hex}`;
  };

  const btnColor =
    ensureHexHash(module?.buttonColor) ||
    (globalSettingsData?.buttons?.primaryBg
      ? ensureHexHash(globalSettingsData.buttons.primaryBg)
      : '#23A6F0');
  const btnHoverBg =
    ensureHexHash(module?.buttonColor) ||
    (globalSettingsData?.buttons?.primaryHoverBg
      ? ensureHexHash(globalSettingsData.buttons.primaryHoverBg)
      : '#23A6F0');
  const btnHoverTxt =
    ensureHexHash(module?.buttonTextColor) ||
    (globalSettingsData?.buttons?.primaryHovertxt
      ? ensureHexHash(globalSettingsData.buttons.primaryHovertxt)
      : '#FFFFFF');
  const btnBorderRadius =
    globalSettingsData?.buttons?.borderRadius !== undefined
      ? `${globalSettingsData.buttons.borderRadius}px`
      : '0px';

  const dynamicStyles = `
    .pg-section {
      font-family: ${customFont};
      text-align: ${module?.textAlign || 'center'};
    }
    .pg-subtitle {
      font-size: ${module?.subtitleFontSize ? module.subtitleFontSize : globalSettingsData?.headingSizes?.h4 ? globalSettingsData.headingSizes.h4 + 'px' : '20px'};
      font-family: ${customFont};
      text-align: ${module?.textAlign || 'center'};
    }
    .pg-title {
      font-size: ${module?.titleFontSize ? module.titleFontSize : globalSettingsData?.headingSizes?.h3 ? globalSettingsData.headingSizes.h3 + 'px' : '24px'};
      text-align: ${module?.textAlign || 'center'};
      font-family: ${customFont};
    }
    .pg-description {
      font-size: ${module?.descriptionFontSize ? module.descriptionFontSize : globalSettingsData?.baseFontSize ? globalSettingsData.baseFontSize + 'px' : '14px'};
      font-family: ${customFont};
      text-align: ${module?.textAlign || 'center'};
    }
    .pg-product-title {
      font-size: ${module?.productTitleFontSize ? module.productTitleFontSize : globalSettingsData?.headingSizes?.h6 ? globalSettingsData.headingSizes.h6 + 'px' : '16px'};
      font-family: ${customFont};
      text-align: ${module?.textAlign || 'center'};
    }
    .pg-load-more-btn {
      border-color: ${btnColor};
      background-color: transparent;
      color: ${btnColor};
      border-radius: ${btnBorderRadius};
      border-width: 1px;
      text-align: ${module?.textAlign || 'center'};
    }
    .pg-load-more-btn:hover {
      background-color: ${btnHoverBg};
      color: ${btnHoverTxt};
      border-color: ${btnHoverBg};
    }

    .pg-align{
      text-align: ${module?.textAlign || 'center'};
    }
  `;

  let quickViewConfig = null;
  try {
    quickViewConfig = {
      styling: {
        maxWidth: 'max-w-5xl',
        backgroundColor: '#ffffff',
        textColor: '#1a1a1a',
        buttonColor: '#000000',
        buttonTextColor: '#ffffff',
        fontSize: 'text-base',
        borderRadius: 'rounded-xl',
      },
      contentElements: [
        {elementType: 'image', enabled: true, imageSize: 'large'},
        {elementType: 'title', enabled: true, titleSize: 'text-3xl'},
        {elementType: 'price', enabled: true, showCompareAtPrice: true},
        {elementType: 'variants', enabled: true, variantStyle: 'buttons'},
        {elementType: 'addToCart', enabled: true, buttonText: 'Add to Cart'},
      ],
    };
  } catch (error) {
    console.error('Error fetching quick view config:', error);
    quickViewConfig = null;
  }

  const [quickViewProductHandle, setQuickViewProductHandle] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = (productHandle, e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProductHandle(productHandle);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProductHandle(null);
  };

  activeCountry = activeCountry.toLowerCase();
  const locale = {country: activeCountry, currency: activeCurrency};

  const DUMMY_PRODUCTS = Array.from({length: 10}).map((_, i) => ({
    _id: `fallback-${i}`,
    slug: `fallback-product-${i}`,
    title: 'Graphic Design',
    department: 'English Department',
    price: 6.48,
    compareAtPrice: 16.48,
    imageUrl: `https://picsum.photos/seed/${i + 30}/400/600`,
  }));

  const {
    title = 'BESTSELLER PRODUCTS',
    subtitle = '',
    description = '',
    resolvedProducts = [],
    columnsDesktop = 5,
    gap = '8',
    padding = 'py-24',
    buttonText = 'LOAD MORE PRODUCTS',
    buttonColor,
    buttonTextColor,
  } = module;

  // console.log("module: ", module);

  const productsToDisplay =
    resolvedProducts && resolvedProducts.length > 0
      ? resolvedProducts
      : DUMMY_PRODUCTS;

  const initialDisplayCount = columnsDesktop * 2;
  const [visibleCount, setVisibleCount] = useState(initialDisplayCount);
  const [wishlist, setWishlist] = useState(initialWishlist || []);
  const isWishlistEnabled = wishlistSettings?.enabled ?? true;

  useEffect(() => {
    setWishlist(initialWishlist);
  }, [initialWishlist]);

  const toggleWishlist = async (product, e, variantData = null) => {
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

    const firstVariant = product?.variants?.nodes?.[0];
    const variantId = variantData?.variantId || firstVariant?.id;
    const variantTitle =
      variantData?.variantTitle || firstVariant?.title || 'Default Title';
    const selectedOptions =
      variantData?.selectedOptions || firstVariant?.selectedOptions || [];

    const isWished = wishlist.some((item) => {
      if (variantId) return item.variantId === variantId;
      const itemId = item.id || item.shopifyGid || item.productId;
      const productId = product.id || product.productId || product.shopifyGid;
      return itemId === productId;
    });

    let optimisticWishlist;
    if (isWished) {
      optimisticWishlist = wishlist.filter((item) => {
        if (variantId) return item.variantId !== variantId;
        const itemId = item.id || item.shopifyGid || item.productId;
        const productId = product.id || product.productId || product.shopifyGid;
        return itemId !== productId;
      });
    } else {
      const newItem = {
        id: product.id,
        shopifyGid: product.id,
        title: product.title,
        handle: product.handle,
        image: product.featuredImage?.url || '',
        price: product.priceRange?.minVariantPrice?.amount || '0',
        variantId: variantId,
        variantTitle: variantTitle,
        selectedOptions: selectedOptions,
      };
      optimisticWishlist = [...wishlist, newItem];
    }

    setWishlist(optimisticWishlist);

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          productId: product.id,
          productTitle: product.title,
          productHandle: product.handle,
          productImage: product.featuredImage?.url || '',
          productPrice: product.priceRange?.minVariantPrice?.amount || '0',
          variantId: variantId,
          variantTitle: variantTitle,
          selectedOptions: selectedOptions,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWishlist(data.wishlist);
        window.dispatchEvent(
          new CustomEvent('wishlist-updated', {detail: data.wishlist}),
        );
      } else {
        setWishlist(wishlist);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      setWishlist(wishlist);
    }
  };

  const loadWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist', {credentials: 'include'});
      const data = await response.json();
      if (data.success && data.items) setWishlist(data.items);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  useEffect(() => {
    const handleWishlistUpdate = (event) => {
      if (event.detail) setWishlist(event.detail);
      else loadWishlist();
    };
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () =>
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, []);

  const transformProductForDisplay = (sanityProduct) => {
    let variantGid = null;
    const variantRef = sanityProduct?.store?.variants?.[0]?._ref;
    if (variantRef) {
      if (variantRef.includes('gid://shopify/')) variantGid = variantRef;
      else {
        const idNumber = variantRef.split('-').pop();
        variantGid = `gid://shopify/ProductVariant/${idNumber}`;
      }
    }
    let shopifyGid = sanityProduct.store?.gid;
    if (!shopifyGid && sanityProduct._id) {
      const match = sanityProduct._id.match(/\d+$/);
      if (match) shopifyGid = `gid://shopify/Product/${match[0]}`;
    }
    return {
      id: shopifyGid || sanityProduct._id || sanityProduct.store?.gid,
      shopifyGid: shopifyGid,
      handle: sanityProduct.slug?.current || sanityProduct.slug,
      title: sanityProduct.title || sanityProduct.store?.title || '',
      department: sanityProduct.department || '',
      priceRange: {
        minVariantPrice: {
          amount:
            sanityProduct.price?.toString() ||
            sanityProduct.store?.priceRange?.minVariantPrice?.amount ||
            '0',
          currencyCode: activeCurrency,
        },
      },
      featuredImage: sanityProduct.imageUrl
        ? {url: sanityProduct.imageUrl, altText: sanityProduct.title}
        : null,
      compareAtPrice:
        sanityProduct.compareAtPrice &&
        parseFloat(sanityProduct.compareAtPrice) > 0
          ? {
              amount: sanityProduct.compareAtPrice.toString(),
              currencyCode: activeCurrency,
            }
          : null,
      options: sanityProduct.store?.options || [],
      variants: {
        nodes: [
          {
            id: variantGid,
            title: sanityProduct.store?.variants?.[0]?.title || '',
            selectedOptions:
              sanityProduct.store?.variants?.[0]?.selectedOptions || [],
            quantityAvailable: 10,
            availableForSale: sanityProduct.store?.status === 'active',
          },
        ],
      },
    };
  };

  const showQuickView =
    module.showQuickView ?? globalSettings?.showQuickView ?? true;

  const gridCols =
    {
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
      5: 'lg:grid-cols-5',
    }[columnsDesktop] || 'lg:grid-cols-5';
  const gridGap =
    {
      0: 'gap-0',
      4: 'gap-4 md:gap-[25px]',
      8: 'gap-y-12 md:gap-x-8 md:gap-y-16',
      12: 'gap-y-16 md:gap-x-12 md:gap-y-20',
    }[gap] || 'gap-y-12 md:gap-x-8 md:gap-y-16';

  return (
    <section
      className={`pg-section w-full max-w-[100%] px-[7%] mx-auto ${padding} bg-white overflow-hidden relative`}
    >
      <style>{dynamicStyles}</style>
      <div className="mx-auto flex flex-col gap-y-[50px] items-center">
        {(title || subtitle || description) && (
          <header className="text-center mx-auto flex flex-col items-center justify-center gap-2">
            {subtitle && (
              <span
                className="pg-subtitle block leading-[30px] text-[#737373] animate-in fade-in slide-in-from-bottom-2 duration-700"
                style={{
                  letterSpacing: '0.2px',
                }}
              >
                {subtitle}
              </span>
            )}
            {title && (
              <h4
                className="pg-title leading-[32px] font-bold uppercase text-[#252B42] tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-1000"
                style={{
                  letterSpacing: '0.1px',
                }}
              >
                {title}
              </h4>
            )}
            {description && (
              <p
                className="pg-description leading-[20px] text-[#737373] max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-1000"
                style={{
                  letterSpacing: '0.2px',
                }}
              >
                {description}
              </p>
            )}
          </header>
        )}

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} ${gridGap}`}
        >
          {productsToDisplay.slice(0, visibleCount).map((product, index) => {
            const transformedProduct = transformProductForDisplay(product);
            const hideOnMobileClass = index >= 3 ? 'hidden md:block' : 'block';
            return (
              <div
                key={product._id || index}
                className={`product-card-reveal opacity-0 w-full max-w-[280px] mx-auto md:max-w-none ${hideOnMobileClass}`}
                style={{
                  animationDelay: `${(index % initialDisplayCount) * 100}ms`,
                }}
              >
                <CustomProductItem
                  product={transformedProduct}
                  showQuickView={showQuickView}
                  loading={index < 5 ? 'eager' : 'lazy'}
                  wishlist={wishlist}
                  onToggleWishlist={toggleWishlist}
                  isWishlistEnabled={isWishlistEnabled}
                  isLoggedIn={isLoggedIn}
                  onQuickView={openQuickView}
                  activeCountry={activeCountry}
                  activeCurrency={activeCurrency}
                  onCartOpen={open}
                />
              </div>
            );
          })}
        </div>

        {/* Load More Link */}
        {visibleCount < productsToDisplay.length && (
          <div className="flex justify-center animate-in fade-in duration-1000">
            <Link
              to={`/${activeCountry}/collections/all`}
              className="pg-load-more-btn inline-block px-10 py-[15px] border-2 font-bold transition-all duration-300 uppercase text-[14px] text-center tracking-[0.2px] leading-[22px]"
              // style={{
              //   borderColor: buttonColor, 
              //   color: buttonColor,         
              // }}
            >
              {buttonText}
            </Link>
          </div>
        )}
      </div>

      <QuickView
        productHandle={quickViewProductHandle}
        config={quickViewConfig}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
        locale={locale}
        isWishlistEnabled={isWishlistEnabled}
        isLoggedIn={isLoggedIn}
        wishlist={wishlist}
        setWishlist={setWishlist}
        globalData={globalSettingsData || globalSettings}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .product-card-reveal {
          animation: revealUp 0.8s cubic-bezier(0.2, 0.6, 0.3, 1) forwards;
        }
      `,
        }}
      />
    </section>
  );
}

export function CustomProductItem({
  product,
  showQuickView = true,
  loading = 'lazy',
  wishlist,
  onToggleWishlist,
  isWishlistEnabled,
  isLoggedIn,
  onQuickView,
  activeCountry,
  activeCurrency,
  onCartOpen,
  textStyles,
}) {
  const fetcher = useFetcher();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const {toggleWishlist, isInWishlist} = useWishlist();

  const image = product?.featuredImage;
  const price = product?.priceRange?.minVariantPrice;
  const compareAtPrice = product?.compareAtPrice;
  const firstVariant = product?.variants?.nodes?.[0];
  const variantId = firstVariant?.id;
  const isOutOfStock =
    firstVariant &&
    (!firstVariant.availableForSale || firstVariant.quantityAvailable <= 0);
  const currentPriceAmt = price?.amount ? parseFloat(price.amount) : 0;
  const comparePriceAmt = compareAtPrice?.amount
    ? parseFloat(compareAtPrice.amount)
    : 0;
  const hasCompareAtPrice = comparePriceAmt > currentPriceAmt;

  // Look for options, prioritizing Color/Title but preparing to filter them
  // const colorOption = product.options?.find((opt) =>
  //   ['color', 'colour', 'title', 'size', 'material'].includes(
  //     opt.name.toLowerCase(),
  //   ),
  // );
  const variantOption = product.options?.find((opt) =>
    [
      'color',
      'colour',
      'title',
      'size',
      'material',
      'denomination',
      'denominations',
      'amount',
    ].includes(opt.name.toLowerCase()),
  );

  // Filter out "Default Title" so it never shows up
  // const filteredValues =
  //   colorOption?.values?.filter((val) => val !== 'Default Title') || [];

  const optionName = variantOption?.name.toLowerCase() || '';
  const filteredValues =
    variantOption?.values?.filter((val) => val !== 'Default Title') || [];

  // 2. Helper to format currency values for denominations
  // const formatDenomination = (value) => {
  //   // Check if the value is purely numeric (common for Gift Card denominations)
  //   if (!isNaN(value) && value.trim() !== '') {
  //     try {
  //       return new Intl.NumberFormat(undefined, {
  //         style: 'currency',
  //         currency: activeCurrency || 'USD',
  //       }).format(parseFloat(value));
  //     } catch (e) {
  //       return value;
  //     }
  //   }
  //   return value;
  // };

  const formatDenomination = (value) => {
    // Remove any existing currency symbols or commas so we have a clean number
    const numericValue = value.replace(/[^0-9.]/g, '');

    if (numericValue !== '' && !isNaN(numericValue)) {
      try {
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: activeCurrency, // This prop ensures it switches when the state changes
          minimumFractionDigits: 0, // Gift cards often look better without .00
        }).format(parseFloat(numericValue));
      } catch (e) {
        return value;
      }
    }
    return value;
  };

  // Helper to check if a string is likely a color
  // const isColor = (str) => {
  //   const s = str.toLowerCase();
  //   return (
  //     s.startsWith('#') ||
  //     [
  //       'red',
  //       'blue',
  //       'green',
  //       'black',
  //       'white',
  //       'purple',
  //       'olive',
  //       'pink',
  //       'yellow',
  //       'cyan',
  //       'magenta',
  //     ].includes(s)
  //   );
  // };

  const SWATCH_COLORS = {
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

  // Your upgraded isColor function
  const isColor = (str) => {
    if (!str) return false;
    const s = str.toLowerCase().replace(/[\s_-]+/g, '');

    return (
      s.startsWith('#') ||
      s.startsWith('hsl') ||
      s.startsWith('rgb') ||
      SWATCH_COLORS.hasOwnProperty(s)
    );
  };

  // A helper to get the actual value for the style tag
  const getSwatchStyle = (colorName) => {
    const normalized = colorName.toLowerCase().replace(/[\s_-]+/g, '');

    // 1. If it's already a hex/rgb code, use it
    if (colorName.startsWith('#') || colorName.startsWith('rgb'))
      return colorName;

    // 2. If it's in our map, return the hex
    if (SWATCH_COLORS[normalized]) return SWATCH_COLORS[normalized];

    // 3. Fallback: Generate a unique color so it's not just gray
    let hash = 0;
    for (let i = 0; i < colorName.length; i++) {
      hash = colorName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 60%, 55%)`;
  };

  // const isWished = wishlist?.some((item) => {
  //   const vId = product?.variants?.nodes?.[0]?.id;
  //   if (vId && item.variantId) return item.variantId === vId;
  //   const itemId = item.id || item.shopifyGid || item.productId;
  //   const productId = product.id || product.shopifyGid || product.productId;
  //   return itemId === productId;
  // }) || false;

  const isWished = isInWishlist(product.id, variantId);

  useEffect(() => {
    if (fetcher.state === 'idle' && isAddingToCart) {
      setIsAddingToCart(false);
      if (onCartOpen) onCartOpen('cart');
    }
  }, [fetcher.state, isAddingToCart]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variantId || isOutOfStock) return;
    setIsAddingToCart(true);
    fetcher.submit(
      {
        [CartForm.INPUT_NAME]: JSON.stringify({
          action: CartForm.ACTIONS.LinesAdd,
          inputs: {lines: [{merchandiseId: variantId, quantity: 1}]},
        }),
      },
      {method: 'POST', action: '/cart'},
    );
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product.handle, e);
  };

  // const handleWishlistClick = (e) => {
  //   e.preventDefault(); e.stopPropagation();
  //   const vData = { variantId: firstVariant?.id, variantTitle: firstVariant?.title, selectedOptions: firstVariant?.selectedOptions || [] };
  //   onToggleWishlist(product, e, vData);
  // };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      window.location.href = '/signin';
      return;
    }

    // Use the global toggle function instead of the prop
    await toggleWishlist({
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle,
      productImage: image?.url || '',
      productPrice: price?.amount || '0',
      variantId: variantId || null,
      variantTitle: firstVariant?.title || null,
      selectedOptions: firstVariant?.selectedOptions || [],
    });
  };

  if (!product) return null;

  return (
    <div
      className="h-full bg-white rounded hover:shadow-lg transition-all duration-300 overflow-hidden group border border-transparent hover:border-gray-100 h-auto flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={
          activeCountry
            ? `/${activeCountry}/products/${product.handle}`
            : `/products/${product.handle}`
        }
        className="flex flex-col h-auto"
        prefetch="intent"
      >
        <div
          className={`relative overflow-hidden bg-gray-50 flex items-center justify-center w-full aspect-[1/1]`}
        >
          {image ? (
            <Image
              data={image}
              alt={image.altText || product.title}
              loading={loading}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              className={`absolute inset-0 w-full h-full mix-blend-multiply object-contain transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'} ${loaded ? 'blur-0' : 'blur-0'}`}
              onLoad={(e) => {
                setLoaded(true);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          <div
            className={`absolute inset-0 bg-black/40 flex items-end justify-center pb-6 gap-3 transition-all duration-300 md:opacity-0 ${isHovered ? 'md:opacity-100' : 'md:opacity-0'}`}
          >
            {isWishlistEnabled && (
              <button
                onClick={handleWishlistClick}
                onMouseEnter={() => setHoveredIcon('wishlist')}
                onMouseLeave={() => setHoveredIcon(null)}
                className={`bg-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${isWished ? 'text-red-500' : 'text-black'} hover:bg-black`}
                aria-label="Wishlist"
              >
                <WishlistIcon
                  filled={isWished}
                  hovered={hoveredIcon === 'wishlist'}
                />
              </button>
            )}
            <button
              onClick={handleAddToCart}
              onMouseEnter={() => setHoveredIcon('cart')}
              onMouseLeave={() => setHoveredIcon(null)}
              disabled={isAddingToCart || isOutOfStock || !variantId}
              className={`bg-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black ${isAddingToCart || isOutOfStock || !variantId ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAddingToCart ? (
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
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <CartIcon hovered={hoveredIcon === 'cart'} />
              )}
            </button>
            {showQuickView && (
              <button
                onClick={handleQuickViewClick}
                onMouseEnter={() => setHoveredIcon('quick')}
                onMouseLeave={() => setHoveredIcon(null)}
                className="bg-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black"
              >
                <QuickViewIcon hovered={hoveredIcon === 'quick'} />
              </button>
            )}
          </div>
        </div>

        <div className="pt-[25px] px-[25px] pb-[25px] flex flex-col items-center text-center bg-white flex-grow gap-[10px]">
          <h4 className="pg-product-title font-bold text-[#252B42] leading-[20px] md:leading-[24px] tracking-[0.1px] w-full">
            {product.title}
          </h4>
          {/* <span
            className="font-bold text-[#737373] text-[12px] md:text-[14px] leading-[20px] md:leading-[24px] tracking-[0.2px] mb-2 md:mb-3 truncate w-full"
            style={{ fontFamily: textStyles.productTitle.fontFamily }}
          >
            {product.department}
          </span> */}
          {product.department && (
            <span className="pg-product-title font-bold text-[#737373] text-[10px] md:text-[14px] leading-[20px] md:leading-[24px] tracking-[0.2px] mb-2 md:mb-3 truncate w-full">
              {product.department}
            </span>
          )}
          <div className="flex items-center gap-2 justify-center pg-align">
            {hasCompareAtPrice && (
              <span className="text-[#BDBDBD] font-bold text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] tracking-[0.1px]">
                {/* <Money
                  data={{
                    ...compareAtPrice,
                    amount: parseFloat(compareAtPrice.amount).toFixed(2),
                  }}
                /> */}
                <Money
                  data={{
                    amount: compareAtPrice.amount,
                    currencyCode: activeCurrency,
                  }}
                />
              </span>
            )}
            <span className="text-[#23856D] font-bold text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] tracking-[0.1px]">
              {price ? (
                // <Money
                //   data={{ ...price, amount: parseFloat(price.amount).toFixed(2) }}
                // />
                <Money
                  data={{
                    amount: price.amount,
                    currencyCode: activeCurrency, // Force the current active currency
                  }}
                />
              ) : (
                'Price not available'
              )}
            </span>
          </div>

          {/* Variant Options / Color Swatches */}
          {filteredValues.length > 0 && (
            // <div className="flex flex-wrap justify-center gap-1.5 pg-align">
            //   {filteredValues.slice(0, 5).map((value, index) =>
            //     isColor(value) ? (
            //       <div
            //         key={index}
            //         className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border border-gray-200 shadow-sm"
            //         style={{backgroundColor: value.toLowerCase()}}
            //         title={value}
            //       />
            //     ) : (
            //       <span
            //         key={index}
            //         className="px-2 py-0.5 text-[10px] md:text-[11px] bg-[#F3F4F6] text-[#737373] rounded-md font-bold border border-gray-100"
            //       >
            //         {value}
            //       </span>
            //     ),
            //   )}
            //   {filteredValues.length > 5 && (
            //     <span className="text-[10px] md:text-[12px] leading-[16px] text-[#737373] font-bold ml-1">
            //       +{filteredValues.length - 5}
            //     </span>
            //   )}
            // </div>
            <div className="flex flex-wrap justify-center gap-1.5 pg-align">
              {/* {filteredValues.slice(0, 5).map((value, index) => {
                const isColorType = isColor(value) && (optionName.includes('color') || optionName.includes('colour'));

                if (isColorType) {
                  return (
                    <div
                      key={index}
                      className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border border-gray-200 shadow-sm"
                      style={{ backgroundColor: value.toLowerCase() }}
                      title={value}
                    />
                  );
                } else {
                  // 3. Apply the formatting to the text pill
                  const displayValue = (optionName.includes('denomination') || optionName.includes('amount'))
                    ? formatDenomination(value)
                    : value;

                  return (
                    <span
                      key={index}
                      className="px-2 py-0.5 text-[10px] md:text-[11px] bg-[#F3F4F6] text-[#737373] rounded-md font-bold border border-gray-100 whitespace-nowrap"
                    >
                      {displayValue}
                    </span>
                  );
                }
              })} */}

              {filteredValues.slice(0, 5).map((value, index) => {
                // Check if this specific value (e.g., "Navy") is a known color
                const isColorValue = isColor(value);
                const isColorCategory =
                  optionName.includes('color') || optionName.includes('colour');

                // If the category is "Color" OR the value itself is a color name
                if (isColorCategory || isColorValue) {
                  return (
                    <div
                      key={index}
                      className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border border-gray-200 shadow-sm"
                      style={{backgroundColor: getSwatchStyle(value)}}
                      title={value}
                    />
                  );
                } else {
                  // Standard text pill for sizes, etc.
                  const displayValue =
                    optionName.includes('denomination') ||
                    optionName.includes('amount')
                      ? formatDenomination(value)
                      : value;

                  return (
                    <span
                      key={index}
                      className="px-2 py-0.5 text-[10px] md:text-[11px] bg-[#F3F4F6] text-[#737373] rounded-md font-bold border border-gray-100"
                    >
                      {displayValue}
                    </span>
                  );
                }
              })}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

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

const CartIcon = ({hovered}) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill={hovered ? '#ffffff' : '#252B42'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 1.63333C0 1.46536 0.0667281 1.30427 0.185505 1.1855C0.304281 1.06673 0.465377 1 0.633353 1H2.53341C2.67469 1.00004 2.8119 1.04731 2.92322 1.1343C3.03454 1.22129 3.11357 1.34299 3.14776 1.48007L3.66078 3.53333H18.3672C18.4602 3.53342 18.5521 3.55398 18.6362 3.59356C18.7204 3.63315 18.7948 3.69077 18.8541 3.76235C18.9135 3.83393 18.9564 3.9177 18.9797 4.00772C19.0031 4.09774 19.0063 4.19179 18.9892 4.2832L17.0891 14.4165C17.062 14.5617 16.9849 14.6927 16.8714 14.7871C16.7578 14.8815 16.6148 14.9332 16.4672 14.9333H5.06682C4.91917 14.9332 4.7762 14.8815 4.66263 14.7871C4.54906 14.6927 4.47204 14.5617 4.44487 14.4165L2.54608 4.3022L2.0394 2.26667H0.633353C0.465377 2.26667 0.304281 2.19994 0.185505 2.08117C0.0667281 1.96239 0 1.8013 0 1.63333ZM3.92932 4.8L5.59251 13.6667H15.9415L17.6047 4.8H3.92932ZM6.33353 14.9333C5.66163 14.9333 5.01724 15.2002 4.54214 15.6753C4.06703 16.1504 3.80012 16.7948 3.80012 17.4667C3.80012 18.1385 4.06703 18.7829 4.54214 19.258C5.01724 19.7331 5.66163 20 6.33353 20C7.00543 20 7.64981 19.7331 8.12492 19.258C8.60003 18.7829 8.86694 18.1385 8.86694 17.4667C8.86694 16.7948 8.60003 16.1504 8.12492 15.6753C7.64981 15.2002 7.00543 14.9333 6.33353 14.9333ZM15.2005 14.9333C14.5286 14.9333 13.8842 15.2002 13.4091 15.6753C12.934 16.1504 12.6671 16.7948 12.6671 17.4667C12.6671 18.1385 12.934 18.7829 13.4091 19.258C13.8842 19.7331 14.5286 20 15.2005 20C15.8724 20 16.5168 19.7331 16.9919 19.258C17.467 18.7829 17.7339 18.1385 17.7339 17.4667C17.7339 16.7948 17.467 16.1504 16.9919 15.6753C16.5168 15.2002 15.8724 14.9333 15.2005 14.9333ZM6.33353 16.2C6.66948 16.2 6.99167 16.3335 7.22922 16.571C7.46678 16.8085 7.60023 17.1307 7.60023 17.4667C7.60023 17.8026 7.46678 18.1248 7.22922 18.3623C6.99167 18.5999 6.66948 18.7333 6.33353 18.7333C5.99758 18.7333 5.67539 18.5999 5.43783 18.3623C5.20028 18.1248 5.06682 17.8026 5.06682 17.4667C5.06682 17.1307 5.20028 16.8085 5.43783 16.571C5.67539 16.3335 5.99758 16.2 6.33353 16.2ZM15.2005 16.2C15.5364 16.2 15.8586 16.3335 16.0962 16.571C16.3337 16.8085 16.4672 17.1307 16.4672 17.4667C16.4672 17.8026 16.3337 18.1248 16.0962 18.3623C15.8586 18.5999 15.5364 18.7333 15.2005 18.7333C14.8645 18.7333 14.5423 18.5999 14.3048 18.3623C14.0672 18.1248 13.9338 17.8026 13.9338 17.4667C13.9338 17.1307 14.0672 16.8085 14.3048 16.571C14.5423 16.3335 14.8645 16.2 15.2005 16.2Z" />
  </svg>
);

const QuickViewIcon = ({hovered}) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 10 12.5C9.33696 12.5 8.70107 12.2366 8.23223 11.7678C7.76339 11.2989 7.5 10.663 7.5 10C7.5 9.33696 7.76339 8.70107 8.23223 8.23223C8.70107 7.76339 9.33696 7.5 10 7.5C10.663 7.5 11.2989 7.76339 11.7678 8.23223C12.2366 8.70107 12.5 9.33696 12.5 10Z"
      fill="black"
    />
    <path
      d="M2 10C2 10 5 4.5 10 4.5C15 4.5 18 10 18 10C18 10 15 15.5 10 15.5C5 15.5 2 10 2 10ZM10 13.5C10.9283 13.5 11.8185 13.1313 12.4749 12.4749C13.1313 11.8185 13.5 10.9283 13.5 10C13.5 9.07174 13.1313 8.1815 12.4749 7.52513C11.8185 6.86875 10.9283 6.5 10 6.5C9.07174 6.5 8.1815 6.86875 7.52513 7.52513C6.86875 8.1815 6.5 9.07174 6.5 10C6.5 10.9283 6.86875 11.8185 7.52513 12.4749C8.1815 13.1313 9.07174 13.5 10 13.5Z"
      fill={hovered ? '#ffffff' : 'black'}
    />
  </svg>
);
