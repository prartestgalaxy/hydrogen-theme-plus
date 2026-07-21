import groq from 'groq';

export const HOME_QUERY = groq`
*[_type == "home"][0]{
  _id,

  modules[]{
    _key,
    _type,

    // HERO
    _type == "heroBanner" => {
      layout,
      imageWidth,
      "imageUrl": image.asset->url,
      content {
        subheading,
        title,
        titleSize,
        titleWeight,
        subtitle,
        alignment
      },
      colors {
        "bg": bg.hex,
        "text": text.hex,
        overlay
      },
      cta {
        text,
        style,
        "bgColor": bgColor.hex,
        "textColor": textColor.hex,
        link[] {
          _type,
          url,
          reference->{ _type, "slug": slug.current }
        }
      }
    },

    // IMAGE WITH TEXT
   _type == "imageWithText" => {
      layout,
      imageWidth,
      image,
      "imageUrl": image.asset->url,
      imageSettings,
      content,
      cta {
        text,
        style,
        "bgColor": bgColor.hex,
        "textColor": textColor.hex,
        link[] {
          _type,
          url,
          reference->{ _type, "slug": slug.current }
        }
      },
      theme {
        "bg": bg.hex,
        "textHeading": textHeading.hex,
        "text": text.hex,
        padding
      }
    },

    _type == "promotionalGrid" => {
      theme {
        "bg": bg.hex,
        padding
      },
      cards[] {
        _key,
        heading,
        headingSize,
        "headingColor": headingColor.hex,
        "cardBg": cardBg.hex,
        ctaText,
        "imageUrl": image.asset->url,
        link[] {
          _type,
          _type == "linkInternal" => {
            "reference": reference-> {
              _type,
              "slug": store.slug.current,
              // Fallback for standard pages
              "pageSlug": slug.current 
            }
          },
          _type == "linkExternal" => {
            url
          }
        }
      }
    },

    // PRODUCT GRID
    _type == "productGrid" => {
    _type,
    title,
    subtitle,
    description, 
    sourceType,
    limit,
    buttonText, 
    columnsDesktop,
    aspectRatio,
    gap,
    textAlign,
    "buttonColor": buttonColor.hex, 
    "buttonTextColor": buttonTextColor.hex, 
    padding,
    showSecondaryImage,
    showQuickView,
    quickViewConfig {
      contentElements[] {
        elementType,
        enabled,
        imageSize,
        titleSize,
        showCompareAtPrice,
        variantStyle,
        buttonText
      },
      styling {
        maxWidth,
        "backgroundColor": backgroundColor.hex,
        "textColor": textColor.hex,
        "buttonColor": buttonColor.hex,
        "buttonTextColor": buttonTextColor.hex,
        fontSize,
        borderRadius
      }
    },
    products[] {
      _ref
    }
  },

  // FEATURED BLOGS
  _type == "featuredBlogs" => {
    _type,
    enabled,
    title,
    subtitle,
    description,
    limit,
    padding
  },
    // COLLECTION CAROUSEL
   _type == "collectionCarousel" => {
    ...,
    "backgroundColor": backgroundColor.hex,
    "textColor": textColor.hex,
    collections[] {
      _key,
      _ref,
      _type
    }
  },

   _type == "bannerSlider" => {
  fullWidth,
  height,
  autoplay,
  overlayOpacity,
  styling {
    "backgroundColor": backgroundColor.hex,
    "textColor": textColor.hex,
    "buttonBg": buttonBg.hex,
    "buttonText": buttonText.hex
  },
  ctaText,
  ctaPosition {
    horizontal,
    vertical
  },
  ctaLink[] {
    _type,
    url, 
    reference->{
      _type,
      "slug": slug.current,
      _id
    }
  },
  showArrows,
  slides[] {
    type,
    heading,
    subheading,
    "imageUrl": image.asset->url,
    "videoUrl": video.asset->url
  }
},
    
     // NEWSLETTER
    _type == "newsletter" => {
      _type,
      title,
      subtitle,
      buttonText,
      placeholder,
      "backgroundColor": backgroundColor.hex,
      "textColor": textColor.hex,
      "buttonBgColor": buttonBgColor.hex,
      "buttonTextColor": buttonTextColor.hex,
      layout,
      maxWidth,
      inputRadius
    },

    //FAQ
    _type == 'faq' => {
      _id,
      enabled,
      title,
      description,
      titleAlign,
      layoutType,
      // Content
      items[] {
        question,
        answer
      },
      // Styling
      "backgroundColor": backgroundColor.hex,
      "itemBgColor": itemBgColor.hex,
      "questionColor": questionColor.hex,
      "answerColor": answerColor.hex,
      "accentColor": accentColor.hex,
      maxWidth,
      itemPadding,
      questionSize,
      answerSize,
      cardRadius
    },

    _type == 'servicesGrid' => {
      _type,
      _key,
      subtitle,
      heading,
      description,
      theme {
        "bg": bg.hex,
        padding
      },
      features[] {
        title,
        description,
        "iconUrl": icon.asset->url
      }
    },

    _type == 'logoSlider' => {
    enable,
    title,
    "backgroundcol": backgroundcol.hex,
    autoScroll,
    speed,
    logos[]{
      "image": image.asset->{
        url,
        altText
      },
      link
    }
  },

    },

}
`;
