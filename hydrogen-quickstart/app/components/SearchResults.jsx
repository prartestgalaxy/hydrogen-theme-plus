import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams} from '~/lib/search';
import { useState, useEffect } from 'react';

/**
 * @param {Omit<SearchResultsProps, 'error' | 'type'>}
 */
export function SearchResults({term, result, children, locale}) { // <-- locale added
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term, locale});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({term, articles, locale}) {
  if (!articles?.nodes.length) {
    return null;
  }

  const countryPrefix = locale?.country && locale.country !== 'us' ? `/${locale.country}` : '';

  return (
    <div className="search-result">
      <h2>Articles</h2>
      <div>
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `${countryPrefix}/blogs/${article.handle}`, // <-- prefixed
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={article.id}>
              <Link prefetch="intent" to={articleUrl}>
                {article.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsPages({term, pages, locale}) {
  if (!pages?.nodes.length) {
    return null;
  }

  const countryPrefix = locale?.country && locale.country !== 'us' ? `/${locale.country}` : '';

  return (
    <div className="search-result">
      <h2>Pages</h2>
      <div>
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `${countryPrefix}/pages/${page.handle}`, // <-- prefixed
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={page.id}>
              <Link prefetch="intent" to={pageUrl}>
                {page.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsProducts({term, products, locale}) {
  if (!products?.nodes.length) {
    return null;
  }
   const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    // force remove blur after hydration
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const countryPrefix = locale?.country && locale.country !== 'us' ? `/${locale.country}` : '';

  return (
    <div className="search-result">
      <h2>Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `${countryPrefix}/products/${product.handle}`, // <-- prefixed
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <div className="search-results-item" key={product.id}>
                <Link prefetch="intent" to={productUrl}>
                  {image && (
                    <Image data={image} alt={product.title} width={50}    sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         400px"
          loading='lazy'  loaderOptions={{ scale: 0.1 }}   // tiny low-quality placeholder
  className={`"filter  transition-all duration-500" ${loaded ? 'blur-0' : 'blur-xl'}`}
  onLoad={(e) => (e.currentTarget.style.filter = 'blur(0)')}/>
                  )}
                  <div>
                    <p>{product.title}</p>
                    <small>{price && <Money data={price} />}</small>
                  </div>
                </Link>
              </div>
            );
          });

          return (
            <div>
              <div>
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                </PreviousLink>
              </div>
              <div>
                {ItemsMarkup}
                <br />
              </div>
              <div>
                <NextLink>
                  {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
      <br />
    </div>
  );
}

function SearchResultsEmpty() {
  return <p>No results, try a different search.</p>;
}