// app/routes/account.orders.$id.jsx
import { useLoaderData, Link } from 'react-router';
import { useState, useEffect } from 'react';
import {Image} from '@shopify/hydrogen';
import No_Image from '../assets/No_image.jpg';

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader({ context, request, params }) {
  // Check if customer is logged in
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/customerAccessToken=([^;]+)/);
  const accessToken = match?.[1];

  if (!accessToken) {
    return {
      isLoggedIn: false,
      error: 'Please log in to view order details'
    };
  }

  const orderId = params.id;
  
  // Extract order number
  let orderNumber;
  if (orderId.includes('gid://')) {
    orderNumber = orderId.split('/').pop();
  } else if (orderId.includes('gid:/')) {
    orderNumber = orderId.replace('gid:/', 'gid://').split('/').pop();
  } else {
    orderNumber = orderId;
  }

  try {
    // First, get the customer to verify ownership
    const customerRes = await context.storefront.query(
      `
      query getCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          firstName
          lastName
          email
        }
      }
      `,
      {
        variables: {
          customerAccessToken: accessToken,
        },
      }
    );

    const customer = customerRes?.customer;
    
    if (!customer) {
      return {
        isLoggedIn: true,
        error: 'Customer not found',
        order: null
      };
    }

    // Get the specific order - FIXED QUERY WITH CORRECT FIELD NAMES
    const ordersRes = await context.storefront.query(
      `
      query getCustomerOrders($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
            nodes {
              id
              name
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              canceledAt
              cancelReason
              totalPrice {
                amount
                currencyCode
              }
              subtotalPrice {
                amount
                currencyCode
              }
              totalShippingPrice {
                amount
                currencyCode
              }
              totalTax {
                amount
                currencyCode
              }
              totalRefunded {
                amount
                currencyCode
              }
              shippingAddress {
                address1
                address2
                city
                province
                country
                zip
                phone
                firstName
                lastName
                
              }
              billingAddress {
                address1
                address2
                city
                province
                country
                zip
                phone
                firstName
                lastName
              
              }
              lineItems(first: 50) {
                nodes {
                  title
                  quantity
                  variant {
                    id
                    title
                    sku
                    image {
                      url
                      altText
                      width
                      height
                    }
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
                    }
                  }
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                  discountedTotalPrice {
                    amount
                    currencyCode
                  }
                }
              }
              successfulFulfillments(first: 5) {
                trackingInfo {
                  number
                  url
                  
                }
              }
              statusUrl
            }
          }
        }
      }
      `,
      {
        variables: {
          customerAccessToken: accessToken,
        },
      }
    );

    // Find the order by order number
    const order = ordersRes?.customer?.orders?.nodes?.find(
      o => o.orderNumber.toString() === orderNumber.toString()
    );

    if (!order) {
      return {
        isLoggedIn: true,
        error: 'Order not found',
        order: null,
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email
        }
      };
    }

    // Format the order data for display
    const formattedOrder = {
      ...order,
      processedAt: new Date(order.processedAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      processedAtRaw: order.processedAt,
      totalItems: order.lineItems.nodes.reduce((acc, item) => acc + item.quantity, 0)
    };

    return {
      isLoggedIn: true,
      order: formattedOrder,
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email
      }
    };

  } catch (error) {
    console.error('Order details error:', error);
    return {
      isLoggedIn: true,
      error: 'Failed to load order details: ' + error.message,
      order: null
    };
  }
}

function getPaymentStatusDisplay(status) {
  const statusMap = {
    'PAID': { label: 'Paid', color: 'green', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    'PENDING': { label: 'Pending', color: 'yellow', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    'REFUNDED': { label: 'Refunded', color: 'purple', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z' },
    'PARTIALLY_PAID': { label: 'Partially Paid', color: 'blue', icon: 'M17 9V7a4 4 0 00-8 0v2M5 9h14l1 12H4L5 9z' },
    'PARTIALLY_REFUNDED': { label: 'Partially Refunded', color: 'indigo', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z' },
    'VOIDED': { label: 'Voided', color: 'red', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
  };
  return statusMap[status] || { label: status || 'Unknown', color: 'gray', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
}

function getFulfillmentStatusDisplay(status) {
  const statusMap = {
    'FULFILLED': { label: 'Fulfilled', color: 'green', icon: 'M5 13l4 4L19 7' },
    'UNFULFILLED': { label: 'Unfulfilled', color: 'yellow', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    'PARTIALLY_FULFILLED': { label: 'Partially Fulfilled', color: 'blue', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    'RESTOCKED': { label: 'Restocked', color: 'gray', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    'PENDING_FULFILLMENT': { label: 'Pending Fulfillment', color: 'orange', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    'SCHEDULED': { label: 'Scheduled', color: 'purple', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
  };
  return statusMap[status] || { label: status || 'Unknown', color: 'gray', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
}

/**
 * Order Details Page Component
 */
export default function OrderDetails() {
  const { isLoggedIn, order, customer, error } = useLoaderData();
  const [activeTab, setActiveTab] = useState('items');
  const [downloading, setDownloading] = useState(false);

  /**
   * Handle invoice download
   */
  const handleDownload = async (e) => {
    e.preventDefault();
    
    if (downloading) return;
    
    try {
      setDownloading(true);
      
      // Extract just the order ID without any query parameters
      let cleanOrderId = order.id;
      if (cleanOrderId.includes('?')) {
        cleanOrderId = cleanOrderId.split('?')[0];
      }
      
      // Properly encode the clean order ID for the URL
      const encodedOrderId = encodeURIComponent(cleanOrderId);
      const response = await fetch(`/api/account/orders/${encodedOrderId}/invoice`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to download invoice' }));
        throw new Error(error.error || 'Failed to download invoice');
      }

      const html = await response.text();
      
      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      document.body.appendChild(iframe);
      
      // Write the HTML to the iframe
      const iframeDoc = iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();
      
      // Wait for iframe to load then print
      iframe.onload = () => {
        setTimeout(() => {
          // Focus the iframe and trigger print
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          
          // Remove iframe after print dialog closes
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 1000);
        }, 500);
      };
      
    } catch (error) {
      console.error('Download error:', error);
      alert(error.message || 'Failed to download invoice. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-semibold mb-8">Order Details</h1>
          <p className="text-xl text-gray-600 mb-8">
            {error || 'Please log in to view order details'}
          </p>
          <Link
            to="/signin"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Log in to continue
          </Link>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto h-24 w-24 text-red-500 mb-6">
            <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">{error || 'The order you\'re looking for doesn\'t exist'}</p>
          <Link
            to="/account/orders"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const paymentStatus = getPaymentStatusDisplay(order.financialStatus);
  const fulfillmentStatus = getFulfillmentStatusDisplay(order.fulfillmentStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with breadcrumbs */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-500 mb-4">
            <Link to="/account" className="hover:text-blue-600">Account</Link>
            <svg className="h-5 w-5 mx-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <Link to="/account/orders" className="hover:text-blue-600">Orders</Link>
            <svg className="h-5 w-5 mx-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-900 font-medium">{order.name}</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Order {order.name}</h1>
              <p className="mt-2 text-gray-600">
                Placed on {order.processedAt}
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/account/orders"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Orders
              </Link>
              
              {/* Download Invoice Button */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md ${
                  downloading
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'text-white bg-green-600 hover:bg-green-700'
                }`}
              >
                {downloading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Invoice
                  </>
                )}
              </button>

              {order.statusUrl && (
                <a
                  href={order.statusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Track Order
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Order Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Payment Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 bg-${paymentStatus.color}-100 rounded-lg p-3`}>
                <svg className={`h-6 w-6 text-${paymentStatus.color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paymentStatus.icon} />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Payment Status</p>
                <p className={`text-lg font-semibold text-${paymentStatus.color}-600`}>
                  {paymentStatus.label}
                </p>
              </div>
            </div>
          </div>

          {/* Fulfillment Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 bg-${fulfillmentStatus.color}-100 rounded-lg p-3`}>
                <svg className={`h-6 w-6 text-${fulfillmentStatus.color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={fulfillmentStatus.icon} />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Fulfillment Status</p>
                <p className={`text-lg font-semibold text-${fulfillmentStatus.color}-600`}>
                  {fulfillmentStatus.label}
                </p>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Order Total</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: order.totalPrice.currencyCode
                  }).format(order.totalPrice.amount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab('items')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'items'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Order Items ({order.totalItems})
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'summary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Order Summary
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'shipping'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Shipping Information
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'items' && (
            <OrderItemsTab order={order} />
          )}
          {activeTab === 'summary' && (
            <OrderSummaryTab order={order} />
          )}
          {activeTab === 'shipping' && (
            <ShippingInfoTab order={order} customer={customer} />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Order Items Tab Component
 */
function OrderItemsTab({ order }) {
   const [loaded, setLoaded] = useState(false);
        useEffect(() => {
          // force remove blur after hydration
          const timer = setTimeout(() => setLoaded(true), 50);
          return () => clearTimeout(timer);
        }, []);
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Items in this order</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {order.lineItems.nodes.map((item, index) => (
          <div key={index} className="px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                {/* Product Image */}
                <div className="flex-shrink-0 h-20 w-20 bg-gray-100 rounded-lg overflow-hidden">
                  {item.variant?.image?.url ? (
                  <Image
                    src={item.variant.image.url}
                    alt={item.variant.image.altText || item.title}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 640px) 100vw,
                          (max-width: 1024px) 50vw,
                          400px"
                    className={`
                      h-full w-full object-cover
                      scale-105
                      transition-all duration-700 ease-out
                      ${loaded ? 'blur-0' : 'blur-xl'} 
                    `}
                    onLoad={(e) => {
                      e.currentTarget.classList.remove('blur-xl', 'scale-105');
                      e.currentTarget.classList.add('blur-0', 'scale-100');
                    }}
                  />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200">
                      <img src={No_Image} alt="No Image" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900">
                    {item.variant?.product ? (
                      <Link to={`/products/${item.variant.product.handle}`} className="hover:text-blue-600">
                        {item.title}
                      </Link>
                    ) : (
                      item.title
                    )}
                  </h3>
                  {item.variant?.title && item.variant.title !== 'Default Title' && (
                    <p className="text-sm text-gray-500 mt-1">Variant: {item.variant.title}</p>
                  )}
                  {item.variant?.sku && (
                    <p className="text-sm text-gray-500">SKU: {item.variant.sku}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mt-4 sm:mt-0 text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: item.originalTotalPrice.currencyCode
                  }).format(item.originalTotalPrice.amount)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: item.originalTotalPrice.currencyCode
                  }).format(item.originalTotalPrice.amount / item.quantity)} each
                </p>
              </div>
            </div>

            {/* Discount Information */}
            {item.discountedTotalPrice && (
              <div className="mt-2 text-sm text-green-600">
                Discount applied
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Order Summary Tab Component
 */
function OrderSummaryTab({ order }) {
  const formatCurrency = (amount, currencyCode) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">
                {formatCurrency(order.subtotalPrice.amount, order.subtotalPrice.currencyCode)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">
                {formatCurrency(order.totalShippingPrice.amount, order.totalShippingPrice.currencyCode)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">
                {formatCurrency(order.totalTax.amount, order.totalTax.currencyCode)}
              </span>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-base font-medium">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  {formatCurrency(order.totalPrice.amount, order.totalPrice.currencyCode)}
                </span>
              </div>
              {order.totalRefunded?.amount > 0 && (
                <div className="flex justify-between text-sm text-red-600 mt-2">
                  <span>Refunded</span>
                  <span>
                    -{formatCurrency(order.totalRefunded.amount, order.totalRefunded.currencyCode)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Shipping Information Tab Component
 */
function ShippingInfoTab({ order, customer }) {
  const shippingAddress = order.shippingAddress;
  const billingAddress = order.billingAddress;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Shipping Address */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>
        </div>
        <div className="p-6">
          {shippingAddress ? (
            <div className="space-y-1 text-gray-600">
              <p className="font-medium text-gray-900">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </p>
              {/* {shippingAddress.company && (
                <p className="text-sm">{shippingAddress.company}</p>
              )} */}
              <p className="text-sm">{shippingAddress.address1}</p>
              {shippingAddress.address2 && (
                <p className="text-sm">{shippingAddress.address2}</p>
              )}
              <p className="text-sm">
                {shippingAddress.city}, {shippingAddress.province} {shippingAddress.zip}
              </p>
              <p className="text-sm">{shippingAddress.country}</p>
              {shippingAddress.phone && (
                <p className="text-sm mt-4">Phone: {shippingAddress.phone}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No shipping address available</p>
          )}
        </div>
      </div>

      {/* Billing Address */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Billing Address</h2>
        </div>
        <div className="p-6">
          {billingAddress ? (
            <div className="space-y-1 text-gray-600">
              <p className="font-medium text-gray-900">
                {billingAddress.firstName} {billingAddress.lastName}
              </p>
              {/* {billingAddress.company && (
                <p className="text-sm">{billingAddress.company}</p>
              )} */}
              <p className="text-sm">{billingAddress.address1}</p>
              {billingAddress.address2 && (
                <p className="text-sm">{billingAddress.address2}</p>
              )}
              <p className="text-sm">
                {billingAddress.city}, {billingAddress.province} {billingAddress.zip}
              </p>
              <p className="text-sm">{billingAddress.country}</p>
              {billingAddress.phone && (
                <p className="text-sm mt-4">Phone: {billingAddress.phone}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No billing address available</p>
          )}
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden md:col-span-2">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Customer Information</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-900">
            {customer.firstName} {customer.lastName}
          </p>
          <p className="text-sm text-gray-600 mt-1">{customer.email}</p>
        </div>
      </div>
    </div>
  );
}

/** @typedef {import('./+types/account.orders.$id').Route} Route */