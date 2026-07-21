// // import {useNavigate} from 'react-router';
// // import { useState, useEffect, useRef, useCallback } from 'react';
// // import {Money} from '@shopify/hydrogen';
// // import {AddToCartButton} from './AddToCartButton';
// // import {useAside} from './Aside';

// // /**
// //  * @param {{
// //  * productOptions: MappedProductOptions[];
// //  * selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
// //  * product?: ProductFragment;
// //  * isWishlistEnabled?: boolean;
// //  * isLoggedIn?: boolean;
// //  * isInWishlist?: boolean;
// //  * onWishlistToggle?: (selectedVariant) => void;
// //  * isLoading?: boolean;
// //  * }}
// //  */
// // export function ProductForm({
// //   productOptions = [],
// //   selectedVariant,
// //   product,
// //   isWishlistEnabled = false,
// //   isLoggedIn = false,
// //   isInWishlist = false,  // Now just a prop, no internal state
// //   onWishlistToggle,
// //   isLoading = false,
// // }) {
// //   const navigate = useNavigate();
// //   const {open} = useAside();
// //   const [optimisticSelections, setOptimisticSelections] = useState({});
// //   const navigatingRef = useRef(false);

// //   // Filter out the default 'Title' option
// //   const filteredOptions = (productOptions || []).filter(
// //     (option) => !(option.name === 'Title' && option.optionValues.length === 1),
// //   );

// //   // Just call parent handler - no internal state management
// //   const handleWishlistClick = () => {
// //     if (!isLoggedIn) {
// //       window.location.href = '/signin';
// //       return;
// //     }

// //     if (onWishlistToggle && selectedVariant) {
// //       onWishlistToggle(selectedVariant);
// //     }
// //   };

// //   // Optimistic UI + debounce guard
// //   const handleOptionClick = useCallback(
// //     (e, optionName, valueName, isDifferentProduct, productHandle) => {
// //       e.preventDefault();

// //       if (navigatingRef.current) return;
// //       navigatingRef.current = true;

// //       setOptimisticSelections((prev) => ({...prev, [optionName]: valueName}));

// //       const params = new URLSearchParams(window.location.search);
// //       params.set(optionName, valueName);

// //       const newQueryString = `?${params.toString()}`;
// //       const targetPath = isDifferentProduct
// //         ? `/products/${productHandle}${newQueryString}`
// //         : `${window.location.pathname}${newQueryString}`;

// //       navigate(targetPath, {
// //         replace: true,
// //         preventScrollReset: true,
// //       });

// //       setTimeout(() => {
// //         navigatingRef.current = false;
// //       }, 300);
// //     },
// //     [navigate],
// //   );

// //   const isOptimisticallySelected = (optionName, valueName, originalSelected) => {
// //     if (optimisticSelections[optionName] !== undefined) {
// //       return optimisticSelections[optionName] === valueName;
// //     }
// //     return originalSelected;
// //   };

// //   const isButtonDisabled = isLoading || !selectedVariant || !selectedVariant.availableForSale;

// //   // Render simple UI if no options exist
// //   if (filteredOptions.length === 0) {
// //     return (
// //       <div className="product-form">
// //         {product && (product.descriptionHtml || product.description) && (
// //           <div className="mb-8">
// //             {product.descriptionHtml ? (
// //               <div
// //                 className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none"
// //                 dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
// //               />
// //             ) : (
// //               <p className="text-gray-700 text-sm leading-relaxed">
// //                 {product.description}
// //               </p>
// //             )}
// //           </div>
// //         )}
// //         <div className="flex items-center gap-4 mt-4">
// //           <AddToCartButton
// //             disabled={!selectedVariant || !selectedVariant.availableForSale}
// //             onClick={() => open('cart')}
// //             lines={
// //               selectedVariant
// //                 ? [{merchandiseId: selectedVariant.id, quantity: 1, selectedVariant}]
// //                 : []
// //             }
// //             className="flex-1 bg-[#23A6F0] text-white py-4 px-6 rounded text-sm font-bold hover:bg-[#1a7ab0] active:scale-95 transition-all uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
// //           >
// //             {selectedVariant?.availableForSale ? 'ADD TO CART' : 'SOLD OUT'}
// //           </AddToCartButton>

// //           {isWishlistEnabled && selectedVariant && (
// //             <button
// //               onClick={handleWishlistClick}
// //               disabled={isButtonDisabled}
// //               className={`p-4 rounded border border-gray-200 transition-all duration-200 ${
// //                 isButtonDisabled
// //                   ? 'opacity-50 cursor-not-allowed'
// //                   : 'hover:border-[#23A6F0] hover:shadow-md active:scale-95'
// //               }`}
// //               aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
// //             >
// //               <HeartIcon filled={isInWishlist} />
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="product-form space-y-6">
// //       {/* Product Description */}
// //       {product && (product.descriptionHtml || product.description) && (
// //         <div className="mb-8">
// //           {product.descriptionHtml ? (
// //             <div
// //               className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none"
// //               dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
// //             />
// //           ) : (
// //             <p className="text-gray-700 text-sm leading-relaxed">
// //               {product.description}
// //             </p>
// //           )}
// //         </div>
// //       )}

// //       {/* Product Options Loop */}
// //       {filteredOptions.map((option) => {
// //         return (
// //           <div className="product-options" key={option.name}>
// //             <h5 className="text-sm font-medium text-gray-900 mb-3">
// //               {option.name}
// //             </h5>
// //             <div className="flex flex-wrap gap-3 flex-row">
// //               {option.optionValues.map((value) => {
// //                 const {
// //                   name,
// //                   handle,
// //                   available,
// //                   exists,
// //                   isDifferentProduct,
// //                   swatch,
// //                   firstSelectableVariant,
// //                   selected: originalSelected,
// //                 } = value;

// //                 const selected = isOptimisticallySelected(
// //                   option.name,
// //                   name,
// //                   originalSelected,
// //                 );

// //                 const isMoneyOption =
// //                   option.name.toLowerCase().includes('denomination') ||
// //                   option.name.toLowerCase().includes('amount') ||
// //                   option.name.toLowerCase().includes('value');

// //                 const localizedPrice = firstSelectableVariant?.price;

// //                 // COLOR SWATCH UI
// //                 if (swatch?.color || swatch?.image) {
// //                   const swatchContent = (
// //                     <div
// //                       className={`w-10 h-10 rounded-full border-2 transition-all transform ${
// //                         selected
// //                           ? 'border-[#23A6F0] scale-110 ring-2 ring-offset-2 ring-[#23A6F0]'
// //                           : 'border-gray-200 hover:border-[#23A6F0]'
// //                       } ${!available ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
// //                       style={{
// //                         backgroundColor: swatch?.color || 'transparent',
// //                         backgroundImage: swatch?.image?.previewImage?.url
// //                           ? `url(${swatch.image.previewImage.url})`
// //                           : 'none',
// //                         backgroundSize: 'cover',
// //                         backgroundPosition: 'center',
// //                       }}
// //                       title={name}
// //                     />
// //                   );

// //                   return (
// //                     <button
// //                       key={option.name + name}
// //                       type="button"
// //                       disabled={!exists || !available}
// //                       onClick={(e) => {
// //                         if (!selected) {
// //                           handleOptionClick(e, option.name, name, isDifferentProduct, handle);
// //                         }
// //                       }}
// //                       className="block focus:outline-none"
// //                     >
// //                       {swatchContent}
// //                     </button>
// //                   );
// //                 }

// //                 // SIZE / TEXT UI
// //                 const buttonClasses = `min-w-[60px] px-4 py-2 text-sm font-medium border rounded-md transition-all ${
// //                   selected
// //                     ? 'bg-black text-white border-black shadow-md'
// //                     : 'bg-white text-gray-700 border-gray-300 hover:border-[#23A6F0] hover:shadow-sm'
// //                 } ${!available ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`;

// //                 let displayContent = name;
// //                 if (isMoneyOption && localizedPrice) {
// //                   displayContent = (
// //                     <Money data={localizedPrice} withoutTrailingZeros />
// //                   );
// //                 }

// //                 return (
// //                   <button
// //                     key={option.name + name}
// //                     type="button"
// //                     className={buttonClasses}
// //                     disabled={!exists || !available}
// //                     onClick={(e) => {
// //                       if (!selected) {
// //                         handleOptionClick(e, option.name, name, isDifferentProduct, handle);
// //                       }
// //                     }}
// //                   >
// //                     {displayContent}
// //                   </button>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         );
// //       })}

// //       {/* Add to Cart and Wishlist Row */}
// //       <div className="flex items-center gap-4 mt-6">
// //         <AddToCartButton
// //           disabled={!selectedVariant || !selectedVariant.availableForSale}
// //           onClick={() => open('cart')}
// //           lines={
// //             selectedVariant
// //               ? [{merchandiseId: selectedVariant.id, quantity: 1, selectedVariant}]
// //               : []
// //           }
// //           className="flex-1 bg-[#23A6F0] text-white py-4 px-6 rounded text-sm font-bold hover:bg-[#1a7ab0] active:scale-95 transition-all uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
// //         >
// //           {selectedVariant?.availableForSale ? 'ADD TO CART' : 'SOLD OUT'}
// //         </AddToCartButton>

// //         {isWishlistEnabled && selectedVariant && (
// //           <button
// //             onClick={handleWishlistClick}
// //             disabled={isButtonDisabled}
// //             className={`p-4 rounded border border-gray-200 transition-all duration-200 ${
// //               isButtonDisabled
// //                 ? 'opacity-50 cursor-not-allowed'
// //                 : 'hover:border-[#23A6F0] hover:shadow-md active:scale-95'
// //             }`}
// //             aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
// //           >
// //             <HeartIcon filled={isInWishlist} />
// //           </button>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // // Heart Icon Component
// // function HeartIcon({filled}) {
// //   return (
// //     <svg
// //       width="20"
// //       height="20"
// //       viewBox="0 0 20 20"
// //       fill="none"
// //       xmlns="http://www.w3.org/2000/svg"
// //     >
// //       <path
// //         d="M17.3666 3.84166C16.941 3.41583 16.4356 3.07803 15.8794 2.84757C15.3232 2.6171 14.727 2.49847 14.1249 2.49847C13.5229 2.49847 12.9267 2.6171 12.3705 2.84757C11.8143 3.07803 11.3089 3.41583 10.8833 3.84166L9.99994 4.725L9.1166 3.84166C8.25686 2.98192 7.0908 2.49892 5.87494 2.49892C4.65908 2.49892 3.49301 2.98192 2.63327 3.84166C1.77353 4.70141 1.29053 5.86747 1.29053 7.08333C1.29053 8.29919 1.77353 9.46525 2.63327 10.325L9.99994 17.6917L17.3666 10.325C17.7924 9.89937 18.1302 9.39401 18.3607 8.83779C18.5912 8.28158 18.7098 7.6854 18.7098 7.08333C18.7098 6.48126 18.5912 5.88508 18.3607 5.32887C18.1302 4.77265 17.7924 4.26729 17.3666 3.84166Z"
// //         fill={filled ? '#FF6150' : 'none'}
// //           stroke={filled ? "none" : "#252B42"}
// //         strokeWidth="1.5"
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //       />
// //     </svg>
// //   );
// // }
// // app/components/ProductForm.jsx

// import {useNavigate} from 'react-router';
// import {useState, useEffect, useRef, useCallback} from 'react';
// import {Money} from '@shopify/hydrogen';
// import {AddToCartButton} from './AddToCartButton';
// import {useAside} from './Aside';

// /**
//  * @param {{
//  * productOptions: MappedProductOptions[];
//  * selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
//  * product?: ProductFragment;
//  * isWishlistEnabled?: boolean;
//  * isLoggedIn?: boolean;
//  * isInWishlist?: boolean;
//  * onWishlistToggle?: (selectedVariant) => void;
//  * isLoading?: boolean;
//  * globalData?: object;
//  * }}
//  */
// export function ProductForm({
//   productOptions = [],
//   selectedVariant,
//   product,
//   isWishlistEnabled = false,
//   isLoggedIn = false,
//   isInWishlist = false,
//   onWishlistToggle,
//   isLoading = false,
//   globalData = null,
// }) {
//   const navigate = useNavigate();
//   const {open} = useAside();
//   const [optimisticSelections, setOptimisticSelections] = useState({});
//   const navigatingRef = useRef(false);

//   // ── Global Style Variables ──
//   const formatColor = (c) => (!c ? null : c.startsWith('#') ? c : `#${c}`);
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
//   const fontFamily = globalData?.fontFamily || 'Montserrat, sans-serif';
//   const baseFontSize = globalData?.baseFontSize || 16;

//   // ── Dynamic <style> tag ──
//   const dynamicStyles = `
//     .pf-text { color: ${textColor}; font-family: ${fontFamily}; }
//     .pf-label { color: ${labelColor}; font-family: ${fontFamily}; }
//     .pf-primary-btn {
//       background-color: ${primaryColor}; color: ${primaryText};
//       border-radius: ${borderRadius}px; transition: all ${linkTransition}ms ease;
//       font-family: ${fontFamily};
//     }
//     .pf-primary-btn:hover:not(:disabled) { background-color: ${primaryHoverColor}; color: ${primaryHoverText}; }
//     .pf-primary-btn:disabled { background-color: #9CA3AF; color: #FFFFFF; cursor: not-allowed; }
//     .pf-secondary-btn {
//       background-color: ${secondaryColor}; color: ${secondaryText};
//       border-radius: ${borderRadius}px; transition: all ${linkTransition}ms ease;
//       font-family: ${fontFamily};
//     }
//     .pf-secondary-btn:hover:not(:disabled) { background-color: ${secondaryHoverBg}; color: ${secondaryHoverText}; }
//     .pf-option-btn {
//       min-width: 60px; border-radius: ${borderRadius}px;
//       transition: all ${linkTransition}ms ease;
//       background-color: #FFFFFF; color: ${textColor}; border: 1px solid #d1d5db;
//       font-family: ${fontFamily}; font-size: ${baseFontSize * 0.875}px;
//     }
//     .pf-option-btn:hover:not(:disabled):not(.pf-option-btn-selected) {
//       border-color: ${primaryColor}; background-color: ${primaryColor}10;
//     }
//     .pf-option-btn-selected {
//       min-width: 60px; border-radius: ${borderRadius}px;
//       transition: all ${linkTransition}ms ease;
//       background-color: ${primaryColor}; color: ${primaryText};
//       border: 1px solid ${primaryColor}; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
//       font-family: ${fontFamily}; font-size: ${baseFontSize * 0.875}px;
//     }
//     .pf-swatch-ring {
//       border-color: ${primaryColor};
//       box-shadow: 0 0 0 2px ${primaryColor}40;
//     }
//     .pf-wishlist-btn {
//       border-radius: ${borderRadius}px; transition: all ${linkTransition}ms ease;
//       border: 1px solid #e5e7eb;
//     }
//     .pf-wishlist-btn:hover:not(:disabled) { border-color: ${primaryColor}; }
//   `;

//   // Filter out the default 'Title' option
//   const filteredOptions = (productOptions || []).filter(
//     (option) => !(option.name === 'Title' && option.optionValues.length === 1),
//   );

//   // Handle wishlist click
//   const handleWishlistClick = () => {
//     if (!isLoggedIn) {
//       window.location.href = '/signin';
//       return;
//     }

//     if (onWishlistToggle && selectedVariant) {
//       onWishlistToggle(selectedVariant);
//     }
//   };

//   // Optimistic UI + debounce guard
//   const handleOptionClick = useCallback(
//     (e, optionName, valueName, isDifferentProduct, productHandle) => {
//       e.preventDefault();

//       if (navigatingRef.current) return;
//       navigatingRef.current = true;

//       setOptimisticSelections((prev) => ({...prev, [optionName]: valueName}));

//       const params = new URLSearchParams(window.location.search);
//       params.set(optionName, valueName);

//       const newQueryString = `?${params.toString()}`;
//       const targetPath = isDifferentProduct
//         ? `/products/${productHandle}${newQueryString}`
//         : `${window.location.pathname}${newQueryString}`;

//       navigate(targetPath, {
//         replace: true,
//         preventScrollReset: true,
//       });

//       setTimeout(() => {
//         navigatingRef.current = false;
//       }, 300);
//     },
//     [navigate],
//   );

//   const isOptimisticallySelected = (
//     optionName,
//     valueName,
//     originalSelected,
//   ) => {
//     if (optimisticSelections[optionName] !== undefined) {
//       return optimisticSelections[optionName] === valueName;
//     }
//     return originalSelected;
//   };

//   const isButtonDisabled =
//     isLoading || !selectedVariant || !selectedVariant.availableForSale;

//   // Render simple UI if no options exist
//   if (filteredOptions.length === 0) {
//     return (
//       <div className="product-form">
//         <style>{dynamicStyles}</style>
//         {product && (product.descriptionHtml || product.description) && (
//           <div className="mb-8">
//             {product.descriptionHtml ? (
//               <div
//                 className="text-sm leading-relaxed prose prose-sm max-w-none pf-text"
//                 dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
//               />
//             ) : (
//               <p className="text-sm leading-relaxed pf-text">
//                 {product.description}
//               </p>
//             )}
//           </div>
//         )}
//         <div className="flex items-center gap-4 mt-4">
//           <AddToCartButton
//             globalData={globalData}
//             disabled={!selectedVariant || !selectedVariant.availableForSale}
//             onClick={() => open('cart')}
//             lines={
//               selectedVariant
//                 ? [
//                     {
//                       merchandiseId: selectedVariant.id,
//                       quantity: 1,
//                       selectedVariant,
//                     },
//                   ]
//                 : []
//             }
//             className="flex-1 py-4 px-6 text-sm font-bold uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed pf-primary-btn"
//           >
//             {selectedVariant?.availableForSale ? 'ADD TO CART' : 'SOLD OUT'}
//           </AddToCartButton>

//           {isWishlistEnabled && selectedVariant && (
//             <button
//               onClick={handleWishlistClick}
//               disabled={isButtonDisabled}
//               className={`p-4 transition-all duration-200 pf-wishlist-btn ${
//                 isButtonDisabled
//                   ? 'opacity-50 cursor-not-allowed'
//                   : 'hover:shadow-md active:scale-95'
//               }`}
//               aria-label={
//                 isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
//               }
//             >
//               <HeartIcon filled={isInWishlist} color={textColor} />
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="product-form space-y-6">
//       <style>{dynamicStyles}</style>

//       {/* Product Description */}
//       {product && (product.descriptionHtml || product.description) && (
//         <div className="mb-8">
//           {product.descriptionHtml ? (
//             <div
//               className="text-sm leading-relaxed prose prose-sm max-w-none pf-text"
//               dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
//             />
//           ) : (
//             <p className="text-sm leading-relaxed pf-text">
//               {product.description}
//             </p>
//           )}
//         </div>
//       )}

//       {/* Product Options Loop */}
//       {filteredOptions.map((option) => {
//         return (
//           <div className="product-options" key={option.name}>
//             <h5 className="text-sm font-medium mb-3 pf-text">{option.name}</h5>
//             <div className="flex flex-wrap gap-3 flex-row">
//               {option.optionValues.map((value) => {
//                 const {
//                   name,
//                   handle,
//                   available,
//                   exists,
//                   isDifferentProduct,
//                   swatch,
//                   firstSelectableVariant,
//                   selected: originalSelected,
//                 } = value;

//                 const selected = isOptimisticallySelected(
//                   option.name,
//                   name,
//                   originalSelected,
//                 );

//                 const isMoneyOption =
//                   option.name.toLowerCase().includes('denomination') ||
//                   option.name.toLowerCase().includes('amount') ||
//                   option.name.toLowerCase().includes('value');

//                 const localizedPrice = firstSelectableVariant?.price;

//                 // COLOR SWATCH UI
//                 if (swatch?.color || swatch?.image) {
//                   const swatchContent = (
//                     <div
//                       className={`w-10 h-10 rounded-full border-2 transition-all transform ${
//                         selected
//                           ? `scale-110 ring-2 ring-offset-2 pf-swatch-ring`
//                           : 'hover:scale-105'
//                       } ${!available ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
//                       style={{
//                         backgroundColor: swatch?.color || 'transparent',
//                         borderColor: selected ? primaryColor : '#e5e7eb',
//                         backgroundImage: swatch?.image?.previewImage?.url
//                           ? `url(${swatch.image.previewImage.url})`
//                           : 'none',
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center',
//                       }}
//                       title={name}
//                     />
//                   );

//                   return (
//                     <button
//                       key={option.name + name}
//                       type="button"
//                       disabled={!exists || !available}
//                       onClick={(e) => {
//                         if (!selected)
//                           handleOptionClick(
//                             e,
//                             option.name,
//                             name,
//                             isDifferentProduct,
//                             handle,
//                           );
//                       }}
//                       className="block focus:outline-none"
//                     >
//                       {swatchContent}
//                     </button>
//                   );
//                 }

//                 // SIZE / TEXT UI
//                 let displayContent = name;
//                 if (isMoneyOption && localizedPrice) {
//                   displayContent = (
//                     <Money data={localizedPrice} withoutTrailingZeros />
//                   );
//                 }

//                 return (
//                   <button
//                     key={option.name + name}
//                     type="button"
//                     className={`px-4 py-2 text-sm font-medium focus:outline-none ${
//                       !available
//                         ? 'opacity-30 cursor-not-allowed'
//                         : 'cursor-pointer'
//                     } ${selected ? 'pf-option-btn-selected' : 'pf-option-btn'}`}
//                     disabled={!exists || !available}
//                     onClick={(e) => {
//                       if (!selected)
//                         handleOptionClick(
//                           e,
//                           option.name,
//                           name,
//                           isDifferentProduct,
//                           handle,
//                         );
//                     }}
//                   >
//                     {displayContent}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       })}

//       {/* Add to Cart and Wishlist Row */}
//       <div className="flex items-center gap-4 mt-6">
//         <AddToCartButton
//           globalData={globalData}
//           disabled={!selectedVariant || !selectedVariant.availableForSale}
//           onClick={() => open('cart')}
//           lines={
//             selectedVariant
//               ? [
//                   {
//                     merchandiseId: selectedVariant.id,
//                     quantity: 1,
//                     selectedVariant,
//                   },
//                 ]
//               : []
//           }
//           className="flex-1 py-4 px-6 text-sm font-bold uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed pf-primary-btn"
//         >
//           {selectedVariant?.availableForSale ? 'ADD TO CART' : 'SOLD OUT'}
//         </AddToCartButton>

//         {isWishlistEnabled && selectedVariant && (
//           <button
//             onClick={handleWishlistClick}
//             disabled={isButtonDisabled}
//             className={`p-4 transition-all duration-200 pf-wishlist-btn ${
//               isButtonDisabled
//                 ? 'opacity-50 cursor-not-allowed'
//                 : 'hover:shadow-md active:scale-95'
//             }`}
//             aria-label={
//               isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
//             }
//           >
//             <HeartIcon filled={isInWishlist} color={textColor} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// // Heart Icon Component with dynamic color
// function HeartIcon({filled, color = '#252B42'}) {
//   return (
//     <svg
//       width="20"
//       height="20"
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M17.3666 3.84166C16.941 3.41583 16.4356 3.07803 15.8794 2.84757C15.3232 2.6171 14.727 2.49847 14.1249 2.49847C13.5229 2.49847 12.9267 2.6171 12.3705 2.84757C11.8143 3.07803 11.3089 3.41583 10.8833 3.84166L9.99994 4.725L9.1166 3.84166C8.25686 2.98192 7.0908 2.49892 5.87494 2.49892C4.65908 2.49892 3.49301 2.98192 2.63327 3.84166C1.77353 4.70141 1.29053 5.86747 1.29053 7.08333C1.29053 8.29919 1.77353 9.46525 2.63327 10.325L9.99994 17.6917L17.3666 10.325C17.7924 9.89937 18.1302 9.39401 18.3607 8.83779C18.5912 8.28158 18.7098 7.6854 18.7098 7.08333C18.7098 6.48126 18.5912 5.88508 18.3607 5.32887C18.1302 4.77265 17.7924 4.26729 17.3666 3.84166Z"
//         fill={filled ? '#FF6150' : 'none'}
//         stroke={filled ? 'none' : color}
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }
// app/components/ProductForm.jsx

import {useNavigate} from 'react-router';
import {useState, useEffect, useRef, useCallback} from 'react';
import {Money} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';

/**
 * @param {{
 * productOptions: MappedProductOptions[];
 * selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 * product?: ProductFragment;
 * isWishlistEnabled?: boolean;
 * isLoggedIn?: boolean;
 * isInWishlist?: boolean;
 * onWishlistToggle?: (selectedVariant) => void;
 * isLoading?: boolean;
 * globalData?: object;
 * }}
 */
export function ProductForm({
  productOptions = [],
  selectedVariant,
  product,
  isWishlistEnabled = false,
  isLoggedIn = false,
  isInWishlist = false,
  onWishlistToggle,
  isLoading = false,
  globalData = null,
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [optimisticSelections, setOptimisticSelections] = useState({});
  const navigatingRef = useRef(false);


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



  // ── Global Style Variables ──
  const formatColor = (c) => (!c ? null : c.startsWith('#') ? c : `#${c}`);
  const primaryColor = formatColor(globalData?.buttons?.primaryBg) || '#23A6F0';
  const primaryHoverColor = formatColor(globalData?.buttons?.primaryHoverBg) || '#1D4ED8';
  const primaryText = formatColor(globalData?.buttons?.primaryText) || '#FFFFFF';
  const primaryHoverText = formatColor(globalData?.buttons?.primaryHovertxt) || primaryText;
  const secondaryColor = formatColor(globalData?.buttons?.secondaryBg) || '#000000';
  const secondaryHoverBg = formatColor(globalData?.buttons?.secondaryHoverBg) || '#D1D5DB';
  const secondaryText = formatColor(globalData?.buttons?.secondaryText) || '#FFFFFF';
  const secondaryHoverText = formatColor(globalData?.buttons?.secondaryHovertxt) || '#000000';
  const textColor = formatColor(globalData?.linksEffect?.linkColor) || '#737373';
  const labelColor = formatColor(globalData?.linksEffect?.linkColor) || '#737373';
  const linkHoverColor = formatColor(globalData?.linksEffect?.hoverColor) || '#5a5a5a';
  const borderRadius = globalData?.buttons?.borderRadius ?? 8;
  const linkTransition = globalData?.linksEffect?.transitionDuration || 300;
  const fontFamily = globalData?.fontFamily || 'Montserrat, sans-serif';
  const baseFontSize = globalData?.baseFontSize || 16;

  // ── Dynamic <style> tag ──
  const dynamicStyles = `
    .pf-text { color: ${textColor}; font-family: ${fontFamily}; }
    .pf-label { color: ${labelColor}; font-family: ${fontFamily}; }
    .pf-primary-btn {
      background-color: ${primaryColor}; color: ${primaryText};
      border-radius: ${borderRadius}px; transition: all ${linkTransition}ms ease;
      font-family: ${fontFamily};
    }
    .pf-primary-btn:hover:not(:disabled) { background-color: ${primaryHoverColor}; color: ${primaryHoverText}; }
    .pf-primary-btn:disabled { background-color: #9CA3AF; color: #FFFFFF; cursor: not-allowed; }
    .pf-secondary-btn {
      background-color: ${secondaryColor}; color: ${secondaryText};
      border-radius: ${borderRadius}px; transition: all ${linkTransition}ms ease;
      font-family: ${fontFamily};
    }
    .pf-secondary-btn:hover:not(:disabled) { background-color: ${secondaryHoverBg}; color: ${secondaryHoverText}; }
    .pf-option-btn {
      min-width: 60px; border-radius: ${borderRadius}px;
      transition: all ${linkTransition}ms ease;
      background-color: #FFFFFF; color: ${textColor}; border: 1px solid #d1d5db;
      font-family: ${fontFamily}; font-size: ${baseFontSize * 0.875}px;
    }
    .pf-option-btn:hover:not(:disabled):not(.pf-option-btn-selected) {
      border-color: ${primaryColor}; background-color: ${primaryColor}10;
    }
    .pf-option-btn-selected {
      min-width: 60px; border-radius: ${borderRadius}px;
      transition: all ${linkTransition}ms ease;
      background-color: ${primaryColor}; color: ${primaryText};
      border: 1px solid ${primaryColor}; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
      font-family: ${fontFamily}; font-size: ${baseFontSize * 0.875}px;
    }
    .pf-swatch-ring {
      border-color: ${primaryColor};
      box-shadow: 0 0 0 2px ${primaryColor}40;
    }
    .pf-wishlist-btn {
      border-radius: ${borderRadius}px; transition: all ${linkTransition}ms ease;
      border: 1px solid #e5e7eb;
    }
    .pf-wishlist-btn:hover:not(:disabled) { border-color: ${primaryColor}; }
  `;

  // Filter out the default 'Title' option
  const filteredOptions = (productOptions || []).filter(
    (option) => !(option.name === 'Title' && option.optionValues.length === 1),
  );

  // Handle wishlist click
  const handleWishlistClick = () => {
    if (!isLoggedIn) {
      window.location.href = '/signin';
      return;
    }

    if (onWishlistToggle && selectedVariant) {
      onWishlistToggle(selectedVariant);
    }
  };

  // Optimistic UI + debounce guard
  const handleOptionClick = useCallback(
    (e, optionName, valueName, isDifferentProduct, productHandle) => {
      e.preventDefault();

      if (navigatingRef.current) return;
      navigatingRef.current = true;

      setOptimisticSelections((prev) => ({...prev, [optionName]: valueName}));

      const params = new URLSearchParams(window.location.search);
      params.set(optionName, valueName);

      const newQueryString = `?${params.toString()}`;
      const targetPath = isDifferentProduct
        ? `/products/${productHandle}${newQueryString}`
        : `${window.location.pathname}${newQueryString}`;

      navigate(targetPath, {
        replace: true,
        preventScrollReset: true,
      });

      setTimeout(() => {
        navigatingRef.current = false;
      }, 300);
    },
    [navigate],
  );

  const isOptimisticallySelected = (
    optionName,
    valueName,
    originalSelected,
  ) => {
    if (optimisticSelections[optionName] !== undefined) {
      return optimisticSelections[optionName] === valueName;
    }
    return originalSelected;
  };

  const isButtonDisabled =
    isLoading || !selectedVariant || !selectedVariant.availableForSale;

  // Render simple UI if no options exist
  if (filteredOptions.length === 0) {
    return (
      <div className="product-form">
        <style>{dynamicStyles}</style>
        {product && (product.descriptionHtml || product.description) && (
          <div className="mb-8">
            {product.descriptionHtml ? (
              <div
                className="text-sm leading-relaxed prose prose-sm max-w-none pf-text"
                dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
              />
            ) : (
              <p className="text-sm leading-relaxed pf-text">
                {product.description}
              </p>
            )}
          </div>
        )}
        <div className="flex items-center gap-4 mt-4">
          <AddToCartButton
            globalData={globalData}
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            onClick={() => open('cart')}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: 1,
                      selectedVariant,
                    },
                  ]
                : []
            }
            className="flex-1 py-4 px-6 text-sm font-bold uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed pf-primary-btn"
          >
            {selectedVariant?.availableForSale ? 'ADD TO CART' : 'SOLD OUT'}
          </AddToCartButton>

          {isWishlistEnabled && selectedVariant && (
            <button
              onClick={handleWishlistClick}
              disabled={isButtonDisabled}
              className={`p-4 transition-all duration-200 pf-wishlist-btn ${
                isButtonDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-md active:scale-95'
              }`}
              aria-label={
                isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
              }
            >
              <HeartIcon filled={isInWishlist} color={textColor} />
            </button>
          )}
        </div>
        {/* <div className="review-app">
        <iframe
          src={`https://representation-adsl-armed-dam.trycloudflare.com/gwl-review-widget?shop=akshay-123497.myshopify.com`}
          style={{
            width: '100%',
            height: '800px',
            border: 'none',
            borderRadius: '12px',
          }}
          title="Customer Reviews Slider"
        />

        <iframe
        src={`https://representation-adsl-armed-dam.trycloudflare.com/gwl-simple-rating?productId=${encodeURIComponent(product.id)}&shop=akshay-123497.myshopify.com`}
        style={{
          width: '100%',
          height: '44px',
          border: 'none',
          display: 'block',
          overflow: 'hidden',
          background: 'transparent',
          colorScheme: 'normal',
        }}
        title="Product Rating"
      />

 
        </div> */}
      </div>
    );
  }

  return (
    <div className="product-form space-y-6">
      <style>{dynamicStyles}</style>

      {/* Product Description */}
      {product && (product.descriptionHtml || product.description) && (
        <div className="mb-8">
          {product.descriptionHtml ? (
            <div
              className="text-sm leading-relaxed prose prose-sm max-w-none pf-text"
              dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
            />
          ) : (
            <p className="text-sm leading-relaxed pf-text">
              {product.description}
            </p>
          )}
        </div>
      )}

      <div className='h-[2px] w-full bg-[#BDBDBD]'></div>

      {console.log("filteredOptions: ", filteredOptions)}

      {/* Product Options Loop */}
      {filteredOptions.map((option) => {
        return (
          <div className="product-options" key={option.name}>
            <h5 className="text-sm font-medium mb-3 pf-text">{option.name}</h5>
            <div className="flex flex-wrap gap-3 flex-row">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                  firstSelectableVariant,
                  selected: originalSelected,
                } = value;

                const selected = isOptimisticallySelected(
                  option.name,
                  name,
                  originalSelected,
                );

                const isMoneyOption =
                  option.name.toLowerCase().includes('denomination') ||
                  option.name.toLowerCase().includes('amount') ||
                  option.name.toLowerCase().includes('value');

                const localizedPrice = firstSelectableVariant?.price;

                // COLOR SWATCH UI
                if (swatch?.color || swatch?.image) {
                  const swatchContent = (
                    <div
                      className={`w-10 h-10 rounded-full border-2 transition-all transform ${
                        selected
                          ? `scale-110 ring-2 ring-offset-2 pf-swatch-ring`
                          : 'hover:scale-105'
                      } ${!available ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{
                        backgroundColor: swatch?.color || 'transparent',
                        borderColor: selected ? primaryColor : '#e5e7eb',
                        backgroundImage: swatch?.image?.previewImage?.url
                          ? `url(${swatch.image.previewImage.url})`
                          : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                      title={name}
                    />
                  );

                  return (
                    <button
                      key={option.name + name}
                      type="button"
                      disabled={!exists || !available}
                      onClick={(e) => {
                        if (!selected)
                          handleOptionClick(
                            e,
                            option.name,
                            name,
                            isDifferentProduct,
                            handle,
                          );
                      }}
                      className="block focus:outline-none"
                    >
                      {swatchContent}
                    </button>
                  );
                }

                // SIZE / TEXT UI
                let displayContent = name;
                if (isMoneyOption && localizedPrice) {
                  displayContent = (
                    <Money data={localizedPrice} withoutTrailingZeros />
                  );
                }

                return (
                  <button
                    key={option.name + name}
                    type="button"
                    className={`px-4 py-2 text-sm font-medium focus:outline-none ${
                      !available
                        ? 'opacity-30 cursor-not-allowed'
                        : 'cursor-pointer'
                    } ${selected ? 'pf-option-btn-selected' : 'pf-option-btn'}`}
                    disabled={!exists || !available}
                    onClick={(e) => {
                      if (!selected)
                        handleOptionClick(
                          e,
                          option.name,
                          name,
                          isDifferentProduct,
                          handle,
                        );
                    }}
                  >
                    {displayContent}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Add to Cart and Wishlist Row */}
      <div className="flex items-center gap-4 mt-6">
        <AddToCartButton
          globalData={globalData}
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => open('cart')}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                    selectedVariant,
                  },
                ]
              : []
          }
          className="flex-1 py-4 px-6 text-sm font-bold uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed pf-primary-btn"
        >
          {selectedVariant?.availableForSale ? 'ADD TO CART' : 'SOLD OUT'}
        </AddToCartButton>

        {isWishlistEnabled && selectedVariant && (
          <button
            onClick={handleWishlistClick}
            disabled={isButtonDisabled}
            className={`p-4 transition-all duration-200 pf-wishlist-btn ${
              isButtonDisabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-md active:scale-95'
            }`}
            aria-label={
              isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
            }
          >
            <HeartIcon filled={isInWishlist} color={textColor} />
          </button>
        )}
      </div>
    </div>
  );
}

// Heart Icon Component with dynamic color
function HeartIcon({filled, color = '#252B42'}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.3666 3.84166C16.941 3.41583 16.4356 3.07803 15.8794 2.84757C15.3232 2.6171 14.727 2.49847 14.1249 2.49847C13.5229 2.49847 12.9267 2.6171 12.3705 2.84757C11.8143 3.07803 11.3089 3.41583 10.8833 3.84166L9.99994 4.725L9.1166 3.84166C8.25686 2.98192 7.0908 2.49892 5.87494 2.49892C4.65908 2.49892 3.49301 2.98192 2.63327 3.84166C1.77353 4.70141 1.29053 5.86747 1.29053 7.08333C1.29053 8.29919 1.77353 9.46525 2.63327 10.325L9.99994 17.6917L17.3666 10.325C17.7924 9.89937 18.1302 9.39401 18.3607 8.83779C18.5912 8.28158 18.7098 7.6854 18.7098 7.08333C18.7098 6.48126 18.5912 5.88508 18.3607 5.32887C18.1302 4.77265 17.7924 4.26729 17.3666 3.84166Z"
        fill={filled ? '#FF6150' : 'none'}
        stroke={filled ? 'none' : color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}