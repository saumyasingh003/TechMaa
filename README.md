# 🎓 Learning Management System (LMS)

A modern, full-stack Learning Management System built with React and Node.js, featuring course creation, enrollment, video streaming, and payment processing capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Live Demo](#-live-demo)
- [Screenshots](#-screenshots)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Student Features

- **Course Discovery**: Browse and search through available courses
- **Course Details**: View detailed course information with preview videos
- **Secure Enrollment**: Purchase courses with Stripe payment integration
- **Video Player**: Watch course videos with progress tracking
- **Progress Tracking**: Monitor learning progress across enrolled courses
- **Course Ratings**: Rate and review completed courses
- **My Enrollments**: Manage all enrolled courses in one place

### 👨‍🏫 Educator Features

- **Course Creation**: Create comprehensive courses with chapters and lectures
- **Media Upload**: Upload course thumbnails using Cloudinary
- **Dashboard Analytics**: Track earnings, enrollments, and course performance
- **Student Management**: View enrolled students and their progress
- **Course Management**: Edit and manage published courses
- **Role-based Access**: Secure educator authentication with Clerk

### 🔐 Authentication & Security

- **Clerk Integration**: Secure user authentication and role management
- **JWT Tokens**: Protected API routes with middleware
- **Webhook Support**: Real-time user synchronization
- **Role-based Permissions**: Separate interfaces for students and educators

### 💳 Payment Integration

- **Stripe Checkout**: Secure payment processing
- **Webhook Handling**: Real-time payment confirmation
- **Purchase Tracking**: Complete transaction history
- **Refund Support**: Built-in refund capabilities

## 🛠 Tech Stack

### Frontend

- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Toastify** - Notification system
- **React YouTube** - Video player integration
- **Quill** - Rich text editor for course content

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Stripe** - Payment processing
- **Cloudinary** - Image and video management
- **Multer** - File upload handling
- **Clerk** - Authentication service

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **Nodemon** - Development server

## 🌐 Live Demo

**Frontend**: [https://techademy-lms.vercel.app](https://techademy-lms.vercel.app)

## 📸 Screenshots

### Student Interface

- **Home Page**: Modern landing page with featured courses
- **Course Details**: Comprehensive course information with preview
- **Video Player**: Interactive video player with progress tracking
- **My Enrollments**: Personal dashboard for enrolled courses

### Educator Interface

- **Dashboard**: Analytics and performance metrics
- **Add Course**: Course creation with rich content editor
- **My Courses**: Manage and edit published courses
- **Students**: View enrolled students and their progress

## 🔧 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/maheshhattimare/techademy-LMS.git
cd techademy-LMS
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.sample .env

# Edit .env file with your configuration
# (See Environment Variables section below)

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.sample .env

# Edit .env file with your configuration
# (See Environment Variables section below)

# Start development server
npm run dev
```

### 4. Database Setup

1. Create a MongoDB database (local or Atlas)
2. Update the `MONGO_URL` in your backend `.env` file
3. The application will automatically create necessary collections

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
MONGO_URL=mongodb://localhost:27017/lms

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Stripe Payment
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Cloudinary (File Upload)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=3000
CURRENCY=USD
```

### Frontend (.env)

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Backend API URL
VITE_BACKEND_URL=http://localhost:5000
# or production URL: https://your-backend-url.vercel.app

# Currency Symbol
VITE_CURRENCY=USD
```

## 📁 Project Structure

```
lms/
├── backend/                 # Backend API
│   ├── config/             # Database and service configurations
│   ├── controllers/        # API route handlers
│   ├── middlewares/        # Custom middleware functions
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route definitions
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── frontend/              # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   ├── assets/        # Images and icons
│   │   └── App.jsx        # Main app component
│   └── package.json       # Frontend dependencies
└── README.md              # Project documentation
```

## 🔌 API Endpoints

### Course Routes

- `GET /api/course/all` - Get all published courses
- `GET /api/course/:id` - Get course details by ID

### User Routes

- `GET /api/user/data` - Get user profile data
- `GET /api/user/enrolled-courses` - Get user's enrolled courses
- `POST /api/user/purchase-course` - Purchase a course
- `POST /api/user/update-progress` - Update course progress
- `GET /api/user/progress/:courseId` - Get course progress
- `POST /api/user/rating` - Add course rating

### Educator Routes

- `POST /api/educator/update-role` - Update user role to educator
- `POST /api/educator/add-course` - Create new course
- `GET /api/educator/courses` - Get educator's courses
- `GET /api/educator/dashboard` - Get dashboard analytics
- `GET /api/educator/enrolled-students` - Get enrolled students

### Webhook Routes

- `POST /clerk` - Clerk user synchronization webhook
- `POST /stripe` - Stripe payment confirmation webhook

## 💡 Usage

### For Students

1. **Sign Up/Login**: Create an account or login using Clerk authentication
2. **Browse Courses**: Explore available courses on the home page
3. **View Course Details**: Click on any course to see detailed information
4. **Enroll in Course**: Purchase courses using secure Stripe checkout
5. **Watch Videos**: Access course content in the video player
6. **Track Progress**: Monitor your learning progress
7. **Rate Courses**: Provide feedback on completed courses

### For Educators

1. **Become an Educator**: Update your role in the user profile
2. **Access Dashboard**: View analytics and performance metrics
3. **Create Courses**: Use the course creation form to build comprehensive courses
4. **Upload Content**: Add videos, descriptions, and course materials
5. **Manage Students**: View enrolled students and their progress
6. **Track Earnings**: Monitor revenue and enrollment statistics

## 🚀 Deployment

### Backend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to backend directory: `cd backend`
3. Run: `vercel --prod`
4. Configure environment variables in Vercel dashboard

### Frontend Deployment (Vercel)

1. Navigate to frontend directory: `cd frontend`
2. Run: `vercel --prod`
3. Configure environment variables in Vercel dashboard

### Database Setup

1. **MongoDB Atlas** (Recommended for production):

   - Create a free cluster
   - Get connection string
   - Update `MONGO_URL` in environment variables

2. **Local MongoDB** (Development):
   - Install MongoDB locally
   - Start MongoDB service
   - Use `mongodb://localhost:27017/lms`

## 🔧 Development

### Running in Development Mode

```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Available Scripts

**Backend:**

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Clerk** for authentication services
- **Stripe** for payment processing
- **Cloudinary** for media management
- **Vercel** for deployment platform
- **React** and **Node.js** communities

## 📞 Support

If you have any questions or need help setting up the project, please:

**Happy Learning! 🎓**
