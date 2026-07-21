import {CartForm} from '@shopify/hydrogen';
import {useParams, useFetcher} from 'react-router';
import {useState, useEffect} from 'react';

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: Array<OptimisticCartLineInput>;
 *   onClick?: () => void;
 *   className?: string;
 *   variant?: 'primary' | 'secondary' | 'outline';
 *   size?: 'sm' | 'md' | 'lg';
 *   showPrice?: boolean;
 *   price?: any;
 *   availableForSale?: boolean;
 * }}
 */
export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className = '',
  variant = 'primary',
  size = 'lg',
  showPrice = false,
  price,
  availableForSale = true,
  style = {},
  globalData = null,
}) {
  const {locale} = useParams();
  const cartRoute = locale ? `/${locale}/cart` : '/cart';
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatColor = (c) => (!c ? null : c.startsWith('#') ? c : `#${c}`);
  const primaryBg = formatColor(globalData?.buttons?.primaryBg) || '#23A6F0';
  const primaryHoverBg =
    formatColor(globalData?.buttons?.primaryHoverBg) || '#1a7ab0';
  const primaryText =
    formatColor(globalData?.buttons?.primaryText) || '#FFFFFF';
  const primaryHoverText =
    formatColor(globalData?.buttons?.primaryHovertxt) || '#FFFFFF';
  const secondaryBg =
    formatColor(globalData?.buttons?.secondaryBg) || '#FFFFFF';
  const secondaryText =
    formatColor(globalData?.buttons?.secondaryText) || '#23A6F0';
  const secondaryHoverBg =
    formatColor(globalData?.buttons?.secondaryHoverBg) || '#23A6F0';
  const secondaryHoverText =
    formatColor(globalData?.buttons?.secondaryHovertxt) || '#FFFFFF';
  const borderRadius = globalData?.buttons?.borderRadius ?? 8;
  const fontFamily = globalData?.fontFamily || 'inherit';
  const transitionDuration = globalData?.linksEffect?.transitionDuration || 300;

  const dynamicStyles = `
    .atc-btn-primary {
      background-color: ${primaryBg}; color: ${primaryText};
      border-radius: ${borderRadius}px; font-family: ${fontFamily};
      transition: all ${transitionDuration}ms ease;
      border: 1px solid transparent;
    }
    .atc-btn-primary:hover:not(:disabled) {
      background-color: ${primaryHoverBg}; color: ${primaryHoverText}; border-color: ${primaryHoverBg};
    }
    .atc-btn-secondary {
      background-color: ${secondaryBg}; color: ${secondaryText};
      border-radius: ${borderRadius}px; font-family: ${fontFamily};
      transition: all ${transitionDuration}ms ease;
      border: 1px solid ${secondaryBg};
    }
    .atc-btn-secondary:hover:not(:disabled) {
      background-color: ${secondaryHoverBg}; color: ${secondaryHoverText};
    }
    .atc-btn-outline {
      background-color: transparent; color: ${primaryBg};
      border-radius: ${borderRadius}px; font-family: ${fontFamily};
      transition: all ${transitionDuration}ms ease;
      border: 2px solid ${primaryBg};
    }
    .atc-btn-outline:hover:not(:disabled) {
      background-color: ${primaryBg}; color: ${primaryText};
    }
  `;

  // Reset isAdded after 2 seconds
  useEffect(() => {
    if (isAdded) {
      const timer = setTimeout(() => {
        setIsAdded(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAdded]);

  // Variant states handling
  const variantStyles = {
    primary: {
      active: 'active:scale-95 opacity-100 hover:opacity-100',
      disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    },
    secondary: {
      active: 'active:scale-95 opacity-100 hover:opacity-100',
      disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    },
    outline: {
      active: 'active:scale-95 opacity-100 hover:opacity-100',
      disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    },
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-sm',
  };

  // Selected variant style
  const selectedVariant = variantStyles[variant] || variantStyles.primary;

  // Button text based on state
  const getButtonText = (fetcherState) => {
    if (!availableForSale) return 'SOLD OUT';
    if (fetcherState !== 'idle') return 'ADDING...';
    if (isAdded) return 'ADDED ✓';
    return children || 'ADD TO CART';
  };

  return (
    <CartForm
      route={cartRoute}
      inputs={{lines}}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher) => {
        const variantClass =
          variant === 'secondary'
            ? 'atc-btn-secondary'
            : variant === 'outline'
              ? 'atc-btn-outline'
              : 'atc-btn-primary';
        return (
          <>
            <style>{dynamicStyles}</style>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />

            {/* Price display above button if showPrice is true */}
            {showPrice && price && (
              <div className="text-center mb-2">
                <span className="text-lg font-semibold text-gray-900">
                  Total: {price.amount} {price.currencyCode}
                </span>
              </div>
            )}

            <button
              type="submit"
              onClick={() => {
                if (onClick) onClick();
                if (availableForSale && fetcher.state === 'idle') {
                  setIsAdded(true);
                }
              }}
              disabled={
                disabled || !availableForSale || fetcher.state !== 'idle'
              }
              className={`
              relative overflow-hidden
              font-bold uppercase tracking-wide
              ${sizeStyles[size]}
              ${selectedVariant.active}
              ${selectedVariant.disabled}
              ${variantClass}
              ${className}
            `}
              style={{...style, borderRadius: '5px'}}
            >
              {/* Loading Spinner */}
              {fetcher.state !== 'idle' && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}

              {/* Success Checkmark */}
              {isAdded && fetcher.state === 'idle' && (
                <svg
                  className="animate-bounce -ml-1 mr-2 h-4 w-4 text-white inline-block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}

              {/* Button Text */}
              <span className="relative z-10">
                {getButtonText(fetcher.state)}
              </span>

              {/* Hover Effect Overlay mapped using tailwind group-hover */}
              <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 hover:opacity-10" />

              {/* Ripple Effect on Click */}
              <span className="absolute inset-0 overflow-hidden rounded">
                <span className="absolute inset-0 scale-0 bg-white rounded-full opacity-30 transition-transform duration-500 group-active:scale-100" />
              </span>
            </button>

            {/* Additional Info */}
            {!availableForSale && (
              <p className="text-xs text-red-500 mt-2 text-center">
                This product is currently out of stock
              </p>
            )}
          </>
        );
      }}
    </CartForm>
  );
}

/**
 * Quick Add Button Component - Smaller version for product grids
 */
export function QuickAddButton({
  analytics,
  lines,
  className = '',
  children = 'Quick Add',
  globalData = null,
}) {
  const {locale} = useParams();
  const cartRoute = locale ? `/${locale}/cart` : '/cart';
  const [showSuccess, setShowSuccess] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatColor = (c) => (!c ? null : c.startsWith('#') ? c : `#${c}`);
  const primaryBg = formatColor(globalData?.buttons?.primaryBg) || '#23A6F0';
  const primaryHoverBg =
    formatColor(globalData?.buttons?.primaryHoverBg) || '#1a7ab0';
  const primaryText =
    formatColor(globalData?.buttons?.primaryText) || '#FFFFFF';
  const primaryHoverText =
    formatColor(globalData?.buttons?.primaryHovertxt) || '#FFFFFF';
  const borderRadius = globalData?.buttons?.borderRadius ?? 4;
  const fontFamily = globalData?.fontFamily || 'inherit';
  const transitionDuration = globalData?.linksEffect?.transitionDuration || 300;

  const dynamicStyles = `
    .qa-btn {
      background-color: ${primaryBg}; color: ${primaryText};
      border-radius: ${borderRadius}px; font-family: ${fontFamily};
      transition: all ${transitionDuration}ms ease;
    }
    .qa-btn:hover:not(:disabled) {
      background-color: ${primaryHoverBg}; color: ${primaryHoverText};
    }
  `;

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <CartForm
      route={cartRoute}
      inputs={{lines}}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher) => (
        <>
          <style>{dynamicStyles}</style>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={() => setShowSuccess(true)}
            disabled={fetcher.state !== 'idle'}
            className={`
              w-full text-xs font-semibold py-2 px-3
              active:scale-95 qa-btn
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
          >
            {fetcher.state !== 'idle' ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Adding...
              </span>
            ) : showSuccess ? (
              <span className="flex items-center justify-center">
                <svg
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Added!
              </span>
            ) : (
              children
            )}
          </button>
        </>
      )}
    </CartForm>
  );
}

/**
 * Buy Now Button - Directs to checkout
 */
export function BuyNowButton({
  analytics,
  lines,
  className = '',
  children = 'BUY NOW',
  globalData = null,
}) {
  const {locale} = useParams();
  const cartRoute = locale ? `/${locale}/cart` : '/cart';
  const fetcher = useFetcher();
  const [isHovered, setIsHovered] = useState(false);

  const formatColor = (c) => (!c ? null : c.startsWith('#') ? c : `#${c}`);
  const primaryBg = formatColor(globalData?.buttons?.primaryBg) || '#23A6F0';
  const primaryHoverBg =
    formatColor(globalData?.buttons?.primaryHoverBg) || '#1a7ab0';
  const primaryText =
    formatColor(globalData?.buttons?.primaryText) || '#FFFFFF';
  const primaryHoverText =
    formatColor(globalData?.buttons?.primaryHovertxt) || '#FFFFFF';
  const borderRadius = globalData?.buttons?.borderRadius ?? 4;
  const fontFamily = globalData?.fontFamily || 'inherit';
  const transitionDuration = globalData?.linksEffect?.transitionDuration || 300;

  const dynamicStyles = `
    .bn-btn {
      background-color: ${primaryBg}; color: ${primaryText};
      border-radius: ${borderRadius}px; font-family: ${fontFamily};
      transition: all ${transitionDuration}ms ease;
    }
    .bn-btn:hover:not(:disabled) {
      background-color: ${primaryHoverBg}; color: ${primaryHoverText};
    }
  `;

  const handleBuyNow = () => {
    // First add to cart, then redirect to checkout
    fetcher
      .submit(
        {
          lines: JSON.stringify(lines),
          analytics: JSON.stringify(analytics),
          action: CartForm.ACTIONS.LinesAdd,
        },
        {
          method: 'POST',
          action: cartRoute,
          encType: 'application/json',
        },
      )
      .then(() => {
        window.location.href = locale ? `/${locale}/checkout` : '/checkout';
      });
  };

  return (
    <>
      <style>{dynamicStyles}</style>
      <button
        onClick={handleBuyNow}
        disabled={fetcher.state !== 'idle'}
        className={`
          w-full font-bold py-3 px-6 
          active:scale-95 bn-btn
          disabled:opacity-50 disabled:cursor-not-allowed
          uppercase tracking-wide text-sm
          ${className}
        `}
      >
        {fetcher.state !== 'idle' ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          children
        )}
      </button>
    </>
  );
}

/** @typedef {import('react-router').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */
