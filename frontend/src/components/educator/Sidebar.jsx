import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Plus, BookOpen, Users } from "lucide-react";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);
  
  const menuItems = [
    { 
      name: "Dashboard", 
      path: "/educator", 
      icon: LayoutDashboard,
      description: "Overview & analytics"
    },
    { 
      name: "Add Course", 
      path: "/educator/add-course", 
      icon: Plus,
      description: "Create new course"
    },
    {
      name: "My Courses",
      path: "/educator/my-courses",
      icon: BookOpen,
      description: "Manage your courses"
    },
    {
      name: "Students Enrolled",
      path: "/educator/student-enrolled",
      icon: Users,
      description: "View enrolled students"
    },
  ];

  if (!isEducator) {
    return null;
  }

  return (
    <aside className="w-20 lg:w-72 min-h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0 shadow-sm">
      <nav className="flex-1 py-6">
        <div className="space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                to={item.path}
                key={item.name}
                end={item.path === "/educator"}
                className={({ isActive }) =>
                  `group flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      className={`size-6 flex-shrink-0 transition-transform duration-200 ${
                        isActive ? "scale-110" : "group-hover:scale-110"
                      }`}
                    />
                    <div className="hidden lg:block flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {item.name}
                      </p>
                      <p className={`text-xs truncate ${
                        isActive ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="hidden lg:block p-4 border-t border-gray-200">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Need Help?
          </p>
          <p className="text-xs text-gray-600 mb-3">
            Check our documentation for course creation tips
          </p>
          <button className="w-full px-3 py-2 bg-white text-blue-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
            View Docs
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;