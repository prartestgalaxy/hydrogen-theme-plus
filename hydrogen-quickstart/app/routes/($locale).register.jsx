
// import { Form, useActionData, useNavigate } from "react-router";
// import { useEffect, useState } from "react";
// import { Link } from '~/components/Link';

// export async function action({ request }) {
//   const formData = await request.formData();

//   const firstName = formData.get("firstName");
//   const lastName = formData.get("lastName");
//   const email = formData.get("email");
//   const password = formData.get("password");

//   const storeDomain = "shaygwl.myshopify.com";
//   const storefrontToken = "ced104e78fc7dce85b549c7866e90013";

//   const mutation = `
//     mutation customerCreate($input: CustomerCreateInput!) {
//       customerCreate(input: $input) {
//         customer {
//           id
//           email
//           firstName
//           lastName
//         }
//         customerUserErrors {
//           code
//           field
//           message
//         }
//       }
//     }
//   `;

//   try {
//     const response = await fetch(
//       `https://${storeDomain}/api/2024-10/graphql.json`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Shopify-Storefront-Access-Token": storefrontToken,
//         },
//         body: JSON.stringify({
//           query: mutation,
//           variables: {
//             input: { firstName, lastName, email, password }
//           }
//         })
//       }
//     );

//     const data = await response.json();

//     if (data.errors) {
//       return { error: data.errors[0].message };
//     }

//     const errors = data?.data?.customerCreate?.customerUserErrors || [];

//     if (errors.length > 0) {
//       return { error: errors[0].message };
//     }

//     if (!data?.data?.customerCreate?.customer) {
//       return { error: "No customer data returned" };
//     }

//     return {
//       success: true,
//       customer: data.data.customerCreate.customer,
//       redirectTo: "/signin"
//     };
//   } catch (error) {
//     return { error: `Failed to create customer: ${error.message}` };
//   }
// }



// export default function Register() {
//   const result = useActionData();
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (result?.success) {
//       const timer = setTimeout(() => {
//         navigate('/signin');
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [result, navigate]);

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
//       <div className="w-full max-w-[440px] rounded-2xl shadow-sm p-6 sm:p-8">
//         <h2 className="font-montserrat font-bold text-[#252B42] text-[32px] sm:text-[40px] leading-[42px] sm:leading-[50px] tracking-[0.2px] text-center">
//           Sign up for free
//         </h2>
        
//         <p className="mt-4 font-montserrat text-center text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-[24px]">
//           Try everything free for 30 days, no payment details required
//         </p>

//         {result?.error && (
//           <div className="font-montserrat bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm break-words">
//             <strong>Error:</strong> {result.error}
//           </div>
//         )}

//         {result?.success && (
//           <div className="font-montserrat bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
//             <strong>✓ Account Created Successfully!</strong><br />
//             {result.customer?.firstName} {result.customer?.lastName}<br />
//             ({result.customer?.email})<br />
//             <small>Redirecting to sign in page...</small>
//           </div>
//         )}

//         {/* OR Divider */}
//         <div className="flex items-center mb-6">
//           <div className="flex-1 h-px bg-gray-200" />
//           <span className="px-4 text-gray-500 text-sm uppercase font-montserrat">OR</span>
//           <div className="flex-1 h-px bg-gray-200" />
//         </div>

//         <Form method="post">
//           {/* Name Field (combined First/Last) */}
//           <div className="mb-5">
//             <label className="font-montserrat block mb-2 font-medium text-sm text-black-700">
//               Name *
//             </label>
//             <div className="font-montserrat flex flex-col sm:flex-row gap-3 sm:gap-2">
//               <input
//                 name="firstName"
//                 placeholder="First Name"
//                 required
//                 className="font-montserrat w-full sm:flex-1 px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[#008060] focus:ring-0 outline-none transition-colors"
//               />
//               <input
//                 name="lastName"
//                 placeholder="Last Name"
//                 required
//                 className="font-montserrat w-full sm:flex-1 px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[#008060] focus:ring-0 outline-none transition-colors"
//               />
//             </div>
//           </div>

//           {/* Email Field */}
//           <div className="mb-5">
//             <label className="font-montserrat block mb-2 font-medium text-sm text-black-700">
//               Email address *
//             </label>
//             <input
//               name="email"
//               type="email"
//               placeholder="example@gmail.com"
//               required
//               className="font-montserrat w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[#008060] focus:ring-0 outline-none transition-colors"
//             />
//           </div>

//           {/* Password Field with Eye Icon */}
//           <div className="mb-6">
//             <label className="block mb-2 font-medium text-sm text-black-700">
//               Password *
//             </label>
//             <div className="relative">
//               <input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 required
//                 minLength="5"
//                 className="font-montserrat w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[#008060] focus:ring-0 outline-none transition-colors pr-10"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
//               >
//                 {showPassword ? (
//                   // Eye slash icon (password hidden)
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
//                   </svg>
//                 ) : (
//                   // Eye icon (password visible)
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="font-montserrat w-full bg-[#2DC071] hover:bg-[#006e52] text-white font-semibold py-3.5 px-4 rounded-lg transition-colors mb-5 text-sm sm:text-base"
//           >
//             Get Started
//           </button>
//         </Form>

//         {/* Terms and Privacy */}
//         <p className="font-montserrat text-xs sm:text-sm text-[#737373] text-center leading-relaxed mb-6 px-2">
//           By filling in the form above and clicking the "Get Started" button, you accept and agree to{" "}
//           <Link to="/terms" className="text-[#008060] hover:underline no-underline">Terms of Service</Link>{" "}
//           and{" "}
//           <Link to="/privacy" className="text-[#008060] hover:underline no-underline">Privacy Policy</Link>.
//         </p>

//         {/* Sign In Link */}
//         <p className="font-montserrat font-bold text-center text-black-500 text-sm sm:text-base border-t border-gray-200 pt-6">
//           Already have an account?{"  "}
//           <Link to="/signin" className="text-[#23A6F0] font-montserrat font-bold hover:underline no-underline">
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }












// import { Form, useActionData, useNavigate, useLoaderData } from "react-router";
// import { useEffect, useState } from "react";
// import { Link } from '~/components/Link';
// import { GLOBAL_SETTINGS_QUERY } from "../sanity/queries/GlobalSettingQuery";

// /**
//  * @param {Route.LoaderArgs} args
//  */
// export async function loader({ context }) {
//   const { sanityClient } = context;

//   try {
//     const globalSettings = await sanityClient.fetch(GLOBAL_SETTINGS_QUERY);
//     return { globalSettings };
//   } catch (error) {
//     console.error('Global Setting Query Failed:', error);
//     return { globalSettings: null };
//   }
// }

// export async function action({ request }) {
//   const formData = await request.formData();
//   const firstName = formData.get("firstName");
//   const lastName = formData.get("lastName");
//   const email = formData.get("email");
//   const password = formData.get("password");

//   // Keep your existing Shopify mutation logic here...
//   const storeDomain = "shaygwl.myshopify.com";
//   const storefrontToken = "ced104e78fc7dce85b549c7866e90013";
//   const mutation = `mutation customerCreate($input: CustomerCreateInput!) { customerCreate(input: $input) { customer { id email firstName lastName } customerUserErrors { code field message } } }`;

//   try {
//     const response = await fetch(`https://${storeDomain}/api/2024-10/graphql.json`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": storefrontToken },
//       body: JSON.stringify({ query: mutation, variables: { input: { firstName, lastName, email, password } } })
//     });
//     const data = await response.json();
//     if (data.errors) return { error: data.errors[0].message };
//     const errors = data?.data?.customerCreate?.customerUserErrors || [];
//     if (errors.length > 0) return { error: errors[0].message };
//     return { success: true, customer: data.data.customerCreate.customer };
//   } catch (error) {
//     return { error: `Failed to create customer: ${error.message}` };
//   }
// }


// export default function Register() {
//   const { globalSettings } = useLoaderData();
//   const result = useActionData();
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (result?.success) {
//       const timer = setTimeout(() => navigate('/signin'), 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [result, navigate]);

//   // HELPER: Ensures hex codes have the '#' prefix
//   const fixHex = (hex) => {
//     if (!hex) return "";
//     return hex.startsWith('#') ? hex : `#${hex}`;
//   };

//   const btn = globalSettings?.buttons;
//   const links = globalSettings?.linksEffect;

//   // Create dynamic styles object with fixed hex codes
//   const dynamicStyles = {
//     "--font-family": globalSettings?.fontFamily || "Montserrat, sans-serif",
//     "--base-font-size": `${globalSettings?.baseFontSize || 16}px`,
    
//     // Buttons
//     "--btn-bg": fixHex(btn?.primaryBg) || "#2DC071",
//     "--btn-text": fixHex(btn?.primaryText) || "#ffffff",
//     "--btn-hover-bg": fixHex(btn?.primaryHoverBg) || "#1D4ED8",
//     "--btn-hover-text": fixHex(btn?.primaryHovertxt) || "#ffffff",
//     "--btn-radius": `${btn?.borderRadius || 8}px`,
    
//     // Links
//     "--link-color": fixHex(links?.linkColor) || "#737373",
//     "--link-hover": fixHex(links?.hoverColor) || "#5a5a5a",
//   };

//   return (
//     <div 
//       className="min-h-screen bg-white flex items-center justify-center p-4"
//       style={dynamicStyles} 
//     >
//       <div className="w-full max-w-[440px] p-6 sm:p-8" style={{ fontFamily: "var(--font-family)" }}>
//         <h2 className="font-bold text-[#252B42] text-[32px] sm:text-[40px] text-center mb-4">
//           Sign up for free
//         </h2>
        
//         {/* ... (Success/Error messages) ... */}

//         <Form method="post">
//           <div className="mb-5">
//             <label className="block mb-2 font-medium text-sm">Name *</label>
//             <div className="flex flex-col sm:flex-row gap-3">
//               <input name="firstName" placeholder="First Name" required className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[var(--btn-bg)] outline-none" />
//               <input name="lastName" placeholder="Last Name" required className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[var(--btn-bg)] outline-none" />
//             </div>
//           </div>

//           <div className="mb-5">
//             <label className="block mb-2 font-medium text-sm">Email address *</label>
//             <input name="email" type="email" required className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[var(--btn-bg)] outline-none" />
//           </div>

//           <div className="mb-6">
//             <label className="block mb-2 font-medium text-sm">Password *</label>
//             <div className="relative">
//               <input name="password" type={showPassword ? "text" : "password"} required className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[var(--btn-bg)] outline-none" />
//               <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-400">
//                 {showPassword ? "Hide" : "Show"}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="register-submit-btn w-full font-semibold py-3.5 px-4 transition-all duration-300"
//           >
//             Get Started
//           </button>
//         </Form>

//         <p className="mt-6 text-center text-sm">
//           Already have an account?{" "}
//           <Link to="/signin" className="login-link font-bold no-underline">
//             Sign in
//           </Link>
//         </p>
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .register-submit-btn {
//           background-color: var(--btn-bg) !important;
//           color: var(--btn-text) !important;
//           border-radius: var(--btn-radius);
//           font-size: var(--base-font-size);
//           border: none;
//         }
//         .register-submit-btn:hover {
//           background-color: var(--btn-hover-bg) !important;
//           color: var(--btn-hover-text) !important;
//         }
//         .login-link {
//           color: var(--link-color) !important;
//         }
//         .login-link:hover {
//           color: var(--link-hover) !important;
//         }
//       `}} />
//     </div>
//   );
// }



import { Form, useActionData, useNavigate, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { Link } from '~/components/Link';
import { GLOBAL_SETTINGS_QUERY } from "../sanity/queries/GlobalSettingQuery";

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader({ context }) {
  const { sanityClient } = context;
  try {
    const globalSettings = await sanityClient.fetch(GLOBAL_SETTINGS_QUERY);
    return { globalSettings };
  } catch (error) {
    console.error('Global Setting Query Failed:', error);
    return { globalSettings: null };
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");

  const storeDomain = "shaygwl.myshopify.com";
  const storefrontToken = "ced104e78fc7dce85b549c7866e90013";
  const mutation = `mutation customerCreate($input: CustomerCreateInput!) { customerCreate(input: $input) { customer { id email firstName lastName } customerUserErrors { code field message } } }`;

  try {
    const response = await fetch(`https://${storeDomain}/api/2024-10/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": storefrontToken },
      body: JSON.stringify({ query: mutation, variables: { input: { firstName, lastName, email, password } } })
    });
    const data = await response.json();
    if (data.errors) return { error: data.errors[0].message };
    const errors = data?.data?.customerCreate?.customerUserErrors || [];
    if (errors.length > 0) return { error: errors[0].message };
    return { success: true, customer: data.data.customerCreate.customer };
  } catch (error) {
    return { error: `Failed to create customer: ${error.message}` };
  }
}

export default function Register() {
  const { globalSettings } = useLoaderData();
  const result = useActionData();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (result?.success) {
      const timer = setTimeout(() => navigate('/signin'), 2000);
      return () => clearTimeout(timer);
    }
  }, [result, navigate]);

  // Helper to fix missing '#' in Sanity hex codes
  const fixHex = (hex) => (hex && !hex.startsWith('#') ? `#${hex}` : hex);

  const btn = globalSettings?.buttons;
  const links = globalSettings?.linksEffect;

  const dynamicStyles = {
    "--font-family": globalSettings?.fontFamily || "Montserrat, sans-serif",
    "--base-font-size": `${globalSettings?.baseFontSize || 16}px`,
    "--btn-bg": fixHex(btn?.primaryBg) || "#23A6F0",
    "--btn-text": fixHex(btn?.primaryText) || "#FFFFFF",
    "--btn-hover-bg": fixHex(btn?.primaryHoverBg) || "#1D4ED8",
    "--btn-hover-text": fixHex(btn?.primaryHovertxt) || "#FFFFFF",
    "--btn-radius": `${btn?.borderRadius || 8}px`,
    "--link-color": fixHex(links?.linkColor) || "#23A6F0",
    "--link-hover": fixHex(links?.hoverColor) || "#008060",
  };

  return (
    <div 
      className="flex items-center justify-center p-4 sm:p-8" 
      style={{ ...dynamicStyles, minHeight: 'calc(100vh - 100px)' }} // Fixes the extra gap by accounting for header
    >
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-sm p-6 sm:p-8" style={{ fontFamily: "var(--font-family)" }}>
        <h2 className="font-bold text-[#252B42] text-[32px] sm:text-[40px] leading-tight tracking-[0.2px] text-center">
          Sign up for free
        </h2>
        
        <p className="mt-4 text-center text-gray-600 mb-8 text-sm sm:text-base leading-[24px]">
          Try everything free for 30 days, no payment details required
        </p>

        {result?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            <strong>Error:</strong> {result.error}
          </div>
        )}

        {result?.success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            <strong>✓ Account Created!</strong><br />
            Redirecting to sign in...
          </div>
        )}

        {/* OR Divider from Design Ref */}
        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <Form method="post">
          <div className="mb-5">
            <label className="block mb-2 font-medium text-sm text-black-700">Name *</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input name="firstName" placeholder="First Name" required className="w-full sm:flex-1 px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[var(--btn-bg)] outline-none transition-colors" />
              <input name="lastName" placeholder="Last Name" required className="w-full sm:flex-1 px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[var(--btn-bg)] outline-none transition-colors" />
            </div>
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-medium text-sm text-black-700">Email address *</label>
            <input name="email" type="email" placeholder="example@gmail.com" required className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[var(--btn-bg)] outline-none transition-colors" />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium text-sm text-black-700">Password *</label>
            <div className="relative">
              <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" required minLength="5" className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[var(--btn-bg)] outline-none transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="register-submit-btn w-full font-bold py-4 px-4 transition-all duration-300 shadow-lg shadow-blue-100">
            Get Started
          </button>
        </Form>

        {/* Terms and Privacy from Design Ref */}
        <p className="text-xs text-[#737373] text-center mt-6 leading-relaxed">
          By clicking "Get Started", you agree to our{" "}
          <Link to="/terms" className="login-link font-bold no-underline">Terms</Link>{" "}
          and{" "}
          <Link to="/privacy" className="login-link font-bold no-underline">Privacy Policy</Link>.
        </p>

        <p className="font-bold text-center text-sm border-t border-gray-100 mt-8 pt-6">
          Already have an account?{" "}
          <Link to="/signin" className="login-link font-bold no-underline ml-1">
            Sign in
          </Link>
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .register-submit-btn {
          background-color: var(--btn-bg) !important;
          color: var(--btn-text) !important;
          border-radius: var(--btn-radius);
          font-size: var(--base-font-size);
          border: none;
        }
        .register-submit-btn:hover {
          background-color: var(--btn-hover-bg) !important;
          color: var(--btn-hover-text) !important;
          transform: translateY(-1px);
        }
        .login-link {
          color: var(--link-color) !important;
        }
        .login-link:hover {
          color: var(--link-hover) !important;
          text-decoration: underline !important;
        }
      `}} />
    </div>
  );
}