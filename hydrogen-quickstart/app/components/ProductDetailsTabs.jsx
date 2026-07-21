import { useEffect, useState } from "react";
import { PortableText } from "@portabletext/react";

export function ProductDetailsTabs({ data }) {
  if (!data?.enable) return null;

  // Determine which structure we're dealing with
  const isProductSpecific = !!data.descriptionTab;
  const isGlobalStructure = !!data.tabs;

  const [activeTab, setActiveTab] = useState(
    isProductSpecific ? "description" : (data.tabs?.[0]?.tabTitle || "description")
  );

  // Handle global structure
  if (isGlobalStructure) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Tabs Navigation */}
        <div className="flex justify-center mb-12 border-b border-gray-200">
          <div className="flex gap-8 md:gap-12 border-b border-gray-200">
            {data.tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(tab.tabTitle)}
                className={`pb-4 px-2 text-base font-semibold transition-all relative ${
                  activeTab === tab.tabTitle
                    ? "text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black"
                    : "text-[#737373] hover:text-gray-600"
                }`}
              >
                {tab.tabTitle}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Left Image - using leftImage from global structure */}
          {data.leftImage?.url && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={data.leftImage.url}
                alt={data.leftImage.altText || "Product detail"}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          )}

          {/* Right Content */}
          <div>
            {data.tabs.map((tab, index) => (
              activeTab === tab.tabTitle && (
                <div key={index}>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#252B42] mb-6">
                    {tab.tabTitle}
                  </h2>
                  <div className="prose prose-base max-w-none text-[#737373]">
                    {tab.tabContent ? (
                      <PortableText value={tab.tabContent} />
                    ) : (
                      <p>No content available.</p>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle product-specific structure (your existing code)
  const {
    rightImage,
    descriptionTab,
    additionalInfoTab,
    reviewsTab,
  } = data;

  const tabs = [
    {
      key: "description",
      label: "Description",
    },
    {
      key: "additional",
      label: "Additional Information",
    },
    {
      key: "reviews",
      label: `Reviews (${reviewsTab?.reviewCount || 0})`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Tabs Navigation */}
      <div className="flex justify-center mb-12 border-b border-gray-200">
        <div className="flex gap-8 md:gap-12">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 px-2 text-base font-semibold transition-all relative ${
                activeTab === tab.key
                  ? "text-black"
                  : "text-[#737373] hover:text-gray-600"
              }`}
            >
              {tab.label ? (
                <>
                  {tab.label.split(" ")[0]} <span className={tab.key === "reviews" ? "text-[#23856D]" : ""}> {tab.label.split(" ")[1]} </span>
                </>
              ) : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section - Image on LEFT, Content on RIGHT */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
        {/* Left Image - Note: product-specific uses rightImage but displays on left */}
        {rightImage?.url && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={rightImage.url}
              alt={rightImage.altText || "Product detail"}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        )}

        {/* Right Content */}
        <div>
          {activeTab === "description" && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#252B42] mb-6">
                {descriptionTab?.heading || "Description"}
              </h2>
              <div className="prose prose-base max-w-none text-[#737373] space-y-4">
                {descriptionTab?.content ? (
                  <PortableText value={descriptionTab.content} />
                ) : (
                  <p>No description available.</p>
                )}
              </div>
            </>
          )}

          {activeTab === "additional" && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#252B42] mb-6">
                {additionalInfoTab?.heading || "Additional Information"}
              </h2>
              <div className="prose prose-base max-w-none text-[#737373]">
                {additionalInfoTab?.content ? (
                  <PortableText value={additionalInfoTab.content} />
                ) : (
                  <p>No additional information available.</p>
                )}
              </div>
            </>
          )}

          {activeTab === "reviews" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {reviewsTab?.heading || "Reviews"}
                </h2>
                <span className="text-sm text-gray-500">
                  {reviewsTab?.reviewCount || 0} Reviews
                </span>
              </div>

              {(!reviewsTab?.reviews || reviewsTab.reviews.length === 0) && (
                <p className="text-gray-500 text-center py-8 border border-gray-100 rounded-lg">
                  No reviews yet. Be the first to review this product!
                </p>
              )}

              <div className="space-y-4">
                {reviewsTab?.reviews?.map((review, index) => (
                  <div
                    key={index}
                    className="border border-gray-100 rounded-lg p-6 hover:shadow-sm transition-shadow"
                  >
                    {/* Review content stays the same */}
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-gray-900">
                        {review.reviewerName || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {review.reviewDate || "No date"}
                      </p>
                    </div>

                    <div className="flex gap-0.5 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (review.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-200"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {review.reviewText || "No review text provided."}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}