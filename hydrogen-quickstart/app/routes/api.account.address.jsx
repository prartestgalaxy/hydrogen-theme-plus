
import { data } from 'react-router';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';

/**
 * @param {Route.ActionArgs}
 */
export async function action({ request, context }) {
  const { storefront } = context;

 

  // Check if request method is POST
  if (request.method !== 'POST') {
    return data({ error: 'Method not allowed' }, { status: 405 });
  }

  // Get customer access token from cookies
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/customerAccessToken=([^;]+)/);
  const customerAccessToken = match?.[1];

  if (!customerAccessToken) {
   
    return data({ error: 'Unauthorized - Please log in' }, { status: 401 });
  }

 

  // Verify the token is still valid
  try {
    const customerRes = await storefront.query(`
      query getCustomer($token: String!) {
        customer(customerAccessToken: $token) {
          id
          email
        }
      }
    `, { variables: { token: customerAccessToken } });

    if (!customerRes?.customer) {
      
      return data({ error: 'Unauthorized - Invalid session' }, { status: 401 });
    }
    
    
  } catch (error) {
   
    return data({ error: 'Unauthorized - Authentication failed' }, { status: 401 });
  }

  const form = await request.formData();
  const actionType = form.get('action');
  const addressId = form.get('addressId');
  const setAsDefault = form.get('setAsDefault') === 'on';
  
 
  // Map input names to Shopify's expected fields
  const getCountryCode = (countryName) => {
    if (!countryName) return 'US';
    switch (countryName.trim()) {
      case 'India':
        return 'IN';
      case 'United States':
        return 'US';
      case 'Canada':
        return 'CA';
      case 'United Kingdom':
        return 'GB';
      default:
        return countryName.trim();
    }
  };

  const getZoneCode = (provinceName) => {
    if (!provinceName) return '';
    switch (provinceName.trim()) {
      case 'California':
        return 'CA';
      case 'New York':
        return 'NY';
      case 'Texas':
        return 'TX';
      default:
        return provinceName.trim();
    }
  };

  // Handle Set as Default action
  if (actionType === 'setDefault') {
    if (!addressId) {
      return data({ error: 'Missing addressId' }, { status: 400 });
    }
    
    try {
     
      
      const result = await storefront.mutate(`
        mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
          customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
            customer {
              id
              defaultAddress {
                id
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `, {
        variables: {
          customerAccessToken: customerAccessToken,
          addressId: decodeURIComponent(addressId),
        },
      });
      
      
      
      if (result?.errors) {
        console.log("finded error 1");
        console.error('GraphQL errors:', result.errors);
        return data({ error: result.errors[0].message }, { status: 500 });
      }
      
      const defaultResult = result?.customerDefaultAddressUpdate;
      
      if (defaultResult?.userErrors?.length) {
        const errorMsg = defaultResult.userErrors[0].message;
       
        return data({ error: errorMsg }, { status: 400 });
      }
      
      return data({ 
        success: true, 
        message: 'Default address updated successfully',
        action: 'setDefault'
      });
    } catch (error) {
      console.error('Set default address error:', error);
      return data({ error: error.message || 'Failed to set default address' }, { status: 500 });
    }
  }

  // Handle Delete action
  if (actionType === 'delete') {
    if (!addressId) {
      return data({ error: 'Missing addressId' }, { status: 400 });
    }
    
    try {
      
      
      const result = await storefront.mutate(DELETE_ADDRESS_MUTATION, {
        variables: {
          customerAccessToken: customerAccessToken,
          id: decodeURIComponent(addressId),
        },
      });
      
     

      const deleteResult = result?.customerAddressDelete || result?.data?.customerAddressDelete;
      
      if (result?.errors) {
        console.log("finded error 2");
        console.error('GraphQL errors:', result.errors);
        return data({ error: result.errors[0].message }, { status: 500 });
      }

      if (deleteResult?.userErrors?.length) {
        const errorMsg = deleteResult.userErrors[0].message;
        console.error('Delete user error:', errorMsg);
        return data({ error: errorMsg }, { status: 400 });
      }
      
      return data({ success: true, message: 'Address deleted successfully', action: 'delete' });
    } catch (error) {
      console.error('Delete address error:', error);
      return data({ error: error.message || 'Failed to delete address' }, { status: 500 });
    }
  }

  // Handle Create or Update actions
  if (actionType === 'create' || actionType === 'update') {
    // Handle full name split
    let fullName = form.get('fullName') || '';
    let firstName = '';
    let lastName = '';
    
    if (fullName) {
      const parts = fullName.split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ') || '';
    } else {
      firstName = form.get('firstName') || '';
      lastName = form.get('lastName') || '';
      if (!lastName && firstName.includes(' ')) {
        const parts = firstName.split(' ');
        firstName = parts[0];
        lastName = parts.slice(1).join(' ');
      } else if (!lastName) {
        lastName = firstName || '';
      }
    }

    // Ensure we have at least a first name
    if (!firstName && !lastName) firstName = fullName || 'Customer';

    const address = {
      firstName: firstName,
      lastName: lastName ? lastName : null,
      phone: form.get('phone') || '',
      address1: form.get('address1') || '',
      address2: form.get('address2') || '',
      country: getCountryCode(form.get('country')),
      province: getZoneCode(form.get('province')),
      zip: form.get('zip') || '',
      city: form.get('city') || '',
    };

    

    // Validate required fields
    if (!address.address1) {
      return data({ error: 'Street address is required' }, { status: 400 });
    }
    if (!address.city) {
      return data({ error: 'City is required' }, { status: 400 });
    }
    if (!address.zip) {
      return data({ error: 'Postal code is required' }, { status: 400 });
    }
    if (!address.country) {
      return data({ error: 'Country is required' }, { status: 400 });
    }

    try {
      let result;
      let createdAddressId = null;
      
      if (actionType === 'create') {
       
        result = await storefront.mutate(CREATE_ADDRESS_MUTATION, {
          variables: {
            customerAccessToken: customerAccessToken,
            address: address,
          },
        });
        
     

        if (result?.errors) {
          console.log("finded error 3");
          console.error('GraphQL errors:', result.errors);
          return data({ error: result.errors[0].message }, { status: 500 });
        }

        const createResult = result?.customerAddressCreate;
        
        if (createResult?.userErrors?.length) {
          const errorMsg = createResult.userErrors.map(e => e.message).join(', ');
          console.error('Create user error:', errorMsg);
          return data({ error: errorMsg }, { status: 400 });
        }

        if (!createResult?.customerAddress?.id) {
          console.error('No customer address in response. Full result:', JSON.stringify(result, null, 2));
          return data({ error: 'Address was not saved' }, { status: 500 });
        }

        createdAddressId = createResult.customerAddress.id;
       
        
      } else {
       
        result = await storefront.mutate(UPDATE_ADDRESS_MUTATION, {
          variables: {
            customerAccessToken: customerAccessToken,
            id: decodeURIComponent(addressId),
            address: address,
          },
        });
        
      

        if (result?.errors) {
          console.log("finded error 4");
          console.error('GraphQL errors:', JSON.stringify(result, null, 2));
          return data({ error: result.errors[0].message }, { status: 500 });
        }

        const updateResult = result?.customerAddressUpdate;
        
        if (updateResult?.userErrors?.length) {
          const errorMsg = updateResult.userErrors.map(e => e.message).join(', ');
          console.error('Update user error:', errorMsg);
          return data({ error: errorMsg }, { status: 400 });
        }

        if (!updateResult?.customerAddress?.id) {
          console.error('No customer address in response');
          return data({ error: 'Address was not updated' }, { status: 500 });
        }
        
        createdAddressId = updateResult.customerAddress.id;
      }
      
      // If set as default is true, update the default address
      if (setAsDefault && createdAddressId) {
     
        const defaultAddressResult = await storefront.mutate(`
          mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
            customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
              customer {
                id
                defaultAddress {
                  id
                }
              }
              userErrors {
                field
                message
              }
            }
          }
        `, {
          variables: {
            customerAccessToken: customerAccessToken,
            addressId: createdAddressId,
          },
        });
        
        
        
        if (defaultAddressResult?.errors) {
          console.error('Default address update errors:', defaultAddressResult.errors);
          // Don't fail the whole operation if setting default fails
        }
      }

      
      
      return data({ 
        success: true, 
        message: actionType === 'create' ? 'Address created successfully' : 'Address updated successfully',
        addressId: createdAddressId,
        action: actionType
      });
    } catch (error) {
      console.error('Address operation error:', error);
      console.error('Error details:', error.response || error.message);
      
      let errorMessage = 'Operation failed';
      if (error.message) {
        errorMessage = error.message;
      }
      
      return data({ error: errorMessage }, { status: 500 });
    }
  }

  return data({ error: 'Invalid action type' }, { status: 400 });
}