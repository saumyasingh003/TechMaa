import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";
import PaymentModal from "../../components/student/PaymentModal";
import { 
  Star, 
  Clock, 
  BookOpen, 
  Users, 
  ChevronDown, 
  Play, 
  CheckCircle, 
  Award,
  Download,
  LifeBuoy,
  FileText
} from "lucide-react";

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const {
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfeLectures,
    currency,
    backendUrl,
    userData,
    getToken,
  } = useContext(AppContext);

  const fetchCoursesData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/course/${id}`);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to load course";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const enrollCourse = async () => {
    if (!userData) {
      toast.warn("Please login to enroll in this course");
      return;
    }

    if (isAlreadyEnrolled) {
      toast.info("You are already enrolled in this course");
      return;
    }

    try {
      setEnrolling(true);
      const token = await getToken();

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      setShowPaymentModal(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to enroll";
      toast.error(errorMessage);
    } finally {
      setEnrolling(false);
    }
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handlePreview = (lectureUrl) => {
    const videoId = lectureUrl?.split("/").pop();
    if (videoId) {
      setPlayerData({ videoId });
    }
  };

  useEffect(() => {
    if (id) {
      fetchCoursesData();
    }
  }, [id]);

  useEffect(() => {
    if (userData && courseData) {
      const isEnrolled = userData.enrolledCourses?.some(
        (course) => course._id === courseData._id || course === courseData._id
      );
      setIsAlreadyEnrolled(isEnrolled);
    }
  }, [userData, courseData]);

  if (loading) return <Loading />;

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600">
            The course you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  const rating = calculateRating ? calculateRating(courseData) : 0;
  const reviewCount = courseData.courseRatings?.length || 0;
  const studentCount = courseData.enrolledStudents?.length || 0;
  const originalPrice = courseData.coursePrice || 0;
  const discount = courseData.discount || 0;
  const finalPrice = (originalPrice - (discount * originalPrice) / 100).toFixed(2);
  const totalLectures = calculateNoOfeLectures ? calculateNoOfeLectures(courseData) : 0;
  const duration = calculateCourseDuration ? calculateCourseDuration(courseData) : "N/A";

  return (
    <>
      <div className="relative bg-gradient-to-b from-blue-50 via-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {courseData.courseTitle || "Untitled Course"}
                </h1>
                
                {courseData.courseDescription && (
                  <div
                    className="text-gray-600 text-base md:text-lg leading-relaxed line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: courseData.courseDescription.slice(0, 250),
                    }}
                  />
                )}

                <div className="flex flex-wrap items-center gap-4 mt-6 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900">
                        {rating.toFixed(1)}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${
                              i < Math.floor(rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-blue-600">
                      ({reviewCount} {reviewCount === 1 ? "rating" : "ratings"})
                    </span>
                  </div>

                  <div className="h-4 w-px bg-gray-300"></div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="size-4" />
                    <span>
                      {studentCount} {studentCount === 1 ? "student" : "students"}
                    </span>
                  </div>
                </div>

                {courseData.educator?.name && (
                  <p className="mt-4 text-gray-600">
                    Created by{" "}
                    <span className="text-blue-600 font-medium">
                      {courseData.educator.name}
                    </span>
                  </p>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Course Content
                </h2>

                {courseData.courseContent && courseData.courseContent.length > 0 ? (
                  <div className="space-y-3">
                    {courseData.courseContent.map((chapter, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors duration-200"
                      >
                        <button
                          className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => toggleSection(index)}
                        >
                          <div className="flex items-center gap-3">
                            <ChevronDown
                              className={`size-5 text-gray-600 transition-transform duration-300 ${
                                openSections[index] ? "rotate-180" : ""
                              }`}
                            />
                            <span className="font-semibold text-gray-900 text-left">
                              {chapter.chapterTitle || `Chapter ${index + 1}`}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {chapter.chapterContent?.length || 0} lectures • {calculateChapterTime ? calculateChapterTime(chapter) : "N/A"}
                          </span>
                        </button>

                        {openSections[index] && chapter.chapterContent && (
                          <div className="bg-white border-t border-gray-200">
                            {chapter.chapterContent.map((lecture, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <Play className="size-4 text-gray-400 flex-shrink-0" />
                                  <span className="text-gray-700 text-sm md:text-base">
                                    {lecture.lectureTitle || `Lecture ${i + 1}`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  {lecture.isPreviewFree && (
                                    <button
                                      onClick={() => handlePreview(lecture.lectureUrl)}
                                      className="text-[#FED642] hover:text-[#e5c13b] font-medium text-xs md:text-sm transition-colors duration-200"
                                    >
                                      Preview
                                    </button>
                                  )}
                                  <span className="text-blue-600 text-xs md:text-sm font-medium">
                                    {humanizeDuration(
                                      (lecture.lectureDuration || 0) * 60 * 1000,
                                      { units: ["h", "m"], round: true }
                                    )}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No course content available</p>
                )}
              </div>

              {courseData.courseDescription && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                    About This Course
                  </h2>
                  <div
                    className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: courseData.courseDescription,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {playerData ? (
                    <YouTube
                      videoId={playerData.videoId}
                      opts={{ playerVars: { autoplay: 1 } }}
                      iframeClassName="w-full aspect-video"
                    />
                  ) : courseData.courseThumbnail ? (
                    <img
                      src={courseData.courseThumbnail}
                      alt={courseData.courseTitle}
                      className="w-full aspect-video object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <BookOpen className="size-16 text-gray-400" />
                    </div>
                  )}

                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-gray-900">
                          <span>{currency}{finalPrice}</span>
                        </div>
                        {discount > 0 && (
                          <>
                            <span className="text-lg text-gray-500 line-through">
                              {currency}{originalPrice.toFixed(2)}
                            </span>
                            <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
                              {discount}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Star className="size-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-medium">{rating.toFixed(1)}</span>
                        </div>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-4" />
                          <span>{duration}</span>
                        </div>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="size-4" />
                          <span>{totalLectures} lessons</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={enrollCourse}
                      disabled={isAlreadyEnrolled || enrolling}
                      className={`w-full py-3.5 rounded-lg font-semibold text-base transition-all duration-200 ${
                        isAlreadyEnrolled
                          ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                          : "bg-[#FED642] text-gray-900 hover:bg-[#e5c13b] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      }`}
                    >
                      {enrolling
                        ? "Processing..."
                        : isAlreadyEnrolled
                        ? "Already Enrolled"
                        : "Enroll Now"}
                    </button>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        This course includes:
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-gray-700">
                          <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Lifetime access with free updates</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-700">
                          <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Step-by-step project guidance</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-700">
                          <Download className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Downloadable resources and code</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-700">
                          <FileText className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Quizzes and assignments</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-700">
                          <Award className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Certificate of completion</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-700">
                          <LifeBuoy className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Direct instructor support</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          if (!enrolling) {
            setShowPaymentModal(false);
          }
        }}
        amount={finalPrice}
        currency={currency}
        onSuccess={async () => {
          try {
            const token = await getToken();
            if (!courseData?._id) {
              throw new Error("Course ID is missing");
            }
            const { data } = await axios.post(
              `${backendUrl}/api/user/purchase`,
              { courseId: courseData._id.toString() },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (data.success) {
              toast.success("Course enrolled successfully!");
              setTimeout(() => {
                window.location.href = data.redirectUrl;
              }, 1000);
            } else {
              toast.error(data.message);
            }
          } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to process enrollment";
            toast.error(errorMessage);
          }
        }}
        onFailure={() => {
          toast.error("Payment failed. Please try again.");
          setShowPaymentModal(false);
        }}
      />
    </>
  );
};

export default CourseDetails;