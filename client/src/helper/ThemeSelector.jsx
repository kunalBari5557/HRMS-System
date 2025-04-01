import { useState } from "react";
import { ChevronDown, Palette, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const ThemeSelector = () => {
  const { theme, currentThemeName, presetThemes, updateTheme, toggleDarkMode } =
    useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors text-white dark:text-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Palette size={18} />
        <span className="hidden md:inline">Theme</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-30 py-1">
            <div className="px-4 py-2 text-sm font-medium border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">
              Color Themes
            </div>
            {Object.keys(presetThemes).map((themeName) => (
              <button
                key={themeName}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  currentThemeName === themeName
                    ? "bg-blue-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    : "hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => {
                  updateTheme(themeName);
                  setIsOpen(false);
                }}
              >
                <span
                  className={`w-3 h-3 rounded-full mr-2 bg-${presetThemes[themeName].primaryColor}-500`}
                />
                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              </button>
            ))}
            <div className="px-4 py-2 text-sm font-medium border-t dark:border-gray-700 text-gray-800 dark:text-gray-200">
              <button
                className="flex items-center justify-between w-full"
                onClick={() => {
                  toggleDarkMode();
                  setIsOpen(false);
                }}
              >
                <span>Dark Mode</span>
                {theme.isDarkMode ? (
                  <Moon size={16} className="text-yellow-400" />
                ) : (
                  <Sun size={16} className="text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
