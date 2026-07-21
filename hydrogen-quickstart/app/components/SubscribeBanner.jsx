import {Link} from 'react-router';

export default function SubscribeBanner() {
  return (
    <div className="bg-[#2A7CC7] w-full mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left Content */}
        <div className="text-white max-w-lg">
          <h2 className="text-3xl font-bold mb-3">
            Subscribe For Latest Updates
          </h2>

          <p className="text-[#FFFFFF] text-sm leading-relaxed">
            The gradual accumulation of information about atomic and
            small-scale behavior during the first quarter of the 20th century.
          </p>
        </div>

        {/* Button */}
        <Link
          to="/"
          className="bg-[#23A6F0] hover:bg-cyan-600 text-white font-semibold px-8 py-3 rounded-md transition"
        >
          Get Started
        </Link>

      </div>
    </div>
  );
}