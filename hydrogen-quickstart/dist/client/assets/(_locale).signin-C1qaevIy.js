import{w as c,u as x,f as p,r as b,F as u}from"./chunk-TMI4QPZX-BLmhRnqS.js";import{j as e}from"./jsx-runtime-DhjjMwep.js";import{L as l}from"./Link-CKxdSbTU.js";const y=c(function(){const{globalSettings:r}=x(),a=p(),[i,d]=b.useState(!1),s=n=>n&&!n.startsWith("#")?`#${n}`:n,t=r==null?void 0:r.buttons,o=r==null?void 0:r.linksEffect,m={"--font-family":(r==null?void 0:r.fontFamily)||"Montserrat, sans-serif","--base-font-size":`${(r==null?void 0:r.baseFontSize)||16}px`,"--btn-bg":s(t==null?void 0:t.primaryBg)||"#23A6F0","--btn-text":s(t==null?void 0:t.primaryText)||"#FFFFFF","--btn-hover-bg":s(t==null?void 0:t.primaryHoverBg)||"#1D4ED8","--btn-hover-text":s(t==null?void 0:t.primaryHovertxt)||"#FFFFFF","--btn-radius":`${(t==null?void 0:t.borderRadius)||8}px`,"--link-color":s(o==null?void 0:o.linkColor)||"#23A6F0","--link-hover":s(o==null?void 0:o.hoverColor)||"#008060"};return e.jsxs("div",{className:"flex items-start justify-center p-4 sm:p-6 pt-10 sm:pt-16",style:m,children:[e.jsxs("div",{className:"w-full max-w-[440px] bg-white rounded-2xl shadow-sm p-6 sm:p-8",style:{fontFamily:"var(--font-family)"},children:[e.jsx("h1",{className:"font-bold text-[#252B42] text-[32px] sm:text-[40px] leading-tight tracking-[0.2px] text-center mb-4",children:"Welcome Back"}),e.jsx("p",{className:"mt-4 text-center text-gray-600 mb-8 text-sm sm:text-base leading-[24px]",children:"Enter your credentials to access your account."}),e.jsxs("div",{className:"flex items-center mb-6",children:[e.jsx("div",{className:"flex-1 h-px bg-gray-200"}),e.jsx("div",{className:"flex-1 h-px bg-gray-200"})]}),(a==null?void 0:a.error)&&e.jsxs("div",{className:"bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm",children:[e.jsx("strong",{children:"Error:"})," ",a.error]}),e.jsxs(u,{method:"post",children:[e.jsxs("div",{className:"mb-5",children:[e.jsx("label",{className:"block mb-2 font-medium text-sm text-black-700",children:"Email address *"}),e.jsx("input",{name:"email",type:"email",placeholder:"example@gmail.com",required:!0,className:"w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[var(--btn-bg)] outline-none transition-colors"})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{className:"block mb-2 font-medium text-sm text-black-700",children:"Password *"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{name:"password",type:i?"text":"password",placeholder:"Password",required:!0,className:"w-full px-4 py-3 text-sm rounded-lg border border-gray-200 focus:border-[var(--btn-bg)] outline-none transition-colors"}),e.jsx("button",{type:"button",onClick:()=>d(!i),className:"absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider",children:i?"Hide":"Show"})]})]}),e.jsx("div",{className:"text-right mb-6",children:e.jsx(l,{to:"/forgot-password",size:"sm",className:"login-link text-sm font-bold no-underline",children:"Forgot Password?"})}),e.jsx("button",{type:"submit",className:"signin-submit-btn w-full font-bold py-4 px-4 transition-all duration-300 shadow-lg shadow-blue-100",children:"Get Started"})]}),e.jsxs("p",{className:"font-bold text-center text-sm border-t border-gray-100 mt-8 pt-6",children:["Don't have an account?"," ",e.jsx(l,{to:"/register",className:"login-link font-bold no-underline ml-1",children:"Sign up"})]})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})});export{y as default};
