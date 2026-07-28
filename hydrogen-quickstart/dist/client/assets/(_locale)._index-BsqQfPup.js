import{b as Ae,r as C,L as se,c as qe,w as _e,u as Oe,a as We}from"./chunk-TMI4QPZX-BLmhRnqS.js";import{j as r}from"./jsx-runtime-DhjjMwep.js";import"./index-CkmQf2YV.js";import{u as Re,Q as Ue}from"./QuickView-B8fA0F3X.js";import{g as ze}from"./groq-DBO2yGN5.js";import{L as He}from"./Link-CKxdSbTU.js";import{I as ie}from"./Image-DamjFDKV.js";import{J as Ee}from"./index-MkUT3eft.js";import{u as Pe,M as Ie}from"./WishlistContext-CclRKPBo.js";import{N as Le}from"./No_image-BuyNKfAF.js";import{L as Ve}from"./LogoSlider-LrxPF98B.js";function Ge({module:s,globalSettingsData:e}){var j,y,E,N,k,T,I,z,F,f,p,b,H,A,V;if(!s)return null;const{locale:t}=Ae(),[w,v]=C.useState(!1);C.useEffect(()=>{const q=setTimeout(()=>v(!0),50);return()=>clearTimeout(q)},[]);const{layout:a="full",imageUrl:x,content:o={},colors:n={},cta:i={}}=s,c=q=>{if(q)return q.toString().startsWith("#")?q:`#${q}`},h=`
    .hero-banner-font {
      font-family: ${e!=null&&e.fontFamily?e==null?void 0:e.fontFamily:"Montserrat, sans-serif"};
    }
    .hero-banner-bg {
      background-color: ${(j=n==null?void 0:n.bg)!=null&&j.hex?c((y=n==null?void 0:n.bg)==null?void 0:y.hex):e!=null&&e.mainBg?c(e.mainBg):"#45C8ED"};
    }
    .hero-banner-text {
      color: ${(E=n==null?void 0:n.text)!=null&&E.hex?c((N=n==null?void 0:n.text)==null?void 0:N.hex):e!=null&&e.mainColor?c(e.mainColor):"#0a2540"};
      text-align: ${o!=null&&o.alignment?o.alignment:"left"};
    }
    .hero-banner-title {
      max-width: fit-content;
      font-family: ${e!=null&&e.fontFamily?e==null?void 0:e.fontFamily:"Montserrat, sans-serif"};
      font-size: ${o!=null&&o.titleSize?o.titleSize:(k=e==null?void 0:e.headingSizes)!=null&&k.h1?e.headingSizes.h1+"px":"42px"};
      font-weight: 700;
      leading-trim: NONE;
      line-height: 80px;
      letter-spacing: 0.2px;

    }
    .hero-banner-subheading {
      max-width:548px;
      font-family: ${e!=null&&e.fontFamily?e==null?void 0:e.fontFamily:"Montserrat, sans-serif"};
      font-size: ${o!=null&&o.subheadingSize?o.subheadingSize:(T=e==null?void 0:e.headingSizes)!=null&&T.h5?e.headingSizes.h5+"px":"16px"};
      font-weight: 700;
      leading-trim: NONE;
      line-height: 24px;
      letter-spacing: 0.1px;
    }
      .hero-banner-para{
      max-width:376px;
      font-family: ${e!=null&&e.fontFamily?e==null?void 0:e.fontFamily:"Montserrat, sans-serif"};
        font-size: ${o!=null&&o.paraSize?o.paraSize:(I=e==null?void 0:e.headingSizes)!=null&&I.h4?e.headingSizes.h4+"px":"20px"};
        font-weight: 400;
        leading-trim: NONE;
        line-height: 30px;
        letter-spacing: 0.2px;
      }

    .hero-btn {
      width:100%;
      max-width: fit-content;
      font-family: ${e!=null&&e.fontFamily?e==null?void 0:e.fontFamily:"Montserrat, sans-serif"};
      font-size: ${o!=null&&o.paraSize?o.paraSize:(z=e==null?void 0:e.headingSizes)!=null&&z.h3?e.headingSizes.h3+"px":"24px"};
      background-color: ${(i==null?void 0:i.style)==="outline"?"transparent":i!=null&&i.bgColor?c(i.bgColor):(F=e==null?void 0:e.buttons)!=null&&F.primaryBg?c(e.buttons.primaryBg):"#23A6F0"};
      color: ${i!=null&&i.textColor?c(i.textColor):(f=e==null?void 0:e.buttons)!=null&&f.primaryText?c(e.buttons.primaryText):"#FFFFFF"};
      border-color: ${i!=null&&i.bgColor?c(i.bgColor):(p=e==null?void 0:e.buttons)!=null&&p.primaryBg?c(e.buttons.primaryBg):"#23A6F0"};
      ${i!=null&&i.style?"":`border-radius: ${((b=e==null?void 0:e.buttons)==null?void 0:b.borderRadius)!==void 0?e.buttons.borderRadius:8}px;`};
      font-weight: 700;
      leading-trim: NONE;
      line-height: 32px;
      letter-spacing: 0.1px;
      text-align: center;

    }
    .hero-btn:hover {
       background-color: ${(H=e==null?void 0:e.buttons)!=null&&H.primaryHoverBg?c(e.buttons.primaryHoverBg):"#1D4ED8"};
       color: ${(A=e==null?void 0:e.buttons)!=null&&A.primaryHovertxt?c(e.buttons.primaryHovertxt):"#FFFFFF"};
       border-color: ${(V=e==null?void 0:e.buttons)!=null&&V.primaryHoverBg?c(e.buttons.primaryHoverBg):"#1D4ED8"};
    }
    .hero-overlay {
      background-color: black;
      opacity: ${((n==null?void 0:n.overlay)||0)/100};
    }

      @media (max-width: 514px) {
       .hero-banner-title {
         font-size:40px;
        }
      }
  `,u=(()=>{var M,O;const q=(M=i==null?void 0:i.link)==null?void 0:M[0];return q?q._type==="linkExternal"?q.url||"#":(O=q.reference)!=null&&O.slug?`/${q.reference._type==="product"?"products":"collections"}/${q.reference.slug}`:"#":"#"})(),m={pill:"rounded-full",rounded:"rounded-md",sharp:"rounded-none",outline:"rounded-md border-2 bg-transparent"};if(a==="full")return r.jsxs("section",{className:"relative w-full h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden hero-banner-font",children:[r.jsx("style",{children:h}),x&&r.jsx("img",{src:x,alt:o.title||"",className:`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${w?"blur-0 scale-100":"blur-xl scale-105"}`,onLoad:()=>v(!0)}),r.jsx("div",{className:"absolute inset-0 hero-overlay"}),r.jsxs("div",{className:"relative z-10 px-6 max-w-4xl hero-banner-text",children:[r.jsx("h1",{className:`${o.titleWeight||"font-bold"} mb-6 hero-banner-title`,children:o.title}),r.jsx("p",{className:"text-lg md:text-xl mb-8 opacity-90",children:o.subtitle}),i.text&&r.jsx(se,{to:u,className:`inline-block px-10 py-4 font-bold tracking-widest uppercase text-xs transition-transform hover:scale-105 hero-btn ${i.style?m[i.style]:""}`,children:i.text})]})]});const l=a==="split-left";return r.jsxs("section",{className:"w-full max-w-[100%] px-[7%] mb-[14px] mx-auto md:py-[42px] flex justify-center hero-banner-font",children:[r.jsx("style",{children:h}),r.jsxs("div",{className:`relative w-full min-h-[65vh] lg:min-h-[75vh] h-auto rounded-[24px] overflow-hidden flex flex-col ${l?"md:flex-row-reverse":"md:flex-row"} shadow-sm hero-banner-bg`,children:[r.jsxs("div",{className:"relative z-10 w-full md:w-[55%] flex flex-col justify-center p-8 md:py-16 md:px-12 lg:pl-[50px] lg:pr-[50px] hero-banner-text gap-[30px]",children:[o.overline&&r.jsx("p",{className:"text-[14px] font-bold tracking-[0.1em] uppercase text-[#2A7CC7]",children:o.overline}),r.jsx("h5",{className:"text-[#2A7CC7] hero-banner-font hero-banner-subheading text-left",children:o.subheading}),r.jsx("h1",{className:`${o.titleWeight||"font-extrabold"} hero-banner-font md:!text-[58px] leading-[1.1] tracking-tight text-[#252B42] hero-banner-title`,children:o.title}),r.jsx("h4",{className:"text-left opacity-75 leading-relaxed max-w-[90%] hero-banner-para hero-banner-font",children:o.subtitle}),r.jsx("div",{children:i.text&&r.jsx(se,{to:u,className:`inline-block px-[40px] py-[15px] uppercase transition-transform hover:-translate-y-1 shadow-md hero-btn ${i.style?m[i.style]:""}`,children:i.text})})]}),r.jsxs("div",{className:"relative w-full md:w-[45%] min-h-[350px] md:min-h-[480px] flex items-end justify-center",children:[r.jsx("div",{className:`absolute top-1/2 -translate-y-1/2 h-[120%] md:h-[135%] aspect-square rounded-full z-0 ${l?"right-[-10%] md:right-[-25%]":"left-[-10%] md:left-[-25%]"}`}),x&&r.jsx("img",{src:x,alt:o.title||"",className:`absolute bottom-0 left-1/2 -translate-x-1/2 w-auto md:w-[110%] max-w-none h-[100%] object-contain object-bottom z-10 transition-all duration-700 ${w?"blur-0 scale-100":"blur-xl scale-105"}`,onLoad:()=>v(!0)})]})]})]})}function Qe({module:s,globalSettingsData:e}){var z,F,f,p,b,H,A,V,q;if(!s)return null;const[t,w]=C.useState(!1);C.useEffect(()=>{w(!0)},[]);const{layout:v="left",imageWidth:a=50,imageUrl:x,imageSettings:o={},content:n={},cta:i={},theme:c={},_key:h="default"}=s,u=M=>M?M!=null&&M.startsWith("#")?M:`#${M}`:null,m=()=>{var O,G;const M=(O=i==null?void 0:i.link)==null?void 0:O[0];if(!M)return"#";if(M._type==="linkExternal")return M.url||"#";if((G=M.reference)!=null&&G.slug){const K=M.reference._type,Q=M.reference.slug;return K==="product"?`/products/${Q}`:K==="collection"?`/collections/${Q}`:`/${Q}`}return"#"},l=(e==null?void 0:e.fontFamily)||"Montserrat, sans-serif",j={heading:(z=e==null?void 0:e.headingSizes)!=null&&z.h2?`${e.headingSizes.h2}px`:"40px",body:e!=null&&e.baseFontSize?`${e.baseFontSize}px`:"14px"},y={sectionBg:u(c==null?void 0:c.bg)||"#ffffff",heading:u(c==null?void 0:c.textHeading)||u((F=e==null?void 0:e.colors)==null?void 0:F.heading)||"#252B42",body:u(c==null?void 0:c.text)||u((f=e==null?void 0:e.linksEffect)==null?void 0:f.linkColor)||"#737373",btnBg:u((p=i==null?void 0:i.bgColor)==null?void 0:p.hex)||u((b=e==null?void 0:e.buttons)==null?void 0:b.primaryBg)||"#000000",btnText:u((H=i==null?void 0:i.textColor)==null?void 0:H.hex)||u((A=e==null?void 0:e.buttons)==null?void 0:A.primaryText)||"#ffffff"},E=()=>{var M;return(i==null?void 0:i.style)==="sharp"?"0px":(i==null?void 0:i.style)==="pill"?"9999px":(i==null?void 0:i.style)==="rounded"?"8px":((M=e==null?void 0:e.buttons)==null?void 0:M.borderRadius)!==void 0?`${e.buttons.borderRadius}px`:"0px"},N=`
    .iwt-${h} { font-family: ${l}; }

    .iwt-${h} .fontStyle-h2 { 
      font-family: ${l};
      font-size: ${j.heading};
      font-weight: 700;
      leading-trim: NONE;
      line-height: 50px;
      letter-spacing: 0.2px;
     }

    .iwt-${h} .fontStyle-p { 
      font-family: ${l};
      font-size: ${j.body};
      font-weight: 400;
      leading-trim: NONE;
      line-height: 20px;
      letter-spacing: 0.2px;
     }
   

    
    .iwt-${h} .btn-custom {
      background-color: ${y.btnBg} !important;
      color: ${y.btnText} !important;
      border-radius: ${E()} !important;
      transition: all 0.3s ease;
      border: 1px solid ${y.btnBg};
      display: inline-block;
    }

    .iwt-${h} .btn-custom:hover {
      background-color: ${u((V=e==null?void 0:e.buttons)==null?void 0:V.primaryHoverBg)||y.btnBg} !important;
      color: ${u((q=e==null?void 0:e.buttons)==null?void 0:q.primaryHovertxt)||"#FFFFFF"} !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .iwt-${h} .btn-underline {
      color: ${y.heading} !important;
      border-bottom: 2px solid ${y.btnBg} !important;
      background: transparent !important;
      padding: 0 0 4px 0 !important;
      border-radius: 0 !important;
      display: inline-block;
    }

    .iwt-${h} .btn-underline:hover {
      opacity: 0.7;
    }
  `,k={none:"py-0",small:"py-10 md:py-16",medium:"py-16 md:py-24",large:"py-24 md:py-32"},T={none:"rounded-none",sm:"rounded-sm",md:"rounded-lg",lg:"rounded-2xl",full:"rounded-full"},I={auto:"aspect-auto",square:"aspect-square",portrait:"aspect-[4/5]",landscape:"aspect-[3/2]"};return r.jsxs("section",{className:`w-full mx-auto iwt-${h} ${k[(c==null?void 0:c.padding)||"medium"]}`,style:{backgroundColor:y.sectionBg},children:[r.jsx("style",{dangerouslySetInnerHTML:{__html:N}}),r.jsxs("div",{className:`max-w-[100%]  px-[7%] flex flex-col lg:flex-row items-center gap-10 lg:gap-[90px] ${v==="right"?"lg:flex-row-reverse":""}`,children:[r.jsx("div",{className:"w-full flex-shrink-0",style:{flexBasis:`${a}%`},children:r.jsx("div",{className:`overflow-hidden ${T[(o==null?void 0:o.radius)||"none"]} ${I[(o==null?void 0:o.aspect)||"auto"]}`,children:x&&r.jsx(ie,{src:x,alt:(n==null?void 0:n.title)||"Section Image",className:`w-full h-full object-${(o==null?void 0:o.fit)||"cover"} transition-all duration-700 hover:scale-105 ${t?"blur-0":"blur-xl"}`,sizes:`(max-width: 1024px) 100vw, ${a}vw`})})}),r.jsx("div",{className:"w-full flex flex-col justify-center",style:{flexBasis:`${100-a}%`},children:r.jsxs("div",{className:`w-full max-w-[550px] mx-auto ${(n==null?void 0:n.alignment)==="center"?"text-center":(n==null?void 0:n.alignment)==="right"?"text-right":"text-left"}`,children:[(n==null?void 0:n.overline)&&r.jsx("span",{className:"block uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 font-medium",style:{color:y.body},children:n.overline}),r.jsx("h2",{className:`fontStyle-h2 mb-4 ${(n==null?void 0:n.titleSize)||"text-[40px]"} max-md:text-[28px]`,style:{color:y.heading},children:(n==null?void 0:n.title)||"Title goes here"}),(n==null?void 0:n.body)&&r.jsx("p",{className:"fontStyle-p whitespace-pre-line sm:text-sm text-[#737373]",children:n.body}),(i==null?void 0:i.text)&&r.jsx(He,{to:m(),className:(i==null?void 0:i.style)==="underline"?"btn-underline uppercase tracking-widest text-[11px] font-bold mt-[16px]":"btn-custom px-10 py-4 mt-[16px] uppercase tracking-[0.2em] text-[10px] font-bold shadow-sm",children:i.text})]})})]})]})}function Ze({module:s={},globalSettings:e,globalSettingsData:t,isLoggedIn:w,wishlistSettings:v,activeCurrency:a="USD",activeCountry:x="us",wishlist:o=[]}){var $,W,Z,D,$e,Fe,be;const{open:n}=Re(),i=(s==null?void 0:s.fontFamily)||(t==null?void 0:t.fontFamily)||"Montserrat, sans-serif",c=d=>{var B;return d&&((B=d==null?void 0:d.toString())!=null&&B.startsWith("#")?d:`#${d}`)},h=c(s==null?void 0:s.buttonColor)||(($=t==null?void 0:t.buttons)!=null&&$.primaryBg?c(t.buttons.primaryBg):"#23A6F0"),u=c(s==null?void 0:s.buttonColor)||((W=t==null?void 0:t.buttons)!=null&&W.primaryHoverBg?c(t.buttons.primaryHoverBg):"#23A6F0"),m=c(s==null?void 0:s.buttonTextColor)||((Z=t==null?void 0:t.buttons)!=null&&Z.primaryHovertxt?c(t.buttons.primaryHovertxt):"#FFFFFF"),l=((D=t==null?void 0:t.buttons)==null?void 0:D.borderRadius)!==void 0?`${t.buttons.borderRadius}px`:"0px",j=`
    .pg-section {
      font-family: ${i};
      text-align: ${(s==null?void 0:s.textAlign)||"center"};
    }
    .pg-subtitle {
      font-size: ${s!=null&&s.subtitleFontSize?s.subtitleFontSize:($e=t==null?void 0:t.headingSizes)!=null&&$e.h4?t.headingSizes.h4+"px":"20px"};
      font-family: ${i};
      text-align: ${(s==null?void 0:s.textAlign)||"center"};
    }
    .pg-title {
      font-size: ${s!=null&&s.titleFontSize?s.titleFontSize:(Fe=t==null?void 0:t.headingSizes)!=null&&Fe.h3?t.headingSizes.h3+"px":"24px"};
      text-align: ${(s==null?void 0:s.textAlign)||"center"};
      font-family: ${i};
    }
    .pg-description {
      font-size: ${s!=null&&s.descriptionFontSize?s.descriptionFontSize:t!=null&&t.baseFontSize?t.baseFontSize+"px":"14px"};
      font-family: ${i};
      text-align: ${(s==null?void 0:s.textAlign)||"center"};
    }
    .pg-product-title {
      font-size: ${s!=null&&s.productTitleFontSize?s.productTitleFontSize:(be=t==null?void 0:t.headingSizes)!=null&&be.h6?t.headingSizes.h6+"px":"16px"};
      font-family: ${i};
      text-align: ${(s==null?void 0:s.textAlign)||"center"};
    }
    .pg-load-more-btn {
      border-color: ${h};
      background-color: transparent;
      color: ${h};
      border-radius: ${l};
      border-width: 1px;
      text-align: ${(s==null?void 0:s.textAlign)||"center"};
    }
    .pg-load-more-btn:hover {
      background-color: ${u};
      color: ${m};
      border-color: ${u};
    }

    .pg-align{
      text-align: ${(s==null?void 0:s.textAlign)||"center"};
    }
  `;let y=null;try{y={styling:{maxWidth:"max-w-5xl",backgroundColor:"#ffffff",textColor:"#1a1a1a",buttonColor:"#000000",buttonTextColor:"#ffffff",fontSize:"text-base",borderRadius:"rounded-xl"},contentElements:[{elementType:"image",enabled:!0,imageSize:"large"},{elementType:"title",enabled:!0,titleSize:"text-3xl"},{elementType:"price",enabled:!0,showCompareAtPrice:!0},{elementType:"variants",enabled:!0,variantStyle:"buttons"},{elementType:"addToCart",enabled:!0,buttonText:"Add to Cart"}]}}catch(d){console.error("Error fetching quick view config:",d),y=null}const[E,N]=C.useState(null),[k,T]=C.useState(!1),I=(d,B)=>{B.preventDefault(),B.stopPropagation(),N(d),T(!0)},z=()=>{T(!1),N(null)};x=x.toLowerCase();const F={country:x,currency:a},f=Array.from({length:10}).map((d,B)=>({_id:`fallback-${B}`,slug:`fallback-product-${B}`,title:"Graphic Design",department:"English Department",price:6.48,compareAtPrice:16.48,imageUrl:`https://picsum.photos/seed/${B+30}/400/600`})),{title:p="BESTSELLER PRODUCTS",subtitle:b="",description:H="",resolvedProducts:A=[],columnsDesktop:V=5,gap:q="8",padding:M="py-24",buttonText:O="LOAD MORE PRODUCTS",buttonColor:G,buttonTextColor:K}=s,Q=A&&A.length>0?A:f,X=V*2,[S,ne]=C.useState(X),[L,_]=C.useState(o||[]),te=(v==null?void 0:v.enabled)??!0;C.useEffect(()=>{_(o)},[o]);const Ce=async(d,B,U=null)=>{var de,le,xe,fe,pe,he,me,ue;if(B.preventDefault(),B.stopPropagation(),!w){window.location.href="/signin";return}if(!te){alert("Wishlist is currently disabled");return}const P=(le=(de=d==null?void 0:d.variants)==null?void 0:de.nodes)==null?void 0:le[0],g=(U==null?void 0:U.variantId)||(P==null?void 0:P.id),oe=(U==null?void 0:U.variantTitle)||(P==null?void 0:P.title)||"Default Title",ce=(U==null?void 0:U.selectedOptions)||(P==null?void 0:P.selectedOptions)||[],Ne=L.some(R=>{if(g)return R.variantId===g;const Y=R.id||R.shopifyGid||R.productId,re=d.id||d.productId||d.shopifyGid;return Y===re});let ee;if(Ne)ee=L.filter(R=>{if(g)return R.variantId!==g;const Y=R.id||R.shopifyGid||R.productId,re=d.id||d.productId||d.shopifyGid;return Y!==re});else{const R={id:d.id,shopifyGid:d.id,title:d.title,handle:d.handle,image:((xe=d.featuredImage)==null?void 0:xe.url)||"",price:((pe=(fe=d.priceRange)==null?void 0:fe.minVariantPrice)==null?void 0:pe.amount)||"0",variantId:g,variantTitle:oe,selectedOptions:ce};ee=[...L,R]}_(ee);try{const Y=await(await fetch("/api/wishlist",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({productId:d.id,productTitle:d.title,productHandle:d.handle,productImage:((he=d.featuredImage)==null?void 0:he.url)||"",productPrice:((ue=(me=d.priceRange)==null?void 0:me.minVariantPrice)==null?void 0:ue.amount)||"0",variantId:g,variantTitle:oe,selectedOptions:ce})})).json();Y.success?(_(Y.wishlist),window.dispatchEvent(new CustomEvent("wishlist-updated",{detail:Y.wishlist}))):_(L)}catch(R){console.error("Error toggling wishlist:",R),_(L)}},ae=async()=>{try{const B=await(await fetch("/api/wishlist",{credentials:"include"})).json();B.success&&B.items&&_(B.items)}catch(d){console.error("Error loading wishlist:",d)}};C.useEffect(()=>{const d=B=>{B.detail?_(B.detail):ae()};return window.addEventListener("wishlist-updated",d),()=>window.removeEventListener("wishlist-updated",d)},[]);const ye=d=>{var g,oe,ce,Ne,ee,de,le,xe,fe,pe,he,me,ue,R,Y,re,Be,Te,Me;let B=null;const U=(ce=(oe=(g=d==null?void 0:d.store)==null?void 0:g.variants)==null?void 0:oe[0])==null?void 0:ce._ref;U&&(U.includes("gid://shopify/")?B=U:B=`gid://shopify/ProductVariant/${U.split("-").pop()}`);let P=(Ne=d.store)==null?void 0:Ne.gid;if(!P&&d._id){const ke=d._id.match(/\d+$/);ke&&(P=`gid://shopify/Product/${ke[0]}`)}return{id:P||d._id||((ee=d.store)==null?void 0:ee.gid),shopifyGid:P,handle:((de=d.slug)==null?void 0:de.current)||d.slug,title:d.title||((le=d.store)==null?void 0:le.title)||"",department:d.department||"",priceRange:{minVariantPrice:{amount:((xe=d.price)==null?void 0:xe.toString())||((he=(pe=(fe=d.store)==null?void 0:fe.priceRange)==null?void 0:pe.minVariantPrice)==null?void 0:he.amount)||"0",currencyCode:a}},featuredImage:d.imageUrl?{url:d.imageUrl,altText:d.title}:null,compareAtPrice:d.compareAtPrice&&parseFloat(d.compareAtPrice)>0?{amount:d.compareAtPrice.toString(),currencyCode:a}:null,options:((me=d.store)==null?void 0:me.options)||[],variants:{nodes:[{id:B,title:((Y=(R=(ue=d.store)==null?void 0:ue.variants)==null?void 0:R[0])==null?void 0:Y.title)||"",selectedOptions:((Te=(Be=(re=d.store)==null?void 0:re.variants)==null?void 0:Be[0])==null?void 0:Te.selectedOptions)||[],quantityAvailable:10,availableForSale:((Me=d.store)==null?void 0:Me.status)==="active"}]}}},we=s.showQuickView??(e==null?void 0:e.showQuickView)??!0,ve={2:"lg:grid-cols-2",3:"lg:grid-cols-3",4:"lg:grid-cols-4",5:"lg:grid-cols-5"}[V]||"lg:grid-cols-5",je={0:"gap-0",4:"gap-4 md:gap-[25px]",8:"gap-y-12 md:gap-x-8 md:gap-y-16",12:"gap-y-16 md:gap-x-12 md:gap-y-20"}[q]||"gap-y-12 md:gap-x-8 md:gap-y-16";return r.jsxs("section",{className:`pg-section w-full max-w-[100%] px-[7%] mx-auto ${M} bg-white overflow-hidden relative`,children:[r.jsx("style",{children:j}),r.jsxs("div",{className:"mx-auto flex flex-col gap-y-[50px] items-center",children:[(p||b||H)&&r.jsxs("header",{className:"text-center mx-auto flex flex-col items-center justify-center gap-2",children:[b&&r.jsx("span",{className:"pg-subtitle block leading-[30px] text-[#737373] animate-in fade-in slide-in-from-bottom-2 duration-700",style:{letterSpacing:"0.2px"},children:b}),p&&r.jsx("h4",{className:"pg-title leading-[32px] font-bold uppercase text-[#252B42] tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-1000",style:{letterSpacing:"0.1px"},children:p}),H&&r.jsx("p",{className:"pg-description leading-[20px] text-[#737373] max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-1000",style:{letterSpacing:"0.2px"},children:H})]}),r.jsx("div",{className:`grid grid-cols-1 sm:grid-cols-2 ${ve} ${je}`,children:Q.slice(0,S).map((d,B)=>{const U=ye(d),P=B>=3?"hidden md:block":"block";return r.jsx("div",{className:`product-card-reveal opacity-0 w-full max-w-[280px] mx-auto md:max-w-none ${P}`,style:{animationDelay:`${B%X*100}ms`},children:r.jsx(Ye,{product:U,showQuickView:we,loading:B<5?"eager":"lazy",wishlist:L,onToggleWishlist:Ce,isWishlistEnabled:te,isLoggedIn:w,onQuickView:I,activeCountry:x,activeCurrency:a,onCartOpen:n})},d._id||B)})}),S<Q.length&&r.jsx("div",{className:"flex justify-center animate-in fade-in duration-1000",children:r.jsx(se,{to:`/${x}/collections/all`,className:"pg-load-more-btn inline-block px-10 py-[15px] border-2 font-bold transition-all duration-300 uppercase text-[14px] text-center tracking-[0.2px] leading-[22px]",children:O})})]}),r.jsx(Ue,{productHandle:E,config:y,isOpen:k,onClose:z,locale:F,isWishlistEnabled:te,isLoggedIn:w,wishlist:L,setWishlist:_,globalData:t||e}),r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .product-card-reveal {
          animation: revealUp 0.8s cubic-bezier(0.2, 0.6, 0.3, 1) forwards;
        }
      `}})]})}function Ye({product:s,showQuickView:e=!0,loading:t="lazy",wishlist:w,onToggleWishlist:v,isWishlistEnabled:a,isLoggedIn:x,onQuickView:o,activeCountry:n,activeCurrency:i,onCartOpen:c,textStyles:h}){var ae,ye,we,ve,je;const u=qe(),[m,l]=C.useState(!1),[j,y]=C.useState(!1),[E,N]=C.useState(!1),[k,T]=C.useState(null),{toggleWishlist:I,isInWishlist:z}=Pe(),F=s==null?void 0:s.featuredImage,f=(ae=s==null?void 0:s.priceRange)==null?void 0:ae.minVariantPrice,p=s==null?void 0:s.compareAtPrice,b=(we=(ye=s==null?void 0:s.variants)==null?void 0:ye.nodes)==null?void 0:we[0],H=b==null?void 0:b.id,A=b&&(!b.availableForSale||b.quantityAvailable<=0),V=f!=null&&f.amount?parseFloat(f.amount):0,M=(p!=null&&p.amount?parseFloat(p.amount):0)>V,O=(ve=s.options)==null?void 0:ve.find($=>["color","colour","title","size","material","denomination","denominations","amount"].includes($.name.toLowerCase())),G=(O==null?void 0:O.name.toLowerCase())||"",K=((je=O==null?void 0:O.values)==null?void 0:je.filter($=>$!=="Default Title"))||[],Q=$=>{const W=$.replace(/[^0-9.]/g,"");if(W!==""&&!isNaN(W))try{return new Intl.NumberFormat(void 0,{style:"currency",currency:i,minimumFractionDigits:0}).format(parseFloat(W))}catch{return $}return $},X={white:"#ffffff",black:"#000000",red:"#ef4444",blue:"#3b82f6",green:"#22c55e",orange:"#f97316",yellow:"#eab308",purple:"#a855f7",pink:"#ec4899",brown:"#92400e",gray:"#9ca3af",grey:"#9ca3af",silver:"#c0c0c0",gold:"#d4af37",beige:"#f5f0e8",ivory:"#fffff0",navy:"#1e3a8a",cobalt:"#0047ab",royal:"#4169e1",sky:"#87ceeb",skyblue:"#87ceeb",ocean:"#006994",teal:"#14b8a6",cyan:"#06b6d4",turquoise:"#40e0d0",aqua:"#00ffff",indigo:"#4f46e5",denim:"#1560bd",sapphire:"#0f52ba",slate:"#475569",steel:"#708090",powder:"#b0e0e6",powderblue:"#b0e0e6",periwinkle:"#ccccff",electric:"#7b2fff",ice:"#d6f4ff",dawn:"#f2e6d9",cloud:"#f0f4f8",fog:"#e8edf0",olive:"#808000",lime:"#84cc16",sage:"#87a878",mint:"#98ff98",forest:"#228b22",emerald:"#50c878",hunter:"#355e3b",moss:"#8a9a5b",crimson:"#dc143c",scarlet:"#ff2400",rose:"#ff007f",blush:"#de5d83",coral:"#ff6b6b",salmon:"#fa8072",magenta:"#ff00ff",fuchsia:"#ff0090",burgundy:"#800020",wine:"#722f37",maroon:"#800000",raspberry:"#e30b5d",tan:"#d2b48c",sand:"#c2b280",camel:"#c19a6b",taupe:"#483c32",khaki:"#c3b091",cream:"#fffdd0",nude:"#e8c9a0",mocha:"#967117",espresso:"#4e2e1e",chestnut:"#954535",rust:"#b7410e",terracotta:"#e27d60",lavender:"#e6e6fa",lilac:"#c8a2c8",violet:"#8b5cf6",mauve:"#e0b0ff",plum:"#8e4585",orchid:"#da70d6",wisteria:"#c9a0dc",amethyst:"#9966cc",amber:"#ffbf00",honey:"#ec9d00",mustard:"#e1ad01",lemon:"#fff44f",peach:"#ffcba4",apricot:"#fbceb1",offwhite:"#faf9f6",natural:"#f5f0e8",eggshell:"#fff8e7",bone:"#e3dac9",chalk:"#f5f5f0",snow:"#fffafa",pearl:"#f8f6f0",ash:"#b2beb5",smoke:"#738276",charcoal:"#36454f",onyx:"#353839",graphite:"#474a51",jet:"#343434"},S=$=>{if(!$)return!1;const W=$.toLowerCase().replace(/[\s_-]+/g,"");return W.startsWith("#")||W.startsWith("hsl")||W.startsWith("rgb")||X.hasOwnProperty(W)},ne=$=>{const W=$.toLowerCase().replace(/[\s_-]+/g,"");if($.startsWith("#")||$.startsWith("rgb"))return $;if(X[W])return X[W];let Z=0;for(let D=0;D<$.length;D++)Z=$.charCodeAt(D)+((Z<<5)-Z);return`hsl(${Math.abs(Z)%360}, 60%, 55%)`},L=z(s.id,H);C.useEffect(()=>{u.state==="idle"&&m&&(l(!1),c&&c("cart"))},[u.state,m]);const _=$=>{$.preventDefault(),$.stopPropagation(),!(!H||A)&&(l(!0),u.submit({[Ee.INPUT_NAME]:JSON.stringify({action:Ee.ACTIONS.LinesAdd,inputs:{lines:[{merchandiseId:H,quantity:1}]}})},{method:"POST",action:"/cart"}))},te=$=>{$.preventDefault(),$.stopPropagation(),o(s.handle,$)},Ce=async $=>{if($.preventDefault(),$.stopPropagation(),!x){window.location.href="/signin";return}await I({productId:s.id,productTitle:s.title,productHandle:s.handle,productImage:(F==null?void 0:F.url)||"",productPrice:(f==null?void 0:f.amount)||"0",variantId:H||null,variantTitle:(b==null?void 0:b.title)||null,selectedOptions:(b==null?void 0:b.selectedOptions)||[]})};return s?r.jsx("div",{className:"h-full bg-white rounded hover:shadow-lg transition-all duration-300 overflow-hidden group border border-transparent hover:border-gray-100 h-auto flex flex-col",onMouseEnter:()=>N(!0),onMouseLeave:()=>N(!1),children:r.jsxs(se,{to:n?`/${n}/products/${s.handle}`:`/products/${s.handle}`,className:"flex flex-col h-auto",prefetch:"intent",children:[r.jsxs("div",{className:"relative overflow-hidden bg-gray-50 flex items-center justify-center w-full aspect-[1/1]",children:[F?r.jsx(ie,{data:F,alt:F.altText||s.title,loading:t,sizes:"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px",className:`absolute inset-0 w-full h-full mix-blend-multiply object-contain transition-transform duration-700 ${E?"scale-110":"scale-100"} blur-0`,onLoad:$=>{y(!0)}}):r.jsx("div",{className:"w-full h-full bg-gray-100 flex items-center justify-center text-gray-400",children:"No Image"}),r.jsxs("div",{className:`absolute inset-0 bg-black/40 flex items-end justify-center pb-6 gap-3 transition-all duration-300 md:opacity-0 ${E?"md:opacity-100":"md:opacity-0"}`,children:[a&&r.jsx("button",{onClick:Ce,onMouseEnter:()=>T("wishlist"),onMouseLeave:()=>T(null),className:`bg-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${L?"text-red-500":"text-black"} hover:bg-black`,"aria-label":"Wishlist",children:r.jsx(Je,{filled:L,hovered:k==="wishlist"})}),r.jsx("button",{onClick:_,onMouseEnter:()=>T("cart"),onMouseLeave:()=>T(null),disabled:m||A||!H,className:`bg-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black ${m||A||!H?"opacity-50 cursor-not-allowed":""}`,children:m?r.jsxs("svg",{className:"w-5 h-5 animate-spin",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:[r.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),r.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}):r.jsx(Ke,{hovered:k==="cart"})}),e&&r.jsx("button",{onClick:te,onMouseEnter:()=>T("quick"),onMouseLeave:()=>T(null),className:"bg-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:bg-black",children:r.jsx(Xe,{hovered:k==="quick"})})]})]}),r.jsxs("div",{className:"pt-[25px] px-[25px] pb-[25px] flex flex-col items-center text-center bg-white flex-grow gap-[10px]",children:[r.jsx("h4",{className:"pg-product-title font-bold text-[#252B42] leading-[20px] md:leading-[24px] tracking-[0.1px] w-full",children:s.title}),s.department&&r.jsx("span",{className:"pg-product-title font-bold text-[#737373] text-[10px] md:text-[14px] leading-[20px] md:leading-[24px] tracking-[0.2px] mb-2 md:mb-3 truncate w-full",children:s.department}),r.jsxs("div",{className:"flex items-center gap-2 justify-center pg-align",children:[M&&r.jsx("span",{className:"text-[#BDBDBD] font-bold text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] tracking-[0.1px]",children:r.jsx(Ie,{data:{amount:p.amount,currencyCode:i}})}),r.jsx("span",{className:"text-[#23856D] font-bold text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] tracking-[0.1px]",children:f?r.jsx(Ie,{data:{amount:f.amount,currencyCode:i}}):"Price not available"})]}),K.length>0&&r.jsx("div",{className:"flex flex-wrap justify-center gap-1.5 pg-align",children:K.slice(0,5).map(($,W)=>{const Z=S($);if(G.includes("color")||G.includes("colour")||Z)return r.jsx("div",{className:"w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border border-gray-200 shadow-sm",style:{backgroundColor:ne($)},title:$},W);{const $e=G.includes("denomination")||G.includes("amount")?Q($):$;return r.jsx("span",{className:"px-2 py-0.5 text-[10px] md:text-[11px] bg-[#F3F4F6] text-[#737373] rounded-md font-bold border border-gray-100",children:$e},W)}})})]})]})}):null}const Je=({filled:s,hovered:e})=>r.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:r.jsx("path",{d:"M14.031 2.8125H14.032C14.6118 2.81271 15.1858 2.92807 15.7205 3.15234C16.2552 3.37666 16.7398 3.70554 17.1462 4.11914C17.9751 4.96296 18.4392 6.09841 18.4392 7.28125C18.4392 8.46409 17.9751 9.59954 17.1462 10.4434L9.99976 17.6797L2.85425 10.4434C2.0255 9.59956 1.56128 8.46398 1.56128 7.28125C1.56128 6.09852 2.0255 4.96294 2.85425 4.11914C3.26082 3.70576 3.74625 3.37743 4.28101 3.15332C4.81567 2.9293 5.38978 2.81348 5.96948 2.81348C6.54921 2.81351 7.12329 2.92925 7.65796 3.15332C8.19262 3.37741 8.67722 3.70584 9.08374 4.11914L9.08472 4.12012L9.77808 4.82031L10.0007 5.04395L10.2224 4.82031L10.9158 4.12012L10.9177 4.11914C11.3237 3.70511 11.8078 3.37568 12.3425 3.15137C12.8771 2.92711 13.4513 2.81207 14.031 2.8125Z",fill:s?"#EF4444":"transparent",stroke:s?"#EF4444":e?"#ffffff":"#252B42",strokeWidth:"1.5"})}),Ke=({hovered:s})=>r.jsx("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:s?"#ffffff":"#252B42",xmlns:"http://www.w3.org/2000/svg",children:r.jsx("path",{d:"M0 1.63333C0 1.46536 0.0667281 1.30427 0.185505 1.1855C0.304281 1.06673 0.465377 1 0.633353 1H2.53341C2.67469 1.00004 2.8119 1.04731 2.92322 1.1343C3.03454 1.22129 3.11357 1.34299 3.14776 1.48007L3.66078 3.53333H18.3672C18.4602 3.53342 18.5521 3.55398 18.6362 3.59356C18.7204 3.63315 18.7948 3.69077 18.8541 3.76235C18.9135 3.83393 18.9564 3.9177 18.9797 4.00772C19.0031 4.09774 19.0063 4.19179 18.9892 4.2832L17.0891 14.4165C17.062 14.5617 16.9849 14.6927 16.8714 14.7871C16.7578 14.8815 16.6148 14.9332 16.4672 14.9333H5.06682C4.91917 14.9332 4.7762 14.8815 4.66263 14.7871C4.54906 14.6927 4.47204 14.5617 4.44487 14.4165L2.54608 4.3022L2.0394 2.26667H0.633353C0.465377 2.26667 0.304281 2.19994 0.185505 2.08117C0.0667281 1.96239 0 1.8013 0 1.63333ZM3.92932 4.8L5.59251 13.6667H15.9415L17.6047 4.8H3.92932ZM6.33353 14.9333C5.66163 14.9333 5.01724 15.2002 4.54214 15.6753C4.06703 16.1504 3.80012 16.7948 3.80012 17.4667C3.80012 18.1385 4.06703 18.7829 4.54214 19.258C5.01724 19.7331 5.66163 20 6.33353 20C7.00543 20 7.64981 19.7331 8.12492 19.258C8.60003 18.7829 8.86694 18.1385 8.86694 17.4667C8.86694 16.7948 8.60003 16.1504 8.12492 15.6753C7.64981 15.2002 7.00543 14.9333 6.33353 14.9333ZM15.2005 14.9333C14.5286 14.9333 13.8842 15.2002 13.4091 15.6753C12.934 16.1504 12.6671 16.7948 12.6671 17.4667C12.6671 18.1385 12.934 18.7829 13.4091 19.258C13.8842 19.7331 14.5286 20 15.2005 20C15.8724 20 16.5168 19.7331 16.9919 19.258C17.467 18.7829 17.7339 18.1385 17.7339 17.4667C17.7339 16.7948 17.467 16.1504 16.9919 15.6753C16.5168 15.2002 15.8724 14.9333 15.2005 14.9333ZM6.33353 16.2C6.66948 16.2 6.99167 16.3335 7.22922 16.571C7.46678 16.8085 7.60023 17.1307 7.60023 17.4667C7.60023 17.8026 7.46678 18.1248 7.22922 18.3623C6.99167 18.5999 6.66948 18.7333 6.33353 18.7333C5.99758 18.7333 5.67539 18.5999 5.43783 18.3623C5.20028 18.1248 5.06682 17.8026 5.06682 17.4667C5.06682 17.1307 5.20028 16.8085 5.43783 16.571C5.67539 16.3335 5.99758 16.2 6.33353 16.2ZM15.2005 16.2C15.5364 16.2 15.8586 16.3335 16.0962 16.571C16.3337 16.8085 16.4672 17.1307 16.4672 17.4667C16.4672 17.8026 16.3337 18.1248 16.0962 18.3623C15.8586 18.5999 15.5364 18.7333 15.2005 18.7333C14.8645 18.7333 14.5423 18.5999 14.3048 18.3623C14.0672 18.1248 13.9338 17.8026 13.9338 17.4667C13.9338 17.1307 14.0672 16.8085 14.3048 16.571C14.5423 16.3335 14.8645 16.2 15.2005 16.2Z"})}),Xe=({hovered:s})=>r.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[r.jsx("path",{d:"M12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 10 12.5C9.33696 12.5 8.70107 12.2366 8.23223 11.7678C7.76339 11.2989 7.5 10.663 7.5 10C7.5 9.33696 7.76339 8.70107 8.23223 8.23223C8.70107 7.76339 9.33696 7.5 10 7.5C10.663 7.5 11.2989 7.76339 11.7678 8.23223C12.2366 8.70107 12.5 9.33696 12.5 10Z",fill:"black"}),r.jsx("path",{d:"M2 10C2 10 5 4.5 10 4.5C15 4.5 18 10 18 10C18 10 15 15.5 10 15.5C5 15.5 2 10 2 10ZM10 13.5C10.9283 13.5 11.8185 13.1313 12.4749 12.4749C13.1313 11.8185 13.5 10.9283 13.5 10C13.5 9.07174 13.1313 8.1815 12.4749 7.52513C11.8185 6.86875 10.9283 6.5 10 6.5C9.07174 6.5 8.1815 6.86875 7.52513 7.52513C6.86875 8.1815 6.5 9.07174 6.5 10C6.5 10.9283 6.86875 11.8185 7.52513 12.4749C8.1815 13.1313 9.07174 13.5 10 13.5Z",fill:s?"#ffffff":"black"})]});function ge({module:s}){const e=C.useRef(null),[t,w]=C.useState(!1);if(C.useEffect(()=>{const j=setTimeout(()=>w(!0),50);return()=>clearTimeout(j)},[]),!s)return null;const{title:v="Collections",subtitle:a,slidesPerView:x=3,aspectRatio:o="aspect-[4/5]",resolvedCollections:n=[],textAlign:i="left",backgroundColor:c="#FFFFFF",textColor:h="#000000"}=s,u=j=>{if(!e.current)return;const y=e.current.offsetWidth*.8;e.current.scrollBy({left:j==="next"?y:-y,behavior:"smooth"})},m={2:"md:w-1/2",3:"md:w-1/3",4:"md:w-1/4",5:"md:w-1/5"}[x]||"md:w-1/3",l=i==="center";return r.jsxs("section",{className:"py-20 md:py-32",style:{backgroundColor:c,color:h},children:[r.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .hide-res-scrollbar::-webkit-scrollbar { display: none !important; }
        .hide-res-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}}),r.jsxs("div",{className:"max-w-[1440px] mx-auto px-6 md:px-12",children:[r.jsxs("div",{className:`flex flex-col ${l?"items-center text-center":"md:flex-row md:items-end md:justify-between"} mb-16 gap-8`,children:[r.jsxs("div",{className:`space-y-3 ${l?"w-full":""}`,children:[a&&r.jsx("span",{className:"block text-[11px] tracking-[0.4em] uppercase font-bold opacity-60",children:a}),r.jsx("h2",{className:"text-4xl md:text-5xl font-serif capitalize leading-tight",children:v})]}),r.jsxs("div",{className:`flex gap-4 ${l?"justify-center":""}`,children:[r.jsx("button",{onClick:()=>u("prev"),className:"group p-4 border rounded-full transition-all hover:bg-white/10",style:{borderColor:h},children:r.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"transition-transform group-active:scale-90",children:r.jsx("path",{d:"M15 19l-7-7 7-7"})})}),r.jsx("button",{onClick:()=>u("next"),className:"group p-4 border rounded-full transition-all hover:bg-white/10",style:{borderColor:h},children:r.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"transition-transform group-active:scale-90",children:r.jsx("path",{d:"M9 5l7 7-7 7"})})})]})]}),r.jsx("div",{ref:e,className:"hide-res-scrollbar flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8",children:n.map(j=>r.jsxs(se,{to:`/collections/${j.handle}`,className:`w-[85%] ${m} flex-shrink-0 snap-start group no-underline`,children:[r.jsx("div",{className:`relative w-full ${o} overflow-hidden bg-black/5 mb-6`,children:j.imageUrl?r.jsx(ie,{src:j.imageUrl,alt:j.title,className:`"absolute inset-0 w-full h-full object-cover filter  transition-all duration-500 transition-transform duration-[1.2s] ease-in-out group-hover:scale-105" ${t?"blur-0":"blur-xl"}`,loading:"lazy",sizes:`(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         400px`,onLoad:y=>y.currentTarget.style.filter="blur(0)"}):r.jsx("div",{className:"absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest opacity-20",children:"No Image"})}),r.jsx("h3",{className:`text-[14px] font-medium uppercase tracking-[0.2em] transition-opacity group-hover:opacity-70 ${l?"text-center":"text-left"}`,style:{color:h},children:j.title})]},j._id))})]})]})}function Se({module:s}){if(!s)return null;const{title:e="Join our newsletter",subtitle:t,buttonText:w="Subscribe",placeholder:v="your@email.com",backgroundColor:a="#FFFFFF",textColor:x="#000000",buttonBgColor:o="#000000",buttonTextColor:n="#FFFFFF",layout:i="stacked",maxWidth:c="max-w-4xl",inputRadius:h="md"}=s;console.log("module Newsletter",s);const[u,m]=C.useState(""),[l,j]=C.useState("idle"),y={none:"rounded-none",md:"rounded-lg",lg:"rounded-2xl",full:"rounded-full"},E=async k=>{k.preventDefault(),j("loading"),setTimeout(()=>{j("success"),m("")},1500)},N=i==="split";return r.jsx("section",{className:"py-20 px-6",style:{backgroundColor:a},children:r.jsx("div",{className:`mx-auto ${c}`,children:r.jsxs("div",{className:`flex flex-col ${N?"lg:flex-row lg:items-center lg:justify-between":"items-center text-center"} gap-10 md:gap-16`,children:[r.jsxs("div",{className:`${N?"lg:max-w-md":"max-w-2xl"} space-y-4`,children:[e&&r.jsx("h2",{className:"text-4xl md:text-5xl font-serif tracking-tight",style:{color:x},children:e}),t&&r.jsx("p",{className:"text-lg opacity-80 leading-relaxed",style:{color:x},children:t})]}),r.jsxs("div",{className:`w-full ${N?"lg:max-w-md":"max-w-xl"}`,children:[l==="success"?r.jsxs("div",{className:`p-6 text-center animate-in fade-in zoom-in duration-500 ${y[h]}`,style:{backgroundColor:`${o}10`,color:x},children:[r.jsx("p",{className:"font-medium text-lg",children:"Thank you for joining! ✨"}),r.jsx("p",{className:"text-sm opacity-70 mt-1",children:"Check your inbox for a confirmation."})]}):r.jsxs("form",{onSubmit:E,className:"flex flex-col sm:flex-row gap-3",children:[r.jsx("div",{className:"relative flex-grow",children:r.jsx("input",{type:"email",required:!0,placeholder:v,value:u,onChange:k=>m(k.target.value),disabled:l==="loading",className:`w-full px-6 py-4 bg-transparent border transition-all outline-none focus:ring-2 focus:ring-offset-2 ${y[h]}`,style:{borderColor:`${x}30`,color:x,"--tw-ring-color":o}})}),r.jsx("button",{type:"submit",disabled:l==="loading",className:`px-8 py-4 font-bold uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${y[h]}`,style:{backgroundColor:o,color:n},children:l==="loading"?r.jsxs("span",{className:"flex items-center gap-2",children:[r.jsxs("svg",{className:"animate-spin h-4 w-4",viewBox:"0 0 24 24",children:[r.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4",fill:"none"}),r.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Sending"]}):w})]}),r.jsx("p",{className:"mt-4 text-[10px] uppercase tracking-widest opacity-40 text-center lg:text-left",children:"Unsubscribe at any time."})]})]})})})}function De({module:s}){if(!s)return null;const[e,t]=C.useState(!1);C.useEffect(()=>{const f=setTimeout(()=>t(!0),10);return()=>clearTimeout(f)},[]);const{slides:w,fullWidth:v=!0,height:a=650,autoplay:x=5e3,overlayOpacity:o=30,styling:n={},ctaText:i,ctaLink:c,ctaPosition:h={horizontal:"center",vertical:"center"},showArrows:u=!0}=s||{},m=Array.isArray(w)?w:[],[l,j]=C.useState(0),y=n.textColor||"#ffffff",E=n.buttonBg||"#ffffff",N=n.buttonText||"#000000",k=C.useCallback(()=>{j(f=>(f+1)%(m==null?void 0:m.length))},[m.length]),T=()=>{j(f=>(f-1+(m==null?void 0:m.length))%m.length)};C.useEffect(()=>{var p;if(!x||x<=0||m.length<=1||((p=m[l])==null?void 0:p.type)==="video")return;const f=setInterval(k,x);return()=>clearInterval(f)},[x,k,m,l]);const I=(()=>{var p;const f=c==null?void 0:c[0];return f?f._type==="linkExternal"?f.url||"#":(p=f.reference)!=null&&p.slug?`/${f.reference._type==="product"?"products":"collections"}/${f.reference.slug}`:"#":"#"})(),z={left:"items-start text-left pl-10 md:pl-24",center:"items-center text-center",right:"items-end text-right pr-10 md:pr-24"},F={top:"justify-start pt-24",center:"justify-center",bottom:"justify-end pb-24"};return r.jsxs("section",{className:`relative group overflow-hidden ${v?"w-full":"max-w-[1400px] mx-auto my-10 rounded-3xl"}`,style:{height:`${a}px`,backgroundColor:n.backgroundColor||"#000"},children:[m.map((f,p)=>r.jsxs("div",{className:`absolute inset-0 transition-opacity duration-1000 ease-in-out ${p===l?"opacity-100 z-10":"opacity-0 z-0"}`,children:[r.jsx("div",{className:"absolute inset-0 w-full h-full transform scale-105 group-hover:scale-100 transition-transform duration-[6000ms] ease-out",children:f.type==="video"&&f.videoUrl?r.jsx("video",{src:f.videoUrl,autoPlay:!0,muted:!0,loop:!0,playsInline:!0,className:"w-full h-full object-cover"}):r.jsx(ie,{src:f.imageUrl,alt:f.heading||"Slide",className:`"w-full h-full object-cover filter  transition-all duration-500" ${e?"blur-0":"blur-xl"}`,loading:"lazy",sizes:`(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         400px`,onLoad:b=>b.currentTarget.style.filter="blur(0)"})}),r.jsx("div",{className:"absolute inset-0 bg-black transition-opacity duration-700",style:{opacity:o/100}}),r.jsx("div",{className:`absolute inset-0 z-20 flex flex-col p-10 ${z[h.horizontal]} ${F[h.vertical]}`,children:r.jsxs("div",{className:`max-w-3xl transition-all duration-1000 transform ${p===l?"translate-y-0 opacity-100":"translate-y-10 opacity-0"}`,children:[f.subheading&&r.jsx("p",{className:"uppercase tracking-[0.4em] text-xs md:text-sm mb-5 font-medium",style:{color:y},children:f.subheading}),f.heading&&r.jsx("h2",{className:"text-4xl md:text-7xl font-serif leading-[1.1] mb-10",style:{color:y},children:f.heading}),i&&r.jsx("a",{href:I,className:"inline-block px-12 py-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl",style:{backgroundColor:E,color:N},children:i})]})})]},p)),u&&m.length>1&&r.jsxs("div",{className:"absolute inset-0 z-40 pointer-events-none flex items-center justify-between px-6",children:[r.jsx("button",{onClick:T,className:"pointer-events-auto w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 translate-x-[-20px] group-hover:translate-x-0",children:r.jsx("span",{className:"text-2xl ml-[-2px]",children:"‹"})}),r.jsx("button",{onClick:k,className:"pointer-events-auto w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 translate-x-[20px] group-hover:translate-x-0",children:r.jsx("span",{className:"text-2xl mr-[-2px]",children:"›"})})]}),m.length>1&&r.jsx("div",{className:"absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-40",children:m.map((f,p)=>r.jsx("button",{onClick:()=>j(p),className:"group py-4",children:r.jsx("div",{className:`h-[2px] transition-all duration-500 ${p===l?"w-12 bg-white":"w-6 bg-white/30"}`})},p))})]})}function er({module:s,globalSettingsData:e,activeCountry:t}){var M,O,G,K,Q,X,S,ne;if(!s||s.enabled===!1)return null;const[w,v]=C.useState(!1),[a,x]=C.useState(null);C.useEffect(()=>{v(!0)},[]);const{title:o="FAQ",description:n,items:i=[],layoutType:c="grid",backgroundColor:h,itemBgColor:u,questionColor:m,answerColor:l,accentColor:j,maxWidth:y="max-w-3xl",itemPadding:E="normal",questionSize:N="16",answerSize:k="14",cardRadius:T="md",titleAlign:I="center",_key:z="faq-section"}=s,F=L=>L?L.startsWith("#")?L:`#${L}`:null,f=(e==null?void 0:e.fontFamily)||"Montserrat, sans-serif",p={sectionBg:F(h)||"#252B42",itemBg:F(u)||"transparent",question:F(m)||F((M=e==null?void 0:e.colors)==null?void 0:M.heading)||"#FFFFFF",answer:F(l)||F((O=e==null?void 0:e.colors)==null?void 0:O.text)||"#BDBDBD",accent:F(j)||"#23A6F0"},b={none:"0px",md:"8px",lg:"16px",full:"9999px"},H={compact:"py-3 px-5 mb-3",normal:"py-5 px-6 mb-4",spacious:"py-8 px-10 mb-6"},A=`
    .faq-${z} { font-family: ${f}; background-color: ${p.sectionBg}; }
    .faq-${z} .faq-question-text { color: ${p.question}; }
    .faq-${z} .faq-answer-text { color: ${p.answer}; }
    .faq-${z} .faq-icon { color: ${p.accent}; }

     .faq-${z} .faq-question-text-size{
     font-family: ${f};
      font-size: ${N||((G=e==null?void 0:e.headingSizes)!=null&&G.h5?(K=e==null?void 0:e.headingSizes)==null?void 0:K.h5:"16")}px;
      font-weight: 700;
      leading-trim: NONE;
      line-height: 24px;
      letter-spacing: 0.1px;

     }

     .faq-${z} .faq-answer-text-size{
     font-family: ${f};
      font-size: ${k||(e!=null&&e.baseFontSize?e==null?void 0:e.baseFontSize:"14")}px;
      font-weight: 400;
      leading-trim: NONE;
      line-height: 20px;
      letter-spacing: 0.2px;

     }

     .faq-${z} .section-header {
      font-family: ${f};
      font-size: ${(Q=e==null?void 0:e.headingSizes)!=null&&Q.h2?(X=e==null?void 0:e.headingSizes)==null?void 0:X.h2:"40"}px;
      font-weight: 700;
      leading-trim: NONE;
      line-height: 50px;
      letter-spacing: 0.2px;
     }

     .faq-${z} .section-description {
      font-family: ${f};
      font-size: ${(S=e==null?void 0:e.headingSizes)!=null&&S.h4?(ne=e==null?void 0:e.headingSizes)==null?void 0:ne.h4:"20"}px;
      font-weight: 400;
      leading-trim: NONE;
      line-height: 30px;
      letter-spacing: 0.2px;

     }
    
    /* ACCORDION SPECIFIC BORDER & RADIUS */
    .faq-${z} .accordion-item { 
       background-color: ${p.itemBg}; 
       border-radius: ${b[T]};
       border: 1px solid ${p.answer}33; /* Uses answer color with ~20% opacity for a subtle border */
       transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    .faq-${z} .accordion-item:hover {
       border-color: ${p.accent}88; /* Highlight border on hover */
    }

    @media (max-width: 768px) {
     .faq-${z} .section-header {
     font-size:32px;
      }
     .faq-${z} .section-description{
     font-size:16pxpx;
     }
    }

  `,V=Array(6).fill({question:"the quick fox jumps over the lazy dog",answer:"Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."}),q=(i==null?void 0:i.length)>0?i:V;return r.jsxs("section",{className:`w-full faq-${z} py-[80px] px-[7%]`,children:[r.jsx("style",{dangerouslySetInnerHTML:{__html:A}}),r.jsxs("div",{className:"mx-auto max-w-[1550px] w-full",children:[r.jsxs("header",{className:`mb-[50px] md:mb-[50px] flex flex-col gap-[10px] ${I==="center"?"items-center text-center":I==="right"?"items-end text-right":"items-start text-left"}`,children:[r.jsx("h2",{className:"section-header faq-question-text uppercase",children:o}),n&&r.jsx("h4",{className:"section-description faq-answer-text opacity-80 ",children:n})]}),c==="grid"?r.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-x-[30px] lg:gap-x-[50px] gap-y-[30px] md:gap-y-[30px] w-full",children:q.map((L,_)=>r.jsxs("div",{className:"flex items-start gap-5 w-full",children:[r.jsx("div",{className:"shrink-0 mt-1.5 faq-icon",children:r.jsx("svg",{className:"w-[9px] h-[16px]",fill:"none",viewBox:"9 5 7 14",stroke:"currentColor",strokeWidth:1.5,children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 5l7 7-7 7"})})}),r.jsxs("div",{className:"flex flex-col gap-3",children:[r.jsx("h5",{className:"faq-question-text-size faq-question-text ",children:L.question}),r.jsx("p",{className:"faq-answer-text-size faq-answer-text opacity-90",children:L.answer})]})]},_))}):r.jsx("div",{className:`mx-auto w-full ${y}`,children:q.map((L,_)=>r.jsxs("div",{className:`accordion-item overflow-hidden ${H[E]}`,children:[r.jsxs("button",{onClick:()=>x(a===_?null:_),className:"w-full flex items-center justify-between text-left transition-opacity hover:opacity-80",children:[r.jsx("span",{className:"faq-question-text-size faq-question-text pr-4",children:L.question}),r.jsx("span",{className:`faq-icon shrink-0 transition-transform duration-300 ${a===_?"rotate-90":""}`,children:r.jsx("svg",{className:"w-5 h-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:3,children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 5l7 7-7 7"})})})]}),r.jsx("div",{className:`transition-all duration-300 ease-in-out overflow-hidden ${a===_?"max-h-[1000px] mt-4 opacity-100":"max-h-0 opacity-0"}`,children:r.jsx("p",{className:"faq-answer-text faq-answer-text-size pb-2",children:L.answer})})]},_))}),r.jsx("div",{className:"mt-[30px] md:mt-[50px] text-center font-medium faq-question-text",children:r.jsxs("p",{className:"text-base md:text-lg",children:["Haven't got your answer?"," ",r.jsx("a",{href:"/contact",className:"hover:opacity-80 transition-opacity",style:{color:"#2DC071",fontWeight:"bold"},children:"Contact our support"})]})})]})]})}function rr({module:s,globalSettingsData:e}){var k,T,I,z,F,f;if(!s)return null;const[t,w]=C.useState(!1);C.useEffect(()=>{w(!0)},[]);const{subtitle:v="Services",heading:a="THE BEST SERVICES",description:x="Problems trying to resolve the conflict between",features:o=[],theme:n={},_key:i="services-grid"}=s,c=p=>p?p.startsWith("#")?p:`#${p}`:null,h=(e==null?void 0:e.fontFamily)||"Montserrat, sans-serif",u=c(n==null?void 0:n.bg)||"#ffffff",m={subtitle:c((k=e==null?void 0:e.colors)==null?void 0:k.secondary)||"#737373",heading:c((T=e==null?void 0:e.colors)==null?void 0:T.heading)||"#252B42",body:c((I=e==null?void 0:e.colors)==null?void 0:I.text)||"#737373"},l={subtitle:(z=e==null?void 0:e.headingSizes)!=null&&z.h5?`${e.headingSizes.h4}px`:"20px",heading:(F=e==null?void 0:e.headingSizes)!=null&&F.h3?`${e.headingSizes.h3}px`:"40px",featureTitle:(f=e==null?void 0:e.headingSizes)!=null&&f.h4?`${e.headingSizes.h4}px`:"24px",body:e!=null&&e.baseFontSize?`${e.baseFontSize}px`:"14px"},j=`
    .services-${i} { 
      font-family: ${h}; 
      background-color: ${u};
    }
    
    /* Subtitle scaling */
    .services-${i} .section-subtitle { 
      color: ${m.subtitle}; 
      font-size: 14px; /* Mobile base */
    }
    @media (min-width: 768px) {
      .services-${i} .section-subtitle { font-size: ${l.subtitle};
      font-family: ${h}; 
      font-weight: 400;
      leading-trim: NONE;
      line-height: 30px;
      letter-spacing: 0.2px;
      }
    }

    /* Main Heading scaling */
    .services-${i} .section-heading { 
      color: ${m.heading}; 
      font-size: 24px; /* Mobile base */
    }
    @media (min-width: 768px) {
      .services-${i} .section-heading { font-size: ${l.heading}; 
      font-family: ${h}; 
      font-weight: 700;
      leading-trim: NONE;
      line-height: 32px;
      letter-spacing: 0.1px;

      }
    }

    /* Feature Title scaling */
    .services-${i} .feature-title { 
      color: ${m.heading}; 
      font-size: 18px; /* Mobile base */
      font-family: ${h}; 
    }
    @media (min-width: 768px) {
      .services-${i} .feature-title { font-size: ${l.featureTitle}; 
      font-family: ${h}; 
      font-weight: 700;
      leading-trim: NONE;
      line-height: 32px;
      letter-spacing: 0.1px;

      }
    }

    /* Body text scaling */
    .services-${i} .body-text { 
      color: ${m.body}; 
      font-size: 13px; /* Mobile base */
      font-family: ${h}; 
    }
    @media (min-width: 768px) {
      .services-${i} .body-text { font-size: ${l.body}; 
      font-family: ${h}; 
      font-weight: 400;
      leading-trim: NONE;
      line-height: 20px;
      letter-spacing: 0.2px;
      }
    }
  `,y=[{title:"Feature 1",description:"Description of feature 1"},{title:"Feature 2",description:"Description of feature 2"},{title:"Feature 3",description:"Description of feature 3"}],E=(o==null?void 0:o.length)>0?o:y,N={none:"py-0",small:"py-8 md:py-16",medium:"py-12 md:py-20",large:"py-20 md:py-24"};return r.jsxs("section",{className:`w-full services-${i} ${N[(n==null?void 0:n.padding)||"medium"]}`,children:[r.jsx("style",{dangerouslySetInnerHTML:{__html:j}}),r.jsxs("div",{className:"max-w-[1640px] mx-auto px-[7%]",children:[r.jsxs("header",{className:"text-center max-w-3xl mx-auto mb-[25px] md:flex flex-col gap-2 md:gap-[10px]",children:[v&&r.jsx("span",{className:"block section-subtitle ",children:v}),a&&r.jsx("h3",{className:" section-heading ",children:a}),x&&r.jsx("p",{className:"mt-2 body-text  max-w-xl mx-auto px-4 md:px-0",children:x})]}),r.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-y-16 md:gap-x-8 lg:gap-x-16",children:E.map((p,b)=>{var A,V;const H=(p==null?void 0:p.iconUrl)||((V=(A=p==null?void 0:p.icon)==null?void 0:A.asset)==null?void 0:V.url);return r.jsxs("div",{className:"flex flex-col items-center text-center px-2",children:[r.jsx("div",{className:"mb-2 md:mb-[15px] h-16 md:h-20 flex items-center justify-center",children:H?r.jsx(ie,{src:H,alt:(p==null?void 0:p.title)||"Service Icon",width:72,height:72,className:"w-[60px] h-[60px] md:w-[72px] md:h-[72px] object-contain transition-transform duration-300 hover:scale-110"}):r.jsxs("svg",{width:"60",height:"60",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:"text-[#23A6F0] md:w-[72px] md:h-[72px]",children:[r.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),r.jsx("path",{d:"M9 3v18M3 9h18"})]})}),r.jsx("h3",{className:"mb-2 md:mb-[15px] feature-title ",children:(p==null?void 0:p.title)||"Service Name"}),r.jsx("p",{className:"body-text max-w-[280px] md:max-w-xs mx-auto opacity-90",children:(p==null?void 0:p.description)||"Service description goes here."})]},`${i}-feat-${b}`)})})]})]})}const sr="/assets/clock-Mv9tmsyK.svg",ir="/assets/comments-BIw99FIB.svg";function nr({module:s,globalSettingsData:e}){var y,E,N,k,T,I,z,F;const t=qe(),[w,v]=C.useState(!1);if(C.useEffect(()=>{v(!0),s!=null&&s.enabled&&(t.data||t.state==="idle"&&t.load(`/api/latest-blogs?limit=${s.limit||3}`))},[s==null?void 0:s.enabled,s==null?void 0:s.limit]),!(s!=null&&s.enabled))return null;const{title:a="Latest for you",subtitle:x="Blog",description:o,padding:n="py-24",_key:i="featured-blogs"}=s,c=f=>f?f.startsWith("#")?f:`#${f}`:null,h=(e==null?void 0:e.fontFamily)||"Montserrat, sans-serif",u={subtitle:c((y=e==null?void 0:e.colors)==null?void 0:y.secondary)||"#737373",heading:c((E=e==null?void 0:e.colors)==null?void 0:E.heading)||"#252B42",body:c((N=e==null?void 0:e.colors)==null?void 0:N.text)||"#737373",cardBg:"#ffffff"},m={subtitle:(k=e==null?void 0:e.headingSizes)!=null&&k.h4?`${e.headingSizes.h4}px`:"20px",heading:(T=e==null?void 0:e.headingSizes)!=null&&T.h3?`${e.headingSizes.h3}px`:"40px",cardTitle:(I=e==null?void 0:e.headingSizes)!=null&&I.h4?`${e.headingSizes.h4}px`:"20px",body:e!=null&&e.baseFontSize?`${e.baseFontSize}px`:"14px",h6Font:(z=e==null?void 0:e.headingSizes)!=null&&z.h6?`${e.headingSizes.h6}px`:"14px"},l=`
    .blog-sec-${i} { 
      font-family: ${h}; 
    }
    .blog-sec-${i} .sec-subtitle { 
     font-family: ${h}; 
      color: ${u.subtitle}; 
      font-size : ${m.subtitle};
      font-weight: 400;
      leading-trim: NONE;
      line-height: 30px;
      letter-spacing: 0.2px;

    }
    .blog-sec-${i} .sec-heading { 
     font-family: ${h}; 
      color: ${u.heading}; 
      font-size : ${m.heading};
      font-weight: 700;
      leading-trim: NONE;
      line-height: 32px;
      letter-spacing: 0.1px;
    }
    .blog-sec-${i} .sec-description { 
     font-family: ${h}; 
      color: ${u.body}; 
      font-family: ${h};
      font-size: ${m.body};
      font-weight: 400;
      leading-trim: NONE;
      line-height: 20px;
      letter-spacing: 0.2px;

    }
    .blog-sec-${i} .card-title {
     font-family: ${h}; 
      color: ${u.heading};

    }

     .blog-sec-${i} .details{
      font-family: ${h}; 
      font-weight: 400;
      font-size: 12px;
      leading-trim: NONE;
      line-height: 16px;
      letter-spacing: 0.2px;
    }

    .blog-sec-${i} .h6-font{
      font-family: ${h}; 
      font-weight: 700;
      font-size : ${m.h6Font};
      leading-trim: NONE;
      line-height: 24px;
      letter-spacing: 0.2px;
    }

    .blog-sec-${i} .tags{
      font-family: ${h}; 
      font-weight: 400;
      font-size: 12px;
      leading-trim: NONE;
      line-height: 16px;
      letter-spacing: 0.2px;
    }

    
    @media (min-width: 768px) {
      .blog-sec-${i} .sec-heading { font-size: ${m.heading}; }
      .blog-sec-${i} .card-title { font-size: ${m.cardTitle}; 
        font-family: ${h};
        font-weight: 400;
        leading-trim: NONE;
        line-height: 30px;
        letter-spacing: 0.2px;
      }
    }
  `,j=((F=t.data)==null?void 0:F.articles)||[];return r.jsxs("section",{className:`w-full blog-sec-${i} ${n} bg-white`,children:[r.jsx("style",{dangerouslySetInnerHTML:{__html:l}}),r.jsxs("div",{className:"max-w-[100%] mx-auto px-[7%]",children:[r.jsxs("div",{className:"text-center mb-[50px] md:max-w-2xl mx-auto",children:[x&&r.jsx("h4",{className:"sec-subtitle mb-[10px]",children:x}),a&&r.jsx("h3",{className:"sec-heading mb-[10px]",children:a}),o&&r.jsx("p",{className:"sec-description max-w-md mx-auto",children:o})]}),r.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 lg:gap-[50px] justify-center",children:j.length>0?j.map(f=>r.jsx(tr,{article:f,mounted:w,colors:u},f.id)):[...Array(s.limit||3)].map((f,p)=>r.jsx("div",{className:"aspect-[4/5] bg-gray-50 animate-pulse rounded-lg border border-gray-100"},`skeleton-${p}`))})]})]})}function tr({article:s,mounted:e,colors:t}){const[w,v]=C.useState(!1),a=new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"long",year:"numeric"}).format(new Date(s.publishedAt)),x=s.excerpt?s.excerpt:s.content?s.content.slice(0,150)+"...":"No description available.";return r.jsx("div",{className:"group bg-white flex flex-col shadow-sm border border-gray-100 rounded overflow-hidden hover:shadow-lg transition-all duration-300 h-full",children:r.jsxs(se,{to:`/blogs/${s.blog.handle}/${s.handle}`,className:"flex flex-col h-full",children:[r.jsx("div",{className:"relative aspect-[4/3] bg-gray-100 overflow-hidden",children:s.image&&r.jsx(ie,{data:s!=null&&s.image?s.image:Le,className:`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${e&&w?"blur-0":"blur-xl"}`,onLoad:()=>v(!0),sizes:"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"})}),r.jsxs("div",{className:"p-6 flex flex-col flex-grow",children:[r.jsxs("div",{className:"flex gap-4 tags font-bold mb-[10px]",style:{color:t.subtitle},children:[r.jsx("span",{className:" text-[#23A6F0]",children:"Google"}),r.jsx("span",{children:"Trending"}),r.jsx("span",{children:"New"})]}),r.jsx("h4",{className:"card-title font-bold mb-3 transition-colors line-clamp-2 leading-tight group-hover:opacity-70",children:s.title}),r.jsx("p",{className:"line-clamp-3 sec-description  flex-grow mb-[10px]",style:{color:t.body},children:x}),r.jsxs("div",{className:"flex items-center justify-between text-[12px] font-bold py-[15px] border-t border-gray-100 mt-auto",style:{color:t.body},children:[r.jsxs("div",{className:"details flex items-center gap-[5px]",children:[r.jsx("img",{src:sr,alt:"Clock",style:{height:"16px",width:"16px"}}),a]}),r.jsxs("div",{className:"details flex items-center gap-[5px]",children:[r.jsx("img",{src:ir,alt:"Comments",style:{height:"15px",width:"16px"}}),"10 comments"]})]}),r.jsxs("span",{className:"h6-font text-sm font-bold mt-[10px] flex items-center gap-[10px] group-hover:translate-x-1 transition-transform",style:{color:t.subtitle},children:["Learn More ",r.jsx("span",{className:"text-lg leading-none text-[#23A6F0]",children:r.jsx("svg",{className:"w-[9px] h-[16px] ",fill:"none",viewBox:"9 5 7 14",stroke:"currentColor",strokeWidth:1.5,children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 5l7 7-7 7"})})})]})]})]})})}const J=s=>{if(!s)return null;const e=String(s);return e.startsWith("#")?e:`#${e}`};function or(s,e){const t=s.toString().replace("#",""),w=parseInt(t.slice(0,2),16),v=parseInt(t.slice(2,4),16),a=parseInt(t.slice(4,6),16);return`rgba(${w}, ${v}, ${a}, ${e})`}function cr({module:s,globalSettingsData:e}){var o,n,i,c,h,u,m;if(!((o=s==null?void 0:s.cards)!=null&&o.length))return null;const{theme:t,cards:w}=s||{},v=(w==null?void 0:w.length)||0,a={1:"grid-cols-1",2:"grid-cols-1 md:grid-cols-2",3:"grid-cols-1 md:grid-cols-2",4:"grid-cols-1 sm:grid-cols-2 md:grid-cols-4"}[v]||"grid-cols-1",x=`
    .promo-grid-section {
      background-color: ${t!=null&&t.bg?J(t.bg):"#ffffff"};
      font-family: ${e!=null&&e.fontFamily?e.fontFamily:"Montserrat, sans-serif"};
    }
    .promo-card-heading {
      font-family: ${e!=null&&e.fontFamily?e.fontFamily:"Montserrat, sans-serif"};
      font-size: ${(n=e==null?void 0:e.headingSizes)!=null&&n.h4?e.headingSizes.h4+"px":"20px"};
      color: #ffffff;
      font-weight: 700;
      font-style: Bold;
      leading-trim: NONE;
      line-height: 33.49px;
      letter-spacing: 0.1px;

    }
    .promo-card-btn {
      font-family: ${e!=null&&e.fontFamily?e.fontFamily:"Montserrat, sans-serif"};
      font-size: ${e!=null&&e.baseFontSize?(e==null?void 0:e.baseFontSize)+"px":"14px"};
      font-weight: 700;
      leading-trim: NONE;
      line-height: 23.02px;
      letter-spacing: 0.21px;
      color: ${(i=e==null?void 0:e.buttons)!=null&&i.primaryText?J(e.buttons.primaryText):"#ffffff"};
      border-radius: ${((c=e==null?void 0:e.buttons)==null?void 0:c.borderRadius)!==void 0?e.buttons.borderRadius+"px":"0px"};
    }
    .promo-card-btn:hover {
      background-color: ${(h=e==null?void 0:e.buttons)!=null&&h.primaryHoverBg?J(e.buttons.primaryHoverBg):"#ffffff"};
      color: ${(u=e==null?void 0:e.buttons)!=null&&u.primaryHovertxt?J(e.buttons.primaryHovertxt):"#000000"};
      border-color: ${(m=e==null?void 0:e.buttons)!=null&&m.primaryHoverBg?J(e.buttons.primaryHoverBg):"#ffffff"};
    }
  `;return r.jsxs("section",{className:"promo-grid-section w-full max-w-[100%] px-[7%] mx-auto py-[80px]",children:[r.jsx("style",{children:x}),r.jsx("div",{className:`grid gap-4 md:gap-[15.7px] ${a}`,children:w==null?void 0:w.map((l,j)=>{var I;const y=v===3&&j===0,E=!!(l!=null&&l.cardBg),N=J(l==null?void 0:l.cardBg)||J((I=e==null?void 0:e.buttons)==null?void 0:I.primaryBg)||"#3191ca",k=or(N,.75),T=J(l==null?void 0:l.headingColor)||"#ffffff";return r.jsxs("div",{className:`relative overflow-hidden group min-h-[350px] ${y?"md:row-span-2 md:h-full":"h-[350px] md:h-auto"}`,children:[r.jsx("img",{src:l!=null&&l.imageUrl?l.imageUrl:Le,alt:(l==null?void 0:l.heading)||"No image available",className:"absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"}),r.jsxs("div",{style:{backgroundColor:k},className:"absolute bottom-0 left-0 p-[30px] w-full max-w-[400px] h-full max-h-[180px]",children:[r.jsx("h4",{className:`promo-card-heading font-bold mb-5 ${(l==null?void 0:l.headingSize)||""}`,style:{lineHeight:"34px",letterSpacing:"0.1px",color:T},children:l==null?void 0:l.heading}),r.jsx(dr,{cta:l,globalSettings:e,themeColor:N,forceModuleStyle:E})]})]},l==null?void 0:l._key)})})]})}function dr({cta:s,globalSettings:e,themeColor:t,forceModuleStyle:w}){var u,m,l,j,y,E;const[v,a]=C.useState(!1),x=(u=s==null?void 0:s.link)==null?void 0:u[0];let o="/";if((x==null?void 0:x._type)==="linkExternal")o=(x==null?void 0:x.url)||"/";else if(x!=null&&x.reference){const N=(m=x==null?void 0:x.reference)==null?void 0:m._type,k=((l=x==null?void 0:x.reference)==null?void 0:l.slug)||((j=x==null?void 0:x.reference)==null?void 0:j.pageSlug);k&&(o=`/${N!=null&&N.toLowerCase().includes("product")?"products":N!=null&&N.toLowerCase().includes("collection")?"collections":"pages"}/${k}`)}const n=J((y=e==null?void 0:e.buttons)==null?void 0:y.primaryHoverBg),i=J((E=e==null?void 0:e.buttons)==null?void 0:E.primaryHovertxt);let c,h;return w?(c="#ffffff",h=t):n&&i?(c=n,h=i):(c="#ffffff",h=t),r.jsx(He,{to:o,onMouseEnter:()=>a(!0),onMouseLeave:()=>a(!1),className:"promo-card-btn inline-block border border-white/40 px-[40px] py-[16px] w-full uppercase max-w-fit transition-all duration-300",style:{backgroundColor:v?c:"transparent",color:v?h:void 0,borderColor:v?c:"#FFFFFF",letterSpacing:"0.21px"},children:(s==null?void 0:s.ctaText)||"Explore Items"})}function lr({modules:s,globalSettings:e,globalSettingsData:t,isLoggedIn:w,wishlistSettings:v,activeCurrency:a,activeCountry:x,wishlist:o}){if(!(s!=null&&s.length))return null;const n=(i,c)=>i?c._type==="productGrid"?r.jsx(i,{module:c,globalSettings:e,isLoggedIn:w,wishlistSettings:v,activeCurrency:a,activeCountry:x,wishlist:o,globalSettingsData:t},c._key):r.jsx(i,{module:c,globalSettings:e,globalSettingsData:t,activeCountry:x},c._key):(console.error(`Module Error: Component for type "${c._type}" is undefined. Check your export/import.`),null);return r.jsx(r.Fragment,{children:s.map(i=>{switch(i._type){case"bannerSlider":return n(De,i);case"heroBanner":return n(Ge,i);case"imageWithText":return n(Qe,i);case"productGrid":return n(Ze,i);case"collectionCarousel":return n(ge,i);case"newsletter":return n(Se,i);case"servicesGrid":return n(rr,i);case"featuredBlogs":return n(nr,i);case"promotionalGrid":return n(cr,i);case"faq":return n(er,i);case"logoSlider":return r.jsx(Ve,{data:i,globalSettings:e},i._key);default:return null}})})}const Nr=()=>[{title:"Hydrogen | Home"}],Cr=_e(function(){var n,i,c,h,u;const e=Oe(),t=We("root"),w=((n=e==null?void 0:e.i18n)==null?void 0:n.country)||"US",v=(c=(i=t==null?void 0:t.localization)==null?void 0:i.availableCountries)==null?void 0:c.find(m=>m.isoCode===w),a=e==null?void 0:e.globalSettingsData,x=((h=v==null?void 0:v.currency)==null?void 0:h.isoCode)||"USD";return((u=e==null?void 0:e.homeData)==null?void 0:u.modules)&&e.homeData.modules.length>0?r.jsx("div",{className:"home",children:r.jsx(lr,{modules:e.homeData.modules,isLoggedIn:e.isLoggedIn||!1,wishlistSettings:{enabled:e.isWishlistEnabled},activeCurrency:x,activeCountry:w,wishlist:e.wishlist,globalSettingsData:a})},w):r.jsx(xr,{})});function xr(){return r.jsxs("div",{className:"flex flex-col items-center justify-center w-screen h-screen bg-gray-100 text-gray-800 text-center p-8",children:[r.jsx("h1",{children:"No Sanity Data Found"}),r.jsxs("p",{children:["The homepage content is missing from Sanity. ",r.jsx("br",{}),"Please check your Sanity project or environment variables."]})]})}ze`*[_type == "product"] {
  _id,
  _createdAt,
  "title": store.title,
  "slug": store.slug.current,
  "price": store.priceRange.minVariantPrice,
  "compareAtPrice": store.compareAtPriceRange.maxVariantPrice,
  "imageUrl": store.previewImageUrl,
  "secondaryImageUrl": store.images[1].asset->url
}`;ze`
  *[_id in $ids]{
    _id,
    "title": store.title,
    "gid": store.gid,
    "shopifyId": store.id,
    "imageUrl": store.imageUrl
  }
`;ze`
*[_type == "product"] | order(_createdAt desc)[0...10]{
  _id,
  "title": store.title,
  "slug": store.slug.current,
  "price": store.priceRange.minVariantPrice,
  "image": store.previewImageUrl
}
`;export{Cr as default,Nr as meta};
