import logo from "./logo.svg";
import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useDispatch, useSelector } from "react-redux";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { logoutUser } from "./slices/userSlice";
function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate(); 

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatching the logout action
    // Additional logic for logout, such as redirecting to login page
    navigate("/")
  };

  return (
    <Provider store={store}>
      <div className="App"></div>

      <nav className="bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <span className="font-semibold text-xl">My App</span>
          </div>
          <div className="block">
            <Link
              to="/login"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Register
            </Link>
            <Link
              to="/"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Provider>
  );
}

export default App;
