import {Link, useFetcher} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import React, {useRef, useEffect ,useState} from 'react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
} from '~/lib/search';
import {useAside} from './Aside';

/**
 * Component that renders predictive search results
 */
export function SearchResultsPredictive({children}) {
  const aside = useAside();
  const {term, inputRef, fetcher, total, items, locale} = usePredictiveSearch(); // <-- Added locale

  function resetInput() {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.value = '';
    }
  }

  function closeSearch() {
    resetInput();
    aside.close();
  }

  return children({
    items,
    closeSearch,
    inputRef,
    state: fetcher.state,
    term,
    total,
    locale, // <-- Pass it down
  });
}

SearchResultsPredictive.Articles = SearchResultsPredictiveArticles;
SearchResultsPredictive.Collections = SearchResultsPredictiveCollections;
SearchResultsPredictive.Pages = SearchResultsPredictivePages;
SearchResultsPredictive.Products = SearchResultsPredictiveProducts;
SearchResultsPredictive.Queries = SearchResultsPredictiveQueries;
SearchResultsPredictive.Empty = SearchResultsPredictiveEmpty;

function SearchResultsPredictiveArticles({term, articles, closeSearch, locale}) {
  if (!articles.length) return null;
 const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const countryPrefix = locale?.country && locale.country !== 'us' ? `/${locale.country}` : '';

  return (
    <div className="predictive-search-result" key="articles">
      <h5>Articles</h5>
      <ul>
        {articles.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `${countryPrefix}/blogs/${article.blog.handle}/${article.handle}`, // <-- prefixed
            trackingParams: article.trackingParameters,
            term: term.current ?? '',
          });

          return (
            <li className="predictive-search-result-item" key={article.id}>
              <Link onClick={closeSearch} to={articleUrl}>
                {article.image?.url && (
                  <Image
                    alt={article.image.altText ?? ''}
                    src={article.image.url}
                    width={50}
                    height={50}
                    loading='lazy'
                      sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         400px"
                     loaderOptions={{ scale: 0.1 }}
  className={`"filter  transition-all duration-500"${loaded ? 'blur-0' : 'blur-xl'} `}
  onLoad={(e) => (e.currentTarget.style.filter = 'blur(0)')}
                  />
                )}
                <div>
                  <span>{article.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveCollections({term, collections, closeSearch, locale}) {
  if (!collections.length) return null;
 const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const countryPrefix = locale?.country && locale.country !== 'us' ? `/${locale.country}` : '';

  // return (
  //   <div className="predictive-search-result" key="collections">
  //     <h5>Collections</h5>
  //     <ul>
  //       {collections.map((collection) => {
  //         const collectionUrl = urlWithTrackingParams({
  //           baseUrl: `${countryPrefix}/collections/${collection.handle}`, // <-- prefixed
  //           trackingParams: collection.trackingParameters,
  //           term: term.current,
  //         });

  //         return (
  //           <li className="predictive-search-result-item" key={collection.id}>
  //             <Link onClick={closeSearch} to={collectionUrl}>
  //               {collection.image?.url && (
  //                 <Image
  //                   alt={collection.image.altText ?? ''}
  //                   src={collection.image.url}
  //                   width={50}
  //                   height={50}
  //                   loading='lazy'
  //                     sizes="(max-width: 640px) 100vw,
  //        (max-width: 1024px) 50vw,
  //        400px"
  //                    loaderOptions={{ scale: 0.1 }}
  // className={`"filter  transition-all duration-500"${loaded ? 'blur-0' : 'blur-xl'} `}
  // onLoad={(e) => (e.currentTarget.style.filter = 'blur(0)')}
  //                 />
  //               )}
  //               <div>
  //                 <span>{collection.title}</span>
  //               </div>
  //             </Link>
  //           </li>
  //         );
  //       })}
  //     </ul>
  //   </div>
  // );
  return (
    <div className="predictive-search-result" key="collections">
      <h5>Collections</h5>
      <ul>
        {collections.map((collection) => {
          const collectionUrl = urlWithTrackingParams({
            baseUrl: `${countryPrefix}/collections/${collection.handle}`, // <-- prefixed
            trackingParams: collection.trackingParameters,
            term: term.current,
          });

          return (
            <li className="predictive-search-result-item" key={collection.id}>
              {/* Flex container to perfectly align the image and text side-by-side */}
              <Link onClick={closeSearch} to={collectionUrl} className="flex items-center gap-4 py-2 hover:bg-gray-50 transition-colors">
                {collection.image?.url && (
                  <Image
                    alt={collection.image.altText ?? ''}
                    src={collection.image.url}
                    width={80}
                    height={80}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    loaderOptions={{ scale: 0.1 }}
                    className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md filter transition-all duration-500 ${loaded ? 'blur-0' : 'blur-xl'}`}
                    onLoad={(e) => (e.currentTarget.style.filter = 'blur(0)')}
                  />
                )}
                <div>
                  {/* Using a <p> tag to match the Products layout typography */}
                  <p className="font-medium text-gray-900 m-0">{collection.title}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictivePages({term, pages, closeSearch, locale}) {
  if (!pages.length) return null;
  const countryPrefix = locale?.country && locale.country !== 'us' ? `/${locale.country}` : '';

  return (
    <div className="predictive-search-result" key="pages">
      <h5>Pages</h5>
      <ul>
        {pages.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `${countryPrefix}/pages/${page.handle}`, // <-- prefixed
            trackingParams: page.trackingParameters,
            term: term.current,
          });

          return (
            <li className="predictive-search-result-item" key={page.id}>
              <Link onClick={closeSearch} to={pageUrl}>
                <div>
                  <span>{page.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveProducts({term, products, closeSearch, locale}) {
  if (!products.length) return null;
 const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const countryPrefix = locale?.country && locale.country !== 'us' ? `/${locale.country}` : '';

  return (
    <div className="predictive-search-result" key="products">
      <h5>Products</h5>
      <ul>
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `${countryPrefix}/products/${product.handle}`, // <-- prefixed
            trackingParams: product.trackingParameters,
            term: term.current,
          });

          const price = product?.selectedOrFirstAvailableVariant?.price;
          const image = product?.selectedOrFirstAvailableVariant?.image;
          return (
            <li className="predictive-search-result-item" key={product.id}>
              <Link to={productUrl} onClick={closeSearch}>
                {image && (
                  <Image
                    alt={image.altText ?? ''}
                    src={image.url}
                    width={50}
                    height={50}
                    loading='lazy'
                      sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         400px"
                     loaderOptions={{ scale: 0.1 }}
   className={`"filter  transition-all duration-500"${loaded ? 'blur-0' : 'blur-xl'} `}
  onLoad={(e) => (e.currentTarget.style.filter = 'blur(0)')}
                  />
                )}
                <div>
                  <p>{product.title}</p>
                  <small>{price && <Money data={price} />}</small>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveQueries({queries, queriesDatalistId}) {
  if (!queries.length) return null;

  return (
    <datalist id={queriesDatalistId}>
      {queries.map((suggestion) => {
        if (!suggestion) return null;

        return <option key={suggestion.text} value={suggestion.text} />;
      })}
    </datalist>
  );
}

function SearchResultsPredictiveEmpty({term}) {
  if (!term.current) {
    return null;
  }

  return (
    <p>
      No results found for <q>{term.current}</q>
    </p>
  );
}

/**
 * Hook that returns the predictive search results and fetcher and input ref.
 */
function usePredictiveSearch() {
  const fetcher = useFetcher({key: 'search'});
  const term = useRef('');
  const inputRef = useRef(null);

  if (fetcher?.state === 'loading') {
    term.current = String(fetcher.formData?.get('q') || '');
  }

  useEffect(() => {
    if (!inputRef.current) {
      inputRef.current = document.querySelector('input[type="search"]');
    }
  }, []);

  const {items, total} =
    fetcher?.data?.result ?? getEmptyPredictiveSearchResult();
    
  // ✅ Extract locale from background fetcher!
  const locale = fetcher?.data?.locale;

  return {items, total, inputRef, term, fetcher, locale};
}