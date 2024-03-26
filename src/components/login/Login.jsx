import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Copyright from "../footer/Copyright";
import CustomCheckbox from "../../utils/checkBox";
import { Link, useLocation, useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import Box from "@mui/material/Box";
import { loginApi } from "../../apis/api";

function Login({ isPasswordResetPage }) {
  const url = import.meta.env.VITE_BACKEND_APP_URI
  const navigate = useNavigate();
  let loginInitialData = {
    email: "",
    password: "",
    remeberme: false,
  };
  const [isLoginPage, setisLoginPage] = useState(isPasswordResetPage != true);
  const [loginCred, setLoginCred] = useState(loginInitialData);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const [loginErrors, setLoginErrors] = useState({ email: "", password: "" });
  const [resetPassMail, setResetPassMail] = useState("");
  const [tagLine, setTagLine] = useState(
    "Enter your email address and password to access the admin panel."
  );
  const jsonconfig = {
    headers: {
      "Content-Type": 'multipart/form-data',
    }
  };

  useEffect(() => {
    setisLoginPage(!isPasswordResetPage);
    if (!isLoginPage) {
      setTagLine(
        "Enter your email address and we'll send you an email with instructions to reset your password."
      );
    } else {
      setTagLine(
        "Enter your email address and password to access the admin panel."
      );
    }
  }, [location.pathname, isLoginPage]);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setLoginCred((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear the validation error when the user starts typing
    setLoginErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // login handler
  const loginHandler = async (e) => {
    e.preventDefault();
  
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return email.trim() !== "" && emailRegex.test(email);
    };
  
    const validatePassword = (password) => {
      // const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
      // return password.trim() !== "" && passwordRegex.test(password);
      return true;
    };
  
    // Validate email
    const emailValid = validateEmail(loginCred.email);
  
    // Update errors state for email
    setLoginErrors({
      email: emailValid
        ? ""
        : loginCred.email.trim() === ""
        ? "Email is required"
        : "Invalid email format",
      password: "", // Reset password error when email is being corrected
    });
  
    // If email is valid, check the password
    if (emailValid) {
      const passwordValid = validatePassword(loginCred.password);
  
      // Update errors state for password
      setLoginErrors((prevErrors) => ({
        ...prevErrors,
        password: passwordValid
          ? ""
          : "Password must contain 1 capital letter, 1 special character, 1 number, and be at least 8 characters long",
      }));
  
      // If both email and password are valid, proceed with login
      if (passwordValid) {
        console.log(loginCred);
        try {
          
          const formData = new FormData()
          formData.append("email" , loginCred.email)
          formData.append("password" , loginCred.password)
          const response = await loginApi(formData)
          // Handle successful login response here
         
          if(response.success){
            // redirect to dashboard
            navigate("/home");
          }else{
            setLoginErrors((prevErrors) => ({
              ...prevErrors,
              password: "These credentials do not match our records." 
            }));
            setTimeout(() => {
              setLoginErrors({});
            }, 5000);
          }
          // Navigate to the home page or perform other actions
        } catch (error) {
          // Handle error
          console.error("Error during login:", error);
          // Display error message to the user, e.g., setLoginErrors({ email: "Error occurred during login", password: "" });
        }
      }
    }
  };
  
  return (
    <>
      <div
        className="bg-purplez mainContainer bg-purple min-h-screen"
        style={{ backgroundImage: "url(/bg-pattern.png)" }}
      >
        <Container
          fixed
          className="container mx-auto !flex flex-col relative justify-center"
          maxWidth="sm"
        >
          <Box
            className="login-container flex-col w-4/5 m-auto p-9 bg-white flex justify-center bg-cover rounded mt-20 mb-6"
            style={{ backgroundImage: "url(/bg-pattern-2.png)" }}
          >
            <div className="logoSection w-3/4 text-center m-auto">
              <div>
                <a href="#">
                  <img
                    className="m-auto h-9"
                    src="/logo_full.png"
                    alt="ZendevX"
                  />
                </a>
              </div>
              <p className="mt-6 text-metal mb-3">{tagLine}</p>
            </div>
            {isLoginPage ? (
              // login form section
              <div className="formSection">
                <form onSubmit={loginHandler}>
                  <div className="mb-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email address*
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={loginCred.email}
                      onChange={(e) => handleInputChange(e)}
                      className="block w-full h-[calc(1.5em + 0.9rem + 2px)] px-4 py-2 text-sm font-normal leading-5 text-gray-700 bg-white border border-solid border-#ced4da rounded focus:outline-none focus:ring focus:border-blue-500 transition duration-150 ease-in-out"
                    />
                    {loginErrors.email && (
                      <p className="text-[#F61717] text-sm mt-1">
                        {loginErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="mb-2 relative">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password*
                    </label>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginCred.password}
                      onChange={(e) => handleInputChange(e)}
                      className="block w-full h-[calc(1.5em + 0.9rem + 2px)] px-4 py-2 text-sm font-normal leading-5 text-gray-700 bg-white border border-solid border-#ced4da rounded focus:outline-none focus:ring focus:border-blue-500 transition duration-150 ease-in-out"
                    />
                    <span
                      className="absolute right-4 cursor-pointer"
                      style={{ top: "45%", right: "0" }}
                      onClick={togglePasswordVisibility}
                    >
                      <div className="flex items-center py-2 px-4 mb-0 text-sm font-normal leading-5 bg-#f7f7f7 border border-#ced4da rounded-r-sm  ">
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </div>
                    </span>
                  </div>
                  {loginErrors.password && (
                    <p className="text-[#F61717] text-sm mt-1">
                      {loginErrors.password}
                    </p>
                  )}
                  <div className="flex items-center mb-4 -ml-2">
                    <CustomCheckbox
                      onChange={(e) => handleInputChange(e)}
                      name="remeberme"
                    />
                    <span className="ml-2 text-metal">Remember me</span>
                  </div>
                  <button
                    className="bg-purple text-white font-bold py-2 px-4 rounded-sm w-full hover:bg-dark-purple "
                    type="submit"
                  >
                    Log in
                  </button>
                </form>
              </div>
            ) : (
              // forgot password form start here
              <div className="formSection">
                <form>
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email address*
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={resetPassMail}
                      onChange={(e) => setResetPassMail(e.target.value)}
                      className="block w-full h-[calc(1.5em + 0.9rem + 2px)] px-4 py-2 text-sm font-normal leading-5 text-gray-700 bg-white border border-solid border-#ced4da rounded focus:outline-none focus:ring focus:border-blue-500 transition duration-150 ease-in-out"
                    />
                    {loginErrors.email && (
                      <p className="text-[#F61717] text-sm mt-1">
                        {loginErrors.email}
                      </p>
                    )}
                  </div>
                  <button
                    className="bg-purple text-white font-bold py-2 px-4 rounded-sm w-full hover:bg-dark-purple "
                    type="submit"
                  >
                    Reset Password
                  </button>
                </form>
              </div>
            )}
          </Box>
          {isLoginPage ? (
            <div className="secondBox flex justify-center">
              <Link to="/password/reset" style={{ color: "#ffffff80" }}>
                Forgot your password?
              </Link>
            </div>
          ) : (
            ""
          )}
        </Container>
      </div>
      <Copyright />
      {/* copyright section */}
    </>
  );
}

export default Login;
