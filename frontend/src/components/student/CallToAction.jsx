import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useClerk, useUser } from "@clerk/clerk-react";
import { ArrowRight, PlayCircle } from "lucide-react";

const CallToAction = () => {
  const { navigate } = useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const handleGetStarted = () => {
    if (user) {
      navigate("/course-list");
    } else {
      openSignIn();
    }
  };

  const handleLearnMore = () => {
    navigate("/course-list");
  };

  return (
    <section className="relative py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_50%)]"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="space-y-5 md:space-y-6 mb-8 md:mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Learn anything, anytime, anywhere
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Start your learning journey today with access to thousands of courses, expert instructors, and a community of learners from around the world.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
          <button
            onClick={handleGetStarted}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-3.5 md:py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200"
          >
            <span>Get Started</span>
            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          <button
            onClick={handleLearnMore}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-3.5 md:py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all duration-200"
          >
            <PlayCircle className="size-5" />
            <span>Explore Courses</span>
          </button>
        </div>

        <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-8 text-white/90 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span>Free trial available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;