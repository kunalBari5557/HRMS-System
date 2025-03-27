import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom"; // Import Outlet
import { useTheme } from "../../helper/ThemeProvider";
import { useEffect } from "react";

const Layout = () => {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme.isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme.isDarkMode]);

  return (
    <div
      className={`flex h-screen bg-gray-100 dark:bg-gray-900 text-${theme.textColor} dark:text-${theme.darkTextColor}`}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main
          className={`flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800 text-${theme.textColor} dark:text-${theme.darkTextColor}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
