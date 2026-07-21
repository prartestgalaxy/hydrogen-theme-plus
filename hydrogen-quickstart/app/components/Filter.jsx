// export default React.memo(Filter);
import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import {Money} from '@shopify/hydrogen';

// Move FilterContent outside the main component
const FilterContent = React.memo(
  ({
    filterData,
    expandedSections,
    selectedFilters,
    livePriceRange,
    searchTerm,
    debouncedSearchTerm,
    activeFilterCount,
    searchInputRef,
    filteredVendors,
    filteredProductTypes,
    filteredColors,
    filteredSizes,
    filteredTags,
    onToggleSection,
    onCheckboxChange,
    onSearchChange,
    onClearAll,
    onSliderChange,
    onSliderMouseUp,
    onSliderTouchEnd,
    onPriceInputChange,
    onApplyPriceFilter,
    getColorClass,
    filters,
    locale,
    onGlobalSearchChange,
    globalSearchTerm,
    currencySymbol,
    globalData, // Add globalData prop
  }) => {
    // Dynamic style helpers
    const getButtonStyle = (type = 'primary', isDisabled = false) => {
      if (!globalData?.buttons) return {};

      const buttons = globalData.buttons;
      const links = globalData.linksEffect || {transitionDuration: 300};

      if (isDisabled) {
        return {
          backgroundColor: '#9CA3AF',
          color: '#FFFFFF',
          borderRadius: `${buttons.borderRadius}px`,
          cursor: 'not-allowed',
        };
      }

      if (type === 'primary') {
        return {
          backgroundColor: `#${buttons.primaryBg}`,
          color: `#${buttons.primaryText}`,
          borderRadius: `${buttons.borderRadius}px`,
          transition: `all ${links.transitionDuration}ms ease`,
        };
      } else {
        return {
          backgroundColor: `#${buttons.secondaryBg}`,
          color: `#${buttons.secondaryText}`,
          borderRadius: `${buttons.borderRadius}px`,
          transition: `all ${links.transitionDuration}ms ease`,
        };
      }
    };

    const getLinkStyle = () => {
      if (!globalData?.linksEffect) return {};

      const links = globalData.linksEffect;
      return {
        color: `#${links.linkColor}`,
        transition: `color ${links.transitionDuration}ms ease`,
        textDecoration: links.underlineStyle === 'none' ? 'none' : 'underline',
      };
    };

    const getHeadingStyle = (level = 'h3') => {
      if (!globalData?.headingSizes) return {};

      const sizes = globalData.headingSizes;
      return {
        fontSize: `${sizes[level]}px`,
        fontFamily: globalData.fontFamily || 'Montserrat, sans-serif',
        fontWeight: 'bold',
      };
    };

    const getHoverStyle = () => {
      if (!globalData?.linksEffect) return {};
      return {
        color: `#${globalData.linksEffect.hoverColor}`,
      };
    };

    const primaryColor = globalData?.buttons?.primaryBg
      ? `#${globalData.buttons.primaryBg}`
      : '#23A6F0';
    const primaryHoverColor = globalData?.buttons?.primaryHoverBg
      ? `#${globalData.buttons.primaryHoverBg}`
      : '#1a7ab0';
    const borderRadius = globalData?.buttons?.borderRadius || 8;

    return (
      <>
        <div className="flex justify-between items-center w-[100%] max-w-[210px]">
          <h5
            className="text-base font-bold"
            style={{
              ...getHeadingStyle('h5'),
              color: globalData?.darkMode?.enable ? '#ffffff' : '#252b42ff',
              lineHeight: '24px',
              letterSpacing: '0.2px'
            }}
          >
            Filter:
          </h5>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              style={getLinkStyle()}
              className="text-xs transition-colors"
              onMouseEnter={(e) => {
                const hoverStyle = getHoverStyle();
                if (hoverStyle.color) {
                  e.currentTarget.style.color = hoverStyle.color;
                }
              }}
              onMouseLeave={(e) => {
                const linkStyle = getLinkStyle();
                if (linkStyle.color) {
                  e.currentTarget.style.color = linkStyle.color;
                }
              }}
            >
              Clear all ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Single Unified Search Input */}
        <div className="max-w-fit">
          <div className="relative w-[100%] max-w-[186px]">
            {/* Search Icon */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_328_3227)">
                  <g clipPath="url(#clip1_328_3227)">
                    <g clipPath="url(#clip2_328_3227)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.4601 10.3188L15.7639 14.6226C15.9151 14.7739 16.0001 14.9792 16 15.1932C15.9999 15.4072 15.9148 15.6124 15.7635 15.7637C15.6121 15.915 15.4068 15.9999 15.1928 15.9998C14.9788 15.9998 14.7736 15.9147 14.6223 15.7633L10.3185 11.4595C9.03194 12.456 7.41407 12.9249 5.79403 12.7709C4.17398 12.6169 2.67346 11.8515 1.59771 10.6304C0.521957 9.40935 -0.0482098 7.82432 0.00319691 6.19779C0.0546036 4.57125 0.723722 3.02539 1.87443 1.87468C3.02514 0.723966 4.57101 0.0548478 6.19754 0.00344105C7.82408 -0.0479656 9.40911 0.522201 10.6302 1.59795C11.8513 2.6737 12.6167 4.17422 12.7707 5.79427C12.9247 7.41431 12.4558 9.03219 11.4593 10.3188H11.4601ZM6.4003 11.1995C7.67328 11.1995 8.89412 10.6938 9.79425 9.79369C10.6944 8.89356 11.2001 7.67272 11.2001 6.39974C11.2001 5.12676 10.6944 3.90592 9.79425 3.00579C8.89412 2.10565 7.67328 1.59996 6.4003 1.59996C5.12732 1.59996 3.90648 2.10565 3.00634 3.00579C2.10621 3.90592 1.60052 5.12676 1.60052 6.39974C1.60052 7.67272 2.10621 8.89356 3.00634 9.79369C3.90648 10.6938 5.12732 11.1995 6.4003 11.1995Z"
                        fill="#737373"
                      />
                    </g>
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_328_3227">
                    <rect width="15.9645" height="15.9998" fill="white" />
                  </clipPath>
                  <clipPath id="clip1_328_3227">
                    <rect width="15.9645" height="15.9998" fill="white" />
                  </clipPath>
                  <clipPath id="clip2_328_3227">
                    <rect width="15.9645" height="15.9998" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>

            {/* Input */}
            <input
              ref={searchInputRef}
              type="text"
              value={globalSearchTerm}
              onChange={(e) => onGlobalSearchChange(e.target.value)}
              placeholder="Search"
              className="bg-[#F5F5F5] w-[186px] h-[50px] pl-10 pr-4 text-sm rounded-[5px] border border-[#DADADA] focus:outline-none placeholder:text-[#737373]"
              style={{
                fontFamily: globalData?.fontFamily || 'Montserrat, sans-serif',
              }}
            />
          </div>
        </div>

        {/* Vendors/Brands Section */}
        {filters?.enableBrand !== false && filterData?.vendors?.length > 0 && (
          <div className="p-[25px] flex flex-col gap-[25px]">
            <div
              className="flex justify-between items-center cursor-pointer group"
              onClick={() => onToggleSection('vendors')}
            >
              <h6
                className="text-[16px] font-bold"
                style={{
                  ...getHeadingStyle('h6'),
                  color: globalData?.darkMode?.enable ? '#ffffff' : '#252B42',
                  lineHeight: '24px',
                  letterSpacing: '0.1px'
                }}
              >
                Brands
              </h6>
            </div>
            {expandedSections.vendors && (
              <div className="font-montserrat flex flex-col gap-[15px] overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-300 flex flex-col max-w-[145px]">
                {filteredVendors.map(({name}) => {
                  const isChecked = selectedFilters.vendors.includes(name);

                  return (
                    <label
                      key={name}
                      className="flex items-center gap-[13px] cursor-pointer group"
                    >
                      {/* Hidden native input */}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onCheckboxChange('vendors', name)}
                        className="hidden"
                      />

                      {/* Custom Checkbox */}
                      <div
                        className={`min-w-[25px] min-h-[25px] rounded-[5px] border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-black border-black'
                            : 'border-[#DADADA] bg-white'
                        }`}
                      >
                        {/* Check Icon */}
                        {isChecked && (
                          <svg
                            width="14"
                            height="10"
                            viewBox="0 0 14 10"
                            fill="none"
                          >
                            <path
                              d="M1 5L5 9L13 1"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Label */}
                      <span
                        className=" font-montserrat text-[#737373] truncate font-bold text-[14px] leading-[24px] tracking-[0.2px] font-[Montserrat]"
                        // style={getLinkStyle()}
                        onMouseEnter={(e) => {
                          const hoverStyle = getHoverStyle();
                          if (hoverStyle.color) {
                            e.currentTarget.style.color = hoverStyle.color;
                          }
                        }}
                      >
                        {name}
                      </span>
                    </label>
                  );
                })}

                {filteredVendors.length === 0 && (
                  <p className="text-xs text-gray-400 italic">
                    No brands found
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div
         style={{
          height: '1px',
          backgroundColor: '#E7E7E7',
         }}
        ></div>

        {/* Colors Section */}
        {filters?.enableColor !== false && filterData?.colors?.length > 0 && (
          <div className="p-[25px] flex flex-col gap-[25px]">
            <div
              className="flex justify-between items-center cursor-pointer group"
              onClick={() => onToggleSection('colors')}
            >
              <h6
                className="text-[16px] font-bold"
                style={{
                  ...getHeadingStyle('h6'),
                  color: globalData?.darkMode?.enable ? '#ffffff' : '#252B42',
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '0.1px'
                }}
              >
                Color
              </h6>
            </div>
            {expandedSections.colors && (
              <div className="flex flex-col max-w-[145px] flex flex-col gap-[15px]">
                {filteredColors.map(({name}) => {
                  const isSelected = selectedFilters.colors.includes(name);

                  return (
                    <div
                      key={name}
                      onClick={() => onCheckboxChange('colors', name)}
                      className="flex items-center gap-[8px] cursor-pointer"
                    >
                      {/* Color Circle */}
                      <div
                        className={`min-w-[25px] min-h-[25px] rounded-full flex items-center justify-center ${
                          isSelected ? 'ring-2 ring-black' : ''
                        }`}
                      >
                        <div
                          className={`w-[20px] h-[20px] rounded-full ${getColorClass(name)} border border-white`}
                        />
                      </div>

                      {/* Label */}
                      <span
                        className={`font-bold text-[14px] leading-[24px] tracking-[0.2px] font-montserrat ${
                          isSelected ? 'text-black' : 'text-[#737373]'
                        }`}
                      >
                        {name}
                      </span>
                    </div>
                  );
                })}

                {filteredColors.length === 0 && (
                  <p className="text-xs text-gray-400 italic">
                    No colors found
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div
         style={{
          height: '1px',
          backgroundColor: '#E7E7E7',
         }}
        ></div>

        {/* Tags Section */}
        {filters?.enableTags !== false && filterData?.tags?.length > 0 && (
          <div className="p-[25px] max-w-[192px] flex flex-col gap-[25px]">
            {/* Header */}
            <div
              className="flex justify-between items-center cursor-pointer group"
              onClick={() => onToggleSection('tags')}
            >
              <h6
                className="text-[16px] font-bold"
                style={{
                  ...getHeadingStyle('h6'),
                  color: globalData?.darkMode?.enable ? '#ffffff' : '#252B42',
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '0.1px'
                }}
              >
                Popular Tags
              </h6>
            </div>

            {/* Tags */}
            {expandedSections.tags && (
              <div className="flex flex-wrap gap-y-[15px] gap-x-[25px] overflow-y-auto">
                {filteredTags.map(({name, count}) => {
                  const isSelected = selectedFilters.tags.includes(name);

                  return (
                    <div
                      key={name}
                      onClick={() => onCheckboxChange('tags', name)}
                      className={`flex items-center gap-[10px] px-[15px] py-[10px] rounded-[5px] border cursor-pointer transition-all text-[14px] font-bold font-[Montserrat]

  ${
    isSelected
      ? 'bg-[#23A6F0] border-[#23A6F0] text-white'
      : 'bg-transparent border-[#23A6F0] text-[#23A6F0]'
  }
`}
                    >
                      {/* Label */}
                      <span
                       style={{
                        lineHeight: '22px',
                        letterSpacing: '0.2px'
                       }}
                      >
                        {name} ({count})
                      </span>

                      {/* Close Icon */}
                      <span className="text-[16px] leading-none">×</span>
                    </div>
                  );
                })}

                {filteredTags.length === 0 && (
                  <p className="text-xs text-gray-400 italic">No tags found</p>
                )}
              </div>
            )}
          </div>
        )}

        <div
         style={{
          height: '1px',
          backgroundColor: '#E7E7E7',
         }}
        ></div>

        {/* Filter by Price Section */}
        {filters?.enablePrice !== false && filterData?.priceRange && (
          <div className="w-full p-[25px] flex flex-col gap-[15px]">
            <h6
              className="text-[16px] font-bold"
              style={{
                ...getHeadingStyle('h6'),
                color: globalData?.darkMode?.enable ? '#ffffff' : '#252B42',
                lineHeight: '24px',
                letterSpacing: '0.1px'
              }}
            >
              Filter By Price
            </h6>

            <div className="relative">
              <input
                type="range"
                min={filterData.priceRange.min}
                max={filterData.priceRange.max}
                step="0.01"
                value={livePriceRange.max}
                onChange={(e) => onSliderChange('max', e.target.value)}
                onMouseUp={onSliderMouseUp}
                onTouchEnd={onSliderTouchEnd}
                className="w-full h-1 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:border-none
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:transition-all
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-webkit-slider-thumb]:active:scale-95
              [&::-webkit-slider-thumb]:bg-[var(--primary-color)]
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:border-none
              [&::-moz-range-thumb]:shadow-md
              [&::-moz-range-thumb]:transition-all
              [&::-moz-range-thumb]:hover:scale-110
              [&::-moz-range-thumb]:active:scale-95"
                style={{
                  '--primary-color': primaryColor,
                  background: `linear-gradient(to right, 
                  ${primaryColor} 0%, 
                  ${primaryColor} ${((livePriceRange.max - filterData.priceRange.min) / (filterData.priceRange.max - filterData.priceRange.min)) * 100}%, 
                  #d1d5db ${((livePriceRange.max - filterData.priceRange.min) / (filterData.priceRange.max - filterData.priceRange.min)) * 100}%, 
                  #d1d5db 100%)`,
                  borderRadius: '5px',
                }}
              />
            </div>

            <div className="flex justify-between gap-[16px]">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={livePriceRange.min}
                  onChange={(e) => onPriceInputChange('min', e.target.value)}
                  onBlur={onApplyPriceFilter}
                  min={filterData.priceRange.min}
                  max={filterData.priceRange.max}
                  step="0.01"
                  className=" border border-[#DADADA] w-full bg-[#E6E6E6] text-center py-[11px] text-sm outline-none text-[#737373]"
                  style={{borderRadius: '5px',
                    fontSize: '14px',
                    lineHeight: '28px',
                    letterSpacing: '0.2px',
                    height: '50px'
                  }}
                />
              </div>
              <div className="relative flex-1">
                <input
                  type="number"
                  value={livePriceRange.max}
                  onChange={(e) => onPriceInputChange('max', e.target.value)}
                  onBlur={onApplyPriceFilter}
                  min={filterData.priceRange.min}
                  max={filterData.priceRange.max}
                  step="0.01"
                  className=" border border-[#DADADA] w-full bg-[#E6E6E6] text-center py-2.5 text-sm outline-none text-[#737373]"
                  style={{borderRadius: '5px',
                    fontSize: '14px',
                    lineHeight: '28px',
                    letterSpacing: '0.2px',
                    height: '50px'
                  }}
                />
              </div>
            </div>

            <button
              onClick={onApplyPriceFilter}
              style={{
                ...getButtonStyle('primary'),
                borderRadius: '5px',
                lineHeight: '24px',
                letterSpacing: '0.2px'
              }}
              className="font-montserrat rounded-[5px] w-full px-[20px] py-[10px] text-sm font-medium transition-opacity hover:opacity-90"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryHoverColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor;
              }}
            >
              FILTER
            </button>
          </div>
        )}
      </>
    );
  },
);

const Filter = ({
  filters,
  onFilterChange,
  filterData,
  initialPriceRange,
  onGlobalSearchChange,
  globalSearchTerm,
  locale,
  globalData, // Add globalData prop
}) => {
  const [expandedSections, setExpandedSections] = useState({
    vendors: true,
    productTypes: true,
    colors: true,
    sizes: true,
    tags: true,
    price: true,
  });

  const currencyMap = {
    ae: 'د.إ',
    au: '$',
    bq: '$',
    fr: '€',
    gb: '£',
    jp: '¥',
    nl: '€',
    us: '$',
  };
  const currencySymbol = currencyMap[locale?.country] || '$';

  const [selectedFilters, setSelectedFilters] = useState({
    vendors: [],
    productTypes: [],
    colors: [],
    sizes: [],
    tags: [],
    priceRange: {
      min: initialPriceRange?.min || 0,
      max: initialPriceRange?.max || 1000,
    },
  });

  const [livePriceRange, setLivePriceRange] = useState({
    min: initialPriceRange?.min || 0,
    max: initialPriceRange?.max || 1000,
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const sliderTimeoutRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const isSlidingRef = useRef(false);
  const searchInputRef = useRef(null);

  // Dynamic style helpers for mobile buttons
  const getMobileButtonStyle = () => {
    if (!globalData?.buttons) return {};

    const buttons = globalData.buttons;
    return {
      backgroundColor: `#${buttons.primaryBg}`,
      color: `#${buttons.primaryText}`,
      borderRadius: `${buttons.borderRadius}px`,
      transition: `all ${globalData?.linksEffect?.transitionDuration || 300}ms ease`,
    };
  };

  const primaryColor = globalData?.buttons?.primaryBg
    ? `#${globalData.buttons.primaryBg}`
    : '#23A6F0';
  const primaryHoverColor = globalData?.buttons?.primaryHoverBg
    ? `#${globalData.buttons.primaryHoverBg}`
    : '#1a7ab0';

  // Debounce search term for filter filtering only
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(globalSearchTerm || '');
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [globalSearchTerm]);

  // Update price range when filterData changes
  useEffect(() => {
    if (filterData?.priceRange) {
      const newPriceRange = {
        min: filterData.priceRange.min,
        max: filterData.priceRange.max,
      };
      setLivePriceRange(newPriceRange);
      setSelectedFilters((prev) => ({
        ...prev,
        priceRange: newPriceRange,
      }));
    }
  }, [filterData]);

  // Memoized filtered options
  const filteredVendors = useMemo(() => {
    if (!filterData?.vendors) return [];
    if (!debouncedSearchTerm) return filterData.vendors;
    return filterData.vendors.filter((item) =>
      item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [filterData?.vendors, debouncedSearchTerm]);

  const filteredProductTypes = useMemo(() => {
    if (!filterData?.productTypes) return [];
    if (!debouncedSearchTerm) return filterData.productTypes;
    return filterData.productTypes.filter((item) =>
      item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [filterData?.productTypes, debouncedSearchTerm]);

  const filteredColors = useMemo(() => {
    if (!filterData?.colors) return [];
    if (!debouncedSearchTerm) return filterData.colors;
    return filterData.colors.filter((item) =>
      item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [filterData?.colors, debouncedSearchTerm]);

  const filteredSizes = useMemo(() => {
    if (!filterData?.sizes) return [];
    if (!debouncedSearchTerm) return filterData.sizes;
    return filterData.sizes.filter((item) =>
      item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [filterData?.sizes, debouncedSearchTerm]);

  const filteredTags = useMemo(() => {
    if (!filterData?.tags) return [];
    if (!debouncedSearchTerm) return filterData.tags;
    return filterData.tags.filter((item) =>
      item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [filterData?.tags, debouncedSearchTerm]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckboxChange = (type, value) => {
    setSelectedFilters((prev) => {
      const current = [...prev[type]];
      const index = current.indexOf(value);

      if (index === -1) {
        current.push(value);
      } else {
        current.splice(index, 1);
      }

      const newFilters = {...prev, [type]: current};
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const handleSliderChange = (type, value) => {
    const newValue = parseFloat(value) || 0;
    isSlidingRef.current = true;

    setLivePriceRange((prev) => ({
      ...prev,
      [type]: newValue,
    }));
  };

  const applyPriceFilterWithDebounce = useCallback(() => {
    if (sliderTimeoutRef.current) {
      clearTimeout(sliderTimeoutRef.current);
    }

    sliderTimeoutRef.current = setTimeout(() => {
      if (isSlidingRef.current) {
        isSlidingRef.current = false;

        setSelectedFilters((prev) => ({
          ...prev,
          priceRange: livePriceRange,
        }));

        onFilterChange?.({
          ...selectedFilters,
          priceRange: livePriceRange,
        });
      }
    }, 150);
  }, [livePriceRange, selectedFilters, onFilterChange]);

  const handleSliderMouseUp = () => {
    applyPriceFilterWithDebounce();
  };

  const handleSliderTouchEnd = () => {
    applyPriceFilterWithDebounce();
  };

  useEffect(() => {
    return () => {
      if (sliderTimeoutRef.current) {
        clearTimeout(sliderTimeoutRef.current);
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handlePriceInputChange = (type, value) => {
    const newValue = parseFloat(value) || 0;
    setLivePriceRange((prev) => ({
      ...prev,
      [type]: newValue,
    }));
  };

  const applyPriceFilter = () => {
    setSelectedFilters((prev) => ({
      ...prev,
      priceRange: livePriceRange,
    }));
    onFilterChange?.({
      ...selectedFilters,
      priceRange: livePriceRange,
    });
  };

  const clearAllFilters = () => {
    const resetFilters = {
      vendors: [],
      productTypes: [],
      colors: [],
      sizes: [],
      tags: [],
      priceRange: {
        min: filterData?.priceRange?.min || 0,
        max: filterData?.priceRange?.max || 1000,
      },
    };
    setSelectedFilters(resetFilters);
    setLivePriceRange({
      min: filterData?.priceRange?.min || 0,
      max: filterData?.priceRange?.max || 1000,
    });

    if (onGlobalSearchChange) {
      onGlobalSearchChange('');
    }

    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const activeFilterCount =
    selectedFilters.vendors.length +
    selectedFilters.productTypes.length +
    selectedFilters.colors.length +
    selectedFilters.sizes.length +
    selectedFilters.tags.length;

  const getColorClass = (colorName) => {
    const colorMap = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      orange: 'bg-orange-500',
      brown: 'bg-amber-800',
      black: 'bg-black',
      white: 'bg-white border border-gray-300',
      gray: 'bg-gray-500',
      grey: 'bg-gray-500',
      navy: 'bg-blue-800',
      'dark blue': 'bg-blue-800',
      'light blue': 'bg-blue-300',
      teal: 'bg-teal-500',
      cyan: 'bg-cyan-500',
      indigo: 'bg-indigo-500',
      violet: 'bg-violet-500',
      fuschia: 'bg-fuchsia-500',
      rose: 'bg-rose-500',
      emerald: 'bg-emerald-500',
      lime: 'bg-lime-500',
      amber: 'bg-amber-500',
      gold: 'bg-yellow-600',
      silver: 'bg-gray-400',
      bronze: 'bg-amber-700',
      beige: 'bg-amber-100',
      cream: 'bg-yellow-50',
      ivory: 'bg-amber-50',
      tan: 'bg-amber-200',
      khaki: 'bg-amber-100',
      olive: 'bg-green-700',
      mint: 'bg-green-300',
      lavender: 'bg-purple-300',
      coral: 'bg-red-300',
      salmon: 'bg-red-200',
      maroon: 'bg-red-800',
      burgundy: 'bg-red-900',
    };

    const lowerColor = colorName.toLowerCase().trim();

    if (colorMap[lowerColor]) {
      return colorMap[lowerColor];
    }

    for (const [key, value] of Object.entries(colorMap)) {
      if (lowerColor.includes(key)) {
        return value;
      }
    }
    return 'bg-gray-400';
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
    if (!isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={toggleMobileFilter}
          className="w-full bg-white border border-gray-300 px-4 py-3 text-sm font-medium flex items-center justify-between"
          style={{borderRadius: `${globalData?.buttons?.borderRadius || 8}px`}}
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            Filters
          </span>
          <span className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <span
                className="text-white text-xs px-2 py-1 rounded-full"
                style={{backgroundColor: primaryColor}}
              >
                {activeFilterCount}
              </span>
            )}
            <svg
              className={`w-5 h-5 transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </button>
      </div>

      {/* Desktop Filter */}
      <div className="hidden lg:block flex-shrink-0">
        <div className=" flex flex-col gap-[25px] p-[25px]">
          <FilterContent
            filterData={filterData}
            expandedSections={expandedSections}
            selectedFilters={selectedFilters}
            livePriceRange={livePriceRange}
            searchTerm={globalSearchTerm}
            debouncedSearchTerm={debouncedSearchTerm}
            activeFilterCount={activeFilterCount}
            searchInputRef={searchInputRef}
            filteredVendors={filteredVendors}
            filteredProductTypes={filteredProductTypes}
            filteredColors={filteredColors}
            filteredSizes={filteredSizes}
            filteredTags={filteredTags}
            onToggleSection={toggleSection}
            onCheckboxChange={handleCheckboxChange}
            onSearchChange={() => {}}
            onClearAll={clearAllFilters}
            onSliderChange={handleSliderChange}
            onSliderMouseUp={handleSliderMouseUp}
            onSliderTouchEnd={handleSliderTouchEnd}
            onPriceInputChange={handlePriceInputChange}
            onApplyPriceFilter={applyPriceFilter}
            getColorClass={getColorClass}
            filters={filters}
            onGlobalSearchChange={onGlobalSearchChange}
            globalSearchTerm={globalSearchTerm}
            locale={locale}
            currencySymbol={currencySymbol}
            globalData={globalData}
          />
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity">
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium">Filters</h2>
                  <button
                    onClick={toggleMobileFilter}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <FilterContent
                    filterData={filterData}
                    expandedSections={expandedSections}
                    selectedFilters={selectedFilters}
                    livePriceRange={livePriceRange}
                    searchTerm={globalSearchTerm}
                    debouncedSearchTerm={debouncedSearchTerm}
                    activeFilterCount={activeFilterCount}
                    searchInputRef={searchInputRef}
                    filteredVendors={filteredVendors}
                    filteredProductTypes={filteredProductTypes}
                    filteredColors={filteredColors}
                    filteredSizes={filteredSizes}
                    filteredTags={filteredTags}
                    onToggleSection={toggleSection}
                    onCheckboxChange={handleCheckboxChange}
                    onSearchChange={() => {}}
                    onClearAll={clearAllFilters}
                    onSliderChange={handleSliderChange}
                    onSliderMouseUp={handleSliderMouseUp}
                    onSliderTouchEnd={handleSliderTouchEnd}
                    onPriceInputChange={handlePriceInputChange}
                    onApplyPriceFilter={applyPriceFilter}
                    getColorClass={getColorClass}
                    filters={filters}
                    onGlobalSearchChange={onGlobalSearchChange}
                    globalSearchTerm={globalSearchTerm}
                    locale={locale}
                    currencySymbol={currencySymbol}
                    globalData={globalData}
                  />
                </div>

                <div className="border-t border-gray-200 px-4 py-3">
                  <button
                    onClick={toggleMobileFilter}
                    style={getMobileButtonStyle()}
                    className="w-full py-3 text-sm font-medium transition-opacity hover:opacity-90"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = primaryHoverColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = primaryColor;
                    }}
                  >
                    VIEW RESULTS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Filter);
