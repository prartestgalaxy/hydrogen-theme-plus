


export async function loader({ context, request }) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '3', 10);

    const data = await context.storefront.query(LATEST_ARTICLES_QUERY, {
      variables: { limit },
      cache: context.storefront.CacheNone(),
    });

    return {
      articles: data?.articles?.nodes ?? [],
    };
  } catch (error) {
    console.error('API latest blogs error:', error);

    return {
      articles: [],
    };
  }
}

const LATEST_ARTICLES_QUERY = `#graphql
  query LatestArticles($limit: Int!) {
    articles(first: $limit, sortKey: PUBLISHED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        publishedAt
        excerpt
        content
        blog {
          handle
          title
        }
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
`;