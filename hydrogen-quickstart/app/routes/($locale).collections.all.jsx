import { useAside } from '~/components/Aside';
import { useLoaderData, Link, useFetcher } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import { useEffect, useState } from 'react';
import { WISHLIST_SETTINGS_QUERY } from '~/sanity/queries/wishlist';
import { useWishlist } from '~/context/WishlistContext';
import QuickView from '~/components/QuickView';
import { INVENTORY_SETTINGS_QUERY } from '~/sanity/queries/inventorythreshold';
import { PLP_SETTINGS_QUERY } from '~/sanity/queries/plpsetting';
import { useRouteLoaderData } from 'react-router';
import Banner from '~/components/Banner';
import Filter from '~/components/Filter';
import LogoSlider from '~/components/LogoSlider';
import { CartForm } from '@shopify/hydrogen';
import { useParams } from 'react-router';

// DEFAULT FALLBACK CONFIGURATIONS
const DEFAULT_PLP_SETTINGS = {
  productsPerPage: 12,
  pageTitle: 'Shop',
  enableSorting: true,
  banner: {
    enable: true,
    cards: []
  },
  logoSlider: {
    enable: false,
    logos: []
  },
  filters: {
    enableBrand: true,
    enableCategory: true,
    enableColor: true,
    enableTags: true,
    enablePrice: true
  }
};

const DEFAULT_WISHLIST_SETTINGS = {
  enabled: false,
  requireLogin: true,
  heartIconColor: 'red-500',
  buttonPosition: 'top-right',
  maxItems: 0,
  showCount: true,
  showNotification: true
};

const DEFAULT_INVENTORY_SETTINGS = {
  enableInventoryBadges: false,
  outOfStockMessage: "Out of Stock",
  outOfStockBadgeColor: "#dc2626",
  criticalStockThreshold: 5,
  criticalStockMessage: "Only few left!",
  criticalStockBadgeColor: "#f97316",
  lowStockThreshold: 10,
  lowStockMessage: "Few left",
  lowStockBadgeColor: "#eab308"
};

const DEFAULT_QUICK_VIEW_CONFIG = {
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
    { elementType: 'image', enabled: true, imageSize: 'large' },
    { elementType: 'title', enabled: true, titleSize: 'text-3xl' },
    { elementType: 'price', enabled: true, showCompareAtPrice: true },
    { elementType: 'variants', enabled: true, variantStyle: 'buttons' },
    { elementType: 'addToCart', enabled: true, buttonText: 'Add to Cart' },
  ]
};

/**
 * @param {Route.LoaderArgs} args
 */
export function useGlobalData() {
  const rootData = useRouteLoaderData('root');
  return rootData?.globalSettings || null;
}

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
}

/**
 * Load ALL products (no pagination)
 */
async function loadCriticalData({ context, request }) {
  const { language, country } = context.storefront.i18n;

  let allProducts = [];
  let hasNextPage = true;
  let cursor = null;

  // Fetch all products until no more pages
  while (hasNextPage) {
    const { products } = await context.storefront.query(PRODUCTS_QUERY, {
      variables: {
        first: 250,
        after: cursor,
        country: country,
        language: language,
      },
    });

    allProducts = [...allProducts, ...products.nodes];
    hasNextPage = products.pageInfo.hasNextPage;
    cursor = products.pageInfo.endCursor;
  }

  // Extract filter data from products
  const filterData = extractFilterData(allProducts);

  // CHECK IF USER IS LOGGED IN
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/customerAccessToken=([^;]+)/);
  const accessToken = match?.[1];
  const isLoggedIn = !!accessToken;

  // FETCH SANITY SETTINGS WITH FALLBACKS
  let wishlistSettings;
  try {
    wishlistSettings = await context.sanityClient.fetch(WISHLIST_SETTINGS_QUERY);
  } catch (error) {
    console.error('Error fetching wishlist settings:', error);
    wishlistSettings = null;
  }

  // Apply fallback for wishlist settings
  const safeSettings = wishlistSettings || DEFAULT_WISHLIST_SETTINGS;

  let wishlist = [];

  // ONLY FETCH WISHLIST IF ENABLED IN SANITY AND USER IS LOGGED IN
  if (safeSettings.enabled && isLoggedIn) {
    if (accessToken) {
      try {
        const customerRes = await context.storefront.query(
          `
          query getCustomer($customerAccessToken: String!) {
            customer(customerAccessToken: $customerAccessToken) {
              id
            }
          }
          `,
          {
            variables: {
              customerAccessToken: accessToken,
            },
          }
        );

        const customerId = customerRes?.customer?.id;

        if (customerId) {
          const adminQuery = `
            query getCustomerWishlistInProductIndex($id: ID!) {
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
            `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': context.env.PRIVATE_ADMIN_TOKEN,
              },
              body: JSON.stringify({
                query: adminQuery,
                variables: { id: customerId },
              }),
            }
          );

          const adminData = await adminRes.json();
          const metafield = adminData?.data?.customer?.wishlist;

          if (metafield?.value) {
            try {
              const parsed = JSON.parse(metafield.value);
              wishlist = parsed.products || [];
            } catch (e) {
              wishlist = [];
            }
          }
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    }
  }

  // Fetch quick view configuration from Sanity with fallback
  let quickViewConfig;
  try {
    quickViewConfig = await context.sanityClient.fetch(QUICK_VIEW_QUERY);
    if (!quickViewConfig) {
      quickViewConfig = DEFAULT_QUICK_VIEW_CONFIG;
    }
  } catch (error) {
    console.error('Error fetching quick view config:', error);
    quickViewConfig = DEFAULT_QUICK_VIEW_CONFIG;
  }

  // Fetch inventory settings with fallback
  let inventorySettings;
  try {
    inventorySettings = await context.sanityClient.fetch(INVENTORY_SETTINGS_QUERY);
    if (!inventorySettings) {
      inventorySettings = DEFAULT_INVENTORY_SETTINGS;
    }
  } catch (error) {
    console.error('Error fetching inventory settings:', error);
    inventorySettings = DEFAULT_INVENTORY_SETTINGS;
  }

  // Fetch PLP settings with fallback
  let plpSettings;
 
  try {
    plpSettings = await context.sanityClient.fetch(PLP_SETTINGS_QUERY);
   
    if (!plpSettings) {
      plpSettings = DEFAULT_PLP_SETTINGS;
    }
  } catch (error) {
    console.error('Error fetching PLP settings:', error);
    plpSettings = DEFAULT_PLP_SETTINGS;
  }

  // Ensure nested properties exist
  plpSettings = {
    ...DEFAULT_PLP_SETTINGS,
    ...plpSettings,
    banner: {
      ...DEFAULT_PLP_SETTINGS.banner,
      ...(plpSettings?.banner || {})
    },
    filters: {
      ...DEFAULT_PLP_SETTINGS.filters,
      ...(plpSettings?.filters || {})
    },
    logoSlider: {
      ...DEFAULT_PLP_SETTINGS.logoSlider,
      ...(plpSettings?.logoSlider || {})
    }
  };

  const activeCurrency = allProducts[0]?.priceRange?.minVariantPrice?.currencyCode || 'USD';
  const activeCountry = context.storefront?.i18n?.country?.toLowerCase() || 'us';

  const locale = {
    country: activeCountry,
    currency: activeCurrency
  };
  
  return {
    products: allProducts,
    filterData,
    wishlist,
    isWishlistEnabled: safeSettings.enabled,
    isLoggedIn,
    totalProducts: allProducts.length,
    quickViewConfig,
    inventorySettings,
    plpSettings,
    locale
  };
}

/**
 * Helper function to extract filter data from products
 */
function extractFilterData(products) {
  const filterData = {
    vendors: new Map(),
    productTypes: new Map(),
    tags: new Map(),
    colors: new Map(),
    sizes: new Map(),
    priceRange: { min: Infinity, max: -Infinity }
  };

  products.forEach(product => {
    if (product.vendor) {
      filterData.vendors.set(product.vendor, (filterData.vendors.get(product.vendor) || 0) + 1);
    }

    if (product.productType) {
      filterData.productTypes.set(product.productType, (filterData.productTypes.get(product.productType) || 0) + 1);
    }

    product.tags?.forEach(tag => {
      filterData.tags.set(tag, (filterData.tags.get(tag) || 0) + 1);
    });

    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    filterData.priceRange.min = Math.min(filterData.priceRange.min, price);
    filterData.priceRange.max = Math.max(filterData.priceRange.max, price);

    product.options?.forEach(option => {
      if (option.name.toLowerCase().includes('color')) {
        option.values?.forEach(value => {
          filterData.colors.set(value, (filterData.colors.get(value) || 0) + 1);
        });
      }
      if (option.name.toLowerCase().includes('size')) {
        option.values?.forEach(value => {
          filterData.sizes.set(value, (filterData.sizes.get(value) || 0) + 1);
        });
      }
    });
  });

  return {
    vendors: Array.from(filterData.vendors.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    productTypes: Array.from(filterData.productTypes.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    tags: Array.from(filterData.tags.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    colors: Array.from(filterData.colors.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    sizes: Array.from(filterData.sizes.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    priceRange: {
      min: filterData.priceRange.min === Infinity ? 0 : Math.floor(filterData.priceRange.min),
      max: filterData.priceRange.max === -Infinity ? 1000 : Math.ceil(filterData.priceRange.max)
    }
  };
}

/**
 * Deferred data (none for now)
 */
function loadDeferredData() {
  return {};
}

/**
 * Page Component with Pagination
 */
export default function Products() {
  const globalData = useGlobalData();
  
  const {
    products,
    filterData,
    isWishlistEnabled,
    isLoggedIn,
    totalProducts,
    quickViewConfig,
    inventorySettings,
    plpSettings,
    locale
  } = useLoaderData();
  
  const { open } = useAside();
  // ✅ Use wishlist context
  const { wishlist, setWishlist, toggleWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();
 
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    vendors: [],
    productTypes: [],
    colors: [],
    sizes: [],
    tags: [],
    priceRange: null
  });

  const [quickViewProductHandle, setQuickViewProductHandle] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProductWishlistStatus, setQuickViewProductWishlistStatus] = useState(false);

  // Use plpSettings with fallback
  const PRODUCTS_PER_PAGE = plpSettings?.productsPerPage || DEFAULT_PLP_SETTINGS.productsPerPage;

  // Dynamic style helpers using global data (with fallbacks)
  const getButtonStyle = (type = 'primary', isDisabled = false) => {
    if (!globalData?.buttons) {
      return {
        backgroundColor: type === 'primary' ? '#2563EB' : '#E5E7EB',
        color: type === 'primary' ? '#FFFFFF' : '#000000',
        borderRadius: '8px',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
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
        backgroundColor: `#${buttons.primaryBg}`,
        color: `#${buttons.primaryText}`,
        borderRadius: `${buttons.borderRadius || 8}px`,
        transition: `all ${links.transitionDuration}ms ease`,
      };
    } else {
      return {
        backgroundColor: `#${buttons.secondaryBg}`,
        color: `#${buttons.secondaryText}`,
        borderRadius: `${buttons.borderRadius || 8}px`,
        transition: `all ${links.transitionDuration}ms ease`,
      };
    }
  };
  
  const getLinkStyle = () => {
    if (!globalData?.linksEffect) {
      return {
        color: '#000000',
        transition: 'color 300ms ease',
        textDecoration: 'none',
      };
    }
    
    const links = globalData.linksEffect;
    return {
      color: `#${links.linkColor}`,
      transition: `color ${links.transitionDuration}ms ease`,
      textDecoration: links.underlineStyle === 'none' ? 'none' : 'underline',
    };
  };
  
  const getHeadingStyle = (level = 'h3') => {
    if (!globalData?.headingSizes) {
      const defaultSizes = { h2: 32, h3: 24, h4: 20 };
      return {
        fontSize: `${defaultSizes[level] || 24}px`,
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 'bold',
        lineHeight: '1.2',
      };
    }
    
    const sizes = globalData.headingSizes;
    return {
      fontSize: `${sizes[level]}px`,
      fontFamily: globalData.fontFamily || 'Montserrat, sans-serif',
      fontWeight: 'bold',
      lineHeight: '1.2',
    };
  };
  
  const getHoverStyle = () => {
    if (!globalData?.linksEffect) {
      return { color: '#666666' };
    }
    
    return {
      color: `#${globalData.linksEffect.hoverColor}`,
    };
  };

  // Get search term from URL params
  const params = useParams();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      setSearchTerm(q);
    }
  }, []);

  // Initialize filtered products
  useEffect(() => {
    setFilteredProducts(products);
    setCurrentPage(1);
  }, [products]);

  // Apply search and filters
  useEffect(() => {
    applySearchAndFilters();
  }, [searchTerm, selectedFilters, products, sortBy]);

  const applySearchAndFilters = () => {
    let filtered = [...products];

    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => {
        if (product.title?.toLowerCase().includes(searchLower)) return true;
        if (product.vendor?.toLowerCase().includes(searchLower)) return true;
        if (product.productType?.toLowerCase().includes(searchLower)) return true;
        if (product.tags?.some(tag => tag.toLowerCase().includes(searchLower))) return true;
        if (product.options?.some(option =>
          option.values?.some(value =>
            value.toLowerCase().includes(searchLower)
          )
        )) return true;
        return false;
      });
    }

    if (selectedFilters.vendors?.length > 0) {
      filtered = filtered.filter(product =>
        selectedFilters.vendors.includes(product.vendor)
      );
    }

    if (selectedFilters.productTypes?.length > 0) {
      filtered = filtered.filter(product =>
        selectedFilters.productTypes.includes(product.productType)
      );
    }

    if (selectedFilters.colors?.length > 0) {
      filtered = filtered.filter(product => {
        const colorOption = product.options?.find(opt =>
          opt.name.toLowerCase().includes('color')
        );
        return colorOption?.values?.some(color =>
          selectedFilters.colors.includes(color)
        );
      });
    }

    if (selectedFilters.sizes?.length > 0) {
      filtered = filtered.filter(product => {
        const sizeOption = product.options?.find(opt =>
          opt.name.toLowerCase().includes('size')
        );
        return sizeOption?.values?.some(size =>
          selectedFilters.sizes.includes(size)
        );
      });
    }

    if (selectedFilters.tags?.length > 0) {
      filtered = filtered.filter(product =>
        product.tags?.some(tag => selectedFilters.tags.includes(tag))
      );
    }

    if (selectedFilters.priceRange) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.priceRange.minVariantPrice.amount);
        return price >= selectedFilters.priceRange.min &&
          price <= selectedFilters.priceRange.max;
      });
    }

    const sorted = applySorting(filtered, sortBy);
    setFilteredProducts(sorted);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
  };

  const applySorting = (productsToSort, sortType) => {
    const sorted = [...productsToSort];

    switch (sortType) {
      case 'newest':
        return sorted.sort((a, b) => {
          if (a?.createdAt && b?.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return b?.id?.localeCompare(a?.id || '') || 0;
        });
      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a?.priceRange?.minVariantPrice?.amount || 0);
          const priceB = parseFloat(b?.priceRange?.minVariantPrice?.amount || 0);
          return priceA - priceB;
        });
      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a?.priceRange?.minVariantPrice?.amount || 0);
          const priceB = parseFloat(b?.priceRange?.minVariantPrice?.amount || 0);
          return priceB - priceA;
        });
      default:
        return sorted;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openQuickView = (productHandle, selectedVariant = null, e) => {
    e.preventDefault();
    e.stopPropagation();
    const product = products.find(p => p.handle === productHandle);
    const isProductInWishlist = product ? wishlist.some(item => item.id === product.id) : false;
    setQuickViewProductWishlistStatus(isProductInWishlist);
    setQuickViewProductHandle(productHandle);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProductHandle(null);
    setQuickViewProductWishlistStatus(false);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const getSuggestions = () => {
    if (!searchTerm || searchTerm.trim() === '') return [];

    const searchLower = searchTerm.toLowerCase().trim();
    const searchableTerms = new Set();

    products.forEach(product => {
      if (product.title) searchableTerms.add(product.title);
      if (product.vendor) searchableTerms.add(product.vendor);
      if (product.productType) searchableTerms.add(product.productType);
      if (product.tags) {
        product.tags.forEach(tag => searchableTerms.add(tag));
      }
      if (product.options) {
        product.options.forEach(option => {
          if (option.values) {
            option.values.forEach(value => searchableTerms.add(value));
          }
        });
      }
    });

    const allSuggestions = Array.from(searchableTerms);
    const scoredSuggestions = allSuggestions
      .filter(suggestion => suggestion && suggestion.toLowerCase() !== searchLower)
      .map(suggestion => {
        const suggestionLower = suggestion.toLowerCase();
        let score = 0;

        if (suggestionLower === searchLower) score = 100;
        else if (suggestionLower.startsWith(searchLower)) score = 90;
        else if (suggestionLower.includes(` ${searchLower} `) ||
          suggestionLower.startsWith(`${searchLower} `) ||
          suggestionLower.endsWith(` ${searchLower}`)) score = 80;
        else if (suggestionLower.includes(searchLower)) score = 70;
        else {
          let matches = 0;
          let searchIndex = 0;
          for (let i = 0; i < suggestionLower.length && searchIndex < searchLower.length; i++) {
            if (suggestionLower[i] === searchLower[searchIndex]) {
              matches++;
              searchIndex++;
            }
          }
          const matchRatio = matches / searchLower.length;
          if (matchRatio > 0.6) score = 50 * matchRatio;
          if (searchLower.length > 3 && suggestionLower.length > 3) {
            if (suggestionLower.substring(0, 3) === searchLower.substring(0, 3)) {
              score = Math.max(score, 60);
            }
          }
        }
        return { suggestion, score };
      })
      .filter(item => item.score > 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.suggestion);

    const uniqueSuggestions = [];
    scoredSuggestions.forEach(suggestion => {
      if (!uniqueSuggestions.includes(suggestion)) {
        uniqueSuggestions.push(suggestion);
      }
    });

    return uniqueSuggestions.slice(0, 3);
  };

  const suggestions = getSuggestions();

  // Check if banner should be shown
  const shouldShowBanner = plpSettings?.banner?.enable && 
                          plpSettings?.banner?.cards 

  return (
    <div 
      className="max-w-[100%] mx-auto py-4 sm:py-6 lg:py-8"
     
    >
      {/* Banner Section */}
      {shouldShowBanner && (
        <Banner 
          banners={plpSettings.banner.cards} 
          globalData={globalData}
        />
      )}

      <div className="flex justify-between items-center px-[7%] mb-8 w-full">
        {/* Page Title - Left with global heading style */}
        <h3 
          className="text-center font-bold text-[#252B42]"
          style={getHeadingStyle('h3')}
        >
          {plpSettings?.pageTitle || DEFAULT_PLP_SETTINGS.pageTitle}
        </h3>

        {/* Breadcrumb - Right with global link style */}
        {/* <nav className="text-sm text-gray-600">
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
            {plpSettings?.pageTitle || DEFAULT_PLP_SETTINGS.pageTitle}
          </span>
        </nav> */}
        <nav className="text-sm flex items-center gap-2">
  <Link 
    to="/" 
    className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-center font-montserrat transition-colors"
    style={{
      ...getLinkStyle(),
     
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

  {/* SVG Arrow */}
  <svg
    width="9"
    height="12"
    viewBox="0 0 9 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-1"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.180771 0.180771C0.237928 0.123469 0.305828 0.0780066 0.380583 0.0469869C0.455337 0.0159672 0.535477 0 0.616412 0C0.697347 0 0.777487 0.0159672 0.852241 0.0469869C0.926996 0.0780066 0.994896 0.123469 1.05205 0.180771L8.4358 7.56452C8.4931 7.62168 8.53857 7.68958 8.56959 7.76433C8.60061 7.83909 8.61657 7.91923 8.61657 8.00016C8.61657 8.0811 8.60061 8.16124 8.56959 8.23599C8.53857 8.31074 8.4931 8.37865 8.4358 8.4358L1.05205 15.8196C0.936514 15.9351 0.779809 16 0.616412 16C0.453015 16 0.29631 15.9351 0.180771 15.8196C0.0652316 15.704 0.000322157 15.5473 0.000322157 15.3839C0.000322157 15.2205 0.0652316 15.0638 0.180771 14.9483L7.13011 8.00016L0.180771 1.05205C0.123469 0.994897 0.078006 0.926996 0.0469863 0.852242C0.0159666 0.777487 0 0.697347 0 0.616412C0 0.535478 0.0159666 0.455338 0.0469863 0.380583C0.078006 0.305829 0.123469 0.237928 0.180771 0.180771Z"
      fill="#BDBDBD"
    />
  </svg>

  <span 
    className="font-medium"
    style={{
      ...getLinkStyle(),
      color: '#BDBDBD',
    }}
  >
    {plpSettings?.pageTitle || DEFAULT_PLP_SETTINGS.pageTitle}
  </span>
</nav>
      </div>

      {/* Main Content with Filter and Products */}
      <div className="flex flex-col px-[7%] lg:flex-row gap-8">
        {/* Filter Section - Pass global data */}
        <Filter
          filters={plpSettings?.filters || DEFAULT_PLP_SETTINGS.filters}
          filterData={filterData}
          onFilterChange={handleFilterChange}
          initialPriceRange={filterData?.priceRange}
          onGlobalSearchChange={setSearchTerm}
          globalSearchTerm={searchTerm}
          locale={locale}
          globalData={globalData}
        />

        {/* Products Section */}
        <div className="flex-1  mb-12">
          {/* Toolbar with Results Count and Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
            <div className="text-sm text-[#737373] mb-2 sm:mb-0 font-bold">
              {filteredProducts.length > 0 ? (
                <>Showing {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} results</>
              ) : (
                <>Showing all 0 results</>
              )}
            </div>

            {(plpSettings?.enableSorting !== false) && filteredProducts.length > 0 && (
<div className="relative w-[143px] h-[50px]">
  
<select
  value={sortBy}
  onChange={handleSortChange}
  onMouseDown={(e) => {
    const icon = e.currentTarget.parentElement.querySelector('svg');
    icon?.classList.toggle('rotate-180');
  }}
  onBlur={(e) => {
    const icon = e.currentTarget.parentElement.querySelector('svg');
    icon?.classList.remove('rotate-180');
  }}
  className="border border-[#DADADA] appearance-none w-full h-full text-[#737373] bg-[#F9F9F9] text-sm px-[15px] pr-8 cursor-pointer focus:outline-none rounded-[8px]"
>
  <option value="newest">Newest</option>
  <option value="price-low">Low to High</option>
  <option value="price-high">High to Low</option>
</select>

  {/* Arrow */}
  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
   <svg
  width="14"
  height="8"
  viewBox="0 0 14 8"
  fill="none"
  className="transform transition-transform duration-0"
>
      <path
        d="M2 0L7 5L12 0L14 1L7 8L1 1L2 0Z"
        fill="#737373"
      />
    </svg>
  </div>
</div>
)}
          </div>

          {/* Product Grid */}
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {currentProducts.map((product, index) => {
                return (
                  <div key={product.id}>
                    <ProductItem
                      product={product}
                      index={index}
                      isWishlistEnabled={isWishlistEnabled}
                      isLoggedIn={isLoggedIn}
                      onQuickView={openQuickView}
                      inventorySettings={inventorySettings}
                      locale={locale}
                      onCartOpen={open}
                      globalData={globalData}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            /* No Results Found */
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <img
                  src="/images/magnifier-icon.svg"
                  alt="No results found"
                  className="w-[351px] h-[286px] object-contain opacity-90"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('width', '120');
                    svg.setAttribute('height', '120');
                    svg.setAttribute('viewBox', '0 0 24 24');
                    svg.setAttribute('fill', 'none');
                    svg.setAttribute('class', 'mx-auto text-gray-300');

                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', '11');
                    circle.setAttribute('cy', '11');
                    circle.setAttribute('r', '8');
                    circle.setAttribute('stroke', 'currentColor');
                    circle.setAttribute('stroke-width', '1.5');

                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('d', 'M21 21L17 17');
                    path.setAttribute('stroke', 'currentColor');
                    path.setAttribute('stroke-width', '1.5');
                    path.setAttribute('stroke-linecap', 'round');

                    svg.appendChild(circle);
                    svg.appendChild(path);
                    e.target.parentElement.appendChild(svg);
                  }}
                />
              </div>

              <h2 
                className="text-xl md:text-4xl font-semibold text-gray-800 mb-2"
                style={getHeadingStyle('h2')}
              >
                No results found
              </h2>

              {searchTerm && (
                <div>
                  <p className="text-gray-500 mb-2">
                    We couldn't find anything for "{searchTerm}"
                  </p>
                  <span className="text-gray-500 mb-6">Try checking the spelling</span>
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="max-w-2xl mx-auto mt-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-medium text-gray-700">
                      Suggestions:
                    </p>
                    {suggestions.map((suggestion, index) => (
                      <Link
                        key={index}
                        to={`?q=${encodeURIComponent(suggestion)}`}
                        onClick={() => setSearchTerm(suggestion)}
                        className="px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md transition"
                        style={getButtonStyle('secondary')}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `#${globalData?.buttons?.secondaryHoverBg || 'D1D5DB'}`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = `#${globalData?.buttons?.secondaryBg || 'E5E7EB'}`;
                        }}
                      >
                        {suggestion}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center mt-8">
                <Link
                  to="/"
                  className="ml-2 flex items-center gap-2 px-6 py-3 rounded-md transition font-medium"
                  style={getButtonStyle('primary')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `#${globalData?.buttons?.primaryHoverBg || '1D4ED8'}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `#${globalData?.buttons?.primaryBg || '2563EB'}`;
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Home
                </Link>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 md:mt-10">
              <div className="flex bg-gray-100 rounded-md shadow-sm overflow-hidden border border-gray-200 flex-wrap">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`hidden sm:block px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm font-medium border-r border-gray-200 transition-all`}
                  style={{
  ...(currentPage === 1 ? getButtonStyle('primary', true) : getLinkStyle()),
  borderRadius: '0px'
}}
                >
                  First
                </button>

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`sm:hidden px-3 py-2 text-xs font-medium border-r border-gray-200 transition-all`}
                 style={{
  ...(currentPage === 1 ? getButtonStyle('primary', true) : getLinkStyle()),
  borderRadius: '0px'
}}
                  aria-label="Previous page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {getPageNumbers().map((page, index) =>
                  page === '...' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="hidden sm:inline-block px-2 md:px-4 py-2 md:py-3 border-r border-gray-200"
                     style={{
  ...getLinkStyle(),
  borderRadius: '0px'
}}
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`hidden sm:block px-3 md:px-5 py-2 md:py-4 text-xs md:text-sm font-medium border-r border-gray-200 transition-all rounded-md`}
                      style={{
  ...(currentPage === page ? getButtonStyle('primary') : getLinkStyle()),
  borderRadius: '0px'
}}
                      onMouseEnter={(e) => {
                        if (currentPage !== page) {
                          e.currentTarget.style.color = getHoverStyle().color;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== page) {
                          e.currentTarget.style.color = getLinkStyle().color;
                        }
                      }}
                    >
                      {page}
                    </button>
                  )
                )}

                <span className="sm:hidden px-4 py-2 text-xs font-medium text-gray-700 border-r border-gray-200">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm font-medium transition-all`}
                 style={{
  ...(currentPage === totalPages ? getButtonStyle('primary', true) : getLinkStyle()),
  borderRadius: '0px'
}}
                >
                  <span className="hidden sm:inline">Next</span>
                  <svg className="sm:hidden w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logo Slider */}
      {plpSettings?.logoSlider?.enable && plpSettings?.logoSlider?.logos?.length > 0 && (
        <LogoSlider data={plpSettings.logoSlider} />
      )}

      {/* Quick View Modal */}
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
        globalData={globalData}
      />
    </div>
  );
}

/* ---------------- PRODUCT CARD COMPONENT ---------------- */

function getBadgeColor(color) {
  return color || '#6b7280';
}

const getProductImage = (product) => {
  if (product?.featuredImage?.url) {
    return product.featuredImage;
  }
  return {
    url: 'public/images/product-image.jpg',
    altText: product?.title || 'Product image',
    width: 500,
    height: 500
  };
};

// Helper function to check if a color name is a valid CSS color
function isValidCSSColor(colorName) {
  const validColors = [
    'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure',
    'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet',
    'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate',
    'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan',
    'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgrey',
    'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange',
    'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue',
    'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet',
    'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue',
    'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro',
    'ghostwhite', 'gold', 'goldenrod', 'gray', 'grey', 'green',
    'greenyellow', 'honeydew', 'hotpink', 'indianred', 'indigo',
    'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen',
    'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan',
    'lightgoldenrodyellow', 'lightgray', 'lightgrey', 'lightgreen',
    'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue',
    'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow',
    'lime', 'limegreen', 'linen', 'magenta', 'maroon',
    'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple',
    'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise',
    'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin',
    'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange',
    'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise',
    'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum',
    'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown', 'royalblue',
    'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell',
    'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey',
    'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle',
    'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke',
    'yellow', 'yellowgreen'
  ];
  
  if (validColors.includes(colorName)) return true;
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorName)) return true;
  if (/^rgba?\((\d{1,3},\s*){2,3}\d{1,3}(?:,\s*\d?\.?\d+)?\)$/.test(colorName)) return true;
  if (/^hsla?\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%(?:,\s*\d?\.?\d+)?\)$/.test(colorName)) return true;
  
  return false;
}

function ProductItem({
  product,
  index,
  isWishlistEnabled,
  isLoggedIn,
  onQuickView,
  inventorySettings,
  locale,
  onCartOpen,
  globalData
}) {
  const image = getProductImage(product);
  const price = product?.priceRange?.minVariantPrice;
  const compareAtPrice = product?.compareAtPriceRange?.minVariantPrice;
  const fetcher = useFetcher();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false); // ✅ Local loading state for this specific item
  
  // ✅ Use wishlist context (remove loading from context)
  const { wishlist, setWishlist, toggleWishlist, isInWishlist } = useWishlist();

  const variants = product?.variants?.nodes || [];
  
  const getActionButtonStyle = () => {
    return {
      borderRadius: `${globalData?.buttons?.borderRadius || 8}px`,
      transition: `all ${globalData?.linksEffect?.transitionDuration || 300}ms ease`,
    };
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && isAddingToCart) {
      setIsAddingToCart(false);
      if (fetcher.data?.cart) {
        if (onCartOpen && typeof onCartOpen === 'function') {
          onCartOpen('cart');
        }
      }
    }
  }, [fetcher.state, isAddingToCart, fetcher.data, onCartOpen]);
  
  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant(prev => {
        if (prev) {
          const updatedVariant = variants.find(v => v.id === prev.id);
          if (updatedVariant) return updatedVariant;
        }
        return variants[0];
      });
    }
  }, [product]);

  const variantId = selectedVariant?.id;
  const isOutOfStock = selectedVariant?.quantityAvailable <= 0 || !selectedVariant?.availableForSale;
  
  // ✅ Use context's isInWishlist function
  const isWished = isInWishlist(product.id, variantId);
  
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const hasCompareAtPrice = compareAtPrice && price && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  const quantity = selectedVariant?.quantityAvailable;

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

  // ✅ Updated toggleWishlist function using local loading state
  async function handleToggleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();

    const canAdd = () => {
      if (!isWishlistEnabled) return false;
      if (isWishlistEnabled?.requireLogin && !isLoggedIn) return false;
      return true;
    };

    if (!canAdd()) {
      window.location.href = '/signin';
      return;
    }

    if (!isWishlistEnabled) {
      alert("Wishlist is currently disabled");
      return;
    }

    if (variants.length > 1 && !selectedVariant) {
      setShowVariantSelector(true);
      return;
    }

    // ✅ Set local loading state for THIS SPECIFIC item only
    setIsWishlistLoading(true);

    const result = await toggleWishlist({
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle,
      productImage: image?.url || '',
      productPrice: price?.amount || '0',
      variantId: selectedVariant?.id || null,
      variantTitle: selectedVariant?.title || null,
      selectedOptions: selectedVariant?.selectedOptions || null,
      variantImage: selectedVariant?.image?.url || null,
      variantImageAlt: selectedVariant?.image?.altText || null,
    });

    // ✅ Clear local loading state for THIS SPECIFIC item
    setIsWishlistLoading(false);

    if (!result.success && result.requiresLogin) {
      window.location.href = '/signin';
    } else if (!result.success && result.error) {
      alert(result.error);
    }
  }

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product.handle, selectedVariant, e);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!variantId) {
      console.error('No variant ID available');
      if (variants.length > 0) {
        setShowVariantSelector(true);
      }
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

  const handleVariantSelect = (variant, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVariant(variant);
    setShowVariantSelector(false);
  };

  const WishlistIcon = ({ filled, hovered }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M14.031 2.8125H14.032C14.6118 2.81271 15.1858 2.92807 15.7205 3.15234C16.2552 3.37666 16.7398 3.70554 17.1462 4.11914C17.9751 4.96296 18.4392 6.09841 18.4392 7.28125C18.4392 8.46409 17.9751 9.59954 17.1462 10.4434L9.99976 17.6797L2.85425 10.4434C2.0255 9.59956 1.56128 8.46398 1.56128 7.28125C1.56128 6.09852 2.0255 4.96294 2.85425 4.11914C3.26082 3.70576 3.74625 3.37743 4.28101 3.15332C4.81567 2.9293 5.38978 2.81348 5.96948 2.81348C6.54921 2.81351 7.12329 2.92925 7.65796 3.15332C8.19262 3.37741 8.67722 3.70584 9.08374 4.11914L9.08472 4.12012L9.77808 4.82031L10.0007 5.04395L10.2224 4.82031L10.9158 4.12012L10.9177 4.11914C11.3237 3.70511 11.8078 3.37568 12.3425 3.15137C12.8771 2.92711 13.4513 2.81207 14.031 2.8125Z"
        fill={filled ? "#EF4444" : "transparent"}
        stroke={filled ? "#EF4444" : hovered ? "#ffffff" : "#252B42"}
        strokeWidth="1.5"
      />
    </svg>
  );

  const CartIcon = ({ hovered }) => (
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

  const QuickViewIcon = ({ hovered }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 10 12.5C9.33696 12.5 8.70107 12.2366 8.23223 11.7678C7.76339 11.2989 7.5 10.663 7.5 10C7.5 9.33696 7.76339 8.70107 8.23223 8.23223C8.70107 7.76339 9.33696 7.5 10 7.5C10.663 7.5 11.2989 7.76339 11.7678 8.23223C12.2366 8.70107 12.5 9.33696 12.5 10Z" fill="black" />
      <path d="M2 10C2 10 5 4.5 10 4.5C15 4.5 18 10 18 10C18 10 15 15.5 10 15.5C5 15.5 2 10 2 10ZM10 13.5C10.9283 13.5 11.8185 13.1313 12.4749 12.4749C13.1313 11.8185 13.5 10.9283 13.5 10C13.5 9.07174 13.1313 8.1815 12.4749 7.52513C11.8185 6.86875 10.9283 6.5 10 6.5C9.07174 6.5 8.1815 6.86875 7.52513 7.52513C6.86875 8.1815 6.5 9.07174 6.5 10C6.5 10.9283 6.86875 11.8185 7.52513 12.4749C8.1815 13.1313 9.07174 13.5 10 13.5Z" fill={hovered ? "#ffffff" : "black"} />
    </svg>
  );
  
  if (!product) return null;

  const countryPrefix = locale?.country && locale.country !== 'us' ? `/${locale.country}` : '';

  return (
    <div
      className="bg-white rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/${locale?.country || 'us'}/products/${product.handle}`}
        className="block"
        prefetch="intent"
      >
        <div className="relative">
          {image && (
            <div className="relative overflow-hidden aspect-square">
              <Image
                data={image}
                alt={image.altText || product.title}
                aspectRatio="1/1"
                loading={index < 8 ? 'eager' : 'lazy'}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                loaderOptions={{ scale: 0.1 }}
                className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'
                  } ${loaded ? 'blur-0' : 'blur-xl'}`}
                onLoad={(e) => {
                  e.currentTarget.style.filter = 'blur(0)';
                  setLoaded(true);
                }}
              />

              {inventoryBadge && (
                <div className="absolute top-2 left-2 z-10">
                  <span className="text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md" style={{backgroundColor: badgeColor}}>
                    {inventoryBadge}
                  </span>
                </div>
              )}

              {showVariantSelector && variants.length > 1 && (
                <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-4">
                  <h4 className="text-sm font-semibold mb-2">Select a variant</h4>
                  <div className="flex flex-wrap gap-2 justify-center max-h-32 overflow-y-auto">
                    {variants.map((variant, idx) => (
                      <button
                        key={variant.id}
                        onClick={(e) => handleVariantSelect(variant, e)}
                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition"
                      >
                        {variant.title || `Variant ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowVariantSelector(false);
                    }}
                    className="mt-3 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className={`absolute inset-0 bg-black/40 flex items-end justify-center pb-4 gap-2 transition-all duration-300 ${isHovered && !showVariantSelector ? 'opacity-100' : 'opacity-0'
                }`}>
                {isWishlistEnabled && (
                  <button
                    onClick={handleToggleWishlist}
                    onMouseEnter={() => setHoveredIcon("wishlist")}
                    onMouseLeave={() => setHoveredIcon(null)}
                    disabled={isWishlistLoading}
                    className={`bg-white w-10 h-10 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${isWished ? "text-red-500" : "text-black"
                      } hover:bg-black ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={getActionButtonStyle()}
                  >
                    {isWishlistLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <WishlistIcon filled={isWished} hovered={hoveredIcon === "wishlist"} />
                    )}
                  </button>
                )}

                <button
                  onClick={handleAddToCart}
                  onMouseEnter={() => setHoveredIcon("cart")}
                  onMouseLeave={() => setHoveredIcon(null)}
                  disabled={isAddingToCart || isOutOfStock || !variantId}
                  className="bg-white w-10 h-10 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black"
                  style={getActionButtonStyle()}
                >
                  {isAddingToCart ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  ) : (
                    <CartIcon hovered={hoveredIcon === "cart"} />
                  )}
                </button>

                <button
                  onClick={handleQuickViewClick}
                  onMouseEnter={() => setHoveredIcon("quick")}
                  onMouseLeave={() => setHoveredIcon(null)}
                  className="bg-white w-10 h-10 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black"
                  style={getActionButtonStyle()}
                >
                  <QuickViewIcon hovered={hoveredIcon === "quick"} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 px-2 pb-3">
          <h4 className="font-medium font-montserrat text-gray-900 line-clamp-2 text-sm md:text-base hover:text-gray-600 transition-colors">
            {product.title}
          </h4>

          {variants.length > 1 && selectedVariant && (
            <p className="text-xs font-montserrat text-gray-500 mt-1">
              {selectedVariant.title}
            </p>
          )}

          <div className="flex font-montserrat items-center gap-2 mt-1">
            <span className="text-gray-900 font-bold text-lg">
              {selectedVariant?.price ? (
                <Money data={selectedVariant.price} />
              ) : price ? (
                <Money data={price} />
              ) : 'Price not available'}
            </span>
            {hasCompareAtPrice && compareAtPrice && (
              <span className="font-montserrat text-gray-400 line-through text-sm">
                <Money data={compareAtPrice} />
              </span>
            )}
          </div>

          <div className="mt-2 font-montserrat flex justify-end">
            {product.options?.some(opt => opt.name.toLowerCase().includes('color')) && (
              <div className="flex items-center gap-1 flex-wrap">
                {product.options
                  .find(opt => opt.name.toLowerCase().includes('color'))
                  ?.values.slice(0, 5)
                  .map((color, index) => {
                    const isValidColor = isValidCSSColor(color.toLowerCase());
                    
                    return isValidColor ? (
                      <div
                        key={index}
                        className="w-5 h-5 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ) : (
                      <span
                        key={index}
                        className="text-xs px-2 py-0.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
                        title={color}
                      >
                        {color}
                      </span>
                    );
                  })}

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

// NOTE: This is NOT a Storefront API query. It is kept as a plain string
// to avoid codegen validation errors. Settings are fetched from Sanity via sanityClient.
const QUICK_VIEW_QUERY = `
  query QuickViewSettings {
    quickViewSettings: allQuickViewSettings {
      styling {
        maxWidth
        backgroundColor
        textColor
        buttonColor
        buttonTextColor
        fontSize
        borderRadius
      }
      contentElements {
        elementType
        enabled
        imageSize
        titleSize
        showCompareAtPrice
        variantStyle
        buttonText
      }
    }
  }
`;

const PRODUCTS_QUERY = `#graphql
fragment ProductCard on Product {
  id
  title
  handle
  vendor
  productType
  tags
  createdAt
  options {
    id
    name
    values
  }
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
  }
  compareAtPriceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  variants(first: 10) {
    nodes {
      id
      title
      price {
        amount
        currencyCode
      }
      quantityAvailable
      availableForSale
      selectedOptions {
        name
        value
      }
    }
  }
}
  query AllProducts(
    $country: CountryCode
    $after: String
    $first: Int
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      after: $after
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;