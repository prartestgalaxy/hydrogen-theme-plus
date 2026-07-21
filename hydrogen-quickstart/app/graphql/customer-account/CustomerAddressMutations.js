// // NOTE: https://shopify.dev/docs/api/customer/latest/mutations/customerAddressUpdate
// export const UPDATE_ADDRESS_MUTATION = `#graphql
//   mutation customerAddressUpdate(
//     $address: CustomerAddressInput!
//     $addressId: ID!
//     $defaultAddress: Boolean
//     $language: LanguageCode
//  ) @inContext(language: $language) {
//     customerAddressUpdate(
//       address: $address
//       addressId: $addressId
//       defaultAddress: $defaultAddress
//     ) {
//       customerAddress {
//         id
//       }
//       userErrors {
//         code
//         field
//         message
//       }
//     }
//   }
// `;

// // NOTE: https://shopify.dev/docs/api/customer/latest/mutations/customerAddressDelete
// export const DELETE_ADDRESS_MUTATION = `#graphql
//   mutation customerAddressDelete(
//     $addressId: ID!
//     $language: LanguageCode
//   ) @inContext(language: $language) {
//     customerAddressDelete(addressId: $addressId) {
//       deletedAddressId
//       userErrors {
//         code
//         field
//         message
//       }
//     }
//   }
// `;

// // NOTE: https://shopify.dev/docs/api/customer/latest/mutations/customerAddressCreate
// export const CREATE_ADDRESS_MUTATION = `#graphql
//   mutation customerAddressCreate(
//     $address: CustomerAddressInput!
//     $defaultAddress: Boolean
//     $language: LanguageCode
//   ) @inContext(language: $language) {
//     customerAddressCreate(
//       address: $address
//       defaultAddress: $defaultAddress
//     ) {
//       customerAddress {
//         id
//       }
//       userErrors {
//         code
//         field
//         message
//       }
//     }
//   }
// `;
// CustomerAddressMutations.js
// In ~/graphql/customer-account/CustomerAddressMutations.js
// In ~/graphql/customer-account/CustomerAddressMutations.js
export const CREATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const UPDATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const DELETE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      userErrors {
        field
        message
      }
    }
  }
`;
