// import { NavLink } from 'react-router';

// export function Footer({ footer, storeName}) {
//   if (!footer?.showFooter) return null;

//   const {
//     variant,
//     logo,
//     columns,
//     links,
//     copyright,
//     textColor,
//     backgroundColor,
//     backgroundColorCpr
//   } = footer;

//   console.log("bg color "+ backgroundColor + "cpr " + backgroundColorCpr)

//   return (
//     <footer className={`w-full pt-10 font-sans ml-4 mt-12 md:ml-0`}
//       style={{ backgroundColor: backgroundColor, color: textColor }}
//     >

//       {/* --- TOP BAR (Logo & Socials) --- */}
//       <div className="max-w-[100%] px-[7%] mx-auto pb-10 flex flex-col md:flex-row justify-between items-center gap-6">
//         <div className="font-bold text-2xl tracking-wide">
//           {logo?.asset?.url ? (
//             <img
//               src={logo.asset.url}
//               style={{ width: logo.width ? `${logo.width}px` : 'auto' }}
//               alt="Footer Logo"
//               className="h-8 object-contain transition-all duration-500"
//               loading="lazy"
//             />
//           ) : (
//             storeName || 'Store'
//           )}
//         </div>

//         {/* Social Icons matching the image */}
//         <div className="flex items-center gap-5 text-[#23A6F0]">
//           <FacebookIcon />
//           <InstagramIcon />
//           <TwitterIcon />
//         </div>
//       </div>

//       <hr className="border-[#E6E6E6]" />

//       {/* --- MAIN CONTENT AREA --- */}
//       <div className="max-w-[100%] px-[7%] mx-auto py-16">
//         {variant === 'columns' ? (

//           /* COLUMN LAYOUT (Matches the image) */
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">

//             {/* Sanity Dynamic Columns (Takes up first 4 slots) */}
//             {columns?.map((col, i) => (
//               <div key={i} className="flex flex-col gap-5">
//                 <h4 className="font-bold text-[#252B42] text-base mb-1">
//                   {col.title}
//                 </h4>
//                 <div className="flex flex-col gap-3">
//                   {col.links?.map((link, j) => (
//                     <FooterLink key={j} link={link} />
//                   ))}
//                 </div>
//               </div>
//             ))}

//             {/* Hardcoded Newsletter Form (Takes up last 2 slots for width) */}
//             <div className="flex flex-col gap-5 lg:col-span-2">
//               <h4 className="font-bold text-[#252B42] text-base mb-1">
//                 Get In Touch
//               </h4>
//               <div className="flex h-14 shadow-sm">
//                 <input
//                   type="email"
//                   placeholder="Your Email"
//                   className="bg-[#F9F9F9] border border-[#E6E6E6] border-r-0 rounded-l text-[#737373] text-sm px-5 w-full outline-none focus:bg-white transition-colors"
//                 />
//                 <button className="bg-[#23A6F0] text-white px-6 rounded-r text-sm transition-opacity hover:opacity-90">
//                   Subscribe
//                 </button>
//               </div>
//               <p className="text-[12px] text-[#737373]">
//                 Lore imp sum dolor Amit
//               </p>
//             </div>

//           </div>

//         ) : (

//           /* HORIZONTAL / SIMPLE LAYOUT (Clean centered fallback) */
//           <div className="flex flex-col items-center justify-center text-center gap-8">
//             <div className="flex flex-wrap gap-8 justify-center">
//               {links?.map((link, i) => (
//                 <FooterLink key={i} link={link} />
//               ))}
//             </div>
//           </div>

//         )}
//       </div>

//       {/* --- BOTTOM BAR (Copyright) --- */}
//       <div className={`w-full py-6`}
//            style={{ backgroundColor : backgroundColorCpr }}
//       >
//         <div className="max-w-[1550px] mx-auto px-6 flex justify-center md:justify-center">
//           <p className="text-[#737373] text-sm font-bold">
//             {copyright || '© All rights reserved'}
//           </p>
//         </div>
//       </div>

//     </footer>
//   );
// }

// function FooterLink({ link }) {
//   const isExternal = link.type === 'external';
//   const href = isExternal ? link.url : `/${link.slug}`;

//   return (
//     <NavLink
//       to={href}
//       target={isExternal ? "_blank" : undefined}
//       rel={isExternal ? "noopener noreferrer" : undefined}
//       className="text-[#737373] text-sm font-bold hover:text-[#23A6F0] transition-colors w-fit block"
//     >
//       {link.label || 'Unnamed Link'}
//     </NavLink>
//   );
// }

// /* --- SVG Icons --- */
// const FacebookIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//     <path d="M22.675 0H1.325C0.593 0 0 0.593 0 1.325V22.676C0 23.407 0.593 24 1.325 24H12.82V14.706H9.692V11.084H12.82V8.413C12.82 5.313 14.713 3.625 17.479 3.625C18.804 3.625 19.942 3.724 20.274 3.768V7.008L18.356 7.009C16.852 7.009 16.561 7.724 16.561 8.862V11.085H20.148L19.681 14.707H16.561V24H22.677C23.407 24 24 23.407 24 22.675V1.325C24 0.593 23.407 0 22.675 0Z"/>
//   </svg>
// );

// const InstagramIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
//     <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
//     <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
//     <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
//   </svg>
// );

// const TwitterIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//     <path d="M23.953 4.57009C23.0545 4.96569 22.0949 5.22684 21.0964 5.35017C22.1388 4.73024 22.9234 3.75133 23.2985 2.58988C22.3364 3.16143 21.2723 3.56842 20.1479 3.7915C19.2312 2.81223 17.9304 2.21777 16.4957 2.21777C13.7383 2.21777 11.5037 4.45239 11.5037 7.20977C11.5037 7.60107 11.5478 7.98144 11.6322 8.34789C7.4842 8.13963 3.82498 6.15579 1.39174 3.19777C0.962057 3.93512 0.716183 4.79246 0.716183 5.70588C0.716183 7.43853 1.59792 8.96277 2.93475 9.85608C2.11217 9.82998 1.33968 9.60455 0.672808 9.23414V9.29686C0.672808 11.7226 2.39956 13.7467 4.69344 14.2081C4.27453 14.3221 3.83411 14.382 3.38048 14.382C3.0588 14.382 2.74472 14.3509 2.44106 14.2917C3.07869 16.2801 4.92558 17.7274 7.11545 17.7677C5.4057 19.1085 3.25056 19.9077 0.908076 19.9077C0.504938 19.9077 0.106822 19.884 0 19.8369C2.12817 21.2016 4.65471 22.0008 7.35987 22.0008C16.1916 22.0008 21.0205 14.6853 21.0205 8.34141C21.0205 8.13315 21.0157 7.92589 21.006 7.72063C21.9442 7.04362 22.7668 6.19522 23.4214 5.22814C22.56 5.61058 21.6373 5.86241 20.671 5.97607C21.6575 5.38541 22.4158 4.44855 22.7719 3.32837L23.953 4.57009Z"/>
//   </svg>
// );

import { NavLink } from 'react-router';
import { Instagram, Youtube, Facebook, Twitter, X } from 'lucide-react';
import { Image } from '@shopify/hydrogen';

import instagramLogo from '../assets/instagram-footer.svg';
import facebookLogo from '../assets/facebook-footer.svg'
import twitterLogo from '../assets/twitter-footer.svg'



export function Footer({
  footer,
  storeName,
  publicStoreDomain,
  localization,
  globalData,
}) {
  if (!footer?.showFooter) return null;

  const {
    variant,
    logo,
    socials,
    columns,
    links,
    copyright,
    textColor,
    backgroundColor,
    backgroundColorCpr,
    alignment = 'left',
    fontSize = '16',
  } = footer;

  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const hasSocials = socials && Object.values(socials).some((link) => !!link);

  const dynamicStyles = `
    .custom-footer {
      font-family: ${globalData?.fontFamily ? globalData.fontFamily : 'Montserrat, sans-serif'};
      font-size: ${fontSize? fontSize : globalData?.baseFontSize ? globalData.baseFontSize : 14}px;
      font-weight: 700;
      leading-trim: NONE;
      line-height: 24px;
      letter-spacing: 0.2px;

    }
    .custom-footer h4 {
      font-size: ${globalData?.headingSizes?.h4 ? globalData.headingSizes.h4 : 24}px;
    }

    .custom-footer h5 {
      font-size: ${fontSize ? fontSize : globalData?.headingSizes?.h4 ? globalData.headingSizes.h5 : 16}px;
      font-weight: 700;
      leading-trim: NONE;
      line-height: 24px;
      letter-spacing: 0.1px;

    }

    .footer-btn {
      background-color: ${globalData?.buttons?.primaryBg ? formatColor(globalData.buttons.primaryBg) : '#23A6F0'};
      color: ${globalData?.buttons?.primaryText ? formatColor(globalData.buttons.primaryText) : '#FFFFFF'};
      border-radius: ${globalData?.buttons?.borderRadius !== undefined ? globalData.buttons.borderRadius : 8}px;
    }
    .footer-btn:hover {
      background-color: ${globalData?.buttons?.primaryHoverBg ? formatColor(globalData.buttons.primaryHoverBg) : '#1D4ED8'};
      color: ${globalData?.buttons?.primaryHovertxt ? formatColor(globalData.buttons.primaryHovertxt) : '#FFFFFF'};
    }
    .footer-link {
      color: ${textColor ? `${formatColor(textColor)} !important` : globalData?.linksEffect?.linkColor ? formatColor(globalData.linksEffect.linkColor) : '#737373'};
      transition-duration: ${globalData?.linksEffect?.transitionDuration ? globalData.linksEffect.transitionDuration : 300}ms;
      text-decoration: ${globalData?.linksEffect?.underlineStyle && globalData.linksEffect.underlineStyle !== 'none' ? globalData.linksEffect.underlineStyle : 'none'};
    }
    .footer-link:hover {
      color: ${textColor ? `${formatColor(textColor)} !important` : globalData?.linksEffect?.hoverColor ? formatColor(globalData.linksEffect.hoverColor) : '#5a5a5a'};
      ${textColor ? 'opacity: 0.8;' : ''}
      ${globalData?.linksEffect?.hoverEffect && globalData.linksEffect.hoverEffect !== 'none' ? `text-decoration: ${globalData.linksEffect.hoverEffect};` : ''}
    }
  `;

  return (
    <>
      {globalData && <style>{dynamicStyles}</style>}
      <footer
        className="w-full ml-0 pt-[42px] md:ml-0 custom-footer"
        style={{ backgroundColor: backgroundColor, color: textColor }}
      >
        {/* --- TOP BAR (Logo & Socials) --- */}
        <div className="max-w-[100%] px-[7%] mx-auto pb-[42px] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-bold text-2xl tracking-wide">
            {logo?.asset?.url ? (
              <img
                src={logo.asset.url}
                style={{ width: logo.width ? `${logo.width}px` : 'auto' }}
                alt="Footer Logo"
                className="h-8 object-contain transition-all duration-500"
                loading="lazy"
              />
            ) : (
              storeName || 'Store'
            )}
          </div>

          {/* Social Icons matching the image */}
          {hasSocials && (
            <div className="flex items-center gap-5 text-[#23A6F0]">
              {socials.youtube && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:scale-110 transition-transform"
                >
                  <Youtube size={24} className="md:w-4 md:h-4" />
                </a>
              )}
              {socials.facebook && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:scale-110 transition-transform"
                >
                  <img
                    src={facebookLogo}
                    alt="Facebook"
                    style={{ height: '24px', width: '24px' }}
                  />
                </a>
              )}
               {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:scale-110 transition-transform"
                >
                  <img
                    src={instagramLogo}
                    alt="Instagram"
                    style={{ height: '24px', width: '24px' }}
                  />
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:scale-110 transition-transform"
                >
                   <img
                    src={twitterLogo}
                    alt="Twitter"
                    style={{ height: '24px', width: '24px' }}
                  />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="w-full px-[7%]">
          <hr className="border-[#E6E6E6] w-full" />
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="max-w-[100%] px-[7%] mx-auto py-[50px]">
          {variant === 'columns' ? (
            /* COLUMN LAYOUT */
            <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 gap-[40px] lg:grid-cols-6 gap-[80px]">
              {/* Sanity Dynamic Columns */}
              {columns?.map((col, i) => (
                <div
                  key={i}
                  className={`custom-footer flex flex-col gap-5 ${alignment === 'center' ? 'items-center text-center' : alignment === 'right' ? 'items-end text-right' : 'items-start text-left'}`}
                >
                  <h5
                    style={{
                      color: '#252B42',
                    }}
                  >
                    {col.title}
                  </h5>
                  <div className="custom-footer flex flex-col gap-[10px]">
                    {/* Passing the link item along with routing info */}
                    {col.links?.map((item, j) => (
                      <FooterLink
                        key={j}
                        item={item}
                        publicStoreDomain={publicStoreDomain}
                        localization={localization}
                        fontSize={fontSize}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Hardcoded Newsletter Form */}
              <div className="custom-footer flex flex-col lg:col-span-2">
                <h5
                  className='mb-[20px]'
                  style={{
                    color: '#252B42',
                  }}
                >
                  Get In Touch
                </h5>
                <div className="flex h-[58px] shadow-sm">
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="bg-[#F9F9F9] border border-[#E6E6E6] border-r-0 rounded-l text-[#737373] text-sm px-5 w-full outline-none focus:bg-white transition-colors"
                    style={{
                      borderTopRightRadius: '0px !important',
                      borderBottomRightRadius: '0px !important',
                    }}
                  />
                  <button
                    className="text-white px-6 rounded-r text-sm transition-opacity hover:opacity-90 footer-btn"
                    style={{
                      borderTopLeftRadius: '0px !important',
                      borderBottomLeftRadius: '0px !important',
                      borderTopRightRadius: '5px !important',
                      borderBottomRightRadius: '5px !important',
                    }}
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-[12px] text-[#737373] mt-[4px]">
                  Lore imp sum dolor Amit
                </p>
              </div>
            </div>
          ) : (
            /* HORIZONTAL / SIMPLE LAYOUT */
            <div className="flex flex-col items-center justify-center text-center gap-8">
              <div className="flex flex-wrap gap-8 justify-center">
                {links?.map((item, i) => (
                  <FooterLink
                    key={i}
                    item={item}
                    publicStoreDomain={publicStoreDomain}
                    localization={localization}
                    fontSize={fontSize}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- BOTTOM BAR (Copyright) --- */}
        <div
          className="w-full py-[13px]"
          style={{ backgroundColor: backgroundColorCpr }}
        >
          <div className="max-w-[1550px] mx-auto px-6 flex justify-center md:justify-center">
            <p className="text-[#737373] custom-footer">
              {copyright || '© All rights reserved'}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

/* --- FOOTER LINK HELPER COMPONENT --- */
function FooterLink({
  item,
  publicStoreDomain,
  localization,
}) {
  const locale =
    localization?.language?.isoCode || localization?.country?.isoCode;

  // The data now comes in as { label: '...', link: { type: '...', ... } }
  const linkObj = item.link;
  const href = resolveLink(linkObj, publicStoreDomain, locale);
  const isExternal =
    linkObj?.type === 'external' ||
    (linkObj?.url && linkObj.url.startsWith('http'));

  return (
    <NavLink
      to={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`custom-footer transition-colors w-fit block footer-link`}
    >
      {item.label || 'Unnamed Link'}
    </NavLink>
  );
}

/* --- RESOLVE LINK HELPER (Copied from Header) --- */
function resolveLink(link, publicStoreDomain, locale) {
  if (!link || (!link.type && !link.route && !link.url)) return '/';

  if (link.type === 'external' || (link.url && link.url.startsWith('http'))) {
    return link.url || '/';
  }

  const baseLocale =
    locale && locale.length === 2 ? `/${locale.toLowerCase()}` : '';
  let path = '';

  if (link.type === 'route' || link.route) {
    path = link.route || '/';
  } else {
    const slug =
      link.page?.slug || link.collection?.slug || link.product?.slug || '';
    if (!slug) return '/';

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
        path = '/';
    }
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath.startsWith(baseLocale) && baseLocale !== '') return cleanPath;

  return `${baseLocale}${cleanPath}`.replace(/\/+/g, '/');
}

/* --- SVG Icons --- */
const FacebookIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22.675 0H1.325C0.593 0 0 0.593 0 1.325V22.676C0 23.407 0.593 24 1.325 24H12.82V14.706H9.692V11.084H12.82V8.413C12.82 5.313 14.713 3.625 17.479 3.625C18.804 3.625 19.942 3.724 20.274 3.768V7.008L18.356 7.009C16.852 7.009 16.561 7.724 16.561 8.862V11.085H20.148L19.681 14.707H16.561V24H22.677C23.407 24 24 23.407 24 22.675V1.325C24 0.593 23.407 0 22.675 0Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.953 4.57009C23.0545 4.96569 22.0949 5.22684 21.0964 5.35017C22.1388 4.73024 22.9234 3.75133 23.2985 2.58988C22.3364 3.16143 21.2723 3.56842 20.1479 3.7915C19.2312 2.81223 17.9304 2.21777 16.4957 2.21777C13.7383 2.21777 11.5037 4.45239 11.5037 7.20977C11.5037 7.60107 11.5478 7.98144 11.6322 8.34789C7.4842 8.13963 3.82498 6.15579 1.39174 3.19777C0.962057 3.93512 0.716183 4.79246 0.716183 5.70588C0.716183 7.43853 1.59792 8.96277 2.93475 9.85608C2.11217 9.82998 1.33968 9.60455 0.672808 9.23414V9.29686C0.672808 11.7226 2.39956 13.7467 4.69344 14.2081C4.27453 14.3221 3.83411 14.382 3.38048 14.382C3.0588 14.382 2.74472 14.3509 2.44106 14.2917C3.07869 16.2801 4.92558 17.7274 7.11545 17.7677C5.4057 19.1085 3.25056 19.9077 0.908076 19.9077C0.504938 19.9077 0.106822 19.884 0 19.8369C2.12817 21.2016 4.65471 22.0008 7.35987 22.0008C16.1916 22.0008 21.0205 14.6853 21.0205 8.34141C21.0205 8.13315 21.0157 7.92589 21.006 7.72063C21.9442 7.04362 22.7668 6.19522 23.4214 5.22814C22.56 5.61058 21.6373 5.86241 20.671 5.97607C21.6575 5.38541 22.4158 4.44855 22.7719 3.32837L23.953 4.57009Z" />
  </svg>
);
