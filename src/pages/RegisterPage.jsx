import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiConfig from "../utils/apiConfig";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post(apiConfig.register, {
        name,
        email,
        password,
        phone,
        role: "customer",
      });

      const { user, token } = response.data;
      login({ ...user, token });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full">
        {/* Logo and branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5DAA80] mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">Q</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#261F11]">Q-Tasty</h1>
          <p className="text-gray-500 mt-1">Delicious food, delivered fast</p>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5DAA80] to-[#68B48D] py-6 px-8 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAC849] opacity-10 rounded-bl-full"></div>
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="text-white text-opacity-90 mt-2">
              Join Q-Tasty and start ordering your favorite meals
            </p>
          </div>

          {/* Form section */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border-l-4 border-[#F15D36] animate-pulse">
                <p className="text-[#F15D36] font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Name Input */}
              <div className="input-group">
                <label
                  htmlFor="name"
                  className="block text-[#261F11] font-medium mb-1 text-sm"
                >
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5DAA80] focus:border-transparent transition duration-200 bg-gray-50 group-hover:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="input-group">
                <label
                  htmlFor="email"
                  className="block text-[#261F11] font-medium mb-1 text-sm"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5DAA80] focus:border-transparent transition duration-200 bg-gray-50 group-hover:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="input-group">
                <label
                  htmlFor="password"
                  className="block text-[#261F11] font-medium mb-1 text-sm"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-3 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5DAA80] focus:border-transparent transition duration-200 bg-gray-50 group-hover:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#5DAA80]"
                  >
                    {passwordVisible ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>

              {/* Phone Input */}
              <div className="input-group">
                <label
                  htmlFor="phone"
                  className="block text-[#261F11] font-medium mb-1 text-sm"
                >
                  Phone Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="(123) 456-7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5DAA80] focus:border-transparent transition duration-200 bg-gray-50 group-hover:bg-white"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">For delivery notifications</p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 px-6 bg-gradient-to-r from-[#F15D36] to-[#F17036] text-white rounded-lg font-bold hover:shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#F15D36] focus:ring-opacity-50 transform hover:-translate-y-0.5 ${
                    loading ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>

             
              
              {/* Additional footer with login link */}
              <div className="text-center mt-6 border-t border-gray-200 pt-5">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#5DAA80] font-medium hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer Banner */}
          <div className="bg-[#FAC849] py-4 px-6">
            <p className="text-[#261F11] text-center text-sm flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              By signing up, you agree to Q-Tasty's Terms & Privacy Policy
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;