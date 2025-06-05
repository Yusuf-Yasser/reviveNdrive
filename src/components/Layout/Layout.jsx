import React, { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ThemeContext } from "../../contexts/ThemeContext";

const Layout = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } transition-colors duration-300`}
    >
      <Navbar />
      <main className="flex-grow w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <Footer />

      {/* Floating ChatBot Button */}
      <Link
        to="/chatbot"
        className={`fixed bottom-8 right-8 p-4 rounded-full shadow-xl ${
          isDarkMode
            ? "bg-blue-700 hover:bg-blue-800"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white transition-all duration-300 ease-in-out transform hover:scale-105 z-50 flex items-center gap-2 group`}
      >
        <MessageCircle size={28} className="shrink-0 align-middle" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 ease-in-out whitespace-nowrap">
          Chat with AI
        </span>
      </Link>
    </div>
  );
};

export default Layout;
