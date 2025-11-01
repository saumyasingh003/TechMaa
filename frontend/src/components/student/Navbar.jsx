import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { UserButton, useClerk, useUser } from "@clerk/clerk-react";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from '../../components/student/Loading';
import { GraduationCap, BookOpen, Menu, X } from "lucide-react";

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);
  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const becomeEducator = async () => {
    if (!user) {
      openSignIn();
      return;
    }

    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }

      setIsLoading(true);
      const token = await getToken();

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const { data } = await axios.get(
        backendUrl + "/api/educator/update-role",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
        navigate("/educator");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update role";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-24 xl:px-32 border-b shadow-sm py-4 transition-colors duration-200 bg-[#1e3a8a] border-gray-800`}
      >
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="relative">
            <img 
              src={assets.logo} 
              alt="TechMaacademy Logo" 
              className="size-10 transition-transform duration-200 group-hover:scale-105" 
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            TechMaa
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {user && (
            <div className="flex items-center gap-6">
              <button
                onClick={becomeEducator}
                disabled={isLoading}
                className="flex items-center gap-2 text-gray-200 font-medium hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GraduationCap className="size-5" />
                <span>{isEducator ? "Educator Dashboard" : "Become Educator"}</span>
              </button>

              <Link
                to="/my-enrollments"
                className="flex items-center gap-2 font-medium text-white  hover:text-white transition-colors duration-200"
              >
                <BookOpen className="size-5" />
                <span>My Enrollments</span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "size-10 rounded-full border-2 border-blue-600"
                    }
                  }}
                />
              </div>
            ) : (
              <button
                onClick={() => openSignIn()}
                className="bg-[#FED642] text-gray-900 font-medium px-6 py-2.5 rounded-full hover:bg-[#e5c13b] hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Get Started
              </button>
            )}
          </div>
        </div>

        <div className="lg:hidden flex items-center gap-3">
          {user && (
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "size-9 rounded-full border-2 border-blue-600"
                }
              }}
            />
          )}
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute top-[73px] right-0 left-0 bg-white shadow-xl border-b border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-6 space-y-4">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      becomeEducator();
                      handleMobileNavClick();
                    }}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <GraduationCap className="size-5" />
                    <span>{isEducator ? "Educator Dashboard" : "Become Educator"}</span>
                  </button>

                  <Link
                    to="/my-enrollments"
                    onClick={handleMobileNavClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <BookOpen className="size-5" />
                    <span>My Enrollments</span>
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    openSignIn();
                    handleMobileNavClick();
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-6 py-3 rounded-full hover:shadow-lg transition-all duration-200"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;