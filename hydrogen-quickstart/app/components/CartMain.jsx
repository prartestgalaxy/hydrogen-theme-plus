
import { useOptimisticCart } from '@shopify/hydrogen';
import { Link } from 'react-router';
import { useAside } from '~/components/Aside';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';
import { FreeShippingBar } from '~/components/FreeShippingBar';
import { useParams } from 'react-router';
import { useState } from 'react';

export function CartMain({layout, cart: originalCart, freeShippingSettings, cartSettings, isWishlistEnabled, isLoggedIn, wishlist, onWishlistUpdate, locale, globalData}) {
  const cart = useOptimisticCart(originalCart);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);
  
  // Dynamic style helpers using global data
  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const getButtonStyle = (type = 'primary', isDisabled = false) => {
   if (!globalData?.buttons) {
  return {
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '8px',
  };
}
    
    const buttons = globalData.buttons;
    const links = globalData.linksEffect || { transitionDuration: 300 };
    
    if (isDisabled) {
      return {
        backgroundColor: '#9CA3AF',
        color: '#FFFFFF',
       borderRadius: `${buttons.borderRadius || 8}px`,
        cursor: 'not-allowed',
      };
    }
    
    if (type === 'primary') {
      return {
        backgroundColor: formatColor(buttons.primaryBg),
        color: formatColor(buttons.primaryText),
        borderRadius: `${buttons.borderRadius || 8}px`,
        transition: `all ${links.transitionDuration}ms ease`,
      };
    } else {
      return {
        backgroundColor: formatColor(buttons.secondaryBg),
        color: formatColor(buttons.secondaryText),
        borderRadius: `${buttons.borderRadius || 8}px`,
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

  const primaryColor = formatColor(globalData?.buttons?.primaryBg) || '#00A0FF';
  const primaryHoverColor = formatColor(globalData?.buttons?.primaryHoverBg) || '#008AE6';
  const borderRadius = globalData?.buttons?.borderRadius || 8;

  const shouldShowFreeShippingBar = () => {
    if (!freeShippingSettings?.enabled) return false;
    if (!cart?.totalQuantity || cart.totalQuantity === 0) return false;
    if (layout === 'page' && freeShippingSettings.showOnCartPage) return true;
    if (layout === 'aside' && freeShippingSettings.showInCartDrawer) return true;
    return false;
  };

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount = cart && Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  const toggleSummaryExpand = () => {
    setIsSummaryExpanded(!isSummaryExpanded);
  };

  const { close } = useAside();

  return (
    <div className={className}>
      {shouldShowFreeShippingBar() && (
        <FreeShippingBar settings={freeShippingSettings} cart={cart} globalData={globalData} />
      )}

      {layout === 'page' && (
        <div className="flex flex-col w-full max-w-[1440px] px-6 md:px-[28px] py-[24px] mx-auto">
          <nav className="flex items-center gap-[15px] text-sm font-bold" style={{ color: formatColor(globalData?.linksEffect?.linkColor) || '#737373' }}>
            <Link 
              to="/" 
              style={{...getLinkStyle(),
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.2px',
                fontWeight: '700'
              }}
              onMouseEnter={(e) => {
                const hoverStyle = getHoverStyle();
                if (hoverStyle.color) {
                  e.currentTarget.style.color = hoverStyle.color;
                }
              }}
              onMouseLeave={(e) => {
                const linkStyle = getLinkStyle();
                if (linkStyle.color) {
                  e.currentTarget.style.color = linkStyle.color;
                }
              }}
            >
              Home
            </Link>
            <span className="text-gray-400">›</span>
            <Link 
              to="/collections/all" 
              // style={getLinkStyle() }
              className="text-[#BDBDBD]"
              style={{
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.2px',
                fontWeight: '700'
              }}
              onMouseEnter={(e) => {
                const hoverStyle = getHoverStyle();
                if (hoverStyle.color) {
                  e.currentTarget.style.color = hoverStyle.color;
                }
              }}
              onMouseLeave={(e) => {
                const linkStyle = getLinkStyle();
                if (linkStyle.color) {
                  e.currentTarget.style.color = '#BDBDBD';
                }
              }}
            >
              Shop
            </Link>

            <span className="text-gray-400">›</span>
            <span className="font-medium text-[#BDBDBD] text-[14px] leading-[24px] tracking-[0.2px] !font-bold" >Cart</span>
          </nav>
        </div>
      )}
      
      <CartEmpty hidden={linesCount} layout={layout} globalData={globalData} />
      
      <div className={`cart-details ${layout === 'aside' ? 'h-[calc(100vh-80px)] flex flex-col overflow-hidden' : ''}`}>
        {layout === 'page' ? (
          <div className="w-full max-w-[1440px] px-2 sm:px-6 pb-[102px] md:px-[28px] mx-auto opacity-100">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:items-start"> 
              <div className="w-full" aria-labelledby="cart-lines">
                <ul className="flex flex-col gap-[31px]">
                  {(cart?.lines?.nodes ?? []).map((line) => (
                    <CartLineItem 
                      key={line.id} 
                      line={line} 
                      layout={layout} 
                      isWishlistEnabled={isWishlistEnabled} 
                      isLoggedIn={isLoggedIn}   
                      // wishlist={wishlist} 
                      // onWishlistUpdate={onWishlistUpdate} 
                      locale={locale}
                      globalData={globalData}
                    />
                  ))}
                </ul>
              </div>
              {cartHasItems && (
                <div className="w-full xl:w-fit h-fit flex flex-col gap-[14px]">
                  {
                    layout == 'page' && 
                    <div className="text-[28px] font-normal text-[#3C3C3C]">Delivery</div>
                  }
                  <CartSummary cart={cart} layout={layout} globalData={globalData} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-0 pb-2 md:px-4 pb-4">
              <ul className="space-y-4 mx-2 mt-2">
                {(cart?.lines?.nodes ?? []).map((line) => (
                  <CartLineItem 
                    key={line.id} 
                    line={line} 
                    layout={layout} 
                    isWishlistEnabled={isWishlistEnabled}
                    isLoggedIn={isLoggedIn}
                    // wishlist={wishlist}
                    // onWishlistUpdate={onWishlistUpdate}
                    locale={locale}
                    globalData={globalData}
                  />
                ))}
              </ul>
            </div>

            {cartHasItems && (
              <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4 md:p-0">
                <button
                  onClick={toggleSummaryExpand}
                  className="w-full flex items-center justify-between px-0 py-6 md:p-4 bg-white md:hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${!isSummaryExpanded ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="font-medium" style={{ color: formatColor(globalData?.linksEffect?.linkColor) || '#737373' }}>
                      Order Summary
                    </span>
                  </div>
                  
                  {!isSummaryExpanded && (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm" style={{ color: formatColor(globalData?.linksEffect?.linkColor) || '#737373' }}>Total:</span>
                      <span className="font-bold" style={{ color: formatColor(globalData?.linksEffect?.linkColor) || '#737373' }}>
                        {cart?.cost?.subtotalAmount?.amount ? 
                          new Intl.NumberFormat(locale === 'us' ? 'en-US' : 'en-GB', {
                            style: 'currency',
                           currency: cart?.cost?.subtotalAmount?.currencyCode || 'USD'
                          }).format(cart.cost.subtotalAmount.amount) 
                          : '$0.00'
                        }
                      </span>
                    </div>
                  )}
                </button>

                {isSummaryExpanded && (
                  <div className="p-0 md:p-4 pt-0">
                    <CartSummary cart={cart} layout={layout} globalData={globalData} />
                  </div>
                )}

                {!isSummaryExpanded && (
                  <div className="p-0 md:p-4 pt-0">
                    <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} globalData={globalData} />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CartEmpty({ hidden = false, globalData }) {
  const { close } = useAside();
  const { locale = 'us' } = useParams();
  
  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const getButtonStyle = () => {
    if (!globalData?.buttons) return {};
    const buttons = globalData.buttons;
    return {
      backgroundColor: formatColor(buttons.primaryBg),
      color: formatColor(buttons.primaryText),
     borderRadius: `${buttons.borderRadius || 8}px`,
      transition: `all ${globalData?.linksEffect?.transitionDuration || 300}ms ease`,
    };
  };

  const primaryColor = formatColor(globalData?.buttons?.primaryBg) || '#00A0FF';
  const primaryHoverColor = formatColor(globalData?.buttons?.primaryHoverBg) || '#008AE6';

  return (
    <div hidden={hidden} className="w-full max-w-[1440px] px-[28px] mx-auto py-12 flex-1">
      <p className="text-lg" style={{ color: formatColor(globalData?.linksEffect?.linkColor) || '#737373' }}>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you started!
      </p>
      <br />
      <Link 
        to={`/${locale}/collections/all`}
        onClick={close} 
        prefetch="viewport"
        className="inline-block px-8 py-3 rounded font-bold uppercase tracking-wider text-sm transition-opacity hover:opacity-90"
        style={getButtonStyle()}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = primaryHoverColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = primaryColor;
        }}
      >
        Continue shopping →
      </Link>
    </div>
  );
}

function CartCheckoutActions({ checkoutUrl, globalData }) {
  if (!checkoutUrl) return null;
  
 const formatColor = (color, fallback = null) => {
  if (!color) return fallback;
  return color.startsWith('#') ? color : `#${color}`;
};

  const getButtonStyle = () => {
   if (!globalData?.buttons) {
  return {
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '8px',
  };
}
    const buttons = globalData.buttons;
    return {
      backgroundColor: formatColor(buttons.primaryBg),
      color: formatColor(buttons.primaryText),
     borderRadius: `${buttons.borderRadius || 8}px`,
      transition: `all ${globalData?.linksEffect?.transitionDuration || 300}ms ease`,
    };
  };

  const primaryColor = formatColor(globalData?.buttons?.primaryBg) || '#00A0FF';
  const primaryHoverColor = formatColor(globalData?.buttons?.primaryHoverBg) || '#008AE6';

  return (
    <div>
      <a 
        href={checkoutUrl} 
        target="_self" 
        className="block w-full text-center font-bold text-[13px] py-2.5 rounded transition-opacity uppercase tracking-widest shadow-sm hover:opacity-90"
        style={getButtonStyle()}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = primaryHoverColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = primaryColor;
        }}
      >
        PAY
      </a>
    </div>
  );
}