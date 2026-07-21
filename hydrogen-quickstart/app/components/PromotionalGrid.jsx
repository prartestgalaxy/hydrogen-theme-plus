import {Link} from '~/components/Link';
import {useState} from 'react';
import No_image from '../assets/No_image.jpg';

// Helper to ensure hex has a #
const formatColor = (color) => {
  if (!color) return null;
  const strColor = String(color);
  return strColor.startsWith('#') ? strColor : `#${strColor}`;
};

// Robust helper for RGBA
function hexToRGBA(hex, opacity) {
  const cleanHex = hex ? hex.toString().replace('#', '') : '3191ca';
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default function PromotionalGrid({module, globalSettingsData}) {
  if (!module?.cards?.length) return null;

  // console.log("module: ", module);

  // console.log("globalSettingsData: ", globalSettingsData);

  const {theme, cards} = module || {};
  const count = cards?.length || 0;

  const gridClasses =
    {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2',
      4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
    }[count] || 'grid-cols-1';

  const dynamicStyles = `
    .promo-grid-section {
      background-color: ${theme?.bg ? formatColor(theme.bg) : '#ffffff'};
      font-family: ${globalSettingsData?.fontFamily ? globalSettingsData.fontFamily : 'Montserrat, sans-serif'};
    }
    .promo-card-heading {
      font-family: ${globalSettingsData?.fontFamily ? globalSettingsData.fontFamily : 'Montserrat, sans-serif'};
      font-size: ${globalSettingsData?.headingSizes?.h4 ? globalSettingsData.headingSizes.h4 + 'px' : '20px'};
      color: #ffffff;
      font-weight: 700;
      font-style: Bold;
      leading-trim: NONE;
      line-height: 33.49px;
      letter-spacing: 0.1px;

    }
    .promo-card-btn {
      font-family: ${globalSettingsData?.fontFamily ? globalSettingsData.fontFamily : 'Montserrat, sans-serif'};
      font-size: ${globalSettingsData?.baseFontSize ? globalSettingsData?.baseFontSize + 'px' : '14px'};
      font-weight: 700;
      leading-trim: NONE;
      line-height: 23.02px;
      letter-spacing: 0.21px;
      color: ${globalSettingsData?.buttons?.primaryText ? formatColor(globalSettingsData.buttons.primaryText) : '#ffffff'};
      border-radius: ${globalSettingsData?.buttons?.borderRadius !== undefined ? globalSettingsData.buttons.borderRadius + 'px' : '0px'};
    }
    .promo-card-btn:hover {
      background-color: ${globalSettingsData?.buttons?.primaryHoverBg ? formatColor(globalSettingsData.buttons.primaryHoverBg) : '#ffffff'};
      color: ${globalSettingsData?.buttons?.primaryHovertxt ? formatColor(globalSettingsData.buttons.primaryHovertxt) : '#000000'};
      border-color: ${globalSettingsData?.buttons?.primaryHoverBg ? formatColor(globalSettingsData.buttons.primaryHoverBg) : '#ffffff'};
    }
  `;


  return (
    <section className="promo-grid-section w-full max-w-[100%] px-[7%] mx-auto py-[80px]">
      <style>{dynamicStyles}</style>
      <div className={`grid gap-4 md:gap-[15.7px] ${gridClasses}`}>
        {cards?.map((card, index) => {
          const isFirstOfThree = count === 3 && index === 0;

          const hasModuleColor = !!card?.cardBg;
          const themeColor =
            formatColor(card?.cardBg) ||
            formatColor(globalSettingsData?.buttons?.primaryBg) ||
            '#3191ca';

          const overlayBg = hexToRGBA(themeColor, 0.75);
          const headingColor = formatColor(card?.headingColor) || '#ffffff';
          // console.log("card?.headingColor: ", card?.headingColor);
          // console.log("headingColor changed: ", headingColor);

          return (
            <div
              key={card?._key}
              className={`relative overflow-hidden group min-h-[350px] ${
                isFirstOfThree
                  ? 'md:row-span-2 md:h-full'
                  : 'h-[350px] md:h-auto'
              }`}
            >
              <img
                src={card?.imageUrl ? card.imageUrl : No_image}
                alt={card?.heading || 'No image available'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div
                style={{backgroundColor: overlayBg}}
                className="absolute bottom-0 left-0 p-8 w-full sm:w-auto sm:min-w-[320px] backdrop-blur-md"
                className="absolute bottom-0 left-0 p-[30px] w-full max-w-[400px] h-full max-h-[180px] "
              >
                <h4
                  className={`promo-card-heading font-bold mb-5 ${card?.headingSize || ''}`}
                  style={{
                    lineHeight: '34px',
                    letterSpacing: '0.1px',
                    color: headingColor,
                    ...(card?.headingSize ? {} : {}),
                  }}
                  className={`promo-card-heading  mb-5 ${card?.headingSize || ''}`}
                  
                >
                  {card?.heading}
                </h4>
                <RenderButton
                  cta={card}
                  globalSettings={globalSettingsData}
                  themeColor={themeColor}
                  forceModuleStyle={hasModuleColor}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RenderButton({cta, globalSettings, themeColor, forceModuleStyle}) {
  const [isHovered, setIsHovered] = useState(false);

  const linkData = cta?.link?.[0];
  let url = '/';
  if (linkData?._type === 'linkExternal') {
    url = linkData?.url || '/';
  } else if (linkData?.reference) {
    const type = linkData?.reference?._type;
    const slug = linkData?.reference?.slug || linkData?.reference?.pageSlug;
    if (slug) {
      const prefix = type?.toLowerCase().includes('product')
        ? 'products'
        : type?.toLowerCase().includes('collection')
          ? 'collections'
          : 'pages';
      url = `/${prefix}/${slug}`;
    }
  }

  const globalHoverBg = formatColor(globalSettings?.buttons?.primaryHoverBg);
  const globalHoverText = formatColor(globalSettings?.buttons?.primaryHovertxt);

  let finalHoverBg;
  let finalHoverText;

  if (forceModuleStyle) {
    finalHoverBg = '#ffffff';
    finalHoverText = themeColor;
  } else if (globalHoverBg && globalHoverText) {
    finalHoverBg = globalHoverBg;
    finalHoverText = globalHoverText;
  } else {
    finalHoverBg = '#ffffff';
    finalHoverText = themeColor;
  }

  return (
    <Link
      to={url}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="promo-card-btn inline-block border border-white/40 px-[41.86px] py-[15.7px] text-[14px] font-bold uppercase tracking-[0.25em] transition-all duration-300 leading-[23.02px]"
      className="promo-card-btn inline-block border border-white/40 px-[40px] py-[16px] w-full uppercase max-w-fit transition-all duration-300"
      style={{
        backgroundColor: isHovered ? finalHoverBg : 'transparent',
        color: isHovered ? finalHoverText : undefined,
        borderColor: isHovered ? finalHoverBg : '#FFFFFF',
        // borderRadius: '5px !important', 
        letterSpacing: '0.21px',
      }}
    >
      {cta?.ctaText || 'Explore Items'}
    </Link>
  );
}