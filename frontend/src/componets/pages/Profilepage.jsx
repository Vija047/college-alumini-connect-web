import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Award, MapPin, Briefcase, Linkedin, Calendar, BookOpen, Tag, BadgeCheck } from "lucide-react";
import axios from "axios";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleBackButton = () => {
    navigate('/');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("https://alumini-connect-backend.vercel.app/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        setFormState(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "https://alumini-connect-backend.vercel.app/api/users/update-profile",
        formState,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormState(userData);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-md text-center">
          <p className="text-gray-600">Could not load profile data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const {
    name,
    email,
    batch,
    branch,
    jobTitle,
    location,
    tags,
    isVerified,
    achievements = [],
    linkedinUrl,
    graduationYear,
  } = formState;

  return (
    <div className="min-h-screen bg-gray-50 pb-12 ">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 px-6 shadow-md">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <button
              onClick={handleBackButton}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10">
        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-blue-100 to-indigo-100"></div>
          
          <div className="p-6 relative">
            {/* Profile Avatar */}
            <div className="absolute -top-14 left-6 ring-4 ring-white rounded-full">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover bg-white shadow-md"
              />
            </div>
            
            <div className="ml-32 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
                  {isVerified && (
                    <BadgeCheck className="text-blue-600 w-5 h-5" />
                  )}
                </div>
                <div className="flex items-center gap-6 mt-1">
                  {jobTitle && (
                    <div className="flex items-center text-gray-600 gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">{jobTitle}</span>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-center text-gray-600 gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
            
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* User Details & Edit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-xl overflow-hidden">
              <div className="border-b border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  Professional Information
                </h3>
              </div>
              
              <div className="p-6">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={jobTitle || ""}
                        onChange={(e) => handleChange("jobTitle", e.target.value)}
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={location || ""}
                        onChange={(e) => handleChange("location", e.target.value)}
                        placeholder="e.g. New York, NY"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={linkedinUrl || ""}
                        onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                        placeholder="https://linkedin.com/in/your-profile"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills/Tags</label>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={tags ? tags.join(", ") : ""}
                        onChange={(e) =>
                          handleChange(
                            "tags",
                            e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                          )
                        }
                        placeholder="e.g. React, JavaScript, UI/UX"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="text-gray-400">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Job Title</p>
                        <p className="text-base text-gray-900">{jobTitle || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="text-gray-400">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Location</p>
                        <p className="text-base text-gray-900">{location || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="text-gray-400">
                        <Linkedin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">LinkedIn</p>
                        {linkedinUrl ? (
                          <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base text-blue-600 hover:text-blue-800 underline"
                          >
                            View Profile
                          </a>
                        ) : (
                          <p className="text-base text-gray-900">Not linked</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="text-gray-400">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Skills</p>
                        {tags && tags.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {tags.map((tag, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-base text-gray-900">No skills added</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  Academic Information
                </h3>
                
                <div className="mt-6">
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                          value={email || ""}
                          disabled
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={batch || ""}
                          onChange={(e) => handleChange("batch", e.target.value)}
                          placeholder="e.g. 2020-2024"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={branch || ""}
                          onChange={(e) => handleChange("branch", e.target.value)}
                          placeholder="e.g. Computer Science"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={graduationYear || ""}
                          onChange={(e) => handleChange("graduationYear", e.target.value)}
                          placeholder="e.g. 2024"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="text-gray-400">
                          <div className="w-5 h-5">@</div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Email</p>
                          <p className="text-base text-gray-900">{email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="text-gray-400">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Batch</p>
                          <p className="text-base text-gray-900">{batch || "Not specified"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="text-gray-400">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Branch</p>
                          <p className="text-base text-gray-900">{branch || "Not specified"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="text-gray-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Graduation Year</p>
                          <p className="text-base text-gray-900">{graduationYear || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="border-t border-gray-100 p-6 flex gap-4 justify-end">
                  <button
                    onClick={handleCancel}
                    className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Achievements */}
          <div>
            <div className="bg-white shadow-md rounded-xl overflow-hidden h-full">
              <div className="border-b border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Award className="w-5 h-5" />
                  </div>
                  Achievements
                </h3>
              </div>
              
              <div className="p-6">
                {achievements && achievements.length > 0 ? (
                  <div className="space-y-4">
                    {achievements.map((ach, idx) => (
                      <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-800">{ach.title}</h4>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                            {new Date(ach.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{ach.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 mx-auto text-gray-300" />
                    <p className="mt-2 text-gray-500">No achievements added yet.</p>
                    {!isEditing && (
                      <button className="mt-4 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-all">
                        Add Achievement
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}