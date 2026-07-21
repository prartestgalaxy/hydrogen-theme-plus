import { NavLink } from 'react-router';
import { useEffect, useState } from 'react';
import { Image } from '@shopify/hydrogen';
import { useParams } from 'react-router';

export function HeaderAside({ isOpen, onClose, menu, logo, fontSize = 'text-base' }) {
  const [loaded, setLoaded] = useState(false);
  const { locale } = useParams(); // Get locale for link resolution

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <div 
      className={`fixed inset-0 z-[1000] transition-all duration-300 ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Sidebar Panel */}
      <aside 
        className={`absolute top-0 left-0 h-full w-full max-w-[400px] bg-white shadow-2xl transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="flex items-center justify-between p-6 border-b">
            <NavLink to="/" onClick={onClose}>
              {logo?.asset?.url ? (
                <Image
                  src={logo.asset.url}
                  alt="Logo"
                  className={`h-8 w-auto transition-all duration-500 ${loaded ? 'blur-0' : 'blur-xl'}`}
                  loading="eager"
                  // Added sizes prop to resolve warning
                  sizes="200px" 
                />
              ) : (
                <span className="font-bold text-xl tracking-tighter uppercase">Store</span>
              )}
            </NavLink>
            <button onClick={onClose} className="text-4xl leading-none hover:opacity-50 transition-opacity">
              &times;
            </button>
          </header>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
            {menu?.map((item) => (
              <div key={item._key} className="flex flex-col gap-4">
                <NavLink
                  to={resolveSanityLink(item.link, null, locale)}
                  onClick={onClose}
                  className={`${fontSize || 'text-2xl'} font-bold uppercase tracking-tighter hover:text-blue-600 transition-colors`}
                >
                  {item.label}
                </NavLink>
                
                {/* Sub-menu (Children) */}
                {item.children?.length > 0 && (
                  <div className="flex flex-col gap-3 pl-4 border-l border-gray-100">
                    {item.children.map((child) => (
                      <NavLink
                        key={child._key}
                        // FIX: Pass child.link to match the nested structure
                        to={resolveSanityLink(child.link, null, locale)}
                        onClick={onClose}
                        className="text-sm uppercase font-medium tracking-widest text-gray-500 hover:text-black transition-colors"
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}


function resolveSanityLink(link, publicStoreDomain, locale) {
  if (!link) return '/';
  
  if (link.type === 'external' && link.url) {
    return link.url;
  }

  const baseLocale = locale && locale.length === 2 ? `/${locale.toLowerCase()}` : '';
  let path = '';

  if (typeof link === 'string') {
    path = link;
  } else if (link.url) {
    try {
      path = new URL(link.url).pathname;
    } catch {
      path = link.url;
    }
  } else {
    // Standardized slug extraction for expanded Sanity data
    const slug = link.page?.slug || 
                 link.collection?.slug || 
                 link.product?.slug || '';

    switch (link.type) {
      case 'route': path = link.route || '/'; break;
      case 'collection': path = `/collections/${slug}`; break;
      case 'product': path = `/products/${slug}`; break;
      case 'page': path = `/pages/${slug}`; break;
      default: path = '/';
    }
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath.startsWith(baseLocale) && baseLocale !== '') return cleanPath;
  
  return `${baseLocale}${cleanPath}`.replace(/\/+/g, '/');
}