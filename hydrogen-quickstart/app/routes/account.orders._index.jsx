// app/routes/account.orders._index.jsx
import { useLoaderData, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { Image } from '@shopify/hydrogen';

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader({ context, request }) {
  // Check if customer is logged in
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/customerAccessToken=([^;]+)/);
  const accessToken = match?.[1];

  if (!accessToken) {
    return {
      isLoggedIn: false,
      error: 'Please log in to view your orders'
    };
  }

  try {
    // Get customer orders
    const customerRes = await context.storefront.query(
      `
      query getCustomerOrders($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          firstName
          lastName
          email
          orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
            nodes {
              id
              name
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
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
              lineItems(first: 5) {
                nodes {
                  title
                  quantity
                  variant {
                    title
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                }
              }
              shippingAddress {
                address1
                city
                province
                country
                zip
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

    const customer = customerRes?.customer;
    
    if (!customer) {
      return {
        isLoggedIn: false,
        error: 'Invalid customer session'
      };
    }

    // Format orders for display
    const orders = customer.orders?.nodes || [];
    
    // Calculate order stats
    const stats = {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + parseFloat(order.totalPrice.amount), 0),
      fulfilledOrders: orders.filter(o => o.fulfillmentStatus === 'FULFILLED').length,
      pendingOrders: orders.filter(o => o.fulfillmentStatus === 'UNFULFILLED').length
    };

    return {
      isLoggedIn: true,
      orders,
      stats,
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email
      }
    };

  } catch (error) {
    console.error('Orders loader error:', error);
    return {
      isLoggedIn: false,
      error: 'Failed to load orders'
    };
  }
}

/**
 * Orders Page Component
 */
export default function OrdersIndex() {
  const { isLoggedIn, orders, stats, customer, error } = useLoaderData();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loaded, setLoaded] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  
  useEffect(() => {
    // force remove blur after hydration
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Handle invoice download
   */
  const handleDownload = async (orderId, orderNumber, e) => {
    // Prevent the Link from navigating when clicking the download button
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setDownloadingId(orderId);
      
      // Extract just the order ID without any query parameters
      let cleanOrderId = orderId;
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
      setDownloadingId(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-semibold mb-8">My Orders</h1>
          <p className="text-xl text-gray-600 mb-8">
            {error || 'Please log in to view your orders'}
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

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'fulfilled') return order.fulfillmentStatus === 'FULFILLED';
    if (filter === 'unfulfilled') return order.fulfillmentStatus === 'UNFULFILLED';
    if (filter === 'pending') return order.fulfillmentStatus === 'PENDING';
    if (filter === 'paid') return order.financialStatus === 'PAID';
    return true;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.processedAt) - new Date(a.processedAt);
    }
    if (sortBy === 'oldest') {
      return new Date(a.processedAt) - new Date(b.processedAt);
    }
    if (sortBy === 'highest') {
      return parseFloat(b.totalPrice.amount) - parseFloat(a.totalPrice.amount);
    }
    if (sortBy === 'lowest') {
      return parseFloat(a.totalPrice.amount) - parseFloat(b.totalPrice.amount);
    }
    return 0;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'FULFILLED':
        return 'bg-green-100 text-green-800';
      case 'UNFULFILLED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PARTIALLY_FULFILLED':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800';
      case 'PARTIALLY_PAID':
        return 'bg-blue-100 text-blue-800';
      case 'PARTIALLY_REFUNDED':
        return 'bg-indigo-100 text-indigo-800';
      case 'VOIDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount, currencyCode) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">My Orders</h1>
              <p className="mt-2 text-gray-600">
                View and track all your orders
              </p>
            </div>
            <Link
              to="/account"
              className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Account
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.totalSpent, orders[0]?.totalPrice.currencyCode || 'USD')}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-500">Fulfilled</p>
              <p className="text-2xl font-semibold text-green-600">{stats.fulfilledOrders}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-yellow-600">{stats.pendingOrders}</p>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
              <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Link
              to="/collections/all"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {/* Filters and Sorting */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-sm font-medium text-gray-700 mr-3">Filter:</span>
                  <div className="inline-flex space-x-2">
                    {['all', 'fulfilled', 'unfulfilled', 'paid'].map((filterOption) => (
                      <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption)}
                        className={`px-3 py-1 text-sm font-medium rounded-md capitalize ${
                          filter === filterOption
                            ? 'bg-blue-100 text-blue-800'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {filterOption}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 mr-3">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="highest">Highest total</option>
                    <option value="lowest">Lowest total</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {sortedOrders.map((order) => (
                <div
                  key={order.id}
                  className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  {/* Make the entire card clickable except for the action buttons */}
                  <Link to={`/account/orders/${order.orderNumber}`} className="block">
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Order {order.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Placed on {new Date(order.processedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.fulfillmentStatus)}`}>
                            {order.fulfillmentStatus}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.financialStatus)}`}>
                            {order.financialStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        {/* Product Images */}
                        <div className="flex -space-x-2">
                          {order.lineItems.nodes.slice(0, 3).map((item, index) => (
                            <div
                              key={index}
                              className="h-12 w-12 rounded-full bg-gray-100 overflow-hidden"
                            >
                              {item.variant?.image?.url ? (
                                <Image 
                                  src={item.variant.image.url}
                                  sizes="(max-width: 640px) 100vw,
                                       (max-width: 1024px) 50vw,
                                       400px"
                                  alt={item.variant.image.altText || item.title}
                                  className={`"h-full w-full object-cover filter transition-all duration-500"${loaded ? 'blur-0' : 'blur-xl'}`}
                                  loading="lazy"
                                  onLoad={(e) => e.currentTarget.style.filter = 'blur(0)'}
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-200">
                                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          ))}
                          {order.lineItems.nodes.length > 3 && (
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                +{order.lineItems.nodes.length - 3}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Order Summary */}
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            {order.lineItems.nodes.length} item{order.lineItems.nodes.length !== 1 ? 's' : ''}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.lineItems.nodes.map(item => item.title).join(', ').substring(0, 60)}
                            {order.lineItems.nodes.map(item => item.title).join(', ').length > 60 ? '...' : ''}
                          </p>
                        </div>

                        {/* Order Total */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(order.totalPrice.amount, order.totalPrice.currencyCode)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.shippingAddress ? (
                              <>Ship to {order.shippingAddress.city}, {order.shippingAddress.province}</>
                            ) : (
                              'Shipping details not available'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Order Footer with Actions - This part is outside the Link to prevent navigation */}
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4">
                        <Link
                          to={`/account/orders/${order.orderNumber}`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Order Details
                        </Link>
                        
                        {order.fulfillmentStatus !== 'FULFILLED' && order.statusUrl && (
                          <>
                            <span className="text-gray-300">|</span>
                            <a
                              href={order.statusUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Track Order
                            </a>
                          </>
                        )}
                        
                        <span className="text-gray-300">|</span>
                        
                        {/* Download Invoice Button */}
                        <button
                          onClick={(e) => handleDownload(order.id, order.orderNumber, e)}
                          disabled={downloadingId === order.id}
                          className={`text-sm font-medium ${
                            downloadingId === order.id
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-blue-600 hover:text-blue-800'
                          }`}
                        >
                          {downloadingId === order.id ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Downloading...
                            </span>
                          ) : (
                            'Download Invoice'
                          )}
                        </button>
                      </div>
                      
                      {/* Arrow icon */}
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Results Summary */}
            {filteredOrders.length !== orders.length && (
              <div className="mt-4 text-sm text-gray-500">
                Showing {filteredOrders.length} of {orders.length} orders
                <button
                  onClick={() => setFilter('all')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  Clear filter
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** @typedef {import('./+types/account.orders._index').Route} Route */