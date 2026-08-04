import { useLocation, useNavigate, useParams } from 'react-router';

export function CountrySelector({ localization, fontSettings }) {

  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { locale } = useParams();

  const countries = localization?.availableCountries ?? [];

  const handleChange = (event) => {
    const newCountryCode = event.target.value.toLowerCase();
    const pathWithoutLocale = locale ? pathname.replace(`/${locale}`, '') : pathname;
    const cleanPath = pathWithoutLocale.startsWith('/') ? pathWithoutLocale : `/${pathWithoutLocale}`;

    const newPath = newCountryCode === 'us'
      ? `${cleanPath}${search}`
      : `/${newCountryCode}${cleanPath}${search}`;

    navigate(newPath.replace(/\/\//g, '/'));
  };

  if (countries.length < 2) return null;

  // Find the currently active country so we know what name to display
  const currentLocaleCode = locale ? locale.toLowerCase() : 'us';
  const selectedCountry = countries.find(
    (country) => country.isoCode.toLowerCase() === currentLocaleCode
  ) || countries[0];


  const dynamicStyles = `
    .fontStyles {
      font-family: ${fontSettings.fontFamily};
      font-size: ${fontSettings.fontSize};
      font-weight: ${fontSettings.fontWeight};
      line-height: ${fontSettings.lineHeight};
      letter-spacing: ${fontSettings.letterSpacing};
    }
  `;

  return (
    <>
      <style>{dynamicStyles}</style>
      <div className="relative flex items-center gap-1 cursor-pointer">

        <span className="fontStyles whitespace-nowrap">
          <span className="md:hidden">{selectedCountry?.isoCode}</span>

          <span className="hidden md:inline">{selectedCountry?.name}</span>
        </span>

        <svg
          className="w-2.5 h-2.5 text-gray-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>

        {/* <select
        onChange={handleChange}
        value={currentLocaleCode}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer fontStyles"
      >
        {countries.map((country) => (
          <option 
            key={country.isoCode} 
            value={country.isoCode.toLowerCase()}
          >
            {country.name} ({country.currency.isoCode} {country.currency.symbol})
          </option>
        ))}
      </select> */}
      </div>
    </>
  );
}