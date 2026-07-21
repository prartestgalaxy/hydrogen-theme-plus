import { useState, useEffect, useCallback } from "react";
import {Image} from '@shopify/hydrogen';
export default function BannerSlider({ module }) {
  if (!module) return null;
const [loaded, setLoaded] = useState(false);
      useEffect(() => {
        // force remove blur after hydration
        const timer = setTimeout(() => setLoaded(true), 10);
        return () => clearTimeout(timer);
      }, []);
const {
  slides: rawSlides,
  fullWidth = true,
  height = 650,
  autoplay = 5000,
  overlayOpacity = 30,
  styling = {},
  ctaText,
  ctaLink,
  ctaPosition = { horizontal: "center", vertical: "center" },
  showArrows = true,
} = module || {};

  const slides = Array.isArray(rawSlides) ? rawSlides : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Styles
  const textColor = styling.textColor || "#ffffff";
  const btnBg = styling.buttonBg || "#ffffff";
  const btnText = styling.buttonText || "#000000";

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides?.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides?.length) % slides.length);
  };

  // Autoplay logic - pauses if slide is a video
  useEffect(() => {
    if (!autoplay || autoplay <= 0 || slides.length <= 1) return;
    if (slides[currentIndex]?.type === "video") return;

    const interval = setInterval(nextSlide, autoplay);
    return () => clearInterval(interval);
  }, [autoplay, nextSlide, slides, currentIndex]);

  // Link Resolution
  const ctaHref = (() => {
    const link = ctaLink?.[0];
    if (!link) return "#";
    if (link._type === "linkExternal") return link.url || "#";
    if (link.reference?.slug) return `/${link.reference._type === 'product' ? 'products' : 'collections'}/${link.reference.slug}`;
    return "#";
  })();

  const horizontalMap = {
    left: "items-start text-left pl-10 md:pl-24",
    center: "items-center text-center",
    right: "items-end text-right pr-10 md:pr-24",
  };

  const verticalMap = {
    top: "justify-start pt-24",
    center: "justify-center",
    bottom: "justify-end pb-24",
  };

  return (
    <section
      className={`relative group overflow-hidden ${
        fullWidth ? "w-full" : "max-w-[1400px] mx-auto my-10 rounded-3xl"
      }`}
      style={{ height: `${height}px`, backgroundColor: styling.backgroundColor || "#000" }}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Media Renderer */}
          <div className="absolute inset-0 w-full h-full transform scale-105 group-hover:scale-100 transition-transform duration-[6000ms] ease-out">
            {slide.type === "video" && slide.videoUrl ? (
              <video
                src={slide.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
             <Image
  src={slide.imageUrl}
  alt={slide.heading || "Slide"}
  className={`"w-full h-full object-cover filter  transition-all duration-500" ${loaded ? 'blur-0' : 'blur-xl'}`}
  loading="lazy"
   sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         400px"
  onLoad={(e) => e.currentTarget.style.filter = 'blur(0)'}
/>

            )}
          </div>

          {/* Editorial Overlay */}
          <div
            className="absolute inset-0 bg-black transition-opacity duration-700"
            style={{ opacity: overlayOpacity / 100 }}
          />

          {/* Content */}
          <div
            className={`absolute inset-0 z-20 flex flex-col p-10 ${horizontalMap[ctaPosition.horizontal]} ${verticalMap[ctaPosition.vertical]}`}
          >
            <div className={`max-w-3xl transition-all duration-1000 transform ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {slide.subheading && (
                <p className="uppercase tracking-[0.4em] text-xs md:text-sm mb-5 font-medium" style={{ color: textColor }}>
                  {slide.subheading}
                </p>
              )}
              {slide.heading && (
                <h2 className="text-4xl md:text-7xl font-serif leading-[1.1] mb-10" style={{ color: textColor }}>
                  {slide.heading}
                </h2>
              )}
              {ctaText && (
                <a
                  href={ctaHref}
                  className="inline-block px-12 py-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl"
                  style={{ backgroundColor: btnBg, color: btnText }}
                >
                  {ctaText}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-between px-6">
          <button
            onClick={prevSlide}
            className="pointer-events-auto w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 translate-x-[-20px] group-hover:translate-x-0"
          >
            <span className="text-2xl ml-[-2px]">‹</span>
          </button>
          <button
            onClick={nextSlide}
            className="pointer-events-auto w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 translate-x-[20px] group-hover:translate-x-0"
          >
            <span className="text-2xl mr-[-2px]">›</span>
          </button>
        </div>
      )}

      {/* Progress Bars (Chic Alternative to Dots) */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-40">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="group py-4"
            >
              <div
                className={`h-[2px] transition-all duration-500 ${
                  index === currentIndex ? "w-12 bg-white" : "w-6 bg-white/30"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}