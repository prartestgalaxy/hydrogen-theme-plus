import {Link as RemixLink, NavLink as RemixNavLink, useParams} from 'react-router';

/**
 * A custom Link component that preserves the current locale prefix
 */
export function Link({to, children, ...props}) {
  const {locale} = useParams();
  
  // If we have a locale (e.g., 'nl'), and the link is internal, prepend it
  const localizedTo = locale && to.startsWith('/') && !to.startsWith(`/${locale}`)
    ? `/${locale}${to}`.replace(/\/+/g, '/') // Clean up double slashes
    : to;

  return (
    <RemixLink to={localizedTo} {...props}>
      {children}
    </RemixLink>
  );
}

export function NavLink({to, children, ...props}) {
  const {locale} = useParams();
  
  const localizedTo = locale && to.startsWith('/') && !to.startsWith(`/${locale}`)
    ? `/${locale}${to}`.replace(/\/+/g, '/')
    : to;

  return (
    <RemixNavLink to={localizedTo} {...props}>
      {children}
    </RemixNavLink>
  );
}