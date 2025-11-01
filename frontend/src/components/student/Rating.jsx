import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

const Rating = ({ initialRating, onRate, disabled = false }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRating = (value) => {
    if (disabled) return;
    setRating(value);
    if (onRate) onRate(value);
  };

  useEffect(() => {
    if (initialRating !== undefined && initialRating !== null) {
      setRating(initialRating);
    }
  }, [initialRating]);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoveredRating || rating);
        
        return (
          <button
            key={index}
            type="button"
            className={`transition-all duration-200 ${
              disabled ? "cursor-default" : "cursor-pointer hover:scale-110"
            }`}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => !disabled && setHoveredRating(starValue)}
            onMouseLeave={() => !disabled && setHoveredRating(0)}
            disabled={disabled}
            aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
          >
            <Star
              className={`size-6 sm:size-7 transition-colors duration-200 ${
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-300"
              }`}
            />
          </button>
        );
      })}
      {rating > 0 && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating}.0
        </span>
      )}
    </div>
  );
};

export default Rating;