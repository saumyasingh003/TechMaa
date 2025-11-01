import Course from "../models/Course.js";
import CourseProgress from "../models/CourseProgress.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId;
        console.log("Fetching user data for ID:", userId);
        const user = await User.findById(userId).populate("enrolledCourses");
        console.log("User data fetched:", user);
        if (! user) {
            return res.json({success: false, message: "User not found"});
        }
        res.json({success: true, user});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// user enrolled courses with lecture link
export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const userData = await User.findById(userId).populate({
            path: "enrolledCourses",
            select: "courseTitle courseThumbnail courseContent"
        });

        res.json({success: true, enrolledCourses: userData.enrolledCourses});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// purchase course
export const purchaseCourse = async (req, res) => {
    try {
        const {courseId} = req.body;
        const {origin} = req.headers;
        const userId = req.auth.userId;
        
        console.log("Purchase request received:", {
            courseId,
            userId,
            body: req.body
        });

        if (!courseId) {
            return res.json({
                success: false,
                message: "Course ID is required"
            });
        }

        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        if (! userData || ! courseData) {
            return res.json({success: false, message: "Data not found"});
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice -(courseData.discount * courseData.coursePrice) / 100).toFixed(2),
            status: "completed"  // Set initial status as completed for simulation
        };

        const newPurchase = await Purchase.create(purchaseData);

        // Simulate a payment gateway response
        const simulatePayment = () => {
            // Simulate success 90% of the time
            const isSuccess = true;
            
            return {
                success: isSuccess,
                transactionId: isSuccess ? `TRANS_${Math.random().toString(36).substr(2, 9)}` : null,
                amount: newPurchase.amount,
                currency: "USD",
                timestamp: new Date().toISOString(),
                status: "completed",
                paymentMethod: "test_card",
                orderId: newPurchase._id.toString() 
            };
        };

        const paymentResult = simulatePayment();

        if (paymentResult.success) {
            // If payment is successful, enroll the user in the course
            userData.enrolledCourses.push(courseId);
            await userData.save();

            res.json({
                success: true,
                message: "Course purchased successfully",
                paymentDetails: paymentResult,
                redirectUrl: `${origin}/loading/my-enrollments`
            });
        } else {
            // If payment fails, delete the purchase record
            await Purchase.findByIdAndDelete(newPurchase._id);
            res.json({
                success: false,
                message: "Payment failed",
                paymentDetails: paymentResult,
                redirectUrl: `${origin}/`
            });
        }
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// update user course progress
export const updateUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const {courseId, lectureId} = req.body;
        const progressData = await CourseProgress.findOne({userId, courseId});

        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({success: true, message: "Lecture already completed"});
            }

            progressData.lectureCompleted.push(lectureId);
            await progressData.save();
        } else {
            await CourseProgress.create({userId, courseId, lectureCompleted: [lectureId]});
        }
        res.json({success: true, message: "Progress updated"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// get user course progress
export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const {courseId} = req.params;
        
        let progressData = await CourseProgress.findOne({userId, courseId});
        
        // If no progress record exists, create one
        if (!progressData) {
            progressData = await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [],
                completed: false
            });
        }

        // Ensure lectureCompleted is always an array
        if (!Array.isArray(progressData.lectureCompleted)) {
            progressData.lectureCompleted = [];
            await progressData.save();
        }

        res.json({success: true, progressData});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// add user rating to course
export const addUserRating = async (req, res) => {
    const userId = req.auth.userId;
    const {courseId, rating} = req.body;

    if (!courseId || ! userId || !rating || rating < 1 || rating > 5) {
        return res.json({success: false, message: "Invalid details"});
    }

    try {
        const course = await Course.findById(courseId);
        if (! course) {
            return res.json({success: false, message: "Course not found"});
        }

        const user = await User.findById(userId);

        if (! user || ! user.enrolledCourses.includes(courseId)) {
            return res.json({success: false, message: "You are not enrolled in this course"});
        }

        const existingRatingIndex = course.courseRatings.findIndex((r) => r.userId === userId);
        if (existingRatingIndex > -1) {
            course.courseRatings[existingRatingIndex].rating = rating;
        } else {
            course.courseRatings.push({userId, rating});
        }
        await course.save();
        res.json({success: true, message: "Rating added successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};
