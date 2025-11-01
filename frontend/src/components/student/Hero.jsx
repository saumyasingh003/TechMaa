import React from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";
import Loading from '../../components/student/Loading';

const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center w-full min-h-[600px] md:min-h-[700px] px-4 sm:px-6 md:px-8 lg:px-12 py-16 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.08),transparent_50%)]"></div>
      
      <div className="relative z-10 flex flex-col items-center space-y-6 md:space-y-8 max-w-5xl mx-auto">
        <div className="relative">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight max-w-4xl text-center">
  Shape your career with learning{" "}
  <span className="relative">
    <span className="text-red-600">made for you</span>
    {assets.sketch && (
      <img
        src={assets.sketch}
        alt=""
        className="hidden md:block absolute -bottom-2 lg:-bottom-3 right-0 w-32 lg:w-40 pointer-events-none"
        loading="lazy"
      />
    )}
  </span>
</h1>

        </div>

        <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl px-4 text-center">
          <span className="hidden md:inline">
            We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals.
          </span>
          <span className="md:hidden">
            We bring together world-class instructors to help you achieve your professional goals.
          </span>
        </p>

        <div className="w-full max-w-3xl mt-4 md:mt-6">
          <SearchBar />
        </div>

        <div className="hidden md:flex items-center gap-8 mt-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full"></div>
            <span>Expert Instructors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full "></div>
            <span>Interactive Learning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full "></div>
            <span>Flexible Schedule</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;