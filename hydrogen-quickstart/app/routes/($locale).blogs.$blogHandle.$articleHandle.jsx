import {useLoaderData, Link, useRouteLoaderData} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {useState, useEffect} from 'react';
import No_image from '../assets/No_image.jpg';

export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.article.title ?? ''} article`}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request, params}) {
  const {i18n} = context.storefront;
  const locale = i18n?.country?.toLowerCase() || 'us';
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blogHandle, articleHandle},
    }),
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(
    request,
    {handle: articleHandle, data: blog.articleByHandle},
    {handle: blogHandle, data: blog},
  );

  return {article: blog.articleByHandle, locale};
}

function loadDeferredData({context}) {
  return {};
}

export default function Article() {
  const {article, locale} = useLoaderData();
  const {title, image, contentHtml, author} = article;
  const prefix = locale === 'us' ? '' : `/${locale}`;

  const rootData = useRouteLoaderData('root');
  const GlobalSettings = rootData?.globalSettings;

  const dynamicStyles = `
    .blog-page {
      font-family: ${GlobalSettings?.fontFamily ? GlobalSettings.fontFamily : 'Montserrat, sans-serif'} !important;
      font-size: ${GlobalSettings?.baseFontSize ? GlobalSettings.baseFontSize : 16}px !important;
    }
    .blog-page h1 { font-size: ${GlobalSettings?.headingSizes?.h1 ? GlobalSettings.headingSizes.h1 : 42}px !important; }
    .blog-page h2 { font-size: ${GlobalSettings?.headingSizes?.h2 ? GlobalSettings.headingSizes.h2 : 40}px !important; }
    .blog-page h3 { font-size: ${GlobalSettings?.headingSizes?.h3 ? GlobalSettings.headingSizes.h3 : 32}px !important; }
    .blog-page h4 { font-size: ${GlobalSettings?.headingSizes?.h4 ? GlobalSettings.headingSizes.h4 : 24}px !important; }
    .blog-page h5 { font-size: ${GlobalSettings?.headingSizes?.h5 ? GlobalSettings.headingSizes.h5 : 20}px !important; }
    .blog-page h6 { font-size: ${GlobalSettings?.headingSizes?.h6 ? GlobalSettings.headingSizes.h6 : 16}px !important; }

    .btn-primary {
      background-color: #${GlobalSettings?.buttons?.primaryBg ? GlobalSettings.buttons.primaryBg : '23A6F0'} !important;
      color: #${GlobalSettings?.buttons?.primaryText ? GlobalSettings.buttons.primaryText : 'FFFFFF'} !important;
      border-radius: ${GlobalSettings?.buttons?.borderRadius != null && GlobalSettings?.buttons?.borderRadius !== '' ? GlobalSettings.buttons.borderRadius : 8}px !important;
    }
    .btn-primary:hover {
      background-color: #${GlobalSettings?.buttons?.primaryHoverBg ? GlobalSettings.buttons.primaryHoverBg : '1D4ED8'} !important;
      color: #${GlobalSettings?.buttons?.primaryHovertxt ? GlobalSettings.buttons.primaryHovertxt : 'FFFFFF'} !important;
    }

    .blog-link {
      color: #${GlobalSettings?.linksEffect?.linkColor ? GlobalSettings.linksEffect.linkColor : '737373'} !important;
      transition: all ${GlobalSettings?.linksEffect?.transitionDuration != null && GlobalSettings?.linksEffect?.transitionDuration !== '' ? GlobalSettings.linksEffect.transitionDuration : 300}ms !important;
      text-decoration: ${(GlobalSettings?.linksEffect?.underlineStyle ? GlobalSettings.linksEffect.underlineStyle : 'none') === 'always' ? 'underline' : 'none'} !important;
    }
    .blog-link:hover {
      color: #${GlobalSettings?.linksEffect?.hoverColor ? GlobalSettings.linksEffect.hoverColor : '5a5a5a'} !important;
      ${(GlobalSettings?.linksEffect?.hoverEffect ? GlobalSettings.linksEffect.hoverEffect : 'none') === 'underline' ? 'text-decoration: underline !important;' : ''}
    }
  `;

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <div className="w-full bg-white text-[#252B42] pb-24 blog-page">
      {GlobalSettings && <style>{dynamicStyles}</style>}

      {/* HEADER */}
      <section className="py-[50px] flex flex-col items-center justify-center gap-[16px] text-center px-6">
        {/* <div className="text-sm text-[#737373] font-bold mb-8 space-x-2">
          <Link
            to={`${prefix}/blogs/${article.blog.handle}`}
            className="text-[#bdbdbd] hover:text-[#252B42]"
          >
            {article.blog.title}
          </Link>
        </div> */}

        {/* DUMMY CATEGORY (Visual match for the screenshot) */}
        <h5 className=" leading-[24px] tracking-[0.1px] font-bold text-[#23A6F0] tracking-widest uppercase">
          Tutorial
        </h5>

        <h2 className="text-4xl md:text-[40px] leading-[50px] font-bold text-[#252B42] letter-spacing-[0.2px]">
          {title}
        </h2>

        <div className="text-[#737373] text-[16px] leading-[24px] tracking-[0.2px] flex flex-col items-center justify-center font-bold">
          <p>We focus on ergonomics and meeting you where you work.</p>
          <p>It's only a keystroke away.</p>
        </div>
      </section>

      {/* ARTICLE CONTENT */}
      <section className="max-w-[800px] mx-auto pt-[0px] pb-[80px] flex flex-col gap-[30px]">
        {/* HERO IMAGE */}
        {!image ? (
          <div className="w-full overflow-hidden bg-gray-100">
            <Image
              data={image}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 800px, 800px"
              loading="eager"
              loaderOptions={{scale: 0.1}}
              className={`w-full h-auto object-cover transition-all duration-500 ${loaded ? 'blur-0' : 'blur-xl'}`}
              onLoad={(e) => (e.currentTarget.style.filter = 'blur(0)')}
            />
          </div>
        ) : (
          <div className="w-full overflow-hidden bg-gray-100">
            <img
              src={No_image}
              alt="No Image"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* META INFO */}
        <div className="flex items-center gap-4 text-sm font-bold text-[#737373] border-b border-gray-100">
          <time dateTime={article.publishedAt}>{publishedDate}</time>
          <span>&middot;</span>
          <address className="not-italic text-[#23A6F0]">
            {author?.name || 'Store Admin'}
          </address>
        </div>

        {/* HTML CONTENT WRAPPER */}
        <div
          dangerouslySetInnerHTML={{__html: contentHtml}}
          className="text-[#737373] leading-loose text-base md:text-lg [&>h2]:text-[#252B42] [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 [&>p]:mb-6 [&>blockquote]:border-l-4 [&>blockquote]:border-[#E74040] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-[#E74040] !leading-[34px] tracking-[0.2px]"
        />
      </section>
    </div>
  );
}

const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        author: authorV2 { name }
        image { id altText url width height }
        seo { description title }
        blog { handle }
      }
    }
  }
`;
