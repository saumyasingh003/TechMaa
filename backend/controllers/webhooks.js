import { Webhook } from "svix";
import User from "../models/User.js";
// import Stripe from "stripe";
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";

// import dotenv from "dotenv";
// dotenv.config();

export const clerkWebhook = async (req, res) => {
  try {
    console.log("Incoming Clerk Webhook");

    // Check if webhook secret is configured
    if (!process.env.CLERK_WEBHOOK_SECRET) {
      console.error("CLERK_WEBHOOK_SECRET not configured");
      return res
        .status(500)
        .json({ success: false, message: "Webhook secret not configured" });
    }

    // 1️⃣ Create Webhook instance with your Clerk secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // 2️⃣ Extract required Svix headers
    const svixId = req.headers["svix-id"];
    const svixTimestamp = req.headers["svix-timestamp"];
    const svixSignature = req.headers["svix-signature"];

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("Missing Svix headers:", {
        svixId,
        svixTimestamp,
        svixSignature,
      });
      return res
        .status(400)
        .json({ success: false, message: "Missing Svix headers" });
    }

    // 3️⃣ Convert raw buffer to string for verification
    const payload = req.body.toString("utf8");
    console.log("Raw payload:", payload);

    // 4️⃣ Verify the incoming webhook
    const event = whook.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });

    // 5️⃣ Parse the payload after verification
    const parsed = JSON.parse(payload);
    const { data, type } = parsed;

    console.log("Webhook Event:", type);
    console.log("Event Data:", JSON.stringify(data, null, 2));

    // 6️⃣ Switch through event types
    switch (type) {
      case "user.created": {
        try {
          const userData = {
            _id: data.id,
            email: data.email_addresses?.[0]?.email_address || "",
            name:
              `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
              "User",
            imageUrl: data.image_url || "",
          };

          console.log("Creating user with data:", userData);

          // Check if user already exists
          const existingUser = await User.findById(data.id);
          if (existingUser) {
            console.log(" User already exists:", userData.email);
            return res
              .status(200)
              .json({ success: true, message: "User already exists" });
          }

          const newUser = await User.create(userData);
          console.log("User created successfully:", newUser.email);
          return res
            .status(201)
            .json({ success: true, message: "User created", user: newUser });
        } catch (error) {
          console.error("Error creating user:", error.message);
          return res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: error.message,
          });
        }
      }

      case "user.updated": {
        const updatedData = {
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, updatedData);
        console.log("User updated:", updatedData.email);
        return res.status(200).json({ success: true, message: "User updated" });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("User deleted:", data.id);
        return res.status(200).json({ success: true, message: "User deleted" });
      }

      default:
        console.log("Unhandled event type:", type);
        return res
          .status(400)
          .json({ success: false, message: "Unhandled event type" });
    }
  } catch (error) {
    console.error("Webhook Error:", error);
    console.error("Error Stack:", error.stack);
    return res.status(400).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Test endpoint to verify webhook is accessible
export const testWebhook = async (req, res) => {
  try {
    console.log("Testing webhook endpoint");
    res.status(200).json({
      success: true,
      message: "Webhook endpoint is working",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
// export const stripeWebhooks = async (request, response) => {
//   const sig = request.headers["stripe-signature"];

//   let event;

//   try {
//     event = stripeInstance.webhooks.constructEvent(
//       request.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the event
//   switch (event.type) {
//     case "payment_intent.succeeded": {
//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;

//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: paymentIntentId,
//       });

//       const { purchaseId } = session.data[0].metadata;

//       const purchaseData = await Purchase.findById(purchaseId);
//       const userData = await User.findById(purchaseData.userId);
//       const courseData = await Course.findById(
//         purchaseData.courseId.toString()
//       );

//       courseData.enrolledStudents.push(userData);
//       await courseData.save();

//       userData.enrolledCourses.push(courseData._id);
//       await userData.save();

//       purchaseData.status = "completed";
//       await purchaseData.save();

//       break;
//     }
//     case "payment_method.attached": {
//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;

//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: paymentIntentId,
//       });

//       const { purchaseId } = session.data[0].metadata;
//       const purchaseData = await Purchase.findById(purchaseId);
//       purchaseData.status = "failed";
//       await purchaseData.save();
//       break;
//     }
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a response to acknowledge receipt of the event
//   response.json({ received: true });
// };
