import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Redux/features/auth/authSlice";
import { useTheme } from "../../helper/ThemeProvider";
import ThemeSelector from "../../helper/ThemeSelector";

const Header = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const headerClasses = `bg-${theme.primaryColor}-600 text-white p-4 flex justify-between items-center`;
  const profileButtonClasses = `bg-${theme.primaryColor}-700 text-white px-4 py-2 rounded hover:bg-${theme.primaryColor}-500`;
  const logoutButtonClasses = `bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500`;

  return (
    <header className={headerClasses}>
      <h1 className="text-xl font-bold">My App</h1>
      <div className="flex items-center space-x-4">
        <ThemeSelector />
        <button
          className={profileButtonClasses}
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>
        <button className={logoutButtonClasses} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
