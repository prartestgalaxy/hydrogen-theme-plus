import {data} from 'react-router';

/**
 * @param {import('@shopify/remix-oxygen').ActionFunctionArgs} args
 */
export async function action({request, context}) {
  const {storefront} = context;

  if (request.method !== 'POST') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  // Get customer access token from cookie (same pattern as address API)
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/customerAccessToken=([^;]+)/);
  const customerAccessToken = match?.[1];

  if (!customerAccessToken) {
    return data({error: 'Unauthorized – Please log in'}, {status: 401});
  }

  const form = await request.formData();
  const firstName = (form.get('firstName') || '').trim();
  const lastName = (form.get('lastName') || '').trim();
  const email = (form.get('email') || '').trim();
  const phone = (form.get('phone') || '').trim();

  console.log('firstName: ', firstName);
  console.log('lastName: ', lastName);
  console.log('email: ', email);
  console.log('phone: ', phone);

  if (!firstName) {
    return data({error: 'First name is required'}, {status: 400});
  }
  if (!email) {
    return data({error: 'Email is required'}, {status: 400});
  }

  try {
    const result = await storefront.mutate(
      `mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
        customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
          customer {
            id
            firstName
            lastName
            email
            phone
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          customerAccessToken,
          customer: {
            firstName,
            lastName: lastName || firstName,
            email,
            ...(phone ? {phone} : {}),
          },
        },
      },
    );

    console.log('result: ', JSON.stringify(result));

    if (result?.errors?.length) {
      return data({error: result.errors[0].message}, {status: 500});
    }

    const updateResult = result?.customerUpdate;

    if (updateResult?.userErrors?.length) {
      return data(
        {error: updateResult.userErrors.map((e) => e.message).join(', ')},
        {status: 400},
      );
    }

    if (!updateResult?.customer) {
      return data({error: 'Profile update failed'}, {status: 500});
    }

    return data({
      success: true,
      message: 'Profile updated successfully',
      customer: updateResult.customer,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return data(
      {error: error.message || 'Failed to update profile'},
      {status: 500},
    );
  }
}
