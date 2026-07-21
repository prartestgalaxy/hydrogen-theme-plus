

import { useLoaderData, Link, useFetcher, useNavigate, useRouteLoaderData } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import { useState, useRef, useEffect } from 'react';
import { WISHLIST_SETTINGS_QUERY } from '~/sanity/queries/wishlist';
import { CartForm } from '@shopify/hydrogen';
import { useWishlist } from '~/context/WishlistContext';

/**
 * Helper to get global data from root
 */
export function useGlobalData() {
  const rootData = useRouteLoaderData('root');
  return rootData?.globalSettings || null;
}

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader({ context, request }) {
  const { i18n } = context.storefront;
  const locale = i18n?.country?.toLowerCase() || 'us';
  
  // Get current page from URL
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const itemsPerPage = 4;
  
  // Get sort option from URL
  const sortBy = url.searchParams.get('sort') || 'mostRecent';

  // ✅ 1. CHECK SANITY SETTINGS FIRST
  const wishlistSettings = await context.sanityClient.fetch(WISHLIST_SETTINGS_QUERY);

  // ✅ If wishlist is disabled in Sanity
  if (!wishlistSettings?.enabled) {
    return {
      isEnabled: false,
      isLoggedIn: false,
      error: 'Wishlist is currently disabled',
      wishlist: [],
      products: [],
      count: 0,
      currentPage: page,
      totalPages: 0,
      locale,
      sortBy
    };
  }

  // Check if customer is logged in
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/customerAccessToken=([^;]+)/);
  const accessToken = match?.[1];

  if (!accessToken) {
    return {
      isEnabled: true,
      isLoggedIn: false,
      error: 'Please log in to view your wishlist',
      wishlist: [],
      products: [],
      count: 0,
      currentPage: page,
      totalPages: 0,
      locale,
      sortBy
    };
  }

  try {
    // 1) Get customer ID via Storefront API
    const customerRes = await context.storefront.query(
      `
      query getCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          email
          firstName
          lastName
        }
      }
      `,
      {
        variables: {
          customerAccessToken: accessToken,
        },
      }
    );

    const customer = customerRes?.customer;
    const customerId = customer?.id;

    if (!customerId) {
      return {
        isEnabled: true,
        isLoggedIn: false,
        error: 'Invalid customer session',
        wishlist: [],
        products: [],
        count: 0,
        currentPage: page,
        totalPages: 0,
        locale,
        sortBy
      };
    }

    // 2) Fetch wishlist metafield using Admin API
    const storeDomain = context.env.PUBLIC_STORE_DOMAIN;
    const adminToken = context.env.PRIVATE_ADMIN_TOKEN;

    if (!storeDomain || !adminToken) {
      console.error('Missing environment variables for Admin API');
      return {
        isEnabled: true,
        isLoggedIn: true,
        customer,
        error: 'Server configuration error',
        wishlist: [],
        products: [],
        count: 0,
        currentPage: page,
        totalPages: 0,
        locale,
        sortBy
      };
    }

    // Get wishlist metafield using Admin API
    const adminQuery = `
      query getCustomerWishlistInPage($id: ID!) {
        customer(id: $id) {
          id
          wishlist: metafield(namespace: "custom", key: "wishlist") {
            id
            namespace
            key
            value
            type
          }
        }
      }
    `;

    const adminRes = await fetch(
      `https://${storeDomain}/admin/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
        body: JSON.stringify({
          query: adminQuery,
          variables: { id: customerId },
        }),
      }
    );

    const adminData = await adminRes.json();
    const metafield = adminData?.data?.customer?.wishlist;

    let wishlistData = { products: [] };

    if (metafield?.value) {
      try {
        wishlistData = JSON.parse(metafield.value);
      } catch (e) {
        console.error('Failed to parse wishlist:', e);
      }
    }

    const wishlistProducts = wishlistData.products || [];

    // 3) Fetch product details for all wishlist items
    if (wishlistProducts.length === 0) {
      return {
        isEnabled: true,
        isLoggedIn: true,
        customer,
        wishlist: [],
        products: [],
        count: 0,
        currentPage: page,
        totalPages: 0,
        locale,
        sortBy
      };
    }

    // Convert product IDs to Shopify GIDs
    const shopifyProductIds = wishlistProducts
      .map(item => {
        if (!item.id) return null;
        
        if (item.id.startsWith('gid://')) {
          return item.id;
        }
        
        const numericMatch = item.id.match(/\d+/);
        if (numericMatch) {
          return `gid://shopify/Product/${numericMatch[0]}`;
        }
        
        if (/^\d+$/.test(item.id)) {
          return `gid://shopify/Product/${item.id}`;
        }
        
        return null;
      })
      .filter(Boolean);

    if (shopifyProductIds.length === 0) {
      return {
        isEnabled: true,
        isLoggedIn: true,
        customer,
        wishlist: wishlistProducts,
        products: [],
        count: 0,
        error: 'No valid product IDs found in wishlist',
        currentPage: page,
        totalPages: 0,
        locale,
        sortBy
      };
    }

    // Fetch products using Storefront API with converted GIDs
    const productsRes = await context.storefront.query(
      `query getWishlistProducts(
        $ids: [ID!]!
        $country: CountryCode
        $language: LanguageCode
      ) @inContext(country: $country, language: $language) {
        nodes(ids: $ids) {
          ... on Product {
            id
            title
            handle
            description
            featuredImage {
              id
              url
              altText
              width
              height
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
            availableForSale
            options {
              id
              name
              values
            }
            variants(first: 10) {
              nodes {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                image {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            metafields(identifiers: [
              { namespace: "reviews", key: "rating" },
              { namespace: "reviews", key: "review_count" }
            ]) {
              key
              value
            }
          }
        }
      }
      `,
      {
        variables: {
          ids: shopifyProductIds,
          country: context.storefront.i18n.country,
          language: context.storefront.i18n.language
        },
      }
    );

    // Create a map of product by numeric ID for easier matching
    const productMap = {};
    productsRes.nodes.forEach(product => {
      if (product?.id) {
        const numericId = product.id.split('/').pop();
        productMap[numericId] = product;
      }
    });

    // Merge wishlist data with product details and handle variant images
    const productsWithMeta = wishlistProducts
      .map(wishlistItem => {
        const numericId = wishlistItem.id.match(/\d+/)?.[0];
        if (!numericId) return null;

        const product = productMap[numericId];
        
        if (!product) return null;

        // Find the specific variant if this is a variant item
        let variantImageUrl = null;
        let variantImageAlt = null;
        let selectedVariant = null;

        if (wishlistItem.variantId && product.variants?.nodes) {
          selectedVariant = product.variants.nodes.find(v => v.id === wishlistItem.variantId);
          
          if (selectedVariant?.image) {
            variantImageUrl = selectedVariant.image.url;
            variantImageAlt = selectedVariant.image.altText || product.title;
          }
        }

        // Determine the image to display
        let finalImage = null;
        
        if (variantImageUrl) {
          finalImage = {
            url: variantImageUrl,
            altText: variantImageAlt || wishlistItem.variantImageAlt || product.title
          };
        } else if (wishlistItem.variantImage) {
          finalImage = {
            url: typeof wishlistItem.variantImage === 'string' ? wishlistItem.variantImage : wishlistItem.variantImage.url,
            altText: wishlistItem.variantImageAlt || product.title
          };
        } else if (wishlistItem.image) {
          finalImage = {
            url: typeof wishlistItem.image === 'string' ? wishlistItem.image : wishlistItem.image.url,
            altText: wishlistItem.imageAlt || product.title
          };
        } else if (product.featuredImage) {
          finalImage = product.featuredImage;
        }

        return {
          ...product,
          wishlistMeta: {
            addedAt: wishlistItem?.addedAt || new Date().toISOString(),
            price: wishlistItem?.price,
            image: finalImage,
            imageAlt: finalImage?.altText || product.title,
            originalId: wishlistItem.id,
            variantId: wishlistItem?.variantId || null,
            variantTitle: wishlistItem?.variantTitle || null,
            variantImage: variantImageUrl || wishlistItem?.variantImage || null,
            variantImageAlt: variantImageAlt || wishlistItem?.variantImageAlt || null,
            selectedOptions: wishlistItem?.selectedOptions || null,
            selectedVariant: selectedVariant
          }
        };
      })
      .filter(Boolean);

    // Apply sorting based on sortBy parameter
    let sortedProducts = [...productsWithMeta];
    
    switch(sortBy) {
      case 'aToZ':
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'zToA':
        sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'oldestFirst':
        sortedProducts.sort((a, b) => {
          const dateA = a.wishlistMeta?.addedAt || '';
          const dateB = b.wishlistMeta?.addedAt || '';
          return dateA.localeCompare(dateB);
        });
        break;
      case 'mostRecent':
      default:
        sortedProducts.sort((a, b) => {
          const dateA = a.wishlistMeta?.addedAt || '';
          const dateB = b.wishlistMeta?.addedAt || '';
          return dateB.localeCompare(dateA);
        });
        break;
    }

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    
    let adjustedPage = page;
    if (page > totalPages && totalPages > 0) {
      adjustedPage = totalPages;
    } else if (page < 1) {
      adjustedPage = 1;
    }
    
    const startIndex = (adjustedPage - 1) * itemsPerPage;
    const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

    return {
      isEnabled: true,
      isLoggedIn: true,
      customer,
      wishlist: wishlistProducts,
      products: paginatedProducts,
      allProducts: sortedProducts,
      count: sortedProducts.length,
      currentPage: adjustedPage,
      totalPages,
      locale,
      sortBy
    };

  } catch (error) {
    console.error('Wishlist loader error:', error);
    return {
      isEnabled: true,
      isLoggedIn: true,
      error: 'Failed to load wishlist: ' + error.message,
      wishlist: [],
      products: [],
      count: 0,
      currentPage: 1,
      totalPages: 0,
      locale,
      sortBy
    };
  }
}

// Custom hook for detecting clicks outside an element
function useClickOutside(ref, handler) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
}

/* ---------------- TOAST NOTIFICATION COMPONENT ---------------- */

function ToastNotification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${getBgColor()} min-w-[300px] max-w-md`}>
        {getIcon()}
        <p className={`text-sm font-medium ${getTextColor()} flex-1`}>{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * Page Component
 */
export default function Wishlist() {
  const globalData = useGlobalData();
  
  const { 
    isEnabled, 
    isLoggedIn, 
    customer, 
    products, 
    count, 
    error, 
    currentPage,
    totalPages,
    locale,
    sortBy
  } = useLoaderData();
  
  // ✅ Use wishlist context
  const { fetchWishlist, count: wishlistCount } = useWishlist();
  
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [localProducts, setLocalProducts] = useState(products);
  const [isRefetching, setIsRefetching] = useState(false);
  const [currentSort, setCurrentSort] = useState(sortBy);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toast, setToast] = useState(null);
  
  const dropdownRef = useRef(null);
  
  useClickOutside(dropdownRef, () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  });

  // Dynamic style helpers using global data
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
        borderRadius: '5px',
        transition: `all ${links.transitionDuration}ms ease`,
      };
    } else {
      return {
        backgroundColor: formatColor(buttons.secondaryBg),
        color: formatColor(buttons.secondaryText),
        borderRadius: '5px',
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
  
  const getHeadingStyle = (level = 'h1') => {
    if (!globalData?.headingSizes) return {};
    
    const sizes = globalData.headingSizes;
    const sizeMap = {
      'h1': sizes.h1,
      'h2': sizes.h2,
      'h3': sizes.h3,
      'h4': sizes.h4,
      'h5': sizes.h5,
      'h6': sizes.h6,
    };
    
    return {
      fontSize: `${sizeMap[level] || sizes.h1}px`,
      fontFamily: globalData.fontFamily || 'Montserrat, sans-serif',
      fontWeight: 'bold',
      lineHeight: '1.2',
    };
  };
  
  const getHoverStyle = () => {
    if (!globalData?.linksEffect) return {};
    return {
      color: formatColor(globalData.linksEffect.hoverColor),
    };
  };

  const primaryColor = formatColor(globalData?.buttons?.primaryBg) || '#23A6F0';
  const primaryHoverColor = formatColor(globalData?.buttons?.primaryHoverBg) || '#1a7ab0';
  const borderRadius = globalData?.buttons?.borderRadius || 8;

  // Update local products when loader data changes
  useEffect(() => {
    setLocalProducts(products);
    setIsRefetching(false);
    setCurrentSort(sortBy);
    
    if (products.length === 0 && currentPage > 1 && totalPages > 0) {
      navigate(`?page=${currentPage - 1}&sort=${sortBy}`);
    }
    else if (currentPage > totalPages && totalPages > 0) {
      navigate(`?page=${totalPages}&sort=${sortBy}`);
    }
  }, [products, currentPage, totalPages, navigate, sortBy]);

  // Handle successful removal by refetching data and updating context
  useEffect(() => {
    if (fetcher.data?.success && fetcher.data?.action === 'remove' && !isRefetching) {
      setIsRefetching(true);
      // Refresh the page data
      fetcher.load(`${window.location.pathname}?page=${currentPage}&sort=${sortBy}`);
      // Also refresh the context wishlist
      fetchWishlist();
    }
  }, [fetcher.data, isRefetching, currentPage, sortBy, fetchWishlist]);

  // Handle sort change
  const handleSortChange = (newSort) => {
    setCurrentSort(newSort);
    setIsDropdownOpen(false);
    navigate(`?page=1&sort=${newSort}`);
  };

  // Get sort display text
  const getSortDisplayText = () => {
    switch(currentSort) {
      case 'aToZ':
        return 'A to Z';
      case 'zToA':
        return 'Z to A';
      case 'oldestFirst':
        return 'Oldest First';
      case 'mostRecent':
      default:
        return 'Most recently added';
    }
  };

  // Handle item removal callback
  const handleItemRemoved = () => {
    // Refresh the page data
    fetcher.load(`${window.location.pathname}?page=${currentPage}&sort=${currentSort}`);
    // Refresh the context wishlist to update header count
    fetchWishlist();
  };

  // If wishlist is disabled in Sanity
  if (!isEnabled) {
    return (
      <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 style={getHeadingStyle('h1')} className="mb-8">Wishlist</h1>
          <p className="text-xl text-gray-600 mb-8">
            Wishlist is currently disabled
          </p>
          <Link
            to={`/${locale}/collections/all`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm transition-opacity hover:opacity-90"
            style={getButtonStyle('primary')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryHoverColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 style={getHeadingStyle('h1')} className="mb-8">Wishlist</h1>
          <p className="text-xl text-gray-600 mb-8">
            {error || 'Please log in to view your wishlist'}
          </p>
          <Link
            to={`/${locale}/signin`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm transition-opacity hover:opacity-90"
            style={getButtonStyle('primary')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryHoverColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
            }}
          >
            Log in to continue
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 style={getHeadingStyle('h1')} className="mb-8">Wishlist</h1>
          <p className="text-xl text-red-600 mb-8">{error}</p>
          <Link
            to={`/${locale}/collections/all`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm transition-opacity hover:opacity-90"
            style={getButtonStyle('primary')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryHoverColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handlePageChange = (newPage) => {
    navigate(`?page=${newPage}&sort=${currentSort}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className="min-h-screen bg-white"
   
    >
      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

          <div className="max-w-7xl mx-auto flex items-center justify-between py-[24px]">
            {/* Left : Title */}
            <h3 style={getHeadingStyle('h3')} className="font-bold leading-[32px] tracking-[0.1px]">
              Wishlist {wishlistCount > 0 && <span className="text-lg text-gray-500">({wishlistCount})</span>}
            </h3>

            {/* Right : Breadcrumb */}
            <nav className="flex items-center text-sm">
              <Link 
                to="/" 
                style={getLinkStyle()}
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
              <span className="mx-2">›</span>
              <span className="font-medium" style={getLinkStyle()}>
                Wishlist
              </span>
            </nav>
          </div>
      <div className="max-w-7xl mx-auto flex flex-col gap-[25px] pb-[50px]">
        {/* PAGE HEADER */}
        {/* <div className="mb-[25px]"> */}
          {/* Title + Breadcrumb Row */}
          
          <div className="flex items-center justify-between py-[16px]">
            {/* Results Text */}
            <p className="text-[14px] leading-[24px] tracking-[0.2px] font-bold" style={{ color: '#737373' }}>
              Showing {localProducts.length} of {count} results
            </p>
            
            {/* Sort Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className=" rounded-[5px] flex items-center justify-evenly gap-[25px] w-[218px] h-[50px] px-[10px] py-[11px] border border-[#DDD] bg-[#F9F9F9] hover:bg-gray-50 transition-colors"
              >
                <span className="text-[14px] leading-[28px] tracking-[0.2px] font-normal" style={{ color: formatColor('#737373')}}>
                  {getSortDisplayText()}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[218px] bg-white border border-gray-200 shadow-lg z-10" style={{ borderRadius: `${borderRadius}px` }}>
                  <button
                    onClick={() => handleSortChange('mostRecent')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      currentSort === 'mostRecent' ? 'font-medium' : ''
                    }`}
                    style={currentSort === 'mostRecent' ? { color: primaryColor, backgroundColor: '#f3f4f6' } : { color: formatColor(globalData?.linksEffect?.linkColor) || '#737373' }}
                  >
                    Most recently added
                  </button>
                  <button
                    onClick={() => handleSortChange('aToZ')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      currentSort === 'aToZ' ? 'font-medium' : ''
                    }`}
                    style={currentSort === 'aToZ' ? { color: primaryColor, backgroundColor: '#f3f4f6' } : { color: formatColor(globalData?.linksEffect?.linkColor) || '#737373' }}
                  >
                    A to Z
                  </button>
                  <button
                    onClick={() => handleSortChange('zToA')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      currentSort === 'zToA' ? 'font-medium' : ''
                    }`}
                    style={currentSort === 'zToA' ? { color: primaryColor, backgroundColor: '#f3f4f6' } : { color: formatColor(globalData?.linksEffect?.linkColor) || '#737373' }}
                  >
                    Z to A
                  </button>
                  <button
                    onClick={() => handleSortChange('oldestFirst')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      currentSort === 'oldestFirst' ? 'font-medium' : ''
                    }`}
                    style={currentSort === 'oldestFirst' ? { color: primaryColor, backgroundColor: '#f3f4f6' } : { color: formatColor(globalData?.linksEffect?.linkColor) || '#737373' }}
                  >
                    Oldest First
                  </button>
                </div>
              )}
            </div>
          </div>
        {/* </div> */}


        {/* Wishlist Items */}
        {localProducts.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Save your favorite items to your wishlist</p>
            <Link
              to={`/${locale}/collections/all`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm transition-opacity hover:opacity-90"
              style={getButtonStyle('primary')}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryHoverColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor;
              }}
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-[30px]">
              {localProducts.map((product) => (
                <WishlistItem
                  key={product.id + (product.wishlistMeta?.variantId || '')}
                  product={product}
                  locale={locale}
                  isRefetching={isRefetching}
                  globalData={globalData}
                  onRemove={handleItemRemoved}
                  setToast={setToast}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex overflow-hidden border border-gray-300 shadow-sm rounded-[5px]" >
                  {/* First */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`px-[25px] py-[13px] text-[14px] font-bold leading-[24px] tracking-[0.2px] border-r border-gray-300 transition
                    ${currentPage === 1
                      ? "cursor-not-allowed bg-gray-100"
                      : "hover:bg-gray-100"
                    }`}
                    style={currentPage === 1 ? { color: '#9CA3AF' } : { color: primaryColor }}
                  >
                    First
                  </button>

                  {/* Pages */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-14 px-[20px] py-[12px] text-[14px] leading-[24px] tracking-[0.2px] font-bold border-r border-gray-300 transition
                      ${currentPage === pageNum ? "text-white" : "hover:bg-gray-100"}`}
                      style={currentPage === pageNum ? { backgroundColor: primaryColor } : { color: primaryColor }}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-[25px] py-[13px] text-[14px] leading-[24px] tracking-[0.2px] font-bold border-r border-gray-300 transition
                    ${currentPage === totalPages
                      ? "cursor-not-allowed bg-gray-100"
                      : "hover:bg-gray-100"
                    }`}
                    style={currentPage === totalPages ? { color: '#9CA3AF' } : { color: primaryColor }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- TRASH ICON COMPONENT ---------------- */

function TrashIcon({ onClick, className = "", disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-[10px] rounded-full hover:bg-gray-100 transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      aria-label="Remove from wishlist"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.5 5H4.16667H17.5"
          stroke="#EF4444"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.66675 5.00001V3.33334C6.66675 2.89131 6.84234 2.46739 7.1549 2.15483C7.46746 1.84227 7.89139 1.66667 8.33341 1.66667H11.6667C12.1088 1.66667 12.5327 1.84227 12.8453 2.15483C13.1578 2.46739 13.3334 2.89131 13.3334 3.33334V5.00001M15.8334 5.00001V16.6667C15.8334 17.1087 15.6578 17.5326 15.3453 17.8452C15.0327 18.1577 14.6088 18.3333 14.1667 18.3333H5.83341C5.39139 18.3333 4.96746 18.1577 4.6549 17.8452C4.34234 17.5326 4.16675 17.1087 4.16675 16.6667V5.00001H15.8334Z"
          stroke="#EF4444"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.33325 9.16667V14.1667"
          stroke="#EF4444"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.6667 9.16667V14.1667"
          stroke="#EF4444"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}


/* ---------------- WISHLIST ITEM COMPONENT ---------------- */

export function WishlistItem({ product, locale, isRefetching, onRemove, globalData, setToast }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartError, setCartError] = useState(null);
  const wishlistFetcher = useFetcher();
  const cartFetcher = useFetcher(); // Add this for cart operations
  
  // Use a simple fetch for cart to properly update cart state
  const addToCart = async (merchandiseId) => {
    return new Promise((resolve, reject) => {
      // Use fetcher to submit to cart - this will properly update the cart state
      cartFetcher.submit(
        {
          [CartForm.INPUT_NAME]: JSON.stringify({
            action: CartForm.ACTIONS.LinesAdd,
            inputs: {
              lines: [{ merchandiseId, quantity: 1 }],
            },
          }),
        },
        { method: 'POST', action: '/cart' }
      );
      
      // Wait for fetcher to complete
      const checkInterval = setInterval(() => {
        if (cartFetcher.state === 'idle') {
          clearInterval(checkInterval);
          if (cartFetcher.data?.errors) {
            reject(new Error('Failed to add to cart'));
          } else {
            resolve(true);
          }
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Timeout adding to cart'));
      }, 5000);
    });
  };
  
  // ✅ Use wishlist context
  const { fetchWishlist } = useWishlist();

  // Dynamic style helpers
  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const getButtonStyle = () => {
    if (!globalData?.buttons) return {};
    const buttons = globalData.buttons;
    const links = globalData.linksEffect || { transitionDuration: 300 };
    return {
      backgroundColor: formatColor(buttons.primaryBg),
      color: formatColor(buttons.primaryText),
      borderRadius: `${buttons.borderRadius}px`,
      transition: `all ${links.transitionDuration}ms ease`,
    };
  };

  const primaryColor = formatColor(globalData?.buttons?.primaryBg) || '#23A6F0';
  const primaryHoverColor = formatColor(globalData?.buttons?.primaryHoverBg) || '#1a7ab0';

  const image = product.wishlistMeta?.image || product.featuredImage;
  const variantId = product.wishlistMeta?.variantId;
  const variantTitle = product.wishlistMeta?.variantTitle;
  const selectedOptions = product.wishlistMeta?.selectedOptions;
  const originalProductId = product.wishlistMeta?.originalId || product.id;

  const selectedVariant = (() => {
    if (!product.variants?.nodes) return null;
    if (product.wishlistMeta?.selectedVariant) {
      return product.wishlistMeta.selectedVariant;
    }
    if (variantId) {
      const exactMatch = product.variants.nodes.find(v => v.id === variantId);
      if (exactMatch) return exactMatch;
      const variantNumeric = variantId.match(/\d+/)?.[0];
      if (variantNumeric) {
        const numericMatch = product.variants.nodes.find(v => {
          const vNumeric = v.id.match(/\d+/)?.[0];
          return vNumeric === variantNumeric;
        });
        if (numericMatch) return numericMatch;
      }
      if (variantTitle) {
        const titleMatch = product.variants.nodes.find(v => 
          v.title?.toLowerCase() === variantTitle.toLowerCase()
        );
        if (titleMatch) return titleMatch;
      }
    }
    if (selectedOptions && selectedOptions.length > 0) {
      const optionsMatch = product.variants.nodes.find(v => {
        return selectedOptions.every(opt => 
          v.title?.toLowerCase().includes(opt.value.toLowerCase())
        );
      });
      if (optionsMatch) return optionsMatch;
    }
    return product.variants.nodes[0];
  })();

  const price = selectedVariant?.price || product.priceRange?.minVariantPrice;
  const compareAtPrice = selectedVariant?.compareAtPrice;

  // ✅ Update wishlistFetcher effect to refresh context
  useEffect(() => {
    if (wishlistFetcher.data) {
      if (wishlistFetcher.data?.success) {
        setIsRemoving(false);
        // Refresh the context wishlist to update header count
        fetchWishlist();
        if (onRemove) onRemove();
      } else if (wishlistFetcher.data?.error) {
        console.error('Wishlist removal error:', wishlistFetcher.data.error);
        setIsRemoving(false);
        setToast({
          message: 'Failed to remove from wishlist',
          type: 'error'
        });
      }
    }
  }, [wishlistFetcher.data, onRemove, fetchWishlist, setToast]);

  const handleRemove = () => {
    setIsRemoving(true);
    const removeData = {
      productId: originalProductId,
      variantId: variantId || selectedVariant?.id || null,
      action: 'toggle'
    };
    wishlistFetcher.submit(removeData, {
      method: 'POST',
      action: '/api/wishlist',
      encType: 'application/json'
    });
  };

  // ✅ Fixed handleAddToCart function with proper cart count update
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedVariant?.id) {
      console.error('No variant selected');
      setToast({
        message: 'No variant selected for this product',
        type: 'error'
      });
      return;
    }

    if (!selectedVariant?.availableForSale) {
      setToast({
        message: 'This product variant is out of stock',
        type: 'error'
      });
      return;
    }

    setIsAddingToCart(true);
    setCartError(null);

    try {
      // Add to cart using fetcher (this will update cart count)
      const success = await addToCart(selectedVariant.id);
      
      if (success) {
        // Wait a moment for cart to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // After adding to cart, remove from wishlist
        const removeData = {
          productId: originalProductId,
          variantId: variantId || selectedVariant.id,
          action: 'toggle'
        };
        
        const removeResponse = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(removeData)
        });
        
        const removeResult = await removeResponse.json();
        
        if (removeResult.success) {
          // Refresh wishlist and context
          fetchWishlist();
          if (onRemove) onRemove();
          
          // Show success toast notification
          const variantText = variantTitle && variantTitle !== 'Default Title' ? ` (${variantTitle}) ` : ' ';
          setToast({
            message: `${product.title}${variantText}added to cart successfully! 🎉`,
            type: 'success'
          });
        } else {
          console.error('Failed to remove from wishlist:', removeResult.error);
          setToast({
            message: 'Item added to cart but failed to remove from wishlist',
            type: 'error'
          });
        }
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error in handleAddToCart:', error);
      setCartError(error.message);
      setToast({
        message: 'Failed to add to cart. Please try again.',
        type: 'error'
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Helper function to check if variant title should be hidden
  const shouldHideVariantTitle = () => {
    if (!variantTitle) return true;
    const titleString = String(variantTitle).toLowerCase().trim();
    const hiddenTitles = [
      'default title',
      'default',
      '',
      'default title (default)',
      'defaulttitle',
      'default-title'
    ];
    if (variantTitle === 'Default Title') return true;
    return hiddenTitles.includes(titleString);
  };

  const showVariantBadge = !shouldHideVariantTitle();
  const hasValidSelectedOptions = selectedOptions && 
    selectedOptions.length > 0 && 
    !(selectedOptions.length === 1 && 
      selectedOptions[0].name === 'Title' && 
      selectedOptions[0].value === 'Default Title');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#F3F3F3] px-[25px] pt-[24px] pb-[21px] gap-4 hover:shadow-md transition rounded-[22px]" >
      {/* LEFT SECTION - Product Image and Info */}
      <div className="flex items-center gap-3 sm:gap-[27px] w-fit">
        {/* Product Image */}
        <Link to={`/${locale}/products/${product.handle}`} prefetch="intent">
          <div className="w-16 h-16 sm:w-[102px] sm:h-[130px] bg-gray-100 overflow-hidden rounded-[4px]" >
            {image ? (
              <Image
                data={image}
                alt={image.altText || product.title}
                className="w-full h-full object-cover"
                sizes="80px"
                loaderOptions={{ scale: 2 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                </svg>
              </div>
            )}
          </div>
        </Link>

        {/* PRODUCT INFO */}
        <div className="flex flex-col gap-[4px] flex-1">
          <Link to={`/${locale}/products/${product.handle}`} prefetch="intent">
            <h3 className="text-sm sm:text-[20px] leading-[30px] tracking-[0.2px] font-normal hover:opacity-70 transition" style={{ color: formatColor(globalData?.linksEffect?.linkColor) || '#737373' }}>
              {product.title}
            </h3>
          </Link>

          {showVariantBadge && (
            <div className="">
              <span className="text-xs text-gray-500 bg-gray-200 px-2 rounded-full">
                {variantTitle}
              </span>
            </div>
          )}

          {hasValidSelectedOptions && (
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map((opt, index) => (
                <span key={index} className="text-xs text-gray-600">
                  {opt.name}: <span className="font-medium">{opt.value}</span>
                  {index < selectedOptions.length - 1 ? ' • ' : ''}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            {compareAtPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                <Money data={compareAtPrice} />
              </span>
            )}
            <span className="text-green-600 text-sm sm:text-[18px] leading-[24px] tracking-[0.1px] font-bold">
              <Money data={price} />
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - Actions */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-6 w-full sm:w-auto">
        {/* Trash Icon - Remove from wishlist */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-100">
          <TrashIcon
            onClick={handleRemove}
            disabled={isRemoving || isAddingToCart || isRefetching}
          />
        </div>

        {/* Move to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={
            isAddingToCart ||
            isRemoving ||
            isRefetching ||
            !selectedVariant?.availableForSale ||
            !selectedVariant?.id
          }
          className="w-full whitespace-nowrap sm:w-auto px-[20px] py-[10px] disabled:opacity-50 text-white text-xs sm:text-[14px] leading-[24px] tracking-[0.2px] font-bold transition-opacity hover:opacity-90"
          style={{ ...getButtonStyle(), borderRadius: '5px' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = primaryHoverColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = primaryColor;
          }}
        >
          {isAddingToCart ? "Adding..." : "MOVE TO CART"}
        </button>
      </div>
      
      {/* Error message */}
      {cartError && (
        <div className="text-red-500 text-xs mt-2 text-center sm:text-right">
          {cartError}
        </div>
      )}
    </div>
  );
}