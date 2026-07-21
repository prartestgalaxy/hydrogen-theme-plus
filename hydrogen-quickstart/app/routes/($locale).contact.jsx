import {useLoaderData, useRouteLoaderData} from 'react-router';
import {useState, useEffect} from 'react';
import {CONTACT_PAGE_QUERY} from '~/sanity/queries/contactPage';
import {Link} from '~/components/Link';
import {PageLayout} from '~/components/PageLayout';
import No_Image from '../assets/No_image.jpg';

// --- 1. PROFESSIONAL SVG ICON HELPER ---
const SvgIcon = ({icon, className = 'w-8 h-8'}) => {
  const icons = {
    phone: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        className={className}
      >
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
      </svg>
    ),
    envelope: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        className={className}
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <path d="M22 6l-10 7L2 6"></path>
      </svg>
    ),
    'map-pin': (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        className={className}
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
    twitter: (
      <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
    facebook: (
      <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    instagram: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        className={className}
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
      </svg>
    ),
    linkedin: (
      <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  };

  return icons[icon] || icons['map-pin'];
};

// --- 2. LOADER FUNCTION ---
export async function loader({context}) {
  const {sanityClient} = context;
  const page = await sanityClient.fetch(CONTACT_PAGE_QUERY);

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

// --- 3. MAIN ROUTE COMPONENT ---
export default function ContactRoute() {
  const {page} = useLoaderData();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const rootData = useRouteLoaderData('root');
  const GlobalSettings = rootData?.globalSettings;

  // Module-level overrides (first priority, applied with !important to win over global)
  // GlobalSettings values are the fallback (no !important)
  const dynamicStyles = `
    .contact-page {
      font-family: ${GlobalSettings?.fontFamily ? GlobalSettings.fontFamily : 'Montserrat, sans-serif'};
      font-size: ${GlobalSettings?.baseFontSize ? GlobalSettings.baseFontSize : 16}px;
    }
    .contact-page h1 { font-size: ${GlobalSettings?.headingSizes?.h1 ? GlobalSettings.headingSizes.h1 : 42}px; }
    .contact-page h2 { font-size: ${GlobalSettings?.headingSizes?.h2 ? GlobalSettings.headingSizes.h2 : 40}px; }
    .contact-page h3 { font-size: ${GlobalSettings?.headingSizes?.h3 ? GlobalSettings.headingSizes.h3 : 32}px; }
    .contact-page h4 { font-size: ${GlobalSettings?.headingSizes?.h4 ? GlobalSettings.headingSizes.h4 : 24}px; }
    .contact-page h5 { font-size: ${GlobalSettings?.headingSizes?.h5 ? GlobalSettings.headingSizes.h5 : 20}px; }
    .contact-page h6 { font-size: ${GlobalSettings?.headingSizes?.h6 ? GlobalSettings.headingSizes.h6 : 16}px; }

    .btn-primary {
      background-color: ${GlobalSettings?.buttons?.primaryBg ? formatColor(GlobalSettings.buttons.primaryBg) : '#23A6F0'};
      color: ${GlobalSettings?.buttons?.primaryText ? formatColor(GlobalSettings.buttons.primaryText) : '#FFFFFF'};
      border-radius: ${GlobalSettings?.buttons?.borderRadius != null && GlobalSettings?.buttons?.borderRadius !== '' ? GlobalSettings.buttons.borderRadius : 8}px;
    }
    .btn-primary:hover {
      background-color: ${GlobalSettings?.buttons?.primaryHoverBg ? formatColor(GlobalSettings.buttons.primaryHoverBg) : '#1D4ED8'};
      color: ${GlobalSettings?.buttons?.primaryHovertxt ? formatColor(GlobalSettings.buttons.primaryHovertxt) : '#FFFFFF'};
    }

    .contact-link {
      color: ${GlobalSettings?.linksEffect?.linkColor ? formatColor(GlobalSettings.linksEffect.linkColor) : '#737373'};
      transition-duration: ${GlobalSettings?.linksEffect?.transitionDuration != null && GlobalSettings?.linksEffect?.transitionDuration !== '' ? GlobalSettings.linksEffect.transitionDuration : 300}ms;
      text-decoration: ${(GlobalSettings?.linksEffect?.underlineStyle ? GlobalSettings.linksEffect.underlineStyle : 'none') === 'always' ? 'underline' : 'none'};
    }
    .contact-link:hover {
      color: ${GlobalSettings?.linksEffect?.hoverColor ? formatColor(GlobalSettings.linksEffect.hoverColor) : '#5a5a5a'};
      ${(GlobalSettings?.linksEffect?.hoverEffect ? GlobalSettings.linksEffect.hoverEffect : 'none') === 'underline' ? 'text-decoration: underline;' : ''}
    }
  `;

  return (
    <PageLayout>
      <div className="min-h-screen contact-page">
        <style>{dynamicStyles}</style>
        <ContactPage
          page={page}
          openPopup={() => setIsPopupOpen(true)}
          GlobalSettings={GlobalSettings}
        />
        {page.ctaEnabled && (
          <PopupForm
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            overline={page.popupOverline}
            heading={page.popupHeading}
            body={page.popupBody}
            buttonText={page.popupButtonText}
            GlobalSettings={GlobalSettings}
          />
        )}
      </div>
    </PageLayout>
  );
}

// --- 4. CONTACT PAGE LAYOUT COMPONENT ---
function ContactPage({page, openPopup, GlobalSettings}) {
  const {
    heroLayout,
    heroImage,
    heroOverline,
    heroHeading,
    heroHeadingSize,
    heroAlignment,
    heroBody,
    heroContactInfo,
    heroSocialLinks,
    infoOverline,
    infoHeading,
    infoCards,
    ctaEnabled,
    ctaImage,
    ctaOverline,
    ctaHeading,
    ctaButtonText,
  } = page;

  const isImageRight = heroLayout === 'right';

  return (
    <div className="container mx-auto px-6 lg:px-12 pt-20 pb-24 space-y-32">
      {/* --- HERO SECTION --- */}
      <section
        className={`grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center`}
      >
        <div
          className={`flex flex-col gap-y-[35px] ${heroAlignment || 'text-left'}`}
          style={{
            order: isImageRight ? 1 : 2,
          }}
        >
          <div className="flex flex-col gap-[35px]">
            {heroOverline && (
              <p className="text-[16px] tracking-[0.1px] font-bold text-[#252B42] uppercase leading-[24px]">
                {heroOverline}
              </p>
            )}
            {/* Module heroHeadingSize is first priority; GlobalSettings h1 from dynamicStyles is fallback */}
            <h1
              className={`${heroHeadingSize || 'text-5xl md:text-[58px]'} font-extrabold text-[#252B42] leading-[1.1] tracking-tight`}
              style={{
                lineHeight: '80px',
                letterSpacing: '0.2px',
                fontWeight: '700'
              }}
            >
              {heroHeading || 'Get in touch today!'}
            </h1>
            {heroBody && (
              <p
                className={`text-[20px] text-[#737373] ${heroAlignment == 'text-left' && 'max-w-md'} leading-[30px] tracking-[0.2px] font-normal`}
              >
                {heroBody}
              </p>
            )}
          </div>

          {heroContactInfo && (
            <div className="flex flex-col gap-[20px] text-[24px] font-bold text-[#252B42] tracking-wide">
              {heroContactInfo.phone && (
                <p className="text-[24px] leading-[32px] tracking-[0.1px]">Phone : {heroContactInfo.phone}</p>
              )}
              {heroContactInfo.fax && (
                <p className="text-[24px] leading-[32px] tracking-[0.1px]">Fax : {heroContactInfo.fax}</p>
              )}
            </div>
          )}

          {heroSocialLinks && (
            <div
              className={`flex gap-[34px] items-center text-[#252B42]`}
              style={{
                justifyContent:
                  heroAlignment === 'text-center'
                    ? 'center'
                    : heroAlignment === 'text-right'
                      ? 'flex-end'
                      : 'flex-start',
              }}
            >
              {heroSocialLinks.map((item) => (
                <Link
                  key={item._key}
                  to={item.link?.[0]?.url || '#'}
                  className="contact-link hover:opacity-80 transition-opacity"
                  external
                >
                  <SvgIcon icon={item.platform} className="w-[30px] h-[30px]" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div
          className="relative w-full flex justify-center lg:justify-end"
          style={{
            order: isImageRight ? 2 : 1,
          }}
        >
          {heroImage?.asset?.url ? (
            <img
              src={heroImage.asset.url}
              alt={heroImage.alt || 'Contact Hero'}
              className="object-cover w-full max-w-[600px] h-auto"
              loading="eager"
            />
          ) : (
            <img
              src={No_Image}
              alt={heroImage?.alt || 'Contact Hero'}
              className="object-cover w-full max-w-[600px] h-auto"
              loading="eager"
            />
          )}
        </div>
      </section>

      {/* --- INFO SECTION --- */}
      <section
        className="text-center py-28 flex flex-col gap-y-[80px]"
        style={{
          margin: '0 auto',
        }}
      >
        <div className="flex flex-col gap-[10px] max-w-2xl mx-auto">
          {infoOverline && (
            <p className="text-sm font-bold text-[#737373] uppercase leading-[24px] tracking-[0.2px]">
              {infoOverline}
            </p>
          )}
          <h2 className="text-[40px] font-extrabold text-[#252B42] leading-[50px] tracking-[0.2px]">
            {infoHeading || 'We help small businesses with big ideas'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-5xl mx-auto items-center">
          {infoCards &&
            infoCards.map((card, index) => {
              const isMiddleCard = index === 1;
              return (
                <div
                  key={card._key}
                  className={`flex flex-col items-center gap-[15px] px-[40px] py-[50px] transition-all duration-300 ${
                    isMiddleCard
                      ? 'bg-[#252B42] text-white shadow-2xl z-10 scale-105 md:py-20'
                      : 'bg-white text-[#252B42]'
                  }`}
                >
                  <div className="text-[#23A6F0]">
                    <SvgIcon icon={card.icon} className="w-[72px] h-[72px]" />
                  </div>

                  <p
                    className={`text-[14px] font-bold ${isMiddleCard ? 'text-white' : 'text-[#252B42]'} leading-[24px] tracking-[0.2px]`}
                  >
                    {card.label}
                  </p>
                  <p
                    className={`text-sm lg:text-[14px] leading-[24px] tracking-[0.2px] font-bold ${isMiddleCard ? 'text-white' : 'text-[#252B42]'}`}
                  >
                    {card.details}
                  </p>

                  {card.button && (
                    <div className="pt-4">
                      <Link
                        to={card.button.link?.[0]?.url || '/'}
                        className={`inline-block px-[36px] py-[15px] font-bold rounded-full transition-colors ${
                          isMiddleCard
                            ? 'border border-[#23A6F0] text-[#23A6F0] hover:bg-[#23A6F0] hover:text-white'
                            : 'bg-[#252B42] text-white hover:bg-[#1a1f2f]'
                        }`}
                        style={{
                          fontSize: '14px',
                          lineHeight: '24px',
                          letterSpacing: '0.2px',
                        }}
                      >
                        {card.button.text}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </section>

      {/* --- LET'S TALK CTA SECTION --- */}
      {ctaEnabled && (
        <section
          className="text-center py-[80px] relative"
          style={{
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div className="flex justify-center text-[#23A6F0] absolute top-[6%] left-1/2 -translate-x-1/2 -translate-y-1/2">
            {ctaImage?.asset?.url ? (
              <img
                src={ctaImage.asset.url}
                alt="CTA Icon"
                className="w-16 h-16 object-contain"
              />
            ) : (
              // Fallback Arrow SVG if image not uploaded
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="w-16 h-16 rotate-45"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            )}
          </div>

          <div className="max-w-2xl mx-auto">
            {ctaOverline && (
              <p className="text-[16px] font-bold text-[#252B42] uppercase tracking-widest">
                {ctaOverline}
              </p>
            )}
          </div>
            <h2 className="text-[58px] font-extrabold text-[#252B42] tracking-tight">
              {ctaHeading || "Let's Talk"}
            </h2>

          <div className="">
            <button
              onClick={openPopup}
              className={`px-10 py-4 btn-primary text-[14px] font-bold rounded transition-colors shadow-md`}
            >
              {ctaButtonText || 'Try it free now'}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

// --- 5. POPUP FORM COMPONENT ---
function PopupForm({isOpen, onClose, heading, buttonText}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const inputClasses =
    'w-full px-4 py-3 bg-[#F9F9F9] border border-[#E6E6E6] rounded text-[14px] text-[#737373] placeholder:text-[#737373] focus:outline-none focus:border-[#23A6F0]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[500px] bg-white rounded-lg shadow-2xl p-8 sm:p-12 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#737373] hover:text-[#252B42] p-2 bg-gray-100 rounded-full transition-colors"
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        <div className="space-y-2 mb-8">
          <p className="text-[14px] font-bold text-[#252B42]">Let's Talk</p>
          <h2 className="text-[32px] font-extrabold text-[#252B42] leading-tight">
            {heading || 'Make an Appointment'}
          </h2>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Full Name *"
              className={inputClasses}
              required
            />
            <input
              type="email"
              placeholder="Email *"
              className={inputClasses}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <select className={inputClasses} required defaultValue="">
              <option value="" disabled>
                Please Select
              </option>
              <option value="consultation">Consultation</option>
              <option value="support">Support</option>
              <option value="other">Other</option>
            </select>

            <select className={inputClasses} required defaultValue="">
              <option value="" disabled>
                4:00 Available
              </option>
              <option value="morning">Morning (9am - 12pm)</option>
              <option value="afternoon">Afternoon (1pm - 5pm)</option>
              <option value="evening">Evening (6pm - 8pm)</option>
            </select>
          </div>

          <textarea
            placeholder="Message"
            className={`${inputClasses} min-h-[120px] resize-none`}
          />

          <button
            type="submit"
            className="w-full px-8 py-4 bg-[#23A6F0] text-white font-bold rounded hover:bg-blue-500 transition shadow-md"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            {buttonText || 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
