import {useEffect, useState} from 'react';

export default function PopupForm({isOpen, onClose, overline, heading, body, buttonText}) {
  useEffect(() => {
    // Disable scrolling on the body when modal is open
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const inputClasses = 'w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-base text-gray-800 placeholder:text-gray-400 focus:ring-sky-500 focus:border-sky-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black bg-opacity-70 transition-opacity" onClick={onClose}>
      <div className="relative w-full max-w-2xl bg-white p-12 md:p-16 rounded-xl shadow-3xl text-center space-y-12 overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-gray-900 p-2 rounded-full border border-gray-100 hover:border-gray-300">
          ✕
        </button>

        <div className="space-y-4 max-w-lg mx-auto">
          {overline && <p className="text-sm font-semibold text-sky-500 uppercase tracking-widest">{overline}</p>}
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">{heading}</h2>
          {body && <p className="text-lg text-gray-600 leading-relaxed pt-2">{body}</p>}
        </div>

        {/* --- DUMMY FORM --- */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6">
          <input type="text" placeholder="Full Name *" className={inputClasses} required />
          <input type="email" placeholder="Email *" className={inputClasses} required />
          
          <div className="relative">
            <select className={inputClasses} required>
              <option value="" disabled selected>Please Select</option>
              <option value="consultation">Consultation</option>
              <option value="support">Support</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="relative">
            <select className={inputClasses} required>
              <option value="" disabled selected>Please Select a Time</option>
              <option value="morning">Morning (9am - 12pm)</option>
              <option value="afternoon">Afternoon (1pm - 5pm)</option>
              <option value="evening">Evening (6pm - 8pm)</option>
            </select>
          </div>
          
          <textarea placeholder="Message" className={`${inputClasses} md:col-span-2`} rows={5} />

          <div className="md:col-span-2 pt-8">
            <button
              type="submit"
              className="w-full px-12 py-4 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition uppercase tracking-widest text-base"
              onClick={(e) => e.preventDefault()} // Dummy submission
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}