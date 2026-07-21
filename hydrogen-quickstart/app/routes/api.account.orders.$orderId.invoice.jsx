// app/routes/api.account.orders.$orderId.invoice.jsx

export async function loader({ context, request, params }) {
  // Check if customer is logged in
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/customerAccessToken=([^;]+)/);
  const accessToken = match?.[1];

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { 
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // First, decode the parameter
    let orderParam = decodeURIComponent(params.orderId);
    
    // Remove any query parameters that might be attached
    if (orderParam.includes('?')) {
      orderParam = orderParam.split('?')[0];
    }
    

    // Try to extract the numeric order ID if it's in gid format
    let searchValue = null;
    if (orderParam.includes('gid://')) {
      const parts = orderParam.split('/');
      searchValue = parts[parts.length - 1];
    
    } else {
      searchValue = orderParam;
    }

    // Get customer's orders
    const orderRes = await context.storefront.query(
      `
      query getCustomerOrders($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          orders(first: 50) {
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
              shippingAddress {
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
              billingAddress {
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
              lineItems(first: 50) {
                nodes {
                  title
                  quantity
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                  variant {
                    title
                    sku
                  }
                }
              }
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

    const orders = orderRes?.customer?.orders?.nodes || [];
    
    // Log all available orders with their details for debugging
   
   
    
    // Try multiple search strategies
    let order = null;
    
    // Strategy 1: Direct GID match
    order = orders.find(o => o.id === orderParam);
    
    
    // Strategy 2: Order number as number
    if (!order && searchValue) {
      const numValue = parseInt(searchValue, 10);
      if (!isNaN(numValue)) {
        order = orders.find(o => o.orderNumber === numValue);
       
      }
    }
    
    // Strategy 3: Order number as string
    if (!order && searchValue) {
      order = orders.find(o => o.orderNumber.toString() === searchValue);
     
    }
    
    // Strategy 4: Check if order name contains the search value
    if (!order && searchValue) {
      order = orders.find(o => o.name?.includes(searchValue));
      
    }
    
    // Strategy 5: Check if ID contains the search value
    if (!order && searchValue) {
      order = orders.find(o => o.id?.includes(searchValue));
      
    }
    
    if (!order) {
      console.error('Order not found after all strategies. Search value:', searchValue);
      return new Response(JSON.stringify({ error: 'Order not found' }), { 
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

   

    // Generate HTML invoice
    const invoiceHtml = generateInvoiceHTML(order);
    
    // Return as downloadable HTML file
    return new Response(invoiceHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="invoice-${order.orderNumber}.html"`,
      },
    });

  } catch (error) {
    console.error('Invoice generation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate invoice: ' + error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

function generateInvoiceHTML(order) {
  const date = new Date(order.processedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(amount));
  };

  // Calculate item totals
  const items = order.lineItems.nodes.map(item => ({
    ...item,
    total: parseFloat(item.originalTotalPrice.amount),
    price: parseFloat(item.originalTotalPrice.amount) / item.quantity
  }));

  // Format address
  const formatAddress = (address, type) => {
    if (!address) return null;
    const parts = [];
    if (address.firstName || address.lastName) {
      parts.push(`${address.firstName || ''} ${address.lastName || ''}`.trim());
    }
    if (address.address1) parts.push(address.address1);
    if (address.address2) parts.push(address.address2);
    const cityLine = [address.city, address.province, address.zip].filter(Boolean).join(', ');
    if (cityLine) parts.push(cityLine);
    if (address.country) parts.push(address.country);
    if (address.phone) parts.push(`Phone: ${address.phone}`);
    return parts;
  };

  const shippingAddress = formatAddress(order.shippingAddress, 'shipping');
  const billingAddress = formatAddress(order.billingAddress, 'billing');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${order.name}</title>
    <style>
        /* Professional invoice styling optimized for PDF */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            background: #f5f5f5;
            line-height: 1.5;
            color: #333;
            padding: 20px;
        }

        /* Invoice container */
        .invoice {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            position: relative;
        }

        /* Print styles */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .invoice {
                max-width: 100%;
                box-shadow: none;
            }
            .no-print {
                display: none;
            }
            .page-break {
                page-break-before: always;
            }
        }

        /* Header */
        .invoice-header {
            background: #1e3a5f;
            color: white;
            padding: 30px;
            position: relative;
        }

        .invoice-header::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 0;
            right: 0;
            height: 20px;
            background: linear-gradient(135deg, transparent 50%, #1e3a5f 50%);
        }

        .invoice-title {
            font-size: 36px;
            font-weight: 300;
            letter-spacing: 2px;
            margin-bottom: 5px;
        }

        .invoice-number {
            font-size: 18px;
            color: rgba(255,255,255,0.8);
            font-weight: 300;
        }

        .company-details {
            text-align: right;
            font-size: 12px;
            line-height: 1.6;
            color: rgba(255,255,255,0.9);
        }

        /* Info section */
        .info-section {
            padding: 40px 30px 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 40px;
            background: white;
        }

        .info-box {
            flex: 1 1 200px;
        }

        .info-label {
            font-size: 11px;
            text-transform: uppercase;
            color: #666;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 14px;
            font-weight: 500;
            color: #333;
        }

        /* Address section */
        .address-section {
            padding: 0 30px 30px;
            display: flex;
            flex-wrap: wrap;
            gap: 40px;
            border-bottom: 2px solid #eee;
        }

        .address-box {
            flex: 1 1 250px;
        }

        .address-title {
            font-size: 12px;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
        }

        .address-content {
            font-size: 13px;
            line-height: 1.6;
            color: #333;
        }

        /* Items table */
        .items-section {
            padding: 30px;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        .items-table th {
            text-align: left;
            padding: 12px 8px;
            background: #f8f8f8;
            font-size: 11px;
            text-transform: uppercase;
            color: #666;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #ddd;
        }

        .items-table td {
            padding: 12px 8px;
            border-bottom: 1px solid #eee;
        }

        .items-table tbody tr:hover {
            background: #fafafa;
        }

        .text-right {
            text-align: right;
        }

        .amount {
            font-weight: 500;
        }

        /* Summary section */
        .summary-section {
            padding: 0 30px 30px;
            display: flex;
            justify-content: flex-end;
        }

        .summary-table {
            width: 300px;
            border-collapse: collapse;
            font-size: 13px;
        }

        .summary-table td {
            padding: 8px 0;
        }

        .summary-table .total-row {
            font-weight: bold;
            font-size: 16px;
            color: #1e3a5f;
            border-top: 2px solid #333;
        }

        /* Footer */
        .invoice-footer {
            padding: 20px 30px;
            background: #f8f8f8;
            font-size: 11px;
            color: #666;
            text-align: center;
            border-top: 1px solid #ddd;
        }

        /* Status badges */
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .status-paid {
            background: #e8f5e9;
            color: #2e7d32;
        }

        .status-pending {
            background: #fff3e0;
            color: #f57c00;
        }

        .status-refunded {
            background: #f3e5f5;
            color: #7b1fa2;
        }

        .status-fulfilled {
            background: #e3f2fd;
            color: #1565c0;
        }

        .status-partial {
            background: #fff8e1;
            color: #ff8f00;
        }

        /* Print button */
        .print-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1e3a5f;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
        }

        .print-button:hover {
            background: #2c4a7a;
        }

        /* Auto-print trigger */
        @media screen {
            .auto-print-trigger {
                display: none;
            }
        }

        /* Ensure proper spacing */
        .mt-10 { margin-top: 10px; }
        .mb-5 { margin-bottom: 5px; }
        .text-muted { color: #666; }
    </style>
</head>
<body>
  
    

    <div class="invoice">
        <!-- Header -->
        <div class="invoice-header">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h1 class="invoice-title">INVOICE</h1>
                    <div class="invoice-number">#${order.name}</div>
                </div>
                <div class="company-details">
                    <div style="font-weight: bold; margin-bottom: 5px;">YOUR COMPANY NAME</div>
                    <div>123 Business Avenue</div>
                    <div>Suite 100</div>
                    <div>New York, NY 10001</div>
                    <div>United States</div>
                    <div>contact@yourcompany.com</div>
                    <div>+1 (555) 123-4567</div>
                </div>
            </div>
        </div>

        <!-- Information Section -->
        <div class="info-section">
            <div class="info-box">
                <div class="info-label">Invoice Date</div>
                <div class="info-value">${date}</div>
            </div>
            <div class="info-box">
                <div class="info-label">Order Date</div>
                <div class="info-value">${date}</div>
            </div>
            <div class="info-box">
                <div class="info-label">Payment Status</div>
                <div class="info-value">
                    <span class="status-badge ${
                      order.financialStatus === 'PAID' 
                        ? 'status-paid' 
                        : order.financialStatus === 'REFUNDED'
                        ? 'status-refunded'
                        : 'status-pending'
                    }">
                        ${order.financialStatus || 'PENDING'}
                    </span>
                </div>
            </div>
            <div class="info-box">
                <div class="info-label">Fulfillment Status</div>
                <div class="info-value">
                    <span class="status-badge ${
                      order.fulfillmentStatus === 'FULFILLED' 
                        ? 'status-fulfilled' 
                        : order.fulfillmentStatus === 'PARTIALLY_FULFILLED'
                        ? 'status-partial'
                        : 'status-pending'
                    }">
                        ${order.fulfillmentStatus || 'PENDING'}
                    </span>
                </div>
            </div>
        </div>

        <!-- Addresses -->
        <div class="address-section">
            ${shippingAddress ? `
            <div class="address-box">
                <div class="address-title">Ship To</div>
                <div class="address-content">
                    ${shippingAddress.map(line => `<div>${line}</div>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${billingAddress && JSON.stringify(billingAddress) !== JSON.stringify(shippingAddress) ? `
            <div class="address-box">
                <div class="address-title">Bill To</div>
                <div class="address-content">
                    ${billingAddress.map(line => `<div>${line}</div>`).join('')}
                </div>
            </div>
            ` : shippingAddress ? `
            <div class="address-box">
                <div class="address-title">Bill To</div>
                <div class="address-content">
                    <div>Same as shipping address</div>
                </div>
            </div>
            ` : ''}
        </div>

        <!-- Order Items -->
        <div class="items-section">
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>SKU</th>
                        <th>Variant</th>
                        <th class="text-right">Quantity</th>
                        <th class="text-right">Unit Price</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                    <tr>
                        <td>${item.title}</td>
                        <td>${item.variant?.sku || '—'}</td>
                        <td>${item.variant?.title !== 'Default Title' ? item.variant?.title : '—'}</td>
                        <td class="text-right">${item.quantity}</td>
                        <td class="text-right amount">${formatCurrency(item.price, item.originalTotalPrice.currencyCode)}</td>
                        <td class="text-right amount">${formatCurrency(item.total, item.originalTotalPrice.currencyCode)}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Summary -->
        <div class="summary-section">
            <table class="summary-table">
                <tr>
                    <td>Subtotal:</td>
                    <td class="text-right amount">${formatCurrency(order.currentSubtotalPrice.amount, order.currentSubtotalPrice.currencyCode)}</td>
                </tr>
                <tr>
                    <td>Shipping:</td>
                    <td class="text-right amount">${formatCurrency(order.totalShippingPrice.amount, order.totalShippingPrice.currencyCode)}</td>
                </tr>
                <tr>
                    <td>Tax:</td>
                    <td class="text-right amount">${formatCurrency(order.totalTax.amount, order.totalTax.currencyCode)}</td>
                </tr>
                <tr class="total-row">
                    <td>Total:</td>
                    <td class="text-right amount">${formatCurrency(order.currentTotalPrice.amount, order.currentTotalPrice.currencyCode)}</td>
                </tr>
            </table>
        </div>

        <!-- Footer -->
        <div class="invoice-footer">
            <div style="margin-bottom: 10px;">Thank you for your business!</div>
            <div>If you have any questions about this invoice, please contact us at support@yourcompany.com</div>
            <div style="margin-top: 15px; font-size: 10px; color: #999;">
                Invoice generated on ${new Date().toLocaleDateString()} | Payment terms: Net 30
            </div>
        </div>
    </div>

    <!-- Print Button (only visible on screen) -->
    <button class="print-button no-print" onclick="window.print()">
        Print / Save as PDF
    </button>
</body>
</html>`;
}

export const shouldRevalidate = () => false;