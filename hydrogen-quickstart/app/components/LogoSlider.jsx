



import React, { useEffect, useRef } from 'react';

const LogoSlider = ({ data }) => {
  const sliderRef = useRef(null);
  const { autoScroll = true, enable = true, logos = [], speed = 3000, title, backgroundcol } = data || {};

  if (!enable || !logos || logos.length === 0) return null;

  useEffect(() => {
    if (!autoScroll || !sliderRef.current || logos.length === 0) return;

    const slider = sliderRef.current;
    let animationFrame;
    let startTime;
    const scrollSpeed = speed / logos.length;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      const scrollAmount = (elapsed / scrollSpeed) * 100;
      
      if (slider) {
        slider.scrollLeft = scrollAmount;
        
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
          startTime = timestamp;
        }
      }
      
      animationFrame = requestAnimationFrame(animate);
    };

    if (autoScroll) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [autoScroll, logos.length, speed]);

  // Only duplicate logos if autoScroll is true
  const displayLogos = autoScroll ? [...logos, ...logos] : logos;

  return (
    <div 
      className="w-full py-6 md:py-[58px]"
      style={{ backgroundColor: backgroundcol || '#FAFAFA' }}
    >
      {title && (
        <h3 className="text-center text-xs sm:text-sm uppercase tracking-wider text-gray-500 mb-4 md:mb-6">
          {title}
        </h3>
      )}
      
      <div className="relative overflow-hidden px-2 md:px-0">
        {/* Gradient overlays for fade effect - Only show when scrolling */}
        {autoScroll && (
          <>
            {/* Adjusted gradient width for mobile so it doesn't cover the smaller logos */}
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, ${backgroundcol || '#FAFAFA'}, transparent)` }}></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(to left, ${backgroundcol || '#FAFAFA'}, transparent)` }}></div>
          </>
        )}
        
        {/* Slider container */}
        <div
          ref={sliderRef}
          className={`hide-scroll flex items-center flex-nowrap gap-4 sm:gap-[30px] ${
            autoScroll 
              ? 'overflow-x-auto' 
              : 'justify-center overflow-x-auto' 
          }`}
          style={{
            scrollBehavior: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE and Edge */
          }}
        >
          {displayLogos.map((logo, index) => (
            <div
              key={index}
              // Responsive sizing: extremely small on mobile, scaling up to original sizes on desktop
              className="flex-shrink-0 w-16 sm:w-24 md:w-32 lg:w-40 h-8 sm:h-12 md:h-16 lg:h-20 flex items-center justify-center"
            >
              {logo.link ? (
                <a
                  href={logo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <img
                    src={logo.imageUrl || logo.image?.url}
                    alt={logo.image?.altText || `Brand logo ${index + 1}`}
                    className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                    loading="lazy"
                  />
                </a>
              ) : (
                <img
                  src={logo.imageUrl || logo.image?.url}
                  alt={logo.image?.altText || `Brand logo ${index + 1}`}
                  className="w-full h-full object-contain opacity-80"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Invisible style block to handle webkit scrollbar hiding without needing extra Tailwind plugins */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
};

export default LogoSlider;