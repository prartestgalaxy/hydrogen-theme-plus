// import { Link } from '~/components/Link';
// import dummy from '~/assets/dummy.jpg'
// import { Image } from '@shopify/hydrogen';
// export default function AboutPage() {
//   return (
//     <div className="w-full bg-white text-black pb-20">

//       {/* 1. HERO SECTION */}
//       <section className="w-full bg-[#F2F1E9] px-6 py-24 md:py-32 flex flex-col items-center justify-center text-center">
//         <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-widest mb-6">
//           Our Story
//         </h1>
//         <p className="max-w-2xl text-sm md:text-base leading-relaxed text-[#21211F] opacity-80">
//           We are a team of creators, riders, and innovators. We build the gear we couldn't find in the market—products that refuse to compromise on performance, durability, or aesthetics.
//         </p>
//       </section>

//       {/* 2. SPLIT CONTENT SECTION (Image Left, Text Right) */}
//       <section className="max-w-[1440px] mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
//         {/* Image Placeholder */}
//         <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
//           {/* <span className="text-gray-400 text-sm uppercase tracking-widest">Image Placeholder</span> */}

//           <Image src={dummy} alt="About us" className="w-full h-full object-cover" />

//         </div>

//         {/* Text Content */}
//         <div className="flex flex-col gap-6">
//           <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide">
//             Designed for the Elements
//           </h2>
//           <p className="text-sm md:text-base leading-relaxed text-gray-600">
//             What started as a late-night passion project has evolved into a global community. Every piece of equipment we produce is rigorously tested in the harshest conditions to ensure it stands up to the demands of our riders.
//           </p>
//           <p className="text-sm md:text-base leading-relaxed text-gray-600">
//             We believe that true sustainability comes from building things that last. No fast fashion, no planned obsolescence. Just high-quality materials and obsessive attention to detail.
//           </p>

//           <div className="mt-4">
//             <Link
//               to="/collections/all"
//               className="inline-block bg-black text-white text-[11px] font-bold uppercase tracking-widest px-8 py-4 rounded hover:opacity-80 transition-opacity"
//             >
//               Shop the Collection
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* 3. CORE VALUES GRID */}
//       <section className="w-full px-6 py-16 md:py-24 bg-black text-white mt-10">
//         <div className="max-w-[1440px] mx-auto">
//           <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-center mb-12 md:mb-16">
//             Core Values
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
//             {/* Value 1 */}
//             <div className="flex flex-col items-center text-center p-6">
//               <div className="w-12 h-12 border border-white rounded-full flex items-center justify-center mb-6">
//                 <span className="text-xl">1</span>
//               </div>
//               <h3 className="text-lg font-bold uppercase tracking-widest mb-3">Uncompromising Quality</h3>
//               <p className="text-sm opacity-70 leading-relaxed">
//                 We source only the highest-grade materials to ensure our products endure season after season.
//               </p>
//             </div>

//             {/* Value 2 */}
//             <div className="flex flex-col items-center text-center p-6">
//               <div className="w-12 h-12 border border-white rounded-full flex items-center justify-center mb-6">
//                 <span className="text-xl">2</span>
//               </div>
//               <h3 className="text-lg font-bold uppercase tracking-widest mb-3">Eco-Conscious</h3>
//               <p className="text-sm opacity-70 leading-relaxed">
//                 Protecting our playground is non-negotiable. We constantly strive to minimize our environmental footprint.
//               </p>
//             </div>

//             {/* Value 3 */}
//             <div className="flex flex-col items-center text-center p-6">
//               <div className="w-12 h-12 border border-white rounded-full flex items-center justify-center mb-6">
//                 <span className="text-xl">3</span>
//               </div>
//               <h3 className="text-lg font-bold uppercase tracking-widest mb-3">Community Driven</h3>
//               <p className="text-sm opacity-70 leading-relaxed">
//                 We are more than a brand; we are a collective. Your feedback directly shapes our future designs.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//     </div>
//   );
// }

import {useLoaderData, useRouteLoaderData} from 'react-router';
import {PortableText} from '@portabletext/react';
// import {ABOUT_PAGE_QUERY} from '~/sanity/queries/aboutPage';
import {ABOUT_PAGE_SCHEMA_QUERY} from '~/sanity/queries/aboutPageSchema';
import {Link} from '~/components/Link';
import {PageLayout} from '~/components/PageLayout';

// --- LOADER FUNCTION ---
export async function loader({context}) {
  const {sanityClient} = context;
  const page = await sanityClient.fetch(ABOUT_PAGE_SCHEMA_QUERY);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }
  return {page};
}

// --- HELPER ---
const formatColor = (color) => {
  if (!color) return null;
  return color.startsWith('#') ? color : `#${color}`;
};

// --- MAIN ROUTE COMPONENT ---
export default function AboutRoute() {
  const {page} = useLoaderData();

  const rootData = useRouteLoaderData('root');
  const GlobalSettings = rootData?.globalSettings;

  // Module-level values (storyBgColor, valuesBgColor, featureLayout) are applied
  // directly as classNames/inline styles on elements — first priority.
  // GlobalSettings flows through dynamicStyles as the base fallback (no !important).
  const dynamicStyles = `
    .about-page {
      font-family: ${GlobalSettings?.fontFamily ? GlobalSettings.fontFamily : 'Montserrat, sans-serif'};
      font-size: ${GlobalSettings?.baseFontSize ? GlobalSettings.baseFontSize : 16}px;
    }
    .about-page h1 { font-size: ${GlobalSettings?.headingSizes?.h1 ? GlobalSettings.headingSizes.h1 : 42}px; }
    .about-page h2 { font-size: ${GlobalSettings?.headingSizes?.h2 ? GlobalSettings.headingSizes.h2 : 40}px; }
    .about-page h3 { font-size: ${GlobalSettings?.headingSizes?.h3 ? GlobalSettings.headingSizes.h3 : 32}px; }
    .about-page h4 { font-size: ${GlobalSettings?.headingSizes?.h4 ? GlobalSettings.headingSizes.h4 : 24}px; }
    .about-page h5 { font-size: ${GlobalSettings?.headingSizes?.h5 ? GlobalSettings.headingSizes.h5 : 20}px; }
    .about-page h6 { font-size: ${GlobalSettings?.headingSizes?.h6 ? GlobalSettings.headingSizes.h6 : 16}px; }

    .btn-primary {
      background-color: ${GlobalSettings?.buttons?.primaryBg ? formatColor(GlobalSettings.buttons.primaryBg) : '#23A6F0'};
      color: ${GlobalSettings?.buttons?.primaryText ? formatColor(GlobalSettings.buttons.primaryText) : '#FFFFFF'};
      border-radius: ${GlobalSettings?.buttons?.borderRadius != null && GlobalSettings?.buttons?.borderRadius !== '' ? GlobalSettings.buttons.borderRadius : 8}px;
    }
    .btn-primary:hover {
      background-color: ${GlobalSettings?.buttons?.primaryHoverBg ? formatColor(GlobalSettings.buttons.primaryHoverBg) : '#1D4ED8'};
      color: ${GlobalSettings?.buttons?.primaryHovertxt ? formatColor(GlobalSettings.buttons.primaryHovertxt) : '#FFFFFF'};
    }

    .about-link {
      color: ${GlobalSettings?.linksEffect?.linkColor ? formatColor(GlobalSettings.linksEffect.linkColor) : '#252B42'};
      transition-duration: ${GlobalSettings?.linksEffect?.transitionDuration != null && GlobalSettings?.linksEffect?.transitionDuration !== '' ? GlobalSettings.linksEffect.transitionDuration : 300}ms;
      text-decoration: ${(GlobalSettings?.linksEffect?.underlineStyle ? GlobalSettings.linksEffect.underlineStyle : 'none') === 'always' ? 'underline' : 'none'};
    }
    .about-link:hover {
      color: ${GlobalSettings?.linksEffect?.hoverColor ? formatColor(GlobalSettings.linksEffect.hoverColor) : '#5a5a5a'};
      ${(GlobalSettings?.linksEffect?.hoverEffect ? GlobalSettings.linksEffect.hoverEffect : 'none') === 'underline' ? 'text-decoration: underline;' : ''}
    }
  `;

  return (
    <PageLayout>
      <div className="min-h-screen about-page">
        <style>{dynamicStyles}</style>
        <AboutPage page={page} GlobalSettings={GlobalSettings} />
      </div>
    </PageLayout>
  );
}

// --- ABOUT PAGE COMPONENT ---
function AboutPage({page, GlobalSettings}) {
  const {
    storyHeading,
    storyBody,
    storyBgColor,
    featureLayout,
    featureImage,
    featureHeading,
    featureBody,
    featureButton,
    valuesHeading,
    valuesBgColor,
    valuesList,
  } = page;

  // console.log("Page: ", page);

  const isFeatureImageRight = featureLayout === 'right';

  return (
    <main className="w-full">
      {/* --- 1. OUR STORY SECTION --- */}
      <section
        className="py-24 px-6 lg:px-12 flex flex-col items-center justify-center text-center"
        style={{backgroundColor: storyBgColor || '#f4f4f0'}}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-widest uppercase">
            {storyHeading || 'OUR STORY'}
          </h1>
          {storyBody && (
            <p className="text-[18px] md:text-[20px] text-gray-700 leading-relaxed max-w-3xl mx-auto">
              {storyBody}
            </p>
          )}
        </div>
      </section>

      {/* --- 2. FEATURE SECTION (Designed for the elements) --- */}
      <section className="max-w-[100%] bg-white py-24 px-[7%] lg:py-48">
        <div
          className={`container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center ${isFeatureImageRight ? '' : 'md:flex-row-reverse'}`}
        >
          {/* Image Column */}
          <div
            className={`relative w-full ${isFeatureImageRight ? 'order-last' : 'order-first'}`}
          >
            {featureImage?.asset?.url && (
              <img
                src={featureImage.asset.url}
                alt={featureImage.alt || 'About Feature'}
                className="w-full h-auto object-cover rounded shadow-md"
                loading="lazy"
              />
            )}
          </div>

          {/* Text Column */}
          <div className="space-y-8 text-left">
            <h2 className="text-4xl md:text-[42px] font-extrabold text-black uppercase leading-tight tracking-tight">
              {featureHeading || 'DESIGNED FOR THE ELEMENTS'}
            </h2>

            <div className="text-[16px] md:text-[18px] text-gray-700 leading-relaxed space-y-6">
              {featureBody ? (
                <PortableText value={featureBody} />
              ) : (
                <p>
                  What started as a late-night passion project has evolved into
                  a global community...
                </p>
              )}
            </div>

            {featureButton?.text && (
              <div className="pt-4">
                <Link
                  to={
                    featureButton.link?.[0]?.url ||
                    featureButton.link?.[0]?.reference?.slug ||
                    '#'
                  }
                  className="inline-block px-8 py-4 btn-primary text-white text-[13px] font-bold uppercase tracking-wider transition-colors"
                >
                  {featureButton.text}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- 3. CORE VALUES SECTION --- */}
      <section
        className="text-white py-24 px-6 lg:px-12"
        style={{backgroundColor: valuesBgColor || '#ffffff'}}
      >
        <div className="container mx-auto max-w-6xl space-y-20">
          <div className="text-center">
            <h2 className="text-4xl md:text-[42px] font-extrabold uppercase tracking-widest">
              {valuesHeading || 'CORE VALUES'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {valuesList &&
              valuesList.map((value, index) => (
                <div
                  key={value._key || index}
                  className="flex flex-col items-center text-center space-y-6"
                >
                  {/* Circle Number */}
                  <div className="w-14 h-14 rounded-full border border-white flex items-center justify-center text-xl font-light">
                    {value.number || index + 1}
                  </div>

                  <h3 className="text-[18px] font-bold uppercase tracking-widest">
                    {value.title}
                  </h3>

                  <p className="text-[15px] text-gray-300 leading-relaxed max-w-xs mx-auto">
                    {value.description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
