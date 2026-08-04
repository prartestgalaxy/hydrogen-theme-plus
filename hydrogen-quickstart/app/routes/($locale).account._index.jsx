import {
  useLoaderData,
  Link,
  Form,
  useFetcher,
  useNavigate,
  useSearchParams,
  useRouteLoaderData,
} from 'react-router';
import {useState, useEffect} from 'react';
import No_Image from '../assets/No_image.jpg';
import LogoSlider from '~/components/LogoSlider';

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader({context, request}) {
  // Check if customer is logged in
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/customerAccessToken=([^;]+)/);
  const accessToken = match?.[1];

  if (!accessToken) {
    return {
      isLoggedIn: false,
      error: 'Please log in to view your account',
    };
  }

  try {
    // Get customer details with addresses AND orders
    const customerRes = await context.storefront.query(
      `query getCustomerWithOrders($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          email
          firstName
          lastName
          phone
          defaultAddress {
            id
            address1
            city
            province
            country
            zip
          }
          addresses(first: 20) {
            nodes {
              id
              address1
              address2
              city
              province
              country
              zip
              phone
              firstName
              lastName
              company
              formatted
            }
          }
          orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
            nodes {
              id
              name
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              currentTotalPrice {
                amount
                currencyCode
              }
               discountApplications(first: 10) {
          nodes {
            __typename

            ... on DiscountCodeApplication {
              code        
              applicable 
            }

            value {
              __typename
              ... on PricingPercentageValue {
                percentage 
              }
              ... on MoneyV2 {
                amount
                currencyCode
              }
            }
          }
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
              shippingAddress {
                address1
                city
                province
                country
                zip
              }
              currentSubtotalPrice {
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
            }
          }
        }
      }`,
      {
        variables: {
          customerAccessToken: accessToken,
        },
      },
    );

    const customer = customerRes?.customer;

    if (!customer) {
      return {
        isLoggedIn: false,
        error: 'Invalid customer session',
      };
    }

    return {
      isLoggedIn: true,
      customer: {
        ...customer,
        fullName:
          `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim(),
        initials: (
          (customer?.firstName?.[0] || '') + (customer?.lastName?.[0] || '')
        ).toUpperCase(),
      },
      addresses: customer?.addresses?.nodes || [],
      defaultAddressId: customer?.defaultAddress?.id,
      orders: customer?.orders?.nodes || [],
    };
  } catch (error) {
    console.error('Account loader error:', error);
    return {
      isLoggedIn: false,
      error: 'Failed to load account information',
    };
  }
}

/**
 * Account Dashboard Component
 */
export default function Account() {
  const {isLoggedIn, customer, addresses, orders, defaultAddressId, error} =
    useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  // const [activeTab, setActiveTab] = useState('profile');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'profile';

  const rootData = useRouteLoaderData('root');
  // console.log('rootData: ', rootData);

  const GlobalSettings = rootData?.globalSettings;
  // console.log('GlobalSettings: ', GlobalSettings);

  const dynamicStyles = `
    .account-dashboard {
      font-family: ${GlobalSettings?.fontFamily ? GlobalSettings.fontFamily : 'Montserrat, sans-serif'};
      font-size: ${GlobalSettings?.baseFontSize ? GlobalSettings.baseFontSize : 16}px;
    }
    .account-dashboard h1 { font-size: ${GlobalSettings?.headingSizes?.h1 ? GlobalSettings.headingSizes.h1 : 42}px; }
    .account-dashboard h2 { font-size: ${GlobalSettings?.headingSizes?.h2 ? GlobalSettings.headingSizes.h2 : 40}px; }
    .account-dashboard h3 { font-size: ${GlobalSettings?.headingSizes?.h3 ? GlobalSettings.headingSizes.h3 : 32}px; }
    .account-dashboard h4 { font-size: ${GlobalSettings?.headingSizes?.h4 ? GlobalSettings.headingSizes.h4 : 24}px; }
    .account-dashboard h5 { font-size: ${GlobalSettings?.headingSizes?.h5 ? GlobalSettings.headingSizes.h5 : 20}px; }
    .account-dashboard h6 { font-size: ${GlobalSettings?.headingSizes?.h6 ? GlobalSettings.headingSizes.h6 : 16}px; }

    .btn-primary {
      background-color: #${GlobalSettings?.buttons?.primaryBg ? GlobalSettings.buttons.primaryBg : '23A6F0'};
      color: #${GlobalSettings?.buttons?.primaryText ? GlobalSettings.buttons.primaryText : 'FFFFFF'};
      border-radius: ${GlobalSettings?.buttons?.borderRadius != null && GlobalSettings?.buttons?.borderRadius !== '' ? GlobalSettings.buttons.borderRadius : 8}px;
    }
    .btn-primary:hover {
      background-color: #${GlobalSettings?.buttons?.primaryHoverBg ? GlobalSettings.buttons.primaryHoverBg : '1D4ED8'};
      color: #${GlobalSettings?.buttons?.primaryHovertxt ? GlobalSettings.buttons.primaryHovertxt : 'FFFFFF'};
    }

    .btn-secondary {
      background-color: #${GlobalSettings?.buttons?.secondaryBg ? GlobalSettings.buttons.secondaryBg : '000000'};
      color: #${GlobalSettings?.buttons?.secondaryText ? GlobalSettings.buttons.secondaryText : 'FFFFFF'};
      border-radius: ${GlobalSettings?.buttons?.borderRadius != null && GlobalSettings?.buttons?.borderRadius !== '' ? GlobalSettings.buttons.borderRadius : 8}px;
    }
    .btn-secondary:hover {
      background-color: #${GlobalSettings?.buttons?.secondaryHoverBg ? GlobalSettings.buttons.secondaryHoverBg : 'D1D5DB'};
      color: #${GlobalSettings?.buttons?.secondaryHovertxt ? GlobalSettings.buttons.secondaryHovertxt : '000000'};
    }

    .account-link {
      color: #${GlobalSettings?.linksEffect?.linkColor ? GlobalSettings.linksEffect.linkColor : '737373'};
      transition: all ${GlobalSettings?.linksEffect?.transitionDuration != null && GlobalSettings?.linksEffect?.transitionDuration !== '' ? GlobalSettings.linksEffect.transitionDuration : 300}ms;
      text-decoration: ${(GlobalSettings?.linksEffect?.underlineStyle ? GlobalSettings.linksEffect.underlineStyle : 'none') === 'always' ? 'underline' : 'none'};
    }
    .account-link:hover {
      color: #${GlobalSettings?.linksEffect?.hoverColor ? GlobalSettings.linksEffect.hoverColor : '5a5a5a'};
      ${(GlobalSettings?.linksEffect?.hoverEffect ? GlobalSettings.linksEffect.hoverEffect : 'none') === 'underline' ? 'text-decoration: underline;' : ''}
    }
  `;

  // Update URL when tab changes
  const setActiveTab = (tab) => {
    setSearchParams({tab});
  };

  const onBack = () => {
    setActiveTab('orders');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });

      if (response.ok) {
        navigate('/signin', {replace: true});
      } else {
        console.error('Logout failed:', await response.text());
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 account-dashboard">
        {GlobalSettings && <style>{dynamicStyles}</style>}
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-semibold mb-8">My Account</h1>
          <p className="text-xl text-gray-600 mb-8">
            {error || 'Please log in to view your account'}
          </p>
          <Link
            to="/signin"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm btn-primary"
          >
            Log in to continue
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'profile',
      name: 'My Account',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
    {
      id: 'orders',
      name: 'My Orders',
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    },
    {
      id: 'addresses',
      name: 'My Addresses',
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    },
  ];

  const [navLinks, setNavLinks] = useState([
    {name: 'Home', to: '/'},
    {name: 'Accounts', to: '/account'},
    {name: 'My Accountss', to: `/account`},
  ]);

  useEffect(() => {
    if (activeTab === 'profile') {
      setNavLinks([
        {name: 'Home', to: '/'},
        {name: 'Accounts', to: '/account'},
        {name: 'My Account', to: `/account`},
      ]);
    }
    if (activeTab === 'orders') {
      setNavLinks([
        {name: 'Home', to: '/'},
        {name: 'Accounts', to: '/account'},
        {name: 'My Orders', to: `/account`},
      ]);
    }
    if (activeTab === 'addresses') {
      setNavLinks([
        {name: 'Home', to: '/'},
        {name: 'Accounts', to: '/account'},
        {name: 'My Addresses', to: `/account`},
      ]);
    }
    if (activeTab === 'orderDetails') {
      setNavLinks([
        {name: 'Home', to: '/'},
        {name: 'Accounts', to: '/account'},
        {name: 'Order Details', to: `/account`},
      ]);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 account-dashboard">
      {GlobalSettings && <style>{dynamicStyles}</style>}
      <div className="max-w-[100%] px-[7%] mx-auto lg: py-8">
        <div className=" hidden sm:flex justify-between items-center py-6">
          {/* Left Title */}
          <h3 className="text-lg font-semibold leading-[32px] tracking-[0.1px]">
            Account Details
          </h3>

          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 gap-[15px] py-[10px]">
            {navLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-[15px]">
                <Link
                  to={link?.to}
                  className="account-link text-gray-500 hover:text-black transition-colors text-[14px] leading-[24px] tracking-[0.2px]"
                >
                  {link?.name}
                </Link>

                {index !== navLinks.length - 1 && (
                  <span className="text-gray-400 w-[9px] h-[16px]">{'>'}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col md:flex-row gap-[30px] max-w-[100%]">
          <div className="md:border-r-2 flex md:flex-col">
            <nav className="flex md:flex-col p-[25px] justify-center flex-wrap md:min-w-max gap-[10px]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  //
                  className={`
                  group inline-flex items-center py-[13px] px-[25px] min-w-[187px] font-bold text-[16px] leading-[24px] tracking-[0.1px]
                  ${
                    activeTab === tab.id
                      ? 'border-l-blue-500 text-white bg-blue-500 rounded-md'
                      : 'border-l-transparent text-gray-500 hover:text-gray-700 hover:border-l-gray-300'
                  }
                `}
                >
                  {/* <svg
                    className={`
                    mr-3 h-5 w-5
                    ${activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}
                  `}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={tab.icon}
                    />
                  </svg> */}
                  <span className="min-w-fit">{tab.name}</span>
                </button>
              ))}

              <div className=" hidden md:block w-[100%] h-[1px] bg-[#E7E7E7]"></div>

              <button
                onClick={handleLogout}
                className="group inline-flex items-center py-[13px] px-[25px] min-w-[187px] font-medium text-[16px] leading-[24px] tracking-[0.1px] border-l-transparent text-red-500 hover:text-red-700 hover:border-l-red-300 hover:bg-red-50 rounded-md transition-colors"
              >
                {/* <svg
                  className="mr-3 h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="16 17 21 12 16 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="21"
                    y1="12"
                    x2="9"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg> */}
                Logout
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="w-full">
            {activeTab === 'orders' && (
              <OrdersTab
                setSelectedOrderId={setSelectedOrderId}
                orders={orders}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'addresses' && (
              <AddressesTab
                addresses={addresses}
                defaultAddressId={defaultAddressId}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileTab
                customer={customer}
                orders={orders}
                addresses={addresses}
                defaultAddressId={defaultAddressId}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'orderDetails' && (
              <OrderDetails
                order={orders?.find((o) => o?.id === selectedOrderId)}
                onBack={onBack}
              />
            )}
          </div>
        </div>
      </div>
      <LogoSlider />
    </div>
  );
}

/**
 * Orders Tab Component - UPDATED with enhanced invoice download
 */
function OrdersTab({orders, setActiveTab, setSelectedOrderId}) {
  const [filter, setFilter] = useState('all');
  const [loaded, setLoaded] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    // force remove blur after hydration
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = (orders || []).filter((order) => {
    if (filter === 'all') return true;
    if (filter === 'fulfilled') return order?.fulfillmentStatus === 'FULFILLED';
    if (filter === 'unfulfilled')
      return order?.fulfillmentStatus === 'UNFULFILLED';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'FULFILLED':
        return 'bg-green-100 text-green-800';
      case 'UNFULFILLED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PARTIALLY_FULFILLED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800';
      case 'VOIDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleDownload = async (orderId, orderNumber) => {
    try {
      setDownloadingId(orderId);

      // Extract just the order ID without any query parameters
      let cleanOrderId = orderId;
      if (cleanOrderId.includes('?')) {
        cleanOrderId = cleanOrderId.split('?')[0];
      }

      // Properly encode the clean order ID for the URL
      const encodedOrderId = encodeURIComponent(cleanOrderId);
      const response = await fetch(
        `/api/account/orders/${encodedOrderId}/invoice`,
      );

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({error: 'Failed to download invoice'}));
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
          // Note: The print dialog is modal, so this will run after user closes it
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

  if (!orders?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
          <svg
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No orders yet
        </h3>
        <p className="text-gray-600 mb-6">
          Start shopping to see your orders here
        </p>
        <Link
          to="/collections/all"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium btn-primary"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Filter Bar */}
      {/* <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex flex-wrap gap-2 flex-col sm:flex-row">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilter('fulfilled')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'fulfilled'
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Fulfilled
            </button>
            <button
              onClick={() => setFilter('unfulfilled')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'unfulfilled'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Unfulfilled
            </button>
          </div>
        </div>
      </div> */}

      <div className="flex flex-col gap-[12px] py-[10px]">
        <h3 className="font-bold leading-[32px] tracking-[0.1px]">
          Your Orders
        </h3>
        <p className="text-[14px] leading-[20px]">
          Everything you've bought, All in one place
        </p>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-[20px]">
        {filteredOrders.map((order) => (
          <Link
            key={order.id}
            to={`/account/orders/${order.orderNumber}`}
            className="block bg-gray-100 rounded-[12px] overflow-hidden hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer pb-[20px] flex flex-col gap-[10px]"
          >
            {/* Order Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
              <h5 className="text-[16px] leading-[20px] font-bold text-gray-500 text-[#737373]">
                <span
                  className="hover:underline"
                  // onClick={() => {
                  //   setActiveTab('orderDetails');
                  //   setSelectedOrderId(order.id);
                  // }}
                >
                  Order: {order.name}
                </span>
              </h5>
              <span
                className={`text-[16px] leading-[24px] font-bold ${
                  order?.fulfillmentStatus === 'FULFILLED'
                    ? 'text-green-600'
                    : order?.fulfillmentStatus === 'IN_PROGRESS' ||
                        order?.financialStatus === 'PAID'
                      ? 'text-orange-400'
                      : 'text-gray-500'
                }`}
              >
                {order?.fulfillmentStatus === 'FULFILLED'
                  ? 'Delivered'
                  : order?.fulfillmentStatus === 'IN_PROGRESS'
                    ? 'In Progress'
                    : order?.financialStatus === 'PAID'
                      ? 'In Progress'
                      : order?.fulfillmentStatus}
              </span>
            </div>

            {/* Divider */}
            {/* <div className="border-t border-gray-200 mx-4" /> */}

            {/* Order Items */}
            <div className="px-[24px]">
              {order?.lineItems?.nodes?.slice(0, 2).map((item, index) => (
                <div key={index} className="flex items-end gap-[20px]">
                  {item?.variant?.image ? (
                    <img
                      src={item.variant.image.url}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      alt={item?.variant?.image?.altText || item?.title}
                      className={`h-[100px] w-[100px] object-cover rounded-lg bg-white filter transition-all duration-500 ${loaded ? 'blur-0' : 'blur-xl'}`}
                      loading="lazy"
                      onLoad={(e) => (e.currentTarget.style.filter = 'blur(0)')}
                    />
                  ) : (
                    <img
                      src={No_Image}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      alt={item?.variant?.image?.altText || item?.title}
                      className={`h-20 w-16 object-cover rounded-lg bg-white filter transition-all duration-500 ${loaded ? 'blur-0' : 'blur-xl'}`}
                      loading="lazy"
                      onLoad={(e) => (e.currentTarget.style.filter = 'blur(0)')}
                    />
                  )}
                  <div className="flex-1 flex flex-col py-[10px] gap-[8px]">
                    <h5 className="font-bold text-gray-900">{item?.title}</h5>
                    {item?.variant?.title !== 'Default Title' && (
                      <p className="text-[14] leading-[20px] font-medium text-gray-500">
                        {item?.variant?.title}
                      </p>
                    )}
                    <p className="text-[14px] leading-[20px] font-medium text-gray-500">
                      Quantity : {item?.quantity}
                    </p>
                    <p className="text-[14px] leading-[20px] font-medium text-gray-500">
                      Order Placed On :{' '}
                      {new Date(order?.processedAt).toLocaleDateString(
                        'en-GB',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        },
                      )}
                    </p>
                  </div>
                  <div className="pb-[15px] text-right">
                    <h6 className="leading-[20px] font-normal text-gray-500">
                      Subtotal
                    </h6>
                    <h5 className="leading-[20px] font-bold text-gray-900">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: item?.originalTotalPrice?.currencyCode,
                      }).format(item?.originalTotalPrice?.amount)}
                    </h5>
                  </div>
                </div>
              ))}
              {(order?.lineItems?.nodes?.length ?? 0) > 2 && (
                <p className="text-xs text-gray-500 mt-2">
                  +{order.lineItems.nodes.length - 2} more item(s)
                </p>
              )}
            </div>

            {/* Hidden preserved logic: footer actions, totals, download */}
            <div className="hidden">
              <div>
                <p>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: order?.currentSubtotalPrice?.currencyCode,
                  }).format(order?.currentSubtotalPrice?.amount)}
                </p>
                <p>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: order?.totalShippingPrice?.currencyCode,
                  }).format(order?.totalShippingPrice?.amount)}
                </p>
                <p>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: order?.totalTax?.currencyCode,
                  }).format(order?.totalTax?.amount)}
                </p>
                <p>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: order?.currentTotalPrice?.currencyCode,
                  }).format(order?.currentTotalPrice?.amount)}
                </p>
              </div>
              <Link to={`/account/orders/${order.orderNumber}`}>
                View Order Details
              </Link>
              {order.fulfillmentStatus !== 'FULFILLED' && (
                <Link to={`/account/orders/${order.id}/track`}>
                  Track Order
                </Link>
              )}
              <button
                onClick={() => handleDownload(order.id, order.orderNumber)}
                disabled={downloadingId === order.id}
              >
                {downloadingId === order.id
                  ? 'Downloading...'
                  : 'Download Invoice'}
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Addresses Tab Component
 */
// function AddressesTab({addresses, defaultAddressId}) {
//   const fetcher = useFetcher();
//   const [isAddingNew, setIsAddingNew] = useState(false);
//   const [editingAddressId, setEditingAddressId] = useState(null);

//   return (
//     <div>
//       {/* Add New Address Button */}
//       {!isAddingNew && (
//         <button
//           onClick={() => setIsAddingNew(true)}
//           className="mb-8 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//         >
//           <svg
//             className="h-5 w-5 mr-2"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 4v16m8-8H4"
//             />
//           </svg>
//           Add New Address
//         </button>
//       )}

//       {/* Add Address Form */}
//       {isAddingNew && (
//         <AddressForm
//           onCancel={() => setIsAddingNew(false)}
//           fetcher={fetcher}
//           isDefault={addresses.length === 0}
//         />
//       )}

//       {/* Addresses Grid */}
//       {addresses.length === 0 && !isAddingNew ? (
//         <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//           <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
//             <svg
//               className="h-16 w-16"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//               />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             No addresses yet
//           </h3>
//           <p className="text-gray-600 mb-6">
//             Add your first shipping or billing address
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {addresses.map((address, index) => (
//             <AddressCard
//               key={address.id}
//               address={address}
//               isDefault={address.id === defaultAddressId}
//               onEdit={() => setEditingAddressId(address.id)}
//               isEditing={editingAddressId === address.id}
//               onCancel={() => setEditingAddressId(null)}
//               fetcher={fetcher}
//               index={index+1}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
function AddressesTab({addresses = [], defaultAddressId}) {
  const fetcher = useFetcher();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  return (
    <div className="w-full flex flex-col gap-[48px]">
      {/* Add Button */}
      {!isAddingNew && (
        <div className="flex justify-between items-center gap-[12px] py-[10px]">
          <div className="flex flex-col ">
            <h3 className="font-bold leading-[32px] tracking-[0.1px]">
              Your Orders
            </h3>
            <p className="text-[14px] leading-[20px]">
              Everything you've bought, All in one place
            </p>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="py-[13px] px-[25px] flex items-center gap-[10px] text-[16px] leading-[24px] tracking-[0.1px] text-[#23A6F0] border border-2 border-[#23A6F0] rounded-[5px]"
          >
            <svg
              className="h-[25px] w-[25px] flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New
          </button>
        </div>
      )}

      {/* Form */}
      {isAddingNew && (
        <div className="mb-6">
          <AddressForm
            onCancel={() => setIsAddingNew(false)}
            fetcher={fetcher}
            isDefault={addresses.length === 0}
          />
        </div>
      )}

      {/* Empty */}
      {addresses.length === 0 && !isAddingNew ? (
        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No addresses yet
          </h3>
          <p className="text-gray-600">
            Add your first shipping or billing address
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
          {addresses.map((address, index) => (
            <AddressCard
              key={address.id}
              address={address}
              isDefault={address.id === defaultAddressId}
              onEdit={() => setEditingAddressId(address.id)}
              isEditing={editingAddressId === address.id}
              onCancel={() => setEditingAddressId(null)}
              fetcher={fetcher}
              index={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Profile Tab Component
 */
function ProfileTab({
  customer,
  orders = [],
  addresses = [],
  defaultAddressId,
  setActiveTab,
}) {
  const fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState(false);

  const [submitError, setSubmitError] = useState(null);

  // Close and reload on successful save
  useEffect(() => {
    if (fetcher?.data?.success && fetcher?.state === 'idle') {
      setIsEditing(false);
      window.location.reload();
    }
  }, [fetcher?.data, fetcher?.state]);

  // Sync error from fetcher and auto-dismiss after 3 seconds
  useEffect(() => {
    if (fetcher?.data?.error) {
      setSubmitError(fetcher.data.error);
      const timer = setTimeout(() => setSubmitError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [fetcher?.data?.error]);

  if (isEditing) {
    const isSubmitting = fetcher.state === 'submitting';
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Edit Profile</h2>

        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        <fetcher.Form
          method="post"
          action="/api/account/profile"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                defaultValue={customer?.firstName}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                defaultValue={customer?.lastName}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
            </label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={customer?.email}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              defaultValue={customer?.phone}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </fetcher.Form>
      </div>
    );
  }

  const pendingOrdersCount = (orders || []).filter(
    (order) =>
      order?.fulfillmentStatus === 'UNFULFILLED' ||
      order?.fulfillmentStatus === 'IN_PROGRESS' ||
      order?.financialStatus === 'PENDING',
  ).length;

  const completedOrdersCount = (orders || []).filter(
    (order) => order?.fulfillmentStatus === 'FULFILLED',
  ).length;

  const defaultAddress =
    addresses?.find((addr) => addr?.id === defaultAddressId) ||
    customer?.defaultAddress;

  const formatNumber = (num) => (num < 10 ? `0${num}` : num);

  return (
    <div className="p-[10px] flex flex-col gap-[48px]">
      <div className="flex flex-col gap-[12px]">
        <h3 className="font-bold text-[#111827] leading-[32px] tracking-[0.1px]">
          Hi {customer?.firstName} {customer?.lastName}!
        </h3>
        <p className="text-[#666666] text-[14px] leading-[20px] tracking-[0px] max-w-4xl">
          From your account dashboard. you can easily check & view your{' '}
          <button
            onClick={() => setActiveTab && setActiveTab('orders')}
            className="text-[#2096FF] hover:underline"
          >
            Recent Orders
          </button>
          , manage your{' '}
          <button
            onClick={() => setActiveTab && setActiveTab('addresses')}
            className="text-[#2096FF] hover:underline"
          >
            Shipping and Billing Addresses
          </button>{' '}
          and edit your{' '}
          <span className="text-[#2096FF] cursor-pointer hover:underline">
            Password
          </span>{' '}
          and{' '}
          <button
            onClick={() => setIsEditing(true)}
            className="text-[#2096FF] hover:underline"
          >
            Account Details
          </button>
          .
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        {/* Total Orders */}
        <div className="bg-[#F3F9FF] rounded-[12px] p-[16px] flex items-center gap-[16px]">
          <div className="bg-white p-[12px] rounded-xl shadow-sm text-[#2096FF]">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l.5-.5a5.4 5.4 0 0 0 1-4.66 9.6 9.6 0 0 0 -3-3 5.4 5.4 0 0 0 -4.66 1l-.5.5Z" />
              <path d="m12 15 3.81 3.81 1.66-1.66L15 12" />
              <path d="m9 8 3.81 3.81 1.66-1.66L9 8" />
              <path d="M15 5h.01" />
              <path d="M17.5 2.5c2 2 2 5.5 2 5.5s-3.5 0-5.5-2C12 4 12 2.5 12 2.5s1.5 0 5.5 0Z" />
            </svg>
          </div>
          <div className="flex flex-col gap-[4px]">
            <h6 className="text-[14px] leading-[24px] tracking-[0.2pxpx] font-bold">
              {formatNumber(orders.length)}
            </h6>
            <p className="text-[14px] leading-[20px] text-[#A3A3A3] font-normal">
              Total Orders
            </p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-[#F3F9FF] rounded-[12px] p-[16px] flex items-center gap-[16px]">
          <div className="bg-white p-4 rounded-xl shadow-sm text-[#FF8551]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div className="flex flex-col gap-[4px]">
            <h6 className="text-[14px] leading-[24px] tracking-[0.2pxpx] font-bold">
              {formatNumber(pendingOrdersCount)}
            </h6>
            <p className="text-[14px] leading-[20px] text-[#A3A3A3] font-normal">
              Pending Orders
            </p>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-[#F3F9FF] rounded-[12px] p-[16px] flex items-center gap-[16px]">
          <div className="bg-white p-4 rounded-xl shadow-sm text-[#3BC155]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div className="flex flex-col gap-[4px]">
            <h6 className="text-[14px] leading-[24px] tracking-[0.2pxpx] font-bold">
              {formatNumber(completedOrdersCount)}
            </h6>
            <p className="text-[14px] leading-[20px] text-[#A3A3A3] font-normal">
              Completed Orders
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        {/* Account Info */}
        <div className="bg-[#F5F5F5] rounded-[12px] flex flex-col gap-[22px] pb-[24px]">
          <div className="flex justify-between items-center px-[24px] py-[20px] border-b border-[#E7E7E7]">
            <h6 className="!text-[14px] !leading-[20px] font-semibold text-[#666666]">
              Account Info
            </h6>
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary bg-[#2096FF] text-white text-[14px] leading-[24px] tracking-[0.2px] font-bold p-[10px] rounded-md hover:bg-blue-600 transition-colors"
            >
              EDIT
            </button>
          </div>
          <div className="flex flex-col gap-[20px] px-[24px]">
            <div className="flex items-center gap-[16px]">
              <div className="w-[48px] h-[48px] rounded-full overflow-hidden shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent((customer?.firstName || '') + ' ' + (customer?.lastName || ''))}&background=F7D2B6&color=111827&bold=true&size=128`}
                  alt={customer?.firstName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-[4px]">
                <h6 className="font-bold !text-[14px] !leading-[24px] text-[#252B42]">
                  {customer?.firstName} {customer?.lastName}
                </h6>
                <p className="!text-[14px] !leading-[20px] font-medium text-[#252B42] leading-snug">
                  {customer?.defaultAddress ? (
                    <>
                      {customer?.defaultAddress?.city &&
                        `${customer.defaultAddress.city}`}
                      {customer?.defaultAddress?.zip &&
                        ` - ${customer.defaultAddress.zip}`}
                      <br />
                      {customer?.defaultAddress?.province &&
                        `${customer.defaultAddress.province} `}
                      {customer?.defaultAddress?.country}
                    </>
                  ) : (
                    'Address not provided'
                  )}
                </p>
              </div>
            </div>
            <div className="text-[#252B42] flex flex-col gap-[8px]">
              <p className="!text-[14px] !leading-[20px]">
                <span className="font-normal text-[#252B42]">Phone:</span>{' '}
                <span className="font-medium">
                  {customer?.phone || 'Not provided'}
                </span>
              </p>
              <p className="!text-[14px] !leading-[20px]">
                <span className="font-normal text-[#252B42]">Email:</span>{' '}
                <span className="font-medium break-all">{customer?.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-[#F5F5F5] rounded-[12px] flex flex-col gap-[22px] pb-[24px]">
          <div className="flex justify-between items-center px-[24px] py-[20px] border-b border-[#E7E7E7]">
            <h6 className="!text-[14px] !leading-[20px] font-semibold text-[#666666]">
              Delivery Address
            </h6>
            <button
              onClick={() => setActiveTab && setActiveTab('addresses')}
              className="btn-primary bg-[#2096FF] text-white text-[14px] leading-[24px] tracking-[0.2px] font-bold p-[10px] rounded-md hover:bg-blue-600 transition-colors"
            >
              EDIT
            </button>
          </div>
          <div className="flex flex-col gap-[20px] px-[24px]">
            <h6 className="font-bold !text-[14px] !leading-[24px] text-[#252B42]">
              {defaultAddress?.firstName || customer?.firstName}{' '}
              {defaultAddress?.lastName || customer?.lastName}
            </h6>
            <p className="!text-[14px] !leading-[20px] font-medium text-[#252B42] leading-snug">
              {defaultAddress ? (
                <>
                  {defaultAddress?.address1}
                  {defaultAddress?.address2
                    ? `, ${defaultAddress.address2}`
                    : ''}
                  , {defaultAddress?.city} - {defaultAddress?.zip},<br />
                  {defaultAddress?.province}, {defaultAddress?.country}
                </>
              ) : (
                'No default delivery address setup'
              )}
            </p>
            <div className="!text-[14px] !leading-[20px] text-[#252B42]">
              <p>
                <span className="text-[#252B42]">Phone:</span>{' '}
                <span className="">
                  {defaultAddress?.phone || customer?.phone || 'Not provided'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderDetails({order, onBack}) {
  if (!order) return null;

  const totalLineItemsPrice = (order?.lineItems?.nodes || []).reduce(
    (total, item) => {
      return total + parseFloat(item?.originalTotalPrice?.amount || 0);
    },
    0,
  );

  const FullOrderId = order?.id?.split('/')?.pop() || ''; // Extract the actual order ID from the global ID
  const orderId = FullOrderId.includes('?')
    ? FullOrderId.split('?')[0]
    : FullOrderId; // Remove any query parameters if present

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white space-y-6">
      <button
        onClick={onBack}
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        &larr; Back to orders
      </button>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#2A3647]">
          Order: {order.name}
        </h1>
        <div className="text-gray-500 font-medium">
          Order Status :{' '}
          <span
            className={`font-bold ${order?.fulfillmentStatus === 'FULFILLED' ? 'text-[#3BC155]' : 'text-orange-400'}`}
          >
            {order?.fulfillmentStatus === 'FULFILLED'
              ? 'Delivered'
              : order?.fulfillmentStatus === 'IN_PROGRESS'
                ? 'In Progress'
                : order?.fulfillmentStatus}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative flex justify-between items-center mb-10 px-6">
        {/* Background Line */}
        <div className="absolute top-3 left-10 right-10 h-[2px] bg-gray-200 z-0"></div>
        {/* Progress Line */}
        <div
          className={`absolute top-3 left-10 bg-[#3BC155] h-[2px] z-0 ${order?.fulfillmentStatus === 'FULFILLED' ? 'right-10 w-auto' : order?.fulfillmentStatus === 'PARTIALLY_FULFILLED' ? 'right-1/2 w-auto' : 'w-0'}`}
        ></div>

        {/* Steps */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-[#3BC155] flex items-center justify-center text-white mb-2 shadow-[0_0_0_4px_white]">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#2A3647]">Confirmed</p>
          <p className="text-xs text-gray-500">
            {new Date(order.processedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`w-6 h-6 rounded-full ${order?.fulfillmentStatus === 'FULFILLED' || order?.fulfillmentStatus === 'PARTIALLY_FULFILLED' ? 'bg-[#3BC155]' : 'bg-gray-200'} flex items-center justify-center text-white mb-2 shadow-[0_0_0_4px_white]`}
          >
            {(order?.fulfillmentStatus === 'FULFILLED' ||
              order?.fulfillmentStatus === 'PARTIALLY_FULFILLED') && (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <p className="text-sm font-semibold text-[#2A3647]">
            {order?.fulfillmentStatus === 'FULFILLED'
              ? 'Shipped'
              : 'Processing'}
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`w-6 h-6 rounded-full ${order?.fulfillmentStatus === 'FULFILLED' ? 'bg-[#3BC155]' : 'bg-gray-200'} flex items-center justify-center text-white mb-2 shadow-[0_0_0_4px_white]`}
          >
            {order?.fulfillmentStatus === 'FULFILLED' && (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <p className="text-sm font-semibold text-[#2A3647]">Delivered</p>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-[#F8F9FA] rounded-xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4 cursor-pointer">
          <h3 className="font-bold text-[#2A3647]">
            Items in your Order ({order?.lineItems?.nodes?.length ?? 0})
          </h3>
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </div>

        <div className="space-y-3">
          {(order?.lineItems?.nodes || []).map((item, index) => (
            <div
              key={index}
              className="bg-[#F2F4F7] p-2 rounded-lg flex justify-between items-center"
            >
              <div className="flex gap-4 items-center">
                <div className="w-[60px] h-[75px] bg-white rounded-md flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  {item?.variant?.image?.url ? (
                    <img
                      src={item.variant.image.url}
                      alt={item?.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item?.title || '')}&background=F7E2F2&color=9CA3AF`}
                      alt={item?.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-[#2A3647] text-[15px] mb-1">
                    {item?.title}
                  </h4>
                  <p className="text-[13px] text-gray-500 mb-0.5">
                    Quantity :{' '}
                    <span className="font-medium text-gray-700">
                      {item?.quantity}
                    </span>
                  </p>
                  <p className="text-[13px] text-gray-500">
                    {item?.variant?.title &&
                    item.variant.title !== 'Default Title'
                      ? item.variant.title
                      : ''}
                  </p>
                </div>
              </div>
              <div className="font-semibold text-gray-700 text-[15px] mr-2">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: item?.originalTotalPrice?.currencyCode,
                }).format(item?.originalTotalPrice?.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-[#F9FAFB] rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700">Delivery address</h3>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-[#2A3647] mb-1 text-[15px]">
              {order?.shippingAddress?.firstName || ''}{' '}
              {order?.shippingAddress?.lastName ||
                order?.shippingAddress?.name ||
                ''}
            </h4>
            <p className="text-[13px] text-gray-600 leading-snug">
              {order?.shippingAddress ? (
                <>
                  {order.shippingAddress?.address1}
                  {order.shippingAddress?.address2
                    ? `, ${order.shippingAddress.address2}`
                    : ''}
                  <br />
                  {order.shippingAddress?.city} - {order.shippingAddress?.zip},{' '}
                  {order.shippingAddress?.province},{' '}
                  {order.shippingAddress?.country}
                </>
              ) : (
                'Shipping details not available'
              )}
            </p>
          </div>
          {order?.shippingAddress?.phone && (
            <div className="text-[13px] text-gray-600 text-right">
              <p className="mb-0.5">Phone: {order?.shippingAddress?.phone}</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment & Summary */}
      <div className="bg-[#F9FAFB] rounded-xl p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-[15px] text-gray-700">
            Payment Status:
          </span>
          <span className="text-[13px] text-gray-700">
            {order?.financialStatus}
          </span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
          <span className="font-medium text-[13px] text-gray-400">
            Transaction id:
          </span>
          <span className="text-[13px] text-gray-500">{orderId}</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-[15px] text-gray-700">
            Payment summary
          </span>
          <span className="font-bold text-gray-900 text-lg">
            {totalLineItemsPrice}
          </span>
        </div>

        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between items-center text-gray-500">
            <span>Discount</span>
            <span>
              ({order?.discountApplications?.nodes?.[0]?.value?.percentage || 0}
              %){' '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: order?.currentSubtotalPrice?.currencyCode,
              }).format(order?.currentSubtotalPrice?.amount)}
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-500">
            <span>Tax</span>
            <span>
              +
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: order?.totalTax?.currencyCode,
              }).format(order?.totalTax?.amount)}
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-500">
            <span>Delivery charges</span>
            <span>
              +
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: order?.totalShippingPrice?.currencyCode,
              }).format(order?.totalShippingPrice?.amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-[#F9FAFB] rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 mt-8">
        <div>
          <h4 className="font-bold text-[#2A3647] text-[15px] mb-1">
            Need your help with your order?
          </h4>
          <p className="text-[13px] text-gray-500">
            Contact store support for assistance with this order.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-gray-400 text-white text-xs font-bold rounded-md hover:bg-gray-500 transition-colors tracking-wider whitespace-nowrap">
          NEED HELP
        </button>
      </div>
    </div>
  );
}

/**
 * Address Form Component
 */
function AddressForm({address, onCancel, fetcher, isDefault = false}) {
  const isEditing = !!address;
  const [submitError, setSubmitError] = useState(null);

  // --- Input Validation Handlers ---
  // Name: allow only alphabets and spaces
  const handleNameKeyDown = (e) => {
    const allowed = /^[a-zA-Z\s]$/;
    // Allow control keys: Backspace, Delete, Tab, Arrow keys, Home, End, etc.
    const controlKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'Enter',
    ];
    if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
    if (!allowed.test(e.key)) {
      e.preventDefault();
    }
  };
  const handleNameInput = (e) => {
    // Strip any non-alpha / non-space characters (handles paste)
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
  };

  // Phone: allow only digits
  const handlePhoneKeyDown = (e) => {
    const allowed = /^[0-9]$/;
    const controlKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'Enter',
    ];
    if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
    if (!allowed.test(e.key)) {
      e.preventDefault();
    }
  };
  const handlePhoneInput = (e) => {
    // Strip any non-digit characters (handles paste)
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  useEffect(() => {
    document.body.style.overflowY = 'hidden';
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, []);

  // Handle fetcher response
  useEffect(() => {
    if (fetcher?.data && fetcher?.state === 'idle') {
      if (fetcher?.data?.error) {
        setSubmitError(fetcher.data.error);

        setTimeout(() => {
          setSubmitError(null);
          fetcher.data = null;
        }, 3000);
      } else if (fetcher?.data?.success) {
        onCancel(); // Close the form
        // Refresh the page to show updated addresses
        window.location.reload();
      }
    }
  }, [fetcher?.data, fetcher?.state, onCancel]);

  return (
    <div className="fixed inset-0 flex items-center justify-end bg-gray-800/60 z-50">
      <div className="w-full max-w-[500px] h-[100vh] bg-white shadow-xl relative p-6 overflow-y-auto flex flex-col gap-[24px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ECECEC] pb-[12px]">
          <h3 className="text-[24px] font-bold leading-[32px] tracking-[0.1px] text-[#2A3647]">
            {isEditing ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="w-[45px] h-[45px] p-[10px] bg-gray-400 hover:bg-gray-500 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg
              className="w-[14px] h-[14px] m-[5px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* <hr className="border-gray-100" /> */}

        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        <fetcher.Form
          method="post"
          action="/api/account/address"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
          className="!text-[#737373]"
          onSubmit={() => setSubmitError(null)}
        >
          {isEditing && (
            <input type="hidden" name="addressId" value={address.id} />
          )}

          <input
            type="hidden"
            name="lastName"
            defaultValue={address?.lastName || 'Doe'}
          />
          <input
            type="hidden"
            name="company"
            defaultValue={address?.company || ''}
          />
          <input
            type="hidden"
            name="address2"
            defaultValue={address?.address2 || ''}
          />

          <div className="grid grid-cols-2 gap-[15px]">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name *"
              defaultValue={
                address?.firstName && address?.lastName
                  ? `${address.firstName} ${address.lastName}`
                  : address?.firstName
                    ? address?.firstName
                    : address?.lastName
                      ? address?.lastName
                      : ''
              }
              required
              onKeyDown={handleNameKeyDown}
              onInput={handleNameInput}
              className="w-full px-4 py-3 text-[14px] leading-[28px] tracking-[0.2px]  font-medium border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2096FF] focus:border-[#2096FF] !text-[#737373]"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone *"
              defaultValue={address?.phone}
              required
              onKeyDown={handlePhoneKeyDown}
              onInput={handlePhoneInput}
              className="w-full px-4 py-3 text-[14px] leading-[28px] tracking-[0.2px]  font-medium border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2096FF] focus:border-[#2096FF] !text-[#737373]"
            />
          </div>

          <div>
            <input
              type="text"
              name="address1"
              placeholder="Street Address *"
              defaultValue={address?.address1}
              required
              className="w-full px-4 py-3 text-[14px] leading-[28px] tracking-[0.2px]  font-medium border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2096FF] focus:border-[#2096FF] !text-[#737373]"
            />
          </div>

          <div className="grid grid-cols-2 gap-[15px]">
            <div className="relative">
              <select
                name="country"
                defaultValue={address?.country}
                required
                className="w-full px-4 py-3 text-[14px] leading-[28px] tracking-[0.2px]  font-medium border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-[#2096FF] focus:border-[#2096FF] bg-white !text-[#737373]"
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
              <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div className="relative">
              <select
                name="province"
                defaultValue={address?.province}
                required
                className="w-full px-4 py-3 text-[14px] leading-[28px] tracking-[0.2px] font-medium  border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-[#2096FF] focus:border-[#2096FF] bg-white !text-[#737373]"
              >
                <option value="">Select State</option>
                <option value="California">California</option>
                <option value="New York">New York</option>
                <option value="Texas">Texas</option>
              </select>
              <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[15px]">
            <input
              type="text"
              name="zip"
              placeholder="Postal Code *"
              defaultValue={address?.zip}
              required
              className="w-full px-4 py-3 text-[14px] leading-[28px] tracking-[0.2px]  font-medium border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2096FF] focus:border-[#2096FF] !text-[#737373]"
            />
            <div className="relative">
              <select
                name="city"
                defaultValue={address?.city}
                required
                className="w-full px-4 py-3 text-[14px] leading-[28px] tracking-[0.2px]  font-medium border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-[#2096FF] focus:border-[#2096FF] bg-white !text-[#737373]"
              >
                <option value="">Select City</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="Houston">Houston</option>
              </select>
              <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {!isEditing && (
            <div className="hidden">
              <input
                type="checkbox"
                name="setAsDefault"
                defaultChecked={isDefault}
              />
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/2 px-[25px] py-[13px] text-[16px] leading-[24px] tracking-[0.1px] font-bold text-[#2096FF] bg-white border-2 border-[#2096FF] rounded-md hover:bg-blue-50 transition-colors tracking-wide"
            >
              CANCEL
            </button>
            <button
              type="submit"
              name="action"
              value={isEditing ? 'update' : 'create'}
              disabled={fetcher.state === 'submitting'}
              className="w-1/2 px-[25px] py-[13px] text-[16px] leading-[24px] tracking-[0.1px] font-bold text-white bg-[#26A4FF] border-2 border-[#26A4FF] rounded-md hover:bg-[#1C8BE6] transition-colors tracking-wide shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {fetcher.state === 'submitting' ? 'SAVING...' : 'SAVE'}
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}

/**
 * Address Card Component
 */
/**
 * Address Card Component
 */
// function AddressCard({
//   address,
//   isDefault,
//   onEdit,
//   isEditing,
//   onCancel,
//   fetcher,
//   index,
// }) {
//   const [deleteError, setDeleteError] = useState(null);
//   const [setDefaultError, setSetDefaultError] = useState(null);

//   // Handle fetcher responses
//   useEffect(() => {
//     if (fetcher.data && fetcher.state === 'idle') {
//       if (fetcher.data.error) {
//         if (fetcher.data.action === 'delete') {
//           setDeleteError(fetcher.data.error);
//           setTimeout(() => setDeleteError(null), 3000);
//         } else if (fetcher.data.action === 'setDefault') {
//           setSetDefaultError(fetcher.data.error);
//           setTimeout(() => setSetDefaultError(null), 3000);
//         }
//       } else if (fetcher.data.success) {
//         if (fetcher.data.action === 'delete' || fetcher.data.action === 'setDefault') {
//           window.location.reload(); // Refresh to show updated addresses
//         }
//       }
//     }
//   }, [fetcher.data, fetcher.state]);

//   const handleSetAsDefault = (e) => {
//     e.preventDefault();
//     if (confirm('Set this as your default shipping address?')) {
//       // Create a new fetcher instance for this specific action
//       const defaultFetcher = new useFetcher();
//       defaultFetcher.submit(
//         {
//           addressId: address.id,
//           action: 'setDefault'
//         },
//         { method: 'post', action: '/api/account/address' }
//       );
//     }
//   };

//   if (isEditing) {
//     return (
//       <AddressForm
//         address={address}
//         onCancel={onCancel}
//         fetcher={fetcher}
//         isDefault={isDefault}
//       />
//     );
//   }

//   return (
//     <div className="bg-gray-100 rounded-lg p-4 relative">
//       {/* Header row */}
//       <div className="flex items-center justify-between mb-4">
//         <span className="text-sm font-semibold text-gray-700">Address {index}</span>
//         <div className="flex gap-2">
//           <fetcher.Form method="post" action="/api/account/address">
//             <input type="hidden" name="addressId" value={address.id} />
//             <button
//               type="submit"
//               name="action"
//               value="delete"
//               className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded disabled:opacity-50"
//               onClick={(e) => {
//                 if (!confirm('Are you sure you want to delete this address?')) {
//                   e.preventDefault();
//                   return;
//                 }
//               }}
//             >
//               REMOVE
//             </button>
//           </fetcher.Form>
//           <button
//             onClick={onEdit}
//             className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded"
//           >
//             EDIT
//           </button>
//           {!isDefault && (
//             <fetcher.Form method="post" action="/api/account/address">
//               <input type="hidden" name="addressId" value={address.id} />
//               <button
//                 type="submit"
//                 name="action"
//                 value="setDefault"
//                 className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded"
//               >
//                 SET DEFAULT
//               </button>
//             </fetcher.Form>
//           )}
//         </div>
//       </div>

//       {deleteError && (
//         <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
//           <p className="text-xs text-red-600">{deleteError}</p>
//         </div>
//       )}

//       {setDefaultError && (
//         <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
//           <p className="text-xs text-red-600">{setDefaultError}</p>
//         </div>
//       )}

//       {/* Address details */}
//       <div className="space-y-1">
//         <p className="font-semibold text-gray-900">
//           {address.firstName} {address.lastName}
//         </p>
//         {address.company && (
//           <p className="text-sm text-gray-600">{address.company}</p>
//         )}
//         <div className="text-sm text-gray-600">
//           <p>{address.address1}</p>
//           {address.address2 && <p>{address.address2}</p>}
//           <p>
//             {address.city}, {address.province} {address.zip}
//           </p>
//           <p>{address.country}</p>
//           <p className="mt-3">Phone: {address.phone}</p>
//         </div>
//       </div>

//       {/* Default badge */}
//       {isDefault && (
//         <span className="absolute bottom-3 right-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//           Default
//         </span>
//       )}
//     </div>
//   );
// }

function AddressCard({
  address,
  isDefault,
  onEdit,
  isEditing,
  onCancel,
  fetcher,
  index,
}) {
  const [deleteError, setDeleteError] = useState(null);
  const [setDefaultError, setSetDefaultError] = useState(null);

  // Handle fetcher responses
  useEffect(() => {
    if (fetcher?.data && fetcher?.state === 'idle') {
      if (fetcher?.data?.error) {
        if (fetcher?.data?.action === 'delete') {
          setDeleteError(fetcher.data.error);
          setTimeout(() => setDeleteError(null), 3000);
        } else if (fetcher?.data?.action === 'setDefault') {
          setSetDefaultError(fetcher.data.error);
          setTimeout(() => setSetDefaultError(null), 3000);
        }
      } else if (fetcher?.data?.success) {
        if (
          fetcher?.data?.action === 'delete' ||
          fetcher?.data?.action === 'setDefault'
        ) {
          window.location.reload(); // Refresh to show updated addresses
        }
      }
    }
  }, [fetcher?.data, fetcher?.state]);

  const handleSetAsDefault = (e) => {
    e.preventDefault();
    if (confirm('Set this as your default shipping address?')) {
      // Create a new fetcher instance for this specific action
      const defaultFetcher = new useFetcher();
      defaultFetcher?.submit(
        {
          addressId: address?.id,
          action: 'setDefault',
        },
        {method: 'post', action: '/api/account/address'},
      );
    }
  };

  if (isEditing) {
    return (
      <AddressForm
        address={address}
        onCancel={onCancel}
        fetcher={fetcher}
        isDefault={isDefault}
      />
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg relative flex items-start sm:block">
      {/* Left Column */}
      <div className="flex-1 min-w-0 flex flex-col gap-[22px] pb-[24px]">
        <div className="flex items-center justify-between border-b border-[#E7E7E7] px-[24px] py-[20px] gap-[20px]">
          <span className="text-[14px] leading-[20px] font-semibold text-gray-700">
            Address {index}
          </span>

          {/* Right Column */}
          <div className="flex gap-[8px] flex-wrap">
            {/* Top Row: REMOVE + EDIT */}
            <fetcher.Form
              method="post"
              action="/api/account/address"
              className="w-full sm:w-auto"
            >
              <input type="hidden" name="addressId" value={address?.id} />
              <button
                type="submit"
                name="action"
                value="delete"
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white text-[16px] font-semibold px-[5px] py-[5px] leading-[24px] rounded-[5px] disabled:opacity-50"
                onClick={(e) => {
                  if (
                    !confirm('Are you sure you want to delete this address?')
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                REMOVE
              </button>
            </fetcher.Form>

            <button
              onClick={onEdit}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white text-[14px] font-semibold px-[12px] py-[6px] rounded-[5px]"
            >
              EDIT
            </button>

            {/* Bottom Row: SET DEFAULT */}
            {!isDefault && (
              <fetcher.Form
                method="post"
                action="/api/account/address"
                className="w-full md:w-auto"
              >
                <input type="hidden" name="addressId" value={address.id} />
                <button
                  type="submit"
                  name="action"
                  value="setDefault"
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-[14px] font-semibold px-[12px] py-[6px] rounded-[5px]"
                >
                  SET DEFAULT
                </button>
              </fetcher.Form>
            )}
          </div>
        </div>

        {deleteError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-xs text-red-600">{deleteError}</p>
          </div>
        )}

        {setDefaultError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-xs text-red-600">{setDefaultError}</p>
          </div>
        )}

        {/* Address details */}
        <div className="flex flex-col gap-[20px] px-[24px]">
          <p className="text-[14px] leading-[24px] font-bold text-gray-900 break-words">
            {address?.firstName} {address?.lastName}
          </p>

          {address?.company && (
            <p className="text-[14px] leading-[20px] font-medium text-gray-600 break-words">
              {address.company}
            </p>
          )}

          <div className="text-[14px] leading-[20px] font-medium text-gray-600 break-words">
            <p>{address?.address1}</p>
            {address?.address2 && <p>{address.address2}</p>}
            <p>
              {address?.city}, {address?.province} {address?.zip}
            </p>
            <p>{address?.country}</p>
          </div>
          <p className="text-[14px] leading-[20px] font-normal text-gray-600 break-words">
            Phone: {address?.phone}
          </p>
        </div>
      </div>

      {/* Default badge */}
      {isDefault && (
        <span className="absolute bottom-3 right-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Default
        </span>
      )}
    </div>
  );
}

/** @typedef {import('./+types/account').Route} Route */
