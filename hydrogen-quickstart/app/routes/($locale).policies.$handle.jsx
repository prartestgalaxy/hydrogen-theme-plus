import {Link, useLoaderData} from 'react-router';
import SubscribeBanner from '~/components/SubscribeBanner';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.policy.title ?? ''}`}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({params, context}) {
  const { i18n } = context.storefront;
  const locale = i18n?.country?.toLowerCase() || 'us';

  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const policyName = params.handle.replace(/-([a-z])/g, (_, m1) =>
    m1.toUpperCase(),
  );

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response('Could not find the policy', {status: 404});
  }

  // ✅ Pass locale to the component
  return {policy, locale};
}

export default function Policy() {
  // ✅ Destructure locale from useLoaderData
  const {policy, locale} = useLoaderData();

  // Helper to handle the URL prefix correctly
  const prefix = locale === 'us' ? '/' : `/${locale}`;

  return (
    <div className="py-20 w-full">

      {/* Breadcrumb */}
      <div className="flex justify-center text-sm text-gray-500 mb-6">
        <div className="flex items-center gap-3">
          <Link
            // ✅ Include the locale prefix in the Home link
            to={prefix}
            className="hover:text-gray-800 transition"
          >
            Home
          </Link>

          <span className="text-gray-400">›</span>

          <span className="text-gray-600 capitalize">
            {policy.title}
          </span>
        </div>
      </div>

      {/* Page Title */}
      <h1 className="text-center text-5xl font-bold text-gray-900 mb-16">
        {policy.title}
      </h1>

      {/* Policy Content */}
      <div className="max-w-2xl mx-auto">
        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{__html: policy.body}}
        />
      </div>
      
      <SubscribeBanner />
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
`;