import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Successfully subscribed to our newsletter!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <footer className="bg-gray-700 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-16 pb-10 md:pb-12 border-b border-white/10">
          <div className="flex flex-col items-center md:items-start">
            {assets.logo ? (
              <div className="text-white flex justify-center items-center gap-2 mb-4">
                <img
                  src={assets.logo}
                  alt="TechMaacademy"
                  className="size-10 transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
                <h1 className=" text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TechMaacademy
                </h1>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-white mb-6">
                TechMaa
              </h2>
            )}
            <p className="text-sm text-gray-400 leading-relaxed text-center md:text-left max-w-xs">
              Empowering learners worldwide with high-quality courses and expert
              instructors to achieve their goals.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-white text-lg mb-5">Company</h3>
            <ul className="flex flex-col space-y-3 w-full">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-white text-lg mb-5">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 text-center md:text-left">
              Get the latest news, articles, and resources delivered to your
              inbox.
            </p>
            <form onSubmit={handleSubscribe} className="w-full max-w-sm">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    className="w-full h-11 pl-10 pr-4 bg-gray-800 border border-gray-700 text-gray-300 placeholder-gray-500 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  <span>{isSubmitting ? "Subscribing..." : "Subscribe"}</span>
                  {!isSubmitting && (
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} TechMaacademy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
