import {clerkClient} from "@clerk/express";
import Course from "../models/Course.js";
import {v2 as cloudinary} from "cloudinary";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";

export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: "educator"
            }
        });

        res.json({success: true, message: "You can publish a course now"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// add new course
export const addCourse = async (req, res) => {
    try {
        const {courseData} = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if (! imageFile) {
            return res.json({success: false, message: "Thumbnail Not Attached"});
        }

        const parsedCourseData = await JSON.parse(courseData);
        parsedCourseData.educator = educatorId;
        const newCourse = await Course.create(parsedCourseData);
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        newCourse.courseThumbnail = imageUpload.secure_url;
        await newCourse.save();

        res.json({success: true, message: "Course Added"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// get educator courses with purchase data
export const getEducatorCourses = async (req, res) => {
    try {
        const educator = req.auth.userId;
        
        // Get all courses for this educator
        const courses = await Course.find({ educator });
        
        // Get purchase data for these courses
        const courseIds = courses.map(course => course._id);
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: "completed"
        });

        // Add purchase stats to each course
        const coursesWithStats = courses.map(course => {
            const coursePurchases = purchases.filter(p => p.courseId.toString() === course._id.toString());
            const totalEarnings = coursePurchases.reduce((sum, p) => sum + (p.amount || 0), 0);
            const enrollmentCount = coursePurchases.length;

            return {
                ...course.toObject(),
                purchaseStats: {
                    totalEarnings,
                    enrollmentCount
                }
            };
        });

        res.json({ success: true, courses: coursesWithStats });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// get educator dashboard data (total earning ,enrolled students, no of courses)
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        const totalCourses = courses.length;

        const courseIds = courses.map((course) => course._id);

        const purchases = await Purchase.find({
            courseId: {
                $in: courseIds
            },
            status: "completed"
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // Get enrolled students data from completed purchases
        const studentsData = await Purchase.find({
            courseId: { $in: courseIds },
            status: "completed"
        })
        .sort({ createdAt: -1 }) // Sort by latest first
        .limit(10) // Get only last 10 enrollments
        .populate("userId", "name imageUrl")
        .populate("courseId", "courseTitle");

        const enrolledStudentsData = studentsData.map(purchase => ({
            courseTitle: purchase.courseId.courseTitle,
            student: purchase.userId
        }));

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        });
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// get enrolled student data with purchase data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        const courseIds = courses.map((course) => course._id);

        const purchases = await Purchase.find({
            courseId: {
                $in: courseIds
            },
            status: "completed"
        }).populate("userId", "name imageUrl").populate("courseId", "courseTitle");

        const enrolledStudets = purchases.map((purchase) => ({student: purchase.userId, courseTitle: purchase.courseId.courseTitle, purchaseDate: purchase.createdAt}));

        res.json({success: true, enrolledStudets});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};
