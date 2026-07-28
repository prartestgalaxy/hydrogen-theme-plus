import{w as R,u as A,a as P,L as B}from"./chunk-TMI4QPZX-BLmhRnqS.js";import{j as n}from"./jsx-runtime-DhjjMwep.js";import{P as G}from"./PaginatedResourceSection-BdZueoyq.js";import{L as H}from"./LogoSlider-LrxPF98B.js";import{g as q}from"./groq-DBO2yGN5.js";import{I as X}from"./Image-DamjFDKV.js";import"./index-MkUT3eft.js";q`
*[_type == "maincollectionsetting"][0]{

  // =========================
  // COLLECTION SETTINGS (FLAT)
  // =========================
  "overlayColor": overlayColor.hex,
  "textColor": textColor.hex,
  alignment,

  // =========================
  // LOGO SLIDER
  // =========================
  logoSlider{
    enable,
    "backgroundcol": backgroundcol.hex,
    autoScroll,
    speed,
    logos[]{
     
      "imageUrl": image.asset->url
    }
  }

}
`;const $={overlayColor:"#2D8BC0",textColor:"#FFFFFF",alignment:"left",logoSlider:{enable:!0,title:"",autoScroll:!0,speed:3e3,logos:[{link:"/",imageUrl:"/logos/hooli.png"},{link:"/",imageUrl:"/logos/leaf.png"},{link:"/",imageUrl:"/logos/lyft.png"},{link:"/",imageUrl:"/logos/aws.png"},{link:"/",imageUrl:"/logos/stripe.png"},{link:"/",imageUrl:"/logos/monkey.png"}]}};function J(){const r=P("root");return(r==null?void 0:r.globalSettings)||null}const te=R(function(){var k,p,f,v,m,g,y,i,T,L,I,O,M;const{collections:F,locale:u,mainSettings:c}=A(),e=J(),d=t=>{if(!t)return null;if(t.startsWith("#"))return t;if(/^[0-9A-Fa-f]{3,8}$/.test(t)){if(t.length===6)return`#${t}`;if(t.length===8)return`#${t}`;if(t.length===3)return`#${t}`}return t},o=(t,C=.75)=>{if(!t)return null;if(t.length===9&&t.startsWith("#")){const a=t.substring(1,7),j=Math.round(C*255).toString(16).padStart(2,"0");return`#${a}${j}`}if(t.length===7&&t.startsWith("#")){const a=Math.round(C*255).toString(16).padStart(2,"0");return`${t}${a}`}if(t.length===4&&t.startsWith("#")){const a=t[1],j=t[2],U=t[3],W=`#${a}${a}${j}${j}${U}${U}`,_=Math.round(C*255).toString(16).padStart(2,"0");return`${W}${_}`}return t},{overlayColor:s=$.overlayColor,textColor:N=$.textColor,alignment:w=$.alignment,logoSlider:l=$.logoSlider}=c||$;let h=d(s);const z=d(N);h=o(h,.75);const E=(l==null?void 0:l.enable)!==!1&&((k=l==null?void 0:l.logos)==null?void 0:k.length)>0,x=`
    .collections-page {
      font-family: ${e!=null&&e.fontFamily?e.fontFamily:"Montserrat, sans-serif"};
      font-size: ${e!=null&&e.baseFontSize?e.baseFontSize:16}px;
    }
    .collections-page h1 { font-size: ${((p=e==null?void 0:e.headingSizes)==null?void 0:p.h1)||32}px; }
    .collections-page h2 { font-size: ${((f=e==null?void 0:e.headingSizes)==null?void 0:f.h2)||28}px; }
    .collections-page h3 { font-size: ${((v=e==null?void 0:e.headingSizes)==null?void 0:v.h3)||24}px; }
    .collections-page h4 { font-size: ${((m=e==null?void 0:e.headingSizes)==null?void 0:m.h4)||20}px; }
    .collections-page h5 { font-size: ${((g=e==null?void 0:e.headingSizes)==null?void 0:g.h5)||18}px; }
    .collections-page h6 { font-size: ${((y=e==null?void 0:e.headingSizes)==null?void 0:y.h6)||16}px; }

    .collections-link {
      color: ${(i=e==null?void 0:e.linksEffect)!=null&&i.linkColor?d(e.linksEffect.linkColor):"#000000"};
      transition-duration: ${((T=e==null?void 0:e.linksEffect)==null?void 0:T.transitionDuration)!=null&&((L=e==null?void 0:e.linksEffect)==null?void 0:L.transitionDuration)!==""?e.linksEffect.transitionDuration:300}ms;
      text-decoration: ${(((I=e==null?void 0:e.linksEffect)==null?void 0:I.underlineStyle)||"none")==="always"?"underline":"none"};
    }
    .collections-link:hover {
      color: ${(O=e==null?void 0:e.linksEffect)!=null&&O.hoverColor?d(e.linksEffect.hoverColor):"#666666"};
      ${(((M=e==null?void 0:e.linksEffect)==null?void 0:M.hoverEffect)||"none")==="underline"?"text-decoration: underline;":""}
    }
  `,S=(c==null?void 0:c.fontFamily)||(e==null?void 0:e.fontFamily)||"Montserrat, sans-serif";return n.jsxs("div",{className:"w-full collections-page",children:[n.jsx("style",{children:x}),n.jsx("div",{className:"pt-[50px] pb-[50px] px-4 sm:px-6 md:px-10 lg:px-[102px]",style:{fontFamily:S},children:n.jsx(G,{connection:F,resourcesClassName:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15.5px] gap-y-[100px]",children:({node:t,index:C})=>n.jsx(K,{collection:t,index:C,locale:u,overlayColor:h,textColor:z,alignment:w,mainSettings:c,globalData:e,formatColor:d},t.id)})}),E&&n.jsx("div",{className:"w-full mt-16",children:n.jsx(H,{data:l,globalData:e})})]})});function K({collection:r,index:F,locale:u,overlayColor:c,textColor:e,alignment:d,mainSettings:o,globalData:s,formatColor:N}){var m,g,y;const w=u!=null&&u.country&&u.country!=="us"?`/${u.country}`:"",l=((m=r.title)==null?void 0:m.replace(/collection$/i,"").trim())||r.title||"Collection",h=(g=r.description)!=null&&g.trim()?r.description:"Discover our latest collection.",z=()=>{switch(d){case"center":return"text-center items-center";case"right":return"text-right items-end";default:return"text-left items-start"}},E=()=>{switch(d){case"center":return"justify-center";case"right":return"justify-end";default:return"justify-start"}},x=(o==null?void 0:o.fontFamily)||(s==null?void 0:s.fontFamily)||"Montserrat, sans-serif",S=(o==null?void 0:o.transitionDuration)||((y=s==null?void 0:s.linksEffect)==null?void 0:y.transitionDuration)||300,k={backgroundColor:c,color:e,display:"flex",flexDirection:"column",gap:"0.75rem",fontFamily:x},p={borderColor:e,color:e,backgroundColor:"transparent",width:"154.71px",height:"55.39px",padding:"15.7px 41.86px",borderRadius:"5.23px",borderWidth:"1.05px",borderStyle:"solid",fontSize:"14px",fontWeight:"700",fontFamily:x,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"10.46px",transition:`all ${S}ms ease`,cursor:"pointer"},f={backgroundColor:e,color:c,borderColor:e},v=(o==null?void 0:o.headingFontSize)||"20px";return o!=null&&o.baseFontSize||s!=null&&s.baseFontSize,n.jsx(B,{to:`${w}/collections/${r.handle}`,prefetch:"intent",className:"group block collections-link",style:{textDecoration:"none"},children:n.jsxs("div",{className:"w-full relative overflow-hidden bg-gray-100 aspect-[4/5] shadow-md group-hover:shadow-xl transition-shadow duration-300",children:[r!=null&&r.image&&r.image.url?n.jsx(X,{data:r.image,alt:r.image.altText||r.title,loading:F<3?"eager":"lazy",sizes:"(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw",className:"w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"}):n.jsx("div",{className:"w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center",children:n.jsx("span",{className:"text-gray-400 text-sm",children:"No image"})}),n.jsxs("div",{className:`absolute bottom-0 left-0 right-0 py-[25px] px-[50px] ${z()}`,style:{...k,gap:"0px"},children:[n.jsxs("h3",{className:"font-semibold",style:{fontSize:v,fontFamily:x,fontWeight:"700",lineHeight:"33.49px",letterSpacing:"0.1px"},children:[l," Collection"]}),n.jsx("p",{className:"opacity-90 leading-relaxed line-clamp-3",style:{fontSize:"16px",fontWeight:"500",lineHeight:"25px",letterSpacing:"0.1px"},children:h}),n.jsx("div",{className:`flex ${E()}`,style:{marginTop:"10px"},children:n.jsx("span",{className:`font-bold inline-flex items-center justify-center border cursor-pointer
              leading-[23.02px] tracking-[0.2px]`,style:p,onMouseEnter:i=>{i.currentTarget.style.backgroundColor=f.backgroundColor,i.currentTarget.style.color=f.color,i.currentTarget.style.borderColor=f.borderColor},onMouseLeave:i=>{i.currentTarget.style.backgroundColor=p.backgroundColor,i.currentTarget.style.color=p.color,i.currentTarget.style.borderColor=p.borderColor},children:"EXPLORE"})})]})]})})}export{te as default};
