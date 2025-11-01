import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { toast } from "react-toastify";
import axios from "axios";
import { Users, BookOpen, DollarSign, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to load dashboard";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);

  if (isLoading) return <Loading />;

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: Users,
      value: dashboardData.enrolledStudentsData?.length || 0,
      label: "Total Enrollments",
      bgGradient: "from-blue-500 to-indigo-500",
    },
    {
      icon: BookOpen,
      value: dashboardData.totalCourses || 0,
      label: "Total Courses",
      bgGradient: "from-purple-500 to-pink-500",
    },
    {
      icon: DollarSign,
      value: `${currency}${dashboardData.totalEarnings || 0}`,
      label: "Total Earnings",
      bgGradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-base md:text-lg">Overview of your teaching performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.bgGradient}`}>
                    <stat.icon className="size-6 text-white" />
                  </div>
                  <TrendingUp className="size-5 text-gray-400 group-hover:text-green-600 transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm md:text-base text-gray-600 mt-1">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Latest Enrollments</h2>
            <p className="text-sm text-gray-600 mt-1">Recent students who enrolled in your courses</p>
          </div>

          {dashboardData.enrolledStudentsData && dashboardData.enrolledStudentsData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">#</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Course</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData.enrolledStudentsData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-center text-gray-600 text-sm hidden sm:table-cell">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.student?.imageUrl ? (
                            <img src={item.student.imageUrl} alt={item.student.name || "Student"} className="size-10 rounded-full object-cover border-2 border-gray-200" loading="lazy" />
                          ) : (
                            <div className="size-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">{item.student?.name ? item.student.name.charAt(0).toUpperCase() : "U"}</div>
                          )}
                          <span className="font-medium text-gray-900 truncate max-w-[150px] sm:max-w-[200px]">{item.student?.name || "Unknown Student"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700 text-sm truncate block max-w-[200px] md:max-w-[300px]">{item.courseTitle || "Untitled Course"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="size-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Enrollments Yet</h3>
              <p className="text-gray-600">Students who enroll in your courses will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;