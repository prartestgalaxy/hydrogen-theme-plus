// // import HeroBanner from '../HeroBanner'
// // import ImageWithText from '../ImageWithText'
// // import ProductGrid from '../ProductGrid'
// // import CollectionCarousel from '../CollectionCarousel'
// // import NewArrivals from '../NewArrivals'
// // import SaleBanner from '../SaleBanner'
// // import Newsletter from '../Newsletter'
// // import BannerSlider from '../BannerSlider'
// // import FAQ from '~/components/Faq';

// // export function Modules({ modules, globalSettings, isLoggedIn, wishlistSettings, activeCurrency, faqData }) {
// //   if (!modules?.length) return null;



// //   return modules.map((module) => {

// //     // Helper to log and skip undefined components
// //     const renderModule = (Component, mod) => {
// //       if (!Component) {
// //         console.error(`Module Error: Component for type "${mod._type}" is undefined. Check your export/import.`);
// //         return null;
// //       }
      
// //       // For product-related components, pass wishlist props
// //       if (mod._type === 'productGrid' || mod._type === 'newArrivals') {
// //         return (
// //           <Component 
// //             key={mod._key} 
// //             module={mod} 
// //             globalSettings={globalSettings}
// //             isLoggedIn={isLoggedIn}
// //             wishlistSettings={wishlistSettings}
// //             activeCurrency={activeCurrency}
// //           />
// //         );
// //       }
      
// //       // For other components, just pass the regular props
// //       return <Component key={mod._key} module={mod} globalSettings={globalSettings} />;

 
// //     };

// //     switch (module._type) {
// //       case 'bannerSlider':
// //         return renderModule(BannerSlider, module);

// //       case 'heroBanner':
// //         return renderModule(HeroBanner, module);

// //       case 'imageWithText':
// //         return renderModule(ImageWithText, module);

// //       case 'productGrid':
// //         return renderModule(ProductGrid, module);

// //       case 'collectionCarousel':
// //         return renderModule(CollectionCarousel, module);

// //       case 'newArrivals':
// //         return renderModule(NewArrivals, module);

// //       case 'saleBanner':
// //         return renderModule(SaleBanner, module);

// //       case 'newsletter':
// //         return renderModule(Newsletter, module);
   

// //       default:
// //         return null
// //     }
  
// //   })
// // }

// import HeroBanner from '../HeroBanner'
// import ImageWithText from '../ImageWithText'
// import ProductGrid from '../ProductGrid'
// import CollectionCarousel from '../CollectionCarousel'
// import NewArrivals from '../NewArrivals'
// import SaleBanner from '../SaleBanner'
// import Newsletter from '../Newsletter'
// import BannerSlider from '../BannerSlider'
// import FAQ from '~/components/Faq';
// import ServicesGrid from '~/components/ServicesGrid';
// import { FeaturedBlogs } from '../FeaturedBlogs'
// import LogoSlider from '../LogoSlider'
// import PromotionalGrid from '../PromotionalGrid'

// export function Modules({ modules, globalSettings, isLoggedIn, wishlistSettings, activeCurrency, activeCountry }) {
//   if (!modules?.length) return null;

//   // Helper to log and skip undefined components
//   const renderModule = (Component, mod) => {
//     if (!Component) {
//       console.error(`Module Error: Component for type "${mod._type}" is undefined. Check your export/import.`);
//       return null;
//     }
    
//     // For product-related components, pass wishlist props
//     if (mod._type === 'productGrid' || mod._type === 'newArrivals') {
//       return (
//         <Component 
//           key={mod._key} 
//           module={mod} 
//           globalSettings={globalSettings}
//           isLoggedIn={isLoggedIn}
//           wishlistSettings={wishlistSettings}
//           activeCurrency={activeCurrency}
//           activeCountry={activeCountry}
//         />
//       );
//     }
    
//     // For other components, just pass the regular props
//     return <Component key={mod._key} module={mod} globalSettings={globalSettings} />;
//   };

//   return (
//     <>
//       {/* 1. Map through all the dynamic modules from Sanity */}
//       {modules.map((module) => {
//         switch (module._type) {
//           case 'bannerSlider':
//             return renderModule(BannerSlider, module);
//           case 'heroBanner':
//             return renderModule(HeroBanner, module);
//           case 'imageWithText':
//             return renderModule(ImageWithText, module);
//           case 'productGrid':
//             return renderModule(ProductGrid, module);
//           case 'collectionCarousel':
//             return renderModule(CollectionCarousel, module);
//           case 'newArrivals':
//             return renderModule(NewArrivals, module);
//           case 'saleBanner':
//             return renderModule(SaleBanner, module);
//           case 'newsletter':
//             return renderModule(Newsletter, module);
//           case 'servicesGrid':
//             return renderModule(ServicesGrid, module);
//           case 'featuredBlogs':
//             return renderModule(FeaturedBlogs, module);
//           case 'promotionalGrid' :
//             return renderModule(PromotionalGrid, module);
//           case 'faq' :
//             return renderModule(FAQ, module);
//           case 'logoSlider':
//             return (
//              <LogoSlider 
//                 key={module._key} 
//                 data={module} 
//                 globalSettings={globalSettings} 
//               />
//             );
//           default:
//             return null;
//         }
//       })}
      
     
//       {/* {faqData && <FAQ module={faqData} />} */}
//     </>
//   );
// }
import HeroBanner from '../HeroBanner'
import ImageWithText from '../ImageWithText'
import ProductGrid from '../ProductGrid'
import CollectionCarousel from '../CollectionCarousel'
import Newsletter from '../Newsletter'
import BannerSlider from '../BannerSlider'
import FAQ from '~/components/Faq';
import ServicesGrid from '~/components/ServicesGrid';
import { FeaturedBlogs } from '../FeaturedBlogs'
import LogoSlider from '../LogoSlider'
import PromotionalGrid from '../PromotionalGrid'

export function Modules({ 
  modules, 
  globalSettings, 
  globalSettingsData,
  isLoggedIn, 
  wishlistSettings, 
  activeCurrency, 
  activeCountry,
  wishlist // Add this prop
}) {

  // console.log("Global settings in modules : "+ JSON.stringify(globalSettingsData,null,2))

  if (!modules?.length) return null;

  // Helper to log and skip undefined components
  const renderModule = (Component, mod) => {
    if (!Component) {
      console.error(`Module Error: Component for type "${mod._type}" is undefined. Check your export/import.`);
      return null;
    }
  
    // For product-related components, pass wishlist props
    if (mod._type === 'productGrid') {
      return (
        <Component 
          key={mod._key} 
          module={mod} 
          globalSettings={globalSettings}
          isLoggedIn={isLoggedIn}
          wishlistSettings={wishlistSettings}
          activeCurrency={activeCurrency}
          activeCountry={activeCountry}
          wishlist={wishlist} // Pass wishlist data
          globalSettingsData={globalSettingsData}
        />
      );
    }
    
    // For other components, just pass the regular props
    return <Component key={mod._key} module={mod} globalSettings={globalSettings} globalSettingsData={globalSettingsData} activeCountry={activeCountry} />;
  };

  return (
    <>
      {/* 1. Map through all the dynamic modules from Sanity */}
      {modules.map((module) => {
        switch (module._type) {
          case 'bannerSlider':
            return renderModule(BannerSlider, module);
          case 'heroBanner':
            return renderModule(HeroBanner, module);
          case 'imageWithText':
            return renderModule(ImageWithText, module);
          case 'productGrid':
            return renderModule(ProductGrid, module);
          case 'collectionCarousel':
            return renderModule(CollectionCarousel, module);
          case 'newsletter':
            return renderModule(Newsletter, module);
          case 'servicesGrid':
            return renderModule(ServicesGrid, module);
          case 'featuredBlogs':
            return renderModule(FeaturedBlogs, module);
          case 'promotionalGrid' :
            return renderModule(PromotionalGrid, module);
          case 'faq' :
            return renderModule(FAQ, module);
          case 'logoSlider':
            return (
             <LogoSlider 
                key={module._key} 
                data={module} 
                globalSettings={globalSettings} 
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}