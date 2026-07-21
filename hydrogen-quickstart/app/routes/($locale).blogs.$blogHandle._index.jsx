import { Link, useLoaderData, NavLink } from 'react-router';
import { Image, getPaginationVariables } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { useState, useEffect } from 'react';
import No_image from '../assets/No_image.jpg';

export const meta = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.blog.title ?? ''} blog` }];
};

export async function loader({ context, request, params }) {
  const { i18n } = context.storefront;
  const locale = i18n?.country?.toLowerCase() || 'us';

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 9,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, { status: 404 });
  }

  // We fetch BOTH the specific blog articles AND the list of all blogs for the filters
  const { blog, allBlogs } = await context.storefront.query(BLOG_SPECIFIC_QUERY, {
    variables: {
      blogHandle: params.blogHandle,
      ...paginationVariables,
    },
  });

  if (!blog?.articles) {
    throw new Response('Not found', { status: 404 });
  }

  redirectIfHandleIsLocalized(request, { handle: params.blogHandle, data: blog });

  return { blog, allBlogs, locale };
}

export default function Blog() {
  const { blog, allBlogs, locale } = useLoaderData();
  const { articles } = blog;
  const prefix = locale === 'us' ? '' : `/${locale}`;


  return (
    <div className="w-full bg-white text-[#252B42] pb-24">
      {/* --- HERO & FILTERS SECTION --- */}
      <section className="py-16 flex flex-col items-center text-center px-6">
        <div className="text-sm text-[#737373] font-bold mb-8 space-x-2">
          <Link to={prefix || '/'}>Home</Link> <span>&gt;</span>
          <Link to={`${prefix}/blogs`}>Blog</Link> <span>&gt;</span> 
          <span className="text-[#bdbdbd]">{blog?.title}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog?.title || 'The Blog'}</h1>
        
        {/* --- DYNAMIC FILTER PILLS --- */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <NavLink 
            to={`${prefix}/blogs`} 
            end 
            className={({isActive}) => `px-6 py-2 rounded-full font-bold text-sm transition-all ${isActive ? 'bg-[#23A6F0] text-white' : 'border border-[#23A6F0] text-[#23A6F0] hover:bg-blue-50'}`}
          >
            All
          </NavLink>
          {allBlogs.nodes.map((navBlog) => (
            <NavLink 
              key={navBlog.handle} 
              to={`${prefix}/blogs/${navBlog.handle}`} 
              className={({isActive}) => `px-6 py-2 rounded-full font-bold text-sm transition-all ${isActive ? 'bg-[#23A6F0] text-white' : 'border border-[#23A6F0] text-[#23A6F0] hover:bg-blue-50'}`}
            >
              {navBlog.title}
            </NavLink>
          ))}
        </div>
      </section>

      {/* --- BLOG ARTICLES GRID --- */}
      <section className="max-w-[1200px] mx-auto px-6">
        <PaginatedResourceSection connection={articles}>
          {({ node: article, index }) => (
            <ArticleItem
              article={article}
              key={article.id}
              loading={index < 3 ? 'eager' : 'lazy'}
              prefix={prefix}
            />
          )}
        </PaginatedResourceSection>
      </section>
    </div>
  );
}

function ArticleItem({ article, loading, prefix }) {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const publishedAt = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <div className="group bg-white flex flex-col shadow-sm border border-gray-100 rounded hover:shadow-lg transition-shadow duration-300">
      <Link to={`${prefix}/blogs/${article.blog.handle}/${article.handle}`} className="flex flex-col h-full">
        
        {/* IMAGE WRAPPER */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
          <div className="absolute top-4 left-4 bg-[#E74040] text-white text-[10px] font-bold px-3 py-1 rounded z-10 shadow-sm uppercase tracking-wider">
            New
          </div>
          
          {article.image ? (
            <Image
              alt={article.image.altText || article.title}
              data={article.image}
              loading={loading}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 400px"
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? 'blur-0' : 'blur-xl'}`}
              onLoad={() => setLoaded(true)}
            />
          ) : (
            <img src={No_image} alt="No Image" className="w-full h-full object-cover" />
          )}
        </div>

        {/* CONTENT */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex gap-4 text-xs font-bold text-[#8EC2F2] mb-3">
            <span className="text-[#23A6F0]">Google</span>
            <span>Trending</span>
            <span>New</span>
          </div>
          
          <h3 className="text-lg font-bold text-[#252B42] mb-3 group-hover:text-[#23A6F0] transition-colors line-clamp-2">
            {article.title}
          </h3>
          
          <div 
            className="text-sm text-[#737373] mb-6 line-clamp-3 leading-relaxed flex-grow"
            dangerouslySetInnerHTML={{ __html: article.contentHtml.substring(0, 150) + '...' }}
          />

          {/* META INFO */}
          <div className="flex items-center justify-between text-xs text-[#737373] font-bold py-4 border-t border-b border-gray-100 mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#23A6F0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/></svg>
              {publishedAt}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#23856D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
              10 comments
            </div>
          </div>

          <span className="text-sm font-bold text-[#23A6F0] flex items-center gap-2 group-hover:translate-x-1 transition-transform">
            Learn More <span className="text-lg leading-none">&rsaquo;</span>
          </span>
        </div>
      </Link>
    </div>
  );
}

const BLOG_SPECIFIC_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    # Fetch list of all blogs for the pill filters
    allBlogs: blogs(first: 10) {
      nodes {
        title
        handle
      }
    }
    # Fetch current blog data
    blog(handle: $blogHandle) {
      title
      handle
      seo { title description }
      articles(first: $first, last: $last, before: $startCursor, after: $endCursor) {
        nodes {
          author: authorV2 { name }
          contentHtml
          handle
          id
          image { id altText url width height }
          publishedAt
          title
          blog { handle title }
        }
        pageInfo { hasPreviousPage hasNextPage endCursor startCursor }
      }
    }
  }
`;