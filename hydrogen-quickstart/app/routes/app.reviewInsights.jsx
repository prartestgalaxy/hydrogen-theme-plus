import { useLoaderData } from "react-router";
import reviewInsightDashboardImg from "~/assets/ReviewInsightDashboard.png";

export async function loader({ request }) {
  return new Response("ReviewInsights App Info", { status: 200 });
}

export default function ReviewInsights() {
  const shopifyAppLink =
    "https://apps.shopify.com/gwl-reviews";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header / Hero Section */}
        <header className="space-y-4 text-center md:text-left border-b border-slate-200 pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="inline-block px-3.5 py-1 bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-full uppercase tracking-wider">
              App Information
            </div>

            <a
              href={shopifyAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <span>View App on Shopify</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            ReviewInsights
          </h1>

          <p className="text-lg md:text-xl font-bold text-indigo-600 leading-snug">
            Trusted reviews and ratings with moderation, bundle sharing, and headless support.
          </p>

          <p className="text-slate-700 leading-relaxed text-base md:text-lg font-normal">
            ReviewInsights helps merchants collect, manage, and display authentic customer reviews with full moderation control. Review submissions can be approved, edited, rejected, or removed before publishing. Customize review widgets and testimonials with flexible layouts, colors, fonts, and display formats, including sliders and grids. Bundle-level review sharing extends social proof across related products. Compatible with Shopify Online Store 2.0, Hydrogen, and headless storefronts.
          </p>
        </header>

        {/* Dashboard Preview Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-wide border-b border-slate-200 pb-3">
            Dashboard Overview & Management Hub
          </h2>
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <img
                src={reviewInsightDashboardImg}
                alt="ReviewInsights Dashboard Overview"
                className="w-full h-auto object-cover"
              />
            </div>

          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-wide border-b border-slate-200 pb-3">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                Review Approval
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Approve, edit, reject, or delete reviews before showing.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                Customizable Testimonials
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Control layout, colors, fonts, slider, or grid.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                Bundle Reviews
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Share approved reviews across multiple related products.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                Bulk Import & Export
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Import or export reviews easily for faster management.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all space-y-2 md:col-span-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                Hydrogen & Headless Support
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Display reviews across custom storefronts.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl font-bold text-slate-900 tracking-wide">
              Pricing
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Choose the plan that best fits your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
              <div className="p-6 space-y-6">
                <div>
                  <span className="text-sm font-semibold text-slate-500">Free</span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1">
                    Free
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-bold text-slate-900">Features</div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Unlimited product reviews
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Review widget & star rating badge
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Reviews import and export
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> App branding on widgets
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Starter Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
              <div className="p-6 space-y-6">
                <div>
                  <span className="text-sm font-semibold text-slate-500">Starter</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900">$5</span>
                    <span className="text-sm font-medium text-slate-500">/ month</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-bold text-slate-900">Features</div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Unlimited product reviews
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Review widget & star rating badge
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Reviews import and export
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Product grouping
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Hydrogen iframe support
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Headless API support
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Remove app branding
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-100/80 px-6 py-3 border-t border-slate-200/80 text-xs font-semibold text-slate-600">
                7-day free trial
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 pt-2">
            All charges are billed in USD. Recurring and usage-based charges are billed every 30 days.
          </p>
        </section>

      </div>
    </div>
  );
}