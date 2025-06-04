import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const slides = [
  "Capturing Moments,\nCreating Memories",
  "Connecting Alumni,\nBuilding Futures",
  "Every Graduate,\nA Story Worth Sharing"
];

const RegisterPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simple password strength checker
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength += 1;
      if (/[A-Z]/.test(formData.password)) strength += 1;
      if (/[0-9]/.test(formData.password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    if (!formData.agreeTerms) {
      alert("You must agree to the terms and conditions");
      return;
    }

    try {
      const response = await axios.post(
        "https://alumini-connect-backend.vercel.app/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(response);
      alert("Registration successful!");
      navigate("/login");

    } catch (error) {
      console.error("Error:", error);
      const message = error.response?.data?.message || "Something went wrong.";
      alert(message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 absolute inset-0 bg-[url('https://www.dsu.edu.in/images/Admission/admission_page_img.jpg')] bg-cover bg-center p-4 mt-15">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl mt-30 ">
        {/* Left Side - Image with Overlay */}
        <div className="hidden md:block md:w-1/2 relative bg-blac k">
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[url('https://www.dsu.edu.in/images/Admission/admission_page_img.jpg')] bg-cover bg-center"></div>
          
          <div className="relative z-20 h-full flex flex-col justify-between p-8 text-white">
            <div className="flex justify-between items-center">
              <div className="font-bold text-2xl">Alumni Connect</div>
              <button className="text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition">
                Back to website →
              </button>
            </div>
            
            <div className="mb-10 transition-all duration-500 max-w-md">
              <h2 className="text-3xl md:text-5xl font-bold whitespace-pre-line mb-6">
                {slides[currentSlide]}
              </h2>
              <p className="text-white/80 text-lg mb-6">
                Join our community of alumni and create a network that lasts a lifetime.
              </p>
              <div className="flex gap-2 mt-4">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 transition-all duration-300 rounded-full ${
                      i === currentSlide ? "w-8 bg-white" : "w-4 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12">
          <div className="max-w-sm mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              Create an account
            </h1>
            <p className="text-gray-500 mb-8">
              Already have an account?{" "}
              <a href="/login" className="text-indigo-600 font-medium hover:text-indigo-800 transition">
                Sign in
              </a>
            </p>

            {/* Social Registration Buttons */}
            <div className="flex gap-4 mb-8">
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#4285F4">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-gray-600 font-medium">Google</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.498 18.207C15.885 19.126 15.215 20.096 14.191 20.117C13.166 20.138 12.825 19.520 11.652 19.520C10.479 19.520 10.107 20.096 9.147 20.138C8.156 20.181 7.385 19.094 6.762 18.186C5.472 16.329 4.514 12.856 5.865 10.481C6.536 9.298 7.725 8.585 9.007 8.564C9.991 8.543 10.932 9.225 11.559 9.225C12.186 9.225 13.314 8.416 14.516 8.564C15.033 8.585 16.382 8.776 17.283 10.099C17.210 10.141 15.495 11.153 15.516 13.292C15.537 15.901 17.736 16.703 17.753 16.713C17.747 16.745 17.46 17.749 16.498 18.207ZM13.191 6.123C13.735 5.462 14.112 4.561 14.006 3.659C13.226 3.701 12.287 4.172 11.722 4.833C11.219 5.420 10.757 6.352 10.884 7.223C11.738 7.286 12.647 6.784 13.191 6.123Z" />
                </svg>
                <span className="text-gray-600 font-medium">Apple</span>
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="text-gray-500 text-sm">OR REGISTER WITH EMAIL</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                        <line x1="2" y1="2" x2="22" y2="22"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1">
                      <div className={`flex-1 rounded-full ${passwordStrength >= 1 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                      <div className={`flex-1 rounded-full ${passwordStrength >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                      <div className={`flex-1 rounded-full ${passwordStrength >= 3 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                      <div className={`flex-1 rounded-full ${passwordStrength >= 4 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    </div>
                    <p className="text-xs mt-1 text-gray-500">
                      {passwordStrength === 0 && "Very weak"}
                      {passwordStrength === 1 && "Weak"}
                      {passwordStrength === 2 && "Fair"}
                      {passwordStrength === 3 && "Good"}
                      {passwordStrength === 4 && "Strong"}
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg bg-gray-50 border text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    Passwords don't match
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-800">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-800">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
              >
                Create account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;