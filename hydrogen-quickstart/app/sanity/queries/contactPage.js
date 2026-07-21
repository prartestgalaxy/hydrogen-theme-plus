export const CONTACT_PAGE_QUERY = `
  *[_type == "contactPage"][0] {
    title,
    
    // --- HERO SECTION ---
    heroLayout,
    heroImage {
      asset-> { url, metadata { lqip } },
      alt
    },
    heroOverline,
    heroHeading,
    heroHeadingSize,
    heroAlignment,
    heroBody,
    heroContactInfo { phone, fax },
    heroSocialLinks[] {
      _key,
      platform,
      link[] {
        _type,
        _type == "linkExternal" => { url }
      }
    },

    // --- INFO SECTION ---
    infoOverline,
    infoHeading,
    infoCards[] {
      _key,
      icon,
      label,
      details,
      button {
        text,
        link[] {
          _type,
          _type == "linkInternal" => {
            "reference": reference-> {
              _type,
              "slug": store.slug.current,
              "pageSlug": slug.current
            }
          },
          _type == "linkExternal" => { url }
        }
      }
    },

    // --- LET'S TALK SECTION ---
    ctaEnabled,
    ctaImage {
      asset-> { url, metadata { lqip } }
    },
    ctaOverline,
    ctaHeading,
    ctaBody,
    ctaButtonText,

    // --- POPUP FORM ---
    popupOverline,
    popupHeading,
    popupBody,
    popupButtonText
  }
`;