import * as React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {Image} from '@shopify/hydrogen';
export default function CollectionCarousel({ module }) {
  const containerRef = React.useRef(null);
 const [loaded, setLoaded] = useState(false);
      useEffect(() => {
        // force remove blur after hydration
        const timer = setTimeout(() => setLoaded(true), 50);
        return () => clearTimeout(timer);
      }, []);
  if (!module) return null;

  const { 
    title = 'Collections', 
    subtitle, 
    slidesPerView = 3, 
    aspectRatio = 'aspect-[4/5]', 
    resolvedCollections = [],
    textAlign = 'left',
    backgroundColor = '#FFFFFF',
    textColor = '#000000'
  } = module;

  const scroll = (direction) => {
    if (!containerRef.current) return;
    // Increased scroll offset for better UX on tall images
    const scrollAmount = containerRef.current.offsetWidth * 0.8;
    containerRef.current.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  // Map the slidesPerView number to Tailwind widths
  const slideWidths = {
    2: 'md:w-1/2', 
    3: 'md:w-1/3', 
    4: 'md:w-1/4', 
    5: 'md:w-1/5'
  }[slidesPerView] || 'md:w-1/3';

  const isCenter = textAlign === 'center';

  return (
    <section 
      className="py-20 md:py-32"
      style={{ backgroundColor: backgroundColor, color: textColor }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .hide-res-scrollbar::-webkit-scrollbar { display: none !important; }
        .hide-res-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}} />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className={`flex flex-col ${isCenter ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'} mb-16 gap-8`}>
          <div className={`space-y-3 ${isCenter ? 'w-full' : ''}`}>
            {subtitle && (
              <span className="block text-[11px] tracking-[0.4em] uppercase font-bold opacity-60">
                {subtitle}
              </span>
            )}
            <h2 className="text-4xl md:text-5xl font-serif capitalize leading-tight">
              {title}
            </h2>
          </div>

          <div className={`flex gap-4 ${isCenter ? 'justify-center' : ''}`}>
            <button 
              onClick={() => scroll('prev')} 
              className="group p-4 border rounded-full transition-all hover:bg-white/10"
              style={{ borderColor: textColor }}
            >
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform group-active:scale-90"><path d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={() => scroll('next')} 
              className="group p-4 border rounded-full transition-all hover:bg-white/10"
              style={{ borderColor: textColor }}
            >
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform group-active:scale-90"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={containerRef}
          className="hide-res-scrollbar flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8"
        >
          {resolvedCollections.map((col) => (
            <Link 
              key={col._id}
              to={`/collections/${col.handle}`}
              className={`w-[85%] ${slideWidths} flex-shrink-0 snap-start group no-underline`}
            >
              {/* Image Wrapper: ensures the aspect ratio is enforced even when tall */}
              <div className={`relative w-full ${aspectRatio} overflow-hidden bg-black/5 mb-6`}>
                {col.imageUrl ? (
                <Image
  src={col.imageUrl}
  alt={col.title}
  className={`"absolute inset-0 w-full h-full object-cover filter  transition-all duration-500 transition-transform duration-[1.2s] ease-in-out group-hover:scale-105" ${loaded ? 'blur-0' : 'blur-xl'}`}
  loading="lazy"
   sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         400px"
  onLoad={(e) => e.currentTarget.style.filter = 'blur(0)'}
/>

                ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest opacity-20">No Image</div>
                )}
              </div>
              
              <h3 
                className={`text-[14px] font-medium uppercase tracking-[0.2em] transition-opacity group-hover:opacity-70 ${isCenter ? 'text-center' : 'text-left'}`} 
                style={{ color: textColor }}
              >
                {col.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}