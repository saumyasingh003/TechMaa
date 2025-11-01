import React, { useContext, useEffect, useState } from "react";
import Loading from "../../components/student/Loading";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Users, Calendar, BookOpen } from "lucide-react";

const StudentsEnrolled = () => {
  const { backendUrl, isEducator, getToken } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEnrolledStudents = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/educator/enrolled-students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setEnrolledStudents(data.enrolledStudets ? data.enrolledStudets.reverse() : []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to load enrolled students";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  if (isLoading) {
    return <Loading />;
  }

  if (!enrolledStudents) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Unable to Load Students
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
            Enrolled Students
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            View all students enrolled in your courses
          </p>
        </div>

        {enrolledStudents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-16">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
                No Students Enrolled Yet
              </h2>
              <p className="text-gray-600">
                Students who enroll in your courses will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 hidden sm:table-cell">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">
                      Enrolled Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {enrolledStudents.map((item, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-center text-gray-600 text-sm font-medium hidden sm:table-cell">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.student?.imageUrl ? (
                            <img
                              src={item.student.imageUrl}
                              alt={item.student.name || "Student"}
                              className="size-10 rounded-full object-cover border-2 border-gray-200"
                              loading="lazy"
                            />
                          ) : (
                            <div className="size-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                              {item.student?.name ? item.student.name.charAt(0).toUpperCase() : "U"}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {item.student?.name || "Unknown Student"}
                            </p>
                            <p className="text-xs text-gray-500 lg:hidden mt-1">
                              {formatDate(item.purchaseDate)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <BookOpen className="size-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm line-clamp-2">
                            {item.courseTitle || "Untitled Course"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Calendar className="size-4" />
                          <span>{formatDate(item.purchaseDate)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Total Enrollments:{" "}
                <span className="font-semibold text-gray-900">
                  {enrolledStudents.length}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default StudentsEnrolled;