import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, ImageIcon } from 'lucide-react';

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
        "CSV import and export for companies, collections, discounts, and metaobjects.",
        "Track import progress in real time with row-level success and error reporting.",
        "Validate CSV files and update existing records using IDs, handles, and codes."
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

            </main>
        </div>
    );
}