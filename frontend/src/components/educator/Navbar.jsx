import React from "react";
import { assets } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 border-b border-gray-200 bg-white shadow-sm py-4">
      <Link to="/" className="group flex items-center gap-2.5">
        {assets.logo ? (
          <img 
            src={assets.logo} 
            alt="TechMaacademy Logo" 
            className="h-10 w-auto transition-transform duration-200 group-hover:scale-105" 
          />
        ) : (
          <div className="flex items-center gap-2">
            <GraduationCap className="size-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TechMaacademy</span>
          </div>
        )}
      </Link>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <GraduationCap className="size-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            Educator Dashboard
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-gray-900">
                {user.fullName || "Educator"}
              </p>
              <p className="text-xs text-gray-600">
                Instructor
              </p>
            </div>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "size-10 rounded-full border-2 border-blue-600"
                }
              }}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;