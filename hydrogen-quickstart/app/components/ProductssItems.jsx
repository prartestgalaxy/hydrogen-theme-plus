
import { Link, useFetcher } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import { useEffect, useState } from 'react';
import { CartForm } from '@shopify/hydrogen';

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

function getBadgeColor(color) {
  return color || '#6b7280';
}

const WishlistIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.031 2.8125H14.032C14.6118 2.81271 15.1858 2.92807 15.7205 3.15234C16.2552 3.37666 16.7398 3.70554 17.1462 4.11914C17.9751 4.96296 18.4392 6.09841 18.4392 7.28125C18.4392 8.46409 17.9751 9.59954 17.1462 10.4434L9.99976 17.6797L2.85425 10.4434C2.0255 9.59956 1.56128 8.46398 1.56128 7.28125C1.56128 6.09852 2.0255 4.96294 2.85425 4.11914C3.26082 3.70576 3.74625 3.37743 4.28101 3.15332C4.81567 2.9293 5.38978 2.81348 5.96948 2.81348C6.54921 2.81351 7.12329 2.92925 7.65796 3.15332C8.19262 3.37741 8.67722 3.70584 9.08374 4.11914L9.08472 4.12012L9.77808 4.82031L10.0007 5.04395L10.2224 4.82031L10.9158 4.12012L10.9177 4.11914C11.3237 3.70511 11.8078 3.37568 12.3425 3.15137C12.8771 2.92711 13.4513 2.81207 14.031 2.8125ZM14.032 3.4375C13.5329 3.43681 13.0385 3.53682 12.5789 3.73145C12.12 3.9258 11.7046 4.21021 11.3582 4.56836L10.0007 5.95215L8.63647 4.55664L8.6355 4.55566C8.28769 4.20158 7.87248 3.92054 7.41479 3.72852C6.95707 3.53652 6.46584 3.43753 5.96948 3.4375C5.47295 3.4375 4.98106 3.53642 4.52319 3.72852C4.06547 3.92058 3.65031 4.20151 3.30249 4.55566C2.58849 5.2806 2.18823 6.25787 2.18823 7.27539C2.18833 8.29272 2.58864 9.26931 3.30249 9.99414H3.30347L9.77808 16.5508L10.0007 16.7764L10.2224 16.5508L16.698 9.99414C17.412 9.26928 17.8122 8.29283 17.8123 7.27539C17.8123 6.2578 17.4121 5.28062 16.698 4.55566C16.3504 4.20141 15.9359 3.91953 15.4783 3.72754C15.0204 3.53551 14.5284 3.43715 14.032 3.4375Z" 
      fill={filled ? "#EF4444" : "#BDBDBD"} 
      stroke={filled ? "#EF4444" : "#252B42"} 
      strokeWidth="0.625"/>
  </svg>
);

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_5_522)">
      <path d="M0 1.63333C0 1.46536 0.0667281 1.30427 0.185505 1.1855C0.304281 1.06673 0.465377 1 0.633353 1H2.53341C2.67469 1.00004 2.8119 1.04731 2.92322 1.1343C3.03454 1.22129 3.11357 1.34299 3.14776 1.48007L3.66078 3.53333H18.3672C18.4602 3.53342 18.5521 3.55398 18.6362 3.59356C18.7204 3.63315 18.7948 3.69077 18.8541 3.76235C18.9135 3.83393 18.9564 3.9177 18.9797 4.00772C19.0031 4.09774 19.0063 4.19179 18.9892 4.2832L17.0891 14.4165C17.062 14.5617 16.9849 14.6927 16.8714 14.7871C16.7578 14.8815 16.6148 14.9332 16.4672 14.9333H5.06682C4.91917 14.9332 4.7762 14.8815 4.66263 14.7871C4.54906 14.6927 4.47204 14.5617 4.44487 14.4165L2.54608 4.3022L2.0394 2.26667H0.633353C0.465377 2.26667 0.304281 2.19994 0.185505 2.08117C0.0667281 1.96239 0 1.8013 0 1.63333ZM3.92932 4.8L5.59251 13.6667H15.9415L17.6047 4.8H3.92932ZM6.33353 14.9333C5.66163 14.9333 5.01724 15.2002 4.54214 15.6753C4.06703 16.1504 3.80012 16.7948 3.80012 17.4667C3.80012 18.1385 4.06703 18.7829 4.54214 19.258C5.01724 19.7331 5.66163 20 6.33353 20C7.00543 20 7.64981 19.7331 8.12492 19.258C8.60003 18.7829 8.86694 18.1385 8.86694 17.4667C8.86694 16.7948 8.60003 16.1504 8.12492 15.6753C7.64981 15.2002 7.00543 14.9333 6.33353 14.9333ZM15.2005 14.9333C14.5286 14.9333 13.8842 15.2002 13.4091 15.6753C12.934 16.1504 12.6671 16.7948 12.6671 17.4667C12.6671 18.1385 12.934 18.7829 13.4091 19.258C13.8842 19.7331 14.5286 20 15.2005 20C15.8724 20 16.5168 19.7331 16.9919 19.258C17.467 18.7829 17.7339 18.1385 17.7339 17.4667C17.7339 16.7948 17.467 16.1504 16.9919 15.6753C16.5168 15.2002 15.8724 14.9333 15.2005 14.9333ZM6.33353 16.2C6.66948 16.2 6.99167 16.3335 7.22922 16.571C7.46678 16.8085 7.60023 17.1307 7.60023 17.4667C7.60023 17.8026 7.46678 18.1248 7.22922 18.3623C6.99167 18.5999 6.66948 18.7333 6.33353 18.7333C5.99758 18.7333 5.67539 18.5999 5.43783 18.3623C5.20028 18.1248 5.06682 17.8026 5.06682 17.4667C5.06682 17.1307 5.20028 16.8085 5.43783 16.571C5.67539 16.3335 5.99758 16.2 6.33353 16.2ZM15.2005 16.2C15.5364 16.2 15.8586 16.3335 16.0962 16.571C16.3337 16.8085 16.4672 17.1307 16.4672 17.4667C16.4672 17.8026 16.3337 18.1248 16.0962 18.3623C15.8586 18.5999 15.5364 18.7333 15.2005 18.7333C14.8645 18.7333 14.5423 18.5999 14.3048 18.3623C14.0672 18.1248 13.9338 17.8026 13.9338 17.4667C13.9338 17.1307 14.0672 16.8085 14.3048 16.571C14.5423 16.3335 14.8645 16.2 15.2005 16.2Z" fill="#252B42"/>
    </g>
    <defs>
      <clipPath id="clip0_5_522">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const QuickViewIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 10 12.5C9.33696 12.5 8.70107 12.2366 8.23223 11.7678C7.76339 11.2989 7.5 10.663 7.5 10C7.5 9.33696 7.76339 8.70107 8.23223 8.23223C8.70107 7.76339 9.33696 7.5 10 7.5C10.663 7.5 11.2989 7.76339 11.7678 8.23223C12.2366 8.70107 12.5 9.33696 12.5 10Z" fill="black"/>
    <path d="M2 10C2 10 5 4.5 10 4.5C15 4.5 18 10 18 10C18 10 15 15.5 10 15.5C5 15.5 2 10 2 10ZM10 13.5C10.9283 13.5 11.8185 13.1313 12.4749 12.4749C13.1313 11.8185 13.5 10.9283 13.5 10C13.5 9.07174 13.1313 8.1815 12.4749 7.52513C11.8185 6.86875 10.9283 6.5 10 6.5C9.07174 6.5 8.1815 6.86875 7.52513 7.52513C6.86875 8.1815 6.5 9.07174 6.5 10C6.5 10.9283 6.86875 11.8185 7.52513 12.4749C8.1815 13.1313 9.07174 13.5 10 13.5Z" fill="black"/>
  </svg>
);

export function ProductItem({
  product,
  index = 0,
  wishlist = [],
  setWishlist,
  isWishlistEnabled = false,
  isLoggedIn = false,
  canAddToWishlist,
  getButtonPosition,
  getHeartColor,
  onQuickView,
  inventorySettings = null,
  variant = 'default' // 'default' or 'compact'
}) {
  const image = product?.featuredImage;
  const price = product?.priceRange?.minVariantPrice;
  const compareAtPrice = product?.compareAtPriceRange?.minVariantPrice;
  const fetcher = useFetcher();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Get the first variant ID for adding to cart
  const firstVariant = product?.variants?.nodes?.[0];
  const variantId = firstVariant?.id;
  const isOutOfStock = firstVariant?.quantityAvailable <= 0 || !firstVariant?.availableForSale;

  const isWished = wishlist?.some((item) => item?.id === product?.id) || false;
  const heartColorClass = getHeartColor ? getHeartColor(isWished) : (isWished ? 'text-red-500' : 'text-gray-400');
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if there's a compare at price (for sale items)
  const hasCompareAtPrice = compareAtPrice && price && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  // Default rating
  const rating = 4;
  const reviewCount = 10;

  // Inventory logic
  const variant = product?.variants?.nodes?.[0];
  const quantity = variant?.quantityAvailable;

  let inventoryBadge = null;
  let badgeColor = '#6b7280';

  if (inventorySettings?.enableInventoryBadges && 
      quantity !== null && 
      quantity !== undefined) {

    if (quantity <= 0) {
      inventoryBadge = inventorySettings.outOfStockMessage || "Out of Stock";
      badgeColor = getBadgeColor(inventorySettings.outOfStockBadgeColor);
    }
    else if (quantity <= inventorySettings.criticalStockThreshold) {
      inventoryBadge = inventorySettings.criticalStockMessage || "Only few left!";
      badgeColor = getBadgeColor(inventorySettings.criticalStockBadgeColor);
    }
    else if (quantity <= inventorySettings.lowStockThreshold) {
      inventoryBadge = inventorySettings.lowStockMessage || "Few left";
      badgeColor = getBadgeColor(inventorySettings.lowStockBadgeColor);
    }
  }

  // Track fetcher state for adding to cart
  useEffect(() => {
    if (fetcher.state === 'idle' && isAddingToCart) {
      setIsAddingToCart(false);
    }
  }, [fetcher.state, isAddingToCart, fetcher.data]);

  async function toggleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!canAddToWishlist?.(isLoggedIn)) {
      window.location.href = '/signin';
      return;
    }

    if (!isWishlistEnabled) {
      alert("Wishlist is currently disabled");
      return;
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productTitle: product.title,
          productHandle: product.handle,
          productImage: image?.url || '',
          productPrice: price?.amount || '0'
        })
      });

      const data = await res.json();

      if (data.success) {
        setWishlist?.(data.wishlist);
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
      console.error('Error toggling wishlist:', error);
      alert("Something went wrong");
    }
  }

  // Handle quick view button click
  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product.handle, e);
  };

  // Handle add to cart using CartForm
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!variantId) {
      console.error('No variant ID available');
      return;
    }

    if (isOutOfStock) {
      alert('This product is out of stock');
      return;
    }

    setIsAddingToCart(true);
    
    fetcher.submit(
      {
        [CartForm.INPUT_NAME]: JSON.stringify({
          action: CartForm.ACTIONS.LinesAdd,
          inputs: {
            lines: [
              {
                merchandiseId: variantId,
                quantity: 1,
              },
            ],
          },
        }),
      },
      {
        method: 'POST',
        action: '/cart',
      }
    );
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(
          <svg key={i} className="w-4 h-4 fill-current text-yellow-400" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-4 h-4 fill-current text-gray-300" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        );
      }
    }
    return stars;
  };

  // If product is undefined, don't render
  if (!product) return null;

  // Compact variant for search aside
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 w-full hover:opacity-70 group border-b border-gray-100 pb-3 last:border-0">
        {/* Product Image */}
        {image && (
          <Link
            to={`/products/${product.handle}`}
            onClick={() => onQuickView?.(product.handle)}
            className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg"
          >
            <img 
              src={image.url} 
              alt={image.altText || product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              width={image.width}
              height={image.height}
            />
          </Link>
        )}

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/products/${product.handle}`}
            onClick={() => onQuickView?.(product.handle)}
            className="block"
          >
            <h4 className="text-xs uppercase tracking-widest truncate font-medium text-gray-900">
              {product.title}
            </h4>
            
            {/* Price */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-gray-900">
                {price ? <Money data={price} /> : 'Price not available'}
              </span>
              {hasCompareAtPrice && compareAtPrice && (
                <span className="text-xs text-gray-400 line-through">
                  <Money data={compareAtPrice} />
                </span>
              )}
            </div>

            {/* Quick action buttons for compact view */}
            <div className="flex items-center gap-2 mt-2">
              {isWishlistEnabled && (
                <button
                  onClick={toggleWishlist}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <WishlistIcon filled={isWished} />
                </button>
              )}
              
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || isOutOfStock || !variantId}
                className={`text-gray-500 hover:text-black transition-colors ${
                  (isAddingToCart || isOutOfStock || !variantId) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label={isAddingToCart ? "Adding to cart..." : "Add to cart"}
              >
                {isAddingToCart ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <CartIcon />
                )}
              </button>

              <button
                onClick={handleQuickViewClick}
                className="text-gray-500 hover:text-black transition-colors"
                aria-label="Quick view"
              >
                <QuickViewIcon />
              </button>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // Default variant (full product card)
  return (
    <div 
      className="bg-white rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/products/${product.handle}`}
        className="block"
        prefetch="intent"
      >
        <div className="relative">
          {/* Product Image */}
          {image && (
            <div className="relative overflow-hidden aspect-square">
              <Image
                data={image}
                alt={image.altText || product.title}
                aspectRatio="1/1"
                loading={index < 8 ? 'eager' : 'lazy'}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                loaderOptions={{ scale: 0.1 }}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isHovered ? 'scale-110' : 'scale-100'
                } ${loaded ? 'blur-0' : 'blur-xl'}`}
                onLoad={(e) => {
                  e.currentTarget.style.filter = 'blur(0)';
                  setLoaded(true);
                }}
              />
              
              {/* Inventory Badge */}
              {inventoryBadge && (
                <div className="absolute top-2 left-2 z-10">
                  <span className="text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md" style={{backgroundColor: badgeColor}}>
                    {inventoryBadge}
                  </span>
                </div>
              )}

              {/* Hover Action Buttons */}
              <div className={`absolute inset-0 bg-black/40 flex items-end justify-center pb-4 gap-2 transition-all duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}>
                {/* Wishlist Button */}
                {isWishlistEnabled && (
                  <button
                    onClick={toggleWishlist}
                    className={`bg-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${
                      isWished ? 'text-red-500' : 'text-black hover:text-white'
                    } hover:bg-black`}
                    aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <WishlistIcon filled={isWished} />
                  </button>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || isOutOfStock || !variantId}
                  className={`bg-white text-black hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black ${
                    (isAddingToCart || isOutOfStock || !variantId) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label={isAddingToCart ? "Adding to cart..." : "Add to cart"}
                >
                  {isAddingToCart ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <CartIcon />
                  )}
                </button>

                {/* Quick View Button */}
                <button
                  onClick={handleQuickViewClick}
                  className="bg-white text-black hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black"
                  aria-label="Quick view"
                >
                  <QuickViewIcon />
                </button>
              </div>

              
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-3 px-2 pb-3">
          <h4 className="font-medium text-gray-900 line-clamp-2 text-sm md:text-base hover:text-gray-600 transition-colors">
            {product.title}
          </h4>
          
          {/* Price with Sale */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-900 font-bold text-lg">
              {price ? <Money data={price} /> : 'Price not available'}
            </span>
            {hasCompareAtPrice && compareAtPrice && (
              <span className="text-gray-400 line-through text-sm">
                <Money data={compareAtPrice} />
              </span>
            )}
          </div>

          {/* Reviews with Stars */}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              {renderStars(rating)}
            </div>
            <span className="text-xs text-gray-500">
              {reviewCount} Reviews
            </span>
          </div>

          {/* Color Swatches */}
          <div className="mt-2 flex justify-end">
            {product.options?.some(opt => opt.name.toLowerCase().includes('color')) && (
              <div className="flex items-center gap-1">
                {product.options
                  .find(opt => opt.name.toLowerCase().includes('color'))
                  ?.values.slice(0, 5)
                  .map((color, index) => (
                    <div
                      key={index}
                      className="w-5 h-5 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}

                {product.options
                  .find(opt => opt.name.toLowerCase().includes('color'))
                  ?.values.length > 5 && (
                  <span className="text-xs text-gray-500 ml-1">
                    +
                    {product.options.find(opt =>
                      opt.name.toLowerCase().includes('color')
                    ).values.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}