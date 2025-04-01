import { createContext, useContext, useState, useEffect } from "react";

const presetThemes = {
  blue: {
    primaryColor: "blue",
    secondaryColor: "indigo",
    textColor: "gray-800",
    darkTextColor: "gray-100",
    isDarkMode: false,
  },
  indigo: {
    primaryColor: "indigo",
    secondaryColor: "blue",
    textColor: "gray-800",
    darkTextColor: "gray-100",
    isDarkMode: false,
  },
  red: {
    primaryColor: "red",
    secondaryColor: "orange",
    textColor: "gray-800",
    darkTextColor: "gray-100",
    isDarkMode: false,
  },
  green: {
    primaryColor: "green",
    secondaryColor: "teal",
    textColor: "gray-800",
    darkTextColor: "gray-100",
    isDarkMode: false,
  },
  dark: {
    primaryColor: "gray",
    secondaryColor: "gray",
    textColor: "gray-100",
    darkTextColor: "gray-100",
    isDarkMode: true,
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize state from localStorage or use default
  const [theme, setTheme] = useState(() => {
    const savedTheme =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    return savedTheme ? JSON.parse(savedTheme) : presetThemes.blue;
  });

  const [currentThemeName, setCurrentThemeName] = useState(() => {
    const savedThemeName =
      typeof window !== "undefined" ? localStorage.getItem("themeName") : null;
    return savedThemeName || "blue";
  });

  // Update localStorage whenever theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", JSON.stringify(theme));
      localStorage.setItem("themeName", currentThemeName);
    }
  }, [theme, currentThemeName]);

  const updateTheme = (themeName) => {
    const newTheme = presetThemes[themeName];
    setTheme(newTheme);
    setCurrentThemeName(themeName);

    // Also update localStorage immediately
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", JSON.stringify(newTheme));
      localStorage.setItem("themeName", themeName);
    }
  };

  const toggleDarkMode = () => {
    setTheme((prev) => {
      const updatedTheme = {
        ...prev,
        isDarkMode: !prev.isDarkMode,
      };
      // Update localStorage immediately
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", JSON.stringify(updatedTheme));
      }
      return updatedTheme;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentThemeName,
        presetThemes,
        updateTheme,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
