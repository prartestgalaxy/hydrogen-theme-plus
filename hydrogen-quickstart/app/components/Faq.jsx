// import React from 'react';

// export default function FAQ({ module = {} ,activeCountry, globalSettingsData}) {

//   console.log("Module data : "+ JSON.stringify(module,null,2))
//   console.log("Global data : "+ JSON.stringify(globalSettingsData,null,2))

//   // 1. CREATE FALLBACK DATA EXACTLY LIKE YOUR MOCKUP
//   const DUMMY_FAQS = Array(6).fill({
//     question: 'the quick fox jumps over the lazy dog',
//     answer: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.'
//   });

//   if (module.enabled === false) return null;

//   const {
//     title = 'FAQ',
//     description = 'Problems trying to resolve the conflict between the two major realms of Classical physics',
//     titleAlign = 'center',
//     backgroundColor = '#252B42', // Updated default to dark theme
//     questionColor = '#FFFFFF',
//     answerColor = '#BDBDBD', // Lighter gray for readability on dark background
//     accentColor = '#23A6F0', // Blue from your mockup
//     maxWidth = 'max-w-5xl', // Increased for 2 columns
//     items = [],
//   } = module;

//   // 2. DETERMINE WHAT TO SHOW (Sanity data OR Fallback data)
//   const itemsToDisplay = items && items.length > 0 ? items : DUMMY_FAQS;
// const countryPrefix =
//   activeCountry && activeCountry.toLowerCase() !== 'us'
//     ? `/${activeCountry.toLowerCase()}`
//     : '';
//   return (
//     <section className="py-20 px-[7%]" style={{ backgroundColor }}>
//       <div className={`mx-auto max-w-[1550px]`}>

//         {/* Header section matching mockup */}
//         <header className="text-center mb-16 md:mb-24 flex flex-col items-center gap-4">
//           {title && (
//             <h2
//               className={`text-3xl md:text-4xl font-bold tracking-wide
//                 ${titleAlign === 'center' ? 'text-center' : titleAlign === 'right' ? 'text-right' : 'text-left'}
//               `}
//               style={{ color: questionColor }}
//             >
//               {title}
//             </h2>
//           )}
//           {description && (
//             <p
//               className="text-sm md:text-base max-w-lg text-center leading-relaxed"
//               style={{ color: answerColor }}
//             >
//               {description}
//             </p>
//           )}
//         </header>

//         {/* 2-Column Grid instead of Accordion */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-12">
//           {itemsToDisplay.map((item, index) => (
//             <div key={index} className="flex items-start gap-4 pr-0 md:pr-4">

//               {/* Blue Chevron Icon */}
//               <div className="shrink-0 mt-1 md:mt-1.5" style={{ color: accentColor }}>
//                 <svg
//                   className="w-5 h-5 md:w-6 md:h-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={3}
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                 </svg>
//               </div>

//               {/* Text Content */}
//               <div className="flex flex-col gap-2">
//                 <h3
//                   className="font-bold text-base md:text-lg leading-snug"
//                   style={{ color: questionColor }}
//                 >
//                   {item.question}
//                 </h3>
//                 <p
//                   className="text-sm md:text-sm leading-relaxed"
//                   style={{ color: answerColor }}
//                 >
//                   {item.answer}
//                 </p>
//               </div>

//             </div>
//           ))}
//         </div>

//         {/* Support Footer */}
//         <div className="mt-20 text-center font-medium" style={{ color: questionColor }}>
//           <p className="text-sm md:text-base">
//             Haven't got your answer?{' '}
//             <a
//               href={`${countryPrefix}/contact`}  // You can pass this via Sanity props later if needed
//               className="text-[#2DC071] hover:opacity-80 transition-opacity" // Green color from mockup
//             >
//               Contact our support
//             </a>
//           </p>
//         </div>

//       </div>
//     </section>
//   );
// }

// import React from 'react';

// export default function FAQ({ module = {}, activeCountry, globalSettingsData }) {

//   // --- HELPER TO ENSURE HEX HAS HASH ---
//   const ensureHexHash = (hex) => {
//     if (!hex) return hex;
//     return hex.startsWith('#') ? hex : `#${hex}`;
//   };

//   // 1. CREATE FALLBACK DATA EXACTLY LIKE YOUR MOCKUP
//   const DUMMY_FAQS = Array(6).fill({
//     question: 'the quick fox jumps over the lazy dog',
//     answer: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.'
//   });

//   if (module.enabled === false) return null;

//   const {
//     title = 'FAQ',
//     description = 'Problems trying to resolve the conflict between the two major realms of Classical physics',
//     titleAlign = 'center',
//     backgroundColor = '#252B42',
//     questionColor = '#FFFFFF',
//     answerColor = '#BDBDBD',
//     accentColor = '#23A6F0',
//     maxWidth = 'max-w-5xl',
//     items = [],
//     questionSize, // From module
//     answerSize,   // From module
//     titleSize     // From module
//   } = module;

//   // --- STYLING HIERARCHY LOGIC ---
//   const customFont = module.fontFamily || globalSettingsData?.fontFamily || 'Montserrat, sans-serif';

//   const styles = {
//     sectionBg: ensureHexHash(backgroundColor) || '#252B42',
//     titleColor: ensureHexHash(questionColor) || '#FFFFFF',
//     questionColor: ensureHexHash(questionColor) || '#FFFFFF',
//     answerColor: ensureHexHash(answerColor) || '#BDBDBD',
//     accentColor: ensureHexHash(accentColor) || '#23A6F0',

//     // Size Hierarchy: Module Class -> Global Px -> Image Default
//     title: {
//       fontSize: titleSize ? undefined : (globalSettingsData?.headingSizes?.h2 ? `${globalSettingsData.headingSizes.h2}px` : '40px'),
//     },
//     question: {
//       fontSize: questionSize ? undefined : (globalSettingsData?.headingSizes?.h6 ? `${globalSettingsData.headingSizes.h6}px` : '16px'),
//     },
//     answer: {
//       fontSize: answerSize ? undefined : (globalSettingsData?.baseFontSize ? `${globalSettingsData.baseFontSize}px` : '14px'),
//     }
//   };

//   const itemsToDisplay = items && items.length > 0 ? items : DUMMY_FAQS;

//   const countryPrefix =
//     activeCountry && activeCountry.toLowerCase() !== 'us'
//       ? `/${activeCountry.toLowerCase()}`
//       : '';

//   return (
//     <section
//       className="py-20 px-[7%]"
//       style={{ backgroundColor: styles.sectionBg, fontFamily: customFont }}
//     >
//       <div className={`mx-auto max-w-[1550px]`}>

//         {/* Header section matching mockup */}
//         <header className="text-center mb-16 md:mb-24 flex flex-col items-center gap-4">
//           {title && (
//             <h2
//               className={`font-bold tracking-wide ${titleSize || ''}
//                 ${titleAlign === 'center' ? 'text-center' : titleAlign === 'right' ? 'text-right' : 'text-left'}
//               `}
//               style={{
//                 color: styles.titleColor,
//                 fontSize: styles.title.fontSize
//               }}
//             >
//               {title}
//             </h2>
//           )}
//           {description && (
//             <p
//               className={`max-w-lg text-center leading-relaxed ${answerSize || ''}`}
//               style={{
//                 color: styles.answerColor,
//                 fontSize: styles.answer.fontSize
//               }}
//             >
//               {description}
//             </p>
//           )}
//         </header>

//         {/* 2-Column Grid matching mockup */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-12">
//           {itemsToDisplay.map((item, index) => (
//             <div key={index} className="flex items-start gap-4 pr-0 md:pr-4">

//               {/* Blue Chevron Icon */}
//               <div className="shrink-0 mt-1 md:mt-1.5" style={{ color: styles.accentColor }}>
//                 <svg
//                   className="w-5 h-5 md:w-6 md:h-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={3}
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                 </svg>
//               </div>

//               {/* Text Content */}
//               <div className="flex flex-col gap-2">
//                 <h3
//                   className={`font-bold leading-snug ${questionSize || ''}`}
//                   style={{
//                     color: styles.questionColor,
//                     fontSize: styles.question.fontSize
//                   }}
//                 >
//                   {item.question}
//                 </h3>
//                 <p
//                   className={`leading-relaxed ${answerSize || ''}`}
//                   style={{
//                     color: styles.answerColor,
//                     fontSize: styles.answer.fontSize
//                   }}
//                 >
//                   {item.answer}
//                 </p>
//               </div>

//             </div>
//           ))}
//         </div>

//         {/* Support Footer */}
//         <div className="mt-20 text-center font-medium" style={{ color: styles.questionColor }}>
//           <p className="text-sm md:text-base">
//             Haven't got your answer?{' '}
//             <a
//               href={`${countryPrefix}/contact`}
//               className="text-[#2DC071] hover:opacity-80 transition-opacity" // Green color from mockup
//               style={{ fontWeight: 'bold' }}
//             >
//               Contact our support
//             </a>
//           </p>
//         </div>

//       </div>
//     </section>
//   );
// }

import React, {useState, useEffect} from 'react';

export default function FAQ({module, globalSettingsData, activeCountry}) {
  if (!module || module.enabled === false) return null;

  const [mounted, setMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    title = 'FAQ',
    description,
    items = [],
    layoutType = 'grid',
    backgroundColor,
    itemBgColor,
    questionColor,
    answerColor,
    accentColor,
    maxWidth = 'max-w-3xl',
    itemPadding = 'normal',
    questionSize = '16',
    answerSize = '14',
    cardRadius = 'md',
    titleAlign = 'center',
    _key = 'faq-section',
  } = module;

  // console.log("faq module : ", module);
  // console.log("globalSettingsData: ", globalSettingsData);

  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  // --- STYLING HIERARCHY ---
  const fontStyle = globalSettingsData?.fontFamily || 'Montserrat, sans-serif';

  const colors = {
    sectionBg: formatColor(backgroundColor) || '#252B42',
    itemBg: formatColor(itemBgColor) || 'transparent',
    question:
      formatColor(questionColor) ||
      formatColor(globalSettingsData?.colors?.heading) ||
      '#FFFFFF',
    answer:
      formatColor(answerColor) ||
      formatColor(globalSettingsData?.colors?.text) ||
      '#BDBDBD',
    accent: formatColor(accentColor) || '#23A6F0',
  };

  const radiusMap = {none: '0px', md: '8px', lg: '16px', full: '9999px'};

  const accordionPadding = {
    compact: 'py-3 px-5 mb-3',
    normal: 'py-5 px-6 mb-4',
    spacious: 'py-8 px-10 mb-6',
  };

  const dynamicStyles = `
    .faq-${_key} { font-family: ${fontStyle}; background-color: ${colors.sectionBg}; }
    .faq-${_key} .faq-question-text { color: ${colors.question}; }
    .faq-${_key} .faq-answer-text { color: ${colors.answer}; }
    .faq-${_key} .faq-icon { color: ${colors.accent}; }

     .faq-${_key} .faq-question-text-size{
     font-family: ${fontStyle};
      font-size: ${questionSize ? questionSize : globalSettingsData?.headingSizes?.h5 ? globalSettingsData?.headingSizes?.h5 : '16'}px;
      font-weight: 700;
      leading-trim: NONE;
      line-height: 24px;
      letter-spacing: 0.1px;

     }

     .faq-${_key} .faq-answer-text-size{
     font-family: ${fontStyle};
      font-size: ${answerSize ? answerSize : globalSettingsData?.baseFontSize ? globalSettingsData?.baseFontSize : '14'}px;
      font-weight: 400;
      leading-trim: NONE;
      line-height: 20px;
      letter-spacing: 0.2px;

     }

     .faq-${_key} .section-header {
      font-family: ${fontStyle};
      font-size: ${globalSettingsData?.headingSizes?.h2 ? globalSettingsData?.headingSizes?.h2 : '40'}px;
      font-weight: 700;
      leading-trim: NONE;
      line-height: 50px;
      letter-spacing: 0.2px;
     }

     .faq-${_key} .section-description {
      font-family: ${fontStyle};
      font-size: ${globalSettingsData?.headingSizes?.h4 ? globalSettingsData?.headingSizes?.h4 : '20'}px;
      font-weight: 400;
      leading-trim: NONE;
      line-height: 30px;
      letter-spacing: 0.2px;

     }
    
    /* ACCORDION SPECIFIC BORDER & RADIUS */
    .faq-${_key} .accordion-item { 
       background-color: ${colors.itemBg}; 
       border-radius: ${radiusMap[cardRadius]};
       border: 1px solid ${colors.answer}33; /* Uses answer color with ~20% opacity for a subtle border */
       transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    .faq-${_key} .accordion-item:hover {
       border-color: ${colors.accent}88; /* Highlight border on hover */
    }

    @media (max-width: 768px) {
     .faq-${_key} .section-header {
     font-size:32px;
      }
     .faq-${_key} .section-description{
     font-size:16pxpx;
     }
    }

  `;

  const DUMMY_FAQS = Array(6).fill({
    question: 'the quick fox jumps over the lazy dog',
    answer:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
  });

  const itemsToDisplay = items?.length > 0 ? items : DUMMY_FAQS;

  return (
    <section className={`w-full faq-${_key} py-[80px] px-[7%]`}>
      <style dangerouslySetInnerHTML={{__html: dynamicStyles}} />

      <div className="mx-auto max-w-[1550px] w-full">
        {/* HEADER */}
        <header
          className={`mb-[50px] md:mb-[50px] flex flex-col gap-[10px] ${
            titleAlign === 'center'
              ? 'items-center text-center'
              : titleAlign === 'right'
                ? 'items-end text-right'
                : 'items-start text-left'
          }`}
        >
          <h2 className="section-header faq-question-text uppercase">
            {title}
          </h2>
          {description && (
            <h4 className="section-description faq-answer-text opacity-80 ">
              {description}
            </h4>
          )}
        </header>

        {/* LAYOUT LOGIC */}
        {layoutType === 'grid' ? (
          /* --- BROAD GRID LAYOUT --- */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[30px] lg:gap-x-[50px] gap-y-[30px] md:gap-y-[30px] w-full">
            {itemsToDisplay.map((item, index) => (
              <div key={index} className="flex items-start gap-5 w-full">
                {/* <div className="shrink-0 mt-1.5 faq-icon">
                  <svg className="w-[9px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div> */}
                <div className="shrink-0 mt-1.5 faq-icon">
                  <svg
                    className="w-[9px] h-[16px]"
                    fill="none"
                    viewBox="9 5 7 14"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-3">
                  <h5 className={`faq-question-text-size faq-question-text `}>
                    {item.question}
                  </h5>
                  <p
                    className={`faq-answer-text-size faq-answer-text opacity-90`}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* --- CENTERED ACCORDION LAYOUT WITH BORDERS --- */
          <div className={`mx-auto w-full ${maxWidth}`}>
            {itemsToDisplay.map((item, index) => (
              <div
                key={index}
                className={`accordion-item overflow-hidden ${accordionPadding[itemPadding]}`}
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between text-left transition-opacity hover:opacity-80"
                >
                  <span
                    className={`faq-question-text-size faq-question-text pr-4`}
                  >
                    {item.question}
                  </span>
                  <span
                    className={`faq-icon shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-90' : ''}`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </button>

                {/* Expandable Content */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openIndex === index
                      ? 'max-h-[1000px] mt-4 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className={`faq-answer-text faq-answer-text-size pb-2`}>
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUPPORT FOOTER */}
        <div className="mt-[30px] md:mt-[50px] text-center font-medium faq-question-text">
          <p className="text-base md:text-lg">
            Haven't got your answer?{' '}
            <a
              href={`/contact`}
              className="hover:opacity-80 transition-opacity"
              style={{color: '#2DC071', fontWeight: 'bold'}}
            >
              Contact our support
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
