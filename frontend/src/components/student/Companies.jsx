import React from "react";
import { assets } from "../../assets/assets";

const Companies = () => {
  const companies = [
    { src: assets.microsoft_logo, alt: "Microsoft", name: "Microsoft" },
    { src: assets.walmart_logo, alt: "Walmart", name: "Walmart" },
    { src: assets.accenture_logo, alt: "Accenture", name: "Accenture" },
    { src: assets.adobe_logo, alt: "Adobe", name: "Adobe" },
    { src: assets.paypal_logo, alt: "PayPal", name: "PayPal" }
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm sm:text-base md:text-lg font-medium text-gray-600 text-center mb-8 md:mb-12">
          Trusted by learners from leading companies worldwide
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          {companies.map((company) => (
            company.src ? (
              <div
                key={company.name}
                className="flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <img
                  src={company.src}
                  alt={company.alt}
                  className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                  loading="lazy"
                />
              </div>
            ) : null
          ))}
        </div>
      </div>
    </section>
  );
};

export default Companies;