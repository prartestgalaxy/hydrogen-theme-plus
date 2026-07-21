// import { useEffect, useState, useRef } from 'react';
// import { useLocation, Link, useFetcher } from 'react-router';
// import { useWishlist } from '~/context/WishlistContext';
// import { Image, Money, CartForm } from '@shopify/hydrogen';
// import { useAside } from '~/components/Aside';
// import QuickView from '~/components/QuickView';

// // --- Icons ---
// const ChevronLeft = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
//   </svg>
// );

// const ChevronRight = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
//   </svg>
// );



// function RecProductCard({ 
//   product, 
//   index, 
//   wishlist, 
//   setWishlist, 
//   isWishlistEnabled, 
//   isLoggedIn, 
//   canAddToWishlist, 
//   getHeartColor, 
//   onQuickView, 
//   locale, 
//   onCartOpen,
//   globalData 
// }) {
//   const [isHovered, setIsHovered] = useState(false);
//   const [hoveredIcon, setHoveredIcon] = useState(null);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const fetcher = useFetcher();

//   // Style helpers
//   const formatColor = (color) => {
//     if (!color) return null;
//     return color.startsWith('#') ? color : `#${color}`;
//   };

//   const textColor = formatColor(globalData?.linksEffect?.linkColor) || '#252B42';
//   const labelColor = formatColor(globalData?.linksEffect?.linkColor) || '#737373';
//   const primaryColor = formatColor(globalData?.buttons?.primaryBg) || '#23A6F0';
//   const transitionDuration = globalData?.linksEffect?.transitionDuration || 300;
//   const buttonRadius = globalData?.buttons?.borderRadius || 8; // Get button radius

//   const variants = product?.variants?.nodes || [];
//   const selectedVariant = variants[0];
//   const image = product.featuredImage;
  
//   const isWished = wishlist?.some(item => {
//     const productId = product.id.split('/').pop();
//     const itemNumericId = item.id?.match(/\d+/)?.[0] || item.productId?.match(/\d+/)?.[0];
//     return itemNumericId === productId;
//   });

//   useEffect(() => {
//     if (fetcher.state === 'idle' && isAddingToCart) {
//       setIsAddingToCart(false);
//       if (fetcher.data?.cart && onCartOpen) onCartOpen('cart');
//     }
//   }, [fetcher.state, isAddingToCart, fetcher.data]);

//   const handleAddToCart = (e) => {
//     e.preventDefault(); e.stopPropagation();
//     if (!selectedVariant?.id) return;
//     setIsAddingToCart(true);
//     fetcher.submit(
//       { [CartForm.INPUT_NAME]: JSON.stringify({ action: CartForm.ACTIONS.LinesAdd, inputs: { lines: [{ merchandiseId: selectedVariant.id, quantity: 1 }] } }) },
//       { method: 'POST', action: '/cart' }
//     );
//   };

//   const toggleWishlist = async (e) => {
//     e.preventDefault(); e.stopPropagation();
//     if (!canAddToWishlist(isLoggedIn)) { window.location.href = '/signin'; return; }
//     try {
//       const res = await fetch('/api/wishlist', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           productId: product.id,
//           productTitle: product.title,
//           productHandle: product.handle,
//           productImage: image?.url || '',
//           productPrice: selectedVariant?.price?.amount || product.priceRange?.minVariantPrice?.amount,
//           variantId: selectedVariant?.id,
//           action: 'toggle'
//         })
//       });
//       const data = await res.json();
//       if (data.success) setWishlist(data.wishlist);
//     } catch (err) { console.error(err); }
//   };

//   return (
//     <div
//       className="group relative bg-white rounded-lg transition-all duration-300 h-full"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{ transition: `all ${transitionDuration}ms ease` }}
//     >
//       <Link to={`/products/${product.handle}`} className="block h-full">
//         <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-4">
//           {image ? (
//             <Image
//               data={image}
//               className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
//               sizes="280px"
//               style={{ transition: `transform ${transitionDuration}ms ease` }}
//             />
//           ) : (
//             <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
//           )}

//           {/* Hover Buttons - NOW WITH DYNAMIC BORDER RADIUS */}
//           <div className={`absolute inset-0 bg-black/20 flex items-end justify-center pb-4 gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
//             {isWishlistEnabled && (
//               <button 
//                 onClick={toggleWishlist} 
//                 onMouseEnter={() => setHoveredIcon('wish')} 
//                 onMouseLeave={() => setHoveredIcon(null)} 
//                 className="bg-white w-10 h-10 flex items-center justify-center hover:bg-black group/btn transition-colors"
//                 style={{ 
//                   transition: `all ${transitionDuration}ms ease`,
//                   borderRadius: `${buttonRadius}px`, // Apply dynamic border radius
//                   overflow: 'hidden' // Ensures the radius clips the content
//                 }}
//               >
//                 <HeartIconPlp filled={isWished} hovered={hoveredIcon === 'wish'} />
//               </button>
//             )}
//             <button 
//               onClick={handleAddToCart} 
//               onMouseEnter={() => setHoveredIcon('cart')} 
//               onMouseLeave={() => setHoveredIcon(null)} 
//               className="bg-white w-10 h-10 flex items-center justify-center hover:bg-black group/btn transition-colors"
//               style={{ 
//                 transition: `all ${transitionDuration}ms ease`,
//                 borderRadius: `${buttonRadius}px`, // Apply dynamic border radius
//                 overflow: 'hidden'
//               }}
//             >
//               {isAddingToCart ? <div className="w-4 h-4 border-2 border-t-transparent border-black group-hover/btn:border-white rounded-full animate-spin" /> : <CartIconPlp hovered={hoveredIcon === 'cart'} />}
//             </button>
//             <button 
//               onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(product.handle, selectedVariant, e) }} 
//               onMouseEnter={() => setHoveredIcon('quick')} 
//               onMouseLeave={() => setHoveredIcon(null)} 
//               className="bg-white w-10 h-10 flex items-center justify-center hover:bg-black group/btn transition-colors"
//               style={{ 
//                 transition: `all ${transitionDuration}ms ease`,
//                 borderRadius: `${buttonRadius}px`, // Apply dynamic border radius
//                 overflow: 'hidden'
//               }}
//             >
//               <QuickViewIconPlp hovered={hoveredIcon === 'quick'} />
//             </button>
//           </div>
//         </div>

//         <div className="text-center space-y-1">
//           <h3 className="text-sm font-bold truncate px-2" style={{ color: textColor }}>
//             {product.title}
//           </h3>
//           <div className="text-sm" style={{ color: labelColor }}>
//             <Money data={selectedVariant?.price || product.priceRange.minVariantPrice} />
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// }

// // // Icons (Same as your Recently Viewed)
// function HeartIconPlp({ filled, hovered }) {
//   return (
//     <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//       <path d="M14.031 2.8125H14.032C14.6118 2.81271 15.1858 2.92807 15.7205 3.15234C16.2552 3.37666 16.7398 3.70554 17.1462 4.11914C17.9751 4.96296 18.4392 6.09841 18.4392 7.28125C18.4392 8.46409 17.9751 9.59954 17.1462 10.4434L9.99976 17.6797L2.85425 10.4434C2.0255 9.59956 1.56128 8.46398 1.56128 7.28125C1.56128 6.09852 2.0255 4.96294 2.85425 4.11914C3.26082 3.70576 3.74625 3.37743 4.28101 3.15332C4.81567 2.9293 5.38978 2.81348 5.96948 2.81348C6.54921 2.81351 7.12329 2.92925 7.65796 3.15332C8.19262 3.37741 8.67722 3.70584 9.08374 4.11914L9.08472 4.12012L9.77808 4.82031L10.0007 5.04395L10.2224 4.82031L10.9158 4.12012L10.9177 4.11914C11.3237 3.70511 11.8078 3.37568 12.3425 3.15137C12.8771 2.92711 13.4513 2.81207 14.031 2.8125Z"
//         fill={filled ? "#EF4444" : "transparent"}
//         stroke={filled ? "#EF4444" : hovered ? "#ffffff" : "#252B42"}
//         strokeWidth="1.5"
//       />
//     </svg>
//   );
// }

// // function CartIconPlp({ hovered }) {
// //   return (
// //     <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
// //       <path d="M0 1.63333C0 1.46536 0.0667281 1.30427 0.185505 1.1855C0.304281 1.06673 0.465377 1 0.633353 1H2.53341C2.67469 1.00004 2.8119 1.04731 2.92322 1.1343C3.03454 1.22129 3.11357 1.34299 3.14776 1.48007L3.66078 3.53333H18.3672C18.4602 3.53342 18.5521 3.55398 18.6362 3.59356C18.7204 3.63315 18.7948 3.69077 18.8541 3.76235C18.9135 3.83393 18.9564 3.9177 18.9797 4.00772C19.0031 4.09774 19.0063 4.19179 18.9892 4.2832L17.0891 14.4165C17.062 14.5617 16.9849 14.6927 16.8714 14.7871C16.7578 14.8815 16.6148 14.9332 16.4672 14.9333H5.06682C4.44487 14.4165L2.54608 4.3022L2.0394 2.26667H0.633353C0.465377 2.26667 0.304281 2.19994 0.185505 2.08117C0.0667281 1.96239 0 1.8013 0 1.63333Z" fill={hovered ? "#ffffff" : "#252B42"} />
// //       <circle cx="6.33" cy="17.46" r="1.2" fill={hovered ? "#ffffff" : "#252B42"} />
// //       <circle cx="15.2" cy="17.46" r="1.2" fill={hovered ? "#ffffff" : "#252B42"} />
// //     </svg>
// //   );
// // }

// const CartIconPlp = ({ hovered }) => (
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

// function QuickViewIconPlp({ hovered }) {
//   return (
//     <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61929 12.5 7.5 11.3807 7.5 10C7.5 8.61929 8.61929 7.5 10 7.5C11.3807 7.5 12.5 8.61929 12.5 10Z" fill={hovered ? "#ffffff" : "black"} />
//       <path d="M2 10C2 10 5 4.5 10 4.5C15 4.5 18 10 18 10C18 10 15 15.5 10 15.5C5 15.5 2 10 2 10ZM10 13.5C11.933 13.5 13.5 11.933 13.5 10C13.5 8.067 11.933 6.5 10 6.5C8.067 6.5 6.5 8.067 6.5 10C6.5 11.933 8.067 13.5 10 13.5Z" fill={hovered ? "#ffffff" : "black"} />
//     </svg>
//   );
// }
// // Recommendations.jsx
// export function Recommendations({ 
//   products = [], 
//   settings,
//   locale,
//   title,
//   isLoggedIn,
//   isWishlistEnabled,
//   wishlist: initialWishlist = [],
//   onWishlistUpdate,
//   quickViewConfig,
//   globalData  // Add this prop
// }) {
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);
//   const [wishlist, setWishlist] = useState(initialWishlist);

//   // Quick View State
//   const [quickViewProductHandle, setQuickViewProductHandle] = useState(null);
//   const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

//   const { open } = useAside();
//   const carouselRef = useRef(null);
//   const { getHeartColor, canAddToWishlist } = useWishlist();

//   // Style helpers using global data
//   const formatColor = (color) => {
//     if (!color) return null;
//     return color.startsWith('#') ? color : `#${color}`;
//   };

//   const textColor = formatColor(globalData?.linksEffect?.linkColor) || '#252B42';
//   const labelColor = formatColor(globalData?.linksEffect?.linkColor) || '#737373';
//   const primaryColor = formatColor(globalData?.buttons?.primaryBg) || '#23A6F0';
//   const fontFamily = globalData?.fontFamily || 'Montserrat, sans-serif';

//   const {
//     enabled = true,
//     sectionTitle: sanityHeading = 'Recommended For You',
//     layout: sanityLayout = 'carousel',
//     productsLimit = 4,
//   } = settings ?? {};

//   const heading = title || sanityHeading;
//   const layout = sanityLayout === 'grid' ? 'grid' : 'carousel';
//   const displayProducts = products.slice(0, productsLimit);

//   useEffect(() => { setWishlist(initialWishlist); }, [initialWishlist]);

//   const openQuickView = (handle, variant, e) => {
//     setQuickViewProductHandle(handle);
//     setIsQuickViewOpen(true);
//   };

//   const scrollCarousel = (direction) => {
//     if (!carouselRef.current) return;
//     const container = carouselRef.current;
//     const itemWidth = container.firstElementChild?.getBoundingClientRect().width || 200;
//     const scrollAmount = itemWidth + 24;
//     container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
//   };

//   const checkScrollability = () => {
//     if (carouselRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
//       setCanScrollLeft(scrollLeft > 0);
//       setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
//     }
//   };

//   useEffect(() => {
//     if (layout === 'carousel') {
//       const container = carouselRef.current;
//       if (container) {
//         container.addEventListener('scroll', checkScrollability);
//         window.addEventListener('resize', checkScrollability);
//         checkScrollability();
//         const timeout = setTimeout(checkScrollability, 500);
//         return () => {
//           container.removeEventListener('scroll', checkScrollability);
//           window.removeEventListener('resize', checkScrollability);
//           clearTimeout(timeout);
//         };
//       }
//     }
//   }, [displayProducts, layout]);

//   if (!enabled || displayProducts.length === 0) return null;

//   return (
//     <section 
//       className="py-12 border-t border-gray-200 mt-10 overflow-hidden"
//       style={{ fontFamily }}
//     >
//       <div className="max-w-[100%] mx-auto px-[7%]">
        
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider" style={{ color: textColor }}>
//             {heading}
//           </h2>
//           {layout === 'carousel' && displayProducts.length > 1 && (
//             <div className="flex gap-2">
//               <button 
//                 onClick={() => scrollCarousel('left')} 
//                 disabled={!canScrollLeft} 
//                 className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-30 transition-all hover:bg-black hover:text-white"
//                 style={{ borderColor: labelColor }}
//               >
//                 <ChevronLeft />
//               </button>
//               <button 
//                 onClick={() => scrollCarousel('right')} 
//                 disabled={!canScrollRight} 
//                 className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-30 transition-all hover:bg-black hover:text-white"
//                 style={{ borderColor: labelColor }}
//               >
//                 <ChevronRight />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* 1. GRID LAYOUT */}
//         {layout === 'grid' && (
//           <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
//             {displayProducts.map((product, index) => (
//               <RecProductCard
//                 key={product.id}
//                 product={product}
//                 index={index}
//                 wishlist={wishlist}
//                 setWishlist={(newW) => { setWishlist(newW); if (onWishlistUpdate) onWishlistUpdate(newW); }}
//                 isWishlistEnabled={isWishlistEnabled}
//                 isLoggedIn={isLoggedIn}
//                 canAddToWishlist={canAddToWishlist}
//                 getHeartColor={getHeartColor}
//                 onQuickView={openQuickView}
//                 locale={locale}
//                 onCartOpen={open}
//                 globalData={globalData}  // Pass to card
//               />
//             ))}
//           </div>
//         )}

//         {/* 2. CAROUSEL LAYOUT */}
//         {layout === 'carousel' && (
//           <div className="relative -mx-4 sm:mx-0">
//             <div
//               ref={carouselRef}
//               className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 sm:px-0 scrollbar-hide pb-4"
//               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//             >
//               {displayProducts.map((product, index) => (
//                 <div key={product.id} className="snap-start shrink-0 flex-none w-[280px]">
//                   <RecProductCard
//                     product={product}
//                     index={index}
//                     wishlist={wishlist}
//                     setWishlist={(newW) => { setWishlist(newW); if (onWishlistUpdate) onWishlistUpdate(newW); }}
//                     isWishlistEnabled={isWishlistEnabled}
//                     isLoggedIn={isLoggedIn}
//                     canAddToWishlist={canAddToWishlist}
//                     getHeartColor={getHeartColor}
//                     onQuickView={openQuickView}
//                     locale={locale}
//                     onCartOpen={open}
//                     globalData={globalData}  // Pass to card
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <QuickView
//         productHandle={quickViewProductHandle}
//         config={quickViewConfig}
//         isOpen={isQuickViewOpen}
//         onClose={() => setIsQuickViewOpen(false)}
//         locale={locale}
//         isWishlistEnabled={isWishlistEnabled}
//         isLoggedIn={isLoggedIn}
//         wishlist={wishlist}
//         setWishlist={setWishlist}
//         globalData={globalData}  // Pass to QuickView if needed
//       />
//     </section>
//   );
// }
import { useEffect, useState, useRef } from 'react';
import { useLocation, Link, useFetcher } from 'react-router';
import { useWishlist } from '~/context/WishlistContext';
import { Image, Money, CartForm } from '@shopify/hydrogen';
import { useAside } from '~/components/Aside';
import QuickView from '~/components/QuickView';

// --- Icons ---
const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

// ✅ Updated RecProductCard with Wishlist Context
function RecProductCard({ 
  product, 
  index, 
  isWishlistEnabled, 
  isLoggedIn, 
  onQuickView, 
  locale, 
  onCartOpen,
  globalData 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false); // ✅ Local loading state
  const fetcher = useFetcher();
  
  // ✅ Use wishlist context
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Style helpers
  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const textColor = formatColor(globalData?.linksEffect?.linkColor) || '#252B42';
  const labelColor = formatColor(globalData?.linksEffect?.linkColor) || '#737373';
  const primaryColor = formatColor(globalData?.buttons?.primaryBg) || '#23A6F0';
  const transitionDuration = globalData?.linksEffect?.transitionDuration || 300;
  const buttonRadius = globalData?.buttons?.borderRadius || 8;

  const variants = product?.variants?.nodes || [];
  const selectedVariant = variants[0];
  const image = product.featuredImage;
  
  // ✅ Use context's isInWishlist function
  const isWished = isInWishlist(product.id, selectedVariant?.id);

  useEffect(() => {
    if (fetcher.state === 'idle' && isAddingToCart) {
      setIsAddingToCart(false);
      if (fetcher.data?.cart && onCartOpen) onCartOpen('cart');
    }
  }, [fetcher.state, isAddingToCart, fetcher.data]);

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (!selectedVariant?.id) return;
    setIsAddingToCart(true);
    fetcher.submit(
      { [CartForm.INPUT_NAME]: JSON.stringify({ action: CartForm.ACTIONS.LinesAdd, inputs: { lines: [{ merchandiseId: selectedVariant.id, quantity: 1 }] } }) },
      { method: 'POST', action: '/cart' }
    );
  };

  // ✅ Updated toggleWishlist using context
  const handleToggleWishlist = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (!isLoggedIn) { 
      window.location.href = '/signin'; 
      return; 
    }
    
    if (!isWishlistEnabled) {
      alert("Wishlist is currently disabled");
      return;
    }
    
    setIsLoadingWishlist(true);
    
    const result = await toggleWishlist({
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle,
      productImage: image?.url || '',
      productPrice: selectedVariant?.price?.amount || product.priceRange?.minVariantPrice?.amount || '0',
      variantId: selectedVariant?.id || null,
      variantTitle: selectedVariant?.title || null,
      selectedOptions: selectedVariant?.selectedOptions || [],
    });
    
    setIsLoadingWishlist(false);
    
    if (!result.success && result.requiresLogin) {
      window.location.href = '/signin';
    } else if (!result.success && result.error) {
      alert(result.error);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-lg transition-all duration-300 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transition: `all ${transitionDuration}ms ease` }}
    >
      <Link to={`/${locale?.country || 'us'}/products/${product.handle}`} className="block h-full">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-4">
          {image ? (
            <Image
              data={image}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
              sizes="280px"
              style={{ transition: `transform ${transitionDuration}ms ease` }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
          )}

          {/* Hover Buttons - WITH LOCAL LOADING STATE */}
          <div className={`absolute inset-0 bg-black/20 flex items-end justify-center pb-4 gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            {isWishlistEnabled && (
              <button 
                onClick={handleToggleWishlist} 
                onMouseEnter={() => setHoveredIcon('wish')} 
                onMouseLeave={() => setHoveredIcon(null)} 
                disabled={isLoadingWishlist}
                className="bg-white w-10 h-10 flex items-center justify-center hover:bg-black group/btn transition-colors disabled:opacity-50"
                style={{ 
                  transition: `all ${transitionDuration}ms ease`,
                  borderRadius: `100%`,
                  overflow: 'hidden'
                }}
              >
                {isLoadingWishlist ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <HeartIconPlp filled={isWished} hovered={hoveredIcon === 'wish'} />
                )}
              </button>
            )}
            <button 
              onClick={handleAddToCart} 
              onMouseEnter={() => setHoveredIcon('cart')} 
              onMouseLeave={() => setHoveredIcon(null)} 
              className="bg-white w-10 h-10 flex items-center justify-center hover:bg-black group/btn transition-colors"
              style={{ 
                transition: `all ${transitionDuration}ms ease`,
                borderRadius: `100%`,
                overflow: 'hidden'
              }}
            >
              {isAddingToCart ? <div className="w-4 h-4 border-2 border-t-transparent border-black group-hover/btn:border-white rounded-full animate-spin" /> : <CartIconPlp hovered={hoveredIcon === 'cart'} />}
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(product.handle, selectedVariant, e); }} 
              onMouseEnter={() => setHoveredIcon('quick')} 
              onMouseLeave={() => setHoveredIcon(null)} 
              className="bg-white w-10 h-10 flex items-center justify-center hover:bg-black group/btn transition-colors"
              style={{ 
                transition: `all ${transitionDuration}ms ease`,
                borderRadius: `100%`,
                overflow: 'hidden'
              }}
            >
              <QuickViewIconPlp hovered={hoveredIcon === 'quick'} />
            </button>
          </div>
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold truncate px-2" style={{ color: textColor }}>
            {product.title}
          </h3>
          <div className="text-sm" style={{ color: labelColor }}>
            <Money data={selectedVariant?.price || product.priceRange.minVariantPrice} />
          </div>
        </div>
      </Link>
    </div>
  );
}

// Icons
function HeartIconPlp({ filled, hovered }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M14.031 2.8125H14.032C14.6118 2.81271 15.1858 2.92807 15.7205 3.15234C16.2552 3.37666 16.7398 3.70554 17.1462 4.11914C17.9751 4.96296 18.4392 6.09841 18.4392 7.28125C18.4392 8.46409 17.9751 9.59954 17.1462 10.4434L9.99976 17.6797L2.85425 10.4434C2.0255 9.59956 1.56128 8.46398 1.56128 7.28125C1.56128 6.09852 2.0255 4.96294 2.85425 4.11914C3.26082 3.70576 3.74625 3.37743 4.28101 3.15332C4.81567 2.9293 5.38978 2.81348 5.96948 2.81348C6.54921 2.81351 7.12329 2.92925 7.65796 3.15332C8.19262 3.37741 8.67722 3.70584 9.08374 4.11914L9.08472 4.12012L9.77808 4.82031L10.0007 5.04395L10.2224 4.82031L10.9158 4.12012L10.9177 4.11914C11.3237 3.70511 11.8078 3.37568 12.3425 3.15137C12.8771 2.92711 13.4513 2.81207 14.031 2.8125Z"
        fill={filled ? "#EF4444" : "transparent"}
        stroke={filled ? "#EF4444" : hovered ? "#ffffff" : "#252B42"}
        strokeWidth="1.5"
      />
    </svg>
  );
}

const CartIconPlp = ({ hovered }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill={hovered ? "#ffffff" : "#252B42"}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 1.63333C0 1.46536 0.0667281 1.30427 0.185505 1.1855C0.304281 1.06673 0.465377 1 0.633353 1H2.53341C2.67469 1.00004 2.8119 1.04731 2.92322 1.1343C3.03454 1.22129 3.11357 1.34299 3.14776 1.48007L3.66078 3.53333H18.3672C18.4602 3.53342 18.5521 3.55398 18.6362 3.59356C18.7204 3.63315 18.7948 3.69077 18.8541 3.76235C18.9135 3.83393 18.9564 3.9177 18.9797 4.00772C19.0031 4.09774 19.0063 4.19179 18.9892 4.2832L17.0891 14.4165C17.062 14.5617 16.9849 14.6927 16.8714 14.7871C16.7578 14.8815 16.6148 14.9332 16.4672 14.9333H5.06682C4.91917 14.9332 4.7762 14.8815 4.66263 14.7871C4.54906 14.6927 4.47204 14.5617 4.44487 14.4165L2.54608 4.3022L2.0394 2.26667H0.633353C0.465377 2.26667 0.304281 2.19994 0.185505 2.08117C0.0667281 1.96239 0 1.8013 0 1.63333ZM3.92932 4.8L5.59251 13.6667H15.9415L17.6047 4.8H3.92932ZM6.33353 14.9333C5.66163 14.9333 5.01724 15.2002 4.54214 15.6753C4.06703 16.1504 3.80012 16.7948 3.80012 17.4667C3.80012 18.1385 4.06703 18.7829 4.54214 19.258C5.01724 19.7331 5.66163 20 6.33353 20C7.00543 20 7.64981 19.7331 8.12492 19.258C8.60003 18.7829 8.86694 18.1385 8.86694 17.4667C8.86694 16.7948 8.60003 16.1504 8.12492 15.6753C7.64981 15.2002 7.00543 14.9333 6.33353 14.9333ZM15.2005 14.9333C14.5286 14.9333 13.8842 15.2002 13.4091 15.6753C12.934 16.1504 12.6671 16.7948 12.6671 17.4667C12.6671 18.1385 12.934 18.7829 13.4091 19.258C13.8842 19.7331 14.5286 20 15.2005 20C15.8724 20 16.5168 19.7331 16.9919 19.258C17.467 18.7829 17.7339 18.1385 17.7339 17.4667C17.7339 16.7948 17.467 16.1504 16.9919 15.6753C16.5168 15.2002 15.8724 14.9333 15.2005 14.9333ZM6.33353 16.2C6.66948 16.2 6.99167 16.3335 7.22922 16.571C7.46678 16.8085 7.60023 17.1307 7.60023 17.4667C7.60023 17.8026 7.46678 18.1248 7.22922 18.3623C6.99167 18.5999 6.66948 18.7333 6.33353 18.7333C5.99758 18.7333 5.67539 18.5999 5.43783 18.3623C5.20028 18.1248 5.06682 17.8026 5.06682 17.4667C5.06682 17.1307 5.20028 16.8085 5.43783 16.571C5.67539 16.3335 5.99758 16.2 6.33353 16.2ZM15.2005 16.2C15.5364 16.2 15.8586 16.3335 16.0962 16.571C16.3337 16.8085 16.4672 17.1307 16.4672 17.4667C16.4672 17.8026 16.3337 18.1248 16.0962 18.3623C15.8586 18.5999 15.5364 18.7333 15.2005 18.7333C14.8645 18.7333 14.5423 18.5999 14.3048 18.3623C14.0672 18.1248 13.9338 17.8026 13.9338 17.4667C13.9338 17.1307 14.0672 16.8085 14.3048 16.571C14.5423 16.3335 14.8645 16.2 15.2005 16.2Z" />
  </svg>
);

function QuickViewIconPlp({ hovered }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61929 12.5 7.5 11.3807 7.5 10C7.5 8.61929 8.61929 7.5 10 7.5C11.3807 7.5 12.5 8.61929 12.5 10Z" fill={hovered ? "#ffffff" : "black"} />
      <path d="M2 10C2 10 5 4.5 10 4.5C15 4.5 18 10 18 10C18 10 15 15.5 10 15.5C5 15.5 2 10 2 10ZM10 13.5C11.933 13.5 13.5 11.933 13.5 10C13.5 8.067 11.933 6.5 10 6.5C8.067 6.5 6.5 8.067 6.5 10C6.5 11.933 8.067 13.5 10 13.5Z" fill={hovered ? "#ffffff" : "black"} />
    </svg>
  );
}

// ✅ Updated Recommendations Component with Wishlist Context
export function Recommendations({ 
  products = [], 
  settings,
  locale,
  title,
  isLoggedIn,
  isWishlistEnabled,
  quickViewConfig,
  globalData
}) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Quick View State
  const [quickViewProductHandle, setQuickViewProductHandle] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const { open } = useAside();
  
  // ✅ Use wishlist context
  const { wishlist, setWishlist } = useWishlist();

  // Style helpers using global data
  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const textColor = formatColor(globalData?.linksEffect?.linkColor) || '#252B42';
  const labelColor = formatColor(globalData?.linksEffect?.linkColor) || '#737373';
  const fontFamily = globalData?.fontFamily || 'Montserrat, sans-serif';

  const {
    enabled = true,
    sectionTitle: sanityHeading = 'Recommended For You',
    layout: sanityLayout = 'carousel',
    productsLimit = 4,
  } = settings ?? {};

  const heading = title || sanityHeading;
  const layout = sanityLayout === 'grid' ? 'grid' : 'carousel';
  const displayProducts = products.slice(0, productsLimit);

  const openQuickView = (handle, variant, e) => {
    setQuickViewProductHandle(handle);
    setIsQuickViewOpen(true);
  };

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const itemWidth = container.firstElementChild?.getBoundingClientRect().width || 200;
    const scrollAmount = itemWidth + 24;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
    }
  };

  const carouselRef = useRef(null);

  useEffect(() => {
    if (layout === 'carousel') {
      const container = carouselRef.current;
      if (container) {
        container.addEventListener('scroll', checkScrollability);
        window.addEventListener('resize', checkScrollability);
        checkScrollability();
        const timeout = setTimeout(checkScrollability, 500);
        return () => {
          container.removeEventListener('scroll', checkScrollability);
          window.removeEventListener('resize', checkScrollability);
          clearTimeout(timeout);
        };
      }
    }
  }, [displayProducts, layout]);

  if (!enabled || displayProducts.length === 0) return null;

  return (
    <section 
      className="py-12 border-t border-gray-200 mt-10 overflow-hidden"
      style={{ fontFamily }}
    >
      <div className="max-w-[100%] mx-auto px-[7%]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider" style={{ color: textColor }}>
            {heading}
          </h2>
          {layout === 'carousel' && displayProducts.length > 1 && (
            <div className="flex gap-2">
              <button 
                onClick={() => scrollCarousel('left')} 
                disabled={!canScrollLeft} 
                className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-30 transition-all hover:bg-black hover:text-white"
                style={{ borderColor: labelColor }}
              >
                <ChevronLeft />
              </button>
              <button 
                onClick={() => scrollCarousel('right')} 
                disabled={!canScrollRight} 
                className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-30 transition-all hover:bg-black hover:text-white"
                style={{ borderColor: labelColor }}
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </div>

        {/* 1. GRID LAYOUT */}
        {layout === 'grid' && (
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            {displayProducts.map((product, index) => (
              <RecProductCard
                key={product.id}
                product={product}
                index={index}
                isWishlistEnabled={isWishlistEnabled}
                isLoggedIn={isLoggedIn}
                onQuickView={openQuickView}
                locale={locale}
                onCartOpen={open}
                globalData={globalData}
              />
            ))}
          </div>
        )}

        {/* 2. CAROUSEL LAYOUT */}
        {layout === 'carousel' && (
          <div className="relative -mx-4 sm:mx-0">
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 sm:px-0 scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayProducts.map((product, index) => (
                <div key={product.id} className="snap-start shrink-0 flex-none w-[280px]">
                  <RecProductCard
                    product={product}
                    index={index}
                    isWishlistEnabled={isWishlistEnabled}
                    isLoggedIn={isLoggedIn}
                    onQuickView={openQuickView}
                    locale={locale}
                    onCartOpen={open}
                    globalData={globalData}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <QuickView
        productHandle={quickViewProductHandle}
        config={quickViewConfig}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        locale={locale}
        isWishlistEnabled={isWishlistEnabled}
        isLoggedIn={isLoggedIn}
        wishlist={wishlist}
        setWishlist={setWishlist}
        globalData={globalData}
      />
    </section>
  );
}