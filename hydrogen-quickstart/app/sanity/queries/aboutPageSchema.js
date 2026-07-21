export const ABOUT_PAGE_SCHEMA_QUERY = `
  *[_type == "aboutPageSchema"][0] {
    title,
    
    // --- STORY SECTION ---
    storyHeading,
    storyBody,
    "storyBgColor": storyBgColor.hex,

    // --- FEATURE SECTION ---
    featureLayout,
    featureImage {
      asset-> { url, metadata { lqip } },
      alt
    },
    featureHeading,
    featureBody,
    featureButton {
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
    },

    // --- CORE VALUES SECTION ---
    valuesHeading,
    "valuesBgColor": valuesBgColor.hex,
    valuesList[] {
      _key,
      number,
      title,
      description
    }
  }
`;
