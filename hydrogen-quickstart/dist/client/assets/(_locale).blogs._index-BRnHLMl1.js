import{w as L,u as C,a as R,L as A,N as w,r as _}from"./chunk-TMI4QPZX-BLmhRnqS.js";import{j as r}from"./jsx-runtime-DhjjMwep.js";import{P as H}from"./PaginatedResourceSection-BdZueoyq.js";import{N as I}from"./No_image-BuyNKfAF.js";import{I as E}from"./Image-DamjFDKV.js";import"./index-MkUT3eft.js";const Q=L(function(){var p,d,l,c,m,f,h,u,g,j,y,b,$,k,v,F,N,z;const{articles:s,blogs:i,locale:a}=C(),o=a==="us"?"":`/${a}`,x=R("root"),e=x==null?void 0:x.globalSettings,B=`
    .blog-page {
      font-family: ${e!=null&&e.fontFamily?e.fontFamily:"Montserrat, sans-serif"} !important;
      font-size: ${e!=null&&e.baseFontSize?e.baseFontSize:16}px !important;
    }
    .blog-page h1 { font-size: ${(p=e==null?void 0:e.headingSizes)!=null&&p.h1?e.headingSizes.h1:42}px !important; }
    .blog-page h2 { font-size: ${(d=e==null?void 0:e.headingSizes)!=null&&d.h2?e.headingSizes.h2:40}px !important; }
    .blog-page h3 { font-size: ${(l=e==null?void 0:e.headingSizes)!=null&&l.h3?e.headingSizes.h3:32}px !important; }
    .blog-page h4 { font-size: ${(c=e==null?void 0:e.headingSizes)!=null&&c.h4?e.headingSizes.h4:24}px !important; }
    .blog-page h5 { font-size: ${(m=e==null?void 0:e.headingSizes)!=null&&m.h5?e.headingSizes.h5:20}px !important; }
    .blog-page h6 { font-size: ${(f=e==null?void 0:e.headingSizes)!=null&&f.h6?e.headingSizes.h6:16}px !important; }

    .btn-primary {
      background-color: #${(h=e==null?void 0:e.buttons)!=null&&h.primaryBg?e.buttons.primaryBg:"23A6F0"} !important;
      color: #${(u=e==null?void 0:e.buttons)!=null&&u.primaryText?e.buttons.primaryText:"FFFFFF"} !important;
      border-radius: ${((g=e==null?void 0:e.buttons)==null?void 0:g.borderRadius)!=null&&((j=e==null?void 0:e.buttons)==null?void 0:j.borderRadius)!==""?e.buttons.borderRadius:8}px !important;
    }
    .btn-primary:hover {
      background-color: #${(y=e==null?void 0:e.buttons)!=null&&y.primaryHoverBg?e.buttons.primaryHoverBg:"1D4ED8"} !important;
      color: #${(b=e==null?void 0:e.buttons)!=null&&b.primaryHovertxt?e.buttons.primaryHovertxt:"FFFFFF"} !important;
    }

    .blog-link {
      color: #${($=e==null?void 0:e.linksEffect)!=null&&$.linkColor?e.linksEffect.linkColor:"737373"} !important;
      transition: all ${((k=e==null?void 0:e.linksEffect)==null?void 0:k.transitionDuration)!=null&&((v=e==null?void 0:e.linksEffect)==null?void 0:v.transitionDuration)!==""?e.linksEffect.transitionDuration:300}ms !important;
      text-decoration: ${((F=e==null?void 0:e.linksEffect)!=null&&F.underlineStyle?e.linksEffect.underlineStyle:"none")==="always"?"underline":"none"} !important;
    }
    .blog-link:hover {
      color: #${(N=e==null?void 0:e.linksEffect)!=null&&N.hoverColor?e.linksEffect.hoverColor:"5a5a5a"} !important;
      ${((z=e==null?void 0:e.linksEffect)!=null&&z.hoverEffect?e.linksEffect.hoverEffect:"none")==="underline"?"text-decoration: underline !important;":""}
    }
  `;return r.jsxs("div",{className:"w-full bg-white text-[#252B42] pb-24 blog-page",children:[e&&r.jsx("style",{children:B}),r.jsxs("section",{className:"pt-[50px] flex flex-col gap-[16px] items-center text-center px-6",children:[r.jsxs("div",{className:"flex gap-[15px] font-normal text-[14px] leading-[24px] tracking-[0.2px] text-[#737373] py-[10px]",children:[r.jsx(A,{className:"font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#252B42]",to:o||"/",children:"Home"})," ",r.jsx("span",{children:">"})," ",r.jsx("span",{className:"font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#bdbdbd]",children:"Blog"})]}),r.jsx("h1",{className:"text-[58px] leading-[80px] tracking-[0.2px] font-bold",children:"The Blog"}),r.jsxs("div",{className:"flex flex-wrap justify-center gap-[9px] py-[16px]",children:[r.jsx(w,{to:`${o}/blogs`,end:!0,className:({isActive:n})=>`px-[20px] py-[10px] rounded-full font-bold text-[14px] leading-[24px] tracking-[0.2px] ${n?"bg-[#23A6F0] text-white":"border border-[#23A6F0] text-[#23A6F0] flex justify-center items-center"}`,children:"All"}),i.nodes.map(n=>r.jsx(w,{to:`${o}/blogs/${n.handle}`,className:({isActive:D})=>`px-[20px] py-[10px] rounded-full font-bold text-[14px] leading-[24px] tracking-[0.2px] ${D?"bg-[#23A6F0] text-white":"border border-[#23A6F0] text-[#23A6F0] flex justify-center items-center"}`,children:n.title},n.handle))]})]}),r.jsx("section",{className:"max-w-[1200px] mx-auto py-[112px]",children:r.jsx(H,{connection:s,children:({node:n})=>r.jsx(T,{article:n,prefix:o},n.id)})})]})});function T({article:t,prefix:s}){const[i,a]=_.useState(!1),o=new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"long",year:"numeric"}).format(new Date(t.publishedAt));return r.jsx("div",{className:"group bg-white flex flex-col shadow-sm border border-gray-100 rounded hover:shadow-lg transition-all overflow-hidden",children:r.jsxs(A,{to:`${s}/blogs/${t.blog.handle}/${t.handle}`,children:[r.jsxs("div",{className:"relative aspect-[4/3] bg-gray-100 overflow-hidden",children:[r.jsx("div",{className:"absolute top-4 left-4 bg-[#E74040] text-white text-[10px] font-bold px-3 py-1 rounded z-10 uppercase",children:"New"}),t.image?r.jsx(E,{data:t.image,className:`w-full h-full object-cover transition-all duration-500 ${i?"blur-0":"blur-xl"}`,onLoad:()=>a(!0)}):r.jsx(E,{src:I,className:`w-full h-full object-cover transition-all duration-500 ${i?"blur-0":"blur-xl"}`,onLoad:()=>a(!0)})]}),r.jsxs("div",{className:"p-[25px] pb-[35px] flex flex-col gap-[10px]",children:[r.jsx("div",{className:"flex gap-4 text-[12px] leading-[16px] tracking-[0.2px] font-normal text-[#8EC2F2]",children:r.jsx("span",{children:t.blog.title})}),r.jsx("h3",{className:"text-[20px] leading-[30px] tracking-[0.2px] font-normal text-[#252B42]",children:t.title}),r.jsxs("div",{className:"flex justify-between text-[12px] leading-[16px] tracking-[0.2px] text-[#737373] font-normal py-[15px] border-t border-gray-100 mt-auto",children:[r.jsx("span",{children:o}),r.jsx("span",{children:"10 comments"})]})]})]})})}export{Q as default};
