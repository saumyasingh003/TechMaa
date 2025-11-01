import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Footer from "../../components/student/Footer";
import { toast } from "react-toastify";
import axios from 'axios';
import Loading from "../../components/student/Loading";
import { BookOpen, Clock, CheckCircle, PlayCircle } from "lucide-react";

const MyEnrollments = () => {
  const { 
    enrolledCourses, 
    calculateCourseDuration, 
    navigate, 
    userData, 
    fetchUserEnrolledCourses, 
    backendUrl, 
    getToken, 
    calculateNoOfeLectures 
  } = useContext(AppContext);
  
  const [progressArray, setProgressArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProgressLoading, setIsProgressLoading] = useState(false);

  const getProgressData = async () => {
    if (!enrolledCourses || enrolledCourses.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      setIsProgressLoading(true);
      const token = await getToken();

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          try {
            // Get course progress
            const { data } = await axios.get(
              `${backendUrl}/api/user/get-course-progress/${course._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // Calculate total lectures from course content
            const totalLectures = course.courseContent?.reduce((total, chapter) => {
              return total + (Array.isArray(chapter.chapterContent) ? chapter.chapterContent.length : 0);
            }, 0) || 0;

            // Get completed lectures count from progress data
            const lectureCompleted = Array.isArray(data.progressData?.lectureCompleted) 
              ? data.progressData.lectureCompleted.length 
              : 0;

            return { 
              totalLectures, 
              lectureCompleted,
              courseId: course._id 
            };
          } catch (error) {
            console.error(`Error fetching progress for course ${course._id}:`, error);
            return { 
              totalLectures: 0, 
              lectureCompleted: 0,
              courseId: course._id 
            };
          }
        })
      );
      
      setProgressArray(tempProgressArray);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to load progress";
      toast.error(errorMessage);
    } finally {
      setIsProgressLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
    }
  }, [userData]);

  useEffect(() => {
    if (enrolledCourses && enrolledCourses.length > 0) {
      getProgressData();
    } else {
      setIsLoading(false);
    }
  }, [enrolledCourses]);

  const calculateProgress = (index) => {
    if (!progressArray[index]) return 0;
    const { lectureCompleted, totalLectures } = progressArray[index];
    if (totalLectures === 0) return 0;
    return Math.round((lectureCompleted * 100) / totalLectures);
  };

  const isCompleted = (index) => {
    if (!progressArray[index]) return false;
    const { lectureCompleted, totalLectures } = progressArray[index];
    return totalLectures > 0 && lectureCompleted === totalLectures;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              My Enrollments
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Track your learning progress and continue where you left off
            </p>
          </div>

          {!enrolledCourses || enrolledCourses.length === 0 ? (
            <div className="text-center py-16 md:py-20">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
                  No Enrollments Yet
                </h2>
                <p className="text-gray-600 mb-8">
                  Start your learning journey by enrolling in courses that interest you.
                </p>
                <button
                  onClick={() => navigate("/course-list")}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  <BookOpen className="size-5" />
                  <span>Browse Courses</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Course
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">
                        Duration
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">
                        Progress
                      </th>
                      <th className="px-4 md:px-6 py-4 text-right text-sm font-semibold text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {enrolledCourses.map((course, index) => {
                      const progress = calculateProgress(index);
                      const completed = isCompleted(index);
                      
                      return (
                        <tr 
                          key={course._id || index} 
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="relative flex-shrink-0">
                                <img
                                  src={course.courseThumbnail}
                                  alt={course.courseTitle || "Course"}
                                  className="w-16 h-12 sm:w-24 sm:h-16 md:w-28 md:h-20 object-cover rounded-lg"
                                  loading="lazy"
                                />
                                {completed && (
                                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                                    <CheckCircle className="size-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm md:text-base">
                                  {course.courseTitle || "Untitled Course"}
                                </p>
                                <div className="space-y-1">
                                  <Line
                                    strokeWidth={3}
                                    percent={progress}
                                    strokeColor={completed ? "#10b981" : "#3b82f6"}
                                    trailColor="#e5e7eb"
                                    className="w-full"
                                  />
                                  <p className="text-xs text-gray-500">
                                    {progress}% Complete
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Clock className="size-4 text-gray-400" />
                              <span className="text-sm">
                                {calculateCourseDuration(course) || "N/A"}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                            {progressArray[index] ? (
                              <div className="text-sm text-gray-700">
                                <span className="font-medium">
                                  {progressArray[index].lectureCompleted}
                                </span>
                                <span className="text-gray-500">
                                  {" / "}
                                  {progressArray[index].totalLectures}
                                </span>
                                <span className="text-gray-500 ml-1">
                                  Lectures
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">Loading...</span>
                            )}
                          </td>

                          <td className="px-4 md:px-6 py-4 text-right">
                            <button
                              onClick={() => navigate("/player/" + course._id)}
                              disabled={isProgressLoading}
                              className={`inline-flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                completed
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                              }`}
                            >
                              {completed ? (
                                <>
                                  <CheckCircle className="size-4" />
                                  <span className="hidden sm:inline">Completed</span>
                                  <span className="sm:hidden">Done</span>
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="size-4" />
                                  <span className="hidden sm:inline">Continue</span>
                                  <span className="sm:hidden">Play</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MyEnrollments;