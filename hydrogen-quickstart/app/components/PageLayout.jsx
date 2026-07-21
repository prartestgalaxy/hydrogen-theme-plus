
import { Footer } from '~/components/CustomFooter';
import { HeaderMenu } from '~/components/HeaderMenu';
import { AnnouncementBar } from '~/components/AnnouncementBar';
import { CartMain } from '~/components/CartMain';
import { Await, Link, NavLink, useFetcher, useParams, useRevalidator } from 'react-router';
import { Suspense, useId, useEffect, useState } from 'react';
import { CartForm, Money } from '@shopify/hydrogen';
import { Aside, useAside } from '~/components/Aside';
import QuickView from '~/components/QuickView';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import { SearchResultsPredictive } from '~/components/SearchResultsPredictive';
import { useWishlist } from '~/context/WishlistContext';

export function PageLayout({
  cart,
  children = null,
  isLoggedIn,
  publicStoreDomain,
  sanityData,
  freeShippingSettings,
  wishlistSettings,
  wishlist,
  inventorySettings,
  quickViewConfig,
  localization,
  shopName,
  topCollections,
  topProductTags,
  quickPicks,
  globalSettings,
}) {
  const announcementBar = sanityData?.home?.announcementBar;
  const header = sanityData?.home?.header;
  const footer = sanityData?.home?.footer;
  const { locale } = useParams();
  const globalData = globalSettings;
  
  const activeCountry = localization?.country?.isoCode?.toLowerCase() || locale || 'us';
  const activeCurrency = localization?.country?.currency?.isoCode || 'USD';
  const currentLocale = { country: activeCountry, currency: activeCurrency };

  // console.log(globalData, 'globalData');

  // Get quickViewConfig from sanityData if not passed directly
  const effectiveQuickViewConfig = quickViewConfig || sanityData?.settings?.quickViewConfig;
  
  const { fetchWishlist } = useWishlist();
  
  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist();
    }
  }, [isLoggedIn, fetchWishlist]);

  return (
    <>
      <Aside.Provider>
        <CartAside cart={cart} freeShippingSettings={freeShippingSettings} locale={locale} globalData={globalData} />
        <MobileMenuAside header={header} globalData={globalData} />

        <SearchAside
          topCollections={topCollections}
          topProductTags={topProductTags}
          quickPicks={quickPicks}
          wishlistSettings={wishlistSettings}
          isLoggedIn={isLoggedIn}
          inventorySettings={inventorySettings}
          quickViewConfig={effectiveQuickViewConfig}
          locale={currentLocale}
          globalData={globalData}
        />

        {announcementBar && <AnnouncementBar bar={announcementBar} globalData={globalData}/>}

        {header && (
          <HeaderMenu
            header={header}
            cart={cart}
            isLoggedIn={isLoggedIn}
            publicStoreDomain={publicStoreDomain}
            wishlistSettings={wishlistSettings}
            localization={localization}
            globalData={globalData}
          />
        )}

        <main>
          {children}
        </main>

        {footer?.showFooter && (
          <Footer footer={footer} storeName={shopName} globalData={globalData} />
        )}
      </Aside.Provider>
    </>
  );
}

function MobileMenuAside({ header, globalData }) {
  const getLinkStyle = () => {
    if (!globalData?.linksEffect) return {};
    const links = globalData.linksEffect;
    return {
      color: `#${links.linkColor}`,
      transition: `color ${links.transitionDuration}ms ease`,
      textDecoration: links.underlineStyle === 'none' ? 'none' : 'underline',
    };
  };

  const getHoverStyle = () => {
    if (!globalData?.linksEffect) return {};
    return {
      color: `#${globalData.linksEffect.hoverColor}`,
    };
  };

  return (
    <Aside type="mobile" heading="MENU">
      <nav className="p-6">
        {header?.menu?.map((item) => (
          <NavLink
            key={item._key}
            to={resolveSanityLink(item.link)}
            className="block text-xl py-3 border-b border-gray-50"
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
            {item.label}
          </NavLink>
        ))}
      </nav>
    </Aside>
  );
}

function CartAside({ cart, freeShippingSettings, locale, globalData }) {
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
        backgroundColor: `#${buttons.primaryBg}`,
        color: `#${buttons.primaryText}`,
        borderRadius: `${buttons.borderRadius}px`,
        transition: `all ${links.transitionDuration}ms ease`,
      };
    } else {
      return {
        backgroundColor: `#${buttons.secondaryBg}`,
        color: `#${buttons.secondaryText}`,
        borderRadius: `${buttons.borderRadius}px`,
        transition: `all ${links.transitionDuration}ms ease`,
      };
    }
  };

  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(resolvedCart) => (
            <>
              <CartAutoSync cart={resolvedCart} />
              <CartMain
                freeShippingSettings={freeShippingSettings}
                cart={resolvedCart}
                layout="aside"
                locale={locale}
                globalData={globalData}
                getButtonStyle={getButtonStyle}
              />
            </>
          )}
        </Await>
      </Suspense>
    </Aside>
  );
}

function CartAutoSync({ cart }) {
  const { locale } = useParams();
  const { revalidate } = useRevalidator();

  const currentCountry = locale ? locale.toUpperCase() : 'US';
  const cartCountry = cart?.buyerIdentity?.countryCode;

  useEffect(() => {
    if (cartCountry && cartCountry !== currentCountry) {
      const cartRoute = locale ? `/${locale}/cart` : '/cart';

      const formData = new FormData();
      formData.append('cartFormInput', JSON.stringify({
        action: 'BuyerIdentityUpdate',
        inputs: { buyerIdentity: { countryCode: currentCountry } },
      }));

      fetch(cartRoute, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
        .then(() => {
          revalidate();
        })
        .catch((err) => console.error('Cart auto-sync failed:', err));
    }
  }, [cartCountry, currentCountry, locale, revalidate]);

  return null;
}

function resolveSanityLink(link) {
  if (!link) return '/';
  const slug = link.page?.slug ?? link.collection?.slug ?? link.product?.slug ?? '';
  switch (link.type) {
    case 'collection': return `/collections/${slug}`;
    case 'product': return `/products/${slug}`;
    case 'page': return `/pages/${slug}`;
    default: return '/';
  }
}

function SearchAside({
  topCollections = [],
  topProductTags = [],
  quickPicks = [],
  wishlistSettings,
  isLoggedIn,
  inventorySettings,
  quickViewConfig,
  locale,
  globalData
}) {
  const { close } = useAside();
  const { wishlist, toggleWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();
  
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
        backgroundColor: `#${buttons.secondaryBg}`,
        color: `#${buttons.secondaryText}`,
        borderRadius: `${buttons.borderRadius}px`,
        transition: `all ${links.transitionDuration}ms ease`,
      };
    }
  };
  
  const getLinkStyle = () => {
    if (!globalData?.linksEffect) return {};
    
    const links = globalData.linksEffect;
    return {
      color: `#${links.linkColor}`,
      transition: `color ${links.transitionDuration}ms ease`,
      textDecoration: links.underlineStyle === 'none' ? 'none' : 'underline',
    };
  };
  
  const getHeadingStyle = (level = 'h3') => {
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
      fontSize: `${sizeMap[level] || sizes.h3}px`,
      fontFamily: globalData.fontFamily || 'Montserrat, sans-serif',
      fontWeight: 'bold',
      lineHeight: '1.2',
    };
  };
  
  const getHoverStyle = () => {
    if (!globalData?.linksEffect) return {};
    return {
      color: `#${globalData.linksEffect.hoverColor}`,
    };
  };

  const queriesDatalistId = useId();
  const [recentSearches, setRecentSearches] = useState([]);
  const [showPredictiveResults, setShowPredictiveResults] = useState(false);
  const [quickViewProductHandle, setQuickViewProductHandle] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const primaryColor = globalData?.buttons?.primaryBg ? `#${globalData.buttons.primaryBg}` : '#23A6F0';
  const primaryHoverColor = globalData?.buttons?.primaryHoverBg ? `#${globalData.buttons.primaryHoverBg}` : '#1a7ab0';
  const borderRadius = globalData?.buttons?.borderRadius || 8;

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveSearchTerm = (term) => {
    if (!term || term.trim() === '') return;

    setRecentSearches(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const removeRecentSearch = (termToRemove, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setRecentSearches(prev => {
      const updated = prev.filter(term => term !== termToRemove);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearch = (term, goToSearch) => {
    if (term) {
      saveSearchTerm(term);
    }
    goToSearch();
  };

  const openQuickView = (productHandle, e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProductHandle(productHandle);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProductHandle(null);
  };

  const handleToggleWishlist = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = product.variants?.nodes?.[0];
    
    const result = await toggleWishlist({
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle,
      productImage: product.featuredImage?.url || '',
      productPrice: variant?.price?.amount || '0',
      variantId: variant?.id || null,
      variantTitle: variant?.title || null,
      variantImage: variant?.image?.url || null,
      variantImageAlt: variant?.image?.altText || null,
      selectedOptions: variant?.selectedOptions || null,
    });

    if (!result.success && result.requiresLogin) {
      window.location.href = '/signin';
    }
  };

  const countryPrefix = locale?.country && locale.country !== 'us' ? `/${locale.country}` : '';

  return (
    <Aside type="search" heading="SEARCH">
      <div 
        className="p-6 predictive-search w-full overflow-y-auto hide-scrollbar"
       
      >
        <SearchFormPredictive>
          {({ fetchResults, goToSearch, inputRef, fetcher }) => (
            <>
              <div 
                className="bg-[#F5F5F5] w-full mb-4 flex items-center border border-gray-300 px-2 py-2 md:px-4 md:py-3"
                style={{ borderRadius: '5px' }}
              >
                <div className="mr-2 md:mr-3 shrink-0">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="w-4 h-4 md:w-[16px] md:h-[16px]"
                  >
                    <g clipPath="url(#clip0_328_3229)">
                      <path fillRule="evenodd" clipRule="evenodd" d="M11.4601 10.3188L15.7639 14.6226C15.9151 14.7739 16.0001 14.9792 16 15.1932C15.9999 15.4072 15.9148 15.6124 15.7635 15.7637C15.6121 15.915 15.4068 15.9999 15.1928 15.9998C14.9788 15.9998 14.7736 15.9147 14.6223 15.7633L10.3185 11.4595C9.03194 12.456 7.41407 12.9249 5.79403 12.7709C4.17398 12.6169 2.67346 11.8515 1.59771 10.6304C0.521957 9.40935 -0.0482098 7.82432 0.00319691 6.19779C0.0546036 4.57125 0.723722 3.02539 1.87443 1.87468C3.02514 0.723966 4.57101 0.0548478 6.19754 0.00344105C7.82408 -0.0479656 9.40911 0.522201 10.6302 1.59795C11.8513 2.6737 12.6167 4.17422 12.7707 5.79427C12.9247 7.41431 12.4558 9.03219 11.4593 10.3188H11.4601ZM6.4003 11.1995C7.67328 11.1995 8.89412 10.6938 9.79425 9.79369C10.6944 8.89356 11.2001 7.67272 11.2001 6.39974C11.2001 5.12676 10.6944 3.90592 9.79425 3.00579C8.89412 2.10565 7.67328 1.59996 6.4003 1.59996C5.12732 1.59996 3.90648 2.10565 3.00634 3.00579C2.10621 3.90592 1.60052 5.12676 1.60052 6.39974C1.60052 7.67272 2.10621 8.89356 3.00634 9.79369C3.90648 10.6938 5.12732 11.1995 6.4003 11.1995Z" fill="#737373" />
                    </g>
                    <defs>
                      <clipPath id="clip0_328_3229">
                        <rect width="15.9645" height="15.9998" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>

                <input
                  name="q"
                  onChange={(e) => {
                    fetchResults(e);
                    setShowPredictiveResults(e.target.value.length > 0);
                  }}
                  onFocus={(e) => setShowPredictiveResults(e.target.value.length > 0)}
                  placeholder="Search for products..."
                  ref={inputRef}
                  type="search"
                  autoFocus
                  className="flex-1 min-w-0 bg-transparent outline-none text-sm text-black placeholder-[#737373] focus:ring-0 border-none"
                
                />

                <button
                  onClick={() => handleSearch(inputRef?.current?.value, goToSearch)}
                  className="shrink-0 ml-1.5 md:ml-2 px-3 py-1.5 md:px-4 md:py-2 text-white border-2 uppercase text-[10px] md:text-xs tracking-widest font-bold transition-opacity hover:opacity-90"
                  style={{
  ...getButtonStyle('primary'),
  borderRadius: '5px',
}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = primaryHoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColor;
                  }}
                >
                  Search
                </button>
              </div>

              {!showPredictiveResults ? (
                <div className="space-y-6 w-full">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 
                        className="text-xs font-bold uppercase tracking-widest"
                        style={getHeadingStyle('h6')}
                      >
                        Recent searches
                      </h3>
                      {recentSearches.length > 0 && (
                        <button
                          onClick={clearAllRecentSearches}
                          className="text-xs text-gray-500 hover:text-gray-700 uppercase tracking-wider transition-colors"
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
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 w-full">
                      {recentSearches.length > 0 ? (
                        recentSearches.map((term, index) => (
                          <div key={index} className="relative group">
                            <button
                              onClick={() => {
                                if (inputRef.current) {
                                  inputRef.current.value = term;
                                  handleSearch(term, goToSearch);
                                }
                              }}
                              className="bg-[#F9F9F9] text-[#737373] flex items-center gap-2 border border-[#DDDDDD] px-4 py-3 text-xs uppercase tracking-widest hover:opacity-70 pr-10"
                              style={{ borderRadius: '5px' }}
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M0.75 3V7.5H5.25" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2.6325 11.2503C3.1188 12.6306 4.0405 13.8155 5.25874 14.6264C6.47698 15.4373 7.92576 15.8303 9.38679 15.7462C10.8478 15.6621 12.2419 15.1055 13.3591 14.1601C14.4763 13.2148 15.2559 11.9321 15.5807 10.5051C15.9054 9.07814 15.7576 7.5843 15.1595 6.24865C14.5614 4.91301 13.5454 3.80792 12.2646 3.0999C10.9839 2.39188 9.50768 2.11928 8.05851 2.32317C6.60934 2.52706 5.26568 3.19639 4.23 4.23033L0.75 7.50033" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              {term}
                            </button>
                            <button
                              onClick={(e) => removeRecentSearch(term, e)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center"
                              aria-label={`Remove ${term} from recent searches`}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs uppercase tracking-widest opacity-50">No recent searches</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 
                      className="text-[11px] md:text-xs text-[#252B42] font-bold uppercase tracking-widest mb-2 md:mb-3"
                      style={getHeadingStyle('h6')}
                    >
                      Popular Categories
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 w-full">
                      {topCollections.length > 0 ? (
                        topCollections.map((collection) => (
                          <Link
                            key={collection.id}
                            to={`${countryPrefix}/collections/${collection.handle}`}
                            onClick={() => {saveSearchTerm(collection.title); close();}}
                            className="relative flex flex-col md:flex-row items-center justify-center md:justify-between overflow-hidden rounded-xl bg-gray-100 group hover:shadow-md transition-all duration-300 min-h-[105px] sm:min-h-[108px] w-full p-1.5 md:py-[16px] md:pr-[12px] md:pl-[15px]"
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
                            <span className="relative z-10 text-[11px] md:text-sm font-semibold pr-0 md:pr-2 break-words text-center md:text-left max-w-full md:max-w-[50%] order-last md:order-first mt-1 md:mt-0 leading-snug">
                              {collection.title}
                            </span>

                            <div className="relative md:absolute md:right-0 md:top-0 h-[65px] md:h-full w-full md:w-[45%] flex items-center justify-center md:justify-end order-first md:order-last">
                              <img
                                src={collection.image.url}
                                alt={collection.image.altText || collection.title}
                                width={collection.image.width}
                                height={collection.image.height}
                                className="h-full md:h-[85%] w-auto max-w-full object-contain object-center md:object-right mix-blend-multiply group-hover:scale-105 transition-transform duration-300 md:mr-3"
                              />
                            </div>
                          </Link>
                        ))
                      ) : (
                        [
                          { name: 'Women', icon: '👗' },
                          { name: 'Men', icon: '👔' },
                          { name: 'Sports', icon: '⚽' },
                          { name: 'Bags', icon: '👜' },
                          { name: 'Accessories', icon: '⌚' },
                          { name: 'Shoes', icon: '👟' },
                          { name: 'Kids', icon: '🧸' },
                          { name: 'Home', icon: '🏠' }
                        ].map((category) => (
                          <button
                            key={category.name}
                            className="relative flex flex-col md:flex-row items-center justify-center md:justify-between overflow-hidden rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300 min-h-[105px] sm:min-h-[108px] w-full p-1.5 md:py-[16px] md:pr-[12px] md:pl-[15px]"
                          >
                            <span className="relative z-10 text-[11px] md:text-sm font-semibold pr-0 md:pr-2 break-words text-center md:text-left max-w-full md:max-w-[50%] order-last md:order-first mt-1 md:mt-0 leading-snug">
                              {category.name}
                            </span>
                            <span className="text-[32px] md:text-2xl opacity-40 md:opacity-30 order-first md:order-last">
                              {category.icon}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 
                      className="text-xs font-bold uppercase tracking-widest mb-3"
                      style={getHeadingStyle('h6')}
                    >
                      Trending now
                    </h3>
                    <div className="flex flex-row flex-wrap gap-3">
                      {topProductTags.length > 0 ? (
                        topProductTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              if (inputRef.current) {
                                inputRef.current.value = tag;
                                handleSearch(tag, goToSearch);
                              }
                            }}
                            className="px-4 py-3 text-sm rounded-lg bg-[#DBEBF8] text-[#4F5F5D] hover:opacity-80 transition"
                            style={{ borderRadius: '5px' }}
                          >
                            {tag}
                          </button>
                        ))
                      ) : (
                        <>
                          <button className="px-4 py-3 text-sm rounded-lg bg-[#DBEBF8] text-[#4F5F5D] hover:opacity-80 transition">Summer sale</button>
                          <button className="px-4 py-3 text-sm rounded-lg bg-[#DBEBF8] text-[#4F5F5D] hover:opacity-80 transition">Sneakers for Men</button>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 
                      className="text-xs font-bold uppercase tracking-widest mb-3"
                      style={getHeadingStyle('h6')}
                    >
                      Quick picks
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                      {quickPicks.length > 0 ? (
                        quickPicks.map((product, index) => (
                          <SearchProductItem
                            key={product.id}
                            product={product}
                            index={index}
                            isWishlistEnabled={wishlistSettings?.enabled}
                            isLoggedIn={isLoggedIn}
                            onQuickView={openQuickView}
                            inventorySettings={inventorySettings}
                            onToggleWishlist={handleToggleWishlist}
                            isInWishlist={isInWishlist}
                            locale={locale}
                            globalData={globalData}
                            loading={wishlistLoading}
                          />
                        ))
                      ) : (
                        [
                          {
                            id: '1', title: 'Sketchers Jacket', handle: 'sketchers-jacket',
                            featuredImage: { url: '', altText: '' },
                            variants: { nodes: [{ price: { amount: '16.48', currencyCode: 'USD' }, compareAtPrice: { amount: '6.48', currencyCode: 'USD' }, quantityAvailable: 10, availableForSale: true, id: 'variant1' }] }
                          },
                          {
                            id: '2', title: 'Sketchers GOAL Pant', handle: 'sketchers-goal-pant',
                            featuredImage: { url: '', altText: '' },
                            variants: { nodes: [{ price: { amount: '16.48', currencyCode: 'USD' }, compareAtPrice: { amount: '6.48', currencyCode: 'USD' }, quantityAvailable: 5, availableForSale: true, id: 'variant2' }] }
                          },
                        ].map((product, index) => (
                          <SearchProductItem
                            key={product.id}
                            product={product}
                            index={index}
                            isWishlistEnabled={wishlistSettings?.enabled}
                            isLoggedIn={isLoggedIn}
                            onQuickView={openQuickView}
                            inventorySettings={inventorySettings}
                            onToggleWishlist={handleToggleWishlist}
                            isInWishlist={isInWishlist}
                            locale={locale}
                            globalData={globalData}
                            loading={wishlistLoading}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <SearchResultsPredictive>
                    {({ items, total, term, state, closeSearch }) => {
                      const { articles, collections, pages, products, queries } = items;

                      if (state === 'loading' && term.current) {
                        return <div className="text-xs uppercase tracking-widest py-4">Loading...</div>;
                      }

                      if (!total) {
                        return <SearchResultsPredictive.Empty term={term} />;
                      }

                      return (
                        <div className="space-y-8">
                          <SearchResultsPredictive.Queries queries={queries} queriesDatalistId={queriesDatalistId} />

                          {products && products.length > 0 && (
                            <div>
                              <h3 
                                className="text-xs font-bold uppercase tracking-widest mb-3"
                                style={getHeadingStyle('h6')}
                              >
                                Products
                              </h3>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                                {products.map((product, index) => {
                                  const variant = product.selectedOrFirstAvailableVariant || {};
                                  const variantId = variant.id;
                                  const price = variant.price || product.price || { amount: '0', currencyCode: 'USD' };
                                  const compareAtPrice = variant.compareAtPrice || null;
                                  const image = variant.image || product.image || product.featuredImage;

                                  const transformedProduct = {
                                    id: product.id,
                                    title: product.title,
                                    handle: product.handle,
                                    featuredImage: image ? { url: image.url, altText: image.altText || product.title } : { url: 'https://via.placeholder.com/300x300?text=No+Image', altText: product.title },
                                    variants: { nodes: [{ id: variantId, price: price, compareAtPrice: compareAtPrice, quantityAvailable: 10, availableForSale: true }] },
                                    priceRange: { minVariantPrice: price }
                                  };

                                  return (
                                    <SearchProductItem
                                      key={product.id}
                                      product={transformedProduct}
                                      index={index}
                                      isWishlistEnabled={wishlistSettings?.enabled}
                                      isLoggedIn={isLoggedIn}
                                      onQuickView={openQuickView}
                                      inventorySettings={inventorySettings}
                                      onToggleWishlist={handleToggleWishlist}
                                      isInWishlist={isInWishlist}
                                      closeSearch={closeSearch}
                                      locale={locale}
                                      globalData={globalData}
                                      loading={wishlistLoading}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <SearchResultsPredictive.Collections
                            collections={collections}
                            closeSearch={() => { if (term.current) { saveSearchTerm(term.current); } closeSearch(); }}
                            term={term}
                            locale={locale}
                          />
                          <SearchResultsPredictive.Pages
                            pages={pages}
                            closeSearch={() => { if (term.current) { saveSearchTerm(term.current); } closeSearch(); }}
                            term={term}
                            locale={locale}
                          />
                          {term.current && total ? (
                            <Link
                              onClick={() => { saveSearchTerm(term.current); closeSearch(); }}
                              to={`${countryPrefix}/search?q=${term.current}`}
                              className="block border-t pt-4 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-70"
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
                              View all results for <q>{term.current}</q> &nbsp; →
                            </Link>
                          ) : null}
                        </div>
                      );
                    }}
                  </SearchResultsPredictive>
                </div>
              )}
            </>
          )}
        </SearchFormPredictive>
      </div>

      <QuickView
        productHandle={quickViewProductHandle}
        config={quickViewConfig}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
        locale={locale}
        isWishlistEnabled={wishlistSettings?.enabled}
        isLoggedIn={isLoggedIn}
        globalData={globalData}
      />
    </Aside>
  );
}

function SearchProductItem({
  product,
  index,
  isWishlistEnabled,
  isLoggedIn,
  onQuickView,
  inventorySettings,
  onToggleWishlist,
  isInWishlist,
  closeSearch,
  locale,
  globalData,
  loading
}) {
  const fetcher = useFetcher();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const getActionButtonStyle = () => {
    return {
      borderRadius: `${globalData?.buttons?.borderRadius || 8}px`,
      transition: `all ${globalData?.linksEffect?.transitionDuration || 300}ms ease`,
    };
  };

  const image = product?.featuredImage;
  const firstVariant = product?.variants?.nodes?.[0];
  const variantId = firstVariant?.id;
  const price = firstVariant?.price;
  const compareAtPrice = firstVariant?.compareAtPrice;
  const isOutOfStock = firstVariant?.quantityAvailable <= 0 || !firstVariant?.availableForSale;
  const quantity = firstVariant?.quantityAvailable;

  const isWished = isInWishlist(product.id, variantId);
  const hasCompareAtPrice = compareAtPrice && price && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  const getBadgeColor = (color) => {
    return color || '#6b7280';
  };

  let inventoryBadge = null;
  let badgeColor = '#6b7280';

  if (inventorySettings?.enableInventoryBadges && quantity !== null && quantity !== undefined) {
    if (quantity <= 0) {
      inventoryBadge = inventorySettings.outOfStockMessage || "Out of Stock";
      badgeColor = getBadgeColor(inventorySettings.outOfStockBadgeColor);
    } else if (quantity <= inventorySettings.criticalStockThreshold) {
      inventoryBadge = inventorySettings.criticalStockMessage || "Only few left!";
      badgeColor = getBadgeColor(inventorySettings.criticalStockBadgeColor);
    } else if (quantity <= inventorySettings.lowStockThreshold) {
      inventoryBadge = inventorySettings.lowStockMessage || "Few left";
      badgeColor = getBadgeColor(inventorySettings.lowStockBadgeColor);
    }
  }

  useEffect(() => {
    if (fetcher.state === 'idle' && isAddingToCart) setIsAddingToCart(false);
  }, [fetcher.state, isAddingToCart]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!variantId) return;
    if (isOutOfStock) { alert('This product is out of stock'); return; }

    setIsAddingToCart(true);
    fetcher.submit(
      { [CartForm.INPUT_NAME]: JSON.stringify({ action: CartForm.ACTIONS.LinesAdd, inputs: { lines: [{ merchandiseId: variantId, quantity: 1 }] } }) },
      { method: 'POST', action: '/cart' }
    );
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product.handle, e);
  };

  const handleWishlistClick = (e) => onToggleWishlist(e, product);
  const handleProductClick = () => { if (closeSearch) closeSearch(); };
  
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
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_5_522)">
        <path d="M0 1.63333C0 1.46536 0.0667281 1.30427 0.185505 1.1855C0.304281 1.06673 0.465377 1 0.633353 1H2.53341C2.67469 1.00004 2.8119 1.04731 2.92322 1.1343C3.03454 1.22129 3.11357 1.34299 3.14776 1.48007L3.66078 3.53333H18.3672C18.4602 3.53342 18.5521 3.55398 18.6362 3.59356C18.7204 3.63315 18.7948 3.69077 18.8541 3.76235C18.9135 3.83393 18.9564 3.9177 18.9797 4.00772C19.0031 4.09774 19.0063 4.19179 18.9892 4.2832L17.0891 14.4165C17.062 14.5617 16.9849 14.6927 16.8714 14.7871C16.7578 14.8815 16.6148 14.9332 16.4672 14.9333H5.06682C4.91917 14.9332 4.7762 14.8815 4.66263 14.7871C4.54906 14.6927 4.47204 14.5617 4.44487 14.4165L2.54608 4.3022L2.0394 2.26667H0.633353C0.465377 2.26667 0.304281 2.19994 0.185505 2.08117C0.0667281 1.96239 0 1.8013 0 1.63333ZM3.92932 4.8L5.59251 13.6667H15.9415L17.6047 4.8H3.92932ZM6.33353 14.9333C5.66163 14.9333 5.01724 15.2002 4.54214 15.6753C4.06703 16.1504 3.80012 16.7948 3.80012 17.4667C3.80012 18.1385 4.06703 18.7829 4.54214 19.258C5.01724 19.7331 5.66163 20 6.33353 20C7.00543 20 7.64981 19.7331 8.12492 19.258C8.60003 18.7829 8.86694 18.1385 8.86694 17.4667C8.86694 16.7948 8.60003 16.1504 8.12492 15.6753C7.64981 15.2002 7.00543 14.9333 6.33353 14.9333ZM15.2005 14.9333C14.5286 14.9333 13.8842 15.2002 13.4091 15.6753C12.934 16.1504 12.6671 16.7948 12.6671 17.4667C12.6671 18.1385 12.934 18.7829 13.4091 19.258C13.8842 19.7331 14.5286 20 15.2005 20C15.8724 20 16.5168 19.7331 16.9919 19.258C17.467 18.7829 17.7339 18.1385 17.7339 17.4667C17.7339 16.7948 17.467 16.1504 16.9919 15.6753C16.5168 15.2002 15.8724 14.9333 15.2005 14.9333ZM6.33353 16.2C6.66948 16.2 6.99167 16.3335 7.22922 16.571C7.46678 16.8085 7.60023 17.1307 7.60023 17.4667C7.60023 17.8026 7.46678 18.1248 7.22922 18.3623C6.99167 18.5999 6.66948 18.7333 6.33353 18.7333C5.99758 18.7333 5.67539 18.5999 5.43783 18.3623C5.20028 18.1248 5.06682 17.8026 5.06682 17.4667C5.06682 17.1307 5.20028 16.8085 5.43783 16.571C5.67539 16.3335 5.99758 16.2 6.33353 16.2ZM15.2005 16.2C15.5364 16.2 15.8586 16.3335 16.0962 16.571C16.3337 16.8085 16.4672 17.1307 16.4672 17.4667C16.4672 17.8026 16.3337 18.1248 16.0962 18.3623C15.8586 18.5999 15.5364 18.7333 15.2005 18.7333C14.8645 18.7333 14.5423 18.5999 14.3048 18.3623C14.0672 18.1248 13.9338 17.8026 13.9338 17.4667C13.9338 17.1307 14.0672 16.8085 14.3048 16.571C14.5423 16.3335 14.8645 16.2 15.2005 16.2Z" fill={hovered ? "#ffffff" : "#252B42"} />
      </g>
      <defs>
        <clipPath id="clip0_5_522">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
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
        to={`${countryPrefix}/products/${product.handle}`}
        className="block"
        prefetch="intent"
        onClick={handleProductClick}
      >
        <div className="relative">
          <div className="relative overflow-hidden aspect-square">
            {image?.url ? (
              <div className="relative w-full h-full">
                {!loaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Loading...</span>
                  </div>
                )}

                <img
                  src={image.url}
                  alt={image.altText || product.title}
                  className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                  onLoad={() => setLoaded(true)}
                  onError={(e) => {
                    setLoaded(true);
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'50\' y=\'50\' font-size=\'12\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\'%3ENo image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No image</span>
              </div>
            )}

            {inventoryBadge && (
              <div className="absolute top-2 left-2 z-10">
                <span className="text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md" style={{backgroundColor: badgeColor}}>
                  {inventoryBadge}
                </span>
              </div>
            )}

            <div className={`absolute inset-0 bg-black/40 flex items-end justify-center pb-4 gap-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              {isWishlistEnabled && (
                <button
                  onClick={handleWishlistClick}
                  onMouseEnter={() => setHoveredIcon("wishlist")}
                  onMouseLeave={() => setHoveredIcon(null)}
                  disabled={loading}
                  className={`bg-white w-10 h-10 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${isWished ? 'text-red-500' : 'text-black hover:text-white'} hover:bg-black ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={getActionButtonStyle()}
                >
                  {loading ? (
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
        </div>

        <div className="mt-2 px-2 pb-2">
          <h4 className="font-medium text-gray-900 line-clamp-2 text-xs hover:text-gray-600 transition-colors">
            {product.title}
          </h4>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-900 font-bold text-sm">
              {price ? <Money data={price} /> : 'Price not available'}
            </span>
            {hasCompareAtPrice && compareAtPrice && (
              <span className="text-gray-400 line-through text-xs">
                <Money data={compareAtPrice} />
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}