import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiMail, 
  FiLock, 
  FiUser, 
  FiEye, 
  FiEyeOff,
  FiAlertCircle 
} from "react-icons/fi";
import "./Signup.css"; // Import CSS file
import logo from "../assets/smit logo.png";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.match(/[a-z]/)) strength++;
    if (pass.match(/[A-Z]/)) strength++;
    if (pass.match(/[0-9]/)) strength++;
    if (pass.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === "password") {
      calculatePasswordStrength(value);
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = err.message;
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Password is too weak";
      }
      
      setErrors({
        submit: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const getStrengthClass = () => {
    if (passwordStrength <= 2) return "weak";
    if (passwordStrength <= 4) return "medium";
    return "strong";
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Header with Saylani Logo */}
        <div className="signup-header">
          <div className="logo-container">
          <img src={logo} alt="SMIT Logo" className="logo-img" />
          </div>
          <h1 className="header-title">Create Account</h1>
          <p className="header-subtitle">Join Saylani Mass IT Family</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSignup} className="signup-form">
          {/* Full Name Field */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-wrapper">
              {/* <FiUser className="input-icon" /> */}
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`form-input ${errors.fullName ? 'error' : ''}`}
              />
            </div>
            {errors.fullName && (
              <p className="error-message">
                <FiAlertCircle /> {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              {/* <FiMail className="input-icon" /> */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="error-message">
                <FiAlertCircle /> {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              {/* <FiLock className="input-icon" /> */}
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`form-input ${errors.password ? 'error' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-button"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="strength-meter">
                <div className="strength-bar">
                  <div 
                    className={`strength-bar-fill ${getStrengthClass()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <p className={`strength-text ${getStrengthClass()}`}>
                  Password Strength: {getStrengthClass().charAt(0).toUpperCase() + getStrengthClass().slice(1)}
                </p>
              </div>
            )}

            {errors.password && (
              <p className="error-message">
                <FiAlertCircle /> {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrapper">
              {/* <FiLock className="input-icon" /> */}
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="eye-button"
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="error-message">
                <FiAlertCircle /> {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="submit-error">
              <FiAlertCircle size={20} />
              <span style={{ fontSize: "14px" }}>{errors.submit}</span>
            </div>
          )}

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <>
                <div className="spinner" />
                Creating Account...
              </>
            ) : (
              <>
                <FiUser /> Create Account
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="login-link">
            <p>
              Already have an account?{" "}
              <Link to="/login">
                Sign In
              </Link>
            </p>
          </div>

          {/* Terms and Conditions */}
          <div className="terms-text">
            By creating an account, you agree to our{" "}
            <a href="#" className="terms-link">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="terms-link">
              Privacy Policy
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;