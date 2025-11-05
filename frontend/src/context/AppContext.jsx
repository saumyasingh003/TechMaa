import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  
  const fetchAllCourses = async () => {
    // setAllCourses(dummyCourses);
    try {
      const { data } = await axios.get(backendUrl + "/api/course/all");

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

 
  const fetchUserData = async () => {
    if (user.publicMetadata.role === "educator") {
      setIsEducator(true);
    }

    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserData(data.user);
      } 
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to calculate average rating  of course
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return Math.floor(totalRating / course.courseRatings.length);
  };

  // function to calculate course chaptor time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
    });
  };
  // calculate course duration
  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
    });
  };

  // function to get number of lectures in the course
  const calculateNoOfeLectures = (course) => {
    // If we have the pre-calculated total, use it
    if (typeof course.totalLectures === 'number') {
      return course.totalLectures;
    }
    // Fallback to calculation if we have full course content (e.g. in course detail view)
    if (course.courseContent) {
      let totalLectures = 0;
      course.courseContent.forEach((chapter) => {
        if (Array.isArray(chapter.chapterContent)) {
          totalLectures += chapter.chapterContent.length;
        }
      });
      return totalLectures;
    }
    return 0;
  };

  // Fetch User Enrolled Courses
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/user/enrolled-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setEnrolledCourses(data?.enrolledCourses?.reverse());
      } else {
        // toast.error(data.message);
        console.log(data.message);
      }
    } catch (error) {
      // toast.error(error.message);
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchAllCourses();
  }, []);

  // fun to get token
  // const logToken = async () => {
  // console.log(await getToken());
  // };

  useEffect(() => {
    if (user) {
      // logToken();
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [user]);

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfeLectures,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
    fetchUserData,
  };
  return (
    <AppContext.Provider value={value}> {props.children}</AppContext.Provider>
  );
};
