import Course from "../models/Course.js";


// get all courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true });
        
        // Create a lean version of courses with lecture counts but without content
        const processedCourses = courses.map(course => {
            // Calculate total lectures
            let totalLectures = 0;
            course.courseContent.forEach(chapter => {
                if (Array.isArray(chapter.chapterContent)) {
                    totalLectures += chapter.chapterContent.length;
                }
            });

            // Convert to plain object and add lecture count
            const courseObj = course.toObject();
            courseObj.totalLectures = totalLectures;
            
            // Remove sensitive/large fields
            delete courseObj.courseContent;
            delete courseObj.enrolledStudents;
            
            return courseObj;
        });

        await Course.populate(processedCourses, { path: "educator" });
        
        res.json({ success: true, courses: processedCourses });
    } catch (error) {
        res.json({ success: false, message: error.message });
        console.log("Error fetching courses:", error);
    }
};

// get course by id
export const getCourseId = async (req, res) => {
    const {id} = req.params;
    try {
        const courseData = await Course.findById(id).populate({path: "educator"});

        // remove lecture url is isPreview is false
        courseData.courseContent.forEach((chapter) => {
            chapter.chapterContent.forEach((lecture) => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = "";
                }
            });
        });
        res.json({success: true, courseData});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};
