
import { useEffect, useState } from 'react';
import { useFetcher, Link } from 'react-router';
import { Image } from '@shopify/hydrogen';
import No_image from '../assets/No_image.jpg';
import clock from '../assets/clock.svg'
import comments from '../assets/comments.svg'



export function FeaturedBlogs({ module, globalSettingsData }) {
  const fetcher = useFetcher();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!module?.enabled) return;
    if (fetcher.data) return;
    if (fetcher.state !== 'idle') return;

    fetcher.load(`/api/latest-blogs?limit=${module.limit || 3}`);
  }, [module?.enabled, module?.limit]);

  if (!module?.enabled) return null;

  // 1. Destructure Module Data
  const {
    title = 'Latest for you',
    subtitle = 'Blog',
    description,
    padding = 'py-24',
    _key = 'featured-blogs'
  } = module;

  // 2. Helper: Ensure Hex Format
  const formatColor = (color) => {
    if (!color) return null;
    return color.startsWith('#') ? color : `#${color}`;
  };

  // 3. STYLING HIERARCHY
  const fontStyle = globalSettingsData?.fontFamily || 'Montserrat, sans-serif';

  const colors = {
    subtitle: formatColor(globalSettingsData?.colors?.secondary) || '#737373',
    heading: formatColor(globalSettingsData?.colors?.heading) || '#252B42',
    body: formatColor(globalSettingsData?.colors?.text) || '#737373',
    cardBg: '#ffffff'
  };

  const fontSizes = {
    subtitle: globalSettingsData?.headingSizes?.h4 ? `${globalSettingsData.headingSizes.h4}px` : '20px',
    heading: globalSettingsData?.headingSizes?.h3 ? `${globalSettingsData.headingSizes.h3}px` : '40px',
    cardTitle: globalSettingsData?.headingSizes?.h4 ? `${globalSettingsData.headingSizes.h4}px` : '20px',
    body: globalSettingsData?.baseFontSize ? `${globalSettingsData.baseFontSize}px` : '14px',
    h6Font: globalSettingsData?.headingSizes?.h6 ? `${globalSettingsData.headingSizes.h6}px` : '14px',
  };

  // 4. Dynamic Scoped Styles (with Responsiveness)
  const dynamicStyles = `
    .blog-sec-${_key} { 
      font-family: ${fontStyle}; 
    }
    .blog-sec-${_key} .sec-subtitle { 
     font-family: ${fontStyle}; 
      color: ${colors.subtitle}; 
      font-size : ${fontSizes.subtitle};
      font-weight: 400;
      leading-trim: NONE;
      line-height: 30px;
      letter-spacing: 0.2px;

    }
    .blog-sec-${_key} .sec-heading { 
     font-family: ${fontStyle}; 
      color: ${colors.heading}; 
      font-size : ${fontSizes.heading};
      font-weight: 700;
      leading-trim: NONE;
      line-height: 32px;
      letter-spacing: 0.1px;
    }
    .blog-sec-${_key} .sec-description { 
     font-family: ${fontStyle}; 
      color: ${colors.body}; 
      font-family: ${fontStyle};
      font-size: ${fontSizes.body};
      font-weight: 400;
      leading-trim: NONE;
      line-height: 20px;
      letter-spacing: 0.2px;

    }
    .blog-sec-${_key} .card-title {
     font-family: ${fontStyle}; 
      color: ${colors.heading};

    }

     .blog-sec-${_key} .details{
      font-family: ${fontStyle}; 
      font-weight: 400;
      font-size: 12px;
      leading-trim: NONE;
      line-height: 16px;
      letter-spacing: 0.2px;
    }

    .blog-sec-${_key} .h6-font{
      font-family: ${fontStyle}; 
      font-weight: 700;
      font-size : ${fontSizes.h6Font};
      leading-trim: NONE;
      line-height: 24px;
      letter-spacing: 0.2px;
    }

    .blog-sec-${_key} .tags{
      font-family: ${fontStyle}; 
      font-weight: 400;
      font-size: 12px;
      leading-trim: NONE;
      line-height: 16px;
      letter-spacing: 0.2px;
    }

    
    @media (min-width: 768px) {
      .blog-sec-${_key} .sec-heading { font-size: ${fontSizes.heading}; }
      .blog-sec-${_key} .card-title { font-size: ${fontSizes.cardTitle}; 
        font-family: ${fontStyle};
        font-weight: 400;
        leading-trim: NONE;
        line-height: 30px;
        letter-spacing: 0.2px;
      }
    }
  `;

  const articles = fetcher.data?.articles || [];

  return (
    <section className={`w-full blog-sec-${_key} ${padding} bg-white`}>
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />

      <div className="max-w-[100%] mx-auto px-[7%]">

        {/* HEADER */}
        <div className="text-center mb-[50px] md:max-w-2xl mx-auto">
          {subtitle && (
            <h4 className="sec-subtitle mb-[10px]">
              {subtitle}
            </h4>
          )}
          {title && (
            <h3 className="sec-heading mb-[10px]">
              {title}
            </h3>
          )}
          {description && (
            <p className="sec-description max-w-md mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 lg:gap-[50px] justify-center">
          {articles.length > 0 ? (
            articles.map((article) => (
              <BlogCard
                key={article.id}
                article={article}
                mounted={mounted}
                colors={colors}
              />
            ))
          ) : (
            // Skeleton loader
            [...Array(module.limit || 3)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="aspect-[4/5] bg-gray-50 animate-pulse rounded-lg border border-gray-100"
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ article, mounted, colors }) {
  const [loaded, setLoaded] = useState(false);

  const date = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(article.publishedAt));

  const displayDescription = article.excerpt
    ? article.excerpt
    : article.content
      ? article.content.slice(0, 150) + '...'
      : 'No description available.';

  return (
    <div className="group bg-white flex flex-col shadow-sm border border-gray-100 rounded overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
      <Link
        to={`/blogs/${article.blog.handle}/${article.handle}`}
        className="flex flex-col h-full"
      >
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {/* <div className="absolute top-4 left-4 bg-[#E74040] text-white text-[10px] font-bold px-3 py-1 rounded z-10 uppercase tracking-wider">
            New
          </div> */}

          {article.image && (
            <Image
              data={article?.image ? article.image : No_image}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${mounted && loaded ? 'blur-0' : 'blur-xl'
                }`}
              onLoad={() => setLoaded(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            />
          )}
        </div>

        {/* CONTENT */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Tags */}
          <div className="flex gap-4 tags font-bold mb-[10px]" style={{ color: colors.subtitle }}>
            <span className=' text-[#23A6F0]'>Google</span>
            <span>Trending</span>
            <span>New</span>
          </div>

          <h4 className="card-title font-bold mb-3 transition-colors line-clamp-2 leading-tight group-hover:opacity-70">
            {article.title}
          </h4>

          <p className="line-clamp-3 sec-description  flex-grow mb-[10px]" style={{ color: colors.body }}>
            {displayDescription}
          </p>

          <div className="flex items-center justify-between text-[12px] font-bold py-[15px] border-t border-gray-100 mt-auto" style={{ color: colors.body }}>
            <div className="details flex items-center gap-[5px]">
              {/* <svg className="w-4 h-4" style={{ color: colors.subtitle }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
              </svg> */}
              <img
                src={clock}
                alt="Clock"
                style={{ height: '16px', width: '16px' }}
              />
              {date}
            </div>

            <div className="details flex items-center gap-[5px]">
              {/* <svg className="w-4 h-4 text-[#23856D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg> */}
              <img
                src={comments}
                alt="Comments"
                style={{ height: '15px', width: '16px' }}
              />
              10 comments
            </div>
          </div>

          <span className="h6-font text-sm font-bold mt-[10px] flex items-center gap-[10px] group-hover:translate-x-1 transition-transform" style={{ color: colors.subtitle }}>
            Learn More <span className="text-lg leading-none text-[#23A6F0]">
              <svg className="w-[9px] h-[16px] " fill="none" viewBox="9 5 7 14" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
}