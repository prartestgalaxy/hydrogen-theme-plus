import {ListItemBuilder, StructureBuilder, StructureResolver} from 'sanity/structure'
import collections from './collectionStructure'
import colorThemes from './colorThemeStructure'
import home from './homeStructure'
import pages from './pageStructure'
import products from './productStructure'
import settings from './settingStructure'
import wishlist from './wishlistStructure'
import freeShippingbar from './freeshippingbarsetting'
import RecommendationProduct from './recommendationproduct'
import Collectionfilter from './collectionFilter'
import recentlyViewedStructure from './recentlyViewedStructure'
import inventoryThresholdSettings from './inventoryThresholdSetting'
import PLPPageSetting from './PLPpage'
import PDPPageSetting from './PDPpage'
import CartPageSetting from './CartSetting'
import CollectionStruct from './ccs'
import CollectionMain from './maincollection'
import AboutPageSchemaStruct from './aboutPageSchemaStructure'
import ContactStruct from './contactstructure'
import GlobalStruct from './GlobalSetting'

/**
 * Structure overrides
 *
 * Sanity Studio automatically lists document types out of the box.
 * With this custom structure we achieve things like showing the `home`
 * and `settings` document types as singletons, and grouping product details
 * and variants for easy editorial access.
 *
 * You can customize this even further as your schema types progress.
 * To learn more about structure builder, visit our docs:
 * https://www.sanity.io/docs/overview-structure-builder
 */

// If you add document types to structure manually, you can add them to this function to prevent duplicates in the root pane
const hiddenDocTypes = (listItem: ListItemBuilder) => {
  const id = listItem.getId()

  if (!id) {
    return false
  }

  return ![
    'collection',
    'colorTheme',
    'home',
    'media.tag',
    'wishlistSettings',
    'page',
    'product',
    'productVariant',
    'settings',
    'freeShippingSettings',
    'recommendationsSettings',

    'recentlyViewedSettings',
    'inventoryThresholdSettings',
    'plpSettings',
    'pdpSettings',
    'CartPageSetting',
    'CollectionPageSetting',
    'CollectionMain',
  ].includes(id)
}

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      home(S, context),
      pages(S, context),
      S.divider(),
      collections(S, context),
      products(S, context),
      S.divider(),
      colorThemes(S, context),
      S.divider(),
      settings(S, context),
      S.divider(),
      recentlyViewedStructure(S),
      wishlist(S),
      freeShippingbar(S),
      inventoryThresholdSettings(S),
      RecommendationProduct(S),

      PLPPageSetting(S),
      PDPPageSetting(S),
      CartPageSetting(S),
      CollectionStruct(S),
      CollectionMain(S),
      AboutPageSchemaStruct(S),
      ContactStruct(S),
      GlobalStruct(S),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])
