import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff,
  FiAlertCircle,
  FiLogIn,
  FiGithub,
  FiChrome
} from "react-icons/fi";
import "./Login.css";
import logo from "../assets/smit logo.png";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();

  // Initialize providers
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }

    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Save user info
      localStorage.setItem('user', JSON.stringify({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || formData.email.split('@')[0]
      }));
      
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Invalid email or password";
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email";
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password";
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later";
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled";
      }
      
      setErrors({
        submit: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Add additional scopes if needed
      googleProvider.addScope('profile');
      googleProvider.addScope('email');
      
      // Set custom parameters
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, googleProvider);
      
      // Save user info
      localStorage.setItem('user', JSON.stringify({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      }));

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', result.user.email);
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      
      let errorMessage = "Failed to login with Google";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Login popup was closed";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Login cancelled";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked by browser";
      }
      
      setErrors({
        submit: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      
      // Handle Github login
      const credential = GithubAuthProvider.credentialFromResult(result);
      
      // Save user info
      localStorage.setItem('user', JSON.stringify({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      }));

      navigate("/dashboard");
    } catch (error) {
      console.error("Github login error:", error);
      
      let errorMessage = "Failed to login with Github";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Login popup was closed";
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = "Account already exists with different credentials";
      }
      
      setErrors({
        submit: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header with Saylani Logo */}
        <div className="login-header">
          <div className="logo-container">
            <img src={logo} alt="SMIT Logo" className="logo-img" />
          </div>
          <h1 className="header-title">Welcome Back</h1>
          <p className="header-subtitle">Sign in to your account</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="login-form">
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
                placeholder="Enter your email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                autoComplete="email"
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
                placeholder="Enter your password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="error-message">
                <FiAlertCircle /> {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            
            <button
              type="button"
              onClick={handleForgotPassword}
              className="forgot-password"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="submit-error">
              <FiAlertCircle size={20} />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <>
                <div className="spinner" />
                Signing in...
              </>
            ) : (
              <>
                <FiLogIn /> Sign In
              </>
            )}
          </button>

          {/* Divider */}
          <div className="divider">Or continue with</div>

          {/* Social Login Buttons */}
          <div className="social-login">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="social-button google"
            >
              <FiChrome size={20} />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={loading}
              className="social-button github"
            >
              <FiGithub size={20} />
              <span>Github</span>
            </button>
          </div>

          {/* Signup Link */}
          <div className="signup-link">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link-text">
                Create Account
              </Link>
            </p>
          </div>

          {/* Terms and Conditions */}
          <div className="terms-text">
            By signing in, you agree to our{" "}
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

export default Login;