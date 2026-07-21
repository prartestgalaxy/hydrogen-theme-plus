import {createContext, useContext, useEffect, useState} from 'react';

/*
|--------------------------------------------------------------------------
| Aside Component
|--------------------------------------------------------------------------
| This component renders a sidebar drawer with overlay.
| It can be used for:
| - Search drawer
| - Cart drawer
| - Mobile menu drawer
|
| Example usage:
|
| <Aside type="search" heading="Search">
|   <input type="search" />
| </Aside>
|
*/

/**
 * Aside Component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content inside aside
 * @param {AsideType} props.type - Aside type ('search', 'cart', 'mobile')
 * @param {React.ReactNode} props.heading - Title shown in header
 */
export function Aside({ children, heading, type }) {

  // Get current aside state from context
  const { type: activeType, close } = useAside();

  // Check if this aside should be visible
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event) {
          if (event.key === 'Escape') {
            close();
          }
        },
        { signal: abortController.signal },
      );
    }

    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      role="dialog"
      className={`overlay ${expanded ? 'expanded' : ''}`}
    >
      {/* Clicking outside drawer closes it */}
      <button className="close-outside" onClick={close} />

      {/* Aside drawer */}
      <aside
        className={`aside-panel flex flex-col h-full ${type === 'search' ? 'search-aside' : ''
          }`}
        data-type={type}
      >

        <div className="px-4 md:px-6 ">
          <header className="flex items-center justify-between  border-b border-gray-200">

            {/* Heading */}

            <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800">
              {heading}
            </h3>

            {/* Close button */}
            <button
              className="w-[20px] h-[20px] sm:w-[40px] sm:h-[40px] md:w-[44px] md:h-[44px] 
               rounded-[28px] flex items-center justify-center 
               hover:bg-[#fafafa] transition"
              onClick={close}
              aria-label="Close"
            >
              <svg
                className="w-[14px] h-[14px] sm:w-[20px] sm:h-[20px] md:w-[24px] md:h-[24px]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                  fill="black"
                />
              </svg>
            </button>

          </header>
        </div>

        {/* Aside content */}
        <main className="flex flex-col h-full overflow-hidden">
          {children}
        </main>
      </aside>
    </div>
  );
}



const AsideContext = createContext(null);



Aside.Provider = function AsideProvider({ children }) {

  // Current open drawer type
  const [type, setType] = useState('closed');

  return (
    <AsideContext.Provider
      value={{
        type,

        // Open drawer (search/cart/mobile)
        open: setType,

        // Close drawer
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};



export function useAside() {

  const aside = useContext(AsideContext);

  // Safety check
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }

  return aside;
}



/** @typedef {'search' | 'cart' | 'mobile' | 'closed'} AsideType */

/**
 * @typedef {Object} AsideContextValue
 * @property {AsideType} type
 * @property {(mode: AsideType) => void} open
 * @property {() => void} close
 */

/** @typedef {import('react').ReactNode} ReactNode */