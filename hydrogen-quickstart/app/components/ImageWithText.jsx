// // import React from 'react';
// // import { Link } from 'react-router';
// // import { useState, useEffect } from 'react';
// // import { Image } from '@shopify/hydrogen';

// // export default function ImageWithText({ module, globalSettingsData }) {

// //   console.log("Module data : " + JSON.stringify(module,null,2))
// //   console.log("Global data : " + JSON.stringify(globalSettingsData,null,2))

// //   if (!module) return null;

// //   const [loaded, setLoaded] = useState(false);

// //   useEffect(() => {
// //     // force remove blur after hydration
// //     const timer = setTimeout(() => setLoaded(true), 10);
// //     return () => clearTimeout(timer);
// //   }, []);

// //   const {
// //     layout = 'left',
// //     imageWidth = 50,
// //     imageUrl,
// //     imageSettings = {},
// //     content = {},
// //     cta = {},
// //     theme = {}
// //   } = module;

// //   // Layout Helpers
// //   const isImageRight = layout === 'right';

// //   const paddingMap = {
// //     none: 'py-0',
// //     small: 'py-10 md:py-16',
// //     medium: 'py-16 md:py-24',
// //     large: 'py-24 md:py-32',
// //   };

// //   const radiusMap = {
// //     none: 'rounded-none',
// //     sm: 'rounded-sm',
// //     md: 'rounded-lg',
// //     lg: 'rounded-2xl',
// //     full: 'rounded-full'
// //   };

// //   const aspectMap = {
// //     auto: 'aspect-auto',
// //     square: 'aspect-square',
// //     portrait: 'aspect-[4/5]',
// //     landscape: 'aspect-[3/2]'
// //   };

// //   // Link Resolution
// //   const ctaHref = (() => {
// //     const link = cta?.link?.[0];
// //     if (!link) return '#';
// //     if (link._type === 'linkExternal') return link.url || '#';
// //     if (link.reference?.slug) return `/${link.reference._type === 'product' ? 'products' : 'collections'}/${link.reference.slug}`;
// //     return '#';
// //   })();

// //   return (
// //     <section
// //       className={`w-full mx-auto ${paddingMap[theme.padding || 'medium']}`}
// //       style={{ backgroundColor: theme.bg || '#ffffff', color: theme.text }}
// //     >
// //       {/* Added px-6 lg:px-12 to prevent it from touching the edges of the screen */}
// //       <div className={`max-w-[100%] mx-auto px-[7%] lg:px-[7%] lg:flex flex-col md:flex-row items-center gap-12 lg:gap-20 ${isImageRight ? 'md:flex-row-reverse' : ''}`}>

// //         {/* MEDIA SIDE */}
// //         <div
// //           className="w-full flex-shrink-0"
// //           style={{ flexBasis: `${imageWidth}%` }}
// //         >
// //           <div className={`overflow-hidden ${radiusMap[imageSettings.radius || 'none']} ${aspectMap[imageSettings.aspect || 'auto']}`}>
// //             {imageUrl && (
// //               <Image
// //                 src={imageUrl}
// //                 alt={content.title || ""}
// //                 className={`w-full h-full object-${imageSettings.fit || 'cover'} filter transition-all duration-700 transform hover:scale-105 ${loaded ? 'blur-0' : 'blur-xl'}`}
// //                 loading="lazy"
// //                 sizes="(max-width: 640px) 100vw,
// //                        (max-width: 1024px) 50vw,
// //                        800px"
// //                 onLoad={(e) => e.currentTarget.style.filter = 'blur(0)'}
// //               />
// //             )}
// //           </div>
// //         </div>

// //         {/* CONTENT SIDE */}
// //         <div
// //           className="w-full flex flex-col justify-center"
// //           style={{
// //             flexBasis: `${100 - imageWidth}%`,
// //           }}
// //         >
// //           {/* Increased max-width to 550px and added mx-auto to center the block within the column */}
// //           <div className={`w-full max-w-[550px] mx-auto ${content.alignment === 'center' ? 'text-center' : content.alignment === 'right' ? 'text-right' : 'text-left'}`}>

// //             {content.overline && (
// //               <span className="block uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 text-[#737373] font-medium">
// //                 {content.overline}
// //               </span>
// //             )}

// //             {/* Increased default title size to text-[50px] */}
// //             {/* <h2 className={`${content.titleSize || ' md:text-[50px] '} pt-4 md:pt-0 font-bold text-[#252B42] leading-[1.2] tracking-wide mb-8`}> */}
// //             <h2 className={`max-md:text-[20px] ${content.titleSize || 'md:text-[50px]'} pt-8 mb-2 md:pt-0  md:mb-8 font-bold text-[#252B42] leading-[1.2] tracking-wide`}>
// //               {content.title || 'We love what we do'}
// //             </h2>

// //             <p className="text-sm text-[#737373] leading-[1.8] tracking-[0.2px] mb-8 whitespace-pre-line">
// //               {content.body || 'Problems trying to resolve the conflict between\nthe two major realms of Classical physics:\nNewtonian mechanics.\n\n•\n\nProblems trying to resolve the conflict between\nthe two major realms of Classical physics:\nNewtonian mechanics.'}
// //             </p>

// //             {cta.text && (
// //               <Link
// //                 to={ctaHref}
// //                 className={`
// //                   inline-block transition-all duration-300
// //                   ${cta.style === 'underline'
// //                     ? 'border-b border-current pb-1 hover:opacity-50 tracking-widest text-xs uppercase font-bold'
// //                     : 'px-10 py-4 uppercase tracking-[0.2em] text-[10px] font-bold shadow-sm hover:-translate-y-1'
// //                   }
// //                   ${cta.style === 'pill' ? 'rounded-full' : cta.style === 'rounded' ? 'rounded-lg' : 'rounded-none'}
// //                 `}
// //                 style={{
// //                   backgroundColor: cta.style === 'underline' ? 'transparent' : (cta.bgColor || '#000000'),
// //                   color: cta.style === 'underline' ? 'inherit' : (cta.textColor || '#ffffff')
// //                 }}
// //               >
// //                 {cta.text}
// //               </Link>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// import React from 'react';
// import { Link } from 'react-router';
// import { useState, useEffect } from 'react';
// import { Image } from '@shopify/hydrogen';

// export default function ImageWithText({ module, globalSettingsData }) {

//   console.log("Module data : ", JSON.stringify(module,null,2));
//   console.log("Global data : ", JSON.stringify(module,null,2));

//   if (!module) return null;

//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoaded(true), 10);
//     return () => clearTimeout(timer);
//   }, []);

//   // --- HELPER TO ENSURE HEX HAS HASH ---
//   const ensureHexHash = (hex) => {
//     if (!hex) return hex;
//     return hex.startsWith('#') ? hex : `#${hex}`;
//   };

//   const {
//     layout = 'left',
//     imageWidth = 50,
//     imageUrl,
//     imageSettings = {},
//     content = {},
//     cta = {},
//     theme = {}
//   } = module;

//   // --- STYLING HIERARCHY LOGIC ---
//   const customFont = module.fontFamily || globalSettingsData?.fontFamily || 'Montserrat, sans-serif';

//   const textStyles = {
//     title: {
//       fontFamily: customFont,
//       fontSize: content.titleSize ? undefined : (globalSettingsData?.headingSizes?.h2 ? `${globalSettingsData.headingSizes.h2}px` : '40px'),
//       color: ensureHexHash(theme.textHeading) || (globalSettingsData?.buttons?.primaryText ? ensureHexHash(globalSettingsData.buttons.primaryText) : '#252B42')
//     },
//     body: {
//       fontFamily: customFont,
//       fontSize: globalSettingsData?.baseFontSize ? `${globalSettingsData.baseFontSize}px` : '14px',
//       color: ensureHexHash(theme.text) || (globalSettingsData?.linksEffect?.linkColor ? ensureHexHash(globalSettingsData.linksEffect.linkColor) : '#737373')
//     }
//   };

//   // Layout Helpers
//   const isImageRight = layout === 'right';

//   const paddingMap = {
//     none: 'py-0',
//     small: 'py-10 md:py-16',
//     medium: 'py-16 md:py-24',
//     large: 'py-24 md:py-32',
//   };

//   const radiusMap = {
//     none: 'rounded-none',
//     sm: 'rounded-sm',
//     md: 'rounded-lg',
//     lg: 'rounded-2xl',
//     full: 'rounded-full'
//   };

//   const aspectMap = {
//     auto: 'aspect-auto',
//     square: 'aspect-square',
//     portrait: 'aspect-[4/5]',
//     landscape: 'aspect-[3/2]'
//   };

//   // Link Resolution
//   const ctaHref = (() => {
//     const link = cta?.link?.[0];
//     if (!link) return '#';
//     if (link._type === 'linkExternal') return link.url || '#';
//     if (link.reference?.slug) return `/${link.reference._type === 'product' ? 'products' : 'collections'}/${link.reference.slug}`;
//     return '#';
//   })();

//   // Button Color Hierarchy
//   const btnBaseColor = ensureHexHash(cta.bgColor) || (globalSettingsData?.buttons?.primaryBg ? ensureHexHash(globalSettingsData.buttons.primaryBg) : '#000000');
//   const btnTextColor = ensureHexHash(cta.textColor) || (globalSettingsData?.buttons?.primaryText ? ensureHexHash(globalSettingsData.buttons.primaryText) : '#ffffff');

//   return (
//     <section
//       className={`w-full mx-auto ${paddingMap[theme.padding || 'medium']}`}
//       style={{ backgroundColor: theme.bg || '#ffffff', fontFamily: customFont }}
//     >
//       <div className={`max-w-[100%] mx-auto px-[7%] lg:px-[7%] lg:flex flex-col md:flex-row items-center gap-12 lg:gap-20 ${isImageRight ? 'md:flex-row-reverse' : ''}`}>

//         {/* MEDIA SIDE */}
//         <div
//           className="w-full flex-shrink-0"
//           style={{ flexBasis: `${imageWidth}%` }}
//         >
//           <div className={`overflow-hidden ${radiusMap[imageSettings.radius || 'none']} ${aspectMap[imageSettings.aspect || 'auto']}`}>
//             {imageUrl && (
//               <Image
//                 src={imageUrl}
//                 alt={content.title || ""}
//                 className={`w-full h-full object-${imageSettings.fit || 'cover'} filter transition-all duration-700 transform hover:scale-105 ${loaded ? 'blur-0' : 'blur-xl'}`}
//                 loading="lazy"
//                 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
//                 onLoad={(e) => e.currentTarget.style.filter = 'blur(0)'}
//               />
//             )}
//           </div>
//         </div>

//         {/* CONTENT SIDE */}
//         <div
//           className="w-full flex flex-col justify-center"
//           style={{ flexBasis: `${100 - imageWidth}%` }}
//         >
//           <div className={`w-full max-w-[550px] mx-auto ${content.alignment === 'center' ? 'text-center' : content.alignment === 'right' ? 'text-right' : 'text-left'}`}>

//             {content.overline && (
//               <span className="block uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 font-medium" style={{ color: textStyles.body.color }}>
//                 {content.overline}
//               </span>
//             )}

//             <h2
//               className={`max-md:text-[20px] ${content.titleSize || 'md:text-[50px]'} pt-8 mb-2 md:pt-0 md:mb-8 font-bold leading-[1.2] tracking-wide`}
//               style={{
//                 fontFamily: textStyles.title.fontFamily,
//                 fontSize: textStyles.title.fontSize,
//                 color: textStyles.title.color
//               }}
//             >
//               {content.title || 'We love what we do'}
//             </h2>

//             <p
//               className="leading-[1.8] tracking-[0.2px] mb-8 whitespace-pre-line"
//               style={{
//                 fontFamily: textStyles.body.fontFamily,
//                 fontSize: textStyles.body.fontSize,
//                 color: textStyles.body.color
//               }}
//             >
//               {content.body || 'Problems trying to resolve the conflict between\nthe two major realms of Classical physics:\nNewtonian mechanics.'}
//             </p>

//             {cta.text && (
//               <Link
//                 to={ctaHref}
//                 className={`
//                   inline-block transition-all duration-300
//                   ${cta.style === 'underline'
//                     ? 'border-b border-current pb-1 hover:opacity-50 tracking-widest text-xs uppercase font-bold'
//                     : 'px-10 py-4 uppercase tracking-[0.2em] text-[10px] font-bold shadow-sm hover:-translate-y-1'
//                   }
//                   ${cta.style === 'pill' ? 'rounded-full' : cta.style === 'rounded' ? 'rounded-lg' : 'rounded-none'}
//                 `}
//                 style={{
//                   backgroundColor: cta.style === 'underline' ? 'transparent' : btnBaseColor,
//                   color: cta.style === 'underline' ? 'inherit' : btnTextColor,
//                   borderRadius: cta.style !== 'underline' && globalSettingsData?.buttons?.borderRadius ? `${globalSettingsData.buttons.borderRadius}px` : undefined,
//                   border: cta.style !== 'underline' ? `2px solid ${btnBaseColor}` : undefined
//                 }}
//                 onMouseEnter={(e) => {
//                   if (cta.style !== 'underline') {
//                     // Hover BG: Module Bg -> Global HoverBg -> Base Color
//                     e.currentTarget.style.backgroundColor = ensureHexHash(globalSettingsData?.buttons?.primaryHoverBg) || btnBaseColor;
//                     // Hover Text: Module Text -> Global HoverTxt -> White
//                     e.currentTarget.style.color = ensureHexHash(globalSettingsData?.buttons?.primaryHovertxt) || '#FFFFFF';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (cta.style !== 'underline') {
//                     e.currentTarget.style.backgroundColor = btnBaseColor;
//                     e.currentTarget.style.color = btnTextColor;
//                   }
//                 }}
//               >
//                 {cta.text}
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import React, {useState, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';
import {Link} from '~/components/Link';

export default function ImageWithText({module, globalSettingsData}) {
  if (!module) return null;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    layout = 'left',
    imageWidth = 50,
    imageUrl,
    imageSettings = {},
    content = {},
    cta = {},
    theme = {},
    _key = 'default',
  } = module;

  // console.log("dfggd: ", module);

  const formatColor = (color) => {
    if (!color) return null;
    return color?.startsWith('#') ? color : `#${color}`;
  };

  const resolveCtaLink = () => {
    const linkObj = cta?.link?.[0];
    if (!linkObj) return '#';
    if (linkObj._type === 'linkExternal') return linkObj.url || '#';
    if (linkObj.reference?.slug) {
      const type = linkObj.reference._type;
      const slug = linkObj.reference.slug;
      if (type === 'product') return `/products/${slug}`;
      if (type === 'collection') return `/collections/${slug}`;
      return `/${slug}`;
    }
    return '#';
  };

  // --- STYLING HIERARCHY ---
  const fontStyle = globalSettingsData?.fontFamily || 'Montserrat, sans-serif';

  const fontSize = {
    heading: globalSettingsData?.headingSizes?.h2
      ? `${globalSettingsData.headingSizes.h2}px`
      : '40px',
    body: globalSettingsData?.baseFontSize
      ? `${globalSettingsData.baseFontSize}px`
      : '14px',
  };

  const colors = {
    sectionBg: formatColor(theme?.bg) || '#ffffff',
    heading:
      formatColor(theme?.textHeading) ||
      formatColor(globalSettingsData?.colors?.heading) ||
      '#252B42',
    body:
      formatColor(theme?.text) ||
      formatColor(globalSettingsData?.linksEffect?.linkColor) ||
      '#737373',
    btnBg:
      formatColor(cta?.bgColor?.hex) ||
      formatColor(globalSettingsData?.buttons?.primaryBg) ||
      '#000000',
    btnText:
      formatColor(cta?.textColor?.hex) ||
      formatColor(globalSettingsData?.buttons?.primaryText) ||
      '#ffffff',
  };

  const getBtnRadius = () => {
    if (cta?.style === 'sharp') return '0px';
    if (cta?.style === 'pill') return '9999px';
    if (cta?.style === 'rounded') return '8px';
    return globalSettingsData?.buttons?.borderRadius !== undefined
      ? `${globalSettingsData.buttons.borderRadius}px`
      : '0px';
  };

  const dynamicStyles = `
    .iwt-${_key} { font-family: ${fontStyle}; }

    .iwt-${_key} .fontStyle-h2 { 
      font-family: ${fontStyle};
      font-size: ${fontSize.heading};
      font-weight: 700;
      leading-trim: NONE;
      line-height: 50px;
      letter-spacing: 0.2px;
     }

    .iwt-${_key} .fontStyle-p { 
      font-family: ${fontStyle};
      font-size: ${fontSize.body};
      font-weight: 400;
      leading-trim: NONE;
      line-height: 20px;
      letter-spacing: 0.2px;
     }
   

    
    .iwt-${_key} .btn-custom {
      background-color: ${colors.btnBg} !important;
      color: ${colors.btnText} !important;
      border-radius: ${getBtnRadius()} !important;
      transition: all 0.3s ease;
      border: 1px solid ${colors.btnBg};
      display: inline-block;
    }

    .iwt-${_key} .btn-custom:hover {
      background-color: ${formatColor(globalSettingsData?.buttons?.primaryHoverBg) || colors.btnBg} !important;
      color: ${formatColor(globalSettingsData?.buttons?.primaryHovertxt) || '#FFFFFF'} !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .iwt-${_key} .btn-underline {
      color: ${colors.heading} !important;
      border-bottom: 2px solid ${colors.btnBg} !important;
      background: transparent !important;
      padding: 0 0 4px 0 !important;
      border-radius: 0 !important;
      display: inline-block;
    }

    .iwt-${_key} .btn-underline:hover {
      opacity: 0.7;
    }
  `;

  const paddingMap = {
    none: 'py-0',
    small: 'py-10 md:py-16',
    medium: 'py-16 md:py-24',
    large: 'py-24 md:py-32',
  };

  const radiusMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-lg',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  };

  const aspectMap = {
    auto: 'aspect-auto',
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
    landscape: 'aspect-[3/2]',
  };

  return (
    <section
      className={`w-full mx-auto iwt-${_key} ${paddingMap[theme?.padding || 'medium']}`}
      style={{backgroundColor: colors.sectionBg}}
    >
      <style dangerouslySetInnerHTML={{__html: dynamicStyles}} />

      <div
        className={`max-w-[100%]  px-[7%] flex flex-col lg:flex-row items-center gap-10 lg:gap-[90px] ${layout === 'right' ? 'lg:flex-row-reverse' : ''}`}
      >
        {/* MEDIA SIDE */}
        <div
          className="w-full flex-shrink-0"
          style={{flexBasis: `${imageWidth}%`}}
        >
          <div
            className={`overflow-hidden ${radiusMap[imageSettings?.radius || 'none']} ${aspectMap[imageSettings?.aspect || 'auto']}`}
          >
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={content?.title || 'Section Image'}
                className={`w-full h-full object-${imageSettings?.fit || 'cover'} transition-all duration-700 hover:scale-105 ${mounted ? 'blur-0' : 'blur-xl'}`}
                sizes={`(max-width: 1024px) 100vw, ${imageWidth}vw`}
              />
            )}
          </div>
        </div>

        {/* CONTENT SIDE */}
        <div
          className="w-full flex flex-col justify-center"
          style={{flexBasis: `${100 - imageWidth}%`}}
        >
          <div
            className={`w-full max-w-[550px] mx-auto ${content?.alignment === 'center' ? 'text-center' : content?.alignment === 'right' ? 'text-right' : 'text-left'}`}
          >
            {content?.overline && (
              <span
                className="block uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 font-medium"
                style={{color: colors.body}}
              >
                {content.overline}
              </span>
            )}

            <h2
              className={`fontStyle-h2 mb-4 ${content?.titleSize || 'text-[40px]'} max-md:text-[28px]`}
              style={{color: colors.heading}}
            >
              {content?.title || 'Title goes here'}
            </h2>

            {content?.body && (
              <p
                className="fontStyle-p whitespace-pre-line sm:text-sm text-[#737373]"
                // style={{color: colors.body}}
              >
                {content.body}
              </p>
            )}

            {cta?.text && (
              <Link
                to={resolveCtaLink()}
                className={
                  cta?.style === 'underline'
                    ? 'btn-underline uppercase tracking-widest text-[11px] font-bold mt-[16px]'
                    : 'btn-custom px-10 py-4 mt-[16px] uppercase tracking-[0.2em] text-[10px] font-bold shadow-sm'
                }
              >
                {cta.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
