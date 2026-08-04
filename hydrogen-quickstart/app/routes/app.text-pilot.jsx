import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

import { t } from "../utils/translation";
import { useTranslationStore } from "../components/ZooStandStore";
import textPilot1 from '../assets/text-pilot-1.png';
import textPilot2 from '../assets/text-pilot-2.png';
import textPilot3 from '../assets/text-pilot-3.png';
import textPilot4 from '../assets/text-pilot-4.png';
import textPilot5 from '../assets/text-pilot-5.png';
import textPilot6 from '../assets/text-pilot-6.png';

// --- Data ---
const APP_DATA = {
  name: "Text Pilot",
  shortDescription: "Centralized multilingual translations management for Hydrogen storefronts.",
  description: "Text Pilot simplifies translation management for Hydrogen storefronts by replacing traditional JSON file workflows with Metaobjects. Manage translations directly from Admin without code changes or redeployments. Create, update, import, export, search, auto translation and synchronize translation keys across multiple languages. Support for CSV imports, export, auto translation and bulk updates makes multilingual storefront maintenance faster, easier, and more scalable.",
  images: [
    textPilot1,
    textPilot2,
    textPilot3,
    textPilot4,
    textPilot5,
    textPilot6
  ],
  plans: [
    {
      name: "Free",
      price: "Free",
      period: "",
      features: [
        "Support 1 language only.",
        "CSV import and export for translations.",
        "Auto Translation for new content.",
        "Guide to connect Hydrogen translations."
      ]
    },
    {
      name: "Advance",
      price: "$5",
      period: "/ month",
      features: [
        "All language support.",
        "CSV import and export for translations.",
        "Auto Translation for new content.",
        "Store translations in metaobject.",
        "One place for multilingual management.",
        "Guide to connect Hydrogen translations."
      ]
    }
  ],
  usage: [
    {
      title: "CSV Import/Export",
      description: "Import and export translation keys and translations using CSV files."
    },
    {
      title: "Bulk Updates",
      description: "Add and update translations across multiple languages at once."
    },
    {
      title: "Auto-Translation",
      description: "Automatically generate translations with auto-translation feature."
    },
    {
      title: "Hydrogen Integration",
      description: "Step-by-step guide to connect Hydrogen translations with Text Pilot."
    },
    {
      title: "Synchronization",
      description: "Sync new translation keys with existing language translations."
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

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
];

function LanguageSelector() {
  const language = useTranslationStore((state) => state.language);
  const setLanguage = useTranslationStore((state) => state.setLanguage);

  useEffect(() => {
    setLanguage('en');
  }, []);

  return (
    <select
      value={language || 'en'}
      onChange={(e) => setLanguage(e.target.value)}
      className="text-sm font-medium text-slate-700 bg-white outline-none"
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        cursor: 'pointer'
      }}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name} ({lang.code})
        </option>
      ))}
    </select>
  );
}

function TranslationTestComponent() {
  useTranslationStore();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
        <h3 className="text-xl font-bold text-slate-900">{t("Translation Testing Component")}</h3>
        <LanguageSelector />
      </div>

      <p className="text-slate-600 leading-relaxed">
        {t("Welcome to our application dashboard. This page is designed to help users explore features, manage settings, review account information, update preferences, and navigate through different sections of the platform.")}
      </p>

      <ul className="list-disc pl-5 text-slate-600 space-y-2 pt-2 pb-4">
        <li>{t("Dashboard Overview")}</li>
        <li>{t("Product Catalog")}</li>
        <li>{t("Customer Information")}</li>
      </ul>

      <div className="flex gap-4 border-t border-slate-100 pt-6">
        <button className="py-2.5 px-6 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
          {t("Submit Application")}
        </button>
        <button className="py-2.5 px-6 rounded-lg font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
          {t("Cancel Request")}
        </button>
      </div>
    </div>
  );
}

export default function TextPilot() {
  const shopifyAppLink = "https://apps.shopify.com/text-pilot";

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

        {/* Dashboard Preview Section */}
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

        {/* Live Demo Section */}
        <section className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-wide border-b border-slate-200 pb-3">
            Live Demo
          </h2>
          <TranslationTestComponent />
        </section>

      </div>
    </div>
  );
}