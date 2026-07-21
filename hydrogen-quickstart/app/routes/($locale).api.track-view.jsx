export async function action({ request, context }) {
  // --------------------------------------------------
  // 1) Quick Auth Check & Payload Parsing
  // --------------------------------------------------
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/customerAccessToken=([^;]+)/);
  const accessToken = match?.[1];

  // If not logged in, return instantly
  if (!accessToken) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), { status: 400 });
  }

  const { productId, category, handle } = payload;

  if (!productId) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // --------------------------------------------------
  // 2) Define the Background Task
  // --------------------------------------------------
  const trackProductView = async () => {
    try {
      // Get customer ID via Storefront API
      const customerRes = await context.storefront.query(
        `
        query getCustomer($customerAccessToken: String!) {
          customer(customerAccessToken: $customerAccessToken) {
            id
          }
        }
        `,
        { variables: { customerAccessToken: accessToken } }
      );

      const customerId = customerRes?.customer?.id;
      if (!customerId) return;

      // Admin API setup
      const storeDomain = context.env.PUBLIC_STORE_DOMAIN;
      const adminToken = context.env.PRIVATE_ADMIN_TOKEN;
      const ADMIN_API_URL = `https://${storeDomain}/admin/api/2024-01/graphql.json`;

      const adminQuery = async (query, variables = {}) => {
        const res = await fetch(ADMIN_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": adminToken,
          },
          body: JSON.stringify({ query, variables }),
        });
        return res.json();
      };

      // Get existing history
      const getHistoryQuery = `
        query getHistory($id: ID!) {
          customer(id: $id) {
            browsing: metafield(namespace: "custom", key: "browsing_history") {
              value
            }
          }
        }
      `;

      const historyRes = await adminQuery(getHistoryQuery, { id: customerId });

      let history = { viewed: [], lastCategory: null };
      const existingValue = historyRes?.data?.customer?.browsing?.value;

      if (existingValue) {
        try {
          history = JSON.parse(existingValue);
        } catch {
          history = { viewed: [], lastCategory: null };
        }
      }

      // Merge product
      const updatedViewed = [
        productId,
        ...history.viewed.filter((id) => id !== productId),
      ].slice(0, 20);

      const updatedHistory = {
        viewed: updatedViewed,
        lastCategory: category || history.lastCategory,
      };

      // Save back to Shopify
      const saveMutation = `
        mutation saveHistory($input: CustomerInput!) {
          customerUpdate(input: $input) {
            customer { id }
          }
        }
      `;

      await adminQuery(saveMutation, {
        input: {
          id: customerId,
          metafields: [
            {
              namespace: "custom",
              key: "browsing_history",
              type: "json",
              value: JSON.stringify(updatedHistory),
            },
          ],
        },
      });
    } catch (error) {
      console.error("Background track view error:", error);
    }
  };

  // --------------------------------------------------
  // 3) 🚀 EXECUTE IN BACKGROUND & RETURN IMMEDIATELY
  // --------------------------------------------------
  
  // This tells Oxygen to keep running the promise safely even after the response is sent
  context.waitUntil(trackProductView());

  // Return to the browser instantly so the client doesn't hang
  return new Response(JSON.stringify({ ok: true, tracking_in_background: true }), {
    headers: { "Content-Type": "application/json" },
  });
}