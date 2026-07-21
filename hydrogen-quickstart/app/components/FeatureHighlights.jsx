
import React from "react";

// Fallback data
const FALLBACK_FEATURES = [
  {
    heading: "PAYMENT IN 3X",
    description: "Enjoy 3x payments with no fees on purchases over $100.",
    iconPath: "/icons/payment-icon.svg" // Update with your actual icon filename
  },
  {
    heading: "EXPRESS DELIVERY",
    description: "Fast, reliable shipping from our bag company. Your favorite bags.",
    iconPath: "/icons/delivery-icon.svg" // Update with your actual icon filename
  },
  {
    heading: "FREE RETURNS",
    description: "Free 5-day returns on orders in Japan. Shop confidently.",
    iconPath: "/icons/returns-icon.svg" // Update with your actual icon filename
  }
];

export default function FeatureHighlights({ data }) {

  // Check if we should use fallback or provided data
  const shouldUseFallback = !data?.enablefeatureHighlightsSection || 
                           !data?.featureHighlights?.enable || 
                           !data?.featureHighlights?.features?.length;

  let features = [];

  if (shouldUseFallback) {
    // Use fallback data
    features = FALLBACK_FEATURES;
  } else {
    // Use provided data, mapping icon URL properly
    features = data.featureHighlights.features.map(feature => ({
      heading: feature?.heading,
      description: feature?.description,
      iconPath: feature?.icon?.asset?.url || `/icons/${feature?.heading?.toLowerCase().replace(/\s+/g, '-')}.svg`
    }));
  }
  

  return (
    <section className="w-full bg-[#f3f3f3] py-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]  py-[19px]">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#eaeaea] rounded-2xl p-6 flex items-center gap-[31px]"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <img
                  src={feature.iconPath}
                  alt={feature.heading}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.src = "/icons/payment-icon.svg";
                  }}
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-col gap-[3.5px]">
                <h3 className="text-[22px] font-normal tracking-wide text-[#3C3C3C]  uppercase">
                  {feature.heading}
                </h3>
                <p className="text-[16px] font-normal text-[#9D9D9D] leading-5">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}