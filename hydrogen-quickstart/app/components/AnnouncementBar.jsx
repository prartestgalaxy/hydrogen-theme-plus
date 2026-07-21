// import { useState } from 'react';
// import {
//   Phone,
//   Mail,
//   Instagram,
//   Youtube,
//   Facebook,
//   Twitter
// } from 'lucide-react';

// export function AnnouncementBar({ bar }) {
//   const [isVisible, setIsVisible] = useState(true);

//   if (!bar || !isVisible) return null;

//   const {
//     text,
//     phoneNumber,
//     email,
//     socials,
//     backgroundColor,
//     textColor,
//     fontSize,
//     fontWeight,
//     showCloseButton,
//   } = bar;

//   // Check if any social links actually exist
//   const hasSocials = socials && Object.values(socials).some(link => !!link);

//   const barStyles = {
//     backgroundColor: backgroundColor || '#252B42',
//     color: textColor || '#fff',
//   };

//   return (
//     <div style={barStyles} className='w-full'>
//     <div
//       className={`w-full max-w-[100%] px-[7%] mx-auto py-3 hidden md:flex justify-between items-center  z-[80] ${fontSize} ${fontWeight}`}
//     >

//       {/* LEFT SIDE: CONTACT */}
//       <div className="flex-1 flex justify-start items-center gap-6 flex-1">
//         {phoneNumber && (
//           <a href={`tel:${phoneNumber}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
//             <Phone size={14} />
//             <span>{phoneNumber}</span>
//           </a>
//         )}
//         {email && (
//           <a href={`mailto:${email}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
//             <Mail size={14} />
//             <span>{email}</span>
//           </a>
//         )}
//       </div>

//       {/* CENTER: ANNOUNCEMENT */}
//       <div className="flex-1 text-center">
//         <p>{text}</p>
//       </div>

//       {/* RIGHT SIDE: SOCIALS (Conditional Rendering) */}
//       <div className="flex-1 flex justify-end items-center justify-end gap-4 flex-1">
//         {hasSocials && (
//           <>
//             <span className="mr-2">Follow Us :</span>
//             <div className="flex items-center gap-3">
//               {socials.instagram && (
//                 <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
//                   <Instagram size={16} />
//                 </a>
//               )}
//               {socials.youtube && (
//                 <a href={socials.youtube} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
//                   <Youtube size={16} />
//                 </a>
//               )}
//               {socials.facebook && (
//                 <a href={socials.facebook} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
//                   <Facebook size={16} />
//                 </a>
//               )}
//               {socials.twitter && (
//                 <a href={socials.twitter} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
//                   <Twitter size={16} />
//                 </a>
//               )}
//             </div>
//           </>
//         )}

//         {/* CLOSE BUTTON (Moved inside the right flex container to maintain spacing) */}
//         {showCloseButton && (
//           <button
//             onClick={() => setIsVisible(false)}
//             className="ml-4 p-1 hover:opacity-70 transition-opacity"
//             aria-label="Close"
//           >
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M18 6 6 18M6 6l12 12" />
//             </svg>
//           </button>
//         )}
//       </div>
//     </div>
//     </div>
//   );
// }

// import { useState } from 'react';
// import {
//   Phone,
//   Mail,
//   Instagram,
//   Youtube,
//   Facebook,
//   Twitter
// } from 'lucide-react';

// export function AnnouncementBar({ bar }) {
//   const [isVisible, setIsVisible] = useState(true);

//   if (!bar || !isVisible) return null;

//   const {
//     text,
//     phoneNumber,
//     email,
//     socials,
//     backgroundColor,
//     textColor,
//     fontSize,
//     fontWeight,
//     showCloseButton,
//   } = bar;

//   // Check if any social links actually exist
//   const hasSocials = socials && Object.values(socials).some(link => !!link);

//   const barStyles = {
//     backgroundColor: backgroundColor || '#252B42',
//     color: textColor || '#fff',
//   };

//   return (
//     <div style={barStyles} className="w-full relative">
//       <div
//         // Changed to flex-col for mobile, scaled down paddings and base text size
//         className={`w-full max-w-[100%] md:px-[7%] px-4 mx-auto py-2 md:py-3 flex flex-col md:flex-row justify-between items-center gap-1.5 md:gap-0 z-[80] text-[11px] md:text-sm ${fontSize || ''} ${fontWeight || ''}`}
//       >

//         {/* LEFT SIDE: CONTACT */}
//         {/* Adjusted gaps for mobile, shifted to order-2 on mobile so announcement is first */}
//         <div className="w-full md:flex-1 flex justify-center md:justify-start items-center gap-3 md:gap-6 order-2 md:order-1">
//           {phoneNumber && (
//             <a href={`tel:${phoneNumber}`} className="flex items-center gap-1.5 md:gap-2 hover:opacity-80 transition-opacity">
//               {/* Replaced fixed size prop with responsive Tailwind classes */}
//               <Phone className="w-3 h-3 md:w-[14px] md:h-[14px]" />
//               <span>{phoneNumber}</span>
//             </a>
//           )}
//           {email && (
//             <a href={`mailto:${email}`} className="flex items-center gap-1.5 md:gap-2 hover:opacity-80 transition-opacity">
//               <Mail className="w-3 h-3 md:w-[14px] md:h-[14px]" />
//               <span>{email}</span>
//             </a>
//           )}
//         </div>

//         {/* CENTER: ANNOUNCEMENT */}
//         <div className="w-full md:flex-1 text-center order-1 md:order-2">
//           <p>{text}</p>
//         </div>

//         {/* RIGHT SIDE: SOCIALS */}
//         {/* Removed duplicate flex-1 and justify-end classes, adjusted spacing */}
//         <div className="w-full md:flex-1 flex justify-center md:justify-end items-center gap-2 md:gap-4 order-3">
//           {hasSocials && (
//             <>
//               <span className="mr-1 md:mr-2">Follow Us :</span>
//               <div className="flex items-center gap-2.5 md:gap-3">
//                 {socials.instagram && (
//                   <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
//                     <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4" />
//                   </a>
//                 )}
//                 {socials.youtube && (
//                   <a href={socials.youtube} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
//                     <Youtube className="w-3.5 h-3.5 md:w-4 md:h-4" />
//                   </a>
//                 )}
//                 {socials.facebook && (
//                   <a href={socials.facebook} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
//                     <Facebook className="w-3.5 h-3.5 md:w-4 md:h-4" />
//                   </a>
//                 )}
//                 {socials.twitter && (
//                   <a href={socials.twitter} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
//                     <Twitter className="w-3.5 h-3.5 md:w-4 md:h-4" />
//                   </a>
//                 )}
//               </div>
//             </>
//           )}

//           {/* CLOSE BUTTON */}
//           {/* Made absolute on mobile so it stays neatly in the top right without breaking flex centering */}
//           {showCloseButton && (
//             <button
//               onClick={() => setIsVisible(false)}
//               className="absolute top-1.5 right-3 md:static md:ml-4 p-1 hover:opacity-70 transition-opacity"
//               aria-label="Close"
//             >
//               <svg className="w-3.5 h-3.5 md:w-[14px] md:h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M18 6 6 18M6 6l12 12" />
//               </svg>
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import {useState} from 'react';
import {
  Phone,
  Mail,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  X,
} from 'lucide-react';

export function AnnouncementBar({bar, globalData}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!bar || !isVisible) return null;

  const {
    text,
    phoneNumber,
    email,
    socials,
    backgroundColor,
    textColor,
    fontSize,
    fontWeight,
    showCloseButton,
  } = bar;

  // console.log("announcement bar", bar);

  const hasSocials = socials && Object.values(socials).some((link) => !!link);

  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  const fontStyle = globalData?.fontFamily
    ? globalData.fontFamily
    : 'Montserrat, sans-serif';

  const dynamicStyles = globalData
    ? `
    .announcement-bar-container {
      font-family: ${fontStyle};
    }
    .announcement-link {
      transition-duration: ${globalData?.linksEffect?.transitionDuration ? globalData.linksEffect.transitionDuration : 300}ms;
      text-decoration: ${globalData?.linksEffect?.underlineStyle && globalData.linksEffect.underlineStyle !== 'none' ? globalData.linksEffect.underlineStyle : 'none'};
    }
    .announcement-link:hover {
      color: ${globalData?.linksEffect?.hoverColor ? formatColor(globalData.linksEffect.hoverColor) : 'inherit'};
      ${globalData?.linksEffect?.hoverEffect && globalData.linksEffect.hoverEffect !== 'none' ? `text-decoration: ${globalData.linksEffect.hoverEffect};` : ''}
    }
  `
    : '';

  return (
    <>
      {globalData && <style>{dynamicStyles}</style>}
      <div
        style={{
          backgroundColor: backgroundColor || '#252B42',
          color: textColor || '#fff',
          // height: '58px'
        }}
        className="w-full h-auto min-h-[58px] relative z-[49] transition-all duration-300 py-[6px] announcement-bar-container"
      >
        <div
          /* Re-applied your exact width and 7% padding */
          className={`w-full max-w-[100%] md:px-[7%] px-4 mx-auto py-2 md:py-[10px] flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0 ${fontSize || ''} ${fontWeight || ''}`}
        >
          {/* LEFT SIDE: CONTACT INFO */}
          {/* order-2 puts this below the announcement on mobile. whitespace-nowrap prevents the 3-line error */}
          <div className="w-full md:flex-1 flex justify-center md:justify-start items-center gap-[10px] order-2 md:order-1 whitespace-nowrap">
            {phoneNumber && (
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center gap-[5px]  hover:opacity-80 transition-opacity text-[10px] sm:text-[11px] md:text-sm font-bold leading-6 announcement-link tracking-[0.2px]"
              >
                <Phone size={14} strokeWidth={2.5} className="flex-shrink-0" />
                <span className="leading-6"
                 style={{
                  letterSpacing: '0.2px'
                 }}
                >{phoneNumber}</span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-[5px] hover:opacity-80 transition-opacity text-[10px] sm:text-[11px] md:text-sm font-bold leading-6 announcement-link"
              >
                <Mail size={14} strokeWidth={2.5} className="flex-shrink-0" />
                <span className="hidden sm:inline leading-6"
                 style={{
                  letterSpacing: '0.2px'
                 }}
                >{email}</span>
              </a>
            )}
          </div>

          {/* CENTER: ANNOUNCEMENT */}
          {/* order-1 puts this at the TOP on mobile */}
          <div className="w-full md:flex-1 text-center order-1 md:order-2">
            <p className="text-[11px] sm:text-[12px] md:text-sm font-bold tracking-tight px-1"
             style={{
              letterSpacing: '0.2px',
              lineHeight: '24px'
             }}
            >
              {text}
            </p>
          </div>

          {/* RIGHT SIDE: SOCIALS */}
          <div className="w-full md:flex-1 flex justify-center md:justify-end items-center gap-3 md:gap-4 order-3">
            {hasSocials && (
              <div className="flex items-center gap-2.5 md:gap-3">
                <span className="hidden xl:block text-sm font-bold leading-6"
                 style={{
                  letterSpacing: '0.2px'
                 }}
                >
                  Follow Us :
                </span>
                <div className="flex items-center gap-3">
                  {socials.instagram && (
                    <a
                      href={socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:scale-110 transition-transform leading-6 announcement-link"
                    >
                      <Instagram size={14} className="md:w-4 md:h-4" />
                    </a>
                  )}
                  {socials.youtube && (
                    <a
                      href={socials.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:scale-110 transition-transform leading-6 announcement-link"
                    >
                      <Youtube size={14} className="md:w-4 md:h-4" />
                    </a>
                  )}
                  {socials.facebook && (
                    <a
                      href={socials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:scale-110 transition-transform leading-6 announcement-link"
                    >
                      <Facebook size={14} className="md:w-4 md:h-4" />
                    </a>
                  )}
                  {socials.twitter && (
                    <a
                      href={socials.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:scale-110 transition-transform leading-6 announcement-link"
                    >
                      <Twitter size={14} className="md:w-4 md:h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* CLOSE BUTTON */}
            {showCloseButton && (
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-3 md:static md:ml-4 p-1 hover:bg-white/10 rounded-full transition-colors announcement-link"
                aria-label="Close"
              >
                <X size={14} className="md:w-4 md:h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
