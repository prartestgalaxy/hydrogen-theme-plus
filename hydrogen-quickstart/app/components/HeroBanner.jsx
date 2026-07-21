// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router';
// import { Link } from 'react-router';

// export default function HeroBanner({ module, globalSettingsData }) {

//   console.log("Global settings in Hero banner: "+ JSON.stringify(globalSettingsData,null,2))

//   if (!module) return null;

//   // Set default to 'us' if locale is undefined
//   const { locale } = useParams();
//   const activeLocale = locale || 'us';

//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoaded(true), 50);
//     return () => clearTimeout(timer);
//   }, []);

//   const {
//     layout = 'full',
//     imageUrl,
//     content = {},
//     colors = {},
//     cta = {}
//   } = module;

//   // Link Resolution Logic
//   const ctaHref = (() => {
//     const link = cta?.link?.[0];
//     if (!link) return '#';

//     if (link._type === 'linkExternal') return link.url || '#';

//     if (link.reference?.slug) {
//       const prefix =
//         link.reference._type === 'product' ? 'products' : 'collections';
//       return `/${prefix}/${link.reference.slug}`;
//     }

//     return '#';
//   })();

//   const btnRadius = {
//     pill: 'rounded-full',
//     rounded: 'rounded-md',
//     sharp: 'rounded-none',
//     outline: 'rounded-md border-2 bg-transparent'
//   };

//   // =========================
//   // FULL LAYOUT (Unchanged)
//   // =========================
//   if (layout === 'full') {
//     return (
//       <section className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
//         {imageUrl && (
//           <img
//             src={imageUrl}
//             alt={content.title || ''}
//             loading="lazy"
//             className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
//               loaded ? 'blur-0 scale-100' : 'blur-xl scale-105'
//             }`}
//             onLoad={() => setLoaded(true)}
//           />
//         )}
//         <div className="absolute inset-0" style={{ backgroundColor: 'black', opacity: (colors.overlay || 0) / 100 }} />
//         <div className="relative z-10 px-6 max-w-4xl" style={{ color: colors.text || '#ffffff', textAlign: content.alignment || 'center' }}>
//           <h1 className={`${content.titleSize || 'text-4xl'} ${content.titleWeight || 'font-bold'} mb-6`}>{content.title}</h1>
//           <p className="text-lg md:text-xl mb-8 opacity-90">{content.subtitle}</p>
//           {cta.text && (
//             <Link
//               to={ctaHref}
//               className={`inline-block px-10 py-4 font-bold tracking-widest uppercase text-xs transition-transform hover:scale-105 ${btnRadius[cta.style] || 'rounded-md'}`}
//               style={{ backgroundColor: cta.style === 'outline' ? 'transparent' : cta.bgColor, color: cta.textColor, borderColor: cta.bgColor }}
//             >
//               {cta.text}
//             </Link>
//           )}
//         </div>
//       </section>
//     );
//   }

//   // =========================
//   // SPLIT LAYOUT (GAP FIXED)
//   // =========================

//   const isImageLeft = layout === 'split-left';

//   return (
//     <section className="w-full max-w-[100%] px-[7%] mb-4 mx-auto md:py-8 md:py-12 flex justify-center">
//       <div
//         className={`relative w-full h-[75vh] rounded-[24px] overflow-hidden flex flex-col ${
//           isImageLeft ? 'md:flex-row-reverse' : 'md:flex-row'
//         } shadow-sm`}
//         style={{ backgroundColor: colors.bg || '#45C8ED' }}
//       >

//         {/* DECORATIVE ELEMENTS (Floating dots) */}
//         <div className="absolute top-10 left-[42%] w-12 h-12 bg-white rounded-full z-0 hidden md:block" />
//         <div className="absolute bottom-12 left-[48%] w-4 h-4 bg-[#9b51e0] rounded-full z-0 hidden md:block" />
//         <div className="absolute top-16 right-12 w-3 h-3 bg-[#9b51e0] rounded-full z-0 hidden md:block" />
//         <div className="absolute bottom-1/3 right-6 w-8 h-8 rounded-full z-0 border-[3px] border-white/70 hidden md:block" />

//         {/* CONTENT SIDE (Takes 55% width to close the gap) */}
//         <div
//           className="relative z-10 w-full md:w-[55%] flex flex-col justify-center p-8 md:py-16 md:px-12 lg:pl-16 lg:pr-6"
//           style={{
//             color: colors.text || '#0a2540',
//             textAlign: content.alignment || 'left'
//           }}
//         >
//           {content.overline && (
//             <p className="text-[14px] font-bold tracking-[0.1em] uppercase mb-4 text-[#2A7CC7]">
//               {content.overline}
//             </p>
//           )}
//           <h5 className='text-[#2A7CC7] my-[30px] headerMenuFont text-left'>{content.subheading}</h5>
//           <h1
//             className={`${content.titleSize || 'text-5xl headerMenuFont md:text-[54px] lg:text-[60px]'} ${
//               content.titleWeight || 'font-extrabold'
//             } mb-4 leading-[1.1] tracking-tight text-[#252B42]`}
//           >
//             {content.title}
//           </h1>

//           <p className="headerMenuFont text-left text-[16px] md:text-[18px] mb-8 opacity-75 leading-relaxed max-w-[90%] text-[#505050]">
//             {content.subtitle}
//           </p>

//           <div>
//             {cta.text && (
//               <Link
//                 // Use the fallback activeLocale here
//                 to={`/${activeLocale}/collections/all`}
//                 className={`inline-block px-10 py-3.5 font-bold tracking-widest uppercase text-[13px] transition-transform hover:-translate-y-1 shadow-md ${
//                   btnRadius[cta.style] || 'rounded-md'
//                 }`}
//                 style={{
//                   backgroundColor: cta.style === 'outline' ? 'transparent' : (cta.bgColor || '#23A6F0'),
//                   color: cta.textColor || '#ffffff',
//                   borderColor: cta.bgColor || '#23A6F0'
//                 }}
//               >
//                 {cta.text}
//               </Link>
//             )}
//           </div>
//         </div>

//         {/* IMAGE SIDE (Takes 45% width) */}
//         <div className="relative w-full md:w-[45%] min-h-[350px] md:min-h-[480px] flex items-end justify-center">

//           {/* Oversized White Background Circle - Shifted to bleed into the text side */}
//           <div
//             className={`absolute top-1/2 -translate-y-1/2 h-[120%] md:h-[135%] aspect-square bg-white rounded-full z-0 ${
//               isImageLeft ? 'right-[-10%] md:right-[-25%]' : 'left-[-10%] md:left-[-25%]'
//             }`}
//           />

//           {/* Image - Pinned to bottom, allowed to scale much larger */}
//           {imageUrl && (
//             <img
//               src={imageUrl}
//               alt={content.title || ''}
//               loading="lazy"
//               className={`absolute bottom-0 w-[90%] md:w-[110%] max-w-none h-[95%] object-contain object-bottom z-10 transition-all duration-700 ${
//                 loaded ? 'blur-0 scale-100' : 'blur-xl scale-105'
//               }`}
//               onLoad={() => setLoaded(true)}
//             />
//           )}
//         </div>

//       </div>
//     </section>
//   );
// }

import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router';
import {Link} from 'react-router';

export default function HeroBanner({module, globalSettingsData}) {
  if (!module) return null;

  const {locale} = useParams();
  const activeLocale = locale || 'us';
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const {
    layout = 'full',
    imageUrl,
    content = {},
    colors = {},
    cta = {},
  } = module;

  // console.log("colors: ", colors);


  // =========================
  // COLOR SANITIZER HELPER
  // =========================
  const formatColor = (color) => {
    if (!color) return undefined;
    // If it's a string and doesn't start with #, add it.
    return color.toString().startsWith('#') ? color : `#${color}`;
  };

  // =========================
  // FALLBACK LOGIC HELPER
  // =========================
  const dynamicStyles = `
    .hero-banner-font {
      font-family: ${globalSettingsData?.fontFamily ? globalSettingsData?.fontFamily : 'Montserrat, sans-serif'};
    }
    .hero-banner-bg {
      background-color: ${colors?.bg?.hex ? formatColor(colors?.bg?.hex) : globalSettingsData?.mainBg ? formatColor(globalSettingsData.mainBg) : '#45C8ED'};
    }
    .hero-banner-text {
      color: ${colors?.text?.hex ? formatColor(colors?.text?.hex) : globalSettingsData?.mainColor ? formatColor(globalSettingsData.mainColor) : '#0a2540'};
      text-align: ${content?.alignment ? content.alignment : 'left'};
    }
    .hero-banner-title {
      max-width: fit-content;
      font-family: ${globalSettingsData?.fontFamily ? globalSettingsData?.fontFamily : 'Montserrat, sans-serif'};
      font-size: ${content?.titleSize ? content.titleSize : globalSettingsData?.headingSizes?.h1 ? globalSettingsData.headingSizes.h1 + 'px' : '42px'};
      font-weight: 700;
      leading-trim: NONE;
      line-height: 80px;
      letter-spacing: 0.2px;

    }
    .hero-banner-subheading {
      max-width:548px;
      font-family: ${globalSettingsData?.fontFamily ? globalSettingsData?.fontFamily : 'Montserrat, sans-serif'};
      font-size: ${content?.subheadingSize ? content.subheadingSize : globalSettingsData?.headingSizes?.h5 ? globalSettingsData.headingSizes.h5 + 'px' : '16px'};
      font-weight: 700;
      leading-trim: NONE;
      line-height: 24px;
      letter-spacing: 0.1px;
    }
      .hero-banner-para{
      max-width:376px;
      font-family: ${globalSettingsData?.fontFamily ? globalSettingsData?.fontFamily : 'Montserrat, sans-serif'};
        font-size: ${content?.paraSize ? content.paraSize : globalSettingsData?.headingSizes?.h4 ? globalSettingsData.headingSizes.h4 + 'px' : '20px'};
        font-weight: 400;
        leading-trim: NONE;
        line-height: 30px;
        letter-spacing: 0.2px;
      }

    .hero-btn {
      width:100%;
      max-width: fit-content;
      font-family: ${globalSettingsData?.fontFamily ? globalSettingsData?.fontFamily : 'Montserrat, sans-serif'};
      font-size: ${content?.paraSize ? content.paraSize : globalSettingsData?.headingSizes?.h3 ? globalSettingsData.headingSizes.h3 + 'px' : '24px'};
      background-color: ${cta?.style === 'outline' ? 'transparent' : cta?.bgColor ? formatColor(cta.bgColor) : globalSettingsData?.buttons?.primaryBg ? formatColor(globalSettingsData.buttons.primaryBg) : '#23A6F0'};
      color: ${cta?.textColor ? formatColor(cta.textColor) : globalSettingsData?.buttons?.primaryText ? formatColor(globalSettingsData.buttons.primaryText) : '#FFFFFF'};
      border-color: ${cta?.bgColor ? formatColor(cta.bgColor) : globalSettingsData?.buttons?.primaryBg ? formatColor(globalSettingsData.buttons.primaryBg) : '#23A6F0'};
      ${!cta?.style ? `border-radius: ${globalSettingsData?.buttons?.borderRadius !== undefined ? globalSettingsData.buttons.borderRadius : 8}px;` : ''};
      font-weight: 700;
      leading-trim: NONE;
      line-height: 32px;
      letter-spacing: 0.1px;
      text-align: center;

    }
    .hero-btn:hover {
       background-color: ${globalSettingsData?.buttons?.primaryHoverBg ? formatColor(globalSettingsData.buttons.primaryHoverBg) : '#1D4ED8'};
       color: ${globalSettingsData?.buttons?.primaryHovertxt ? formatColor(globalSettingsData.buttons.primaryHovertxt) : '#FFFFFF'};
       border-color: ${globalSettingsData?.buttons?.primaryHoverBg ? formatColor(globalSettingsData.buttons.primaryHoverBg) : '#1D4ED8'};
    }
    .hero-overlay {
      background-color: black;
      opacity: ${(colors?.overlay || 0) / 100};
    }

      @media (max-width: 514px) {
       .hero-banner-title {
         font-size:40px;
        }
      }
  `;

  // Link Resolution Logic
  const ctaHref = (() => {
    const link = cta?.link?.[0];
    if (!link) return '#';
    if (link._type === 'linkExternal') return link.url || '#';
    if (link.reference?.slug) {
      const prefix =
        link.reference._type === 'product' ? 'products' : 'collections';
      return `/${prefix}/${link.reference.slug}`;
    }
    return '#';
  })();

  const btnRadius = {
    pill: 'rounded-full',
    rounded: 'rounded-md',
    sharp: 'rounded-none',
    outline: 'rounded-md border-2 bg-transparent',
  };

  // =========================
  // FULL LAYOUT
  // =========================
  if (layout === 'full') {
    return (
      <section className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden hero-banner-font">
        <style>{dynamicStyles}</style>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={content.title || ''}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${loaded ? 'blur-0 scale-100' : 'blur-xl scale-105'}`}
            onLoad={() => setLoaded(true)}
          />
        )}
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 px-6 max-w-4xl hero-banner-text">
          <h1
            className={`${content.titleWeight || 'font-bold'} mb-6 hero-banner-title`}
          >
            {content.title}
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            {content.subtitle}
          </p>
          {cta.text && (
            <Link
              to={ctaHref}
              className={`inline-block px-10 py-4 font-bold tracking-widest uppercase text-xs transition-transform hover:scale-105 hero-btn ${cta.style ? btnRadius[cta.style] : ''}`}
            >
              {cta.text}
            </Link>
          )}
        </div>
      </section>
    );
  }

  // =========================
  // SPLIT LAYOUT
  // =========================
  const isImageLeft = layout === 'split-left';

  return (
    <section className="w-full max-w-[100%] px-[7%] mb-[14px] mx-auto md:py-[42px] flex justify-center hero-banner-font">
      <style>{dynamicStyles}</style>
      <div
        className={`relative w-full min-h-[65vh] lg:min-h-[75vh] h-auto rounded-[24px] overflow-hidden flex flex-col ${isImageLeft ? 'md:flex-row-reverse' : 'md:flex-row'} shadow-sm hero-banner-bg`}
      >
        <div className="relative z-10 w-full md:w-[55%] flex flex-col justify-center p-8 md:py-16 md:px-12 lg:pl-[50px] lg:pr-[50px] hero-banner-text gap-[30px]">
          {content.overline && (
            <p className="text-[14px] font-bold tracking-[0.1em] uppercase text-[#2A7CC7]">
              {content.overline}
            </p>
          )}
          <h5 className="text-[#2A7CC7] hero-banner-font hero-banner-subheading text-left">
            {content.subheading}
          </h5>

          <h1
            className={`${content.titleWeight || 'font-extrabold'} hero-banner-font md:!text-[58px] leading-[1.1] tracking-tight text-[#252B42] hero-banner-title`}
          >
            {content.title}
          </h1>

          <h4 className="text-left opacity-75 leading-relaxed max-w-[90%] hero-banner-para hero-banner-font">
            {content.subtitle}
          </h4>

          <div>
            {cta.text && (
              <Link
                to={ctaHref}
                className={`inline-block px-[40px] py-[15px] uppercase transition-transform hover:-translate-y-1 shadow-md hero-btn ${cta.style ? btnRadius[cta.style] : ''}`}
              >
                {cta.text}
              </Link>
            )}
          </div>
        </div>

        {/* IMAGE SIDE */}
        <div className="relative w-full md:w-[45%] min-h-[350px] md:min-h-[480px] flex items-end justify-center">
          <div
            className={`absolute top-1/2 -translate-y-1/2 h-[120%] md:h-[135%] aspect-square rounded-full z-0 ${isImageLeft ? 'right-[-10%] md:right-[-25%]' : 'left-[-10%] md:left-[-25%]'}`}
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt={content.title || ''}
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-auto md:w-[110%] max-w-none h-[100%] object-contain object-bottom z-10 transition-all duration-700 ${loaded ? 'blur-0 scale-100' : 'blur-xl scale-105'}`}
              onLoad={() => setLoaded(true)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
