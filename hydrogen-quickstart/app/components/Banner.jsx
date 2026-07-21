

import React from 'react';
import { Link } from 'react-router';

const DEFAULT_BANNER_STYLES = {
  backgroundColor: '#f5f5f5',
  textColor: '#000000',
  taglineColor: '#E77C40',
  buttonText: 'Shop Now',
  buttonLink: '/shop'
};

// Default banner data when Sanity returns null
const DEFAULT_BANNERS = [
  {
    id: 1,
    heading: 'Summer Collection',
    tagline: 'Ends Today',
    buttonText: 'Shop Now',
    buttonLink: '/collections/summer',
    imageUrl: '/images/banner1.svg',
    backgroundColor: '#f0f9ff',
    textColor: '#1a1a1a',
    taglineColor: '#E77C40'
  },
  {
    id: 2,
    heading: 'Winter Sale',
    tagline: 'Up to 50% Off',
    buttonText: 'Discover Now',
    buttonLink: '/collections/winter',
    imageUrl: '/images/banner2.svg',
    backgroundColor: '#f5f0ff',
    textColor: '#1a1a1a',
    taglineColor: '#E77C40'
  }
];

const Banner = ({ banners = [], enable = true, globalData = null }) => {
  // Get container classes based on number of banners
  const getContainerClasses = () => {
    let classes = "grid grid-cols-1 px-[7%] gap-4 md:gap-[35.43px] mt-[14px] mb-[14px]";
    
    const bannerCount = bannersToShow.length;
    if (bannerCount === 2) {
      classes = classes.replace("grid-cols-1", "grid-cols-1 md:grid-cols-2");
    } else if (bannerCount >= 3) {
      classes = classes.replace("grid-cols-1", "grid-cols-1 md:grid-cols-3");
    }
    
    return classes;
  };

  // Determine which banners to show
  let bannersToShow = [];
  
  // If banners prop is provided and has items, use them
  if (banners && banners.length > 0) {
    bannersToShow = banners;
  } 
  // If enable is true but no banners provided, use default banners
  else if (enable) {
    bannersToShow = DEFAULT_BANNERS;
  }
  
  // If no banners to show, return null
  if (!enable || bannersToShow.length === 0) return null;

  // Dynamic style helpers using global data with fallbacks
  const getButtonStyle = (type = 'primary', isDisabled = false) => {
    if (!globalData?.buttons) {
      return {
        backgroundColor: type === 'primary' ? '#23A6F0' : '#E5E7EB',
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
  
  const getTaglineStyle = () => {
    if (!globalData?.buttons) {
      return {
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '0.875rem',
        letterSpacing: '0.05em',
      };
    }
    
    return {
      fontFamily: globalData.fontFamily || 'Montserrat, sans-serif',
      lineHeight: '28.34px',
      letterSpacing: '0.24px',
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

  // Process banner data with fallbacks
  const processedBanners = bannersToShow.map(banner => ({
    ...DEFAULT_BANNER_STYLES,
    ...banner,
    heading: banner.heading || 'Special Offer',
    tagline: banner.tagline || '',
    buttonText: banner.buttonText || DEFAULT_BANNER_STYLES.buttonText,
    buttonLink: banner.buttonLink || DEFAULT_BANNER_STYLES.buttonLink,
    imageUrl: banner.imageUrl || '',
    backgroundColor: banner.backgroundColor || DEFAULT_BANNER_STYLES.backgroundColor,
    textColor: banner.textColor || DEFAULT_BANNER_STYLES.textColor,
    taglineColor: banner.taglineColor || DEFAULT_BANNER_STYLES.taglineColor,
  }));

  return (
    <div className={getContainerClasses()}>
      {processedBanners.map((banner, index) => (
        <div
          key={banner.id || index}
          className="relative overflow-hidden min-h-[354px] transition-all duration-300 hover:shadow-xl"
          style={{
            backgroundColor: banner.backgroundColor,
            color: banner.textColor,
            fontFamily: globalData?.fontFamily || 'Montserrat, sans-serif',
            paddingLeft: '57px'
          }}
        >
          {/* Image - positioned absolutely to be behind text */}
          {banner.imageUrl && (
            <div className="absolute inset-0 z-0">
              <img
                src={banner.imageUrl}
                alt={banner.heading || `Banner ${index + 1}`}
                className="w-full h-full object-cover object-right-top"
                loading="lazy"
                onError={(e) => {
                  // If image fails to load, hide it and show background color
                  e.target.style.display = 'none';
                  console.warn(`Failed to load banner image: ${banner.imageUrl}`);
                }}
              />
              {/* Overlay for better text readability */}
             
            </div>
          )}

          {/* Content - positioned over the image with higher z-index */}
          <div className="relative z-10 h-full flex flex-col justify-center items-left text-left gap-[12px]">
            {/* Top Section with Tagline and Heading */}
            <div>
              {banner.tagline && (
                <p className="uppercase tracking-[0.24px] font-bold text-[16.53px] leading-[28.34px] font-[Montserrat]"
                  style={{
                    ...getTaglineStyle(),
                    color: banner.taglineColor,
                  }}
                >
                  {banner.tagline}
                </p>
              )}
            </div>
          <h2 className="max-w-[250px] font-bold text-[30px] md:text-[47.24px] leading-[59.05px] tracking-[0.24px] font-montserrat text-[#252B42]"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '700',
                  lineHeight:'59.05px',
                  letterSpacing: '0.24px'
                }}
              >
                {banner.heading}
              </h2>

            {/* Bottom Section with Button */}
            {banner.buttonText && banner.buttonLink && (
              <div className=""
              >
                <Link
                  to={banner.buttonLink}
                 className="text-[#252B42] inline-flex items-center font-bold text-[16.53px] leading-[28.34px] tracking-[0.24px] underline decoration-solid underline-offset-[1px] font-[Montserrat]"
                 
                  // onMouseEnter={(e) => {
                  //   const hoverStyle = getHoverStyle();
                  //   if (hoverStyle.color) {
                  //     e.currentTarget.style.color = hoverStyle.color;
                  //   }
                  // }}
                  // onMouseLeave={(e) => {
                  //   const linkStyle = getLinkStyle();
                  //   if (linkStyle.color) {
                  //     e.currentTarget.style.color = linkStyle.color;
                  //   }
                  // }}
                >
                  {banner.buttonText}
                  <svg 
                    className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{
                      transition: `transform ${globalData?.linksEffect?.transitionDuration || 300}ms ease`,
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Banner;