
// import { CartForm, Image, Money } from '@shopify/hydrogen';
// import { useVariantUrl } from '~/lib/variants';
// import { Link, useFetcher } from 'react-router';
// import { useAside } from './Aside';
// import { useState, useEffect } from 'react';

// export function CartLineItem({ layout, line, isWishlistEnabled = false, isLoggedIn = false, wishlist = [], onWishlistUpdate, locale }) {
//   const { id, merchandise } = line;
//   const { product, title, image, selectedOptions } = merchandise;
//   const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
//   const { close } = useAside();
//   const [loaded, setLoaded] = useState(false);
//   const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
//   const fetcher = useFetcher();

//   // Get the actual variant from the line item
//   const variant = merchandise;
//   const variantId = variant.id;
//   const variantTitle = variant.title;

//   useEffect(() => {
//     const timer = setTimeout(() => setLoaded(true), 50);
//     return () => clearTimeout(timer);
//   }, []);

//   // Check if this specific variant is in wishlist - MATCH PLP IMPLEMENTATION
//   const isProductInWishlist = (productId, variantId) => {
//     return wishlist?.some(item => {
//       // Check if it's the same product
//       if (item.id === productId || item.productId === productId) {
//         // If variantId is provided, check if it matches
//         if (variantId && item.variantId) {
//           return item.variantId === variantId;
//         }
//         // If no variantId, check if the product has variant info
//         if (!item.variantId && !variantId) {
//           return true;
//         }
//       }
//       return false;
//     }) || false;
//   };

//   const isWished = isProductInWishlist(product.id, variantId);
  
//   // Track fetcher state for adding to wishlist
//   useEffect(() => {
//     if (fetcher.state === 'idle' && isAddingToWishlist) {
//       setIsAddingToWishlist(false);
//     }
//   }, [fetcher.state, isAddingToWishlist]);

//   // Get actual variant options from selectedOptions
//   const getOptionValue = (optionName) => {
//     const option = selectedOptions?.find(opt => opt.name === optionName);
//     return option ? option.value : null;
//   };
  
  
//   const size = getOptionValue('Size');
//   const color = getOptionValue('Color');
//   const material = getOptionValue('Material');
//   const style = getOptionValue('Style');

//   // Use actual prices from the cart line data
//   const currentAmountStr = line?.cost?.totalAmount?.amount || '0';
//   const currencyCode = line?.cost?.totalAmount?.currencyCode || 'USD';
//   const compareAmountStr = merchandise?.compareAtPrice?.amount;

//   const priceData = {
//     amount: currentAmountStr,
//     currencyCode: currencyCode
//   };

//   const compareAtPriceData = compareAmountStr ? {
//     amount: compareAmountStr,
//     currencyCode: merchandise?.compareAtPrice?.currencyCode || currencyCode
//   } : null;

//   const currentPriceFloat = parseFloat(currentAmountStr);
//   const compareAtPriceFloat = parseFloat(compareAmountStr || '0');

//   let discountPercent = 0;
//   if (compareAtPriceFloat > currentPriceFloat) {
//     discountPercent = Math.round(((compareAtPriceFloat - currentPriceFloat) / compareAtPriceFloat) * 100);
//   }

//   // Handle adding product variant to wishlist - MATCH PLP IMPLEMENTATION
//   const handleAddToWishlist = async (e) => {
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

//     setIsAddingToWishlist(true);

//     try {
//       // Get selected options in the same format as PLP
//       const variantSelectedOptions = selectedOptions || [];
      
//       const requestBody = {
//         productId: product.id,
//         productTitle: product.title,
//         productHandle: product.handle,
//         productImage: image?.url || '',
//         productPrice: currentPriceFloat.toString(),
//         // Include variant information - MATCH PLP STRUCTURE
//         variantId: variantId || '',
//         variantTitle: variantTitle || '',
//         selectedOptions: variantSelectedOptions,
//         action: 'toggle' // MATCH PLP - use 'toggle' instead of conditional
//       };
      
     

//       const wishlistRes = await fetch('/api/wishlist', {
//         method: 'POST',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(requestBody)
//       });

//       const wishlistData = await wishlistRes.json();
     

//       if (wishlistData.success) {
//         // Update wishlist state
//         if (onWishlistUpdate) {
//           onWishlistUpdate(wishlistData.wishlist);
//         }
       
//       } else {
//         setIsAddingToWishlist(false);
//         if (wishlistData.disabled) {
//           alert("Wishlist is currently disabled");
//         } else if (wishlistData.requiresLogin) {
//           window.location.href = '/signin';
//         } else {
//           alert(wishlistData.error || "Failed to update wishlist");
//         }
//       }
//     } catch (error) {
//       console.error('Error adding to wishlist:', error);
//       alert("Something went wrong");
//       setIsAddingToWishlist(false);
//     }
//   };

//   // Wishlist Icon Component
// const WishlistIcon = ({ filled }) => (
//   <svg width="20" height="20" viewBox="0 0 24 24">
//     <path
//       d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
//          2 5.42 4.42 3 7.5 3 
//          c1.74 0 3.41 0.81 4.5 2.09 
//          C13.09 3.81 14.76 3 16.5 3 
//          19.58 3 22 5.42 22 8.5 
//          c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
//       fill={filled ? "#EF4444" : "none"}
//        stroke={filled ? "none" : "#252B42"}
//       strokeWidth="1.5"
//     />
//   </svg>
// );

//   return (
//     <li key={id} className="bg-[#F9F9F9] rounded-2xl p-4 font-montserrat flex gap-4 items-center shadow-sm mb-4">
//       {/* LEFT: Product Image */}
//       {image && (
//         <div className="w-[90px] h-[100px] flex-shrink-0 bg-white rounded-lg overflow-hidden flex items-center justify-center">
//           <Image
//             alt={title}
//             data={image}
//             sizes="90px"
//             loading="lazy"
//             className={`w-full h-full object-contain filter transition-all duration-500 ${loaded ? 'blur-0' : 'blur-xl'}`}
//             onLoad={(e) => (e.currentTarget.style.filter = 'blur(0)')}
//           />
//         </div>
//       )}

//       {/* RIGHT: Content Wrapper */}
//       <div className="flex-1 min-w-0 flex flex-col justify-between h-[90px] py-0.5">
//         {/* ROW 1: Title & Current Price */}
//         <div className="flex justify-between items-start gap-2">
//           <Link prefetch="intent" to={lineItemUrl} onClick={() => { if (layout === 'aside') close(); }} className="min-w-0 flex-1">
//             <h4 className="font-semibold text-[#252B42] text-[15px] ">{product.title}</h4>
//           </Link>
//           <div className="text-[16px] font-bold text-[#252B42] flex-shrink-0">
//             {line?.cost?.totalAmount?.amount ? <Money data={priceData} /> : <span>-</span>}
//           </div>
//         </div>

//         {/* ROW 2: Size & Discounted Price */}
//         <div className="flex justify-between items-center mt-1">
//           <div className="text-[13px] text-[#737373]">
//             {size && <p>Size : <span className="font-bold text-[#252B42]">{size}</span></p>}
//           </div>
//           <div className="text-[12px] text-[#737373] flex-shrink-0">
//             {compareAtPriceFloat > currentPriceFloat && (
//               <span>({discountPercent}%) - <span className="line-through"><Money data={compareAtPriceData} /></span></span>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-wrap justify-between items-center mt-auto gap-y-2">
//           <div className="text-[13px] text-[#737373] min-w-[50px]">
//             {color && <p>Color : <span className="font-bold text-[#252B42]">{color}</span></p>}
//           </div>
//           <div className='flex gap-[10px]'>
//             {/* Wishlist Button */}
//             {isWishlistEnabled && (
//               <button
//                 onClick={handleAddToWishlist}
//                 disabled={isAddingToWishlist}
//                 className="p-1 rounded-md hover:bg-gray-100 transition disabled:opacity-50"
//                 title={isWished ? "Remove from wishlist" : "Add to wishlist"}
//               >
//                 <WishlistIcon filled={isWished} />
//               </button>
//             )}

//             <div className="flex justify-end items-center gap-2 flex-shrink-0">
//               <CartLineQuantity line={line} />
//               <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </li>
//   );
// }

// function CartLineQuantity({ line }) {
//   if (!line || typeof line?.quantity === 'undefined') return null;
//   const { id: lineId, quantity, isOptimistic } = line;
//   const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
//   const nextQuantity = Number((quantity + 1).toFixed(0));

//   return (
//     <div className="flex items-center gap-3 text-[#252B42] font-semibold text-[14px]">
//       <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
//         <button
//           disabled={quantity <= 1 || !!isOptimistic}
//           className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-black transition disabled:opacity-50"
//         >
//           −
//         </button>
//       </CartLineUpdateButton>

//       <span className="w-3 text-center">{quantity}</span>

//       <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
//         <button
//           disabled={!!isOptimistic}
//           className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-black transition disabled:opacity-50"
//         >
//           +
//         </button>
//       </CartLineUpdateButton>
//     </div>
//   );
// }

// function CartLineRemoveButton({ lineIds, disabled }) {
//   return (
//     <CartForm
//       fetcherKey={lineIds.join('-')}
//       route="/cart"
//       action={CartForm.ACTIONS.LinesRemove}
//       inputs={{ lineIds }}
//     >
//       <button
//         disabled={disabled}
//         type="submit"
//         aria-label="Remove item"
//         className="text-[#FF0000] hover:text-red-700 disabled:opacity-50 transition-colors p-1 rounded-md hover:bg-red-50 flex items-center justify-center"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={1.5}
//           stroke="currentColor"
//           className="w-5 h-5"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
//           />
//         </svg>
//       </button>
//     </CartForm>
//   );
// }

// function CartLineUpdateButton({ children, lines }) {
//   const lineIds = lines.map((line) => line.id);

//   return (
//     <CartForm
//       fetcherKey={getUpdateKey(lineIds)}
//       route="/cart"
//       action={CartForm.ACTIONS.LinesUpdate}
//       inputs={{ lines }}
//     >
//       {children}
//     </CartForm>
//   );
// }

// function getUpdateKey(lineIds) {
//   return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
// }

// CartLineItem.jsx - Updated with Wishlist Context
import { CartForm, Image, Money } from '@shopify/hydrogen';
import { useVariantUrl } from '~/lib/variants';
import { Link, useFetcher } from 'react-router';
import { useAside } from './Aside';
import { useState, useEffect } from 'react';
import { useWishlist } from '~/context/WishlistContext';

export function CartLineItem({ layout, line, isWishlistEnabled = false, isLoggedIn = false, locale }) {
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const { close } = useAside();
  const [loaded, setLoaded] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false); // ✅ Local loading state for this specific item
  const fetcher = useFetcher();
  
  // ✅ Use wishlist context
  const { toggleWishlist, isInWishlist } = useWishlist(); // Remove global loading

  // Get the actual variant from the line item
  const variant = merchandise;
  const variantId = variant.id;
  const variantTitle = variant.title;

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Use context's isInWishlist function
  const isWished = isInWishlist(product.id, variantId);
  
  // Get actual variant options from selectedOptions
  const getOptionValue = (optionName) => {
    const option = selectedOptions?.find(opt => opt.name === optionName);
    return option ? option.value : null;
  };
  
  const size = getOptionValue('Size');
  const color = getOptionValue('Color');
  const material = getOptionValue('Material');
  const style = getOptionValue('Style');

  // Use actual prices from the cart line data
  const currentAmountStr = line?.cost?.totalAmount?.amount || '0';
  const currencyCode = line?.cost?.totalAmount?.currencyCode || 'USD';
  const compareAmountStr = merchandise?.compareAtPrice?.amount;

  const priceData = {
    amount: currentAmountStr,
    currencyCode: currencyCode
  };

  const compareAtPriceData = compareAmountStr ? {
    amount: compareAmountStr,
    currencyCode: merchandise?.compareAtPrice?.currencyCode || currencyCode
  } : null;

  const currentPriceFloat = parseFloat(currentAmountStr);
  const compareAtPriceFloat = parseFloat(compareAmountStr || '0');

  let discountPercent = 0;
  if (compareAtPriceFloat > currentPriceFloat) {
    discountPercent = Math.round(((compareAtPriceFloat - currentPriceFloat) / compareAtPriceFloat) * 100);
  }

  // ✅ Updated handleAddToWishlist using local loading state
  const handleAddToWishlist = async (e) => {
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

    // Set loading state for THIS SPECIFIC item only
    setIsLoadingWishlist(true);

    // Get selected options in the same format as PLP
    const variantSelectedOptions = selectedOptions || [];
    
    const result = await toggleWishlist({
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle,
      productImage: image?.url || '',
      productPrice: currentPriceFloat.toString(),
      variantId: variantId || '',
      variantTitle: variantTitle || '',
      selectedOptions: variantSelectedOptions,
    });

    // Clear loading state for THIS SPECIFIC item
    setIsLoadingWishlist(false);

    if (!result.success && result.requiresLogin) {
      window.location.href = '/signin';
    } else if (!result.success && result.error) {
      alert(result.error);
    }
  };

  // Wishlist Icon Component
  const WishlistIcon = ({ filled }) => (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
           2 5.42 4.42 3 7.5 3 
           c1.74 0 3.41 0.81 4.5 2.09 
           C13.09 3.81 14.76 3 16.5 3 
           19.58 3 22 5.42 22 8.5 
           c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={filled ? "#EF4444" : "none"}
        stroke={filled ? "none" : "#252B42"}
        strokeWidth="1.5"
      />
    </svg>
  );

  return (
    <li key={id} className="bg-[#F9F9F9] rounded-2xl px-2 sm:px-[25px] pt-2 sm:pt-[24px] pb-2 sm:pb-[21px] font-montserrat flex gap-[27px] items-center shadow-sm"
     style={{
      marginBottom:"0px"
     }}
    >
      {/* LEFT: Product Image */}
      {image && (
        <div className="w-[90px] h-[110px] flex-shrink-0 bg-white rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            alt={title}
            data={image}
            sizes="90px"
            loading="lazy"
            className={`w-full h-full object-contain filter transition-all duration-500 ${loaded ? 'blur-0' : 'blur-xl'}`}
            onLoad={(e) => (e.currentTarget.style.filter = 'blur(0)')}
          />
        </div>
      )}

      {/* RIGHT: Content Wrapper */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-[16px]">
        {/* ROW 1: Title & Current Price */}
        <div className="flex justify-between items-start gap-2">
          <Link prefetch="intent" to={lineItemUrl} onClick={() => { if (layout === 'aside') close(); }} className="min-w-0 flex-1">
            <h4 className={`text-[#252B42] text-[15px] ${layout === 'page' ? "sm:text-[20px] sm:leading-[30px]" : "sm:text-[15px] sm:leading-[20px]"} tracking-[0.2px] font-normal`}>{product.title}</h4>
          </Link>
          <div className={`text-[18px] ${layout === 'page' ? "sm:text-[28px]" : "text-[18px]"} font-normal text-[#252B42] flex-shrink-0`}>
            {line?.cost?.totalAmount?.amount ? <Money data={priceData} /> : <span>-</span>}
          </div>
        </div>

        {/* ROW 2: Size & Discounted Price */}
       { (size != null || discountPercent > 0 || compareAtPriceData != null )  && (<div className="flex justify-between items-center mt-1">
          <div className="text-[13px] text-[#737373]">
            {size && <p>Size : <span className="font-bold text-[#252B42]">{size}</span></p>}
          </div>
          <div className="text-[12px] text-[#737373] flex-shrink-0">
            {compareAtPriceFloat > currentPriceFloat && (
              <span>({discountPercent}%) - <span className="line-through"><Money data={compareAtPriceData} /></span></span>
            )}
          </div>
        </div>)}

        <div className="flex flex-wrap justify-between items-center gap-y-2">
          <div className="text-[13px] text-[#737373] min-w-[50px]">
            {color && <p>Color : <span className="font-bold text-[#252B42]">{color}</span></p>}
          </div>
          <div className='flex gap-[19px]'>
            {/* Wishlist Button - ✅ Use local loading state instead of global */}
            {isWishlistEnabled && (
              <button
                onClick={handleAddToWishlist}
                disabled={isLoadingWishlist}
                className="rounded-md hover:bg-gray-100 transition disabled:opacity-50"
                title={isWished ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isLoadingWishlist ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <WishlistIcon filled={isWished} />
                )}
              </button>
            )}

            <div className="flex justify-end items-center gap-[19px] flex-shrink-0">
              <CartLineQuantity line={line} />
              <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function CartLineQuantity({ line }) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const { id: lineId, quantity, isOptimistic } = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-[14px] text-[#252B42] font-semibold text-[14px]">
      <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
        <button
          disabled={quantity <= 1 || !!isOptimistic}
          className="w-[24px] h-[24px] flex items-center justify-center text-gray-400 hover:text-black transition disabled:opacity-50"
        >
          −
        </button>
      </CartLineUpdateButton>

      <span className="w-3 text-center text-[23px] font-medium leading-none">{quantity}</span>

      <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
        <button
          disabled={!!isOptimistic}
          className="w-[24px] h-[24px] flex items-center justify-center text-gray-400 hover:text-black transition disabled:opacity-50"
        >
          +
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLineRemoveButton({ lineIds, disabled }) {
  return (
    <CartForm
      fetcherKey={lineIds.join('-')}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <button
        disabled={disabled}
        type="submit"
        aria-label="Remove item"
        className="text-[#FF0000] hover:text-red-700 disabled:opacity-50 transition-colors rounded-md hover:bg-red-50 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({ children, lines }) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
/** @typedef {OptimisticCartLine<CartApiQueryFragment>} CartLine */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLine} OptimisticCartLine */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
