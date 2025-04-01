import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Settings, Grid, FileText } from "lucide-react";
import logo from "../../assets/img/logo.webp";
import { useTheme } from "../../helper/ThemeProvider";

const Sidebar = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarClasses = `fixed top-0 left-0 h-full bg-gradient-to-b from-${
    theme.primaryColor
  }-700 to-${
    theme.primaryColor
  }-800 text-white transition-all duration-300 ease-in-out z-40 shadow-lg ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  } md:translate-x-0 md:relative ${isCollapsed ? "w-20" : "w-64"}`;

  const linkHoverClass = `hover:bg-${theme.primaryColor}-600`;

  return (
    <>
      {/* Mobile Toggle Button - Always visible on mobile */}
      <button
        className={`md:hidden p-2 fixed top-4 left-4 z-50 text-white bg-${theme.primaryColor}-600 rounded-full shadow-lg`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={sidebarClasses}>
        {/* Logo and Collapse Button Container */}
        <div
          className={`flex ${
            isCollapsed ? "flex-col" : "flex-row"
          } items-center justify-between p-4 h-16`}
        >
          {/* Logo - Center when collapsed */}
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center w-full" : ""
            }`}
          >
            <img
              src={logo}
              alt="Logo"
              className="rounded-full w-10 h-10 object-cover"
            />
            {!isCollapsed && (
              <span className="ml-3 font-semibold text-lg">MyApp</span>
            )}
          </div>

          {/* Desktop Toggle Button - Only visible on desktop */}
          {!isCollapsed && (
            <button
              className="hidden md:block text-white hover:bg-white/10 p-1 rounded-full"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label="Collapse sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="mt-2 overflow-y-auto h-[calc(100vh-64px)]">
          <SidebarLink
            to="/dashboard"
            icon={<Grid size={isCollapsed ? 22 : 20} />}
            text="Dashboard"
            isCollapsed={isCollapsed}
            hoverClass={linkHoverClass}
          />
          <SidebarLink
            to="/my-attendance"
            icon={<Grid size={isCollapsed ? 22 : 20} />}
            text="My Attendance"
            isCollapsed={isCollapsed}
            hoverClass={linkHoverClass}
          />
          <SidebarLink
            to="/profile"
            icon={<FileText size={isCollapsed ? 22 : 20} />}
            text="Profile"
            isCollapsed={isCollapsed}
            hoverClass={linkHoverClass}
          />
          <SidebarLink
            to="/settings"
            icon={<Settings size={isCollapsed ? 22 : 20} />}
            text="Settings"
            isCollapsed={isCollapsed}
            hoverClass={linkHoverClass}
          />
        </nav>

        {/* Collapse Button - Only visible when sidebar is collapsed on desktop */}
        {isCollapsed && (
          <button
            className="hidden md:block absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white hover:bg-white/10 p-2 rounded-full"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Expand sidebar"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

const SidebarLink = ({ to, icon, text, isCollapsed, hoverClass }) => (
  <Link
    to={to}
    className={`flex items-center py-3 px-4 ${hoverClass} rounded-lg mx-2 my-1 transition-all text-white hover:text-white ${
      isCollapsed ? "justify-center" : "space-x-3"
    }`}
    title={isCollapsed ? text : ""} // Show tooltip when collapsed
  >
    <span className="flex-shrink-0">{icon}</span>
    {!isCollapsed && <span className="text-sm font-medium">{text}</span>}
  </Link>
);

export default Sidebar;
