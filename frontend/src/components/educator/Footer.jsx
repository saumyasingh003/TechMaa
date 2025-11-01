import React from "react";
import { assets } from "../../assets/assets";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {assets.logo && (
              <>
                <img 
                  className="hidden md:block h-12 w-auto" 
                  src={assets.logo} 
                  alt="TechMaacademy Logo" 
                />
                <div className="hidden md:block w-px h-8 bg-gray-300"></div>
              </>
            )}
            <p className="text-xs md:text-sm text-gray-600 text-center md:text-left">
              &copy; {currentYear} TechMaacademy. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <Icon className="size-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;