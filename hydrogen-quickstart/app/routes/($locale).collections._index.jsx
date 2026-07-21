import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {useState, useEffect} from 'react';
import LogoSlider from '~/components/LogoSlider';
import groq from 'groq';
import {useRouteLoaderData} from 'react-router';

export const COLLECTION_MAIN_SETTINGS_QUERY = groq`
*[_type == "maincollectionsetting"][0]{

  // =========================
  // COLLECTION SETTINGS (FLAT)
  // =========================
  "overlayColor": overlayColor.hex,
  "textColor": textColor.hex,
  alignment,

  // =========================
  // LOGO SLIDER
  // =========================
  logoSlider{
    enable,
    "backgroundcol": backgroundcol.hex,
    autoScroll,
    speed,
    logos[]{
     
      "imageUrl": image.asset->url
    }
  }

}
`;

// DEFAULT FALLBACK CONFIGURATIONS
const DEFAULT_COLLECTION_SETTINGS = {
  overlayColor: '#2D8BC0',
  textColor: '#FFFFFF',
  alignment: 'left',
  logoSlider: {
    enable: true,
    title: '',
    autoScroll: true,
    speed: 3000,
    logos: [
      {
        link: '/',
        imageUrl: '/logos/hooli.png',
      },
      {
        link: '/',
        imageUrl: '/logos/leaf.png',
      },
      {
        link: '/',
        imageUrl: '/logos/lyft.png',
      },
      {
        link: '/',
        imageUrl: '/logos/aws.png',
      },
      {
        link: '/',
        imageUrl: '/logos/stripe.png',
      },
      {
        link: '/',
        imageUrl: '/logos/monkey.png',
      },
    ],
  },
};

// Default logo slider fallback when no logos provided
const DEFAULT_LOGO_SLIDER = {
  enable: true,
  title: 'Trusted Partners',
  autoScroll: true,
  speed: 3000,
  logos: [
    {link: '/', imageUrl: '/logos/logo1.svg'},
    {link: '/', imageUrl: '/logos/logo2.svg'},
    {link: '/', imageUrl: '/logos/logo3.svg'},
    {link: '/', imageUrl: '/logos/logo4.svg'},
    {link: '/', imageUrl: '/logos/logo5.svg'},
    {link: '/', imageUrl: '/logos/logo6.svg'},
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
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 6,
  });

  const [{collections}, mainSettings] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
    context.sanityClient.fetch(COLLECTION_MAIN_SETTINGS_QUERY),
  ]);

  // Apply fallbacks for mainSettings
  let safeMainSettings = mainSettings;

  if (!safeMainSettings) {
    safeMainSettings = DEFAULT_COLLECTION_SETTINGS;
  } else {
    // Ensure nested properties exist
    safeMainSettings = {
      ...DEFAULT_COLLECTION_SETTINGS,
      ...safeMainSettings,
      logoSlider: {
        ...DEFAULT_COLLECTION_SETTINGS.logoSlider,
        ...(safeMainSettings.logoSlider || {}),
        logos:
          safeMainSettings.logoSlider?.logos &&
          safeMainSettings.logoSlider.logos.length > 0
            ? safeMainSettings.logoSlider.logos
            : DEFAULT_COLLECTION_SETTINGS.logoSlider.logos,
      },
    };
  }

  const activeCountry =
    context.storefront?.i18n?.country?.toLowerCase() || 'us';
  const locale = {country: activeCountry, currency: 'USD'};

  return {collections, locale, mainSettings: safeMainSettings};
}

function loadDeferredData({context}) {
  return {};
}

export default function Collections() {
  const {collections, locale, mainSettings} = useLoaderData();
  const globalData = useGlobalData();


  // --- UTILITY HELPERS ---
  const formatColor = (color) => {
    if (!color) return null;
    if (color.startsWith('#')) return color;
    if (/^[0-9A-Fa-f]{3,8}$/.test(color)) {
      if (color.length === 6) return `#${color}`;
      if (color.length === 8) return `#${color}`;
      if (color.length === 3) return `#${color}`;
    }
    return color;
  };

  const addOpacity = (color, opacity = 0.75) => {
    if (!color) return null;
    if (color.length === 9 && color.startsWith('#')) {
      const rgb = color.substring(1, 7);
      const alpha = Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0');
      return `#${rgb}${alpha}`;
    }
    if (color.length === 7 && color.startsWith('#')) {
      const alpha = Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0');
      return `${color}${alpha}`;
    }
    if (color.length === 4 && color.startsWith('#')) {
      const r = color[1];
      const g = color[2];
      const b = color[3];
      const hex6 = `#${r}${r}${g}${g}${b}${b}`;
      const alpha = Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0');
      return `${hex6}${alpha}`;
    }
    return color;
  };

  // --- EXTRACT mainSettings (MODULE-LEVEL) with defaults ---
  const {
    overlayColor: rawOverlayColor = DEFAULT_COLLECTION_SETTINGS.overlayColor,
    textColor: rawTextColor = DEFAULT_COLLECTION_SETTINGS.textColor,
    alignment = DEFAULT_COLLECTION_SETTINGS.alignment,
    logoSlider = DEFAULT_COLLECTION_SETTINGS.logoSlider,
  } = mainSettings || DEFAULT_COLLECTION_SETTINGS;

  let overlayColor = formatColor(rawOverlayColor);
  const textColor = formatColor(rawTextColor);
  overlayColor = addOpacity(overlayColor, 0.75);

  // Check if logo slider should be shown (with fallback)
  const shouldShowLogoSlider =
    logoSlider?.enable !== false && logoSlider?.logos?.length > 0;

  // =====================================================
  // DYNAMIC STYLES — GlobalSettings as BASE (fallback)
  // mainSettings values override via inline styles on elements
  // =====================================================
  const dynamicStyles = `
    .collections-page {
      font-family: ${globalData?.fontFamily ? globalData.fontFamily : 'Montserrat, sans-serif'};
      font-size: ${globalData?.baseFontSize ? globalData.baseFontSize : 16}px;
    }
    .collections-page h1 { font-size: ${globalData?.headingSizes?.h1 || 32}px; }
    .collections-page h2 { font-size: ${globalData?.headingSizes?.h2 || 28}px; }
    .collections-page h3 { font-size: ${globalData?.headingSizes?.h3 || 24}px; }
    .collections-page h4 { font-size: ${globalData?.headingSizes?.h4 || 20}px; }
    .collections-page h5 { font-size: ${globalData?.headingSizes?.h5 || 18}px; }
    .collections-page h6 { font-size: ${globalData?.headingSizes?.h6 || 16}px; }

    .collections-link {
      color: ${globalData?.linksEffect?.linkColor ? formatColor(globalData.linksEffect.linkColor) : '#000000'};
      transition-duration: ${globalData?.linksEffect?.transitionDuration != null && globalData?.linksEffect?.transitionDuration !== '' ? globalData.linksEffect.transitionDuration : 300}ms;
      text-decoration: ${(globalData?.linksEffect?.underlineStyle || 'none') === 'always' ? 'underline' : 'none'};
    }
    .collections-link:hover {
      color: ${globalData?.linksEffect?.hoverColor ? formatColor(globalData.linksEffect.hoverColor) : '#666666'};
      ${(globalData?.linksEffect?.hoverEffect || 'none') === 'underline' ? 'text-decoration: underline;' : ''}
    }
  `;

  // mainSettings fontFamily > globalData fontFamily > default
  const pageFontFamily =
    mainSettings?.fontFamily ||
    globalData?.fontFamily ||
    'Montserrat, sans-serif';

  return (
    <div className="w-full collections-page">
      <style>{dynamicStyles}</style>
      <div
        className="pt-[50px] pb-[50px] px-4 sm:px-6 md:px-10 lg:px-[102px]"
        style={{fontFamily: pageFontFamily}}
      >
        <PaginatedResourceSection
          connection={collections}
          resourcesClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15.5px] gap-y-[100px]"
        >
          {({node: collection, index}) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              index={index}
              locale={locale}
              overlayColor={overlayColor}
              textColor={textColor}
              alignment={alignment}
              mainSettings={mainSettings}
              globalData={globalData}
              formatColor={formatColor}
            />
          )}
        </PaginatedResourceSection>
      </div>

      {shouldShowLogoSlider && (
        <div className="w-full mt-16">
          <LogoSlider data={logoSlider} globalData={globalData} />
        </div>
      )}
    </div>
  );
}

function CollectionItem({
  collection,
  index,
  locale,
  overlayColor,
  textColor,
  alignment,
  mainSettings,
  globalData,
  formatColor,
}) {
  const countryPrefix =
    locale?.country && locale.country !== 'us' ? `/${locale.country}` : '';
  const displayTitle =
    collection.title?.replace(/collection$/i, '').trim() ||
    collection.title ||
    'Collection';
  const description = collection.description?.trim()
    ? collection.description
    : 'Discover our latest collection.';

  // --- ALIGNMENT helpers (mainSettings first, then default) ---
  const getContentAlignment = () => {
    switch (alignment) {
      case 'center':
        return 'text-center items-center';
      case 'right':
        return 'text-right items-end';
      default:
        return 'text-left items-start';
    }
  };

  const getButtonAlignment = () => {
    switch (alignment) {
      case 'center':
        return 'justify-center';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-start';
    }
  };

  // =====================================================
  // PRIORITY: mainSettings > globalData > hardcoded default
  // =====================================================

  // Font: mainSettings.fontFamily > globalData.fontFamily > default
  const fontFamily =
    mainSettings?.fontFamily ||
    globalData?.fontFamily ||
    'Montserrat, sans-serif';

  // Transition duration: mainSettings > globalData > default
  const transitionDuration =
    mainSettings?.transitionDuration ||
    globalData?.linksEffect?.transitionDuration ||
    300;

  // Overlay uses mainSettings colors (already resolved with priority in parent)
  const overlayStyles = {
    backgroundColor: overlayColor,
    color: textColor,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    fontFamily: fontFamily,
  };

  // Button styles: mainSettings colors take priority over globalData
  const dynamicButtonStyles = {
    borderColor: textColor,
    color: textColor,
    backgroundColor: 'transparent',
    width: '154.71px',
    height: '55.39px',
    padding: '15.7px 41.86px',
    borderRadius: '5.23px',
    borderWidth: '1.05px',
    borderStyle: 'solid',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: fontFamily,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10.46px',
    transition: `all ${transitionDuration}ms ease`,
    cursor: 'pointer',
  };

  const dynamicButtonHoverStyles = {
    backgroundColor: textColor,
    color: overlayColor,
    borderColor: textColor,
  };

  // Heading: mainSettings fontSize overrides globalData heading sizes
  // 20px is the module-level override for h3 on collection cards
  const headingFontSize = mainSettings?.headingFontSize || '20px';

  // Base font size: mainSettings > globalData > 16
  const baseFontSize =
    mainSettings?.baseFontSize || globalData?.baseFontSize || 16;

  return (
    <Link
      to={`${countryPrefix}/collections/${collection.handle}`}
      prefetch="intent"
      className="group block collections-link"
      style={{textDecoration: 'none'}}
    >
      <div className="w-full relative overflow-hidden bg-gray-100 aspect-[4/5] shadow-md group-hover:shadow-xl transition-shadow duration-300">
        {collection?.image && collection.image.url ? (
          <Image
            data={collection.image}
            alt={collection.image.altText || collection.title}
            loading={index < 3 ? 'eager' : 'lazy'}
            sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}

        <div
          className={`absolute bottom-0 left-0 right-0 py-[25px] px-[50px] ${getContentAlignment()}`}
          style={{...overlayStyles, gap: '0px'}}
        >
          {/* Module-level fontSize is first priority; globalData h3 from dynamicStyles is fallback */}
          <h3
            className="font-semibold"
            style={{
              fontSize: headingFontSize,
              fontFamily: fontFamily,
              fontWeight: '700',
              lineHeight: '33.49px',
              letterSpacing: '0.1px',
            }}
          >
            {displayTitle} Collection
          </h3>

          <p
            className="opacity-90 leading-relaxed line-clamp-3"
            style={{
              fontSize: '16px',
              fontWeight: '500',
              lineHeight: '25px',
              letterSpacing: '0.1px',
            }}
          >
            {description}
          </p>

          <div
            className={`flex ${getButtonAlignment()}`}
            style={{
              marginTop: '10px',
            }}
          >
            <span
              className="font-bold inline-flex items-center justify-center border cursor-pointer
              leading-[23.02px] tracking-[0.2px]"
              style={dynamicButtonStyles}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  dynamicButtonHoverStyles.backgroundColor;
                e.currentTarget.style.color = dynamicButtonHoverStyles.color;
                e.currentTarget.style.borderColor =
                  dynamicButtonHoverStyles.borderColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  dynamicButtonStyles.backgroundColor;
                e.currentTarget.style.color = dynamicButtonStyles.color;
                e.currentTarget.style.borderColor =
                  dynamicButtonStyles.borderColor;
              }}
            >
              EXPLORE
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
    description
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
