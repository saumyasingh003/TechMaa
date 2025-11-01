import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { Star, Users } from "lucide-react";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  if (!course) {
    return null;
  }

  const rating = calculateRating ? calculateRating(course) : 0;
  const reviewCount = course.courseRatings?.length || 0;
  const originalPrice = course.coursePrice || 0;
  const discount = course.discount || 0;
  const finalPrice = (originalPrice - (discount * originalPrice) / 100).toFixed(2);
  const hasDiscount = discount > 0;

  const handleCardClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Link
      to={`/course/${course._id}`}
      onClick={handleCardClick}
      className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {course.courseThumbnail ? (
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            src={course.courseThumbnail}
            alt={course.courseTitle || "Course thumbnail"}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
        
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            {discount}% OFF
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 space-y-3">
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 mb-2">
            {course.courseTitle || "Untitled Course"}
          </h3>
          
          {course.educator?.name && (
            <p className="text-sm text-gray-600 truncate">
              {course.educator.name}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-gray-900">
              {rating.toFixed(1)}
            </span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-3.5 ${
                    i < Math.floor(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
          
          {reviewCount > 0 && (
            <span className="text-xs text-gray-500">
              ({reviewCount})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-xl font-bold text-gray-900">
            {currency}{finalPrice}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {currency}{originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;