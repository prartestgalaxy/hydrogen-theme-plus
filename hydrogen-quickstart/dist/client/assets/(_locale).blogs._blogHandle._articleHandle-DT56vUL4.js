import{w as A,u as B,a as I,r as F}from"./chunk-TMI4QPZX-BLmhRnqS.js";import{j as t}from"./jsx-runtime-DhjjMwep.js";import{N as q}from"./No_image-BuyNKfAF.js";import{I as C}from"./Image-DamjFDKV.js";const U=({data:r})=>[{title:`Hydrogen | ${(r==null?void 0:r.article.title)??""} article`}],W=A(function(){var c,d,l,p,m,x,u,f,h,y,g,k,b,j,$,z,v,w;const{article:o,locale:L}=B(),{title:E,image:s,contentHtml:N,author:n}=o,i=I("root"),e=i==null?void 0:i.globalSettings,D=`
    .blog-page {
      font-family: ${e!=null&&e.fontFamily?e.fontFamily:"Montserrat, sans-serif"} !important;
      font-size: ${e!=null&&e.baseFontSize?e.baseFontSize:16}px !important;
    }
    .blog-page h1 { font-size: ${(c=e==null?void 0:e.headingSizes)!=null&&c.h1?e.headingSizes.h1:42}px !important; }
    .blog-page h2 { font-size: ${(d=e==null?void 0:e.headingSizes)!=null&&d.h2?e.headingSizes.h2:40}px !important; }
    .blog-page h3 { font-size: ${(l=e==null?void 0:e.headingSizes)!=null&&l.h3?e.headingSizes.h3:32}px !important; }
    .blog-page h4 { font-size: ${(p=e==null?void 0:e.headingSizes)!=null&&p.h4?e.headingSizes.h4:24}px !important; }
    .blog-page h5 { font-size: ${(m=e==null?void 0:e.headingSizes)!=null&&m.h5?e.headingSizes.h5:20}px !important; }
    .blog-page h6 { font-size: ${(x=e==null?void 0:e.headingSizes)!=null&&x.h6?e.headingSizes.h6:16}px !important; }

    .btn-primary {
      background-color: #${(u=e==null?void 0:e.buttons)!=null&&u.primaryBg?e.buttons.primaryBg:"23A6F0"} !important;
      color: #${(f=e==null?void 0:e.buttons)!=null&&f.primaryText?e.buttons.primaryText:"FFFFFF"} !important;
      border-radius: ${((h=e==null?void 0:e.buttons)==null?void 0:h.borderRadius)!=null&&((y=e==null?void 0:e.buttons)==null?void 0:y.borderRadius)!==""?e.buttons.borderRadius:8}px !important;
    }
    .btn-primary:hover {
      background-color: #${(g=e==null?void 0:e.buttons)!=null&&g.primaryHoverBg?e.buttons.primaryHoverBg:"1D4ED8"} !important;
      color: #${(k=e==null?void 0:e.buttons)!=null&&k.primaryHovertxt?e.buttons.primaryHovertxt:"FFFFFF"} !important;
    }

    .blog-link {
      color: #${(b=e==null?void 0:e.linksEffect)!=null&&b.linkColor?e.linksEffect.linkColor:"737373"} !important;
      transition: all ${((j=e==null?void 0:e.linksEffect)==null?void 0:j.transitionDuration)!=null&&(($=e==null?void 0:e.linksEffect)==null?void 0:$.transitionDuration)!==""?e.linksEffect.transitionDuration:300}ms !important;
      text-decoration: ${((z=e==null?void 0:e.linksEffect)!=null&&z.underlineStyle?e.linksEffect.underlineStyle:"none")==="always"?"underline":"none"} !important;
    }
    .blog-link:hover {
      color: #${(v=e==null?void 0:e.linksEffect)!=null&&v.hoverColor?e.linksEffect.hoverColor:"5a5a5a"} !important;
      ${((w=e==null?void 0:e.linksEffect)!=null&&w.hoverEffect?e.linksEffect.hoverEffect:"none")==="underline"?"text-decoration: underline !important;":""}
    }
  `,[H,T]=F.useState(!1);F.useEffect(()=>{const a=setTimeout(()=>T(!0),50);return()=>clearTimeout(a)},[]);const _=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"long",day:"numeric"}).format(new Date(o.publishedAt));return t.jsxs("div",{className:"w-full bg-white text-[#252B42] pb-24 blog-page",children:[e&&t.jsx("style",{children:D}),t.jsxs("section",{className:"py-[50px] flex flex-col items-center justify-center gap-[16px] text-center px-6",children:[t.jsx("h5",{className:" leading-[24px] tracking-[0.1px] font-bold text-[#23A6F0] tracking-widest uppercase",children:"Tutorial"}),t.jsx("h2",{className:"text-4xl md:text-[40px] leading-[50px] font-bold text-[#252B42] letter-spacing-[0.2px]",children:E}),t.jsxs("div",{className:"text-[#737373] text-[16px] leading-[24px] tracking-[0.2px] flex flex-col items-center justify-center font-bold",children:[t.jsx("p",{children:"We focus on ergonomics and meeting you where you work."}),t.jsx("p",{children:"It's only a keystroke away."})]})]}),t.jsxs("section",{className:"max-w-[800px] mx-auto pt-[0px] pb-[80px] flex flex-col gap-[30px]",children:[s?t.jsx("div",{className:"w-full overflow-hidden bg-gray-100",children:t.jsx("img",{src:q,alt:"No Image",className:"w-full h-auto object-cover"})}):t.jsx("div",{className:"w-full overflow-hidden bg-gray-100",children:t.jsx(C,{data:s,sizes:"(max-width: 640px) 100vw, (max-width: 1024px) 800px, 800px",loading:"eager",loaderOptions:{scale:.1},className:`w-full h-auto object-cover transition-all duration-500 ${H?"blur-0":"blur-xl"}`,onLoad:a=>a.currentTarget.style.filter="blur(0)"})}),t.jsxs("div",{className:"flex items-center gap-4 text-sm font-bold text-[#737373] border-b border-gray-100",children:[t.jsx("time",{dateTime:o.publishedAt,children:_}),t.jsx("span",{children:"·"}),t.jsx("address",{className:"not-italic text-[#23A6F0]",children:(n==null?void 0:n.name)||"Store Admin"})]}),t.jsx("div",{dangerouslySetInnerHTML:{__html:N},className:"text-[#737373] leading-loose text-base md:text-lg [&>h2]:text-[#252B42] [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 [&>p]:mb-6 [&>blockquote]:border-l-4 [&>blockquote]:border-[#E74040] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-[#E74040] !leading-[34px] tracking-[0.2px]"})]})]})});export{W as default,U as meta};
