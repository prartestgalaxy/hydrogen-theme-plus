import {useFetcher, useNavigate, useLocation} from 'react-router';
import React, {useRef, useEffect, useMemo} from 'react';
import {useAside} from './Aside';

export const SEARCH_ENDPOINT = '/search';

/**
 * Custom debounce helper to prevent rapid fire requests
 */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function SearchFormPredictive({
  children,
  className = 'predictive-search-form',
  ...props
}) {
  const fetcher = useFetcher({key: 'search'});
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const aside = useAside();
  const location = useLocation();

  // ✅ Auto-detects if user is in a country locale (e.g. /jp) for background predictive fetcher
  const match = location.pathname.match(/^\/([a-z]{2})(\/|$)/);
  const countryPrefix = match ? `/${match[1]}` : '';
  const searchRoute = `${countryPrefix}/search`;

  const debouncedFetch = useMemo(
    () =>
      debounce((event) => {
        if (!event.target.value) return;
        void fetcher.submit(
          {q: event.target.value, limit: 5, predictive: true},
          {method: 'GET', action: searchRoute}, // <-- submitting to localized endpoint
        );
      }, 300),
    [fetcher, searchRoute],
  );

  function resetInput(event) {
    event.preventDefault();
    event.stopPropagation();
    if (inputRef?.current?.value) {
      inputRef.current.blur();
    }
  }

  function goToSearch() {
    const term = inputRef?.current?.value;
    void navigate(searchRoute + (term ? `?q=${term}` : '')); // <-- navigating to localized endpoint
    aside.close();
  }

  function fetchResults(event) {
    debouncedFetch(event);
  }

  useEffect(() => {
    inputRef?.current?.setAttribute('type', 'search');
    
    return () => {
      if (fetcher.state !== 'idle') {
      }
    };
  }, [fetcher]);

  if (typeof children !== 'function') {
    return null;
  }

  return (
    <fetcher.Form {...props} className={className} onSubmit={resetInput} action={searchRoute}>
      {children({inputRef, fetcher, fetchResults, goToSearch})}
    </fetcher.Form>
  );
}