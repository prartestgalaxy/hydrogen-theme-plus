import { useState, Suspense, useEffect } from 'react';
import { Await, NavLink, useNavigate, useLocation } from 'react-router';
import { useAside } from '~/components/Aside';
import { useOptimisticCart, useAnalytics, Image } from '@shopify/hydrogen';
import { HeaderAside } from './HeaderAside';
import { CountrySelector } from './CountrySelector';
import { Link } from '~/components/Link';
import { useWishlist } from '~/context/WishlistContext';
export function HeaderMenu({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
  wishlistSettings,
  localization,
  globalData,
}) {
  const { open } = useAside();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { count, wishlist } = useWishlist();
  // Ensure dynamic classes only apply after hydration
  useEffect(() => {
    setMounted(true);
  }, []);


  // const {
  //   variant = 'dropdown',
  //   menu = [],
  //   logo,
  //   alignment = 'justify-center',
  //   backgroundColor = '#ffffff',
  //   textColor = '#000000',
  //   textColorMenu ='#000000',
  //   fontSize = 'text-lg'
  // } = header || {};
  const {
    variant = 'dropdown',
    menu: rawMenu,
    logo,
    alignment = 'justify-center',
    backgroundColor = '#ffffff',
    textColor = '#000000',
    textColorMenu = '#23A6F0',
    fontSize = '14',
  } = header || {};

  // ✅ THIS LINE FIXES YOUR ERROR
  const menu = Array.isArray(rawMenu) ? rawMenu : [];

  const isSidebarMode = variant === 'sidebar';

  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const fontSettings = {
    fontFamily: globalData?.fontFamily || 'Montserrat, sans-serif',
    fontSize: `${fontSize ? fontSize : globalData?.baseFontSize ? globalData?.baseFontSize : '14'}px`,
    fontWeight: 700,
    lineHeight: '24px',
    letterSpacing: '0.2px',
  };

  const fontStyle = globalData?.fontFamily
    ? globalData.fontFamily
    : 'Montserrat, sans-serif';

  const dynamicStyles = `
    .headerMenuFont {
      font-family: ${globalData?.fontFamily ? globalData.fontFamily : 'Montserrat, sans-serif'};
      font-size: ${fontSize ? fontSize : globalData?.baseFontSize ? globalData.baseFontSize : 14}px;
      font-weight: 700;
      leading-trim: NONE;
      line-height: 24px;
      letter-spacing: 0.2px;

    }
    .headerMenuFont:hover {
      color: ${textColor ? `${formatColor(textColor)} !important` : globalData?.linksEffect?.hoverColor ? formatColor(globalData.linksEffect.hoverColor) : '#5a5a5a'};
    }
    .header-link {
      color: ${textColor ? `${formatColor(textColor)} !important` : globalData?.linksEffect?.linkColor ? formatColor(globalData.linksEffect.linkColor) : '#737373'};
      transition-duration: ${globalData?.linksEffect?.transitionDuration ? globalData.linksEffect.transitionDuration : 300}ms;
      text-decoration: ${globalData?.linksEffect?.underlineStyle && globalData.linksEffect.underlineStyle !== 'none' ? globalData.linksEffect.underlineStyle : 'none'};
    }
    .header-link:hover {
      color: ${textColor ? `${formatColor(textColor)} !important` : globalData?.linksEffect?.hoverColor ? formatColor(globalData.linksEffect.hoverColor) : '#5a5a5a'};
      ${globalData?.linksEffect?.hoverEffect && globalData.linksEffect.hoverEffect !== 'none' ? `text-decoration: ${globalData.linksEffect.hoverEffect};` : ''}
    }
    .header-link.active-menu-link {
      color: #090909 !important;
    }
    .header-btn {
      background-color: ${globalData?.buttons?.primaryBg ? formatColor(globalData.buttons.primaryBg) : '#23A6F0'};
      color: ${globalData?.buttons?.primaryText ? formatColor(globalData.buttons.primaryText) : '#FFFFFF'};
      border-radius: ${globalData?.buttons?.borderRadius !== undefined ? globalData.buttons.borderRadius : 8}px;
    }
    .header-btn:hover {
      background-color: ${globalData?.buttons?.primaryHoverBg ? formatColor(globalData.buttons.primaryHoverBg) : '#1D4ED8'};
      color: ${globalData?.buttons?.primaryHovertxt ? formatColor(globalData.buttons.primaryHovertxt) : '#FFFFFF'};
    }
    .header-btn-secondary {
      background-color: ${globalData?.buttons?.secondaryBg ? formatColor(globalData.buttons.secondaryBg) : '#000000'};
      color: ${globalData?.buttons?.secondaryText ? formatColor(globalData.buttons.secondaryText) : '#FFFFFF'};
      border-radius: ${globalData?.buttons?.borderRadius !== undefined ? globalData.buttons.borderRadius : 8}px;
    }
    .header-btn-secondary:hover {
      background-color: ${globalData?.buttons?.secondaryHoverBg ? formatColor(globalData.buttons.secondaryHoverBg) : '#D1D5DB'};
      color: ${globalData?.buttons?.secondaryHovertxt ? formatColor(globalData.buttons.secondaryHovertxt) : '#000000'};
    }
  `;

  return (
    <>
      {globalData && <style>{dynamicStyles}</style>}
      <header
        style={{ backgroundColor, color: textColor }}
        className="px-4 md:px-[7%] w-full max-w-[100%]  pt-[12px] sticky top-0 z-[40] shadow-sm transition-colors border-b border-gray-100 pb-[12px] sm:pb-0"
      >
        <div
          className={` mx-auto flex items-center justify-between flex-col sm:flex-row relative `}
          style={{ fontSize: fontSize }}
        >
          <div className="flex-1 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsNavOpen(true)}
              className={`reset p-2 -ml-2 ${isSidebarMode ? 'block' : 'lg:hidden'}`}
            >
              <span className="text-2xl">☰</span>
            </button>
            <Logo logo={logo} />
          </div>

          {/* Dynamic Alignment Container */}
          <div
            className={`flex-[2] flex h-full transition-all duration-300 ${mounted ? alignment : 'justify-center'}`}
          >
            {!isSidebarMode && (
              <nav className="hidden lg:flex items-center gap-4 lg:gap-6 h-full">
                {menu?.length > 0 ? (
                  menu.map((item) => (
                    <HeaderDropdownItem
                      key={item._key}
                      item={item}
                      textColor={textColor}
                      publicStoreDomain={publicStoreDomain}
                      localization={localization}
                      fontSize={fontSize}
                    />
                  ))
                ) : (
                  <span className="text-sm opacity-60">Menu unavailable</span>
                )}
              </nav>
            )}
          </div>

          <div
            className={`flex-1 flex items-center gap-[10px]  md:gap-4 justify-end ml-4 fontStyle`}
            style={{ color: textColorMenu || '#23A6F0' }}
          >
            {/* <CountrySelector localization={localization} fontSettings={fontSettings} />
            <AccountLink isLoggedIn={isLoggedIn} />
            <button
              type="button"
              onClick={() => open('search')}
              className="hover:opacity-50 headerMenuFont"
            >
              <SearchIcon />
            </button>
            {isLoggedIn && <ProfileLink isLoggedIn={isLoggedIn} />}
            <CartToggle cart={cart} /> */}

            {/* {wishlistSettings?.enabled && (
              <Link to="/wishlist" className="relative">
                <HeartIcon />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold px-1">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </Link>
            )} */}
            {/* {wishlistSettings?.enabled && (
              <Link to="/wishlist" className="flex items-center gap-1 group">
                <HeartIcon className="w-6 h-6 group-hover:text-gray-400 transition-colors duration-200" />

                {count > 0 && (
                  <span className="w-4 h-4 headerMenuFont group-hover:text-gray-400 transition-colors duration-200 flex items-center justify-center">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </Link>
            )} */}

            <form
              action="https://galaxyweblinksapps.myshopify.com/password"
              method="post"
              target="_blank"
              className="inline-flex m-0 p-0"
            >
              <input type="hidden" name="form_type" value="storefront_password" />
              <input type="hidden" name="utf8" value="✓" />
              <input type="hidden" name="password" value="gwl" />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <span>Shopify theme</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>





        </div>
      </header >
      <HeaderAside
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        menu={menu}
        logo={logo}
      />
    </>
  );
}
/**
 * DROPDOWN ITEM COMPONENT
 */
function HeaderDropdownItem({
  item,
  textColor,
  publicStoreDomain,
  localization,
  fontSize,
}) {
  const hasChildren = item?.children && item?.children?.length > 0;
  const locale =
    localization?.language?.isoCode || localization?.country?.isoCode;

  // Resolve the main link
  const linkUrl = resolveLink(item.link, publicStoreDomain, locale);
  const location = useLocation();

  const isChildActive =
    hasChildren &&
    item.children.some((child) => {
      const childUrl = resolveLink(child.link, publicStoreDomain, locale);
      return childUrl !== '#' && location.pathname === childUrl;
    });

  return (
    <div className="relative group h-full flex items-center">
      <NavLink
        to={linkUrl}
        prefetch="intent"
        end
        className={({ isActive }) =>
          `flex items-center gap-1.5 headerMenuFont header-link font-bold tracking-widest transition-colors whitespace-nowrap ${(isActive && linkUrl !== '#') || isChildActive
            ? 'active-menu-link'
            : ''
          }`
        }
      >
        <span className="whitespace-nowrap">{item.label}</span>
        {hasChildren && (
          <span className="transition-transform duration-200 group-hover:rotate-180">
            <ChevronDownIcon />
          </span>
        )}
      </NavLink>

      {/* DROPDOWN SUB-MENU */}
      {hasChildren && (
        <div
          className={`absolute top-[100%] left-0 min-w-[220px] bg-white shadow-xl border border-gray-100 py-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50 rounded-b-md`}
        >
          {item.children.map((child) => {
            // Pass child.link to resolve the URL
            const childUrl = resolveLink(child.link, publicStoreDomain, locale);

            return (
              <NavLink
                key={child._key}
                to={childUrl}
                prefetch="intent"
                end
                className={({ isActive }) =>
                  `block px-6 py-2.5 ${fontSize} text-left headerMenuFont header-link tracking-[0.15em] hover:bg-gray-50 transition-colors ${isActive && childUrl !== '#' ? 'active-menu-link' : ''
                  }`
                }
              >
                {child?.label}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* --- HELPER COMPONENTS --- */

function Logo({ logo }) {
  return (
    // Added shrink-0 to prevent the parent flex container from squishing the logo
    <Link to="/" className="flex items-center shrink-0"
    >
      {logo?.asset?.url ? (
        <Image
          style={{
            height: '58px',
            width: '108px'
          }}
          src={logo?.asset?.url}
          alt="Logo"
          // Responsive height: h-8 (32px) on mobile, h-10 (40px) on tablets, h-12 (48px) on desktop
          className="h-4 w-6 md:h-7 w-10 lg:h-8 w-auto object-contain shrink-0"
          // Updated sizes prop to give the browser better hints for responsive loading
          sizes="(max-width: 768px) 150px, 200px"
          loading="eager"
        />
      ) : (
        // Made the fallback text responsive as well
        <span className="font-extrabold text-xl md:text-2xl lg:text-3xl uppercase tracking-tighter">
          Store
        </span>
      )}
    </Link>
  );
}

export function ProfileLink({ isLoggedIn }) {
  return (
    <Suspense fallback={<AccountIcon />}>
      <Await resolve={isLoggedIn}>
        {() => (
          <Link to="/account" className="hover:opacity-50 transition-opacity headerMenuFont">
            <AccountIcon />
          </Link>
        )}
      </Await>
    </Suspense>
  );
}

export function AccountLink({ isLoggedIn }) {
  const handleLogout = async () => {
    try {
      await fetch('/logout', { method: 'POST' });
      window.location.href = '/signin';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <Suspense fallback={<AccountIcon />}>
      <Await resolve={isLoggedIn}>
        {(resolvedIsLoggedIn) =>
          resolvedIsLoggedIn ? (
            <button
              onClick={handleLogout}
              className="xl:block hover:opacity-50 transition-opacity"
            >
              <span className=" headerMenuFont">
                Logout
              </span>
            </button>
          ) : (
            <Link
              to="/signin"
              // 👇 Moved hidden and xl:block here
              className=" xl:block hover:opacity-50 transition-opacity"
            >
              <span className="headerMenuFont">
                Sign In
              </span>
            </Link>
          )
        }
      </Await>
    </Suspense>
  );
}

function CartToggle({ cart }) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(resolvedCart) => {
          const cartData = useOptimisticCart(resolvedCart);
          return <CartBadge count={cartData?.totalQuantity ?? 0} />;
        }}
      </Await>
    </Suspense>
  );
}

function CartBadge({ count }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  return (
    <Link
      to="/cart"
      onClick={(e) => {
        e.stopPropagation();
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href,
        });
      }}
      className="flex items-center gap-1 group"
    >
      <CartIcon />
      {count > 0 && (
        <span className="w-4 h-4 headerMenuFont hover:text-gray-400 transition-colors duration-200 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}

function resolveLink(link, publicStoreDomain, locale) {
  // Defensive check: if link is null, return root fallback
  if (!link || (!link.type && !link.route && !link.url)) return '#';

  // 1. External Links
  if (link.type === 'external' || (link.url && link.url.startsWith('http'))) {
    return link.url || '#';
  }

  const baseLocale =
    locale && locale.length === 2 ? `/${locale.toLowerCase()}` : '';
  let path = '';

  // 2. Hardcoded Routes (e.g., Home, About)
  if (link.type === 'route' || link.route) {
    path = link.route || '#';
  }
  // 3. Sanity References (e.g., Pages, Collections)
  else {
    const slug =
      link.page?.slug || link.collection?.slug || link.product?.slug || '';

    if (!slug) return '#'; // If slug is null in data, fallback to placeholder

    switch (link.type) {
      case 'collection':
        path = `/collections/${slug}`;
        break;
      case 'product':
        path = `/products/${slug}`;
        break;
      case 'page':
        path = `/pages/${slug}`;
        break;
      default:
        path = '#';
    }
  }

  // Prevent placeholder links from absorbing base locale routing strings
  if (path === '#') return '#';

  // Format Home cleanly
  if (path === '/#') return baseLocale ? `${baseLocale}` : '/';

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath.startsWith(baseLocale) && baseLocale !== '') return cleanPath;

  return `${baseLocale}${cleanPath}`.replace(/\/+/g, '/');
}

/* ICONS */
const ChevronDownIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const HeartIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);
const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
const AccountIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const CartIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export default HeaderMenu;
