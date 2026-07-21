import React, { useState } from 'react';

export default function Newsletter({ module }) {
  if (!module) return null;

  const {
    title = 'Join our newsletter',
    subtitle,
    buttonText = 'Subscribe',
    placeholder = 'your@email.com',
    backgroundColor = '#FFFFFF',
    textColor = '#000000',
    buttonBgColor = '#000000',
    buttonTextColor = '#FFFFFF',
    layout = 'stacked',
    maxWidth = 'max-w-4xl',
    inputRadius = 'md',
  } = module;

  console.log("module Newsletter", module);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const radiusMap = {
    none: 'rounded-none',
    md: 'rounded-lg',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  const isSplit = layout === 'split';

  return (
    <section 
      className="py-20 px-6" 
      style={{ backgroundColor }}
    >
      <div className={`mx-auto ${maxWidth}`}>
        <div className={`flex flex-col ${isSplit ? 'lg:flex-row lg:items-center lg:justify-between' : 'items-center text-center'} gap-10 md:gap-16`}>
          
          {/* Text Block */}
          <div className={`${isSplit ? 'lg:max-w-md' : 'max-w-2xl'} space-y-4`}>
            {title && (
              <h2 
                className="text-4xl md:text-5xl font-serif tracking-tight"
                style={{ color: textColor }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p 
                className="text-lg opacity-80 leading-relaxed"
                style={{ color: textColor }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Block */}
          <div className={`w-full ${isSplit ? 'lg:max-w-md' : 'max-w-xl'}`}>
            {status === 'success' ? (
              <div 
                className={`p-6 text-center animate-in fade-in zoom-in duration-500 ${radiusMap[inputRadius]}`}
                style={{ backgroundColor: `${buttonBgColor}10`, color: textColor }}
              >
                <p className="font-medium text-lg">Thank you for joining! ✨</p>
                <p className="text-sm opacity-70 mt-1">Check your inbox for a confirmation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    required
                    placeholder={placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    className={`w-full px-6 py-4 bg-transparent border transition-all outline-none focus:ring-2 focus:ring-offset-2 ${radiusMap[inputRadius]}`}
                    style={{ 
                      borderColor: `${textColor}30`, 
                      color: textColor,
                      '--tw-ring-color': buttonBgColor 
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`px-8 py-4 font-bold uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${radiusMap[inputRadius]}`}
                  style={{ 
                    backgroundColor: buttonBgColor, 
                    color: buttonTextColor 
                  }}
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending
                    </span>
                  ) : buttonText}
                </button>
              </form>
            )}
            <p className="mt-4 text-[10px] uppercase tracking-widest opacity-40 text-center lg:text-left">
              Unsubscribe at any time.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}