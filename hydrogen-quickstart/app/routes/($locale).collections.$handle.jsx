import {useAside} from '~/components/Aside';
import {
  redirect,
  useLoaderData,
  useRouteLoaderData,
  Link,
  useFetcher,
} from 'react-router';
import {Image, Money, Analytics, CartForm} from '@shopify/hydrogen';
import {useState, useEffect} from 'react';
import {WISHLIST_SETTINGS_QUERY} from '~/sanity/queries/wishlist';
import {COLLECTION_PAGE_SETTINGS_QUERY} from '~/sanity/queries/collectionsetting';
import {INVENTORY_SETTINGS_QUERY} from '~/sanity/queries/inventorythreshold';
import {useWishlist} from '~/context/WishlistContext';
import Banner from '~/components/Banner';
import Filter from '~/components/Filter';
import LogoSlider from '~/components/LogoSlider';
import QuickView from '~/components/QuickView';
import {useParams} from 'react-router';

// DEFAULT FALLBACK CONFIGURATIONS (keep all your existing defaults)
const DEFAULT_COLLECTION_PAGE_SETTINGS = {
  productsPerPage: 12,
  pageTitle: '',
  enableSorting: true,
  enableFilters: true,
  banner: {
    enable: true,
    cards: [],
  },
  logoSlider: {
    enable: false,
    title: '',
    autoScroll: true,
    speed: 3000,
    logos: [],
  },
  filters: {
    enableBrand: true,
    enableCategory: true,
    enableColor: true,
    enableTags: true,
    enablePrice: true,
  },
};

const DEFAULT_WISHLIST_SETTINGS = {
  enabled: false,
  requireLogin: true,
  heartIconColor: 'red-500',
  buttonPosition: 'top-right',
  maxItems: 0,
  showCount: true,
  showNotification: true,
};

const DEFAULT_INVENTORY_SETTINGS = {
  enableInventoryBadges: false,
  outOfStockMessage: 'Out of Stock',
  outOfStockBadgeColor: '#dc2626',
  criticalStockThreshold: 5,
  criticalStockMessage: 'Only few left!',
  criticalStockBadgeColor: '#f97316',
  lowStockThreshold: 10,
  lowStockMessage: 'Few left',
  lowStockBadgeColor: '#eab308',
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
    {elementType: 'image', enabled: true, imageSize: 'large'},
    {elementType: 'title', enabled: true, titleSize: 'text-3xl'},
    {elementType: 'price', enabled: true, showCompareAtPrice: true},
    {elementType: 'variants', enabled: true, variantStyle: 'buttons'},
    {elementType: 'addToCart', enabled: true, buttonText: 'Add to Cart'},
  ],
};

/**
 * Helper to get global data from root
 */
export function useGlobalData() {
  const rootData = useRouteLoaderData('root');
  return rootData?.globalSettings || null;
}

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection?.title ?? ''} Collection`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw redirect('/collections');
  }

  // Fetch all products for this collection (no pagination limit)
  let allCollectionProducts = [];
  let hasNextPage = true;
  let cursor = null;
  let collectionTitle = handle;

  while (hasNextPage) {
    const {collection} = await storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        first: 250,
        after: cursor,
      },
    });

    if (!collection && allCollectionProducts.length === 0) {
      throw new Response(`Collection ${handle} not found`, {
        status: 404,
      });
    }

    if (collection) {
      allCollectionProducts = [
        ...allCollectionProducts,
        ...collection.products.nodes,
      ];
      collectionTitle = collection.title;
      hasNextPage = collection.products.pageInfo.hasNextPage;
      cursor = collection.products.pageInfo.endCursor;
    } else {
      hasNextPage = false;
    }
  }

  // ✅ Get login status
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/customerAccessToken=([^;]+)/);
  const accessToken = match?.[1];
  const isLoggedIn = !!accessToken;

  // -------------------------
  // Fetch Wishlist Settings with Fallback
  // -------------------------
  let wishlistSettings;
  try {
    wishlistSettings = await context.sanityClient.fetch(
      WISHLIST_SETTINGS_QUERY,
    );
  } catch (error) {
    console.error('Error fetching wishlist settings:', error);
    wishlistSettings = null;
  }

  const safeSettings = wishlistSettings || DEFAULT_WISHLIST_SETTINGS;

  // -------------------------
  // Fetch Inventory Settings with Fallback
  // -------------------------
  let inventorySettings;
  try {
    inventorySettings = await context.sanityClient.fetch(
      INVENTORY_SETTINGS_QUERY,
    );
    if (!inventorySettings) {
      inventorySettings = DEFAULT_INVENTORY_SETTINGS;
    }
  } catch (error) {
    console.error('📦 COLLECTION: Error fetching inventory settings:', error);
    inventorySettings = DEFAULT_INVENTORY_SETTINGS;
  }

  // -------------------------
  // Fetch Collection Page Settings from Sanity with Fallback
  // -------------------------
  let collectionPageSettings;
  try {
    collectionPageSettings = await context.sanityClient.fetch(
      COLLECTION_PAGE_SETTINGS_QUERY,
    );
    if (!collectionPageSettings) {
      collectionPageSettings = DEFAULT_COLLECTION_PAGE_SETTINGS;
    }
  } catch (error) {
    console.error('Error fetching collection page settings:', error);
    collectionPageSettings = DEFAULT_COLLECTION_PAGE_SETTINGS;
  }

  // Ensure nested properties exist
  collectionPageSettings = {
    ...DEFAULT_COLLECTION_PAGE_SETTINGS,
    ...collectionPageSettings,
    banner: {
      ...DEFAULT_COLLECTION_PAGE_SETTINGS.banner,
      ...(collectionPageSettings?.banner || {}),
    },
    filters: {
      ...DEFAULT_COLLECTION_PAGE_SETTINGS.filters,
      ...(collectionPageSettings?.filters || {}),
    },
    logoSlider: {
      ...DEFAULT_COLLECTION_PAGE_SETTINGS.logoSlider,
      ...(collectionPageSettings?.logoSlider || {}),
    },
  };

  // -------------------------
  // Extract filter data from collection products
  // -------------------------
  const filterData = extractFilterData(allCollectionProducts);

  // -------------------------
  // Wishlist Products (Variant-based)
  // -------------------------
  let wishlistProducts = [];
  let wishlistCount = 0;

  if (safeSettings.enabled && accessToken) {
    try {
      const customerRes = await storefront.query(
        `
        query getCustomer($customerAccessToken: String!) {
          customer(customerAccessToken: $customerAccessToken) {
            id
          }
        }
        `,
        {variables: {customerAccessToken: accessToken}},
      );

      const customerId = customerRes?.customer?.id;

      if (customerId) {
        const adminQuery = `
          query getCustomerWishlistInCollection($id: ID!) {
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
              variables: {id: customerId},
            }),
          },
        );

        const adminData = await adminRes.json();
        const metafield = adminData?.data?.customer?.wishlist;

        if (metafield?.value) {
          try {
            const parsed = JSON.parse(metafield.value);
            wishlistProducts = parsed.products || [];
            wishlistCount = wishlistProducts.length;
          } catch (e) {
            console.error('Error parsing wishlist:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }

  // Process products to add variant-level wishlist status
  const productsWithWishlist = allCollectionProducts.map((product) => {
    const productInWishlist = wishlistProducts.some(
      (p) => p.productId === product.id,
    );

    const variantsWithWishlist =
      product.variants?.nodes?.map((variant) => ({
        ...variant,
        isInWishlist: wishlistProducts.some((p) => p.variantId === variant.id),
      })) || [];

    return {
      ...product,
      isInWishlist: productInWishlist,
      variants: {
        ...product.variants,
        nodes: variantsWithWishlist,
      },
    };
  });

  const activeCountry =
    context.storefront?.i18n?.country?.toLowerCase() || 'us';
  const activeCurrency =
    allCollectionProducts[0]?.priceRange?.minVariantPrice?.currencyCode ||
    'USD';
  const locale = {country: activeCountry, currency: activeCurrency};

  const quickViewConfig = DEFAULT_QUICK_VIEW_CONFIG;

  return {
    collection: {
      id: `gid://shopify/Collection/${handle}`,
      title: collectionTitle,
      handle,
      products: {
        nodes: productsWithWishlist,
      },
    },
    filterData,
    wishlist: wishlistProducts,
    wishlistCount,
    isWishlistEnabled: safeSettings.enabled,
    showCount: safeSettings.showCount,
    isLoggedIn,
    collectionPageSettings,
    inventorySettings,
    locale,
    totalProducts: allCollectionProducts.length,
    quickViewConfig,
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
    priceRange: {min: Infinity, max: -Infinity},
  };

  products.forEach((product) => {
    if (product.vendor) {
      filterData.vendors.set(
        product.vendor,
        (filterData.vendors.get(product.vendor) || 0) + 1,
      );
    }

    if (product.productType) {
      filterData.productTypes.set(
        product.productType,
        (filterData.productTypes.get(product.productType) || 0) + 1,
      );
    }

    product.tags?.forEach((tag) => {
      filterData.tags.set(tag, (filterData.tags.get(tag) || 0) + 1);
    });

    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    filterData.priceRange.min = Math.min(filterData.priceRange.min, price);
    filterData.priceRange.max = Math.max(filterData.priceRange.max, price);

    product.options?.forEach((option) => {
      if (option.name.toLowerCase().includes('color')) {
        option.values?.forEach((value) => {
          filterData.colors.set(value, (filterData.colors.get(value) || 0) + 1);
        });
      }
      if (option.name.toLowerCase().includes('size')) {
        option.values?.forEach((value) => {
          filterData.sizes.set(value, (filterData.sizes.get(value) || 0) + 1);
        });
      }
    });
  });

  return {
    vendors: Array.from(filterData.vendors.entries())
      .map(([name, count]) => ({name, count}))
      .sort((a, b) => a.name.localeCompare(b.name)),
    productTypes: Array.from(filterData.productTypes.entries())
      .map(([name, count]) => ({name, count}))
      .sort((a, b) => a.name.localeCompare(b.name)),
    tags: Array.from(filterData.tags.entries())
      .map(([name, count]) => ({name, count}))
      .sort((a, b) => a.name.localeCompare(b.name)),
    colors: Array.from(filterData.colors.entries())
      .map(([name, count]) => ({name, count}))
      .sort((a, b) => a.name.localeCompare(b.name)),
    sizes: Array.from(filterData.sizes.entries())
      .map(([name, count]) => ({name, count}))
      .sort((a, b) => a.name.localeCompare(b.name)),
    priceRange: {
      min:
        filterData.priceRange.min === Infinity
          ? 0
          : Math.floor(filterData.priceRange.min),
      max:
        filterData.priceRange.max === -Infinity
          ? 1000
          : Math.ceil(filterData.priceRange.max),
    },
  };
}

/**
 * Load data for rendering content below the fold.
 */
function loadDeferredData({context}) {
  return {};
}

// Dynamic style helpers using global data (with fallbacks)
export const formatColor = (color) => {
  if (!color) return null;
  return color.startsWith('#') ? color : `#${color}`;
};

export const getButtonStyle = (
  globalData,
  type = 'primary',
  isDisabled = false,
) => {
  if (!globalData?.buttons) {
    return {
      backgroundColor: type === 'primary' ? '#2563EB' : '#E5E7EB',
      color: type === 'primary' ? '#FFFFFF' : '#000000',
      borderRadius: '8px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
    };
  }

  const buttons = globalData.buttons;
  const links = globalData.linksEffect || {transitionDuration: 300};

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
      backgroundColor: formatColor(buttons.primaryBg) || '#2563EB',
      color: formatColor(buttons.primaryText) || '#FFFFFF',
      borderRadius: `${buttons.borderRadius || 8}px`,
      transition: `all ${links.transitionDuration || 300}ms ease`,
    };
  } else {
    return {
      backgroundColor: formatColor(buttons.secondaryBg) || '#E5E7EB',
      color: formatColor(buttons.secondaryText) || '#000000',
      borderRadius: `${buttons.borderRadius || 8}px`,
      transition: `all ${links.transitionDuration || 300}ms ease`,
    };
  }
};

export const getLinkStyle = (globalData) => {
  if (!globalData?.linksEffect) {
    return {
      color: '#000000',
      transition: 'color 300ms ease',
      textDecoration: 'none',
    };
  }

  const links = globalData.linksEffect;
  return {
    color: formatColor(links.linkColor) || '#000000',
    transition: `color ${links.transitionDuration || 300}ms ease`,
    textDecoration: links.underlineStyle === 'none' ? 'none' : 'underline',
  };
};

export const getHeadingStyle = (globalData, level = 'h3') => {
  if (!globalData?.headingSizes) {
    const defaultSizes = {h1: 32, h2: 28, h3: 24, h4: 20, h5: 18, h6: 16};
    return {
      fontSize: `${defaultSizes[level] || 24}px`,
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 'bold',
      lineHeight: '1.2',
    };
  }

  const sizes = globalData.headingSizes;
  const sizeMap = {
    h1: sizes.h1,
    h2: sizes.h2,
    h3: sizes.h3,
    h4: sizes.h4,
    h5: sizes.h5,
    h6: sizes.h6,
  };

  return {
    fontSize: `${sizeMap[level] || sizes.h3 || 24}px`,
    fontFamily: globalData.fontFamily || 'Montserrat, sans-serif',
    fontWeight: 'bold',
    lineHeight: '1.2',
  };
};

export const getHoverStyle = (globalData) => {
  if (!globalData?.linksEffect) {
    return {color: '#666666'};
  }

  return {
    color: formatColor(globalData.linksEffect.hoverColor) || '#666666',
  };
};

export const getBaseStyle = (globalData) => {
  return {
    fontFamily: globalData?.fontFamily || 'Montserrat, sans-serif',
    fontSize: `${globalData?.baseFontSize || 16}px`,
    backgroundColor: globalData?.darkMode?.enable ? '#121212' : 'transparent',
    color: globalData?.darkMode?.enable ? '#ffffff' : '#000000',
  };
};

const CustomSortDropdown = ({sortBy, handleSortChange}) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    {value: 'popularity', label: 'Popularity'},
    {value: 'newest', label: 'Newest'},
    {value: 'price-low', label: 'Price: Low to High'},
    {value: 'price-high', label: 'Price: High to Low'},
  ];
  const selectedLabel =
    options.find((o) => o.value === sortBy)?.label || 'Popularity';

  return (
    <div
      className="relative"
      tabIndex={0}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-center items-center bg-white border border-gray-300 px-[18px] py-[11px] text-sm cursor-pointer select-none"
        style={{
          borderRadius: `5px`, 
          height: '50px',
          color: '#737373',
          backgroundColor: "#F9F9F9",
          width: '141px'
        }}
      >
        <span
         style={{
          fontSize: '14px',
          lineHeight: '28px',
          letterSpacing: '0.2px'
         }}
        >{selectedLabel}</span>
        <svg
          className="fill-current h-4 w-4 ml-[5px] text-gray-700"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
      {isOpen && (
        <div
          className="absolute left-0 top-[calc(100%+4px)] w-full bg-white border border-gray-300 shadow-lg z-50 text-sm overflow-hidden"
          style={{borderRadius: `5px`}}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                handleSortChange({target: {value: option.value}});
                setIsOpen(false);
              }}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${sortBy === option.value ? 'bg-gray-50 text-blue-600 font-medium' : ''}`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Collection() {
  const globalData = useGlobalData();

  const {
    collection,
    filterData,
    wishlist: initialWishlist,
    isWishlistEnabled,
    showCount,
    isLoggedIn,
    collectionPageSettings,
    inventorySettings,
    locale,
    totalProducts,
    quickViewConfig,
  } = useLoaderData();

  const rootData = useRouteLoaderData('root');
  const {open} = useAside();

  console.log("globalData", globalData);
  console.log("collectionPageSettings", collectionPageSettings);

  // ✅ Use wishlist context instead of local state
  const {
    wishlist,
    setWishlist,
    toggleWishlist,
    isInWishlist,
    loading: wishlistLoading,
  } = useWishlist();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    vendors: [],
    productTypes: [],
    colors: [],
    sizes: [],
    tags: [],
    priceRange: null,
  });

  const [quickViewProductHandle, setQuickViewProductHandle] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProductWishlistStatus, setQuickViewProductWishlistStatus] =
    useState(false);

  // Dynamically using the global style getters from outside

  // Use settings from collectionPageSettings with fallbacks
  const PRODUCTS_PER_PAGE =
    collectionPageSettings?.productsPerPage ||
    DEFAULT_COLLECTION_PAGE_SETTINGS.productsPerPage;
  const enableSorting =
    collectionPageSettings?.enableSorting ??
    DEFAULT_COLLECTION_PAGE_SETTINGS.enableSorting;
  const enableFilters =
    collectionPageSettings?.enableFilters ??
    DEFAULT_COLLECTION_PAGE_SETTINGS.enableFilters;

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
    setFilteredProducts(collection.products.nodes);
    setCurrentPage(1);
  }, [collection.products.nodes]);

  // Apply search and filters
  useEffect(() => {
    applySearchAndFilters();
  }, [searchTerm, selectedFilters, collection.products.nodes, sortBy]);

  const applySearchAndFilters = () => {
    let filtered = [...collection.products.nodes];

    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((product) => {
        if (product.title?.toLowerCase().includes(searchLower)) return true;
        if (product.vendor?.toLowerCase().includes(searchLower)) return true;
        if (product.productType?.toLowerCase().includes(searchLower))
          return true;
        if (
          product.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        )
          return true;
        if (
          product.options?.some((option) =>
            option.values?.some((value) =>
              value.toLowerCase().includes(searchLower),
            ),
          )
        )
          return true;
        return false;
      });
    }

    if (selectedFilters.vendors?.length > 0) {
      filtered = filtered.filter((product) =>
        selectedFilters.vendors.includes(product.vendor),
      );
    }

    if (selectedFilters.productTypes?.length > 0) {
      filtered = filtered.filter((product) =>
        selectedFilters.productTypes.includes(product.productType),
      );
    }

    if (selectedFilters.colors?.length > 0) {
      filtered = filtered.filter((product) => {
        const colorOption = product.options?.find((opt) =>
          opt.name.toLowerCase().includes('color'),
        );
        return colorOption?.values?.some((color) =>
          selectedFilters.colors.includes(color),
        );
      });
    }

    if (selectedFilters.sizes?.length > 0) {
      filtered = filtered.filter((product) => {
        const sizeOption = product.options?.find((opt) =>
          opt.name.toLowerCase().includes('size'),
        );
        return sizeOption?.values?.some((size) =>
          selectedFilters.sizes.includes(size),
        );
      });
    }

    if (selectedFilters.tags?.length > 0) {
      filtered = filtered.filter((product) =>
        product.tags?.some((tag) => selectedFilters.tags.includes(tag)),
      );
    }

    if (selectedFilters.priceRange) {
      filtered = filtered.filter((product) => {
        const price = parseFloat(product.priceRange.minVariantPrice.amount);
        return (
          price >= selectedFilters.priceRange.min &&
          price <= selectedFilters.priceRange.max
        );
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
          const priceA = parseFloat(
            a?.priceRange?.minVariantPrice?.amount || 0,
          );
          const priceB = parseFloat(
            b?.priceRange?.minVariantPrice?.amount || 0,
          );
          return priceA - priceB;
        });
      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(
            a?.priceRange?.minVariantPrice?.amount || 0,
          );
          const priceB = parseFloat(
            b?.priceRange?.minVariantPrice?.amount || 0,
          );
          return priceB - priceA;
        });
      default:
        return sorted;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const openQuickView = (productHandle, e) => {
    e.preventDefault();
    e.stopPropagation();
    const product = collection.products.nodes.find(
      (p) => p.handle === productHandle,
    );
    const isProductInWishlist = product
      ? product.variants?.nodes?.some((variant) =>
          wishlist.some((item) => item.variantId === variant.id),
        )
      : false;
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

    collection.products.nodes.forEach((product) => {
      if (product.title) searchableTerms.add(product.title);
      if (product.vendor) searchableTerms.add(product.vendor);
      if (product.productType) searchableTerms.add(product.productType);
      if (product.tags) {
        product.tags.forEach((tag) => searchableTerms.add(tag));
      }
      if (product.options) {
        product.options.forEach((option) => {
          if (option.values) {
            option.values.forEach((value) => searchableTerms.add(value));
          }
        });
      }
    });

    const allSuggestions = Array.from(searchableTerms);
    const scoredSuggestions = allSuggestions
      .filter(
        (suggestion) => suggestion && suggestion.toLowerCase() !== searchLower,
      )
      .map((suggestion) => {
        const suggestionLower = suggestion.toLowerCase();
        let score = 0;
        if (suggestionLower === searchLower) score = 100;
        else if (suggestionLower.startsWith(searchLower)) score = 90;
        else if (
          suggestionLower.includes(` ${searchLower} `) ||
          suggestionLower.startsWith(`${searchLower} `) ||
          suggestionLower.endsWith(` ${searchLower}`)
        )
          score = 80;
        else if (suggestionLower.includes(searchLower)) score = 70;
        return {suggestion, score};
      })
      .filter((item) => item.score > 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.suggestion);

    const uniqueSuggestions = [];
    scoredSuggestions.forEach((suggestion) => {
      if (!uniqueSuggestions.includes(suggestion)) {
        uniqueSuggestions.push(suggestion);
      }
    });
    return uniqueSuggestions.slice(0, 3);
  };

  const suggestions = getSuggestions();
  const pageTitle =
    collectionPageSettings?.pageTitle || collection.title || 'Collection';

  // Check if banner should be shown
  const shouldShowBanner = collectionPageSettings?.banner?.enable;

  // Check if logo slider should be shown
  const shouldShowLogoSlider =
    collectionPageSettings?.logoSlider?.enable &&
    collectionPageSettings?.logoSlider?.logos;

  return (
    <div
      className="max-w-[100%] mx-auto py-4 sm:py-6 lg:py-8"
      style={getBaseStyle(globalData)}
    >
      {/* Banner Section */}
      {shouldShowBanner && (
        <Banner
          banners={collectionPageSettings?.banner?.cards || []}
          globalData={globalData}
        />
      )}

      <div className="flex justify-between items-center px-[7%] py-[24px] w-full">
        {/* Page Title - Left with global heading style */}
        <h4
          className="text-center font-bold"
          style={getHeadingStyle(globalData, 'h4')}
        >
          {pageTitle}
        </h4>

        {/* Breadcrumb - Right with global link style */}
        <nav className="text-sm text-gray-600">
          <Link
            to="/"
            style={getLinkStyle(globalData)}
            onMouseEnter={(e) => {
              const hoverStyle = getHoverStyle(globalData);
              if (hoverStyle.color) {
                e.currentTarget.style.color = hoverStyle.color;
              }
            }}
            onMouseLeave={(e) => {
              const linkStyle = getLinkStyle(globalData);
              if (linkStyle.color) {
                e.currentTarget.style.color = linkStyle.color;
              }
            }}
          >
            Home
          </Link>
          <span className="mx-2">›</span>
          <Link
            to="/collections"
            style={getLinkStyle(globalData)}
            onMouseEnter={(e) => {
              const hoverStyle = getHoverStyle(globalData);
              if (hoverStyle.color) {
                e.currentTarget.style.color = hoverStyle.color;
              }
            }}
            onMouseLeave={(e) => {
              const linkStyle = getLinkStyle(globalData);
              if (linkStyle.color) {
                e.currentTarget.style.color = linkStyle.color;
              }
            }}
          >
            Collections
          </Link>
          <span className="mx-2">›</span>
          <span className="font-medium" style={getLinkStyle(globalData)}>
            {collection.title || 'Collection'}
          </span>
        </nav>
      </div>

      {/* Main Content with Filter and Products */}
      <div className="flex flex-col px-[7%] lg:flex-row pb-[50px]">
        {/* Filter Section - Pass global data */}
        {enableFilters && (
          <Filter
            filters={
              collectionPageSettings?.filters ||
              DEFAULT_COLLECTION_PAGE_SETTINGS.filters
            }
            filterData={filterData}
            onFilterChange={handleFilterChange}
            initialPriceRange={filterData?.priceRange}
            onGlobalSearchChange={setSearchTerm}
            globalSearchTerm={searchTerm}
            locale={locale}
            globalData={globalData}
          />
        )}

        {/* Products Section */}
        <div className={`flex-1 flex flex-col gap-[25px] py-[10px] ${!enableFilters ? 'w-full' : ''}`}>
          {/* Toolbar with Results Count and Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h6
              className="text-sm mb-2 sm:mb-0 font-bold"
              style={{
                ...getHeadingStyle(globalData, 'h6'),
                 color: '#737373',
                 fontSize: '14px',
                 lineHeight: '24px',
                 letterSpacing: '0.2px'
                }}
            >
              {filteredProducts.length > 0 ? (
                <>
                  Showing {startIndex + 1} -{' '}
                  {Math.min(endIndex, filteredProducts.length)} of{' '}
                  {filteredProducts.length} results
                </>
              ) : (
                <>Showing all 0 results</>
              )}
            </h6>

            {enableSorting && filteredProducts.length > 0 && (
              <CustomSortDropdown
                sortBy={sortBy}
                handleSortChange={handleSortChange}
              />
            )}
          </div>

          {/* Product Grid - Updated to use context props */}
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-x-[15px] md:gap-y-[40px]">
              {currentProducts.map((product, index) => (
                <div key={product.id}>
                  <ProductItem
                    product={product}
                    index={index}
                    // ✅ Remove wishlist and setWishlist props - using context
                    isWishlistEnabled={isWishlistEnabled}
                    isLoggedIn={isLoggedIn}
                    onQuickView={openQuickView}
                    inventorySettings={inventorySettings}
                    locale={locale}
                    onCartOpen={open}
                    globalData={globalData}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* No Results Found - keep as is */
            <div className="text-center">
              {/* ... keep existing no results JSX ... */}
            </div>
          )}

          {/* Pagination - keep as is */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 md:mt-10">
            </div>
          )}
        </div>
      </div>

      {/* Logo Slider */}
      {shouldShowLogoSlider && (
        <LogoSlider
          data={collectionPageSettings.logoSlider}
          globalData={globalData}
        />
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

      <Analytics.CollectionView
        data={{
          collection: {id: collection.id, handle: collection.handle},
        }}
      />
    </div>
  );
}

// NOTE: This is NOT a Storefront API query. It is kept as a plain string
// to avoid codegen validation errors. Settings are fetched from Sanity via sanityClient.
const ROOT_QUERY = `
  query RootQuery {
    sanityData: sanitySettings {
      settings {
        showQuickView
        quickViewConfig {
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
    }
  }
`;

/* ---------------- HEART ICON ---------------- */
function HeartIcon({filled, colorClass}) {
  return (
    <svg
      className={`w-5 h-5 transition-colors duration-200 ${colorClass}`}
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      fill={filled ? 'currentColor' : 'none'}
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

/* ---------------- PRODUCT CARD ---------------- */
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
    height: 500,
  };
};

// Helper function to check if a color name is a valid CSS color
function isValidCSSColor(colorName) {
  const validColors = [
    'aliceblue',
    'antiquewhite',
    'aqua',
    'aquamarine',
    'azure',
    'beige',
    'bisque',
    'black',
    'blanchedalmond',
    'blue',
    'blueviolet',
    'brown',
    'burlywood',
    'cadetblue',
    'chartreuse',
    'chocolate',
    'coral',
    'cornflowerblue',
    'cornsilk',
    'crimson',
    'cyan',
    'darkblue',
    'darkcyan',
    'darkgoldenrod',
    'darkgray',
    'darkgrey',
    'darkgreen',
    'darkkhaki',
    'darkmagenta',
    'darkolivegreen',
    'darkorange',
    'darkorchid',
    'darkred',
    'darksalmon',
    'darkseagreen',
    'darkslateblue',
    'darkslategray',
    'darkslategrey',
    'darkturquoise',
    'darkviolet',
    'deeppink',
    'deepskyblue',
    'dimgray',
    'dimgrey',
    'dodgerblue',
    'firebrick',
    'floralwhite',
    'forestgreen',
    'fuchsia',
    'gainsboro',
    'ghostwhite',
    'gold',
    'goldenrod',
    'gray',
    'grey',
    'green',
    'greenyellow',
    'honeydew',
    'hotpink',
    'indianred',
    'indigo',
    'ivory',
    'khaki',
    'lavender',
    'lavenderblush',
    'lawngreen',
    'lemonchiffon',
    'lightblue',
    'lightcoral',
    'lightcyan',
    'lightgoldenrodyellow',
    'lightgray',
    'lightgrey',
    'lightgreen',
    'lightpink',
    'lightsalmon',
    'lightseagreen',
    'lightskyblue',
    'lightslategray',
    'lightslategrey',
    'lightsteelblue',
    'lightyellow',
    'lime',
    'limegreen',
    'linen',
    'magenta',
    'maroon',
    'mediumaquamarine',
    'mediumblue',
    'mediumorchid',
    'mediumpurple',
    'mediumseagreen',
    'mediumslateblue',
    'mediumspringgreen',
    'mediumturquoise',
    'mediumvioletred',
    'midnightblue',
    'mintcream',
    'mistyrose',
    'moccasin',
    'navajowhite',
    'navy',
    'oldlace',
    'olive',
    'olivedrab',
    'orange',
    'orangered',
    'orchid',
    'palegoldenrod',
    'palegreen',
    'paleturquoise',
    'palevioletred',
    'papayawhip',
    'peachpuff',
    'peru',
    'pink',
    'plum',
    'powderblue',
    'purple',
    'rebeccapurple',
    'red',
    'rosybrown',
    'royalblue',
    'saddlebrown',
    'salmon',
    'sandybrown',
    'seagreen',
    'seashell',
    'sienna',
    'silver',
    'skyblue',
    'slateblue',
    'slategray',
    'slategrey',
    'snow',
    'springgreen',
    'steelblue',
    'tan',
    'teal',
    'thistle',
    'tomato',
    'turquoise',
    'violet',
    'wheat',
    'white',
    'whitesmoke',
    'yellow',
    'yellowgreen',
  ];

  if (validColors.includes(colorName)) return true;
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorName)) return true;
  if (/^rgba?\((\d{1,3},\s*){2,3}\d{1,3}(?:,\s*\d?\.?\d+)?\)$/.test(colorName))
    return true;
  if (
    /^hsla?\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%(?:,\s*\d?\.?\d+)?\)$/.test(
      colorName,
    )
  )
    return true;

  return false;
}

// ✅ Updated ProductItem Component - Uses wishlist context
// function ProductItem({
//   product,
//   index,
//   isWishlistEnabled,
//   isLoggedIn,
//   onQuickView,
//   inventorySettings,
//   locale,
//   onCartOpen,
//   globalData
// }) {
//   const image = getProductImage(product);
//   const price = product?.priceRange?.minVariantPrice;
//   const compareAtPrice = product?.compareAtPriceRange?.minVariantPrice;
//   const fetcher = useFetcher();
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [showVariantSelector, setShowVariantSelector] = useState(false);

//   // ✅ Use wishlist context
//   const { wishlist, setWishlist, toggleWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();

//   const variants = product?.variants?.nodes || [];
//   const firstVariant = variants[0];

//   const getActionButtonStyle = () => {
//     return {
//       borderRadius: `${globalData?.buttons?.borderRadius || 8}px`,
//       transition: `all ${globalData?.linksEffect?.transitionDuration || 300}ms ease`,
//     };
//   };

//   useEffect(() => {
//     if (fetcher.state === 'idle' && isAddingToCart) {
//       setIsAddingToCart(false);
//       if (fetcher.data?.cart) {
//         if (onCartOpen && typeof onCartOpen === 'function') {
//           onCartOpen('cart');
//         }
//       }
//     }
//   }, [fetcher.state, isAddingToCart, fetcher.data, onCartOpen]);

//   useEffect(() => {
//     if (variants.length > 0) {
//       setSelectedVariant(prev => {
//         if (prev) {
//           const updatedVariant = variants.find(v => v.id === prev.id);
//           if (updatedVariant) return updatedVariant;
//         }
//         return variants[0];
//       });
//     }
//   }, [product]);

//   const variantId = selectedVariant?.id;
//   const isOutOfStock = selectedVariant?.quantityAvailable <= 0 || !selectedVariant?.availableForSale;

//   // ✅ Use context's isInWishlist function
//   const isWished = isInWishlist(product.id, variantId);

//   const [loaded, setLoaded] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const hasCompareAtPrice = compareAtPrice && price && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

//   const quantity = selectedVariant?.quantityAvailable;

//   let inventoryBadge = null;
//   let badgeColor = "bg-gray-500";

//   if (inventorySettings?.enableInventoryBadges &&
//     quantity !== null &&
//     quantity !== undefined) {
//     if (quantity <= 0) {
//       inventoryBadge = inventorySettings.outOfStockMessage || "Out of Stock";
//       badgeColor = getBadgeColor(inventorySettings.outOfStockBadgeColor);
//     }
//     else if (quantity <= inventorySettings.criticalStockThreshold) {
//       inventoryBadge = inventorySettings.criticalStockMessage || "Only few left!";
//       badgeColor = getBadgeColor(inventorySettings.criticalStockBadgeColor);
//     }
//     else if (quantity <= inventorySettings.lowStockThreshold) {
//       inventoryBadge = inventorySettings.lowStockMessage || "Few left";
//       badgeColor = getBadgeColor(inventorySettings.lowStockBadgeColor);
//     }
//   }

//   // ✅ Updated toggleWishlist function using context
//   async function handleToggleWishlist(e) {
//     e.preventDefault();
//     e.stopPropagation();

//     const canAdd = () => {
//       if (!isWishlistEnabled) return false;
//       if (isWishlistEnabled?.requireLogin && !isLoggedIn) return false;
//       return true;
//     };

//     if (!canAdd()) {
//       window.location.href = '/signin';
//       return;
//     }

//     if (!isWishlistEnabled) {
//       alert("Wishlist is currently disabled");
//       return;
//     }

//     if (variants.length > 1 && !selectedVariant) {
//       setShowVariantSelector(true);
//       return;
//     }

//     const result = await toggleWishlist({
//       productId: product.id,
//       productTitle: product.title,
//       productHandle: product.handle,
//       productImage: image?.url || '',
//       productPrice: price?.amount || '0',
//       variantId: selectedVariant?.id || null,
//       variantTitle: selectedVariant?.title || null,
//       selectedOptions: selectedVariant?.selectedOptions || null,
//       variantImage: selectedVariant?.image?.url || null,
//       variantImageAlt: selectedVariant?.image?.altText || null,
//     });

//     if (!result.success && result.requiresLogin) {
//       window.location.href = '/signin';
//     } else if (!result.success && result.error) {
//       alert(result.error);
//     }
//   }

//   const handleQuickViewClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     onQuickView(product.handle, e);
//   };

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!variantId) {
//       console.error('No variant ID available');
//       if (variants.length > 0) {
//         setShowVariantSelector(true);
//       }
//       return;
//     }

//     if (isOutOfStock) {
//       alert('This product is out of stock');
//       return;
//     }

//     setIsAddingToCart(true);

//     fetcher.submit(
//       {
//         [CartForm.INPUT_NAME]: JSON.stringify({
//           action: CartForm.ACTIONS.LinesAdd,
//           inputs: {
//             lines: [
//               {
//                 merchandiseId: variantId,
//                 quantity: 1,
//               },
//             ],
//           },
//         }),
//       },
//       {
//         method: 'POST',
//         action: '/cart',
//       }
//     );
//   };

//   const handleVariantSelect = (variant, e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setSelectedVariant(variant);
//     setShowVariantSelector(false);
//   };

//   const WishlistIcon = ({ filled, hovered }) => (
//     <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//       <path
//         d="M14.031 2.8125H14.032C14.6118 2.81271 15.1858 2.92807 15.7205 3.15234C16.2552 3.37666 16.7398 3.70554 17.1462 4.11914C17.9751 4.96296 18.4392 6.09841 18.4392 7.28125C18.4392 8.46409 17.9751 9.59954 17.1462 10.4434L9.99976 17.6797L2.85425 10.4434C2.0255 9.59956 1.56128 8.46398 1.56128 7.28125C1.56128 6.09852 2.0255 4.96294 2.85425 4.11914C3.26082 3.70576 3.74625 3.37743 4.28101 3.15332C4.81567 2.9293 5.38978 2.81348 5.96948 2.81348C6.54921 2.81351 7.12329 2.92925 7.65796 3.15332C8.19262 3.37741 8.67722 3.70584 9.08374 4.11914L9.08472 4.12012L9.77808 4.82031L10.0007 5.04395L10.2224 4.82031L10.9158 4.12012L10.9177 4.11914C11.3237 3.70511 11.8078 3.37568 12.3425 3.15137C12.8771 2.92711 13.4513 2.81207 14.031 2.8125Z"
//         fill={filled ? "#EF4444" : "transparent"}
//         stroke={filled ? "#EF4444" : hovered ? "#ffffff" : "#252B42"}
//         strokeWidth="1.5"
//       />
//     </svg>
//   );

//   const CartIcon = ({ hovered }) => (
//     <svg
//       width="20"
//       height="20"
//       viewBox="0 0 20 20"
//       fill={hovered ? "#ffffff" : "#252B42"}
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path d="M0 1.63333C0 1.46536 0.0667281 1.30427 0.185505 1.1855C0.304281 1.06673 0.465377 1 0.633353 1H2.53341C2.67469 1.00004 2.8119 1.04731 2.92322 1.1343C3.03454 1.22129 3.11357 1.34299 3.14776 1.48007L3.66078 3.53333H18.3672C18.4602 3.53342 18.5521 3.55398 18.6362 3.59356C18.7204 3.63315 18.7948 3.69077 18.8541 3.76235C18.9135 3.83393 18.9564 3.9177 18.9797 4.00772C19.0031 4.09774 19.0063 4.19179 18.9892 4.2832L17.0891 14.4165C17.062 14.5617 16.9849 14.6927 16.8714 14.7871C16.7578 14.8815 16.6148 14.9332 16.4672 14.9333H5.06682C4.91917 14.9332 4.7762 14.8815 4.66263 14.7871C4.54906 14.6927 4.47204 14.5617 4.44487 14.4165L2.54608 4.3022L2.0394 2.26667H0.633353C0.465377 2.26667 0.304281 2.19994 0.185505 2.08117C0.0667281 1.96239 0 1.8013 0 1.63333ZM3.92932 4.8L5.59251 13.6667H15.9415L17.6047 4.8H3.92932ZM6.33353 14.9333C5.66163 14.9333 5.01724 15.2002 4.54214 15.6753C4.06703 16.1504 3.80012 16.7948 3.80012 17.4667C3.80012 18.1385 4.06703 18.7829 4.54214 19.258C5.01724 19.7331 5.66163 20 6.33353 20C7.00543 20 7.64981 19.7331 8.12492 19.258C8.60003 18.7829 8.86694 18.1385 8.86694 17.4667C8.86694 16.7948 8.60003 16.1504 8.12492 15.6753C7.64981 15.2002 7.00543 14.9333 6.33353 14.9333ZM15.2005 14.9333C14.5286 14.9333 13.8842 15.2002 13.4091 15.6753C12.934 16.1504 12.6671 16.7948 12.6671 17.4667C12.6671 18.1385 12.934 18.7829 13.4091 19.258C13.8842 19.7331 14.5286 20 15.2005 20C15.8724 20 16.5168 19.7331 16.9919 19.258C17.467 18.7829 17.7339 18.1385 17.7339 17.4667C17.7339 16.7948 17.467 16.1504 16.9919 15.6753C16.5168 15.2002 15.8724 14.9333 15.2005 14.9333ZM6.33353 16.2C6.66948 16.2 6.99167 16.3335 7.22922 16.571C7.46678 16.8085 7.60023 17.1307 7.60023 17.4667C7.60023 17.8026 7.46678 18.1248 7.22922 18.3623C6.99167 18.5999 6.66948 18.7333 6.33353 18.7333C5.99758 18.7333 5.67539 18.5999 5.43783 18.3623C5.20028 18.1248 5.06682 17.8026 5.06682 17.4667C5.06682 17.1307 5.20028 16.8085 5.43783 16.571C5.67539 16.3335 5.99758 16.2 6.33353 16.2ZM15.2005 16.2C15.5364 16.2 15.8586 16.3335 16.0962 16.571C16.3337 16.8085 16.4672 17.1307 16.4672 17.4667C16.4672 17.8026 16.3337 18.1248 16.0962 18.3623C15.8586 18.5999 15.5364 18.7333 15.2005 18.7333C14.8645 18.7333 14.5423 18.5999 14.3048 18.3623C14.0672 18.1248 13.9338 17.8026 13.9338 17.4667C13.9338 17.1307 14.0672 16.8085 14.3048 16.571C14.5423 16.3335 14.8645 16.2 15.2005 16.2Z" />
//     </svg>
//   );

//   const QuickViewIcon = ({ hovered }) => (
//     <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 10 12.5C9.33696 12.5 8.70107 12.2366 8.23223 11.7678C7.76339 11.2989 7.5 10.663 7.5 10C7.5 9.33696 7.76339 8.70107 8.23223 8.23223C8.70107 7.76339 9.33696 7.5 10 7.5C10.663 7.5 11.2989 7.76339 11.7678 8.23223C12.2366 8.70107 12.5 9.33696 12.5 10Z" fill="black" />
//       <path d="M2 10C2 10 5 4.5 10 4.5C15 4.5 18 10 18 10C18 10 15 15.5 10 15.5C5 15.5 2 10 2 10ZM10 13.5C10.9283 13.5 11.8185 13.1313 12.4749 12.4749C13.1313 11.8185 13.5 10.9283 13.5 10C13.5 9.07174 13.1313 8.1815 12.4749 7.52513C11.8185 6.86875 10.9283 6.5 10 6.5C9.07174 6.5 8.1815 6.86875 7.52513 7.52513C6.86875 8.1815 6.5 9.07174 6.5 10C6.5 10.9283 6.86875 11.8185 7.52513 12.4749C8.1815 13.1313 9.07174 13.5 10 13.5Z" fill={hovered ? "#ffffff" : "black"} />
//     </svg>
//   );

//   const [hoveredIcon, setHoveredIcon] = useState(null);

//   if (!product) return null;

//   return (
//     <div
//       className="bg-white rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden group"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <Link
//         to={`/${locale?.country || 'us'}/products/${product.handle}`}
//         className="block"
//         prefetch="intent"
//       >
//         <div className="relative">
//           {image && (
//             <div className="relative overflow-hidden aspect-square">
//               <Image
//                 data={image}
//                 alt={image.altText || product.title}
//                 aspectRatio="1/1"
//                 loading={index < 8 ? 'eager' : 'lazy'}
//                 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
//                 loaderOptions={{ scale: 0.1 }}
//                 className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'
//                   } ${loaded ? 'blur-0' : 'blur-xl'}`}
//                 onLoad={(e) => {
//                   e.currentTarget.style.filter = 'blur(0)';
//                   setLoaded(true);
//                 }}
//               />

//               {inventoryBadge && (
//                 <div className="absolute top-2 left-2 z-10">
//                   <span className={`${badgeColor} text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md`}>
//                     {inventoryBadge}
//                   </span>
//                 </div>
//               )}

//               {showVariantSelector && variants.length > 1 && (
//                 <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-4">
//                   <h4 className="text-sm font-semibold mb-2">Select a variant</h4>
//                   <div className="flex flex-wrap gap-2 justify-center max-h-32 overflow-y-auto">
//                     {variants.map((variant, idx) => (
//                       <button
//                         key={variant.id}
//                         onClick={(e) => handleVariantSelect(variant, e)}
//                         className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition"
//                       >
//                         {variant.title || `Variant ${idx + 1}`}
//                       </button>
//                     ))}
//                   </div>
//                   <button
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       setShowVariantSelector(false);
//                     }}
//                     className="mt-3 text-xs text-gray-500 hover:text-gray-700"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               )}

//               <div className={`absolute inset-0 bg-black/40 flex items-end justify-center pb-4 gap-2 transition-all duration-300 ${isHovered && !showVariantSelector ? 'opacity-100' : 'opacity-0'
//                 }`}>
//                 {isWishlistEnabled && (
//                   <button
//                     onClick={handleToggleWishlist}
//                     onMouseEnter={() => setHoveredIcon("wishlist")}
//                     onMouseLeave={() => setHoveredIcon(null)}
//                     disabled={wishlistLoading}
//                     className={`bg-white w-10 h-10 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${isWished ? "text-red-500" : "text-black"
//                       } hover:bg-black ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     style={getActionButtonStyle()}
//                   >
//                     {wishlistLoading ? (
//                       <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
//                     ) : (
//                       <WishlistIcon filled={isWished} hovered={hoveredIcon === "wishlist"} />
//                     )}
//                   </button>
//                 )}

//                 <button
//                   onClick={handleAddToCart}
//                   onMouseEnter={() => setHoveredIcon("cart")}
//                   onMouseLeave={() => setHoveredIcon(null)}
//                   disabled={isAddingToCart || isOutOfStock || !variantId}
//                   className="bg-white w-10 h-10 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black"
//                   style={getActionButtonStyle()}
//                 >
//                   {isAddingToCart ? (
//                     <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
//                     </svg>
//                   ) : (
//                     <CartIcon hovered={hoveredIcon === "cart"} />
//                   )}
//                 </button>

//                 <button
//                   onClick={handleQuickViewClick}
//                   onMouseEnter={() => setHoveredIcon("quick")}
//                   onMouseLeave={() => setHoveredIcon(null)}
//                   className="bg-white w-10 h-10 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black"
//                   style={getActionButtonStyle()}
//                 >
//                   <QuickViewIcon hovered={hoveredIcon === "quick"} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="mt-3 px-2 pb-3">
//           <h4 className="font-medium text-gray-900 line-clamp-2 text-sm md:text-base hover:text-gray-600 transition-colors">
//             {product.title}
//           </h4>

//           {variants.length > 1 && selectedVariant && (
//             <p className="text-xs text-gray-500 mt-1">
//               {selectedVariant.title}
//             </p>
//           )}

//           <div className="flex items-center gap-2 mt-1">
//             <span className="text-gray-900 font-bold text-lg">
//               {selectedVariant?.price ? (
//                 <Money data={selectedVariant.price} />
//               ) : price ? (
//                 <Money data={price} />
//               ) : 'Price not available'}
//             </span>
//             {hasCompareAtPrice && compareAtPrice && (
//               <span className="text-gray-400 line-through text-sm">
//                 <Money data={compareAtPrice} />
//               </span>
//             )}
//           </div>

//           <div className="mt-2 flex justify-end">
//             {product.options?.some(opt => opt.name.toLowerCase().includes('color')) && (
//               <div className="flex items-center gap-1 flex-wrap">
//                 {product.options
//                   .find(opt => opt.name.toLowerCase().includes('color'))
//                   ?.values.slice(0, 5)
//                   .map((color, index) => {
//                     const isValidColor = isValidCSSColor(color.toLowerCase());

//                     return isValidColor ? (
//                       <div
//                         key={index}
//                         className="w-5 h-5 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform cursor-pointer"
//                         style={{ backgroundColor: color.toLowerCase() }}
//                         title={color}
//                       />
//                     ) : (
//                       <span
//                         key={index}
//                         className="text-xs px-2 py-0.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
//                         title={color}
//                       >
//                         {color}
//                       </span>
//                     );
//                   })}

//                 {product.options
//                   .find(opt => opt.name.toLowerCase().includes('color'))
//                   ?.values.length > 5 && (
//                     <span className="text-xs text-gray-500 ml-1">
//                       +
//                       {product.options.find(opt =>
//                         opt.name.toLowerCase().includes('color')
//                       ).values.length - 5}
//                     </span>
//                   )}
//               </div>
//             )}
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// }
// ✅ Updated ProductItem Component with local loading state
function ProductItem({
  product,
  index,
  isWishlistEnabled,
  isLoggedIn,
  onQuickView,
  inventorySettings,
  locale,
  onCartOpen,
  globalData,
}) {
  const image = getProductImage(product);
  const price = product?.priceRange?.minVariantPrice;
  const compareAtPrice = product?.compareAtPriceRange?.minVariantPrice;
  const fetcher = useFetcher();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false); // ✅ Local loading state

  // ✅ Use wishlist context (remove loading from context)
  const {toggleWishlist, isInWishlist} = useWishlist();

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
      setSelectedVariant((prev) => {
        if (prev) {
          const updatedVariant = variants.find((v) => v.id === prev.id);
          if (updatedVariant) return updatedVariant;
        }
        return variants[0];
      });
    }
  }, [product]);

  const variantId = selectedVariant?.id;
  const isOutOfStock =
    selectedVariant?.quantityAvailable <= 0 ||
    !selectedVariant?.availableForSale;

  // ✅ Use context's isInWishlist function
  const isWished = isInWishlist(product.id, variantId);

  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const hasCompareAtPrice =
    compareAtPrice &&
    price &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  const quantity = selectedVariant?.quantityAvailable;

  let inventoryBadge = null;
  let badgeColor = '#6b7280';

  if (
    inventorySettings?.enableInventoryBadges &&
    quantity !== null &&
    quantity !== undefined
  ) {
    if (quantity <= 0) {
      inventoryBadge = inventorySettings.outOfStockMessage || 'Out of Stock';
      badgeColor = getBadgeColor(inventorySettings.outOfStockBadgeColor);
    } else if (quantity <= inventorySettings.criticalStockThreshold) {
      inventoryBadge =
        inventorySettings.criticalStockMessage || 'Only few left!';
      badgeColor = getBadgeColor(inventorySettings.criticalStockBadgeColor);
    } else if (quantity <= inventorySettings.lowStockThreshold) {
      inventoryBadge = inventorySettings.lowStockMessage || 'Few left';
      badgeColor = getBadgeColor(inventorySettings.lowStockBadgeColor);
    }
  }

  // ✅ Updated toggleWishlist function with local loading state
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
      alert('Wishlist is currently disabled');
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
    onQuickView(product.handle, e);
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
      },
    );
  };

  const handleVariantSelect = (variant, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVariant(variant);
    setShowVariantSelector(false);
  };

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

  if (!product) return null;

  return (
    <div
      className="rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden group"
      style={{
        backgroundColor: globalData?.darkMode?.enable ? '#1e1e1e' : '#ffffff',
      }}
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
                loaderOptions={{scale: 0.1}}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isHovered ? 'scale-110' : 'scale-100'
                } ${loaded ? 'blur-0' : 'blur-xl'}`}
                onLoad={(e) => {
                  e.currentTarget.style.filter = 'blur(0)';
                  setLoaded(true);
                }}
              />

              {inventoryBadge && (
                <div className="absolute top-2 left-2 z-10">
                  <span
                    className="text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md"
                    style={{backgroundColor: badgeColor}}
                  >
                    {inventoryBadge}
                  </span>
                </div>
              )}

              {showVariantSelector && variants.length > 1 && (
                <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-4">
                  <h4
                    className="font-semibold mb-2"
                    style={getHeadingStyle(globalData, 'h4')}
                  >
                    Select a variant
                  </h4>
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

              <div
                className={`absolute inset-0 bg-black/40 flex items-end justify-center pb-4 gap-[10px] transition-all duration-300 ${
                  isHovered && !showVariantSelector
                    ? 'opacity-100'
                    : 'opacity-0'
                }`}
              >
                {isWishlistEnabled && (
                  <button
                    onClick={handleToggleWishlist}
                    onMouseEnter={() => setHoveredIcon('wishlist')}
                    onMouseLeave={() => setHoveredIcon(null)}
                    disabled={isWishlistLoading}
                    className={`bg-white w-10 h-10 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${
                      isWished ? 'text-red-500' : 'text-black'
                    } hover:bg-black ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{
                      borderRadius: '100%',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isWishlistLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <WishlistIcon
                        filled={isWished}
                        hovered={hoveredIcon === 'wishlist'}
                      />
                    )}
                  </button>
                )}

                <button
                  onClick={handleAddToCart}
                  onMouseEnter={() => setHoveredIcon('cart')}
                  onMouseLeave={() => setHoveredIcon(null)}
                  disabled={isAddingToCart || isOutOfStock || !variantId}
                  className="bg-white w-10 h-10 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black"
                  style={{
                      borderRadius: '100%',
                      transition: 'all 0.3s ease',
                    }}
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
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  ) : (
                    <CartIcon hovered={hoveredIcon === 'cart'} />
                  )}
                </button>

                <button
                  onClick={handleQuickViewClick}
                  onMouseEnter={() => setHoveredIcon('quick')}
                  onMouseLeave={() => setHoveredIcon(null)}
                  className="bg-white w-10 h-10 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black"
                  style={{
                      borderRadius: '100%',
                      transition: 'all 0.3s ease',
                    }}
                >
                  <QuickViewIcon hovered={hoveredIcon === 'quick'} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-[15px] px-[15px] pb-[11px] flex flex-col gap-[11px]">
          <h6
            className="font-medium line-clamp-2 transition-colors"
            style={{
              ...getHeadingStyle(globalData, 'h6'),
              color: globalData?.darkMode?.enable ? '#ffffff' : '#252b42ff',
              lineHeight: '24px',
              letterSpacing: '0.1px'
            }}
          >
            {product.title}
          </h6>

          {variants.length > 1 && selectedVariant && (
            <p className="text-xs text-gray-500">
              {selectedVariant.title}
            </p>
          )}

          <div className="flex items-center gap-[5px]">
            {hasCompareAtPrice && compareAtPrice && (
              <span className="text-gray-400 line-through text-sm"
               style={{
                 fontWeight:"700",
                 fontSize:"16px",
                 color: globalData?.darkMode?.enable ? '#ffffff' : '#BDBDBD',
                 lineHeight: '24px',
                 letterSpacing: '0.1px',
                 marginRight: '0px'
               }}
              >
                <Money data={compareAtPrice} />
              </span>
            )}
            <span
              className="font-bold text-[16px]"
              style={{
                color: globalData?.darkMode?.enable ? '#ffffff' : '#23856D',
                lineHeight: '24px',
                letterSpacing: '0.1px'
              }}
            >
              {selectedVariant?.price ? (
                <Money data={selectedVariant.price} />
              ) : price ? (
                <Money data={price} />
              ) : (
                'Price not available'
              )}
            </span>
            
          </div>

            {product.options?.some((opt) =>
              opt.name.toLowerCase().includes('color'),
            ) && (
              <div className="flex justify-end">
              <div className="flex items-center gap-1 flex-wrap">
                {product.options
                  .find((opt) => opt.name.toLowerCase().includes('color'))
                  ?.values.slice(0, 5)
                  .map((color, index) => {
                    const isValidColor = isValidCSSColor(color.toLowerCase());

                    return isValidColor ? (
                      <div
                        key={index}
                        className="w-[16px] h-[16px] rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                        style={{backgroundColor: color.toLowerCase()}}
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

                {product.options.find((opt) =>
                  opt.name.toLowerCase().includes('color'),
                )?.values.length > 5 && (
                  <span className="text-xs text-gray-500 ml-1">
                    +
                    {product.options.find((opt) =>
                      opt.name.toLowerCase().includes('color'),
                    ).values.length - 5}
                  </span>
                )}
              </div>
          </div>
            )}
        </div>
      </Link>
    </div>
  );
}

const COLLECTION_QUERY = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
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
      altText
      url
      width
      height
    }
    variants(first: 100) {
      nodes {
        id
        title
        availableForSale
        quantityAvailable
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          id
          url
          altText
          width
          height
        }
        selectedOptions {
          name
          value
        }
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
    }
  }
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $after: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        after: $after
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
