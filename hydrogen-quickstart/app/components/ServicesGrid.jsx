import React, { useState, useEffect } from 'react';
import { Image } from '@shopify/hydrogen';

export default function ServicesGrid({ module, globalSettingsData }) {
  if (!module) return null;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    subtitle = 'Services',
    heading = 'THE BEST SERVICES',
    description = 'Problems trying to resolve the conflict between',
    features = [],
    theme = {},
    _key = 'services-grid'
  } = module;

  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  // --- STYLING HIERARCHY ---
  const fontStyle = globalSettingsData?.fontFamily || 'Montserrat, sans-serif';
  const sectionBg = formatColor(theme?.bg) || '#ffffff';

  const textColors = {
    subtitle: formatColor(globalSettingsData?.colors?.secondary) || '#737373',
    heading: formatColor(globalSettingsData?.colors?.heading) || '#252B42',
    body: formatColor(globalSettingsData?.colors?.text) || '#737373',
  };

  const fontSizes = {
    subtitle: globalSettingsData?.headingSizes?.h5 ? `${globalSettingsData.headingSizes.h4}px` : '20px',
    heading: globalSettingsData?.headingSizes?.h3 ? `${globalSettingsData.headingSizes.h3}px` : '40px',
    featureTitle: globalSettingsData?.headingSizes?.h4 ? `${globalSettingsData.headingSizes.h4}px` : '24px',
    body: globalSettingsData?.baseFontSize ? `${globalSettingsData.baseFontSize}px` : '14px',
  };



  // 4. DYNAMIC RESPONSIVE STYLES
  // We use media queries inside the string to keep the hierarchy intact while scaling
  const dynamicStyles = `
    .services-${_key} { 
      font-family: ${fontStyle}; 
      background-color: ${sectionBg};
    }
    
    /* Subtitle scaling */
    .services-${_key} .section-subtitle { 
      color: ${textColors.subtitle}; 
      font-size: 14px; /* Mobile base */
    }
    @media (min-width: 768px) {
      .services-${_key} .section-subtitle { font-size: ${fontSizes.subtitle};
      font-family: ${fontStyle}; 
      font-weight: 400;
      leading-trim: NONE;
      line-height: 30px;
      letter-spacing: 0.2px;
      }
    }

    /* Main Heading scaling */
    .services-${_key} .section-heading { 
      color: ${textColors.heading}; 
      font-size: 24px; /* Mobile base */
    }
    @media (min-width: 768px) {
      .services-${_key} .section-heading { font-size: ${fontSizes.heading}; 
      font-family: ${fontStyle}; 
      font-weight: 700;
      leading-trim: NONE;
      line-height: 32px;
      letter-spacing: 0.1px;

      }
    }

    /* Feature Title scaling */
    .services-${_key} .feature-title { 
      color: ${textColors.heading}; 
      font-size: 18px; /* Mobile base */
      font-family: ${fontStyle}; 
    }
    @media (min-width: 768px) {
      .services-${_key} .feature-title { font-size: ${fontSizes.featureTitle}; 
      font-family: ${fontStyle}; 
      font-weight: 700;
      leading-trim: NONE;
      line-height: 32px;
      letter-spacing: 0.1px;

      }
    }

    /* Body text scaling */
    .services-${_key} .body-text { 
      color: ${textColors.body}; 
      font-size: 13px; /* Mobile base */
      font-family: ${fontStyle}; 
    }
    @media (min-width: 768px) {
      .services-${_key} .body-text { font-size: ${fontSizes.body}; 
      font-family: ${fontStyle}; 
      font-weight: 400;
      leading-trim: NONE;
      line-height: 20px;
      letter-spacing: 0.2px;
      }
    }
  `;

  const DUMMY_FEATURES = [
    { title: 'Feature 1', description: 'Description of feature 1' },
    { title: 'Feature 2', description: 'Description of feature 2' },
    { title: 'Feature 3', description: 'Description of feature 3' }
  ];

  const featuresToDisplay = features?.length > 0 ? features : DUMMY_FEATURES;

  const paddingMap = {
    none: 'py-0',
    small: 'py-8 md:py-16',
    medium: 'py-12 md:py-20',
    large: 'py-20 md:py-24',
  };

  return (
    <section className={`w-full services-${_key} ${paddingMap[theme?.padding || 'medium']}`}>
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />

      <div className="max-w-[1640px] mx-auto px-[7%]">

        {/* Header Section */}
        <header className="text-center max-w-3xl mx-auto mb-[25px] md:flex flex-col gap-2 md:gap-[10px]">
          {subtitle && (
            <span className="block section-subtitle ">
              {subtitle}
            </span>
          )}
          {heading && (
            <h3 className=" section-heading ">
              {heading}
            </h3>
          )}
          {description && (
            <p className="mt-2 body-text  max-w-xl mx-auto px-4 md:px-0">
              {description}
            </p>
          )}
        </header>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 md:gap-x-8 lg:gap-x-16">
          {featuresToDisplay.map((feature, index) => {
            const iconSrc = feature?.iconUrl || feature?.icon?.asset?.url;

            return (
              <div key={`${_key}-feat-${index}`} className="flex flex-col items-center text-center px-2">

                {/* Icon Container */}
                <div className="mb-2 md:mb-[15px] h-16 md:h-20 flex items-center justify-center">
                  {iconSrc ? (
                    <Image
                      src={iconSrc}
                      alt={feature?.title || 'Service Icon'}
                      width={72}
                      height={72}
                      className="w-[60px] h-[60px] md:w-[72px] md:h-[72px] object-contain transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#23A6F0] md:w-[72px] md:h-[72px]">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 3v18M3 9h18" />
                    </svg>
                  )}
                </div>

                {/* Text Content */}
                <h3 className="mb-2 md:mb-[15px] feature-title ">
                  {feature?.title || 'Service Name'}
                </h3>

                <p className="body-text max-w-[280px] md:max-w-xs mx-auto opacity-90">
                  {feature?.description || 'Service description goes here.'}
                </p>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}