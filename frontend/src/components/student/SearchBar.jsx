import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data || "");
  const [isFocused, setIsFocused] = useState(false);

  const onSearchHandler = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    
    if (!trimmedInput) {
      return;
    }
    
    navigate("/course-list/" + encodeURIComponent(trimmedInput));
  };

  const handleClear = () => {
    setInput("");
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className={`relative w-full max-w-3xl mx-auto transition-all duration-200 ${
        isFocused ? "scale-[1.02]" : ""
      }`}
    >
      <div
        className={`flex items-center h-14 md:h-16 bg-white rounded-xl shadow-md transition-all duration-200 ${
          isFocused 
            ? "ring-2 ring-[#FED642] shadow-lg" 
            : "ring-1 ring-gray-200 hover:shadow-lg"
        }`}
      >
        <div className="flex items-center justify-center pl-5 pr-3">
          <Search className="size-5 text-gray-400" />
        </div>

        <input
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={input}
          type="text"
          placeholder="Search for courses, skills, or topics..."
          className="flex-1 h-full px-2 outline-none text-gray-800 placeholder:text-gray-400 text-sm md:text-base"
          maxLength={100}
        />

        {input && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 mr-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Clear search"
          >
            <X className="size-5" />
          </button>
        )}

        <button
          type="submit"
          disabled={!input.trim()}
          className="h-10 md:h-12 px-6 md:px-8 mr-1.5 bg-[#FED642] text-gray-900 font-medium rounded-lg hover:bg-[#e5c13b] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 text-sm md:text-base"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;