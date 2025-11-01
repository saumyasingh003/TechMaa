import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";
import Loading from "../../components/student/Loading";
import { ArrowRight } from "lucide-react";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);
  const courses = Array.isArray(allCourses) ? allCourses : [];
  const isLoading = !allCourses;

  const handleViewAllClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <Loading />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            Learn from the best
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl">
            Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16 md:py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                No courses available yet
              </h3>
              <p className="text-gray-600">
                Check back soon for new courses and learning opportunities.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-10 md:mb-12">
              {courses.slice(0, 4).map((course) => (
                <CourseCard key={course._id || course.id} course={course} />
              ))}
            </div>

            <div className="flex justify-center">
              <Link
                to="/course-list"
                onClick={handleViewAllClick}
                className="group inline-flex items-center gap-2 text-gray-700 font-medium border-2 border-gray-300 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200"
              >
                <span>View All Courses</span>
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;