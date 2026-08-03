import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

import img1 from '../assets/data-tool-1.png';
import img2 from '../assets/data-tool-2.png';
import img3 from '../assets/data-tool-3.png';
import img4 from '../assets/data-tool-4.png';
import img5 from '../assets/data-tool-5.png';

// --- Data ---
const APP_DATA = {
  name: "Data Tool",
  shortDescription: "Bulk import/export companies, collections, discounts, and metaobjects. Save time, cut manual work.",
  description: "Managing large volumes of store data manually is slow and error-prone. Data Tool lets merchants bulk import and export companies, collections, discounts, and metaobjects using CSV files. Upload a file, track progress in real time, and review row-level results. The app validates data, syncs records through platform APIs, and supports updates using existing IDs. Merchants save hours on migrations, backups, and bulk updates while keeping data accurate and organized.",
  images: [
    img1,
    img2,
    img3,
    img4,
    img5
  ],
  plans: [
    {
      name: "Free",
      price: "Free",
      period: "",
      features: [
        "Full access to all features",
        "Unlimited CSV imports & exports",
        "Real-time progress tracking",
        "Row-level success & error reporting"
      ]
    }
  ],
  usage: [
    {
      title: "Bulk Import/Export",
      description: "CSV import and export for companies, collections, discounts, and metaobjects."
    },
    {
      title: "Real-time Tracking",
      description: "Track import progress in real time with row-level success and error reporting."
    },
    {
      title: "Data Validation",
      description: "Validate CSV files and update existing records using IDs, handles, and codes."
    }
  ]
};

// --- Components ---

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      z: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        z: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  const paginate = useCallback((newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex >= images.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = images.length - 1;
      return nextIndex;
    });
  }, [images.length]);

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') paginate(1);
      if (e.key === 'ArrowLeft') paginate(-1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginate]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400">
        <ImageIcon size={48} className="mb-4 opacity-50" />
        <p>No screenshots available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto">
      <div className="relative w-full overflow-hidden rounded-2xl shadow-lg border border-slate-200 bg-[#F1F1F1] aspect-[16/9] md:aspect-[16/10] lg:aspect-video flex justify-center items-center group">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 w-full h-full object-contain cursor-grab active:cursor-grabbing hover:scale-[1.01] transition-transform duration-700 ease-out"
            alt={`App screenshot ${currentIndex + 1}`}
            loading="lazy"
          />
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-10 disabled:opacity-0"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => paginate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-10 disabled:opacity-0"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-8 space-x-3">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-indigo-600 w-8' : 'bg-slate-300 hover:bg-slate-400 w-2.5'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function DataTool() {
  const shopifyAppLink = "https://apps.shopify.com/data-tool";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header / Hero Section */}
        <header className="space-y-4 text-center md:text-left border-b border-slate-200 pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="inline-block px-3.5 py-1 bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-full uppercase tracking-wider">
              App Information
            </div>

            <a
              href={shopifyAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <span>View App on Shopify</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            {APP_DATA.name}
          </h1>

          <p className="text-lg md:text-xl font-bold text-indigo-600 leading-snug">
            {APP_DATA.shortDescription}
          </p>

          <p className="text-slate-700 leading-relaxed text-base md:text-lg font-normal">
            {APP_DATA.description}
          </p>
        </header>

        {/* Dashboard Preview Section (Carousel) */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-wide border-b border-slate-200 pb-3">
            Dashboard Overview
          </h2>
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <Carousel images={APP_DATA.images} />

          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-wide border-b border-slate-200 pb-3">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {APP_DATA.usage.map((feature, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all space-y-2">
                <h3 className="text-lg md:text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl font-bold text-slate-900 tracking-wide">
              Pricing
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Choose the plan that best fits your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {APP_DATA.plans.map((plan, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="p-6 space-y-6">
                  <div>
                    <span className="text-sm font-semibold text-slate-500">{plan.name}</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                      {plan.period && <span className="text-sm font-medium text-slate-500">{plan.period}</span>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-bold text-slate-900">Features</div>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <span className="text-slate-800 font-bold mt-0.5">✓</span> <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 pt-2">
            All charges are billed in USD. Recurring and usage-based charges are billed every 30 days.
          </p>
        </section>

      </div>
    </div>
  );
}