import { useLoaderData } from "react-router";
import smartDonationDashboardImg from "~/assets/SmartDonation.png";

export async function loader({ request }) {
  return new Response("Smart Donate Recurring/Receipt App Info", { status: 200 });
}

export default function SmartDonation() {
  const shopifyAppLink =
    "https://apps.shopify.com/smart-donate-recurring-receipt?surface_intra_position=8&surface_type=partners&surface_version=simplified";

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
            Smart Donate Recurring/Receipt
          </h1>
          
          <p className="text-lg md:text-xl font-bold text-indigo-600 leading-snug">
            Collect one-time, recurring, and round-up donations with automated PDF receipts
          </p>
          
          <p className="text-slate-700 leading-relaxed text-base md:text-lg font-normal">
            Smart Donate Recurring/Receipt helps merchants collect donations through preset amounts, round-up donations, portion-of-sale donations, and recurring donations from a single dashboard. Every donation automatically generates a branded email receipt with a downloadable PDF. Customers can also manage their recurring donations from their account. Donated funds go directly to the selected cause selected by the merchant, providing a seamless giving experience for both merchants and customers.
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
                src={smartDonationDashboardImg}
                alt="Smart Donate Recurring/Receipt Dashboard Overview"
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              The Smart Donate Recurring/Receipt Performance Dashboard gives merchants full visibility into donation metrics across preset, portion-of-sale, round-up, and recurring giving channels, along with campaign controls and storefront display settings.
            </p>
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
                Preset & Round-Up Campaigns
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Preset, round-up, and portion-of-sale donation campaigns.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                Recurring Donation Management
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Seamless recurring donation management and subscription tracking.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                Automated PDF Receipts
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Branded email receipts with downloadable PDFs for every donation.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                Customer Management Portal
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Customer portal for shoppers to manage their recurring donations easily.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all space-y-2 md:col-span-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">
                Donation Analytics & Order Tagging
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Donation analytics with trend charts and automated order tagging.
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
              <div className="p-6 space-y-6">
                <div>
                  <span className="text-sm font-semibold text-slate-500">Basic</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900">$1.99</span>
                    <span className="text-sm font-medium text-slate-500">/ month</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-bold text-slate-900">Features</div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Donation create ( one Campaign)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Portion of sale (fixed only)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Receipt email notification
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Basic UI & Design
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Order Tagging
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Community support
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-100/80 px-6 py-3 border-t border-slate-200/80 text-xs font-semibold text-slate-600">
                7-day free trial
              </div>
            </div>

            {/* Advanced Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
              <div className="p-6 space-y-6">
                <div>
                  <span className="text-sm font-semibold text-slate-500">Advanced</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900">$4.99</span>
                    <span className="text-sm font-medium text-slate-500">/ month</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-bold text-slate-900">Features</div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Everything in Basic
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Portion of sale (percentage based)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Refund email notification
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Filters / pagination
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Advanced Analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Priority support
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-100/80 px-6 py-3 border-t border-slate-200/80 text-xs font-semibold text-slate-600">
                7-day free trial
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
              <div className="p-6 space-y-6">
                <div>
                  <span className="text-sm font-semibold text-slate-500">Pro</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900">$9</span>
                    <span className="text-sm font-medium text-slate-500">/ month</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-bold text-slate-900">Features</div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Everything in Advanced
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Cancellation email notification
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Custom email templates
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Branding removal
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Dynamic variables
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">✓</span> Unlimited logs
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
