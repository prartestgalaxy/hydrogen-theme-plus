import {Link, useLoaderData, NavLink, useRouteLoaderData} from 'react-router';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {useState} from 'react';
import No_Image from '../assets/No_image.jpg';

export async function loader({context, request}) {
  const {i18n} = context.storefront;
  const locale = i18n?.country?.toLowerCase() || 'us';
  const paginationVariables = getPaginationVariables(request, {pageBy: 9});

  // 1. Fetch ALL articles and ALL blog categories at once
  const {articles, blogs} = await context.storefront.query(ALL_ARTICLES_QUERY, {
    variables: {...paginationVariables},
  });

  return {articles, blogs, locale};
}

export default function AllBlogs() {
  const {articles, blogs, locale} = useLoaderData();
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

  return (
    <div className="w-full bg-white text-[#252B42] pb-24 blog-page">
      {GlobalSettings && <style>{dynamicStyles}</style>}
      {/* --- HERO SECTION --- */}
      <section className="pt-[50px] flex flex-col gap-[16px] items-center text-center px-6">
        <div className="flex gap-[15px] font-normal text-[14px] leading-[24px] tracking-[0.2px] text-[#737373] py-[10px]">
          <Link className='font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#252B42]' to={prefix || '/'}>Home</Link> <span>&gt;</span>{' '}
          <span className="font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#bdbdbd]">Blog</span>
        </div>
        <h1 className="text-[58px] leading-[80px] tracking-[0.2px] font-bold">The Blog</h1>

        {/* --- DYNAMIC FILTERS --- */}
        <div className="flex flex-wrap justify-center gap-[9px] py-[16px]">
          <NavLink
            to={`${prefix}/blogs`}
            end
            className={({isActive}) =>
              `px-[20px] py-[10px] rounded-full font-bold text-[14px] leading-[24px] tracking-[0.2px] ${isActive ? 'bg-[#23A6F0] text-white' : 'border border-[#23A6F0] text-[#23A6F0] flex justify-center items-center'}`
            }
          >
            All
          </NavLink>
          {blogs.nodes.map((blog) => (
            <NavLink
              key={blog.handle}
              to={`${prefix}/blogs/${blog.handle}`}
              className={({isActive}) =>
                `px-[20px] py-[10px] rounded-full font-bold text-[14px] leading-[24px] tracking-[0.2px] ${isActive ? 'bg-[#23A6F0] text-white' : 'border border-[#23A6F0] text-[#23A6F0] flex justify-center items-center'}`
              }
            >
              {blog.title}
            </NavLink>
          ))}
        </div>
      </section>

      {/* --- ALL ARTICLES GRID --- */}
      <section className="max-w-[1200px] mx-auto py-[112px]">
        <PaginatedResourceSection connection={articles}>
          {({node: article}) => (
            <ArticleItem article={article} key={article.id} prefix={prefix} />
          )}
        </PaginatedResourceSection>
      </section>
    </div>
  );
}

// Re-usable Article Item
function ArticleItem({article, prefix}) {
  const [loaded, setLoaded] = useState(false);
  const publishedAt = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <div className="group bg-white flex flex-col shadow-sm border border-gray-100 rounded hover:shadow-lg transition-all overflow-hidden">
      <Link to={`${prefix}/blogs/${article.blog.handle}/${article.handle}`}>
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <div className="absolute top-4 left-4 bg-[#E74040] text-white text-[10px] font-bold px-3 py-1 rounded z-10 uppercase">
            New
          </div>
          {article.image ? (
            <Image
              data={article.image}
              className={`w-full h-full object-cover transition-all duration-500 ${loaded ? 'blur-0' : 'blur-xl'}`}
              onLoad={() => setLoaded(true)}
            />
          ) : (
            <Image
              src={No_Image}
              className={`w-full h-full object-cover transition-all duration-500 ${loaded ? 'blur-0' : 'blur-xl'}`}
              onLoad={() => setLoaded(true)}
            />
          )}
        </div>
        <div className="p-[25px] pb-[35px] flex flex-col gap-[10px]">
          <div className="flex gap-4 text-[12px] leading-[16px] tracking-[0.2px] font-normal text-[#8EC2F2]">
            <span>{article.blog.title}</span>
          </div>
          <h3 className="text-[20px] leading-[30px] tracking-[0.2px] font-normal text-[#252B42]">{article.title}</h3>
          <div className="flex justify-between text-[12px] leading-[16px] tracking-[0.2px] text-[#737373] font-normal py-[15px] border-t border-gray-100 mt-auto">
            <span>{publishedAt}</span>
            <span>10 comments</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

const ALL_ARTICLES_QUERY = `#graphql
  query AllArticles($first: Int, $last: Int, $startCursor: String, $endCursor: String) {
    blogs(first: 10) { nodes { title handle } }
    articles(first: $first, last: $last, before: $startCursor, after: $endCursor, sortKey: PUBLISHED_AT, reverse: true) {
      nodes {
        id title handle publishedAt
        blog { title handle }
        image { url altText width height }
      }
      pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
    }
  }
`;
