import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Home,
  Users,
  MessageSquare,
  Award,
  Calendar,
  HelpCircle,
  ThumbsUp,
  Menu,
  X,
  Bell,
  ChevronRight,
  UserCircle,
  LogOut,
  Heart,
  Share2,
  MapPin,
  Briefcase,
  BookOpen,
} from "lucide-react";

// Sidebar Component
const Sidebar = ({ onNavigate, activePath }) => {
  const menu = [
    { icon: <Home className="w-5 h-5" />, label: "Dashboard", path: "/" },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Alumni Directory",
      path: "/aluminidirectory",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Community Feed",
      path: "/community",
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: "Achievements",
      path: "/achievements",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Events",
      path: "/events",
    },
    { icon: <HelpCircle className="w-5 h-5" />, label: "Help", path: "/help" },
  ];

  return (
    <div className="h-full py-6 bg-white flex flex-col">
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-blue-700">Alumni Connect</h2>
      </div>
      
      <div className="flex-1 px-3 space-y-1">
        {menu.map((item, index) => (
          <div
            key={index}
            onClick={() => onNavigate(item.path)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
              activePath === item.path
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
            {activePath === item.path && (
              <div className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="px-4 mt-6">
        <div className="border-t border-gray-100 pt-4 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
              <UserCircle className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">Profile Settings</p>
            </div>
            <LogOut className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Navbar Component
const Navbar = ({ user, toggleSidebar, sidebarOpen }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 md:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="md:hidden font-bold text-lg text-blue-700">
            Alumni Connect
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <Link to="/profile" className="flex items-center gap-2">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.name?.split(" ")[0] || "User"}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

// Dashboard Layout
const DashboardLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [alumni, setAlumni] = useState([]);
  const [posts, setPosts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postError, setPostError] = useState("");
  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, title: "Annual Alumni Meet", date: "May 15, 2025", attendees: 124 },
    { id: 2, title: "Career Workshop", date: "May 22, 2025", attendees: 67 }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [userRes, alumniRes, postsRes] = await Promise.all([
          axios.get("https://alumini-connect-backend-upbz.vercel.app/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),

          axios.get("https://alumini-connect-backend.vercel.app/api/users/directory"),

          axios.get("https://alumini-connect-backend.vercel.app/api/posts/allpost", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(userRes.data);
        setAlumni(alumniRes.data);
        setPosts(postsRes.data);
        setAchievements(userRes.data.achievements || []);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setPostError("Failed to load community posts.");
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleAddAchievement = () => {
    navigate("/achievements");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <Navbar user={user} toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-800/40 z-30 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 bottom-0 w-72 z-40 transition-transform duration-300 ease-in-out transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onNavigate={handleNavigation} activePath="/" />
      </aside>

      {/* Main Content */}
      <main className="pt-16 md:pl-72 transition-all duration-300">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold">
                Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
              </h2>
              <p className="mt-2 text-blue-100 max-w-xl">
                Stay connected with your alumni network and discover the latest updates from your classmates.
              </p>
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => navigate("/community")}
                  className="bg-white text-blue-700 hover:bg-blue-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Create Post
                </button>
                <button 
                  onClick={() => navigate("/events")}
                  className="bg-blue-700/30 text-white hover:bg-blue-700/40 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Upcoming Events
                </button>
              </div>
            </div>
            <div className="absolute right-6 top-6 bottom-6 hidden md:block">
              <div className="w-48 h-48 bg-blue-500/20 rounded-full"></div>
              <div className="w-32 h-32 bg-blue-500/20 rounded-full absolute -top-10 -right-10"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Summary Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white w-16 h-16 flex items-center justify-center rounded-2xl text-2xl font-bold shadow-lg">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {user?.name || "Unknown User"}
                      </h2>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                        {user?.branch && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{user.branch}</span>
                          </div>
                        )}
                        {user?.graduationYear && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Class of {user.graduationYear}</span>
                          </div>
                        )}
                        {user?.jobTitle && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{user.jobTitle}</span>
                          </div>
                        )}
                        {user?.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{user.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Link 
                      to="/profile"
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>

                  {user?.tags && user.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {user.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Community Feed */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Community Posts
                  </h3>
                  <button
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    onClick={() => navigate("/community")}
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {loadingPosts ? (
                    <div className="p-6 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                    </div>
                  ) : postError ? (
                    <div className="p-6 text-center">
                      <p className="text-red-500">{postError}</p>
                      <button className="mt-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700">
                        Try Again
                      </button>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-3">No community posts yet.</p>
                      <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                        onClick={() => navigate("/community")}
                      >
                        Create First Post
                      </button>
                    </div>
                  ) : (
                    posts.slice(0, 3).map((post) => (
                      <div key={post._id} className="p-6">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="bg-blue-100 text-blue-700 w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium">
                            {post.author?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{post.author?.name || "Unknown Author"}</h4>
                            <p className="text-xs text-gray-500">
                              {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <h4 className="font-semibold text-lg text-gray-800 mb-2">{post.title}</h4>
                        <p className="text-gray-600 mb-4">{post.content}</p>
                        
                        {post.image && (
                          <div className="mb-4 rounded-xl overflow-hidden">
                            <img src={post.image} alt={post.title} className="w-full h-auto" />
                          </div>
                        )}
                        
                        <div className="flex gap-4 text-sm text-gray-500">
                          <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                            <Heart size={16} className="text-gray-400" /> 
                            <span>{post.likes?.length || 0} Likes</span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                            <MessageSquare size={16} className="text-gray-400" /> 
                            <span>{post.comments?.length || 0} Comments</span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors ml-auto">
                            <Share2 size={16} className="text-gray-400" /> 
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {posts.length > 0 && (
                  <div className="p-4 flex justify-center border-t border-gray-100">
                    <button 
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      onClick={() => navigate("/community")}
                    >
                      View More Posts
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* New Alumni Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    New Alumni
                  </h3>
                </div>
                
                <div className="p-4 space-y-3">
                  {alumni
                    .slice()
                    .sort((a, b) =>
                      (b.createdAt || "").localeCompare(a.createdAt || "")
                    )
                    .slice(0, 3)
                    .map((al, i) => (
                      <div
                        key={al._id || i}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 text-white w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium">
                          {al.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 truncate">{al.name || "Unknown"}</h4>
                          <p className="text-xs text-gray-500 truncate">
                            {al.jobTitle || "No job title"} {al.location ? `• ${al.location}` : ""}
                          </p>
                        </div>
                        <button className="text-blue-600 text-sm font-medium hover:underline">
                          View
                        </button>
                      </div>
                    ))
                  }
                </div>
                
                <div className="p-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate("/aluminidirectory")}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium p-3 rounded-lg transition-colors"
                  >
                    View All Alumni
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Upcoming Events
                  </h3>
                </div>
                
                <div className="p-4 space-y-3">
                  {upcomingEvents.map(event => (
                    <div 
                      key={event.id}
                      className="p-3 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer"
                    >
                      <h4 className="font-medium text-gray-800">{event.title}</h4>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {event.date}
                        </p>
                        <p className="text-xs text-blue-600 font-medium">
                          {event.attendees} attending
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate("/events")}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium p-3 rounded-lg transition-colors"
                  >
                    View All Events
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Achievements Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Your Achievements
                  </h3>
                </div>

                <div className="p-4">
                  {achievements.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                        <Award className="w-8 h-8 text-blue-400" />
                      </div>
                      <p className="text-gray-500 mb-4">No achievements added yet</p>
                      <button
                        onClick={handleAddAchievement}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add First Achievement
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {achievements.slice(0, 2).map((item, index) => (
                        <div
                          key={item._id || index}
                          className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                        >
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold text-gray-800 flex-1">{item.title}</h4>
                          </div>
                          {item.description && (
                            <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                          )}
                          <p className="mt-2 text-xs text-gray-500">
                            {new Date(item.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      ))}
                      
                      {achievements.length > 2 && (
                        <p className="text-center text-sm text-blue-600 font-medium">
                          +{achievements.length - 2} more achievements
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {achievements.length > 0 && (
                  <div className="p-4 border-t border-gray-100">
                    <button
                      onClick={handleAddAchievement}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition-colors"
                    >
                      Add New Achievement
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;