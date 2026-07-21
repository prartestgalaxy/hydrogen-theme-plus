import {accordionGroupType} from './objects/module/accordionGroupType'
import {accordionType} from './objects/module/accordionType'
import {calloutType} from './objects/module/calloutType'
import {callToActionType} from './objects/module/callToActionType'
import {collectionGroupType} from './objects/collection/collectionGroupType'
import {collectionLinksType} from './objects/collection/collectionLinksType'
import {collectionReferenceType} from './objects/module/collectionReferenceType'
import {collectionRuleType} from './objects/shopify/collectionRuleType'
import {customProductOptionColorObjectType} from './objects/customProductOption/customProductOptionColorObjectType'
import {customProductOptionColorType} from './objects/customProductOption/customProductOptionColorType'
import {customProductOptionSizeObjectType} from './objects/customProductOption/customProductOptionSizeObjectType'
import {customProductOptionSizeType} from './objects/customProductOption/customProductOptionSizeType'
import {footerType} from './objects/global/footerType'
import {gridItemType} from './objects/module/gridItemType'
import {gridType} from './objects/module/gridType'
import {heroType} from './objects/module/heroType'
import {imageCallToActionType} from './objects/module/imageCallToActionType'
import {imageFeaturesType} from './objects/module/imageFeaturesType'
import {imageFeatureType} from './objects/module/imageFeatureType'
import {imageWithProductHotspotsType} from './objects/hotspot/imageWithProductHotspotsType'
// import {imageWithTextType} from './objects/module/imageWithTextType'
import {instagramType} from './objects/module/instagramType'
import {inventoryType} from './objects/shopify/inventoryType'
import {linkEmailType} from './objects/link/linkEmailType'
import {linkExternalType} from './objects/link/linkExternalType'
import {linkInternalType} from './objects/link/linkInternalType'
import {linkProductType} from './objects/link/linkProductType'
import {linkRouteType} from './objects/link/linkRouteType'
import {menuLinksType} from './objects/global/menuLinksType'
import {menuType} from './objects/global/menuType'
import {notFoundPageType} from './objects/global/notFoundPageType'
import {optionType} from './objects/shopify/optionType'
import {placeholderStringType} from './objects/shopify/placeholderStringType'
import {priceRangeType} from './objects/shopify/priceRangeType'
import {productFeaturesType} from './objects/module/productFeaturesType'
import {productHotspotsType} from './objects/hotspot/productHotspotsType'
import {productReferenceType} from './objects/module/productReferenceType'
import {productWithVariantType} from './objects/shopify/productWithVariantType'
import {proxyStringType} from './objects/shopify/proxyStringType'
import {seoType} from './objects/seoType'
import {shopifyCollectionType} from './objects/shopify/shopifyCollectionType'
import {shopifyProductType} from './objects/shopify/shopifyProductType'
import {shopifyProductVariantType} from './objects/shopify/shopifyProductVariantType'
import {shopType} from './objects/shopify/shopType'
import {spotType} from './objects/hotspot/spotType'

import {heroBannerType} from './objects/module/heroBannerType'
import {imageWithTextType} from './objects/module/imageWithTextType'
import {productGridType} from './objects/module/productGridType'
import {collectionCarouselType} from './objects/module/collectionCarouselType'

import {newsletterType} from './objects/module/newsletterType'
import {servicesGridType} from './objects/module/servicesGridType'

import {headerType} from './objects/module/header'

import {headerMenuItem} from './objects/module/headerMenuItem'
import {promotionalGridType} from './objects/module/promotionalGrid'
import {recentlyViewed} from './objects/global/recentlyViewed'
import {featuredBlogsType} from './objects/module/featuredBlogType'
import {faqType} from './objects/module/faqType'

// Objects used as annotations must be imported first
const annotations = [
  linkEmailType,
  linkExternalType,
  linkInternalType,
  linkProductType,
  linkRouteType,
]

const objects = [
  accordionGroupType,
  accordionType,
  calloutType,
  callToActionType,
  collectionGroupType,
  collectionLinksType,
  collectionReferenceType,
  collectionRuleType,
  customProductOptionColorObjectType,
  customProductOptionColorType,
  customProductOptionSizeObjectType,
  customProductOptionSizeType,
  footerType,
  gridItemType,
  gridType,
  heroType,
  imageCallToActionType,
  imageFeaturesType,
  imageFeatureType,
  imageWithProductHotspotsType,
  instagramType,
  inventoryType,
  menuLinksType,
  menuType,
  notFoundPageType,
  optionType,
  placeholderStringType,
  priceRangeType,
  productFeaturesType,
  productHotspotsType,
  productReferenceType,
  productWithVariantType,
  proxyStringType,
  recentlyViewed,
  seoType,
  shopifyCollectionType,
  shopifyProductType,
  shopifyProductVariantType,
  shopType,
  spotType,
  heroBannerType,
  imageWithTextType,
  productGridType,
  collectionCarouselType,
  newsletterType,
  headerType,
  headerMenuItem,
  link,
  bannerSliderType,
  announcementBarType,
  plpBanner,
  filterSettings,
  logoSlider,
  servicesGridType,
  featuredBlogsType,
  pdpDetailsSection,
  featureHighlights,
  promotionalGridType,
  faqType,
]

import {portableTextType} from './portableText/portableTextType'
import {portableTextSimpleType} from './portableText/portableTextSimpleType'

const blocks = [portableTextType, portableTextSimpleType]

import {collectionType} from './documents/collection'
import {colorThemeType} from './documents/colorTheme'
import {pageType} from './documents/page'
import {productType} from './documents/product'
import {productVariantType} from './documents/productVariant'
import {aboutPageSchemaType} from './documents/aboutPageSchema'

const documents = [
  collectionType,
  colorThemeType,
  pageType,
  productType,
  productVariantType,
  aboutPageSchemaType,
]

import {homeType} from './singletons/homeType'
import {settingsType} from './singletons/settingsType'
import {link} from './objects/module/link'
import {bannerSliderType} from './objects/module/bannerSliderType'
import {announcementBarType} from './objects/module/announcementBar'
import {wishlistSettingsType} from './singletons/wishlistSettings'
import {freeShippingSettingsType} from './singletons/freeShippingSettingsType'
import {recommendationsSettingsType} from './singletons/recommendationsSettings'
import {maincollectionsetting} from './singletons/MainCollection'
import {inventoryThresholdSettingsType} from './singletons/inventoryThresholdSettings'
import plpBanner from './objects/module/plpBanner'
import filterSettings from './objects/module/filterSettings'
import plpSettings from './singletons/plpSettings'
import logoSlider from './objects/module/logoSlider'
import pdpSettings from './singletons/pdpSettings'
import collectionPageSettings from './singletons/collectionsettings'
import pdpDetailsSection from './objects/module/pdpDetailsSection'
import featureHighlights from './objects/module/featureHighlights'
import cartSettings from './singletons/CartSetting'
import {contactPageType} from './singletons/contactPage'

import globalSettings from './singletons/GlobalSetting'

const singletons = [
  homeType,
  settingsType,
  wishlistSettingsType,
  freeShippingSettingsType,
  recommendationsSettingsType,
  inventoryThresholdSettingsType,
  plpSettings,
  pdpSettings,
  cartSettings,
  contactPageType,
  collectionPageSettings,
  maincollectionsetting,
  globalSettings,
]

export const schemaTypes = [...annotations, ...objects, ...singletons, ...blocks, ...documents]
