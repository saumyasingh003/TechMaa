import React, { useContext, useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { 
  ChevronRight, 
  Plus, 
  X, 
  Upload, 
  BookOpen, 
  Clock, 
  Link as LinkIcon,
  DollarSign,
  FileText,
  Lock,
  Unlock
} from "lucide-react";

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  const resetLectureDetails = () => {
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
  };

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title && title.trim()) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title.trim(),
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      if (window.confirm("Are you sure you want to remove this chapter?")) {
        setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
      }
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      resetLectureDetails();
      setShowPopup(true);
    } else if (action === "remove") {
      if (window.confirm("Are you sure you want to remove this lecture?")) {
        setChapters(
          chapters.map((chapter) => {
            if (chapter.chapterId === chapterId) {
              const updatedContent = chapter.chapterContent.filter(
                (_, index) => index !== lectureIndex
              );
              return { ...chapter, chapterContent: updatedContent };
            }
            return chapter;
          })
        );
      }
    }
  };

  const addLecture = () => {
    if (!lectureDetails.lectureTitle.trim()) {
      toast.error("Lecture title is required");
      return;
    }

    if (!lectureDetails.lectureDuration || lectureDetails.lectureDuration <= 0) {
      toast.error("Please enter a valid duration");
      return;
    }

    if (!lectureDetails.lectureUrl.trim()) {
      toast.error("Lecture URL is required");
      return;
    }

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureId: uniqid(),
            lectureDuration: Number(lectureDetails.lectureDuration),
            lectureOrder: chapter.chapterContent.length > 0
              ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
              : 1,
          };

          return {
            ...chapter,
            chapterContent: [...chapter.chapterContent, newLecture],
          };
        }
        return chapter;
      })
    );

    setShowPopup(false);
    resetLectureDetails();
    toast.success("Lecture added successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseTitle.trim()) {
      toast.error("Course title is required");
      return;
    }

    if (!image) {
      toast.error("Please upload a course thumbnail");
      return;
    }

    if (!coursePrice || coursePrice <= 0) {
      toast.error("Please enter a valid course price");
      return;
    }

    if (chapters.length === 0) {
      toast.error("Please add at least one chapter");
      return;
    }

    const hasLectures = chapters.some(ch => ch.chapterContent.length > 0);
    if (!hasLectures) {
      toast.error("Please add at least one lecture");
      return;
    }

    if (!quillRef.current || !quillRef.current.root.innerHTML.trim()) {
      toast.error("Please add course description");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const courseData = {
        courseTitle: courseTitle.trim(),
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount) || 0,
        courseContent: chapters,
        isPublished: true,
      };

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      formData.append("image", image);
      
      const token = await getToken();

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/educator/add-course`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setCourseTitle("");
        setCoursePrice("");
        setDiscount("");
        setImage(null);
        setChapters([]);
        if (quillRef.current) {
          quillRef.current.root.innerHTML = "";
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to add course";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { 
        theme: "snow",
        placeholder: "Write your course description here..."
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Create New Course
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Add course details, chapters, and lectures
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Basic Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Title
                </label>
                <input
                  onChange={(e) => setCourseTitle(e.target.value)}
                  value={courseTitle}
                  type="text"
                  placeholder="Enter course title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Description
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div ref={editorRef} className="min-h-[200px]"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <input
                      onChange={(e) => setCoursePrice(e.target.value)}
                      value={coursePrice}
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount (%)
                  </label>
                  <input
                    onChange={(e) => setDiscount(e.target.value)}
                    value={discount}
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Thumbnail
                </label>
                <div className="flex items-center gap-4">
                  <label 
                    htmlFor="thumbnailImage" 
                    className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Upload className="size-5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      id="thumbnailImage"
                      onChange={(e) => setImage(e.target.files[0])}
                      accept="image/*"
                      hidden
                    />
                  </label>
                  {image && (
                    <div className="relative">
                      <img
                        className="h-16 w-24 object-cover rounded-lg border-2 border-gray-200"
                        src={URL.createObjectURL(image)}
                        alt="Thumbnail preview"
                      />
                      <button
                        type="button"
                        onClick={() => setImage(null)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Course Content
            </h2>

            <div className="space-y-4">
              {chapters.map((chapter, chapterIndex) => (
                <div
                  key={chapter.chapterId}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => handleChapter("toggle", chapter.chapterId)}
                    >
                      <ChevronRight
                        className={`size-5 text-gray-600 transition-transform duration-300 ${
                          !chapter.collapsed ? "rotate-90" : ""
                        }`}
                      />
                      <span className="font-semibold text-gray-900">
                        {chapterIndex + 1}. {chapter.chapterTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        {chapter.chapterContent.length} lectures
                      </span>
                      <button
                        type="button"
                        onClick={() => handleChapter("remove", chapter.chapterId)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                      >
                        <X className="size-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {!chapter.collapsed && (
                    <div className="p-4 space-y-3">
                      {chapter.chapterContent.map((lecture, lectureIndex) => (
                        <div
                          key={lectureIndex}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-sm text-gray-600">
                              {lectureIndex + 1}.
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {lecture.lectureTitle}
                              </p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Clock className="size-3" />
                                  {lecture.lectureDuration} mins
                                </span>
                                <span className="flex items-center gap-1">
                                  {lecture.isPreviewFree ? (
                                    <>
                                      <Unlock className="size-3 text-green-600" />
                                      <span className="text-green-600">Free Preview</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="size-3" />
                                      <span>Paid</span>
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleLecture("remove", chapter.chapterId, lectureIndex)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                          >
                            <X className="size-4 text-gray-600" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleLecture("add", chapter.chapterId)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                      >
                        <Plus className="size-4" />
                        <span>Add Lecture</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleChapter("add")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors duration-200"
              >
                <Plus className="size-5" />
                <span>Add Chapter</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              <BookOpen className="size-5" />
              <span>{isSubmitting ? "Creating Course..." : "Create Course"}</span>
            </button>
          </div>
        </form>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Lecture</h3>
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="size-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lecture Title
                </label>
                <input
                  type="text"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureTitle: e.target.value,
                    })
                  }
                  placeholder="Enter lecture title"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureDuration: e.target.value,
                    })
                  }
                  placeholder="0"
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lecture URL
                </label>
                <input
                  type="url"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureUrl: e.target.value,
                    })
                  }
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPreviewFree"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      isPreviewFree: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-100"
                />
                <label htmlFor="isPreviewFree" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Allow free preview
                </label>
              </div>

              <button
                type="button"
                onClick={addLecture}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                Add Lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AddCourse;