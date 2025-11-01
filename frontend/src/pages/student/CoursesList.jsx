import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/student/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../components/student/CourseCard";
import Footer from "../../components/student/Footer";
import Loading from "../../components/student/Loading";
import { X, BookOpen, ChevronRight } from "lucide-react";

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();
      const filtered = input
        ? tempCourses.filter((item) =>
            item.courseTitle?.toLowerCase().includes(input.toLowerCase())
          )
        : tempCourses;
      
      setFilteredCourses(filtered);
      setIsLoading(false);
    } else if (allCourses) {
      setFilteredCourses([]);
      setIsLoading(false);
    }
  }, [allCourses, input]);

  const handleClearSearch = () => {
    navigate("/course-list");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start justify-between mb-8 md:mb-12">
            <div className="flex-shrink-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                Course Library
              </h1>
              <nav className="flex items-center gap-2 text-sm md:text-base text-gray-600">
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  Home
                </button>
                <ChevronRight className="size-4 text-gray-400" />
                <span className="text-gray-900 font-medium">Courses</span>
                {input && (
                  <>
                    <ChevronRight className="size-4 text-gray-400" />
                    <span className="text-gray-900 font-medium truncate max-w-[150px]">
                      {input}
                    </span>
                  </>
                )}
              </nav>
            </div>

            <div className="w-full md:w-auto md:min-w-[400px]">
              <SearchBar data={input} />
            </div>
          </div>

          {input && (
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-blue-50 border border-blue-200 rounded-lg text-gray-700">
                <span className="text-sm font-medium">
                  Searching for:{" "}
                  <span className="text-blue-600 font-semibold">{input}</span>
                </span>
                <button
                  onClick={handleClearSearch}
                  className="p-1 hover:bg-blue-100 rounded-full transition-colors duration-200"
                  aria-label="Clear search"
                >
                  <X className="size-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}

          {filteredCourses.length === 0 ? (
            <div className="text-center py-16 md:py-20">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
                  {input ? "No Courses Found" : "No Courses Available"}
                </h2>
                <p className="text-gray-600 mb-8">
                  {input
                    ? `We couldn't find any courses matching "${input}". Try searching with different keywords.`
                    : "Check back soon for new courses and learning opportunities."}
                </p>
                {input && (
                  <button
                    onClick={handleClearSearch}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    <span>View All Courses</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600 text-sm md:text-base">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredCourses.length}
                  </span>{" "}
                  {filteredCourses.length === 1 ? "course" : "courses"}
                  {input && (
                    <span>
                      {" "}
                      for{" "}
                      <span className="font-semibold text-blue-600">
                        "{input}"
                      </span>
                    </span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard key={course._id || course.id} course={course} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CoursesList;