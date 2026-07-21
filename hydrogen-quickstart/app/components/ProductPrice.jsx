import { Money } from '@shopify/hydrogen';

/**
 * @param {{
 *   price?: MoneyV2;
 *   compareAtPrice?: MoneyV2 | null;
 * }}
 */
export function ProductPrice({ price, compareAtPrice }) {
  return (
    <div className="product-price">
      {compareAtPrice ? (
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {price ? <Money data={price} /> : null}
          </span>
          <s className="text-lg text-gray-400">
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <span className="text-2xl font-bold text-gray-900">
          <Money data={price} />
        </span>
      ) : (
        <span className="text-2xl font-bold text-gray-900">$0.00</span>
      )}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */