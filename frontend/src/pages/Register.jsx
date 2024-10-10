import React, { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import { Navigate, Link, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginClick = () => {
    navigate("/register"); // Navigate to the notifications page
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doCreateUserWithEmailAndPassword(
          email,
          password,
          name,
          surname,
          dateOfBirth,
          role
        );

        navigate(role === "staff" ? "/home" : "/home");
      } catch (error) {
        setErrorMessage(error.message);
        setIsRegistering(false);
      }
    }
  };

  return (
    <div className="flex">
      <div className="w-full h-full overflow-auto flex flex-col items-center justify-center lg:w-1/2">
        <div className="w-11/12 max-w-[700px] px-10 py-20 rounded-3xl bg-white border-2 border-gray-100">
          <h1 className="text-5xl font-semibold">Sign Up!</h1>
          <p className="font-medium text-lg text-gray-500 mt-4">
            Welcome on board! Please enter your details.
          </p>
          <div className="mt-8">
            <form onSubmit={onSubmit}>
              <div className="flex flex-col">
                <label className="text-lg font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent focus:border-black focus:outline-none"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="flex flex-col mt-4">
                <label className="text-lg font-medium">Surname</label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent focus:border-black focus:outline-none"
                  placeholder="Enter your surname"
                  required
                />
              </div>
              <div className="flex flex-col mt-4">
                <label className="text-lg font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent focus:border-black focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="flex flex-col mt-4">
                <label className="text-lg font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent focus:border-black focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="flex flex-col mt-4">
                <label className="text-lg font-medium">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent focus:border-black focus:outline-none"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <div className="flex flex-col mt-4">
                <label className="text-sm text-gray-600 font-bold">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border rounded-lg"
                  required
                />
              </div>
              <div className="flex flex-col mt-4">
                <label className="text-sm text-gray-600 font-bold">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border rounded-lg"
                >
                  <option value="user">User</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              {errorMessage && (
                <div className="mt-4 text-red-600 font-bold">
                  {errorMessage}
                </div>
              )}

              <div className="mt-8 flex flex-col gap-y-4">
                <button
                  type="submit"
                  disabled={isRegistering}
                  className={`w-full py-4 rounded-xl text-white font-bold text-lg ${
                    isRegistering
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  } transition-all`}
                >
                  {isRegistering ? "Signing Up..." : "Sign Up"}
                </button>
                <button
                  onClick={() => alert("Google sign-up not implemented")}
                  className={`flex items-center justify-center gap-2 py-4 rounded-xl text-gray-700 font-semibold text-lg border-2 border-gray-100 ${
                    isRegistering ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z"
                      fill="#34A853"
                    />
                    <path
                      d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z"
                      fill="#4A90E2"
                    />
                    <path
                      d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z"
                      fill="#FBBC05"
                    />
                  </svg>
                  Sign up with Google
                </button>
              </div>
              <div className="mt-8 flex justify-center items-center">
                <p className="font-medium text-base">Have an account?</p>
                <Link
                  to="/login"
                  className="ml-2 font-medium text-base text-blue-500"
                >
                  Log in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-full lg:w-1/2 h-full items-center justify-center bg-black">
        {" "}
        <img src={logo} alt="Logo" className="w-1/2 h-auto animate-bounce" />
      </div>
    </div>
  );
}

export default Register;
