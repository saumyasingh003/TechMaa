import React, { useState } from "react";
import { assets, dummyTestimonial } from "../../assets/assets";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const [expandedCards, setExpandedCards] = useState({});
  const testimonials = Array.isArray(dummyTestimonial) ? dummyTestimonial : [];

  const toggleReadMore = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            Testimonials
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl">
            Hear from our learners as they share their journeys of transformation, success, and how our platform has made a difference in their lives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => {
            const isExpanded = expandedCards[index];
            const needsTruncation = testimonial.feedback && testimonial.feedback.length > 150;
            const displayText = isExpanded ? testimonial.feedback : truncateText(testimonial.feedback);

            return (
              <div
                key={index}
                className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                  {testimonial.image ? (
                    <img
                      className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm"
                      src={testimonial.image}
                      alt={testimonial.name || "User"}
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                      {testimonial.name ? testimonial.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {testimonial.name || "Anonymous"}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {testimonial.role || "Student"}
                    </p>
                  </div>
                </div>

                <div className="flex-1 p-5 space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => {
                      const rating = testimonial.rating || 0;
                      const isFilled = i < Math.floor(rating);
                      
                      return (
                        <Star
                          key={i}
                          className={`size-5 ${
                            isFilled
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      );
                    })}
                  </div>

                  <div className="relative">
                    <Quote className="absolute -top-1 -left-1 size-6 text-blue-100" />
                    <p className="text-gray-700 leading-relaxed pl-6">
                      {displayText || "No feedback provided"}
                    </p>
                  </div>
                </div>

                {needsTruncation && (
                  <div className="px-5 pb-5">
                    <button
                      onClick={() => toggleReadMore(index)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;