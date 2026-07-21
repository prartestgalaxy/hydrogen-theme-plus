import {useLoaderData, Link} from 'react-router';

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const { i18n } = context.storefront;
  const locale = i18n?.country?.toLowerCase() || 'us';

  const data = await context.storefront.query(POLICIES_QUERY);
  const shopPolicies = data.shop;

  const policies = [
    shopPolicies?.privacyPolicy,
    shopPolicies?.shippingPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.refundPolicy,
    shopPolicies?.subscriptionPolicy,
  ].filter((policy) => policy != null);

  if (!policies.length) {
    throw new Response('No policies found', {status: 404});
  }

  // ✅ Pass locale to the component
  return {policies, locale};
}

export default function Policies() {
  // ✅ Destructure locale from useLoaderData
  const {policies, locale} = useLoaderData();

  // Helper to handle the URL prefix correctly (avoids /us/ if US is your default)
  const prefix = locale === 'us' ? '' : `/${locale}`;

  return (
    <div className="px-6 py-20">

      {/* Page Header */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Policies
        </h1>

        <p className="text-gray-500 max-w-xl mx-auto">
          Read our policies to understand how we operate, handle orders,
          protect your data, and manage returns or subscriptions.
        </p>
      </div>

      {/* Policies List */}
      <div className="max-w-2xl mx-auto space-y-5">

        {policies.map((policy) => (
          <Link
            key={policy.id}
            // ✅ Include the locale prefix in the link
            to={`${prefix}/policies/${policy.handle}`}
            className="block border border-gray-200 rounded-xl px-6 py-5
                       hover:border-gray-400 hover:shadow-sm transition hover:bg-blue-100"
          >
            <div className="flex items-center justify-between">

              <span className="text-lg font-medium text-gray-800">
                {policy.title}
              </span>

              <span className="text-gray-400 text-xl">
                →
              </span>

            </div>
          </Link>
        ))}

      </div>

    </div>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }

  query Policies ($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
`;