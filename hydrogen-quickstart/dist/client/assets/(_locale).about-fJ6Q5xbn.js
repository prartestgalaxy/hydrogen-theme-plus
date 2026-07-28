import{w as z,u as $,a as F}from"./chunk-TMI4QPZX-BLmhRnqS.js";import{j as r}from"./jsx-runtime-DhjjMwep.js";import{P as b}from"./index-BmLmbhaU.js";import{L as C}from"./Link-CKxdSbTU.js";import{P as R}from"./PageLayout-CJrNdHQ5.js";import"./QuickView-B8fA0F3X.js";import"./index-CkmQf2YV.js";import"./index-MkUT3eft.js";import"./WishlistContext-CclRKPBo.js";import"./Image-DamjFDKV.js";import"./CartMain-B5ueVz_H.js";const n=a=>a?a.startsWith("#")?a:`#${a}`:null,I=z(function(){var g,s,j,c,t,k,v,d,x,l,m,p,u,h,f,i,y,E;const{page:w}=$(),o=F("root"),e=o==null?void 0:o.globalSettings,N=`
    .about-page {
      font-family: ${e!=null&&e.fontFamily?e.fontFamily:"Montserrat, sans-serif"};
      font-size: ${e!=null&&e.baseFontSize?e.baseFontSize:16}px;
    }
    .about-page h1 { font-size: ${(g=e==null?void 0:e.headingSizes)!=null&&g.h1?e.headingSizes.h1:42}px; }
    .about-page h2 { font-size: ${(s=e==null?void 0:e.headingSizes)!=null&&s.h2?e.headingSizes.h2:40}px; }
    .about-page h3 { font-size: ${(j=e==null?void 0:e.headingSizes)!=null&&j.h3?e.headingSizes.h3:32}px; }
    .about-page h4 { font-size: ${(c=e==null?void 0:e.headingSizes)!=null&&c.h4?e.headingSizes.h4:24}px; }
    .about-page h5 { font-size: ${(t=e==null?void 0:e.headingSizes)!=null&&t.h5?e.headingSizes.h5:20}px; }
    .about-page h6 { font-size: ${(k=e==null?void 0:e.headingSizes)!=null&&k.h6?e.headingSizes.h6:16}px; }

    .btn-primary {
      background-color: ${(v=e==null?void 0:e.buttons)!=null&&v.primaryBg?n(e.buttons.primaryBg):"#23A6F0"};
      color: ${(d=e==null?void 0:e.buttons)!=null&&d.primaryText?n(e.buttons.primaryText):"#FFFFFF"};
      border-radius: ${((x=e==null?void 0:e.buttons)==null?void 0:x.borderRadius)!=null&&((l=e==null?void 0:e.buttons)==null?void 0:l.borderRadius)!==""?e.buttons.borderRadius:8}px;
    }
    .btn-primary:hover {
      background-color: ${(m=e==null?void 0:e.buttons)!=null&&m.primaryHoverBg?n(e.buttons.primaryHoverBg):"#1D4ED8"};
      color: ${(p=e==null?void 0:e.buttons)!=null&&p.primaryHovertxt?n(e.buttons.primaryHovertxt):"#FFFFFF"};
    }

    .about-link {
      color: ${(u=e==null?void 0:e.linksEffect)!=null&&u.linkColor?n(e.linksEffect.linkColor):"#252B42"};
      transition-duration: ${((h=e==null?void 0:e.linksEffect)==null?void 0:h.transitionDuration)!=null&&((f=e==null?void 0:e.linksEffect)==null?void 0:f.transitionDuration)!==""?e.linksEffect.transitionDuration:300}ms;
      text-decoration: ${((i=e==null?void 0:e.linksEffect)!=null&&i.underlineStyle?e.linksEffect.underlineStyle:"none")==="always"?"underline":"none"};
    }
    .about-link:hover {
      color: ${(y=e==null?void 0:e.linksEffect)!=null&&y.hoverColor?n(e.linksEffect.hoverColor):"#5a5a5a"};
      ${((E=e==null?void 0:e.linksEffect)!=null&&E.hoverEffect?e.linksEffect.hoverEffect:"none")==="underline"?"text-decoration: underline;":""}
    }
  `;return r.jsx(R,{children:r.jsxs("div",{className:"min-h-screen about-page",children:[r.jsx("style",{children:N}),r.jsx(L,{page:w,GlobalSettings:e})]})})});function L({page:a,GlobalSettings:w}){var l,m,p,u,h,f;const{storyHeading:o,storyBody:e,storyBgColor:N,featureLayout:g,featureImage:s,featureHeading:j,featureBody:c,featureButton:t,valuesHeading:k,valuesBgColor:v,valuesList:d}=a,x=g==="right";return r.jsxs("main",{className:"w-full",children:[r.jsx("section",{className:"py-24 px-6 lg:px-12 flex flex-col items-center justify-center text-center",style:{backgroundColor:N||"#f4f4f0"},children:r.jsxs("div",{className:"max-w-4xl mx-auto space-y-6",children:[r.jsx("h1",{className:"text-4xl md:text-5xl font-extrabold text-black tracking-widest uppercase",children:o||"OUR STORY"}),e&&r.jsx("p",{className:"text-[18px] md:text-[20px] text-gray-700 leading-relaxed max-w-3xl mx-auto",children:e})]})}),r.jsx("section",{className:"max-w-[100%] bg-white py-24 px-[7%] lg:py-48",children:r.jsxs("div",{className:`container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center ${x?"":"md:flex-row-reverse"}`,children:[r.jsx("div",{className:`relative w-full ${x?"order-last":"order-first"}`,children:((l=s==null?void 0:s.asset)==null?void 0:l.url)&&r.jsx("img",{src:s.asset.url,alt:s.alt||"About Feature",className:"w-full h-auto object-cover rounded shadow-md",loading:"lazy"})}),r.jsxs("div",{className:"space-y-8 text-left",children:[r.jsx("h2",{className:"text-4xl md:text-[42px] font-extrabold text-black uppercase leading-tight tracking-tight",children:j||"DESIGNED FOR THE ELEMENTS"}),r.jsx("div",{className:"text-[16px] md:text-[18px] text-gray-700 leading-relaxed space-y-6",children:c?r.jsx(b,{value:c}):r.jsx("p",{children:"What started as a late-night passion project has evolved into a global community..."})}),(t==null?void 0:t.text)&&r.jsx("div",{className:"pt-4",children:r.jsx(C,{to:((p=(m=t.link)==null?void 0:m[0])==null?void 0:p.url)||((f=(h=(u=t.link)==null?void 0:u[0])==null?void 0:h.reference)==null?void 0:f.slug)||"#",className:"inline-block px-8 py-4 btn-primary text-white text-[13px] font-bold uppercase tracking-wider transition-colors",children:t.text})})]})]})}),r.jsx("section",{className:"text-white py-24 px-6 lg:px-12",style:{backgroundColor:v||"#ffffff"},children:r.jsxs("div",{className:"container mx-auto max-w-6xl space-y-20",children:[r.jsx("div",{className:"text-center",children:r.jsx("h2",{className:"text-4xl md:text-[42px] font-extrabold uppercase tracking-widest",children:k||"CORE VALUES"})}),r.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16",children:d&&d.map((i,y)=>r.jsxs("div",{className:"flex flex-col items-center text-center space-y-6",children:[r.jsx("div",{className:"w-14 h-14 rounded-full border border-white flex items-center justify-center text-xl font-light",children:i.number||y+1}),r.jsx("h3",{className:"text-[18px] font-bold uppercase tracking-widest",children:i.title}),r.jsx("p",{className:"text-[15px] text-gray-300 leading-relaxed max-w-xs mx-auto",children:i.description})]},i._key||y))})]})})]})}export{I as default};
