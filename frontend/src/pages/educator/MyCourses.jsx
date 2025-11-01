import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { BookOpen, Users, DollarSign, Calendar } from "lucide-react";

const MyCourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEducatorCourses = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/educator/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to load courses";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEarnings = (course) => {
    if (!course) return 0;
    return course.purchaseStats?.totalEarnings || 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (error) {
      return "N/A";
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  if (isLoading) {
    return <Loading />;
  }

  if (!courses) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Unable to Load Courses
          </h2>
          <p className="text-gray-600">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            My Courses
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Manage and track your published courses
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-16">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
                No Courses Yet
              </h2>
              <p className="text-gray-600 mb-8">
                Start creating your first course to share your knowledge with students.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">
                      Earnings
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">
                      Students
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">
                      Published
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {courses.map((course) => {
                    const earnings = calculateEarnings(course);
                    const studentCount = course.purchaseStats?.enrollmentCount || 0;
                    
                    return (
                      <tr 
                        key={course._id} 
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                              {course.courseThumbnail ? (
                                <img
                                  src={course.courseThumbnail}
                                  alt={course.courseTitle || "Course"}
                                  className="w-16 h-12 sm:w-20 sm:h-14 md:w-24 md:h-16 object-cover rounded-lg"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-16 h-12 sm:w-20 sm:h-14 md:w-24 md:h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                  <BookOpen className="size-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm md:text-base">
                                {course.courseTitle || "Untitled Course"}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 mt-2 md:hidden">
                                <span className="flex items-center gap-1 text-xs text-gray-600">
                                  <Users className="size-3" />
                                  {studentCount}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-gray-600">
                                  <DollarSign className="size-3" />
                                  {currency}{earnings}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="flex items-center gap-2 text-gray-900 font-semibold">
                            <DollarSign className="size-4 text-green-600" />
                            <span>{currency}{earnings}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 hidden sm:table-cell">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Users className="size-4 text-blue-600" />
                            <span className="font-medium">{studentCount}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Calendar className="size-4" />
                            <span>{formatDate(course.createdAt)}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {courses.length}
                  </span>{" "}
                  {courses.length === 1 ? "course" : "courses"}
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-blue-600" />
                    <span className="text-gray-600">
                      Total Students:{" "}
                      <span className="font-semibold text-gray-900">
                        {courses.reduce((total, course) => 
                          total + (course.purchaseStats?.enrollmentCount || 0), 0
                        )}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-green-600" />
                    <span className="text-gray-600">
                      Total Earnings:{" "}
                      <span className="font-semibold text-gray-900">
                        {currency}
                        {courses.reduce((total, course) => 
                          total + calculateEarnings(course), 0
                        )}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyCourses;