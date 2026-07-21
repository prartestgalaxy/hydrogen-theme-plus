import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CollectionFilters({ 
  products, 
  onFilterChange,
  collectionFilters,
  initialSort = 'featured'
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    availability: [],
    tags: [],
    priceRange: { min: '', max: '' }
  });
  const [sortBy, setSortBy] = useState(initialSort);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  // Refs for click outside detection
  const filterBarRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const filterDropdownRefs = {
    availability: useRef(null),
    price: useRef(null),
    tags: useRef(null)
  };

  // Handle click outside for all dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      // Close sort dropdown if clicked outside
      if (sortDropdownOpen && sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }

      // Close active filter dropdown if clicked outside
      if (activeFilter) {
        const activeDropdownRef = filterDropdownRefs[activeFilter];
        if (activeDropdownRef?.current && !activeDropdownRef.current.contains(event.target)) {
          // Check if click was on the filter button that opened it
          const filterButton = document.querySelector(`[data-filter-button="${activeFilter}"]`);
          if (filterButton && !filterButton.contains(event.target)) {
            setActiveFilter(null);
          }
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sortDropdownOpen, activeFilter]);

  // Extract all unique tags from products
  const allTags = [...new Set(products?.flatMap(product => product.tags || []) || [])];
  
  // Filter tags to only show relevant ones
  const relevantTags = ['Premium', 'Snow', 'Winter', 'Sport', 'Accessory'];
  const availableTags = allTags.filter(tag => relevantTags.includes(tag));

  // Calculate min and max prices from products
  const prices = products?.map(p => parseFloat(p.priceRange?.minVariantPrice?.amount || 0)) || [0];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Sort options
  const sortOptions = [
    { name: '✨ Featured', value: 'featured' },
    { name: '💰 Price: Low to High', value: 'price-asc' },
    { name: '💰 Price: High to Low', value: 'price-desc' },
    { name: '📈 Best Selling', value: 'best-selling' },
    { name: '🔤 A-Z', value: 'title-asc' },
    { name: '🔤 Z-A', value: 'title-desc' },
  ];

  const handleFilterChange = (type, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (type === 'availability') {
        newFilters.availability = newFilters.availability.includes(value)
          ? newFilters.availability.filter(v => v !== value)
          : [...newFilters.availability, value];
      }
      
      if (type === 'tags') {
        newFilters.tags = newFilters.tags.includes(value)
          ? newFilters.tags.filter(v => v !== value)
          : [...newFilters.tags, value];
      }
      
      if (type === 'priceRange') {
        newFilters.priceRange = value;
      }
      
      return newFilters;
    });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setSortDropdownOpen(false);
    onFilterChange(selectedFilters, value);
  };

  const applyFilters = () => {
    onFilterChange(selectedFilters, sortBy);
    setActiveFilter(null);
  };

  const clearFilters = () => {
    setSelectedFilters({
      availability: [],
      tags: [],
      priceRange: { min: '', max: '' }
    });
    setSortBy('featured');
    onFilterChange({
      availability: [],
      tags: [],
      priceRange: { min: '', max: '' }
    }, 'featured');
  };

  // Toggle filter dropdown
  const toggleFilter = (filterName) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  // Check if any filters are applied
  const hasActiveFilters = 
    selectedFilters.availability.length > 0 || 
    selectedFilters.tags.length > 0 || 
    selectedFilters.priceRange.min !== '' || 
    selectedFilters.priceRange.max !== '';

  // Get active filter count
  const activeFilterCount = 
    selectedFilters.availability.length + 
    selectedFilters.tags.length + 
    (selectedFilters.priceRange.min !== '' ? 1 : 0) + 
    (selectedFilters.priceRange.max !== '' ? 1 : 0);

  // Icons
  const XMarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
    </svg>
  );

  const ChevronDownIcon = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={classNames("w-4 h-4", className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );

  const TagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  );

  const PriceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const StockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375 7.444 2.25 12 2.25s8.25 1.847 8.25 4.125zm0 4.5c0 2.278-3.694 4.125-8.25 4.125S3.75 13.153 3.75 10.875m0 4.5c0 2.278 3.694 4.125 8.25 4.125s8.25-1.847 8.25-4.125" />
    </svg>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 relative z-200" ref={filterBarRef}>
      {/* Mobile filter dialog */}
      {mobileFiltersOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 flex max-w-full">
            <div className="w-screen max-w-md">
              <div className="flex h-full flex-col bg-white shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <FilterContent
                    collectionFilters={collectionFilters}
                    availableTags={availableTags}
                    selectedFilters={selectedFilters}
                    handleFilterChange={handleFilterChange}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    isMobile={true}
                    TagIcon={TagIcon}
                    PriceIcon={PriceIcon}
                    StockIcon={StockIcon}
                    ChevronDownIcon={ChevronDownIcon}
                  />
                </div>
                <div className="border-t px-6 py-4">
                  <button
                    onClick={() => {
                      applyFilters();
                      setMobileFiltersOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filter Bar - Horizontal Layout */}
      <div className="hidden lg:block">
        {/* Header with stats and sort */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              <span className="text-2xl font-bold text-gray-900">{products?.length || 0}</span> Products
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span>Clear all</span>
                <XMarkIcon />
              </button>
            )}
          </div>

          {/* Sort dropdown - Modern style */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
            >
              <span>Sort by: {sortOptions.find(opt => opt.value === sortBy)?.name || 'Featured'}</span>
              <ChevronDownIcon className={sortDropdownOpen ? 'rotate-180' : ''} />
            </button>

            <AnimatePresence>
              {sortDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-30"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={classNames(
                        sortBy === option.value 
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700' 
                          : 'text-gray-700 hover:bg-gray-50',
                        'block w-full text-left px-4 py-2.5 text-sm transition-colors'
                      )}
                    >
                      {option.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Horizontal Filter Sections */}
        <div className="flex items-stretch">
          {/* Availability Filter */}
          {collectionFilters?.filters?.availability && (
            <div className="relative flex-1 min-w-[120px]">
              <button
                data-filter-button="availability"
                onClick={() => toggleFilter('availability')}
                className={classNames(
                  'w-full h-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-r border-gray-100',
                  activeFilter === 'availability' ? 'bg-blue-50' : ''
                )}
              >
                <div className="flex items-center space-x-2">
                  <StockIcon />
                  <span className="font-medium text-gray-700 text-sm">Availability</span>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedFilters.availability.length > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {selectedFilters.availability.length}
                    </span>
                  )}
                  <ChevronDownIcon className={activeFilter === 'availability' ? 'rotate-180' : ''} />
                </div>
              </button>

              <AnimatePresence>
                {activeFilter === 'availability' && (
                  <motion.div
                    ref={filterDropdownRefs.availability}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-200"
                    style={{ zIndex: 100 }}
                  >
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.availability.includes('in-stock')}
                          onChange={() => handleFilterChange('availability', 'in-stock')}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">In Stock</span>
                      </label>
                      <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.availability.includes('out-of-stock')}
                          onChange={() => handleFilterChange('availability', 'out-of-stock')}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Out of Stock</span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Price Range Filter */}
          {collectionFilters?.filters?.price && (
            <div className="relative flex-1 min-w-[120px]">
              <button
                data-filter-button="price"
                onClick={() => toggleFilter('price')}
                className={classNames(
                  'w-full h-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-r border-gray-100',
                  activeFilter === 'price' ? 'bg-blue-50' : ''
                )}
              >
                <div className="flex items-center space-x-2">
                  <PriceIcon />
                  <span className="font-medium text-gray-700 text-sm">Price</span>
                </div>
                <div className="flex items-center space-x-2">
                  {(selectedFilters.priceRange.min !== '' || selectedFilters.priceRange.max !== '') && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">1</span>
                  )}
                  <ChevronDownIcon className={activeFilter === 'price' ? 'rotate-180' : ''} />
                </div>
              </button>

              <AnimatePresence>
                {activeFilter === 'price' && (
                  <motion.div
                    ref={filterDropdownRefs.price}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-200"
                    style={{ zIndex: 100 }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Min</label>
                          <input
                            type="number"
                            placeholder={`$${minPrice}`}
                            value={selectedFilters.priceRange.min}
                            onChange={(e) => handleFilterChange('priceRange', { 
                              ...selectedFilters.priceRange, 
                              min: e.target.value 
                            })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <span className="text-gray-400 mt-6">—</span>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Max</label>
                          <input
                            type="number"
                            placeholder={`$${maxPrice}`}
                            value={selectedFilters.priceRange.max}
                            onChange={(e) => handleFilterChange('priceRange', { 
                              ...selectedFilters.priceRange, 
                              max: e.target.value 
                            })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Tags Filter */}
          {collectionFilters?.filters?.tags && availableTags.length > 0 && (
            <div className="relative flex-1 min-w-[120px]">
              <button
                data-filter-button="tags"
                onClick={() => toggleFilter('tags')}
                className={classNames(
                  'w-full h-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-r border-gray-100',
                  activeFilter === 'tags' ? 'bg-blue-50' : ''
                )}
              >
                <div className="flex items-center space-x-2">
                  <TagIcon />
                  <span className="font-medium text-gray-700 text-sm">Tags</span>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedFilters.tags.length > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {selectedFilters.tags.length}
                    </span>
                  )}
                  <ChevronDownIcon className={activeFilter === 'tags' ? 'rotate-180' : ''} />
                </div>
              </button>

              <AnimatePresence>
                {activeFilter === 'tags' && (
                  <motion.div
                    ref={filterDropdownRefs.tags}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-20"
                    style={{ zIndex: 100 }}
                  >
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {availableTags.map((tag) => (
                        <label key={tag} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFilters.tags.includes(tag)}
                            onChange={() => handleFilterChange('tags', tag)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{tag}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Apply Filters Button */}
          <div className="flex items-center px-4 py-4">
            <button
              onClick={applyFilters}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-sm whitespace-nowrap"
            >
              Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden px-4 py-3">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
        >
          <FilterIcon />
          <span>Filter & Sort</span>
          {activeFilterCount > 0 && (
            <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

// Filter Content Component (reused for mobile)
function FilterContent({ 
  collectionFilters, 
  availableTags, 
  selectedFilters, 
  handleFilterChange, 
  minPrice, 
  maxPrice,
  isMobile,
  TagIcon,
  PriceIcon,
  StockIcon,
  ChevronDownIcon
}) {
  const [mobileSections, setMobileSections] = useState({
    availability: true,
    price: true,
    tags: true
  });

  const toggleMobileSection = (section) => {
    setMobileSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Availability Filter - Mobile */}
      {collectionFilters?.filters?.availability && (
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleMobileSection('availability')}
            className="flex items-center justify-between w-full py-2"
          >
            <div className="flex items-center space-x-2">
              <StockIcon />
              <span className="font-medium text-gray-900">Availability</span>
            </div>
            <ChevronDownIcon className={classNames(
              'transition-transform',
              mobileSections.availability ? 'rotate-180' : ''
            )} />
          </button>
          
          {mobileSections.availability && (
            <div className="mt-3 space-y-2 pl-7">
              <label className="flex items-center space-x-3 py-1">
                <input
                  type="checkbox"
                  checked={selectedFilters.availability.includes('in-stock')}
                  onChange={() => handleFilterChange('availability', 'in-stock')}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-600">In Stock</span>
              </label>
              <label className="flex items-center space-x-3 py-1">
                <input
                  type="checkbox"
                  checked={selectedFilters.availability.includes('out-of-stock')}
                  onChange={() => handleFilterChange('availability', 'out-of-stock')}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-600">Out of Stock</span>
              </label>
            </div>
          )}
        </div>
      )}

      {/* Price Filter - Mobile */}
      {collectionFilters?.filters?.price && (
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleMobileSection('price')}
            className="flex items-center justify-between w-full py-2"
          >
            <div className="flex items-center space-x-2">
              <PriceIcon />
              <span className="font-medium text-gray-900">Price</span>
            </div>
            <ChevronDownIcon className={classNames(
              'transition-transform',
              mobileSections.price ? 'rotate-180' : ''
            )} />
          </button>
          
          {mobileSections.price && (
            <div className="mt-3 space-y-3 pl-7">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder={`Min $${minPrice}`}
                  value={selectedFilters.priceRange.min}
                  onChange={(e) => handleFilterChange('priceRange', { 
                    ...selectedFilters.priceRange, 
                    min: e.target.value 
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder={`Max $${maxPrice}`}
                  value={selectedFilters.priceRange.max}
                  onChange={(e) => handleFilterChange('priceRange', { 
                    ...selectedFilters.priceRange, 
                    max: e.target.value 
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tags Filter - Mobile */}
      {collectionFilters?.filters?.tags && availableTags.length > 0 && (
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleMobileSection('tags')}
            className="flex items-center justify-between w-full py-2"
          >
            <div className="flex items-center space-x-2">
              <TagIcon />
              <span className="font-medium text-gray-900">Tags</span>
            </div>
            <ChevronDownIcon className={classNames(
              'transition-transform',
              mobileSections.tags ? 'rotate-180' : ''
            )} />
          </button>
          
          {mobileSections.tags && (
            <div className="mt-3 space-y-2 pl-7">
              {availableTags.map((tag) => (
                <label key={tag} className="flex items-center space-x-3 py-1">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag)}
                    onChange={() => handleFilterChange('tags', tag)}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-600">{tag}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}