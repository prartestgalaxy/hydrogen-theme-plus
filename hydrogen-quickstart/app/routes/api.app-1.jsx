import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, ImageIcon } from 'lucide-react';

import { t } from "../utils/translation";
import { useTranslationStore } from "../components/ZooStandStore"; import textPilot1 from '../assets/text-pilot-1.png';
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
        "Import and export translation keys and translations using CSV files.",
        "Add and update translations across multiple languages at once.",
        "Automatically generate translations with auto-translation feature.",
        "Step-by-step guide to connect Hydrogen translations with Text Pilot.",
        "Sync new translation keys with existing language translations."
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
        <div className="relative w-full mx-auto group">
            <div className="relative w-full overflow-hidden rounded-2xl shadow-lg border border-slate-200 bg-[#F1F1F1] aspect-[16/9] md:aspect-[16/10] lg:aspect-video flex justify-center items-center">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-10 disabled:opacity-0 focus:opacity-100"
                    aria-label="Previous image"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={() => paginate(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-10 disabled:opacity-0 focus:opacity-100"
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

const PlanCard = ({ plan }) => {
    return (
        <div className="flex flex-col p-6 rounded-xl border border-slate-200 bg-white shadow-sm h-full">
            <h3 className="text-xl font-semibold mb-2 text-slate-900">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
            </div>

            <div className="flex-grow">
                <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 shrink-0 text-slate-400 mt-0.5" />
                            <span className="text-sm text-slate-600">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button className="mt-8 w-full py-2.5 px-4 rounded-lg font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors">
                Choose {plan.name}
            </button>
        </div>
    );
};

const LANGUAGES = [
    { code: 'hi', name: 'Hindi' },
    { code: 'fi', name: 'Finnish' },
    { code: 'fr', name: 'French' },
];

function LanguageSelector() {
    const language = useTranslationStore((state) => state.language);
    const setLanguage = useTranslationStore((state) => state.setLanguage);

    useEffect(() => {
        setLanguage('hi');
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
    // Subscribe to translation store to re-render when language changes
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

export default function AppDetailsPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 pb-24">
            {/* Header Section */}
            <header className="pt-16 pb-12 px-6 lg:px-8 max-w-[1200px] mx-auto">
                <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
                        {APP_DATA.name}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600">
                        {APP_DATA.shortDescription}
                    </p>
                </div>
            </header>

            {/* Gallery Section */}
            <section className="px-6 lg:px-8 mb-16 max-w-[1200px] mx-auto">
                <Carousel images={APP_DATA.images} />
            </section>

            {/* Main Content Sections */}
            <main className="max-w-[1200px] mx-auto px-6 lg:px-8 space-y-16">

                {/* About & Features */}
                <div className="space-y-12 max-w-3xl">

                    {/* About Section */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            About this app
                        </h2>
                        <div className="text-base text-slate-600 leading-relaxed">
                            <p>{APP_DATA.description}</p>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Features
                        </h2>
                        <ol className="list-decimal pl-5 space-y-3 text-slate-600">
                            {APP_DATA.usage.map((step, idx) => (
                                <li key={idx} className="pl-1">
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </section>
                </div>

                {/* Pricing Section */}
                <section className="pt-8 border-t border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">
                        Pricing
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                        {APP_DATA.plans.map((plan, idx) => (
                            <PlanCard key={idx} plan={plan} />
                        ))}
                    </div>
                </section>

                {/* Live Demo Section */}
                <section className="pt-8 border-t border-slate-100 max-w-4xl">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">
                        Live Demo
                    </h2>
                    <TranslationTestComponent />
                </section>

            </main>
        </div>
    );
}