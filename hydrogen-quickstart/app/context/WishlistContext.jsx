// // import {createContext, useContext} from 'react';

// // const WishlistContext = createContext(null);

// // // ✅ Default settings when Sanity returns null or no document exists
// // const DEFAULT_SETTINGS = {
// //   enabled: false,
// //   requireLogin: true,
// //   heartIconColor: 'red-500',
// //   buttonPosition: 'top-right',
// //   maxItems: 0,
// //   showCount: true,
// //   showNotification: true
// // };

// // export function WishlistProvider({ 
// //   children, 
// //   settings 
// // }) {
// //   // ✅ Use provided settings or fallback to defaults
// //   const safeSettings = settings || DEFAULT_SETTINGS;
  
// //   const isEnabled = safeSettings.enabled;

// //   const canAddToWishlist = (isLoggedIn) => {
// //     if (!isEnabled) return false;
// //     if (safeSettings.requireLogin && !isLoggedIn) return false;
// //     return true;
// //   };

// //   const getButtonPosition = () => {
// //     switch (safeSettings.buttonPosition) {
// //       case 'top-left': return 'top-2 left-2';
// //       case 'bottom-right': return 'bottom-2 right-2';
// //       case 'bottom-left': return 'bottom-2 left-2';
// //       default: return 'top-2 right-2';
// //     }
// //   };

// //   const getHeartColor = (filled) => {
// //     const color = safeSettings.heartIconColor;
// //     return filled 
// //       ? `fill-${color} stroke-${color} text-${color}`
// //       : `fill-none stroke-gray-600 hover:stroke-${color} hover:text-${color}`;
// //   };

// //   const value = {
// //     settings: safeSettings,
// //     isEnabled,
// //     canAddToWishlist,
// //     getButtonPosition,
// //     getHeartColor,
// //     maxItems: safeSettings.maxItems,
// //     showCount: safeSettings.showCount,
// //     showNotification: safeSettings.showNotification,
// //   };

// //   return (
// //     <WishlistContext.Provider value={value}>
// //       {children}
// //     </WishlistContext.Provider>
// //   );
// // }

// // export function useWishlist() {
// //   const context = useContext(WishlistContext);
// //   if (!context) {
// //     throw new Error('useWishlist must be used within a WishlistProvider');
// //   }
// //   return context;
// // }
// import { createContext, useContext, useState } from 'react';

// const WishlistContext = createContext(null);

// const DEFAULT_SETTINGS = {
//   enabled: false,
//   requireLogin: true,
//   heartIconColor: 'red-500',
//   buttonPosition: 'top-right',
//   maxItems: 0,
//   showCount: true,
//   showNotification: true
// };

// export function WishlistProvider({ 
//   children, 
//   settings,
//   initialWishlist   // ✅ ADD THIS
// }) {

//   // ✅ SETTINGS (your existing logic)
//   const safeSettings = settings || DEFAULT_SETTINGS;
//   const isEnabled = safeSettings.enabled;

//   // ✅ NEW: STATE FOR WISHLIST
//   const [wishlist, setWishlist] = useState(
//     initialWishlist?.products || []
//   );

//   const count = wishlist.length;

//   // ✅ EXISTING FUNCTIONS
//   const canAddToWishlist = (isLoggedIn) => {
//     if (!isEnabled) return false;
//     if (safeSettings.requireLogin && !isLoggedIn) return false;
//     return true;
//   };

//   const getButtonPosition = () => {
//     switch (safeSettings.buttonPosition) {
//       case 'top-left': return 'top-2 left-2';
//       case 'bottom-right': return 'bottom-2 right-2';
//       case 'bottom-left': return 'bottom-2 left-2';
//       default: return 'top-2 right-2';
//     }
//   };

//   const getHeartColor = (filled) => {
//     const color = safeSettings.heartIconColor;
//     return filled 
//       ? `fill-${color} stroke-${color} text-${color}`
//       : `fill-none stroke-gray-600 hover:stroke-${color} hover:text-${color}`;
//   };

//   // ✅ FINAL VALUE (IMPORTANT)
//   const value = {
//     // settings
//     settings: safeSettings,
//     isEnabled,
//     canAddToWishlist,
//     getButtonPosition,
//     getHeartColor,
//     maxItems: safeSettings.maxItems,
//     showCount: safeSettings.showCount,
//     showNotification: safeSettings.showNotification,

//     // ✅ NEW: wishlist logic
//     wishlist,
//     setWishlist,
//     count
//   };

//   return (
//     <WishlistContext.Provider value={value}>
//       {children}
//     </WishlistContext.Provider>
//   );
// }

// export function useWishlist() {
//   const context = useContext(WishlistContext);
//   if (!context) {
//     throw new Error('useWishlist must be used within a WishlistProvider');
//   }
//   return context;
// }
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WishlistContext = createContext(null);

const DEFAULT_SETTINGS = {
  enabled: false,
  requireLogin: true,
  heartIconColor: 'red-500',
  buttonPosition: 'top-right',
  maxItems: 0,
  showCount: true,
  showNotification: true
};

export function WishlistProvider({ 
  children, 
  settings,
  initialWishlist,
  isLoggedIn = false  // ✅ Add isLoggedIn prop
}) {

  const safeSettings = settings || DEFAULT_SETTINGS;
  const isEnabled = safeSettings.enabled;

  // State for wishlist
  const [wishlist, setWishlist] = useState(initialWishlist?.products || []);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(initialWishlist?.products?.length || 0);

  // Update count when wishlist changes
  useEffect(() => {
    setCount(wishlist.length);
  }, [wishlist]);

  // ✅ Fixed: canAddToWishlist as a value, not a function
  const canAddToWishlist = useCallback(() => {
    if (!isEnabled) return false;
    if (safeSettings.requireLogin && !isLoggedIn) return false;
    return true;
  }, [isEnabled, safeSettings.requireLogin, isLoggedIn]);

  // ✅ Function to fetch wishlist from API
  const fetchWishlist = useCallback(async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/wishlist', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      if (data.success) {
        setWishlist(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // ✅ Function to toggle product in wishlist
  const toggleWishlist = useCallback(async (productData) => {
    if (!isEnabled) {
      console.warn('Wishlist is disabled');
      return { success: false, error: 'Wishlist disabled' };
    }

    if (safeSettings.requireLogin && !isLoggedIn) {
      window.location.href = '/signin';
      return { success: false, requiresLogin: true };
    }

    setLoading(true);
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (data.success) {
        setWishlist(data.wishlist || []);
        return { success: true, isInWishlist: data.isInWishlist, count: data.wishlistCount };
      } else {
        if (data.requiresLogin) {
          window.location.href = '/signin';
        }
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [isEnabled, safeSettings.requireLogin, isLoggedIn]);

  // ✅ Check if product is in wishlist
  const isInWishlist = useCallback((productId, variantId = null) => {
    if (variantId) {
      return wishlist.some(item => item.variantId === variantId);
    }
    // Compare by numeric ID to handle both formats
    return wishlist.some(item => {
      const itemId = item.id?.match(/\d+/)?.[0];
      const targetId = productId?.match(/\d+/)?.[0];
      return itemId && targetId && itemId === targetId;
    });
  }, [wishlist]);

  const getButtonPosition = () => {
    switch (safeSettings.buttonPosition) {
      case 'top-left': return 'top-2 left-2';
      case 'bottom-right': return 'bottom-2 right-2';
      case 'bottom-left': return 'bottom-2 left-2';
      default: return 'top-2 right-2';
    }
  };

  const getHeartColor = (filled) => {
    const color = safeSettings.heartIconColor;
    return filled 
      ? `fill-${color} stroke-${color} text-${color}`
      : `fill-none stroke-gray-600 hover:stroke-${color} hover:text-${color}`;
  };

  const value = {
    // Settings
    settings: safeSettings,
    isEnabled,
    canAddToWishlist,  // ✅ Now a boolean value, not a function
    getButtonPosition,
    getHeartColor,
    maxItems: safeSettings.maxItems,
    showCount: safeSettings.showCount,
    showNotification: safeSettings.showNotification,
    
    // Wishlist state
    wishlist,
    setWishlist,
    count,
    loading,
    
    // Actions
    toggleWishlist,
    isInWishlist,
    fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}