import React from 'react';

const StaticLogoSlider = () => {
  const logos = [
    { name: 'Hooli', path: '/logos/hooli.png' },
    { name: 'Lyft', path: '/logos/lyft.png' },
    { name: 'Leaf', path: '/logos/leaf.png' },
    { name: 'Stripe', path: '/logos/stripe.png' },
    { name: 'AWS', path: '/logos/aws.png' },
    { name: 'Reddit', path: '/logos/monkey.png' }
  ];

  return (
    <div className="w-full bg-[#FAFAFA] py-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-6">
        
        {logos.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center flex-1"
          >
            <img
              src={logo.path}
              alt={logo.name}
              className="h-8 md:h-10 object-contain 
              opacity-70 grayscale 
              hover:opacity-100 hover:grayscale-0 
              transition-all duration-300"
            />
          </div>
        ))}

      </div>
    </div>
  );
};

export default StaticLogoSlider;