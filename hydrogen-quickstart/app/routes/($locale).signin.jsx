
// import { Form, useActionData, redirect } from "react-router";
// import { Link } from '~/components/Link';
// import { useState } from 'react';

// export async function action({ request, context }) {
//   const formData = await request.formData();
//   const email = formData.get("email");
//   const password = formData.get("password");

//   const mutation = `#graphql
//     mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
//       customerAccessTokenCreate(input: $input) {
//         customerAccessToken {
//           accessToken
//           expiresAt
//         }
//         customerUserErrors {
//           message
//         }
//       }
//     }
//   `;

//   // Use Hydrogen storefront client
//   const data = await context.storefront.mutate(mutation, {
//     variables: {
//       input: { email, password },
//     },
//   });

//   const errors = data?.customerAccessTokenCreate?.customerUserErrors || [];

//   if (errors.length > 0) {
//     return { error: errors[0].message };
//   }

//   const accessToken = data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;

//   if (!accessToken) {
//     return { error: "No access token returned" };
//   }

//   const headers = new Headers();

//   // Important cookie flags
//   headers.append(
//     "Set-Cookie",
//     `customerAccessToken=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`
//   );

//   return redirect("/", { headers });
// }

// export default function SignIn() {
//   const result = useActionData();
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <div className="min-h-screen bg-white-50 flex items-top justify-center px-4 mt-6">
//       <div className="w-full max-w-md p-6 rounded-xl shadow-sm">
//         {/* Welcome Back Header */}
//         <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
//           Welcome Back
//         </h1>

//         {/* OR Divider */}
//         <div className="relative my-6">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-300"></div>
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-4 bg-white text-gray-500">OR</span>
//           </div>
//         </div>

//         {/* Error Message */}
//         {result?.error && (
//           <div className="mb-4 text-sm text-black-600 bg-black-50 p-3 rounded-md">
//             {result.error}
//           </div>
//         )}

//         {/* Success Message */}
//         {result?.success && (
//           <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-md">
//             <strong>✓ Login Successful!</strong> Welcome back!
//           </div>
//         )}

//         <Form method="post" className="space-y-6">
//           {/* Email Field */}
//           <div>
//             <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
//               Email address <span className="text-black-500">*</span>
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               placeholder="example@gmail.com"
//               required
//               className="w-full appearance-none relative block w-full px-3 py-2.5 
//                        border border-gray-300 rounded-md placeholder-gray-400 
//                        text-gray-900 focus:outline-none focus:ring-1 
//                        focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           {/* Password Field with Eye Icon */}
//           <div>
//             <label htmlFor="password" className="block font-bold text-sm text-gray-700 mb-1 w-full">
//               Password <span className="text-black-500">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 required
//                 className="w-full appearance-none relative block w-full px-3 py-2.5 
//                          border border-gray-300 rounded-md placeholder-gray-400 
//                          text-gray-900 focus:outline-none focus:ring-1 
//                          focus:ring-blue-500 focus:border-blue-500 pr-10"
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

//           {/* Forgot Password Link */}
//           <div className="text-right">
//             <Link 
//               to="/forgot-password" 
//               className="text-sm font-bold text-[#23A6F0] hover:text-blue-500"
//             >
//               Forgot Password
//             </Link>
//           </div>

//           {/* Get Started Button */}
//           <button
//             type="submit"
//             className="w-full py-2.5 px-4 border border-transparent text-sm font-medium 
//                      rounded-md text-white bg-[#2DC071] hover:bg-green-700 
//                      focus:outline-none focus:ring-2 focus:ring-offset-2 
//                      focus:ring-blue-500 transition-colors duration-200"
//           >
//             Get Started
//           </button>
//         </Form>

//         {/* Sign Up Link */}
//         <p className="text-center text-sm text-gray-600 mt-4">
//           Already have an account?{' '}
//           <Link 
//             to="/register" 
//             className="font-medium text-green-600 hover:text-green-700 hover:underline"
//           >
//             Sign Up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }



import { Form, useActionData, redirect, useLoaderData, useNavigate } from "react-router";
import { Link } from '~/components/Link';
import { useState } from 'react';
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

export async function action({ request, context }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const mutation = `#graphql
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

  const data = await context.storefront.mutate(mutation, {
    variables: {
      input: { email, password },
    },
  });

  const errors = data?.customerAccessTokenCreate?.customerUserErrors || [];
  if (errors.length > 0) return { error: errors[0].message };

  const accessToken = data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
  if (!accessToken) return { error: "No access token returned" };

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `customerAccessToken=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`
  );

  return redirect("/", { headers });
}

export default function SignIn() {
  const { globalSettings } = useLoaderData();
  const result = useActionData();
  const [showPassword, setShowPassword] = useState(false);

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
      className="flex items-start justify-center p-4 sm:p-6 pt-10 sm:pt-16" 
      style={dynamicStyles}
    >
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-sm p-6 sm:p-8" style={{ fontFamily: "var(--font-family)" }}>
        <h1 className="font-bold text-[#252B42] text-[32px] sm:text-[40px] leading-tight tracking-[0.2px] text-center mb-4">
          Welcome Back
        </h1>

        <p className="mt-4 text-center text-gray-600 mb-8 text-sm sm:text-base leading-[24px]">
          Enter your credentials to access your account.
        </p>

        {/* OR Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Error Message */}
        {result?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            <strong>Error:</strong> {result.error}
          </div>
        )}

        <Form method="post">
          {/* Email Field */}
          <div className="mb-5">
            <label className="block mb-2 font-medium text-sm text-black-700">Email address *</label>
            <input
              name="email"
              type="email"
              placeholder="example@gmail.com"
              required
              className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[var(--btn-bg)] outline-none transition-colors"
            />
          </div>

          {/* Password Field */}
          <div className="mb-2">
            <label className="block mb-2 font-medium text-sm text-black-700">Password *</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[var(--btn-bg)] outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right mb-6">
            <Link to="/forgot-password" size="sm" className="login-link text-sm font-bold no-underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="signin-submit-btn w-full font-bold py-4 px-4 transition-all duration-300 shadow-lg shadow-blue-100"
          >
            Get Started
          </button>
        </Form>

        {/* Sign Up Link */}
        <p className="font-bold text-center text-sm border-t border-gray-100 mt-8 pt-6">
          Don't have an account?{" "}
          <Link to="/register" className="login-link font-bold no-underline ml-1">
            Sign up
          </Link>
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .signin-submit-btn {
          background-color: var(--btn-bg) !important;
          color: var(--btn-text) !important;
          border-radius: var(--btn-radius);
          font-size: var(--base-font-size);
          border: none;
        }
        .signin-submit-btn:hover {
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