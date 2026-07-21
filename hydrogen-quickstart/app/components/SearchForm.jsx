import {useRef, useEffect} from 'react';
import {Form, useLocation} from 'react-router';

/**
 * Search form component that sends search requests to the localized `/search` route.
 */
export function SearchForm({children, action, ...props}) {
  const inputRef = useRef(null);
  const location = useLocation();

  // ✅ Auto-detects if user is in a country locale (e.g. /jp) and updates form action dynamically!
  const match = location.pathname.match(/^\/([a-z]{2})(\/|$)/);
  const countryPrefix = match ? `/${match[1]}` : '';
  const defaultAction = `${countryPrefix}/search`;

  useFocusOnCmdK(inputRef);

  if (typeof children !== 'function') {
    return null;
  }

  return (
    <Form method="get" action={action || defaultAction} {...props}>
      {children({inputRef})}
    </Form>
  );
}

/**
 * Focuses the input when cmd+k is pressed
 */
function useFocusOnCmdK(inputRef) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'k' && event.metaKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === 'Escape') {
        inputRef.current?.blur();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputRef]);
}