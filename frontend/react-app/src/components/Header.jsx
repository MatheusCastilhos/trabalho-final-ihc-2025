// src/components/Header.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logoutUser } from "../api/auth";

export default function Header() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("Usuário");

  useEffect(() => {
    const storedDisplayName = localStorage.getItem("displayName");
    const storedUsername = localStorage.getItem("username");

    if (storedDisplayName && storedDisplayName.trim()) {
      setDisplayName(storedDisplayName);
    } else if (storedUsername && storedUsername.trim()) {
      setDisplayName(storedUsername);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      localStorage.removeItem("displayName");
      navigate("/login");
    }
  };

  return (
    <div
      className="
        flex justify-between items-center
        mb-8
        pt-6 pb-4
        px-2
        rounded-xl
      "
      style={{ marginTop: "10px" }}
    >
      <div className="leading-tight">
        <p className="text-base text-gray-700">Bem-vindo,</p>
        <p className="text-2xl font-semibold text-gray-900">{displayName}</p>
      </div>

      <button
        onClick={handleLogout}
        className="
          px-4 py-2
          rounded-full 
          border border-gray-300 
          text-sm font-semibold
          text-gray-700
          bg-white
          shadow-md
          active:scale-[0.97]
          transition-transform
        "
      >
        Sair
      </button>
    </div>
  );
}