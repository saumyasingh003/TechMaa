  import React, { useContext, useEffect, useState } from "react";
  import { AppContext } from "../../context/AppContext";
  import { useParams } from "react-router-dom";
  import humanizeDuration from "humanize-duration";
  import YouTube from "react-youtube";
  import Rating from "../../components/student/Rating";
  import Loading from "../../components/student/Loading";
  import axios from "axios";
  import { toast } from "react-toastify";
  import { 
    ChevronDown, 
    Play, 
    CheckCircle2, 
    Clock, 
    Star,
    BookOpen
  } from "lucide-react";

  const Player = () => {
    const {
      enrolledCourses,
      calculateChapterTime,
      backendUrl,
      getToken,
      userData,
      fetchUserEnrolledCourses,
    } = useContext(AppContext);
    
    const { courseId } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [openSections, setOpenSections] = useState({});
    const [playerData, setPlayerData] = useState(null);
    const [progressData, setProgressData] = useState(null);
    const [initialRating, setInitialRating] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isMarkingComplete, setIsMarkingComplete] = useState(false);
    const [isRating, setIsRating] = useState(false);

    const getCourseData = () => {
      const course = enrolledCourses.find((c) => c._id === courseId);
      
      if (course) {
        setCourseData(course);

        const userRating = course.courseRatings?.find(
          (item) => item.userId === userData?._id
        );
        
        if (userRating) {
          setInitialRating(userRating.rating);
        }
        
        setIsLoading(false);
      }
    };

    const toggleSection = (index) => {
      setOpenSections((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    };

    const markLectureAsCompleted = async (lectureId) => {
      if (!lectureId) {
        toast.error("Invalid lecture");
        return;
      }

      try {
        setIsMarkingComplete(true);
        const token = await getToken();

        if (!token) {
          toast.error("Authentication required");
          return;
        }

        const { data } = await axios.post(
          backendUrl + "/api/user/update-course-progress",
          { courseId, lectureId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          toast.success(data.message);
          await getCourseProgress();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to mark lecture as completed";
        toast.error(errorMessage);
      } finally {
        setIsMarkingComplete(false);
      }
    };

    const getCourseProgress = async () => {
      try {
        const token = await getToken();

        if (!token) {
          return;
        }

        const { data } = await axios.get(
          `${backendUrl}/api/user/get-course-progress/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setProgressData(data.progressData);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to load progress";
        toast.error(errorMessage);
      }
    };

    const handleRate = async (rating) => {
      if (!rating || rating < 1 || rating > 5) {
        toast.error("Please select a valid rating");
        return;
      }

      try {
        setIsRating(true);
        const token = await getToken();

        if (!token) {
          toast.error("Authentication required");
          return;
        }

        const { data } = await axios.post(
          backendUrl + "/api/user/add-rating",
          { courseId, rating },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          toast.success(data.message);
          await fetchUserEnrolledCourses();
          setInitialRating(rating);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to submit rating";
        toast.error(errorMessage);
      } finally {
        setIsRating(false);
      }
    };

    const extractYouTubeVideoId = (url) => {
      if (!url) return null;
      
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.hostname === "youtu.be") {
          return parsedUrl.pathname.slice(1);
        }
        if (parsedUrl.hostname.includes("youtube.com")) {
          return parsedUrl.searchParams.get("v");
        }
      } catch (e) {
        console.error("Invalid YouTube URL", url);
      }
      return null;
    };

    const isLectureCompleted = (lectureId) => {
      return progressData?.lectureCompleted?.includes(lectureId) || false;
    };

    const handleLectureClick = (lecture, chapterIndex, lectureIndex) => {
      if (!lecture.lectureUrl) {
        toast.error("Video not available for this lecture");
        return;
      }
      
      setPlayerData({
        ...lecture,
        chapter: chapterIndex + 1,
        lecture: lectureIndex + 1,
      });
    };

    useEffect(() => {
      if (enrolledCourses && enrolledCourses.length > 0 && userData) {
        getCourseData();
      }
    }, [enrolledCourses, userData]);

    useEffect(() => {
      if (courseId) {
        getCourseProgress();
      }
    }, [courseId]);

    if (isLoading || !courseData) {
      return <Loading />;
    }

    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Course Content
                </h2>

                {courseData.courseContent && courseData.courseContent.length > 0 ? (
                  <div className="space-y-3">
                    {courseData.courseContent.map((chapter, chapterIndex) => (
                      <div
                        key={chapterIndex}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors duration-200"
                      >
                        <button
                          className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => toggleSection(chapterIndex)}
                        >
                          <div className="flex items-center gap-3">
                            <ChevronDown
                              className={`size-5 text-gray-600 transition-transform duration-300 ${
                                openSections[chapterIndex] ? "rotate-180" : ""
                              }`}
                            />
                            <span className="font-semibold text-gray-900 text-left text-sm md:text-base">
                              {chapter.chapterTitle || `Chapter ${chapterIndex + 1}`}
                            </span>
                          </div>
                          <span className="text-xs md:text-sm text-gray-600">
                            {chapter.chapterContent?.length || 0} lectures • {calculateChapterTime ? calculateChapterTime(chapter) : "N/A"}
                          </span>
                        </button>

                        {openSections[chapterIndex] && chapter.chapterContent && (
                          <div className="bg-white border-t border-gray-200">
                            {chapter.chapterContent.map((lecture, lectureIndex) => {
                              const completed = isLectureCompleted(lecture.lectureId);
                              const isCurrentLecture = playerData?.lectureId === lecture.lectureId;
                              
                              return (
                                <div
                                  key={lectureIndex}
                                  className={`flex items-center justify-between px-5 py-3 border-b border-gray-100 last:border-b-0 transition-colors duration-200 ${
                                    isCurrentLecture 
                                      ? "bg-blue-50" 
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    {completed ? (
                                      <CheckCircle2 className="size-5 text-green-600 flex-shrink-0" />
                                    ) : (
                                      <Play className="size-4 text-gray-400 flex-shrink-0" />
                                    )}
                                    <span className={`text-sm md:text-base ${
                                      isCurrentLecture 
                                        ? "text-blue-600 font-medium" 
                                        : "text-gray-700"
                                    }`}>
                                      {lecture.lectureTitle || `Lecture ${lectureIndex + 1}`}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {lecture.lectureUrl && (
                                      <button
                                        onClick={() => handleLectureClick(lecture, chapterIndex, lectureIndex)}
                                        className="text-green-600 hover:text-green-700 font-medium text-xs md:text-sm transition-colors duration-200"
                                      >
                                        Watch
                                      </button>
                                    )}
                                    <span className="text-blue-600 text-xs md:text-sm font-medium flex items-center gap-1">
                                      <Clock className="size-3" />
                                      {humanizeDuration(
                                        (lecture.lectureDuration || 0) * 60 * 1000,
                                        { units: ["h", "m"], round: true }
                                      )}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No course content available</p>
                )}

                <div className="mt-10 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="size-6 text-yellow-400 fill-yellow-400" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Rate This Course
                    </h3>
                  </div>
                  <Rating 
                    initialRating={initialRating} 
                    onRate={handleRate}
                    disabled={isRating}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {playerData ? (
                    <div>
                      <YouTube
                        videoId={extractYouTubeVideoId(playerData.lectureUrl)}
                        opts={{ 
                          playerVars: { 
                            autoplay: 1,
                            modestbranding: 1,
                            rel: 0
                          } 
                        }}
                        iframeClassName="w-full aspect-video"
                      />

                      <div className="p-5 space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Lecture {playerData.chapter}.{playerData.lecture}
                          </p>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {playerData.lectureTitle || "Untitled Lecture"}
                          </h3>
                        </div>

                        <button
                          onClick={() => markLectureAsCompleted(playerData.lectureId)}
                          disabled={isMarkingComplete || isLectureCompleted(playerData.lectureId)}
                          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-200 ${
                            isLectureCompleted(playerData.lectureId)
                              ? "bg-green-100 text-green-700 cursor-default"
                              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          }`}
                        >
                          {isMarkingComplete ? (
                            "Processing..."
                          ) : isLectureCompleted(playerData.lectureId) ? (
                            <>
                              <CheckCircle2 className="size-5" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="size-5" />
                              <span>Mark as Complete</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {courseData.courseThumbnail ? (
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
                      <div className="p-5">
                        <p className="text-gray-600 text-center">
                          Select a lecture to start watching
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  };

  export default Player;