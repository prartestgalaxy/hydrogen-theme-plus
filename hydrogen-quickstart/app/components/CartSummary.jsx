// import {CartForm, Money} from '@shopify/hydrogen';
// import {useEffect, useRef, useState} from 'react';
// import {useFetcher} from 'react-router';

// /**
//  * @param {CartSummaryProps}
//  */
// export function CartSummary({cart, layout}) {
//   const className = layout === 'page' ? 'w-full lg:w-[400px]' : 'w-full';
 
//   const [discountInput, setDiscountInput] = useState('');
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [attemptedDiscount, setAttemptedDiscount] = useState(false);
//   const [status, setStatus] = useState('idle');
  
//   const appliedDiscounts = cart?.discountCodes?.filter((discount) => discount.applicable) || [];

//   const subtotal = cart?.cost?.subtotalAmount;
//   const total = cart?.cost?.totalAmount;
  
//   let totalDiscountAmount = 0;
//   cart?.lines?.nodes?.forEach((line) => {
//     line.discountAllocations?.forEach((discount) => {
//       if (discount.discountedAmount?.amount) {
//         totalDiscountAmount += parseFloat(discount.discountedAmount.amount);
//       }
//     });
//   });

//   let totalGiftCardAmount = 0;
//   cart?.appliedGiftCards?.forEach((giftCard) => {
//     if (giftCard.amountUsed?.amount) {
//       totalGiftCardAmount += parseFloat(giftCard.amountUsed.amount);
//     }
//   });
  
//   let discountAmount = null;
//   if (totalDiscountAmount > 0) {
//     discountAmount = { amount: totalDiscountAmount.toFixed(2), currencyCode: subtotal?.currencyCode || 'USD' };
//   }

//   let giftCardDeductionAmount = null;
//   if (totalGiftCardAmount > 0) {
//     giftCardDeductionAmount = { amount: totalGiftCardAmount.toFixed(2), currencyCode: subtotal?.currencyCode || 'USD' };
//   }

//   const originalSubtotalAmount = subtotal?.amount ? (parseFloat(subtotal.amount) + totalDiscountAmount).toFixed(2) : null;
//   const originalSubtotal = originalSubtotalAmount ? { amount: originalSubtotalAmount, currencyCode: subtotal?.currencyCode || 'USD' } : null;
//   const hasDiscounts = totalDiscountAmount > 0;

//   useEffect(() => {
//     if (!attemptedDiscount) return;
//     const timer = setTimeout(() => {
//       if (appliedDiscounts.length > 0) setMessage({ type: 'success', text: 'Discount applied' });
//       else setMessage({ type: 'error', text: 'Invalid code' });
//       setStatus('result');
//       setAttemptedDiscount(false);
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, [appliedDiscounts.length, attemptedDiscount]);

//   useEffect(() => {
//     if (appliedDiscounts.length === 0) setMessage({ type: '', text: '' });
//   }, [appliedDiscounts.length]);

//   return (
//     // ✨ Stripped bulky padding and huge gaps. Set to minimal gap-3.
//     <div aria-labelledby="cart-summary" className={`${className} bg-white font-montserrat flex flex-col gap-3`}>
      
//       {/* --- TOTALS HEADER & DISCOUNT INPUT --- */}
//       <div>
//         <h4 className="text-[14px] font-bold text-[#252B42] mb-2">Totals</h4>
        
//         {appliedDiscounts.length > 0 && (
//           <div className="mb-2 space-y-1">
//             {appliedDiscounts.map((discount) => (
//               <div key={discount.code} className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded px-2 py-1 text-[12px]">
//                 <code className="text-[#252B42] font-semibold">{discount.code}</code>
//                 <UpdateDiscountForm discountCodes={[]}>
//                   <button type="submit" className="text-gray-400 hover:text-red-500 font-bold text-base leading-none">×</button>
//                 </UpdateDiscountForm>
//               </div>
//             ))}
//           </div>
//         )}

//         {attemptedDiscount && appliedDiscounts.length === 0 && !message.text && (
//           <p className="text-gray-500 text-[11px] mb-1">Checking...</p>
//         )}

//         {!attemptedDiscount && message.text && appliedDiscounts.length === 0 && (
//           <p className={message.type === 'error' ? 'text-red-500 text-[11px] mb-1' : 'text-green-600 text-[11px] mb-1'}>
//             {message.text}
//           </p>
//         )}

//         {appliedDiscounts.length === 0 && (
//           <UpdateDiscountForm discountCodes={[]}>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 name="discountCode"
//                 value={discountInput}
//                 onChange={(e) => {
//                   setDiscountInput(e.target.value);
//                   if (!e.target.value.trim()) setMessage({ type: '', text: '' });
//                   setAttemptedDiscount(false);
//                 }}
//                 placeholder="Discount code"
//                 // ✨ Shrunk inputs: smaller text, tighter padding
//                 className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-[12px] text-[#252B42] placeholder-[#A3A3A3] focus:outline-none focus:border-[#23A6F0]"
//               />
//               <button 
//                 type="submit" 
//                 disabled={!discountInput.trim()}
//                 onClick={() => { setStatus('checking'); setAttemptedDiscount(true); }}
//                 // ✨ Shrunk buttons: matched reference grayed-out look
//                 className="bg-[#352e32] text-[#fff] px-4 py-1.5 rounded font-bold text-[12px]  hover:bg-[#000000] hover:text-[#ffffff] transition-colors"
//               >
//                 Apply
//               </button>
//             </div>
//           </UpdateDiscountForm>
//         )}
//       </div>

//       {/* --- PRICE BREAKDOWN --- */}
//       {/* ✨ Reduced line-heights and font sizes to 13px */}
//       <dl className="space-y-1.5 text-[13px]">
//         <div className="flex justify-between items-center">
//           <dt className="text-[#252B42]">Subtotal</dt>
//           <dd className="font-bold text-[#252B42]">
//             {hasDiscounts && originalSubtotal ? (
//               <span className="line-through text-gray-400"><Money data={originalSubtotal} /></span>
//             ) : (
//               subtotal?.amount ? <Money data={subtotal} /> : '-'
//             )}
//           </dd>
//         </div>

//         {discountAmount && (
//           <div className="flex justify-between items-center">
//             <dt className="text-[#252B42]">Discount</dt>
//             <dd className="text-red-500 font-medium">- <Money data={discountAmount} /></dd>
//           </div>
//         )}

//         {giftCardDeductionAmount && (
//           <div className="flex justify-between items-center">
//             <dt className="text-[#252B42]">Gift Card</dt>
//             <dd className="text-red-500 font-medium">- <Money data={giftCardDeductionAmount} /></dd>
//           </div>
//         )}
        
//         <div className="flex justify-between items-center">
//           <dt className="text-[#737373]">Delivery</dt>
//           <dd className="text-[#737373]">Calculated at checkout</dd>
//         </div>

//         <div className="flex justify-between items-center">
//           <dt className="text-[#737373]">Tax</dt>
//           <dd className="text-[#737373]">Calculated at checkout</dd>
//         </div>

//         <div className="flex justify-between items-center pt-2 mt-1 border-t border-gray-100">
//           <dt className="text-[15px] font-bold text-[#252B42]">Total</dt>
//           <dd className="text-[15px] font-bold text-[#252B42]">
//             {total?.amount ? <Money data={total} /> : '-'}
//           </dd>
//         </div>
//       </dl>

//       {/* --- CHECKOUT ACTIONS --- */}
//       <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
      
//       {/* --- GIFT CARD SECTION --- */}
//       <CartGiftCard giftCardCodes={cart?.appliedGiftCards} totalGiftCardAmount={giftCardDeductionAmount} />
//     </div>
//   );
// }

// /**
//  * @param {{checkoutUrl?: string}}
//  */
// function CartCheckoutActions({checkoutUrl}) {
//   if (!checkoutUrl) return null;
//   return (
//     <div>
//       <a href={checkoutUrl} target="_self" className="block w-full bg-[#00A0FF] hover:bg-[#008AE6] text-white text-center font-bold text-[13px] py-2.5 rounded transition-colors uppercase tracking-widest shadow-sm">
//         PAY
//       </a>
//     </div>
//   );
// }

// /**
//  * @param {{ discountCodes?: string[]; children: React.ReactNode; }}
//  */
// function UpdateDiscountForm({discountCodes, children}) {
//   return (
//     <CartForm route="/cart" action={CartForm.ACTIONS.DiscountCodesUpdate} inputs={{ discountCodes: discountCodes || [] }}>
//       {children}
//     </CartForm>
//   );
// }

// /**
//  * @param {{ giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined; totalGiftCardAmount?: { amount: string; currencyCode: string } | null; }}
//  */
// function CartGiftCard({giftCardCodes}) {
//   const appliedGiftCardCodes = useRef([]);
//   const giftCardCodeInput = useRef(null);
//   const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
//   const [giftCardInput, setGiftCardInput] = useState('');
//   const [giftCardMessage, setGiftCardMessage] = useState({ type: '', text: '' });
//   const [attemptedGiftCard, setAttemptedGiftCard] = useState(false);
//   const prevGiftCardCount = useRef(giftCardCodes?.length || 0);

//   useEffect(() => {
//     if (!attemptedGiftCard) return;
//     const timer = setTimeout(() => {
//       const currentCount = giftCardCodes?.length || 0;
//       if (currentCount > prevGiftCardCount.current) setGiftCardMessage({ type: 'success', text: 'Applied' });
//       else setGiftCardMessage({ type: 'error', text: 'Invalid code' });
//       prevGiftCardCount.current = currentCount;
//       setAttemptedGiftCard(false);
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, [giftCardCodes, attemptedGiftCard]);

//   useEffect(() => {
//     if (giftCardCodes && giftCardCodes.length > 0) setGiftCardMessage({ type: '', text: '' });
//   }, [giftCardCodes]);

//   useEffect(() => {
//     if (giftCardAddFetcher.data) {
//       setGiftCardInput('');
//       if (giftCardCodeInput.current) giftCardCodeInput.current.value = '';
//     }
//   }, [giftCardAddFetcher.data]);

//   function saveAppliedCode(code) {
//     const formattedCode = code.replace(/\s/g, ''); 
//     if (!appliedGiftCardCodes.current.includes(formattedCode)) appliedGiftCardCodes.current.push(formattedCode);
//   }

//   return (
//     <div className="pt-1 border-t border-gray-100">
//       <h4 className="text-[13px] font-medium text-[#252B42] mb-1.5 mt-1">Gift Cards</h4>
      
//       {giftCardCodes && giftCardCodes.length > 0 && (
//         <div className="mb-1.5 space-y-1">
//           {giftCardCodes.map((giftCard) => (
//             <div key={giftCard.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded px-2 py-1 text-[12px]">
//               <code className="text-[#252B42] font-semibold">***{giftCard.lastCharacters}</code>
//               <RemoveGiftCardForm giftCardId={giftCard.id}>
//                 <button type="submit" className="text-gray-400 hover:text-red-500 font-bold text-base leading-none">×</button>
//               </RemoveGiftCardForm>
//             </div>
//           ))}
//         </div>
//       )}

//       {!attemptedGiftCard && giftCardMessage.text && (!giftCardCodes || giftCardCodes.length === 0) && (
//         <p className={giftCardMessage.type === 'error' ? 'text-red-500 text-[11px] mb-1' : 'text-green-600 text-[11px] mb-1'}>
//           {giftCardMessage.text}
//         </p>
//       )}

//       <UpdateGiftCardForm giftCardCodes={appliedGiftCardCodes.current} saveAppliedCode={saveAppliedCode} fetcherKey="gift-card-add" giftCardInput={giftCardInput}>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             name="giftCardCode"
//             placeholder="Gift card code"
//             ref={giftCardCodeInput}
//             onChange={(e) => {
//               setGiftCardInput(e.target.value);
//               setGiftCardMessage({ type: '', text: '' });
//             }}
//             value={giftCardInput}
//             className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-[12px] text-[#252B42] placeholder-[#A3A3A3] focus:outline-none focus:border-[#23A6F0]"
//           />
//           <button 
//             type="submit" 
//             disabled={giftCardAddFetcher.state !== 'idle' || !giftCardInput.trim()}
//             onClick={() => setAttemptedGiftCard(true)}
//             className="bg-[#352e32] text-[#fff] px-4 py-1.5 rounded font-bold text-[12px] hover:bg-[#000] hover:text-white transition-colors"
//           >
//             Apply
//           </button>
//         </div>
//       </UpdateGiftCardForm>
//     </div>
//   );
// }

// /**
//  * @param {{ giftCardCodes?: string[]; saveAppliedCode?: (code: string) => void; fetcherKey?: string; children: React.ReactNode; }}
//  */
// function UpdateGiftCardForm({ giftCardCodes, saveAppliedCode, fetcherKey, children }) {
//   return (
//     <CartForm fetcherKey={fetcherKey} route="/cart" action={CartForm.ACTIONS.GiftCardCodesUpdate} inputs={{ giftCardCodes: giftCardCodes || [] }}>
//       {(fetcher) => {
//         const code = fetcher.formData?.get('giftCardCode');
//         if (code && saveAppliedCode) saveAppliedCode(code);
//         return children;
//       }}
//     </CartForm>
//   );
// }

// /**
//  * @param {{ giftCardId: string; children: React.ReactNode; }}
//  */
// function RemoveGiftCardForm({giftCardId, children}) {
//   return (
//     <CartForm route="/cart" action={CartForm.ACTIONS.GiftCardCodesRemove} inputs={{ giftCardCodes: [giftCardId] }}>
//       {children}
//     </CartForm>
//   );
// }
import {CartForm, Money} from '@shopify/hydrogen';
import {useEffect, useRef, useState} from 'react';
import {useFetcher} from 'react-router';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout, globalData}) {
  const className = layout === 'page' ? 'w-full lg:w-[400px]' : 'w-full';
  
  // Helper functions for styling with globalData
  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const getButtonStyle = (type = 'primary', isDisabled = false) => {
    if (!globalData?.buttons) return {};
    
    const buttons = globalData.buttons;
    const links = globalData.linksEffect || { transitionDuration: 300 };
    
    if (isDisabled) {
      return {
        backgroundColor: '#9CA3AF',
        color: '#FFFFFF',
        borderRadius: `${buttons.borderRadius}px`,
        cursor: 'not-allowed',
      };
    }
    
    if (type === 'primary') {
      return {
        backgroundColor: formatColor(buttons.primaryBg),
        color: formatColor(buttons.primaryText),
        borderRadius: `${buttons.borderRadius}px`,
        transition: `all ${links.transitionDuration}ms ease`,
      };
    } else {
      return {
        backgroundColor: formatColor(buttons.secondaryBg),
        color: formatColor(buttons.secondaryText),
        borderRadius: `${buttons.borderRadius}px`,
        transition: `all ${links.transitionDuration}ms ease`,
      };
    }
  };
  
  const getLinkStyle = () => {
    if (!globalData?.linksEffect) return {};
    const links = globalData.linksEffect;
    return {
      color: formatColor(links.linkColor),
      transition: `color ${links.transitionDuration}ms ease`,
      textDecoration: links.underlineStyle === 'none' ? 'none' : 'underline',
    };
  };

  const getHoverStyle = () => {
    if (!globalData?.linksEffect) return {};
    return {
      color: formatColor(globalData.linksEffect.hoverColor),
    };
  };

  // Dynamic colors from globalData
  const primaryColor = formatColor(globalData?.buttons?.primaryBg) || '#00A0FF';
  const primaryHoverColor = formatColor(globalData?.buttons?.primaryHoverBg) || '#008AE6';
  const primaryTextColor = formatColor(globalData?.buttons?.primaryText) || '#FFFFFF';
  const primaryHoverTextColor = formatColor(globalData?.buttons?.primaryHoverText) || primaryTextColor;
  
  const secondaryColor = formatColor(globalData?.buttons?.secondaryBg) || '#352e32';
  const secondaryHoverColor = formatColor(globalData?.buttons?.secondaryHoverBg) || '#000000';
  const secondaryTextColor = formatColor(globalData?.buttons?.secondaryText) || '#FFFFFF';
const secondaryHoverTextColor =
  formatColor(globalData?.buttons?.secondaryHovertxt) || '#000000';
  
  const textColor = formatColor(globalData?.linksEffect?.linkColor) || '#252B42';
  const labelColor = formatColor(globalData?.linksEffect?.linkColor) || '#737373';
  const borderRadius = globalData?.buttons?.borderRadius || 8;
  
  const [discountInput, setDiscountInput] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [attemptedDiscount, setAttemptedDiscount] = useState(false);
  const [status, setStatus] = useState('idle');
  
  const appliedDiscounts = cart?.discountCodes?.filter((discount) => discount.applicable) || [];

  const subtotal = cart?.cost?.subtotalAmount;
  const total = cart?.cost?.totalAmount;
  
  let totalDiscountAmount = 0;
  cart?.lines?.nodes?.forEach((line) => {
    line.discountAllocations?.forEach((discount) => {
      if (discount.discountedAmount?.amount) {
        totalDiscountAmount += parseFloat(discount.discountedAmount.amount);
      }
    });
  });

  let totalGiftCardAmount = 0;
  cart?.appliedGiftCards?.forEach((giftCard) => {
    if (giftCard.amountUsed?.amount) {
      totalGiftCardAmount += parseFloat(giftCard.amountUsed.amount);
    }
  });
  
  let discountAmount = null;
  if (totalDiscountAmount > 0) {
    discountAmount = { amount: totalDiscountAmount.toFixed(2), currencyCode: subtotal?.currencyCode || 'USD' };
  }

  let giftCardDeductionAmount = null;
  if (totalGiftCardAmount > 0) {
    giftCardDeductionAmount = { amount: totalGiftCardAmount.toFixed(2), currencyCode: subtotal?.currencyCode || 'USD' };
  }

  const originalSubtotalAmount = subtotal?.amount ? (parseFloat(subtotal.amount) + totalDiscountAmount).toFixed(2) : null;
  const originalSubtotal = originalSubtotalAmount ? { amount: originalSubtotalAmount, currencyCode: subtotal?.currencyCode || 'USD' } : null;
  const hasDiscounts = totalDiscountAmount > 0;

  useEffect(() => {
    if (!attemptedDiscount) return;
    const timer = setTimeout(() => {
      if (appliedDiscounts.length > 0) setMessage({ type: 'success', text: 'Discount applied' });
      else setMessage({ type: 'error', text: 'Invalid code' });
      setStatus('result');
      setAttemptedDiscount(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [appliedDiscounts.length, attemptedDiscount]);

  useEffect(() => {
    if (appliedDiscounts.length === 0) setMessage({ type: '', text: '' });
  }, [appliedDiscounts.length]);

  return (
    <div aria-labelledby="cart-summary" className={`${layout === 'aside' ? className : 'sm:w-[85%] mx-auto xl:w-[510px]'} bg-white font-montserrat flex flex-col gap-[35px]`}>
      
      {/* --- TOTALS HEADER & DISCOUNT INPUT --- */}
      <div>
       { layout == 'aside' &&  <h4 className="text-[14px] font-bold mb-2" style={{ color: textColor }}>Totals</h4>}
        
        {appliedDiscounts.length > 0 && (
          <div className="mb-2 space-y-1">
            {appliedDiscounts.map((discount) => (
              <div key={discount.code} className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded px-2 py-1 text-[12px]">
                <code className="font-semibold" style={{ color: textColor }}>{discount.code}</code>
                <UpdateDiscountForm discountCodes={[]}>
                  <button 
                    type="submit" 
                    className="text-gray-400 hover:text-red-500 font-bold text-base leading-none"
                    style={{ transition: `color ${globalData?.linksEffect?.transitionDuration || 300}ms ease` }}
                  >
                    ×
                  </button>
                </UpdateDiscountForm>
              </div>
            ))}
          </div>
        )}

        {attemptedDiscount && appliedDiscounts.length === 0 && !message.text && (
          <p className="text-gray-500 text-[11px] mb-1">Checking...</p>
        )}

        {!attemptedDiscount && message.text && appliedDiscounts.length === 0 && (
          <p className={message.type === 'error' ? 'text-red-500 text-[11px] mb-1' : 'text-green-600 text-[11px] mb-1'}>
            {message.text}
          </p>
        )}

        {appliedDiscounts.length === 0 && (
          <UpdateDiscountForm discountCodes={[]}>
            <div className={`flex gap-2 bg-[#F9F9F9] rounded-[12px] ${layout === "page" ? "px-[5px] py-[10px] sm:px-[13px] sm:py-[26px]" : "px-[5px] py-[10px]"}`}>
              <input
                type="text"
                name="discountCode"
                value={discountInput}
                onChange={(e) => {
                  setDiscountInput(e.target.value);
                  if (!e.target.value.trim()) setMessage({ type: '', text: '' });
                  setAttemptedDiscount(false);
                }}
                placeholder="Promocode"
                className="flex-1 border-none rounded text-[18px] text-[#808080] font-normal placeholder-[#A3A3A3] focus:outline-none bg-transparent"
                style={{ color: textColor }}
              />
              <button 
                type="submit" 
                disabled={!discountInput.trim()}
                onClick={() => { setStatus('checking'); setAttemptedDiscount(true); }}
                className="px-[16.5px] py-[8.5px] rounded font-medium text-[18px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#090909',
                  color: '#FAFAFA',
                    borderRadius: '5px',
                  transition: `all ${globalData?.linksEffect?.transitionDuration || 300}ms ease`,
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = secondaryHoverColor;
                    e.currentTarget.style.color = secondaryHoverTextColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = secondaryColor;
                    e.currentTarget.style.color = secondaryTextColor;
                  }
                }}
              >
                Apply
              </button>
            </div>
          </UpdateDiscountForm>
        )}
      </div>

      {/* --- PRICE BREAKDOWN --- */}
      <dl className="flex flex-col gap-[14px] text-[13px]">
        <div className={`flex justify-between items-center ${layout === "page" ? "text-[28px]" : "text-[22px]"} font-normal leading-none`}>
          <dt style={{ color: '#3C3C3C' }}>Subtotal</dt>
          <dd className="" style={{ color: '#3C3C3C' }}>
            {hasDiscounts && originalSubtotal ? (
              <span className="line-through text-[#3C3C3C]"><Money data={originalSubtotal} /></span>
            ) : (
              subtotal?.amount ? <Money data={subtotal} /> : '-'
            )}
          </dd>
        </div>

        {discountAmount && (
          <div className={`flex justify-between items-center ${layout === "page" ? "text-[22px]" : "text-[16px]"} font-normal leading-none`}>
            <dt style={{ color: '#808080' }}>Discount</dt>
            <dd className="text-red-500 font-medium">- <Money data={discountAmount} /></dd>
          </div>
        )}

        {giftCardDeductionAmount && (
          <div className={`flex justify-between items-center ${layout === "page" ? "text-[22px]" : "text-[16px]"} font-normal leading-none`}>
            <dt style={{ color: '#808080' }}>Gift Card</dt>
            <dd className="text-red-500 font-medium">- <Money data={giftCardDeductionAmount} /></dd>
          </div>
        )}
        
        <div className={`flex justify-between items-center ${layout === "page" ? "text-[22px]" : "text-[16px]"} font-normal leading-none`}>
          <dt style={{ color: '#808080' }}>Delivery</dt>
          <dd style={{ color: '#808080' }}>Calculated at checkout</dd>
        </div>

        <div className={`flex justify-between items-center ${layout === "page" ? "text-[22px]" : "text-[16px]"} font-normal leading-none`}>
          <dt style={{ color: '#808080' }}>Tax</dt>
          <dd style={{ color: '#808080' }}>Calculated at checkout</dd>
        </div>

      </dl>

      <div className={`flex justify-between items-center ${layout === "page" ? "text-[28px]" : "text-[22px]"} font-normal leading-none`}>
          <dt style={{ color: '#3C3C3C' }}>Total</dt>
          <dd className="" style={{ color: '#3C3C3C' }}>
            {total?.amount ? <Money data={total} /> : '-'}
          </dd>
        </div>

      {/* --- CHECKOUT ACTIONS --- */}
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} globalData={globalData} />
      
      {/* --- GIFT CARD SECTION --- */}
      <CartGiftCard 
        giftCardCodes={cart?.appliedGiftCards} 
        totalGiftCardAmount={giftCardDeductionAmount} 
        globalData={globalData}
      />
    </div>
  );
}

/**
 * @param {{checkoutUrl?: string, globalData?: object}}
 */
function CartCheckoutActions({checkoutUrl, globalData}) {
  if (!checkoutUrl) return null;
  
  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const primaryColor = formatColor(globalData?.buttons?.primaryBg) || '#00A0FF';
  const primaryHoverColor = formatColor(globalData?.buttons?.primaryHoverBg) || '#008AE6';
  const primaryTextColor = formatColor(globalData?.buttons?.primaryText) || '#FFFFFF';
  const primaryHoverTextColor = formatColor(globalData?.buttons?.primaryHoverText) || primaryTextColor;
  const borderRadius = globalData?.buttons?.borderRadius || 8;
  
  return (
    <div>
      <a 
        href={checkoutUrl} 
        target="_self" 
        className="block w-full text-center font-normal text-[24px] px-[137px] py-[14px] rounded transition-all uppercase tracking-widest shadow-sm leading-none"
        style={{
          backgroundColor: primaryColor,
          color: primaryTextColor,
          borderRadius: `5px`,
          transition: `all ${globalData?.linksEffect?.transitionDuration || 300}ms ease`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = primaryHoverColor;
          e.currentTarget.style.color = primaryHoverTextColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = primaryColor;
          e.currentTarget.style.color = primaryTextColor;
        }}
      >
        PAY
      </a>
    </div>
  );
}

/**
 * @param {{ discountCodes?: string[]; children: React.ReactNode; }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm route="/cart" action={CartForm.ACTIONS.DiscountCodesUpdate} inputs={{ discountCodes: discountCodes || [] }}>
      {children}
    </CartForm>
  );
}

/**
 * @param {{ giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined; totalGiftCardAmount?: { amount: string; currencyCode: string } | null; globalData?: object; }}
 */
function CartGiftCard({giftCardCodes, globalData}) {
  const appliedGiftCardCodes = useRef([]);
  const giftCardCodeInput = useRef(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const [giftCardInput, setGiftCardInput] = useState('');
  const [giftCardMessage, setGiftCardMessage] = useState({ type: '', text: '' });
  const [attemptedGiftCard, setAttemptedGiftCard] = useState(false);
  const prevGiftCardCount = useRef(giftCardCodes?.length || 0);
  
  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const textColor = formatColor(globalData?.linksEffect?.linkColor) || '#252B42';
  const secondaryColor = formatColor(globalData?.buttons?.secondaryBg) || '#352e32';
  const secondaryHoverColor = formatColor(globalData?.buttons?.secondaryHoverBg) || '#000000';
  const secondaryTextColor = formatColor(globalData?.buttons?.secondaryText) || '#FFFFFF';
  const secondaryHoverTextColor = formatColor(globalData?.buttons?.secondaryHovertxt) || '#000';
  const borderRadius = globalData?.buttons?.borderRadius || 8;

  useEffect(() => {
    if (!attemptedGiftCard) return;
    const timer = setTimeout(() => {
      const currentCount = giftCardCodes?.length || 0;
      if (currentCount > prevGiftCardCount.current) setGiftCardMessage({ type: 'success', text: 'Applied' });
      else setGiftCardMessage({ type: 'error', text: 'Invalid code' });
      prevGiftCardCount.current = currentCount;
      setAttemptedGiftCard(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [giftCardCodes, attemptedGiftCard]);

  useEffect(() => {
    if (giftCardCodes && giftCardCodes.length > 0) setGiftCardMessage({ type: '', text: '' });
  }, [giftCardCodes]);

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      setGiftCardInput('');
      if (giftCardCodeInput.current) giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  function saveAppliedCode(code) {
    const formattedCode = code.replace(/\s/g, ''); 
    if (!appliedGiftCardCodes.current.includes(formattedCode)) appliedGiftCardCodes.current.push(formattedCode);
  }

  return (
    <div className="pt-1 border-t border-gray-100">
      <h4 className="text-[13px] font-medium mb-1.5 mt-1" style={{ color: textColor }}>Gift Cards</h4>
      
      {giftCardCodes && giftCardCodes.length > 0 && (
        <div className="mb-1.5 space-y-1">
          {giftCardCodes.map((giftCard) => (
            <div key={giftCard.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded px-2 py-1 text-[12px]">
              <code className="font-semibold" style={{ color: textColor }}>***{giftCard.lastCharacters}</code>
              <RemoveGiftCardForm giftCardId={giftCard.id}>
                <button 
                  type="submit" 
                  className="text-gray-400 hover:text-red-500 font-bold text-base leading-none"
                  style={{ transition: `color ${globalData?.linksEffect?.transitionDuration || 300}ms ease` }}
                >
                  ×
                </button>
              </RemoveGiftCardForm>
            </div>
          ))}
        </div>
      )}

      {!attemptedGiftCard && giftCardMessage.text && (!giftCardCodes || giftCardCodes.length === 0) && (
        <p className={giftCardMessage.type === 'error' ? 'text-red-500 text-[11px] mb-1' : 'text-green-600 text-[11px] mb-1'}>
          {giftCardMessage.text}
        </p>
      )}

      <UpdateGiftCardForm giftCardCodes={appliedGiftCardCodes.current} saveAppliedCode={saveAppliedCode} fetcherKey="gift-card-add" giftCardInput={giftCardInput}>
        <div className="flex gap-2">
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            onChange={(e) => {
              setGiftCardInput(e.target.value);
              setGiftCardMessage({ type: '', text: '' });
            }}
            value={giftCardInput}
            className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-[12px] placeholder-[#A3A3A3] focus:outline-none focus:border-[#23A6F0]"
            style={{ color: textColor }}
          />
          <button 
            type="submit" 
            disabled={giftCardAddFetcher.state !== 'idle' || !giftCardInput.trim()}
            onClick={() => setAttemptedGiftCard(true)}
            className="px-4 py-1.5 rounded font-bold text-[12px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: secondaryColor,
              color: secondaryTextColor,
              borderRadius: '5px',
              transition: `all ${globalData?.linksEffect?.transitionDuration || 300}ms ease`,
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = secondaryHoverColor;
                e.currentTarget.style.color = secondaryHoverTextColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = secondaryColor;
                e.currentTarget.style.color = secondaryTextColor;
              }
            }}
          >
            Apply
          </button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

/**
 * @param {{ giftCardCodes?: string[]; saveAppliedCode?: (code: string) => void; fetcherKey?: string; children: React.ReactNode; }}
 */
function UpdateGiftCardForm({ giftCardCodes, saveAppliedCode, fetcherKey, children }) {
  return (
    <CartForm fetcherKey={fetcherKey} route="/cart" action={CartForm.ACTIONS.GiftCardCodesUpdate} inputs={{ giftCardCodes: giftCardCodes || [] }}>
      {(fetcher) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) saveAppliedCode(code);
        return children;
      }}
    </CartForm>
  );
}

/**
 * @param {{ giftCardId: string; children: React.ReactNode; }}
 */
function RemoveGiftCardForm({giftCardId, children}) {
  return (
    <CartForm route="/cart" action={CartForm.ACTIONS.GiftCardCodesRemove} inputs={{ giftCardCodes: [giftCardId] }}>
      {children}
    </CartForm>
  );
}