import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user_info");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const getUserDisplayName = (info) => {
    if (!info) return "User";
    return info.given_name || info.name || info.preferred_username || "User";
  };

  const getUserSecondaryInfo = (info) => {
    if (!info) return "";
    return info.email || info.preferred_username || info.family_name || "";
  };

  const getUserInitials = (info) => {
    if (!info) return "U";
    const name = info.name || info.given_name || info.preferred_username || "User";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserInfo();
        console.log("Data Userinfo dari API:", res.data);
        
        if (res.data) {
          setUser(res.data);
          localStorage.setItem("user_info", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Gagal memuat info user:", err);
        if (err.response?.status === 401) {
          console.warn("Sesi habis, silakan login kembali.");
        }
      }
    };
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg px-4 py-2 navbar-custom">
      <div className="d-flex align-items-center justify-content-between w-100">
        <span
          className="navbar-brand navbar-brand-custom text-white fw-bold"
          onClick={() => navigate("/")}
        >
          Setoran App
        </span>

        <div className="d-flex align-items-center gap-3">
          {user && (
            <div className="d-flex align-items-center gap-2 text-white me-1 navbar-user-wrapper">
              <div className="navbar-user-initial d-flex align-items-center justify-content-center">
                {getUserInitials(user)}
              </div>
              <div className="text-end d-none d-md-block">
                <div className="fw-semibold navbar-user-name">Hai, {getUserDisplayName(user)}</div>
                <div className="opacity-75 navbar-user-secondary">{getUserSecondaryInfo(user)}</div>
              </div>
            </div>
          )}

          <button
            className="btn navbar-logout-btn text-white d-flex align-items-center justify-content-center"
            onClick={logout}
            title="Logout"
          >
            <i className="bi bi-box-arrow-right navbar-logout-icon"></i>
          </button>
          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;