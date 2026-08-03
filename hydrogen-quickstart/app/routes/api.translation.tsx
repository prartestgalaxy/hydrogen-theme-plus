import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key') || 'en';

  const { env } = context;

  const QUERY = `
    query FindTranslationByLocale($query: String!) {
      metaobjects(
        type: "_text_pilot_app"
        first: 1
        query: $query
      ) {
        nodes {
          handle

          translation: field(key: "translation") {
            jsonValue
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(
      `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/2024-04/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': env.PRIVATE_ADMIN_TOKEN,
        },
        body: JSON.stringify({
          query: QUERY,
          variables: {
            query: `display_name:'${key}'`,
          },
        }),
      },
    );

    const data = await response.json();

    console.log(
      '[Translation Loader]',
      JSON.stringify(data, null, 2),
    );

    const node = data?.data?.metaobjects?.nodes?.[0];

    if (!node?.translation?.jsonValue) {
      console.log(
        `[Translation Loader] No translation found for ${key}`,
      );

      return Response.json({});
    }

    return Response.json(node.translation.jsonValue);
  } catch (error) {
    console.error('[Translation Loader Error]', error);

    return Response.json(
      {
        error: String(error),
      },
      {
        status: 500,
      },
    );
  }
}
